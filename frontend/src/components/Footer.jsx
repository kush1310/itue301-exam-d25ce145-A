/**
 * Footer Component (Light Zomato Theme)
 *
 * Institutional footer displaying academic details for CSPIT, CHARUSAT.
 */

import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white py-8 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:text-left">
          <p className="font-bold text-slate-800">QuickBite Food Ordering Platform</p>
          <p className="text-slate-400">ITUE301: Advanced Web Development Frameworks — Set A Examination</p>
        </div>
        <div className="text-slate-500 font-mono text-[11px] font-medium">
          CSPIT · CHARUSAT · AY 2026–27
        </div>
      </div>
    </footer>
  );
};

export default Footer;
