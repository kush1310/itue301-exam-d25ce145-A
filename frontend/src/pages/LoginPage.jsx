/**
 * LoginPage Component (Zomato Design System & Multi-Role RBAC)
 *
 * Implements strict Role-Based Access Control (RBAC) login tabs:
 * 1. Customer Login (Role = 'Customer', with quick presets for kush@charusat.edu.in and shah@charusat.edu.in)
 * 2. Restaurant Owner Portal (Role = 'Restaurant Owner', with quick credentials for all 6 canteens)
 * 3. Admin Oversight (Role = 'Admin')
 *
 * Prevents cross-role login attempts with server-side 403 Forbidden enforcement.
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Mail, AlertCircle, ShieldAlert, User, Store, Check } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Active Login Mode Tab ('Customer' | 'Restaurant Owner' | 'Admin')
  const [activeTab, setActiveTab] = useState('Customer');
  const [email, setEmail] = useState('kush@charusat.edu.in');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Customer Presets
  const customerPresets = [
    { name: 'Kush Shah', email: 'kush@charusat.edu.in', pass: 'password123', tag: 'Order History: Pizza & Biryani' },
    { name: 'Shah Kush', email: 'shah@charusat.edu.in', pass: 'password123', tag: 'Order History: Coffee & Dimsums' }
  ];

  // Canteen Owner Presets
  const canteenOwners = [
    { name: 'The Rustic Oven Bistro', email: 'owner.bistro@quickbite.com', pass: 'bistro123' },
    { name: 'Spice Symphony Tandoor', email: 'owner.spice@quickbite.com', pass: 'spice123' },
    { name: 'Zen Dragon Express', email: 'owner.zen@quickbite.com', pass: 'zen123' },
    { name: 'Taco Fiesta Grill', email: 'owner.taco@quickbite.com', pass: 'taco123' },
    { name: 'Campus Brew & Bakery', email: 'owner.brew@quickbite.com', pass: 'brew123' },
    { name: 'The Midnight Kitchen', email: 'owner.midnight@quickbite.com', pass: 'midnight123' }
  ];

  const handleTabSwitch = (newTab) => {
    setActiveTab(newTab);
    setErrorMessage(null);
    if (newTab === 'Customer') {
      setEmail('kush@charusat.edu.in');
      setPassword('password123');
    } else if (newTab === 'Restaurant Owner') {
      setEmail(canteenOwners[0].email);
      setPassword(canteenOwners[0].pass);
    } else {
      setEmail('admin@quickbite.com');
      setPassword('adminpassword123');
    }
  };

  const handleSelectCustomer = (cust) => {
    setEmail(cust.email);
    setPassword(cust.pass);
    setErrorMessage(null);
  };

  const handleSelectCanteenOwner = (owner) => {
    setEmail(owner.email);
    setPassword(owner.pass);
    setErrorMessage(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const result = await login(email, password, activeTab);

    if (result.success) {
      setLoading(false);
      if (activeTab === 'Restaurant Owner') {
        navigate('/owner', { replace: true });
      } else if (activeTab === 'Admin') {
        navigate('/admin', { replace: true });
      } else {
        const from = location.state?.from?.pathname || '/order';
        navigate(from, { replace: true });
      }
    } else {
      setErrorMessage(result.message || 'Authentication failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white border border-[#f4f4f2] rounded-[16px] p-8 shadow-sm space-y-6">
        {/* Card Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-[12px] bg-[#fef2f2] text-[#cb202d] mx-auto flex items-center justify-center shadow-xs">
            {activeTab === 'Admin' ? (
              <ShieldAlert className="w-6 h-6" />
            ) : activeTab === 'Restaurant Owner' ? (
              <Store className="w-6 h-6" />
            ) : (
              <User className="w-6 h-6" />
            )}
          </div>
          <h1 className="text-2xl font-black text-[#2d2d2d] tracking-tight">
            {activeTab === 'Admin'
              ? 'Admin Oversight Portal'
              : activeTab === 'Restaurant Owner'
              ? 'Restaurant Owner Hub'
              : 'Customer Sign In'}
          </h1>
          <p className="text-[13px] text-[#828282] font-medium">
            Strict Role-Based Access Control (RBAC)
          </p>
        </div>

        {/* 3 Role Selection Tabs */}
        <div className="grid grid-cols-3 p-1 bg-[#f4f4f2] rounded-[12px] gap-1">
          <button
            type="button"
            id="tab-customer-login"
            onClick={() => handleTabSwitch('Customer')}
            className={`py-2 text-[12px] font-bold rounded-[8px] transition-all text-center ${
              activeTab === 'Customer'
                ? 'bg-white text-[#cb202d] shadow-xs'
                : 'text-[#828282] hover:text-[#2d2d2d]'
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            id="tab-owner-login"
            onClick={() => handleTabSwitch('Restaurant Owner')}
            className={`py-2 text-[12px] font-bold rounded-[8px] transition-all text-center ${
              activeTab === 'Restaurant Owner'
                ? 'bg-white text-[#cb202d] shadow-xs'
                : 'text-[#828282] hover:text-[#2d2d2d]'
            }`}
          >
            Canteen Owner
          </button>
          <button
            type="button"
            id="tab-admin-login"
            onClick={() => handleTabSwitch('Admin')}
            className={`py-2 text-[12px] font-bold rounded-[8px] transition-all text-center ${
              activeTab === 'Admin'
                ? 'bg-white text-[#cb202d] shadow-xs'
                : 'text-[#828282] hover:text-[#2d2d2d]'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Customer Accounts Quick Select (shown on Customer tab) */}
        {activeTab === 'Customer' && (
          <div className="p-3.5 rounded-[12px] bg-[#f4f4f2] border border-[#e8e8e8] space-y-2">
            <span className="text-[11px] font-bold text-[#828282] uppercase tracking-wider block">
              Select Customer Account:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {customerPresets.map((cust, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectCustomer(cust)}
                  className={`text-left p-2.5 rounded-[10px] text-[11px] font-bold border transition-all ${
                    email === cust.email
                      ? 'bg-white text-[#cb202d] border-[#cb202d] shadow-xs ring-1 ring-[#cb202d]'
                      : 'bg-white text-[#2d2d2d] border-[#e8e8e8] hover:border-[#cb202d]/40'
                  }`}
                >
                  <span className="font-extrabold block text-[#2d2d2d]">{cust.name}</span>
                  <span className="text-[10px] text-[#cb202d] font-mono block">{cust.email}</span>
                  <span className="text-[9px] text-[#828282] block mt-0.5">{cust.tag}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Canteen Owner Quick-Select Preset Chips (shown when Restaurant Owner tab is active) */}
        {activeTab === 'Restaurant Owner' && (
          <div className="p-3.5 rounded-[12px] bg-[#f4f4f2] border border-[#e8e8e8] space-y-2">
            <span className="text-[11px] font-bold text-[#828282] uppercase tracking-wider block">
              Select Canteen Owner Account:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {canteenOwners.map((owner, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectCanteenOwner(owner)}
                  className={`text-left p-2 rounded-[8px] text-[11px] font-bold border transition-colors ${
                    email === owner.email
                      ? 'bg-white text-[#cb202d] border-[#cb202d]'
                      : 'bg-white text-[#2d2d2d] border-[#e8e8e8] hover:border-[#cb202d]/40'
                  }`}
                >
                  <span className="line-clamp-1 block">{owner.name}</span>
                  <span className="text-[10px] text-[#828282] font-mono block">{owner.email}</span>
                </button>
              ))}
            </div>
          </div>
        )}

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
