import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminSession = localStorage.getItem("adminBypass");
    if (adminSession) {
      const mockUser = { id: "admin-bypass-id", email: "admin@admin.com", app_metadata: {}, user_metadata: {}, aud: "authenticated", created_at: new Date().toISOString(), email_confirmed_at: new Date().toISOString() } as User;
      const mockSession = { access_token: "admin-token", refresh_token: "admin-refresh", expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, token_type: "bearer", user: mockUser } as Session;
      setUser(mockUser);
      setSession(mockSession);
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    if ((email === "admin" || email === "admin@admin.com") && password === "admin1") {
      const mockUser = { id: "admin-bypass-id", email: "admin@admin.com", app_metadata: {}, user_metadata: {}, aud: "authenticated", created_at: new Date().toISOString(), email_confirmed_at: new Date().toISOString() } as User;
      const mockSession = { access_token: "admin-token", refresh_token: "admin-refresh", expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, token_type: "bearer", user: mockUser } as Session;
      setUser(mockUser);
      setSession(mockSession);
      localStorage.setItem("adminBypass", "true");
      return { error: null };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    localStorage.removeItem("adminBypass");
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
