'use client';

import { Card, CardContent } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

export default function AdminDepositsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground">Manage Deposits</h1><p className="text-muted-foreground mt-1">Review and approve deposit requests</p></div>
      <Card className="bg-card border-border">
        <CardContent className="p-8 text-center">
          <DollarSign className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">Deposit management panel</p>
        </CardContent>
      </Card>
    </div>
  );
}