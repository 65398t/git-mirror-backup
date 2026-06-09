// Authentication context using mock API
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { api } from '../lib/api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface Session {
  access_token: string;
  expires_at: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithEntraId: () => Promise<void>;
  entraIdEnabled: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // No auto-login - user must enter credentials on the login page
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await api.auth.signIn(email, password);
    setUser(result.user);
    setSession(result.session);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const result = await api.auth.signUp(email, password);
    setUser(result.user);
    setSession(result.session);
  }, []);

  const signOut = useCallback(async () => {
    await api.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  const signInWithEntraId = useCallback(async () => {
    await api.auth.signInWithEntraId();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, session, loading, signIn, signUp, signOut, signInWithEntraId, entraIdEnabled: api.auth.entraIdEnabled }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
