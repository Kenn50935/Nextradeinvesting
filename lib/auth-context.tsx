'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient, User, Session, SupabaseClient } from '@supabase/supabase-js';

type Profile = {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  referral_code: string;
  referred_by: string | null;
  wallet_balance: number;
  referral_balance: number;
  total_deposited: number;
  total_withdrawn: number;
  total_invested: number;
  total_referral_earnings: number;
  is_admin: boolean;
  is_pro_admin: boolean;
  is_blocked: boolean;
  pro_admin_referrals_count: number;
  pro_admin_commission_earnings: number;
  created_at: string;
  updated_at: string;
};

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (supabase: SupabaseClient, userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && data) {
      setProfile(data as Profile);
    }
    setLoading(false);
  };

  const refreshProfile = async () => {
    if (user) {
      const supabase = getSupabaseClient();
      await fetchProfile(supabase, user.id);
    }
  };

  const signOut = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  useEffect(() => {
    const supabase = getSupabaseClient();

    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(supabase, session.user.id);
      } else {
        setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(supabase, session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}