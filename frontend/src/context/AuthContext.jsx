import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            const storedUser = authService.getStoredUser();
            const hasToken = authService.isAuthenticated();

            if (storedUser && hasToken) {
                try {
                    const currentUser = await authService.getCurrentUser();
                    setUser(currentUser);
                    setIsAuthenticated(true);
                } catch (error) {
                    authService.clearAuth();
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = useCallback(async (credentials) => {
        try {
            const data = await authService.login(credentials);
            setUser(data.user);
            setIsAuthenticated(true);
            toast.success('Login successful!');
            return data;
        } catch (error) {
            toast.error('Login failed. Please check your credentials.');
            throw error;
        }
    }, []);

    const register = useCallback(async (userData) => {
        try {
            const data = await authService.register(userData);
            setUser(data.user);
            setIsAuthenticated(true);
            toast.success('Registration successful!');
            return data;
        } catch (error) {
            toast.error('Registration failed. Please try again.');
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }, []);

    const updateUser = useCallback(async (userData) => {
        try {
            const updatedUser = await authService.updateProfile(userData);
            setUser(updatedUser);
            toast.success('Profile updated successfully');
            return updatedUser;
        } catch (error) {
            toast.error('Failed to update profile');
            throw error;
        }
    }, []);

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
