"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}>({ user: null, loading: false, signOut: async () => {} });

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const { getSupabase } = await import("@/lib/supabase");
        const supabase = getSupabase();

        const { data } = await supabase.auth.getSession();
        if (!cancelled) {
          setUser(data.session?.user ?? null);
          setLoading(false);
        }

        supabase.auth.onAuthStateChange((_event: string, session: { user: User } | null) => {
          if (!cancelled) {
            setUser(session?.user ?? null);
            setLoading(false);
          }
        });
      } catch {
        if (!cancelled) setLoading(false);
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  async function signOut() {
    try {
      const { getSupabase } = await import("@/lib/supabase");
      await getSupabase().auth.signOut();
      setUser(null);
    } catch {
      // ignore
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
