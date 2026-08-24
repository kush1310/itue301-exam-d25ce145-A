/**
 * RestaurantCard Component (Task 1 — Light Zomato Style)
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
import { Star, Utensils, CheckCircle2, XCircle, ArrowRight, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ name, cuisine, rating, isOpen, _id, onSelect }) => {
  const numericRating = typeof rating === 'number' ? rating.toFixed(1) : '4.0';

  return (
    <div className="group relative flex flex-col justify-between bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 transform hover:-translate-y-1">
      <div>
        {/* Top Header: Restaurant Name & Operational Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1">
            {name || 'Unnamed Restaurant'}
          </h3>

          {/* Dynamic Open / Closed Status Badge (Task 1 Requirement) */}
          {isOpen ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Open Now</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap">
              <XCircle className="w-3.5 h-3.5" />
              <span>Closed</span>
            </span>
          )}
        </div>

        {/* Cuisine Specialty */}
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-3 font-medium">
          <Utensils className="w-4 h-4 text-rose-500 shrink-0" />
          <span className="line-clamp-1">{cuisine || 'Multi-Cuisine'}</span>
        </div>

        {/* Delivery & Campus Location Tags */}
        <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>20–30 mins</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Changa Campus</span>
          </div>
        </div>
      </div>

      {/* Card Footer: Rating and Order Action */}
      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
        {/* Rating Display */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-xs">
          <span>{numericRating}</span>
          <Star className="w-3 h-3 fill-white text-white" />
        </div>

        {/* Order Action Button */}
        {_id ? (
          <Link
            to={`/order?restaurantId=${_id}&restaurantName=${encodeURIComponent(name)}`}
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all ${
              isOpen
                ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
            onClick={(e) => {
              if (!isOpen) e.preventDefault();
              if (onSelect) onSelect(_id);
            }}
          >
            <span>{isOpen ? 'Order Now' : 'Closed'}</span>
            {isOpen && <ArrowRight className="w-3.5 h-3.5" />}
          </Link>
        ) : (
          <span className="text-xs font-semibold text-slate-400">QuickBite Partner</span>
        )}
      </div>
    </div>
  );
};

export default RestaurantCard;
