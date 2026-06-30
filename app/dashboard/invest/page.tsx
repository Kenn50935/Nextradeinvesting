'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@supabase/supabase-js';
import type { InvestmentPlan } from '@/lib/supabase';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, DollarSign, Percent, Loader2, CheckCircle2, Sparkles } from 'lucide-react';

export default function InvestPage() {
  const { profile, refreshProfile } = useAuth();
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [investing, setInvesting] = useState(false);

  useEffect(() => { fetchPlans(); }, []);

  const getSupabase = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Missing Supabase config');
    return createClient(url, key);
  };

  const fetchPlans = async () => {
    const supabase = getSupabase();
    const { data } = await supabase.from('investment_plans').select('*').eq('is_active', true).order('price', { ascending: true });
    if (data) setPlans(data as InvestmentPlan[]);
    setLoading(false);
  };

  const handleInvest = async () => {
    if (!selectedPlan || !profile) return;
    if (profile.wallet_balance < selectedPlan.price) { toast.error('Insufficient balance. Please deposit funds first.'); return; }
    setInvesting(true);
    try {
      const supabase = getSupabase();
      const newBalance = profile.wallet_balance - selectedPlan.price;
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + selectedPlan.duration_days);
      const dailyProfit = (selectedPlan.price * selectedPlan.daily_profit_percent) / 100;
      const totalExpectedProfit = (selectedPlan.price * selectedPlan.total_profit_percent) / 100;
      const { error: invError } = await supabase.from('investments').insert({ user_id: profile.id, plan_id: selectedPlan.id, amount: selectedPlan.price, daily_profit: dailyProfit, total_expected_profit: totalExpectedProfit, end_date: endDate.toISOString(), status: 'active' });
      if (invError) throw invError;
      await supabase.from('profiles').update({ wallet_balance: newBalance, total_invested: profile.total_invested + selectedPlan.price }).eq('id', profile.id);
      toast.success(`Successfully invested in ${selectedPlan.name}!`);
      setShowModal(false);
      refreshProfile();
    } catch (error: any) { toast.error(error.message || 'Failed to invest'); }
    finally { setInvesting(false); }
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground">Investment Plans</h1><p className="text-muted-foreground mt-1">Choose a plan to start earning daily profits</p></div>
      <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-blue-300">Available Balance</p><p className="text-3xl font-bold text-foreground mt-1">${profile?.wallet_balance.toFixed(2) || '0.00'}</p></div>
            <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center"><DollarSign className="w-8 h-8 text-blue-400" /></div>
          </div>
        </CardContent>
      </Card>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (<Card key={i} className="bg-card border-border animate-pulse"><CardContent className="p-6"><div className="h-40 bg-secondary/30 rounded" /></CardContent></Card>))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => {
            const canAfford = profile && profile.wallet_balance >= plan.price;
            const dailyProfit = (plan.price * plan.daily_profit_percent) / 100;
            const totalProfit = (plan.price * plan.total_profit_percent) / 100;
            return (
              <Card key={plan.id} className={`relative bg-card border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/50 ${index === 2 ? 'lg:scale-105 border-primary/50' : ''}`}>
                {index === 2 && <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold text-center py-1"><Sparkles className="w-3 h-3 inline mr-1" />MOST POPULAR</div>}
                <CardHeader className={index === 2 ? 'pt-8' : ''}><CardTitle className="text-foreground text-xl">{plan.name}</CardTitle><CardDescription className="text-muted-foreground text-sm">{plan.description}</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4 border-y border-border"><p className="text-4xl font-bold text-foreground">${plan.price}</p><p className="text-sm text-muted-foreground mt-1">one-time investment</p></div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground flex items-center gap-2"><Percent className="w-4 h-4" />Daily Profit</span><Badge variant="secondary" className="bg-green-500/10 text-green-400">{plan.daily_profit_percent}%</Badge></div>
                    <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground flex items-center gap-2"><DollarSign className="w-4 h-4" />Daily Earning</span><span className="text-foreground font-medium">${dailyProfit.toFixed(2)}</span></div>
                    <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4" />Duration</span><span className="text-foreground font-medium">{plan.duration_days} days</span></div>
                    <div className="flex items-center justify-between pt-3 border-t border-border"><span className="text-sm text-muted-foreground">Total Return</span><span className="text-green-400 font-bold">+${(plan.price + totalProfit).toFixed(2)}</span></div>
                  </div>
                  <Button onClick={() => { setSelectedPlan(plan); setShowModal(true); }} disabled={!canAfford} className={`w-full ${index === 2 ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' : ''}`} variant={index === 2 ? 'default' : 'secondary'}>{canAfford ? 'Invest Now' : 'Insufficient Balance'}</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="text-foreground">Confirm Investment</DialogTitle><DialogDescription className="text-muted-foreground">Review your investment details</DialogDescription></DialogHeader>
          {selectedPlan && (
            <div className="space-y-4 py-4">
              <div className="p-4 rounded-lg bg-secondary/30 border border-border"><p className="text-lg font-medium text-foreground">{selectedPlan.name}</p><p className="text-3xl font-bold text-primary mt-2">${selectedPlan.price}</p></div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Daily Profit</span><span className="text-green-400">${((selectedPlan.price * selectedPlan.daily_profit_percent) / 100).toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Duration</span><span className="text-foreground">{selectedPlan.duration_days} days</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Profit</span><span className="text-green-400">+${((selectedPlan.price * selectedPlan.total_profit_percent) / 100).toFixed(2)}</span></div>
                <div className="flex justify-between text-sm font-semibold pt-2 border-t border-border"><span className="text-foreground">Total Return</span><span className="text-green-400">${(selectedPlan.price + (selectedPlan.price * selectedPlan.total_profit_percent) / 100).toFixed(2)}</span></div>
              </div>
              <Button onClick={handleInvest} disabled={investing} className="w-full">{investing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5 mr-2" />Confirm Investment</>}</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}