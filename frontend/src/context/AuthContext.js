import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, logout as apiLogout } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getCurrentUser();
        setCurrentUser(userData);
      } catch (err) {
        console.error('Error loading user:', err);
        setError('Failed to load user data');
        // Clear tokens if they're invalid
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleAuthCallback = (params) => {
    const urlParams = new URLSearchParams(params);
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');

    if (accessToken && refreshToken) {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      setCurrentUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    isAuthenticated: !!currentUser,
    handleAuthCallback,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
