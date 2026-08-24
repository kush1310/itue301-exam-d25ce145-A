/**
 * Footer Component
 *
 * Bottom page footer displaying institutional metadata for CSPIT, CHARUSAT.
 */

import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:text-left">
          <p className="font-semibold text-slate-300">QuickBite Food Ordering Platform</p>
          <p className="text-slate-500">ITUE301: Advanced Web Development Frameworks — Set A Examination</p>
        </div>
        <div className="text-slate-400 font-mono text-[11px]">
          CSPIT · CHARUSAT · AY 2026–27
        </div>
      </div>
    </footer>
  );
};

export default Footer;
