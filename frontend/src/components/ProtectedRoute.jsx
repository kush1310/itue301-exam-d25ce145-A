/**
 * ProtectedRoute Component (Task 2)
 *
 * Route guard wrapper that inspects current authentication context.
 * If user is authenticated, renders the child route components.
 * If unauthenticated, navigates the client back to the home route (/) using <Navigate to="/" />.
 *
 * @param  {Object} props
 * @param  {React.ReactNode} props.children - Child page element to render upon authorization
 * @returns {JSX.Element}
 * @validates - Authentication token and customer profile presence in AuthContext.
 * @redirects - Redirects to '/' if unauthenticated.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner message="Verifying authentication session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Task 2: Redirect unauthenticated users to / when they attempt to access protected route
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
