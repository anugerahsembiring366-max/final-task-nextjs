"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@/types/fakestore";

type AuthState = {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (args: { token: string; user: User }) => void;
  logout: () => void;
};

const LS_TOKEN_KEY = "fakestore_token";
const LS_USER_KEY = "fakestore_user";

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(LS_TOKEN_KEY);
      const savedUser = localStorage.getItem(LS_USER_KEY);
      setToken(savedToken);
      setUser(savedUser ? (JSON.parse(savedUser) as User) : null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      token,
      user,
      isLoading,
      login: ({ token, user }) => {
        console.log('🔑 AuthContext.login called with:', { token, user });
        setToken(token);
        setUser(user);
        localStorage.setItem(LS_TOKEN_KEY, token);
        localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
        console.log('✅ Token saved:', localStorage.getItem(LS_TOKEN_KEY) ? 'YES' : 'NO');
        console.log('✅ User saved:', localStorage.getItem(LS_USER_KEY) ? 'YES' : 'NO');
      },
      logout: () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem(LS_TOKEN_KEY);
        localStorage.removeItem(LS_USER_KEY);
      },
    }),
    [token, user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}

