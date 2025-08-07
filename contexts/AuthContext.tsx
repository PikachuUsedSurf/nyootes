'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { firebaseService } from '../lib/firebaseService';
import { User, LoadingState } from '../types';

interface AuthContextType {
  user: User | null;
  loading: LoadingState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<string>;
  deleteAccount: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: true,
    error: null,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = firebaseService.onAuthStateChange((user) => {
      setUser(user);
      setIsAuthenticated(!!user);
      setLoading({ isLoading: false, error: null });
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading({ isLoading: true, error: null, operation: 'login' });
    try {
      const user = await firebaseService.loginUser(email, password);
      setUser(user);
      setIsAuthenticated(true);
      setLoading({ isLoading: false, error: null });
      return true;
    } catch (error: any) {
      setLoading({ isLoading: false, error: error.message });
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setLoading({ isLoading: true, error: null, operation: 'register' });
    try {
      const user = await firebaseService.registerUser(email, password, username);
      setUser(user);
      setIsAuthenticated(true);
      setLoading({ isLoading: false, error: null });
      return true;
    } catch (error: any) {
      setLoading({ isLoading: false, error: error.message });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setLoading({ isLoading: true, error: null, operation: 'logout' });
    try {
      await firebaseService.logoutUser();
      setUser(null);
      setIsAuthenticated(false);
      setLoading({ isLoading: false, error: null });
    } catch (error: any) {
      setLoading({ isLoading: false, error: error.message });
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    
    setLoading({ isLoading: true, error: null, operation: 'updateProfile' });
    try {
      await firebaseService.updateUserProfile(user.id, updates);
      setUser({ ...user, ...updates, updatedAt: new Date() });
      setLoading({ isLoading: false, error: null });
    } catch (error: any) {
      setLoading({ isLoading: false, error: error.message });
      throw error;
    }
  };

  const uploadProfilePicture = async (file: File): Promise<string> => {
    if (!user) throw new Error('No user logged in');
    
    setLoading({ isLoading: true, error: null, operation: 'uploadProfilePicture' });
    try {
      const downloadURL = await firebaseService.uploadProfilePicture(user.id, file);
      setUser({ ...user, profilePicture: downloadURL, updatedAt: new Date() });
      setLoading({ isLoading: false, error: null });
      return downloadURL;
    } catch (error: any) {
      setLoading({ isLoading: false, error: error.message });
      throw error;
    }
  };

  const deleteAccount = async (): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    
    setLoading({ isLoading: true, error: null, operation: 'deleteAccount' });
    try {
      await firebaseService.deleteUserAccount(user.id);
      setUser(null);
      setIsAuthenticated(false);
      setLoading({ isLoading: false, error: null });
    } catch (error: any) {
      setLoading({ isLoading: false, error: error.message });
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    uploadProfilePicture,
    deleteAccount,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};