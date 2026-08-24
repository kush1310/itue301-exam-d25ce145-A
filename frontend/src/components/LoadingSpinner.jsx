/**
 * LoadingSpinner Component
 *
 * Reusable animated loading indicator used across API fetching states
 * and React.lazy route Suspense fallbacks.
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading content...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      <span className="text-sm font-medium text-slate-400">{message}</span>
    </div>
  );
};

export default LoadingSpinner;
