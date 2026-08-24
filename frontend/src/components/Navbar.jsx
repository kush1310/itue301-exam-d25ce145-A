/**
 * Navbar Component (Light Zomato Theme)
 *
 * Primary navigation header for QuickBite with light aesthetics,
 * React Router NavLink components without full-page reloads,
 * plain styled text branding without AI abbreviation badges,
 * and role-aware navigation controls.
 */

import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, ShieldAlert, ShoppingBag, Store, Home, LogIn, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { customer, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-rose-50 text-rose-600 border border-rose-200/80 shadow-sm'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name (Plain Styled Text Only) */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-600 to-orange-500 text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
                Quick<span className="text-rose-600">Bite</span>
              </span>
              <span className="text-[10px] tracking-wider text-slate-400 uppercase font-semibold">
                Campus Food Ordering
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={navLinkStyle}>
              <Home className="w-4 h-4" />
              <span>Home</span>
            </NavLink>
            <NavLink to="/restaurants" className={navLinkStyle}>
              <Store className="w-4 h-4" />
              <span>Restaurants</span>
            </NavLink>
            <NavLink to="/order" className={navLinkStyle}>
              <ShoppingBag className="w-4 h-4" />
              <span>Place Order</span>
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={navLinkStyle}>
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Panel</span>
              </NavLink>
            )}
          </nav>

          {/* User Auth Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
                  <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs">
                    {customer?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800">{customer?.name}</span>
                    <span className="text-[10px] font-semibold text-rose-600">{customer?.role || 'Customer'}</span>
                  </div>
                </div>
                <button
                  id="navbar-logout-button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                id="navbar-login-link"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 shadow-md shadow-rose-500/20 transition-all hover:shadow-rose-500/30"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
