'use client';

import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingUp, Users, ArrowUpRight, Gift } from 'lucide-react';

const chartData = [{ name: 'Mon', value: 1200 }, { name: 'Tue', value: 1800 }, { name: 'Wed', value: 2400 }, { name: 'Thu', value: 2100 }, { name: 'Fri', value: 2800 }, { name: 'Sat', value: 3200 }, { name: 'Sun', value: 3600 }];

export default function DashboardOverview() {
  const { profile } = useAuth();
  if (!profile) return null;
  const stats = [
    { title: 'Wallet Balance', value: `$${profile.wallet_balance.toFixed(2)}`, icon: Wallet, color: 'from-blue-500 to-cyan-500' },
    { title: 'Active Investment', value: `$${profile.total_invested.toFixed(2)}`, icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
    { title: 'Daily Profit', value: '$0.00', icon: ArrowUpRight, color: 'from-amber-500 to-orange-500' },
    { title: 'Referral Earnings', value: `$${profile.total_referral_earnings.toFixed(2)}`, icon: Users, color: 'from-purple-500 to-pink-500' },
  ];
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground">Welcome back, {profile.full_name?.split(' ')[0] || 'Investor'}!</h1><p className="text-muted-foreground mt-1">Here&apos;s an overview of your investment portfolio</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}><stat.icon className="w-5 h-5 text-white" /></div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-foreground">Portfolio Growth</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64 flex items-end gap-2 px-4">
                {chartData.map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-gradient-to-t from-primary/50 to-primary/10 rounded-t" style={{ height: `${(item.value / 4000) * 100}%` }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Total Deposited</span><span className="font-semibold text-foreground">${profile.total_deposited.toFixed(2)}</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Total Withdrawn</span><span className="font-semibold text-foreground">${profile.total_withdrawn.toFixed(2)}</span></div>
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Total Invested</span><span className="font-semibold text-foreground">${profile.total_invested.toFixed(2)}</span></div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3"><Gift className="w-5 h-5 text-blue-400" /><span className="font-medium text-foreground">Referral Link</span></div>
              <div className="p-2 bg-secondary/30 rounded-lg text-xs text-muted-foreground break-all mb-3">
                {typeof window !== 'undefined' ? `${window.location.origin}/auth/register?ref=${profile.referral_code}` : '...'}
              </div>
              <button onClick={() => { if (typeof window !== 'undefined') navigator.clipboard.writeText(`${window.location.origin}/auth/register?ref=${profile.referral_code}`); }} className="text-sm text-blue-400 hover:text-blue-300">Copy link</button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="text-foreground">Active Investments</CardTitle></CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No active investments yet</p>
            <a href="/dashboard/invest" className="text-primary hover:underline text-sm mt-2 inline-block">Start investing</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}