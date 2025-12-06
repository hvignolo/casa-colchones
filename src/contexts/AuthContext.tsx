import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, businessName: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUserData = localStorage.getItem("currentUser");
        if (savedUserData) {
          const savedUser = JSON.parse(savedUserData);
          setUser(savedUser);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);



  const login = async (username: string, password: string, businessName: string): Promise<boolean> => {
    try {
      // Hardcoded credentials check
      if (username === 'hvignolo' && password === 'reposar0833') {
        const adminUser: User = {
          username: 'hvignolo',
          password: 'reposar0833', // In a real app, don't store plain text password in user object
          businessName: 'La Casa de los Colchones',
          registeredAt: new Date().toISOString(),
        };

        setUser(adminUser);
        localStorage.setItem("currentUser", JSON.stringify(adminUser));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};