'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export default function AdminPlansPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground">Manage Plans</h1><p className="text-muted-foreground mt-1">Create and manage investment plans</p></div>
      <Card className="bg-card border-border">
        <CardContent className="p-8 text-center">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">Plans management panel</p>
        </CardContent>
      </Card>
    </div>
  );
}