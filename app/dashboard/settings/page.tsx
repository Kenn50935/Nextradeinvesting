'use client';

import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  const { profile, signOut } = useAuth();
  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground">Settings</h1><p className="text-muted-foreground mt-1">Manage your account settings</p></div>
      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="text-foreground">Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><p className="text-sm text-muted-foreground">Full Name</p><p className="text-foreground">{profile.full_name || 'Not set'}</p></div>
          <div><p className="text-sm text-muted-foreground">Email</p><p className="text-foreground">{profile.email}</p></div>
          <div><p className="text-sm text-muted-foreground">Phone</p><p className="text-foreground">{profile.phone || 'Not set'}</p></div>
        </CardContent>
      </Card>
      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="text-foreground">Referral Code</CardTitle></CardHeader>
        <CardContent><p className="font-mono text-lg text-foreground">{profile.referral_code}</p></CardContent>
      </Card>
    </div>
  );
}