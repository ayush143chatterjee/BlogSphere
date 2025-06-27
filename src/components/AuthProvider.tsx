import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/authStore';
import { UserData, UserRole } from '../lib/types';

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<UserData>) => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { user: firebaseUser, signUp: firebaseSignUp, signIn: firebaseSignIn, logout, updateUserProfile: updateFirebaseProfile, userRole } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (firebaseUser) {
      const storedData = localStorage.getItem(`userData_${firebaseUser.uid}`);
      if (storedData) {
        setUserData(JSON.parse(storedData));
      } else {
        const defaultData: UserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          role: userRole,
          emailNotifications: true,
          appNotifications: true
        };
        localStorage.setItem(`userData_${firebaseUser.uid}`, JSON.stringify(defaultData));
        setUserData(defaultData);
      }
    } else {
      setUserData(null);
    }
    setLoading(false);
  }, [firebaseUser, userRole]);

  const signUp = async (email: string, password: string, displayName: string, role: UserRole) => {
    await firebaseSignUp(email, password, displayName);
    if (firebaseUser) {
      const userData: UserData = {
        uid: firebaseUser.uid,
        email,
        displayName,
        role,
        emailNotifications: true,
        appNotifications: true
      };
      localStorage.setItem(`userData_${firebaseUser.uid}`, JSON.stringify(userData));
      setUserData(userData);
      navigate('/dashboard');
    }
  };

  const signIn = async (email: string, password: string) => {
    await firebaseSignIn(email, password);
    navigate('/dashboard');
  };

  const signOut = async () => {
    await logout();
    navigate('/');
  };

  const updateUserProfile = async (data: Partial<UserData>) => {
    if (!userData) return;

    const updatedData = { ...userData, ...data };
    localStorage.setItem(`userData_${userData.uid}`, JSON.stringify(updatedData));
    setUserData(updatedData);

    if (data.displayName || data.photoURL) {
      await updateFirebaseProfile(
        data.displayName || userData.displayName,
        data.photoURL
      );
    }
  };

  const isAdmin = () => {
    return userRole === 'admin';
  };

  return (
    <AuthContext.Provider value={{
      user: userData,
      loading,
      signUp,
      signIn,
      signOut,
      updateUserProfile,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}