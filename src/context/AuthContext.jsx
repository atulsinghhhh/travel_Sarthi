import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token and user in localStorage on initial load
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    // Once we've checked local storage, we can stop the loading state
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await AuthService.login(credentials);
      const { access_token, user: userData } = response.data;
      
      // Store in state
      setToken(access_token);
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store in localStorage
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await AuthService.register(userData);
      // Depending on whether register auto-logs in or just returns success:
      // The Laravel backend we created auto-logs in and returns the token!
      const { access_token, user: newUser } = response.data;
      
      if (access_token) {
        setToken(access_token);
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('auth_token', access_token);
        localStorage.setItem('user', JSON.stringify(newUser));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call logout API (it might fail if token is already invalid, but we still want to clean up)
      await AuthService.logout().catch(err => console.log('Logout API failed, continuing cleanup', err));
    } finally {
      // Always clean up local state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      loading,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
