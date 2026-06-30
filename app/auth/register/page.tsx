'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User, Phone, ArrowRight, TrendingUp, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  let referralCode: string | null = null;
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    referralCode = params.get('ref');
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (formData.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email: formData.email, password: formData.password, options: { data: { full_name: formData.fullName, phone: formData.phone } } });
      if (error) throw error;
      if (data.user) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await supabase.from('profiles').insert({ user_id: data.user.id, email: formData.email, full_name: formData.fullName, phone: formData.phone });
        if (referralCode) {
          const { data: referrer } = await supabase.from('profiles').select('id').eq('referral_code', referralCode).maybeSingle();
          if (referrer) await supabase.from('profiles').update({ referred_by: referrer.id }).eq('user_id', data.user.id);
        }
        toast.success('Account created successfully!');
        router.push('/dashboard');
      }
    } catch (error: any) { toast.error(error.message || 'Failed to create account'); }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-blue-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center"><TrendingUp className="w-7 h-7 text-white" /></div>
            <span className="text-2xl font-bold text-white">Nextradeinvest</span>
          </div>
        </div>
        <div className="relative">
          <h1 className="text-4xl font-bold text-white mb-4">Start Your Investment Journey</h1>
          <p className="text-blue-100 text-lg">Create your account and begin building wealth with our transparent, secure investment platform.</p>
        </div>
        <div className="relative text-blue-200 text-sm">Join 25,000+ investors worldwide</div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center"><TrendingUp className="w-6 h-6 text-white" /></div>
            <span className="text-xl font-bold">Nextradeinvest</span>
          </div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Create Your Account</h2>
            <p className="text-muted-foreground mt-2">Start investing in minutes</p>
          </div>
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="input-field pl-12" placeholder="John Doe" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field pl-12" placeholder="you@example.com" required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field pl-12" placeholder="+1 234 567 8900" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className="input-field pl-12 pr-12" placeholder="Min 6 characters" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input-field pl-12" placeholder="Confirm your password" required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account<ArrowRight className="w-5 h-5 ml-2" /></>}
            </button>
          </form>
          <p className="text-center text-muted-foreground mt-6">
            Already have an account? <Link href="/auth/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}