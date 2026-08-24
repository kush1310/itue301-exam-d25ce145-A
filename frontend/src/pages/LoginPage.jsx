/**
 * LoginPage Component
 *
 * Provides customer and administrative authentication interface
 * with validation, error messaging, and demo credential pre-fill utilities.
 */

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Mail, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('kush@charusat.edu.in');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const from = location.state?.from?.pathname || '/order';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const result = await login(email, password);

    if (result.success) {
      setLoading(false);
      navigate(from, { replace: true });
    } else {
      setErrorMessage(result.message || 'Invalid credentials provided.');
      setLoading(false);
    }
  };

  const fillCustomerCredentials = () => {
    setEmail('kush@charusat.edu.in');
    setPassword('password123');
    setErrorMessage(null);
  };

  const fillAdminCredentials = () => {
    setEmail('admin@quickbite.com');
    setPassword('adminpassword123');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        {/* Card Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 mx-auto flex items-center justify-center">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Account Login
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to access protected ordering and restaurant management
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Demo Quick-Fill Buttons */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
          <span className="text-slate-400 font-semibold block text-[11px] uppercase tracking-wider">
            Quick-Fill Demo Credentials:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={fillCustomerCredentials}
              className="flex-1 py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-orange-500/50 transition-colors text-center"
            >
              Customer (Kush)
            </button>
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="flex-1 py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-orange-500/50 transition-colors text-center"
            >
              Admin User
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="login-email-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="login-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@charusat.edu.in"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="login-password-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            id="login-submit-button"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? (
              <LoadingSpinner message="Authenticating..." />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to QuickBite</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          ITUE301 Set A Practical Exam · Authentication Subsystem
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
