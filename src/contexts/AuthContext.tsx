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

  const getUsers = async (): Promise<Record<string, User>> => {
    try {
      const users = localStorage.getItem("app_users");
      return users ? JSON.parse(users) : {};
    } catch (error) {
      console.error('Error loading users:', error);
      return {};
    }
  };

  const saveUsers = async (users: Record<string, User>) => {
    try {
      localStorage.setItem("app_users", JSON.stringify(users));
    } catch (error) {
      console.error("Error saving users:", error);
    }
  };

  const login = async (username: string, password: string, businessName: string): Promise<boolean> => {
    try {
      const users = await getUsers();
      const isRegister = !users[username];

      if (isRegister) {
        // Register new user
        const newUser: User = {
          username,
          password,
          businessName,
          registeredAt: new Date().toISOString(),
        };

        users[username] = newUser;
        await saveUsers(users);

        setUser(newUser);
        localStorage.setItem("currentUser", JSON.stringify(newUser));
        return true;
      } else {
        // Login existing user
        const existingUser = users[username];
        if (existingUser && existingUser.password === password) {
          setUser(existingUser);
          localStorage.setItem("currentUser", JSON.stringify(existingUser));
          return true;
        } else {
          return false;
        }
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