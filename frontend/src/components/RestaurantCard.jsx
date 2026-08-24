/**
 * RestaurantCard Component (Task 1)
 *
 * Reusable card component rendering individual restaurant details.
 *
 * @param {Object} props
 * @param {string} props.name     - Name of the restaurant
 * @param {string} props.cuisine  - Cuisine type/specialty
 * @param {number} props.rating   - Numerical rating (0.0 to 5.0)
 * @param {boolean} props.isOpen  - Operational status flag
 * @param {string} [props._id]    - Optional restaurant identifier for direct navigation
 * @param {Function} [props.onSelect] - Optional selection callback
 * @returns {JSX.Element}
 * @validates - Handles undefined/null values with fallback defaults.
 */

import React from 'react';
import { Star, Utensils, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ name, cuisine, rating, isOpen, _id, onSelect }) => {
  const numericRating = typeof rating === 'number' ? rating.toFixed(1) : '4.0';

  return (
    <div className="group relative flex flex-col justify-between bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-300">
      <div>
        {/* Top Header: Restaurant Name & Operational Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
            {name || 'Unnamed Restaurant'}
          </h3>
          {/* Dynamic Open / Closed Status Badge */}
          {isOpen ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Open Now</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 whitespace-nowrap">
              <XCircle className="w-3.5 h-3.5" />
              <span>Closed</span>
            </span>
          )}
        </div>

        {/* Cuisine Specialty */}
        <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
          <Utensils className="w-4 h-4 text-orange-400 shrink-0" />
          <span className="line-clamp-1">{cuisine || 'Multi-Cuisine'}</span>
        </div>
      </div>

      {/* Card Footer: Rating and Order Action */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
        {/* Rating Display */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold text-sm">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{numericRating}</span>
          <span className="text-slate-500 text-xs font-normal">/ 5.0</span>
        </div>

        {/* Action Button */}
        {_id ? (
          <Link
            to={`/order?restaurantId=${_id}&restaurantName=${encodeURIComponent(name)}`}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              isOpen
                ? 'bg-orange-500/20 text-orange-300 hover:bg-orange-500 hover:text-white border border-orange-500/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
            onClick={(e) => {
              if (!isOpen) e.preventDefault();
              if (onSelect) onSelect(_id);
            }}
          >
            <span>{isOpen ? 'Order Food' : 'Unavailable'}</span>
            {isOpen && <ArrowRight className="w-3.5 h-3.5" />}
          </Link>
        ) : (
          <span className="text-xs text-slate-500">QuickBite Partner</span>
        )}
      </div>
    </div>
  );
};

export default RestaurantCard;
