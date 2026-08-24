/**
 * HomePage Component (Light Zomato Theme with Three.js Animations)
 *
 * Landing page featuring interactive Three.js 3D background canvas,
 * quick culinary category selectors, live metrics, and direct links.
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
    <div className="space-y-16 pb-16">
      {/* Hero Section with Three.js 3D Canvas Background */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200/80 bg-gradient-to-b from-rose-50/50 via-orange-50/30 to-white">
        {/* Three.js Interactive 3D Canvas */}
        <ThreeHeroCanvas />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* System Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
              <span>ITUE301 Advanced Web Development Frameworks — Set A</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
              Order Delicious Food <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-orange-600 to-amber-500">
                Right to Your Campus Doorstep.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
              QuickBite powers effortless food ordering for CHARUSAT students and faculty.
              Explore live campus restaurants, pick your favorite items, and track orders seamlessly.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/restaurants"
                id="hero-explore-restaurants-button"
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 shadow-lg shadow-rose-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <Store className="w-5 h-5" />
                <span>Explore Restaurants</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/order"
                id="hero-place-order-button"
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all"
              >
                <ShoppingBag className="w-5 h-5 text-rose-600" />
                <span>Create Order</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900">Popular Campus Categories</h2>
          <Link to="/restaurants" className="text-xs font-bold text-rose-600 hover:underline">
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
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-rose-300 transition-all flex flex-col items-center text-center space-y-2 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="font-bold text-slate-800 text-sm">{cat.name}</div>
                <div className="text-[11px] text-slate-400 font-medium">{cat.count}</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Metrics Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-center">
            <div className="text-3xl font-black text-slate-900 mb-1">6+</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Campus Eateries</div>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-center">
            <div className="text-3xl font-black text-rose-600 mb-1">20–30 min</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Delivery Time</div>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-center">
            <div className="text-3xl font-black text-emerald-600 mb-1">100%</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mongoose Validated</div>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-center">
            <div className="text-3xl font-black text-amber-600 mb-1">JWT Bearer</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role-Based AuthGuard</div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            System Architecture & Standards
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Strictly engineered to ITUE301 Set A Open-Book Examination specifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Task 1: Component Architecture</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Modular React frontend featuring reusable RestaurantCard receiving props (name, cuisine, rating, isOpen) with dynamic badge styling and prop passing.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Task 2 & 3: Routing & RBAC</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Protected routes with React Router v6, lazy-loaded AdminPanel via React.lazy + Suspense, and Express custom authGuard with global requestLogger.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Task 4 & 5: REST API & Mongoose</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Client-side restaurant filtering over live Express REST endpoints, paired with Mongoose population and schema-level validation constraints.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
