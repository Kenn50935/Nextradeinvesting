'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase, Transaction, Deposit, Withdrawal, Investment } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowDownRight, ArrowUpRight, DollarSign, TrendingUp, Gift, History, Loader2 } from 'lucide-react';
import { PAYMENT_METHODS } from '@/lib/constants';

export default function HistoryPage() {
  const { profile } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (profile) fetchAllHistory(); }, [profile]);

  const fetchAllHistory = async () => {
    if (!profile) return;
    try {
      const [txRes, depRes, withRes, invRes] = await Promise.all([
        supabase.from('transactions').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }),
        supabase.from('deposits').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }),
        supabase.from('withdrawals').select('*').eq('user_id', profile.id).order('created_at', { ascending: false }),
        supabase.from('investments').select('*, plan:investment_plans(*)').eq('user_id', profile.id).order('created_at', { ascending: false }),
      ]);
      if (txRes.data) setTransactions(txRes.data as Transaction[]);
      if (depRes.data) setDeposits(depRes.data as Deposit[]);
      if (withRes.data) setWithdrawals(withRes.data as Withdrawal[]);
      if (invRes.data) setInvestments(invRes.data as Investment[]);
    } catch (error) { console.error('Error fetching history:', error); }
    finally { setLoading(false); }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownRight className="w-5 h-5 text-green-400" />;
      case 'withdrawal': return <ArrowUpRight className="w-5 h-5 text-red-400" />;
      case 'investment': return <TrendingUp className="w-5 h-5 text-blue-400" />;
      case 'commission': return <Gift className="w-5 h-5 text-purple-400" />;
      default: return <DollarSign className="w-5 h-5 text-amber-400" />;
    }
  };

  const statusColors: Record<string, string> = { pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', approved: 'bg-green-500/10 text-green-400 border-green-500/20', rejected: 'bg-red-500/10 text-red-400 border-red-500/20', active: 'bg-blue-500/10 text-blue-400 border-blue-500/20', completed: 'bg-green-500/10 text-green-400 border-green-500/20', cancelled: 'bg-red-500/10 text-red-400 border-red-500/20' };

  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground">Transaction History</h1><p className="text-muted-foreground mt-1">View all your past transactions</p></div>
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-card border border-border"><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="deposits">Deposits</TabsTrigger><TabsTrigger value="withdrawals">Withdrawals</TabsTrigger><TabsTrigger value="investments">Investments</TabsTrigger></TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              {transactions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground"><History className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No transactions yet</p></div>
              ) : (
                <div className="divide-y divide-border">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.type === 'deposit' ? 'bg-green-500/10' : tx.type === 'withdrawal' ? 'bg-red-500/10' : tx.type === 'investment' ? 'bg-blue-500/10' : tx.type === 'commission' ? 'bg-purple-500/10' : 'bg-amber-500/10'}`}>{getTransactionIcon(tx.type)}</div>
                        <div><p className="font-medium text-foreground capitalize">{tx.type}</p><p className="text-xs text-muted-foreground">{tx.description || new Date(tx.created_at).toLocaleDateString()}</p></div>
                      </div>
                      <div className="text-right"><p className={`font-semibold ${tx.type === 'withdrawal' ? 'text-red-400' : 'text-green-400'}`}>{tx.type === 'withdrawal' ? '-' : '+'}${tx.amount.toFixed(2)}</p><p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p></div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="deposits" className="space-y-4">
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              {deposits.length === 0 ? (<div className="text-center py-12 text-muted-foreground"><ArrowDownRight className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No deposits yet</p></div>) : (
                <div className="divide-y divide-border">
                  {deposits.map((deposit) => (
                    <div key={deposit.id} className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
                      <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center"><ArrowDownRight className="w-5 h-5 text-green-400" /></div><div><p className="font-medium text-foreground">{PAYMENT_METHODS[deposit.payment_method]}</p><p className="text-xs text-muted-foreground">{deposit.amount_htg.toFixed(0)} HTG</p></div></div>
                      <div className="text-right"><p className="font-semibold text-green-400">+${deposit.amount_usd.toFixed(2)}</p><Badge variant="secondary" className={statusColors[deposit.status]}>{deposit.status}</Badge></div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="withdrawals" className="space-y-4">
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              {withdrawals.length === 0 ? (<div className="text-center py-12 text-muted-foreground"><ArrowUpRight className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No withdrawals yet</p></div>) : (
                <div className="divide-y divide-border">
                  {withdrawals.map((withdrawal) => (
                    <div key={withdrawal.id} className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
                      <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center"><ArrowUpRight className="w-5 h-5 text-red-400" /></div><div><p className="font-medium text-foreground">{PAYMENT_METHODS[withdrawal.payment_method]}</p><p className="text-xs text-muted-foreground">Fee: ${withdrawal.fee_amount.toFixed(2)}</p></div></div>
                      <div className="text-right"><p className="font-semibold text-red-400">-${withdrawal.amount.toFixed(2)}</p><Badge variant="secondary" className={statusColors[withdrawal.status]}>{withdrawal.status}</Badge></div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="investments" className="space-y-4">
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              {investments.length === 0 ? (<div className="text-center py-12 text-muted-foreground"><TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No investments yet</p></div>) : (
                <div className="divide-y divide-border">
                  {investments.map((investment) => (
                    <div key={investment.id} className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
                      <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-blue-400" /></div><div><p className="font-medium text-foreground">{investment.plan?.name || 'Investment Plan'}</p><p className="text-xs text-muted-foreground">+${investment.daily_profit.toFixed(2)}/day</p></div></div>
                      <div className="text-right"><p className="font-semibold text-blue-400">${investment.amount.toFixed(2)}</p><Badge variant="secondary" className={statusColors[investment.status]}>{investment.status}</Badge></div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}