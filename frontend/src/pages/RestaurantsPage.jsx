/**
 * RestaurantsPage Component (Task 4 — Zomato Design System)
 *
 * Retrieves live restaurant records from Express REST API (GET /api/v1/restaurants) on mount via useEffect.
 * Maintains 3 strict states: data (restaurants), loading, and error.
 * Features Zomato Filter Pills and client-side instant search input.
 * Renders data through the reusable RestaurantCard component (Task 1).
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, AlertCircle, RefreshCw, Filter, Sparkles } from 'lucide-react';

const RestaurantsPage = () => {
  const [searchParams] = useSearchParams();
  const initialCuisine = searchParams.get('cuisine') || '';

  // Task 4: Maintain three states — data (restaurants), loading, and error
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Client-side search and filter state
  const [searchTerm, setSearchTerm] = useState(initialCuisine);
  const [selectedFilter, setSelectedFilter] = useState('ALL'); // 'ALL' | 'OPEN' | 'CLOSED'

  /**
   * fetchRestaurants
   * Dispatches GET /api/v1/restaurants via Axios.
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
        setLoading(false);
      })
      .catch((err) => {
        console.error('[RESTAURANTS_FETCH_ERROR]', err);
        const serverError =
          err.response?.data?.error?.message ||
          'Failed to connect to the backend server. Please verify Express API is active.';
        setError(serverError);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Task 4: Client-side search input filters already-fetched array without re-querying API
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-7">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#f4f4f2] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef2f2] text-[#cb202d] text-[12px] font-bold uppercase tracking-wider mb-2 border border-[#fecaca]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Dining Partners</span>
          </div>
          <h1 className="text-3xl font-bold text-[#2d2d2d] tracking-tight">
            Explore Campus Restaurants
          </h1>
          <p className="text-[14px] text-[#828282] mt-1 font-medium">
            Browse live eateries, check operational status, and explore menus at CHARUSAT.
          </p>
        </div>

        {/* Total Count & Refresh Action */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-[12px] bg-white border border-[#e8e8e8] text-[13px] shadow-xs font-semibold text-[#2d2d2d]">
            <span>Partners: </span>
            <span className="font-extrabold text-[#cb202d]">{restaurants.length}</span>
          </div>
          <button
            onClick={fetchRestaurants}
            title="Refresh list from server"
            className="p-2.5 rounded-[12px] bg-white border border-[#e8e8e8] text-[#828282] hover:text-[#2d2d2d] hover:border-[#cb202d] shadow-xs transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#cb202d]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Task 4: Client-side Search and Zomato Filter Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        {/* Search Input */}
        <div className="sm:col-span-8 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#828282]">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="restaurant-search-input"
            type="text"
            placeholder="Search for restaurants or cuisine (e.g. Pizza, Biryani, Pasta, Asian)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#e8e8e8] rounded-[12px] text-[#2d2d2d] placeholder-[#828282] text-[14px] font-medium shadow-xs focus:outline-none focus:ring-2 focus:ring-[#cb202d]/20 focus:border-[#cb202d] transition-all"
          />
        </div>

        {/* Filter Pills (Zomato Style) */}
        <div className="sm:col-span-4 flex items-center gap-1.5 p-1 bg-[#f4f4f2] border border-[#e8e8e8] rounded-[12px]">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`flex-1 py-2 text-[12px] font-bold rounded-[8px] transition-all ${
              selectedFilter === 'ALL'
                ? 'bg-[#cb202d] text-white shadow-xs'
                : 'text-[#2d2d2d] hover:bg-white'
            }`}
          >
            All ({restaurants.length})
          </button>
          <button
            onClick={() => setSelectedFilter('OPEN')}
            className={`flex-1 py-2 text-[12px] font-bold rounded-[8px] transition-all ${
              selectedFilter === 'OPEN'
                ? 'bg-[#24963f] text-white shadow-xs'
                : 'text-[#2d2d2d] hover:bg-white'
            }`}
          >
            Open ({restaurants.filter((r) => r.isOpen).length})
          </button>
          <button
            onClick={() => setSelectedFilter('CLOSED')}
            className={`flex-1 py-2 text-[12px] font-bold rounded-[8px] transition-all ${
              selectedFilter === 'CLOSED'
                ? 'bg-[#cb202d] text-white shadow-xs'
                : 'text-[#2d2d2d] hover:bg-white'
            }`}
          >
            Closed ({restaurants.filter((r) => !r.isOpen).length})
          </button>
        </div>
      </div>

      {/* 1) Task 4: Display Loading Indicator */}
      {loading && (
        <div className="min-h-[40vh] flex items-center justify-center bg-white rounded-[16px] border border-[#f4f4f2] shadow-xs">
          <LoadingSpinner message="Fetching campus eateries from Express REST API..." />
        </div>
      )}

      {/* 2) Task 4: Display Error Message on Request Failure */}
      {!loading && error && (
        <div className="p-6 rounded-[16px] bg-[#fef2f2] border border-[#fecaca] flex items-start gap-4 shadow-xs">
          <AlertCircle className="w-6 h-6 text-[#cb202d] shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <h3 className="text-[15px] font-bold text-[#2d2d2d]">API Connection Error</h3>
            <p className="text-[13px] text-[#828282]">{error}</p>
            <button
              onClick={fetchRestaurants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] text-[12px] font-bold bg-[#cb202d] hover:bg-[#a81723] text-white shadow-xs transition-colors"
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
            <div className="p-12 text-center bg-white rounded-[16px] border border-[#f4f4f2] shadow-xs space-y-3">
              <Filter className="w-8 h-8 text-[#828282] mx-auto" />
              <h3 className="text-[15px] font-bold text-[#2d2d2d]">No matching restaurants found</h3>
              <p className="text-[13px] text-[#828282] font-medium">
                Try adjusting your search keyword "{searchTerm}" or switching the status filter.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedFilter('ALL');
                }}
                className="text-[13px] text-[#cb202d] hover:underline font-bold"
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
