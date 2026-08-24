/**
 * AuthContext Module
 *
 * Provides application-wide authentication state with Role-Based Access Control (RBAC).
 * Configures an Axios Request Interceptor to synchronously attach Bearer JWT tokens.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Global Axios Request Interceptor: Synchronously attaches JWT token to every outgoing request
axios.interceptors.request.use(
  (config) => {
    const savedToken = localStorage.getItem('quickbite_token');
    if (savedToken) {
      config.headers.Authorization = `Bearer ${savedToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(() => {
    const savedCustomer = localStorage.getItem('quickbite_customer');
    return savedCustomer ? JSON.parse(savedCustomer) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('quickbite_token') || null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Synchronize localStorage when token/customer changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('quickbite_token', token);
      if (customer) {
        localStorage.setItem('quickbite_customer', JSON.stringify(customer));
      }
    } else {
      localStorage.removeItem('quickbite_token');
      localStorage.removeItem('quickbite_customer');
    }
  }, [token, customer]);

  /**
   * login
   *
   * Authenticates customer or canteen owner against the backend API endpoint.
   *
   * @param  {string} email        - Registered email address
   * @param  {string} password     - Plaintext password
   * @param  {string} [requiredRole] - Required role verification ('Customer' | 'Restaurant Owner' | 'Admin')
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  const login = async (email, password, requiredRole) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/v1/auth/login', {
        email,
        password,
        requiredRole
      });

      if (response.data && response.data.success) {
        const { token: receivedToken, customer: receivedCustomer } = response.data.data;
        localStorage.setItem('quickbite_token', receivedToken);
        localStorage.setItem('quickbite_customer', JSON.stringify(receivedCustomer));
        setToken(receivedToken);
        setCustomer(receivedCustomer);
        setLoading(false);
        return { success: true };
      }
      setLoading(false);
      return { success: false, message: 'Authentication returned unverified payload.' };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        'Authentication failed. Please check your credentials and selected role.';
      setError(errorMessage);
      setLoading(false);
      return { success: false, message: errorMessage };
    }
  };

  /**
   * logout
   *
   * Clears authentication credentials and resets session state.
   */
  const logout = () => {
    setCustomer(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('quickbite_token');
    localStorage.removeItem('quickbite_customer');
  };

  const value = {
    customer,
    token,
    role: customer?.role || null,
    isAdmin: customer?.role === 'Admin',
    isAuthenticated: Boolean(token && customer),
    loading,
    error,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be consumed within an AuthProvider.');
  }
  return context;
};

export default AuthContext;
