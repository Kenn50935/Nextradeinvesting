'use client';

import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket } from 'lucide-react';

export default function TicketsPage() {
  const { profile } = useAuth();
  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold text-foreground">Tickets</h1><p className="text-muted-foreground mt-1">Purchase tickets for special rewards</p></div>
      <Card className="bg-card border-border">
        <CardContent className="p-8 text-center">
          <Ticket className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No tickets available</p>
        </CardContent>
      </Card>
    </div>
  );
}