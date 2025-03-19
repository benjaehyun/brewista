import React, { createContext, useState, useContext, useEffect } from 'react';
import * as usersService from '../services/users-service';
import * as profilesAPI from '../services/profiles-api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(usersService.getUser());
    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
        if (user) {
            try {
            await usersService.checkToken();
            // Fetch profile data when user is authenticated
            const profile = await profilesAPI.getProfile();
            setUserProfile(profile);
            } catch (error) {
            setUser(null);
            setUserProfile(null);
            }
        }
        setIsLoading(false);
        };
        checkAuthStatus();
    }, [user]);

    const login = async (credentials) => {
        try {
            const user = await usersService.login(credentials);
            setUser(user);
            // Fetch profile after successful login
            const profile = await profilesAPI.getProfile();
            setUserProfile(profile);
            return user;
        } catch (error) {
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            const user = await usersService.signUp(userData);
            setUser(user);
            // Profile is created during signup in the backend
            const profile = await profilesAPI.getProfile();
            setUserProfile(profile);
            return user;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        usersService.logOut();
        setUser(null);
        setUserProfile(null);
    };

    const toggleSaveRecipe = async (recipeId) => {
        try {
            const updatedProfile = await profilesAPI.toggleSavedRecipe(recipeId);
            setUserProfile(updatedProfile);
        } catch (error) {
            console.error('Failed to toggle recipe save status:', error);
            throw error;
        }
    };

    const removeGearFromProfile = async (gearId) => {
        try {
            const updatedProfile = await profilesAPI.removeGear(gearId);
            setUserProfile(updatedProfile);
        } catch (error) {
            console.error('Failed to remove gear:', error);
            throw error;
        }
    };

    const updateProfile = async (formData) => {
        try {
            const updatedProfile = await profilesAPI.updateProfile(formData);
            setUserProfile(updatedProfile);
            return updatedProfile;
        } catch (error) {
            console.error('Failed to update profile:', error);
            throw error;
        }
    };

    const value = {
        user,
        userProfile,
        setUser,
        login,
        signup,
        logout,
        toggleSaveRecipe,
        removeGearFromProfile,
        updateProfile,
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