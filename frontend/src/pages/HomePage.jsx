/**
 * HomePage Component (Zomato Design System with Three.js Animations)
 *
 * Landing page featuring interactive Three.js 3D background canvas,
 * Zomato Filter Pills, live metrics, and quick action routes.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import ThreeHeroCanvas from '../components/ThreeHeroCanvas';
import {
  UtensilsCrossed,
  Store,
  ShoppingBag,
  ShieldCheck,
  Clock,
  Award,
  ArrowRight,
  Pizza,
  Coffee,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const HomePage = () => {
  const categories = [
    { name: 'Woodfired Pizza', icon: Pizza, count: 'Italian Bistro' },
    { name: 'Biryani & Tandoor', icon: UtensilsCrossed, count: 'North Indian' },
    { name: 'Dimsum & Noodles', icon: Sparkles, count: 'Asian Express' },
    { name: 'Coffee & Bakes', icon: Coffee, count: 'Campus Cafe' }
  ];

  return (
    <div className="space-y-14 pb-16">
      {/* Hero Section with Three.js 3D Canvas Background */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-26 border-b border-[#f4f4f2] bg-gradient-to-b from-[#fef2f2]/60 via-[#f4f4f2]/40 to-white">
        {/* Three.js Interactive 3D Canvas */}
        <ThreeHeroCanvas />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* System Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[12px] font-bold bg-[#fef2f2] text-[#cb202d] border border-[#fecaca] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#cb202d] animate-ping"></span>
              <span>ITUE301 Advanced Web Development Frameworks — Set A</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#2d2d2d] leading-tight">
              Order Food Online, <br />
              <span className="text-[#cb202d]">
                Campus Delivery at Speed.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-[15px] sm:text-[17px] text-[#828282] font-medium leading-relaxed max-w-2xl mx-auto">
              QuickBite brings your favorite campus eateries directly to your hostel or department.
              Browse live menus, configure custom meals, and track order lifecycles in real time.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/restaurants"
                id="hero-explore-restaurants-button"
                className="flex items-center gap-2 px-7 py-3.5 rounded-[12px] font-bold text-white bg-[#cb202d] hover:bg-[#a81723] shadow-lg shadow-[#cb202d]/25 transition-all transform hover:-translate-y-0.5 text-[14px]"
              >
                <Store className="w-4 h-4" />
                <span>Explore Restaurants</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/order"
                id="hero-place-order-button"
                className="flex items-center gap-2 px-7 py-3.5 rounded-[12px] font-bold text-[#2d2d2d] bg-white hover:bg-[#f4f4f2] border border-[#e8e8e8] shadow-xs transition-all text-[14px]"
              >
                <ShoppingBag className="w-4 h-4 text-[#cb202d]" />
                <span>Create Order</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories — Filter Pills & Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-[#2d2d2d]">Popular Campus Categories</h2>
          <Link to="/restaurants" className="text-[13px] font-bold text-[#cb202d] hover:underline">
            View All Eateries →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                to={`/restaurants?cuisine=${encodeURIComponent(cat.name.split(' ')[0])}`}
                className="p-5 rounded-[16px] bg-white border border-[#f4f4f2] hover:border-[#cb202d]/40 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center space-y-2 group"
              >
                <div className="w-12 h-12 rounded-[12px] bg-[#fef2f2] text-[#cb202d] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="font-bold text-[#2d2d2d] text-[14px]">{cat.name}</div>
                <div className="text-[12px] text-[#828282] font-medium">{cat.count}</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Metrics Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-[16px] bg-white border border-[#f4f4f2] shadow-xs text-center">
            <div className="text-3xl font-black text-[#2d2d2d] mb-1">6+</div>
            <div className="text-[11px] font-bold text-[#828282] uppercase tracking-wider">Campus Eateries</div>
          </div>
          <div className="p-6 rounded-[16px] bg-white border border-[#f4f4f2] shadow-xs text-center">
            <div className="text-3xl font-black text-[#cb202d] mb-1">20–30 min</div>
            <div className="text-[11px] font-bold text-[#828282] uppercase tracking-wider">Avg Delivery Time</div>
          </div>
          <div className="p-6 rounded-[16px] bg-white border border-[#f4f4f2] shadow-xs text-center">
            <div className="text-3xl font-black text-[#24963f] mb-1">100%</div>
            <div className="text-[11px] font-bold text-[#828282] uppercase tracking-wider">Mongoose Validated</div>
          </div>
          <div className="p-6 rounded-[16px] bg-white border border-[#f4f4f2] shadow-xs text-center">
            <div className="text-3xl font-black text-[#cb202d] mb-1">JWT Bearer</div>
            <div className="text-[11px] font-bold text-[#828282] uppercase tracking-wider">Role-Based AuthGuard</div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[#2d2d2d]">
            System Architecture & Practical Tasks
          </h2>
          <p className="text-[13px] text-[#828282] font-medium">
            Strictly engineered to ITUE301 Set A Open-Book Examination specifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-[16px] bg-white border border-[#f4f4f2] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center text-[#cb202d]">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="text-[16px] font-bold text-[#2d2d2d]">Task 1: Component Architecture</h3>
            <p className="text-[13px] text-[#828282] leading-relaxed">
              Modular React frontend featuring reusable RestaurantCard receiving props (name, cuisine, rating, isOpen) with dynamic badge styling.
            </p>
          </div>

          <div className="p-6 rounded-[16px] bg-white border border-[#f4f4f2] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#f4f4f2] border border-[#e8e8e8] flex items-center justify-center text-[#2d2d2d]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-[16px] font-bold text-[#2d2d2d]">Task 2 & 3: Routing & RBAC</h3>
            <p className="text-[13px] text-[#828282] leading-relaxed">
              Protected routes with React Router v6, lazy-loaded AdminPanel via React.lazy + Suspense, and Express custom authGuard with global requestLogger.
            </p>
          </div>

          <div className="p-6 rounded-[16px] bg-white border border-[#f4f4f2] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#edf7ed] border border-[#c8e6c9] flex items-center justify-center text-[#24963f]">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-[16px] font-bold text-[#2d2d2d]">Task 4 & 5: REST API & Mongoose</h3>
            <p className="text-[13px] text-[#828282] leading-relaxed">
              Client-side restaurant filtering over live Express REST endpoints, paired with Mongoose population and schema-level validation constraints.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
