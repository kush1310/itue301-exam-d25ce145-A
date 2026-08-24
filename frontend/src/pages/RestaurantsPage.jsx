/**
 * RestaurantsPage Component (Task 4)
 *
 * Fetches restaurant records from the backend Express REST endpoint (GET /api/v1/restaurants)
 * on component mount using useEffect.
 *
 * Implements 3 strict component states:
 * 1. restaurants (data)
 * 2. loading (boolean)
 * 3. error (string | null)
 *
 * Features client-side search input filtering cached restaurants by name or cuisine
 * without issuing redundant network requests.
 * Renders data through the reusable RestaurantCard component (Task 1).
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, AlertCircle, RefreshCw, Filter } from 'lucide-react';

const RestaurantsPage = () => {
  // Task 4: Maintain three states — data (restaurants), loading, and error
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Client-side search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL'); // 'ALL' | 'OPEN' | 'CLOSED'

  /**
   * fetchRestaurants
   *
   * Dispatches GET /api/v1/restaurants via Axios on mount and retry.
   * Ensures loading is set to false in both success and error branches.
   */
  const fetchRestaurants = () => {
    setLoading(true);
    setError(null);

    axios
      .get('/api/v1/restaurants')
      .then((response) => {
        if (response.data && response.data.success) {
          setRestaurants(response.data.data);
        } else {
          setError('Unexpected response format received from server.');
        }
        setLoading(false); // Set loading to false on success
      })
      .catch((err) => {
        console.error('[RESTAURANTS_FETCH_ERROR]', err);
        const serverError =
          err.response?.data?.error?.message ||
          'Failed to connect to the backend server. Please verify Express API is active.';
        setError(serverError);
        setLoading(false); // Set loading to false on error
      });
  };

  // Task 4: useEffect triggers API fetch on initial component mount
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Task 4: Client-side search input filters already-fetched array by name or cuisine without re-querying API
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter === 'OPEN') {
      return matchesSearch && restaurant.isOpen === true;
    }
    if (selectedFilter === 'CLOSED') {
      return matchesSearch && restaurant.isOpen === false;
    }
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Campus Partner Directory
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Explore Restaurants
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse live campus dining partners, check operational status, and explore menus.
          </p>
        </div>

        {/* Stats / Total Count */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm">
            <span className="text-slate-400">Total Partners: </span>
            <span className="font-bold text-white">{restaurants.length}</span>
          </div>
          <button
            onClick={fetchRestaurants}
            title="Refresh list from server"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Task 4: Client-side Search and Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        {/* Search Input */}
        <div className="sm:col-span-8 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-5 h-5" />
          </div>
          <input
            id="restaurant-search-input"
            type="text"
            placeholder="Search by restaurant name or cuisine (e.g. Pizza, Biryani, Asian)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
          />
        </div>

        {/* Operational Filter Switcher */}
        <div className="sm:col-span-4 flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              selectedFilter === 'ALL'
                ? 'bg-orange-500 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({restaurants.length})
          </button>
          <button
            onClick={() => setSelectedFilter('OPEN')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              selectedFilter === 'OPEN'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Open ({restaurants.filter((r) => r.isOpen).length})
          </button>
          <button
            onClick={() => setSelectedFilter('CLOSED')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              selectedFilter === 'CLOSED'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Closed ({restaurants.filter((r) => !r.isOpen).length})
          </button>
        </div>
      </div>

      {/* 1) Task 4: Display Loading Indicator */}
      {loading && (
        <div className="min-h-[40vh] flex items-center justify-center bg-slate-900/40 rounded-2xl border border-slate-800">
          <LoadingSpinner message="Fetching live restaurant catalog from Express API..." />
        </div>
      )}

      {/* 2) Task 4: Display Error Message on Request Failure */}
      {!loading && error && (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <h3 className="text-base font-bold text-rose-300">API Connection Failure</h3>
            <p className="text-sm text-rose-200/80">{error}</p>
            <button
              onClick={fetchRestaurants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Fetching</span>
            </button>
          </div>
        </div>
      )}

      {/* 3) Task 4: Display Restaurant Data Rendered via RestaurantCard on Success */}
      {!loading && !error && (
        <div>
          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant._id}
                  _id={restaurant._id}
                  name={restaurant.name}
                  cuisine={restaurant.cuisine}
                  rating={restaurant.rating}
                  isOpen={restaurant.isOpen}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
              <Filter className="w-8 h-8 text-slate-500 mx-auto" />
              <h3 className="text-base font-semibold text-slate-300">No matching restaurants found</h3>
              <p className="text-xs text-slate-500">
                Try adjusting your search keyword "{searchTerm}" or switching the status filter.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedFilter('ALL');
                }}
                className="text-xs text-orange-400 hover:underline font-semibold"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantsPage;
