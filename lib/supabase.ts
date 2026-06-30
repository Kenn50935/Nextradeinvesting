import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy initialization of Supabase client to avoid build-time errors
let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

// Export a getter function for use in components
export const supabase = {
  get auth() {
    return getSupabaseClient().auth;
  },
  get from() {
    return getSupabaseClient().from.bind(getSupabaseClient());
  },
  get rpc() {
    return getSupabaseClient().rpc.bind(getSupabaseClient());
  },
  get storage() {
    return getSupabaseClient().storage;
  },
  get realtime() {
    return getSupabaseClient().realtime;
  },
  get functions() {
    return getSupabaseClient().functions;
  },
  get channel() {
    return getSupabaseClient().channel.bind(getSupabaseClient());
  },
  get removeChannel() {
    return getSupabaseClient().removeChannel.bind(getSupabaseClient());
  },
  get removeAllChannels() {
    return getSupabaseClient().removeAllChannels.bind(getSupabaseClient());
  },
} as unknown as SupabaseClient;

// Type definitions
export type Profile = {
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

export type InvestmentPlan = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  daily_profit_percent: number;
  duration_days: number;
  total_profit_percent: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Investment = {
  id: string;
  user_id: string;
  plan_id: string;
  amount: number;
  daily_profit: number;
  total_expected_profit: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  plan?: InvestmentPlan;
};

export type Deposit = {
  id: string;
  user_id: string;
  amount_htg: number;
  amount_usd: number;
  fee_amount: number;
  payment_method: 'usdt_trc20' | 'moncash' | 'natcash';
  transaction_hash: string | null;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Withdrawal = {
  id: string;
  user_id: string;
  amount: number;
  fee_amount: number;
  net_amount: number;
  payment_method: 'usdt_trc20' | 'moncash' | 'natcash';
  wallet_address: string | null;
  phone_number: string | null;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'commission' | 'bonus';
  amount: number;
  description: string | null;
  reference_id: string | null;
  created_at: string;
};

export type ReferralEarning = {
  id: string;
  referrer_id: string;
  referred_id: string;
  investment_amount: number | null;
  commission_amount: number;
  commission_type: 'investment' | 'withdrawal_fee' | 'reward';
  status: 'pending' | 'credited';
  created_at: string;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Ticket = {
  id: string;
  user_id: string;
  quantity: number;
  total_price: number;
  status: 'active' | 'used' | 'expired';
  created_at: string;
};

export type AdminLog = {
  id: string;
  admin_id: string;
  action: string;
  target_user_id: string | null;
  target_table: string | null;
  target_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};