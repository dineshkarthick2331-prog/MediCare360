import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DEMO_USERS, DemoUser, Role } from '../data/demo';

interface AuthContextValue {
  user: DemoUser | null;
  role: Role | null;
  isDemo: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: Role) => Promise<void>;
  logout: () => void;
  demoLogin: (role: Role) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = 'medicare360_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed.user);
        setIsDemo(parsed.isDemo);
      } catch { /* ignore */ }
    }
  }, []);

  const persist = (u: DemoUser, demo: boolean) => {
    setUser(u);
    setIsDemo(demo);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user: u, isDemo: demo }));
  };

  const login = async (email: string, password: string, expectedRole: Role) => {
    // Try demo credentials first
    const demo = DEMO_USERS.find(
      u => u.email === email && u.password === password && u.role === expectedRole
    );
    if (demo) {
      persist(demo, true);
      return;
    }
    // If Supabase is configured, try real auth
    // (omitted here — handled in auth.ts when credentials are configured)
    throw new Error('Invalid credentials. Use demo accounts or configure Supabase.');
  };

  const demoLogin = (role: Role) => {
    const demo = DEMO_USERS.find(u => u.role === role);
    if (demo) persist(demo, true);
  };

  const logout = () => {
    setUser(null);
    setIsDemo(false);
    sessionStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{
      user, role: user?.role ?? null,
      isDemo, isAuthenticated: !!user,
      login, logout, demoLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
