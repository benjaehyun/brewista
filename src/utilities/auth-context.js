import React, { createContext, useState, useContext, useEffect } from 'react';
import * as usersService from '../services/users-service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(usersService.getUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (user) {
        try {
          await usersService.checkToken();
        } catch (error) {
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      const user = await usersService.login(credentials);
      setUser(user);
      return user;
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const signup = async (userData) => {
    try {
      const user = await usersService.signUp(userData);
      setUser(user);
      return user;
    } catch (error) {
      throw new Error('Signup failed');
    }
  };

  const logout = () => {
    usersService.logOut();
    setUser(null);
  };

  const refreshToken = async () => {
    try {
      await usersService.checkToken();
      const refreshedUser = usersService.getUser();
      setUser(refreshedUser);
    } catch (error) {
      setUser(null);
    }
  };

  const value = {
    user,
    setUser,
    login,
    signup,
    logout,
    refreshToken,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};