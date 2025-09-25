import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function RealTimeAnalytics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Real-Time Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Badge variant="secondary">Coming Soon</Badge>
          <p className="text-muted-foreground">
            Real-time analytics will be available after the schema migration is complete.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}