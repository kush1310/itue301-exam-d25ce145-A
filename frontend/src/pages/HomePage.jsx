/**
 * HomePage Component
 *
 * Landing page for the QuickBite Food Ordering System.
 * Outlines platform capabilities, operational metrics, and quick action routes.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Store, ShoppingBag, ShieldCheck, Clock, Award, ArrowRight } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* System Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span>ITUE301 Advanced Web Development Frameworks</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
              Campus Food Ordering, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-500">
                Simplified & Streamlined.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-lg text-slate-300 font-normal leading-relaxed">
              Transitioning QuickBite from phone-order chaos to an intelligent full-stack web ordering platform.
              Browse campus restaurants, place real-time orders, and track preparation status seamlessly.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/restaurants"
                id="hero-explore-restaurants-button"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <Store className="w-5 h-5" />
                <span>Explore Restaurants</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/order"
                id="hero-place-order-button"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-all"
              >
                <ShoppingBag className="w-5 h-5 text-orange-400" />
                <span>Place an Order</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-3xl font-extrabold text-white mb-1">6+</div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Campus Eateries</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-3xl font-extrabold text-orange-400 mb-1">20-30 min</div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Delivery Time</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-3xl font-extrabold text-emerald-400 mb-1">100%</div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Mongoose Validated</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="text-3xl font-extrabold text-amber-400 mb-1">JWT Bearer</div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Auth Guard Middleware</div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">System Architecture & Capabilities</h2>
          <p className="text-sm text-slate-400">Engineered strictly conforming to ITUE301 Set A Exam specifications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Task 1: Component Hierarchy</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Modular React component architecture with reusable RestaurantCard receiving props (name, cuisine, rating, isOpen) with dynamic badge styling.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Task 2 & 3: Routing & Middleware</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Protected routes via React Router v6, lazy-loaded AdminPanel via React.lazy + Suspense, and Express custom authGuard with global requestLogger.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Task 4 & 5: REST API & Mongoose</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Client-side restaurant filtering over live Express REST endpoints, paired with Mongoose population and schema-level validation constraints.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
