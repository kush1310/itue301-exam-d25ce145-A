/**
 * Navbar Component
 *
 * Primary navigation header for the QuickBite platform.
 * Utilizes React Router NavLink components to prevent full-page reloads,
 * renders plain styled text branding without abbreviation badges,
 * and reflects live customer authentication status with logout controls.
 */

import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtensilsCrossed, ShieldAlert, ShoppingBag, Store, Home, LogIn, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { customer, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
        : 'text-slate-300 hover:text-white hover:bg-slate-800'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name (Plain Styled Text Only) */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                Quick<span className="text-orange-500">Bite</span>
              </span>
              <span className="text-[10px] tracking-wider text-slate-400 uppercase font-medium">
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
            <NavLink to="/admin" className={navLinkStyle}>
              <ShieldAlert className="w-4 h-4" />
              <span>Admin Panel</span>
            </NavLink>
          </nav>

          {/* User Auth Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
                  <User className="w-4 h-4 text-orange-400" />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-200">{customer?.name}</span>
                    <span className="text-[10px] text-slate-400">{customer?.role || 'Customer'}</span>
                  </div>
                </div>
                <button
                  id="navbar-logout-button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:text-white hover:bg-rose-600/20 border border-rose-500/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                id="navbar-login-link"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all hover:shadow-orange-500/40"
              >
                <LogIn className="w-4 h-4" />
                <span>Customer Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
