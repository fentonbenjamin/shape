"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}>({ user: null, loading: true, signOut: async () => {} });

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabase();

    supabase.auth.getSession().then(({ data }: { data: { session: { user: User } | null } }) => {
      setUser(data.session?.user ?? null);
    }).catch(() => {
      // auth unavailable — continue as anonymous
    }).finally(() => {
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    const supabase = getSupabase();
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
