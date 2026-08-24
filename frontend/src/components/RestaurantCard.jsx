/**
 * RestaurantCard Component (Task 1 — Zomato Design System)
 *
 * Reusable card component rendering individual restaurant details:
 * - Card: Background #ffffff, Border #f4f4f2, Radius 16px
 * - The Rating Chip: High-contrast green box #24963f
 * - Typography: Mine Shaft #2d2d2d & Muted #828282
 * - Action: Zomato Red #cb202d
 *
 * @param {Object} props
 * @param {string} props.name     - Name of the restaurant
 * @param {string} props.cuisine  - Cuisine type/specialty
 * @param {number} props.rating   - Numerical rating (0.0 to 5.0)
 * @param {boolean} props.isOpen  - Operational status flag
 * @param {string} [props._id]    - Optional restaurant identifier for direct navigation
 * @param {Function} [props.onSelect] - Optional selection callback
 * @returns {JSX.Element}
 */

import React from 'react';
import { Star, Utensils, CheckCircle2, XCircle, ArrowRight, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ name, cuisine, rating, isOpen, _id, onSelect }) => {
  const numericRating = typeof rating === 'number' ? rating.toFixed(1) : '4.0';

  return (
    <div className="group relative flex flex-col justify-between bg-white border border-[#f4f4f2] hover:border-[#e8e8e8] rounded-[16px] p-5 shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div>
        {/* Top Header: Restaurant Name & Operational Status Badge */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-[17px] font-bold text-[#2d2d2d] group-hover:text-[#cb202d] transition-colors line-clamp-1">
            {name || 'Unnamed Restaurant'}
          </h3>

          {/* Dynamic Open / Closed Status Badge (Task 1 Requirement) */}
          {isOpen ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#edf7ed] text-[#24963f] border border-[#c8e6c9] whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Open Now</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fef2f2] text-[#cb202d] border border-[#fecaca] whitespace-nowrap">
              <XCircle className="w-3.5 h-3.5" />
              <span>Closed</span>
            </span>
          )}
        </div>

        {/* Cuisine Specialty */}
        <div className="flex items-center gap-2 text-[#828282] text-[13px] mb-3 font-medium">
          <Utensils className="w-3.5 h-3.5 text-[#cb202d] shrink-0" />
          <span className="line-clamp-1">{cuisine || 'Multi-Cuisine'}</span>
        </div>

        {/* Delivery & Campus Metadata */}
        <div className="flex items-center gap-2.5 text-[12px] text-[#828282] mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>20–30 mins</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>CHARUSAT Campus</span>
          </div>
        </div>
      </div>

      {/* Card Footer: The Zomato Rating Chip and Order Action */}
      <div className="pt-3 border-t border-[#f4f4f2] flex items-center justify-between">
        {/* The Rating Chip: Official Zomato Green Box #24963f */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-[#24963f] text-white font-bold text-[12px] shadow-xs">
          <span>{numericRating}</span>
          <Star className="w-3 h-3 fill-white text-white" />
        </div>

        {/* Action Button */}
        {_id ? (
          <Link
            to={`/order?restaurantId=${_id}&restaurantName=${encodeURIComponent(name)}`}
            className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-3.5 py-1.5 rounded-[8px] transition-all ${
              isOpen
                ? 'bg-[#fef2f2] text-[#cb202d] hover:bg-[#cb202d] hover:text-white border border-[#fecaca]'
                : 'bg-[#f4f4f2] text-[#828282] cursor-not-allowed border border-[#e8e8e8]'
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
          <span className="text-[12px] font-semibold text-[#828282]">QuickBite Partner</span>
        )}
      </div>
    </div>
  );
};

export default RestaurantCard;
