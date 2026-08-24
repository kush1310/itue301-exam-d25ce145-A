/**
 * App Root Component (Task 2 Routing Architecture)
 *
 * Configures client-side routing via React Router DOM v6:
 * - / -> HomePage (Public)
 * - /restaurants -> RestaurantsPage (Public)
 * - /order -> OrderPage (Protected via ProtectedRoute wrapper)
 * - /admin -> AdminPanel (Lazy-loaded via React.lazy + Suspense)
 * - /login -> LoginPage (Public)
 *
 * Incorporates persistent Navbar, Footer, and Toast/Loading wrappers.
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Eagerly loaded components & pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

import HomePage from './pages/HomePage';
import RestaurantsPage from './pages/RestaurantsPage';
import OrderPage from './pages/OrderPage';
import LoginPage from './pages/LoginPage';

// Task 2: Lazy-loaded route for Admin Panel using React.lazy
const LazyAdminPanel = lazy(() => import('./pages/AdminPanel'));

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-white">
      {/* Primary Sticky Header Navigation */}
      <Navbar />

      {/* Main Content Area with Client-Side Routing */}
      <main className="flex-1">
        <Routes>
          {/* Public Home Route */}
          <Route path="/" element={<HomePage />} />

          {/* Public Restaurants Route (Task 4) */}
          <Route path="/restaurants" element={<RestaurantsPage />} />

          {/* Protected Order Route (Task 2) */}
          <Route
            path="/order"
            element={
              <ProtectedRoute>
                <OrderPage />
              </ProtectedRoute>
            }
          />

          {/* Task 2: Lazy-Loaded Admin Route wrapped in React Suspense */}
          <Route
            path="/admin"
            element={
              <Suspense
                fallback={
                  <div className="flex items-center justify-center min-h-[60vh]">
                    <LoadingSpinner message="Asynchronously loading Admin Panel bundle (React.lazy)..." />
                  </div>
                }
              >
                <LazyAdminPanel />
              </Suspense>
            }
          />

          {/* Public Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Fallback Catch-All Navigation */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Academic Footer */}
      <Footer />
    </div>
  );
}

export default App;
