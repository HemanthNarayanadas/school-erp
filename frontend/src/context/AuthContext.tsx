'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest, setAuthToken, removeAuthToken, getAuthToken } from '../utils/api';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  username: string;
  role: 'principal' | 'teacher' | 'student' | 'parent';
  email?: string;
  phone?: string;
  teacherId?: number;
  studentId?: number;
  parentId?: number;
  classId?: number;
}

interface SchoolSettings {
  schoolName: string;
  logoUrl: string;
  address: string;
  phone: string;
  email: string;
  socialFacebook: string;
  socialTwitter: string;
  socialInstagram: string;
  socialLinkedin: string;
  primaryColor: string;
  secondaryColor: string;
  principalName: string;
  principalMessage: string;
  principalPhotoUrl: string;
  academicYear: string;
  aboutIntroduction: string;
  aboutVision: string;
  aboutMission: string;
}

interface AuthContextType {
  user: User | null;
  settings: SchoolSettings | null;
  loading: boolean;
  login: (username: string, passport: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  setSettingsState: React.Dispatch<React.SetStateAction<SchoolSettings | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshSettings = async () => {
    try {
      const data = await apiRequest('/settings');
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const refreshUser = async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await apiRequest('/auth/me');
      setUser(userData);
    } catch (error) {
      console.error('Failed to verify token, logging out:', error);
      removeAuthToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await refreshSettings();
      await refreshUser();
    };
    init();
  }, []);

  const login = async (username: string, passwordHash: string) => {
    setLoading(true);
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password: passwordHash }),
      });
      setAuthToken(response.token);
      setUser(response.user);
      
      // Redirect based on role
      if (response.user.role === 'principal') {
        router.push('/dashboard/principal');
      } else if (response.user.role === 'teacher') {
        router.push('/dashboard/teacher');
      } else if (response.user.role === 'student') {
        router.push('/dashboard/student');
      } else if (response.user.role === 'parent') {
        router.push('/dashboard/parent');
      }
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        settings,
        loading,
        login,
        logout,
        refreshUser,
        refreshSettings,
        setSettingsState: setSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
