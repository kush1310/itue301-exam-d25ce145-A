/**
 * LoginPage Component (Role-Segregated Authentication)
 *
 * Implements strict Role-Based Access Control (RBAC) login tabs:
 * 1. Customer Login (Role = 'Customer')
 * 2. Admin / Partner Portal (Role = 'Admin')
 *
 * Enforces server-side and client-side role matching so Customers cannot log in
 * through the Admin portal and vice versa.
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Mail, AlertCircle, ShieldAlert, User, CheckCircle2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Active Login Mode Tab ('Customer' | 'Admin')
  const [activeTab, setActiveTab] = useState('Customer');
  const [email, setEmail] = useState('kush@charusat.edu.in');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const from = location.state?.from?.pathname || (activeTab === 'Admin' ? '/admin' : '/order');

  const handleTabSwitch = (newTab) => {
    setActiveTab(newTab);
    setErrorMessage(null);
    if (newTab === 'Customer') {
      setEmail('kush@charusat.edu.in');
      setPassword('password123');
    } else {
      setEmail('admin@quickbite.com');
      setPassword('adminpassword123');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    // Enforce requiredRole matching active tab to prevent cross-role login
    const result = await login(email, password, activeTab);

    if (result.success) {
      setLoading(false);
      navigate(activeTab === 'Admin' ? '/admin' : from, { replace: true });
    } else {
      setErrorMessage(result.message || 'Authentication failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xl space-y-6">
        {/* Card Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center shadow-xs">
            {activeTab === 'Admin' ? <ShieldAlert className="w-6 h-6" /> : <User className="w-6 h-6" />}
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {activeTab === 'Admin' ? 'Admin / Partner Portal' : 'Customer Sign In'}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Strict Role-Based Access Control (RBAC) Authentication
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            id="tab-customer-login"
            onClick={() => handleTabSwitch('Customer')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'Customer'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Customer Login
          </button>
          <button
            type="button"
            id="tab-admin-login"
            onClick={() => handleTabSwitch('Admin')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'Admin'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Admin Portal
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-700 font-medium shadow-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="login-email-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {activeTab} Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="login-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@charusat.edu.in"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="login-password-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            id="login-submit-button"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 shadow-md shadow-rose-500/20 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? (
              <LoadingSpinner message="Authenticating..." />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In as {activeTab}</span>
              </>
            )}
          </button>
        </form>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 text-center font-medium">
          Protected by Role-Based JWT tokens. Cross-role login is strictly blocked.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
