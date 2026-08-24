/**
 * ProtectedRoute Component (Task 2 & RBAC Guard)
 *
 * Route guard wrapper that inspects current authentication context and role.
 * If user is unauthenticated, navigates to '/' using <Navigate to="/" replace />.
 * If requiredRole is specified and user's role does not match, redirects to '/'.
 *
 * @param  {Object} props
 * @param  {React.ReactNode} props.children     - Child page element to render upon authorization
 * @param  {string} [props.requiredRole]        - Optional role requirement ('Admin' | 'Customer')
 * @returns {JSX.Element}
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, customer, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner message="Verifying session credentials..." />
      </div>
    );
  }

  // Task 2: Unauthenticated users are redirected to /
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // RBAC Enforcement: Prevent customers from accessing Admin routes and vice versa
  if (requiredRole && customer?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
