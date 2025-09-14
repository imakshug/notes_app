import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from './api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already authenticated on app start
    try {
      const token = apiClient.token;
      if (token) {
        // You could validate the token here by making an API call
        setUser({ token });
      }
    } catch (error) {
      console.warn('Auth initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.login(credentials);
      setUser(response);
      
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.register(userData);
      setUser(response);
      
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
    setError(null);
  };

  const forgotPassword = async (email) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.forgotPassword(email);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.resetPassword(token, newPassword);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};