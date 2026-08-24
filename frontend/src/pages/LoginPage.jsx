/**
 * LoginPage Component (Zomato Design System)
 *
 * Implements strict Role-Based Access Control (RBAC) login tabs:
 * 1. Customer Login (Role = 'Customer')
 * 2. Admin / Partner Portal (Role = 'Admin')
 *
 * Prevents cross-role login attempts with server-side 403 Forbidden enforcement.
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Mail, AlertCircle, ShieldAlert, User } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
      <div className="w-full max-w-md bg-white border border-[#f4f4f2] rounded-[16px] p-8 shadow-sm space-y-6">
        {/* Card Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-[12px] bg-[#fef2f2] text-[#cb202d] mx-auto flex items-center justify-center shadow-xs">
            {activeTab === 'Admin' ? <ShieldAlert className="w-6 h-6" /> : <User className="w-6 h-6" />}
          </div>
          <h1 className="text-2xl font-black text-[#2d2d2d] tracking-tight">
            {activeTab === 'Admin' ? 'Admin & Partner Portal' : 'Customer Sign In'}
          </h1>
          <p className="text-[13px] text-[#828282] font-medium">
            Role-Based Access Control (RBAC) Authentication
          </p>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-2 p-1 bg-[#f4f4f2] rounded-[12px]">
          <button
            type="button"
            id="tab-customer-login"
            onClick={() => handleTabSwitch('Customer')}
            className={`py-2.5 text-[13px] font-bold rounded-[8px] transition-all ${
              activeTab === 'Customer'
                ? 'bg-white text-[#cb202d] shadow-xs'
                : 'text-[#828282] hover:text-[#2d2d2d]'
            }`}
          >
            Customer Login
          </button>
          <button
            type="button"
            id="tab-admin-login"
            onClick={() => handleTabSwitch('Admin')}
            className={`py-2.5 text-[13px] font-bold rounded-[8px] transition-all ${
              activeTab === 'Admin'
                ? 'bg-white text-[#cb202d] shadow-xs'
                : 'text-[#828282] hover:text-[#2d2d2d]'
            }`}
          >
            Admin Portal
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-[12px] bg-[#fef2f2] border border-[#fecaca] flex items-start gap-2.5 text-[13px] text-[#cb202d] font-medium shadow-xs">
            <AlertCircle className="w-4 h-4 text-[#cb202d] shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="login-email-input" className="block text-[12px] font-bold text-[#2d2d2d] uppercase tracking-wider">
              {activeTab} Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#828282]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="login-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@charusat.edu.in"
                className="w-full pl-10 pr-4 py-2.5 bg-[#f4f4f2] border border-[#e8e8e8] rounded-[12px] text-[#2d2d2d] text-[14px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#cb202d]/20 focus:border-[#cb202d] shadow-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="login-password-input" className="block text-[12px] font-bold text-[#2d2d2d] uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#828282]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#f4f4f2] border border-[#e8e8e8] rounded-[12px] text-[#2d2d2d] text-[14px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#cb202d]/20 focus:border-[#cb202d] shadow-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            id="login-submit-button"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[12px] font-bold text-white bg-[#cb202d] hover:bg-[#a81723] shadow-md shadow-[#cb202d]/20 transition-all disabled:opacity-50 text-[14px]"
          >
            {loading ? (
              <LoadingSpinner message="Authenticating..." />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Log In as {activeTab}</span>
              </>
            )}
          </button>
        </form>

        <div className="p-3 rounded-[12px] bg-[#f4f4f2] text-[11px] text-[#828282] text-center font-medium">
          Protected by Role-Based JWT tokens. Cross-role login is strictly blocked.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
