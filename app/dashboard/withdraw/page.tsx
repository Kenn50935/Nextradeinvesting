'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@supabase/supabase-js';
import type { Withdrawal } from '@/lib/supabase';
import { WITHDRAWAL_FEE_PERCENT, WITHDRAWAL_PROCESSING_TIME, PAYMENT_METHODS } from '@/lib/constants';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, ArrowUpRight, DollarSign } from 'lucide-react';

export default function WithdrawPage() {
  const { profile, refreshProfile } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'usdt_trc20' | 'moncash' | 'natcash'>('usdt_trc20');
  const [walletAddress, setWalletAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setSubmitting] = useState(false);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  const feeAmount = parseFloat(amount || '0') * (WITHDRAWAL_FEE_PERCENT / 100);
  const netAmount = parseFloat(amount || '0') - feeAmount;

  useEffect(() => { if (profile) fetchWithdrawals(); }, [profile]);

  const getSupabase = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Missing Supabase config');
    return createClient(url, key);
  };

  const fetchWithdrawals = async () => {
    if (!profile) return;
    const supabase = getSupabase();
    const { data } = await supabase.from('withdrawals').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }).limit(10);
    if (data) setWithdrawals(data as Withdrawal[]);
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    const withdrawAmount = parseFloat(amount);
    if (!amount || withdrawAmount <= 0) { toast.error('Please enter a valid amount'); return; }
    if (withdrawAmount > profile.wallet_balance) { toast.error('Insufficient balance'); return; }
    if (paymentMethod === 'usdt_trc20' && !walletAddress.trim()) { toast.error('Please enter your TRC20 wallet address'); return; }
    if ((paymentMethod === 'moncash' || paymentMethod === 'natcash') && !phoneNumber.trim()) { toast.error('Please enter your phone number'); return; }
    setSubmitting(true);
    try {
      const supabase = getSupabase();
      await supabase.from('withdrawals').insert({ user_id: profile.id, amount: withdrawAmount, fee_amount: feeAmount, net_amount: netAmount, payment_method: paymentMethod, wallet_address: paymentMethod === 'usdt_trc20' ? walletAddress : null, phone_number: paymentMethod !== 'usdt_trc20' ? phoneNumber : null, status: 'pending' });
      const newBalance = profile.wallet_balance - withdrawAmount;
      const newTotalWithdrawn = profile.total_withdrawn + netAmount;
      await supabase.from('profiles').update({ wallet_balance: newBalance, total_withdrawn: newTotalWithdrawn }).eq('id', profile.id);
      toast.success('Withdrawal request submitted!');
      setAmount(''); setWalletAddress(''); setPhoneNumber('');
      refreshProfile(); fetchWithdrawals();
    } catch (error: any) { toast.error(error.message || 'Failed to submit withdrawal'); }
    finally { setSubmitting(false); }
  };

  const statusColors: Record<string, string> = { pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', approved: 'bg-green-500/10 text-green-400 border-green-500/20', rejected: 'bg-red-500/10 text-red-400 border-red-500/20' };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground">Withdraw Funds</h1><p className="text-muted-foreground mt-1">Request a withdrawal to your preferred payment method</p></div>
      <Card className="bg-amber-500/10 border-amber-500/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3 text-amber-400">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div><p className="font-medium">Important Information</p><ul className="text-sm text-amber-300 mt-1 space-y-1"><li>Withdrawal Fee: {WITHDRAWAL_FEE_PERCENT}%</li><li>Processing Time: {WITHDRAWAL_PROCESSING_TIME}</li><li>Minimum withdrawal: $5</li></ul></div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-foreground">Request Withdrawal</CardTitle></CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-secondary/30 border border-border mb-6"><p className="text-sm text-muted-foreground">Available Balance</p><p className="text-2xl font-bold text-foreground">${profile?.wallet_balance.toFixed(2) || '0.00'}</p></div>
            <form onSubmit={handleWithdraw} className="space-y-5">
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(PAYMENT_METHODS) as Array<keyof typeof PAYMENT_METHODS>).map((method) => (
                    <button key={method} type="button" onClick={() => setPaymentMethod(method)} className={`p-3 rounded-lg border text-sm font-medium transition-all ${paymentMethod === method ? 'bg-primary/10 border-primary text-primary' : 'bg-secondary/30 border-border text-muted-foreground hover:border-primary/50'}`}>{PAYMENT_METHODS[method]}</button>
                  ))}
                </div>
              </div>
              {paymentMethod === 'usdt_trc20' ? (
                <div className="space-y-2"><label className="text-sm font-medium text-foreground">TRC20 Wallet Address</label><input type="text" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} className="input-field" placeholder="Enter your TRC20 wallet address" /></div>
              ) : (
                <div className="space-y-2"><label className="text-sm font-medium text-foreground">Phone Number</label><input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="input-field" placeholder="+509 1234 5678" /></div>
              )}
              <div className="space-y-2"><label className="text-sm font-medium text-foreground">Amount (USD)</label><div className="relative"><DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field pl-12" placeholder="0.00" min="5" step="0.01" /></div></div>
              {parseFloat(amount) > 0 && (
                <div className="p-4 rounded-lg bg-secondary/30 border border-border space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Amount</span><span className="text-foreground">${parseFloat(amount).toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Fee ({WITHDRAWAL_FEE_PERCENT}%)</span><span className="text-red-400">-${feeAmount.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm font-semibold pt-2 border-t border-border"><span className="text-foreground">You Receive</span><span className="text-green-400">${netAmount.toFixed(2)}</span></div>
                </div>
              )}
              <Button type="submit" disabled={loading || !parseFloat(amount) || parseFloat(amount) < 5} className="w-full">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Withdrawal Request'}</Button>
            </form>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-foreground">Recent Withdrawals</CardTitle></CardHeader>
          <CardContent>
            {withdrawals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground"><ArrowUpRight className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No withdrawals yet</p></div>
            ) : (
              <div className="space-y-3">
                {withdrawals.map((withdrawal) => (
                  <div key={withdrawal.id} className="p-3 rounded-lg bg-secondary/30 border border-border">
                    <div className="flex items-center justify-between mb-2"><span className="font-medium text-foreground">${withdrawal.amount.toFixed(2)}</span><span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[withdrawal.status]}`}>{withdrawal.status}</span></div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground"><span>{PAYMENT_METHODS[withdrawal.payment_method]}</span><span>{new Date(withdrawal.created_at).toLocaleDateString()}</span></div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}