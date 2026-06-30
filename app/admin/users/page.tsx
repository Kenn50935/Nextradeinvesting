'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground">Manage Users</h1><p className="text-muted-foreground mt-1">View and manage user accounts</p></div>
      <Card className="bg-card border-border">
        <CardContent className="p-8 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">User management panel</p>
        </CardContent>
      </Card>
    </div>
  );
}