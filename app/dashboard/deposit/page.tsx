'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@supabase/supabase-js';
import type { Deposit } from '@/lib/supabase';
import { EXCHANGE_RATE_HTG_TO_USD, DEPOSIT_FEE_PERCENT, PAYMENT_METHODS } from '@/lib/constants';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Calculator, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function DepositPage() {
  const { profile, refreshProfile } = useAuth();
  const [amountHTG, setAmountHTG] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'usdt_trc20' | 'moncash' | 'natcash'>('usdt_trc20');
  const [transactionHash, setTransactionHash] = useState('');
  const [loading, setSubmitting] = useState(false);
  const [deposits, setDeposits] = useState<Deposit[]>([]);

  const amountUSD = parseFloat(amountHTG || '0') / EXCHANGE_RATE_HTG_TO_USD;
  const feeAmount = amountUSD * (DEPOSIT_FEE_PERCENT / 100);
  const netAmount = amountUSD - feeAmount;

  useEffect(() => { if (profile) fetchDeposits(); }, [profile]);

  const getSupabase = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Missing Supabase config');
    return createClient(url, key);
  };

  const fetchDeposits = async () => {
    if (!profile) return;
    const supabase = getSupabase();
    const { data } = await supabase.from('deposits').select('*').eq('user_id', profile.id).order('created_at', { ascending: false });
    if (data) setDeposits(data as Deposit[]);
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountHTG || parseFloat(amountHTG) <= 0) { toast.error('Please enter a valid amount'); return; }
    if (!transactionHash.trim()) { toast.error('Please enter the transaction hash/reference'); return; }
    if (!profile) return;
    setSubmitting(true);
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from('deposits').insert({ user_id: profile.id, amount_htg: parseFloat(amountHTG), amount_usd: amountUSD, fee_amount: feeAmount, payment_method: paymentMethod, transaction_hash: transactionHash, status: 'pending' });
      if (error) throw error;
      toast.success('Deposit request submitted successfully!');
      setAmountHTG('');
      setTransactionHash('');
      fetchDeposits();
    } catch (error: any) { toast.error(error.message || 'Failed to submit deposit'); }
    finally { setSubmitting(false); }
  };

  const statusColors: Record<string, string> = { pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', approved: 'bg-green-500/10 text-green-400 border-green-500/20', rejected: 'bg-red-500/10 text-red-400 border-red-500/20' };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground">Deposit Funds</h1><p className="text-muted-foreground mt-1">Add funds to your wallet balance</p></div>
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-blue-400">
            <AlertCircle className="w-5 h-5" />
            <div><p className="font-medium">Current Exchange Rate</p><p className="text-sm text-blue-300">1 USDT = {EXCHANGE_RATE_HTG_TO_USD} HTG | Deposit Fee: {DEPOSIT_FEE_PERCENT}%</p></div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-foreground">Make a Deposit</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleDeposit} className="space-y-5">
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(PAYMENT_METHODS) as Array<keyof typeof PAYMENT_METHODS>).map((method) => (
                    <button key={method} type="button" onClick={() => setPaymentMethod(method)} className={`p-3 rounded-lg border text-sm font-medium transition-all ${paymentMethod === method ? 'bg-primary/10 border-primary text-primary' : 'bg-secondary/30 border-border text-muted-foreground hover:border-primary/50'}`}>{PAYMENT_METHODS[method]}</button>
                  ))}
                </div>
              </div>
              {paymentMethod === 'usdt_trc20' && (
                <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                  <p className="text-sm text-muted-foreground mb-2">Send USDT to this TRC20 wallet address:</p>
                  <p className="text-xs font-mono bg-primary/5 p-2 rounded break-all text-foreground">TRC20-WALLET-ADDRESS-HERE</p>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Amount (HTG)</label>
                <div className="relative">
                  <input type="number" value={amountHTG} onChange={(e) => setAmountHTG(e.target.value)} className="input-field pr-16" placeholder="Enter amount in HTG" min="1" step="1" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">HTG</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Transaction Reference / Hash</label>
                <input type="text" value={transactionHash} onChange={(e) => setTransactionHash(e.target.value)} className="input-field" placeholder="Enter transaction hash or reference number" />
              </div>
              {parseFloat(amountHTG) > 0 && (
                <div className="p-4 rounded-lg bg-secondary/30 border border-border space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Amount in USD</span><span className="text-foreground">${amountUSD.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Fee ({DEPOSIT_FEE_PERCENT}%)</span><span className="text-red-400">-${feeAmount.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm font-semibold pt-2 border-t border-border"><span className="text-foreground">You Receive</span><span className="text-green-400">${netAmount.toFixed(2)}</span></div>
                </div>
              )}
              <Button type="submit" disabled={loading || !parseFloat(amountHTG)} className="w-full">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Deposit Request'}</Button>
            </form>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-foreground">Recent Deposits</CardTitle></CardHeader>
          <CardContent>
            {deposits.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground"><Clock className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No deposits yet</p></div>
            ) : (
              <div className="space-y-3">
                {deposits.slice(0, 5).map((deposit) => (
                  <div key={deposit.id} className="p-3 rounded-lg bg-secondary/30 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">${deposit.amount_usd.toFixed(2)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[deposit.status]}`}>{deposit.status}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{PAYMENT_METHODS[deposit.payment_method]}</span>
                      <span>{new Date(deposit.created_at).toLocaleDateString()}</span>
                    </div>
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