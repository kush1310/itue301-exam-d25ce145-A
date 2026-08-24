/**
 * Navbar Component (Official Zomato Design System)
 *
 * Primary navigation header for QuickBite conforming to Zomato Design System:
 * - Background: #ffffff, Border: #f4f4f2
 * - Brand Action: #cb202d (Zomato Red)
 * - Text: #2d2d2d (Mine Shaft), Muted: #828282
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
    `flex items-center gap-2 px-3.5 py-2 rounded-[8px] text-[14px] font-semibold transition-colors duration-150 ${
      isActive
        ? 'bg-[#fef2f2] text-[#cb202d] border border-[#fecaca]'
        : 'text-[#2d2d2d] hover:text-[#cb202d] hover:bg-[#f4f4f2]'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#f4f4f2] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Name (Plain Styled Text Only — Zero Emojis / Badges) */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-[12px] bg-[#cb202d] text-white shadow-md shadow-[#cb202d]/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight text-[#2d2d2d] font-sans">
                Quick<span className="text-[#cb202d]">Bite</span>
              </span>
              <span className="text-[10px] tracking-wider text-[#828282] uppercase font-semibold">
                Campus Food Delivery
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
              <span>Order Food</span>
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={navLinkStyle}>
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Portal</span>
              </NavLink>
            )}
          </nav>

          {/* User Auth Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-[#f4f4f2] border border-[#e8e8e8]">
                  <div className="w-6 h-6 rounded-[6px] bg-[#cb202d] text-white flex items-center justify-center font-bold text-xs">
                    {customer?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-[#2d2d2d]">{customer?.name}</span>
                    <span className="text-[10px] font-semibold text-[#cb202d]">{customer?.role || 'Customer'}</span>
                  </div>
                </div>
                <button
                  id="navbar-logout-button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-[8px] text-xs font-bold text-[#cb202d] hover:bg-[#cb202d] hover:text-white border border-[#cb202d]/30 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                id="navbar-login-link"
                className="flex items-center gap-2 px-4 py-2 rounded-[8px] text-xs font-bold text-white bg-[#cb202d] hover:bg-[#a81723] shadow-md shadow-[#cb202d]/20 transition-all hover:shadow-[#cb202d]/30"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
