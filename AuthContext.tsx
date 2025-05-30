import React, { createContext, useState, useContext } from 'react';

type User = {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  analysisCount: number;
  dailyLimit: number;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
  googleAuth: () => Promise<void>;
  upgradeAccount: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Mock implementations for authentication functions
  const login = async (email: string, password: string) => {
    // This would call an API in a real app
    setUser({
      id: '123',
      email,
      name: 'Test User',
      isPremium: false,
      analysisCount: 0,
      dailyLimit: 1,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const signup = async (email: string, password: string, name: string) => {
    // This would call an API in a real app
    setUser({
      id: '123',
      email,
      name,
      isPremium: false,
      analysisCount: 0,
      dailyLimit: 1,
    });
  };

  const googleAuth = async () => {
    // Mock Google auth
    setUser({
      id: '124',
      email: 'google@example.com',
      name: 'Google User',
      isPremium: false,
      analysisCount: 0,
      dailyLimit: 1,
    });
  };

  const upgradeAccount = async () => {
    if (user) {
      setUser({
        ...user,
        isPremium: true,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        signup,
        googleAuth,
        upgradeAccount,
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