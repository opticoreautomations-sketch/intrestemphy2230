import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

interface AuthContextType {
  user: any | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isTeacher: boolean;
  login: (credentials: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('physics_token');
    if (token) {
      api.auth.me()
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('physics_token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: any) => {
    const userData = await api.auth.login(credentials);
    setUser(userData);
  };

  const signOut = async () => {
    api.auth.logout();
    setUser(null);
  };

  const isTeacher = user?.role === 'teacher';

  return (
    <AuthContext.Provider value={{ user, profile: user, loading, signOut, isTeacher, login }}>
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
