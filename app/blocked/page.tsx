'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ShieldX } from 'lucide-react';

export default function BlockedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="bg-card border-border max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <ShieldX className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Account Blocked</h1>
          <p className="text-muted-foreground">Your account has been blocked. Please contact support for assistance.</p>
        </CardContent>
      </Card>
    </div>
  );
}