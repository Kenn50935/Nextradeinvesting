'use client';

import { useAuth } from '@/lib/auth-context';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export default function ReferralsPage() {
  const { profile } = useAuth();
  if (!profile) return null;

  const referralLink = typeof window !== 'undefined' ? `${window.location.origin}/auth/register?ref=${profile.referral_code}` : '';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground">Referrals</h1><p className="text-muted-foreground mt-1">Invite friends and earn 10% commission on their investments</p></div>
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div><p className="text-sm text-muted-foreground mb-2">Your Referral Link</p><div className="p-4 bg-secondary/30 rounded-lg break-all text-sm font-mono text-foreground">{referralLink}</div></div>
            <button onClick={() => navigator.clipboard.writeText(referralLink)} className="btn-primary">Copy Link</button>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6"><p className="text-sm text-muted-foreground">Total Referrals</p><p className="text-3xl font-bold text-foreground">0</p></CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6"><p className="text-sm text-muted-foreground">Total Earnings</p><p className="text-3xl font-bold text-green-400">${profile.total_referral_earnings.toFixed(2)}</p></CardContent>
        </Card>
      </div>
    </div>
  );
}