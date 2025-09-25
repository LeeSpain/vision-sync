import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function ProjectManager() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Project Manager</h2>
          <p className="text-muted-foreground">Project management is temporarily disabled</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Management Under Development</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Badge variant="secondary">Schema Migration in Progress</Badge>
            <p className="text-muted-foreground">
              The project management features are being updated to align with the new database schema.
              Core admin functionality for templates, AI agents, and conversations is fully operational.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-emerald-green">✅ Template Manager</h3>
                <p className="text-sm text-muted-foreground">Fully functional</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-emerald-green">✅ AI Agent Manager</h3>
                <p className="text-sm text-muted-foreground">Fully functional</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-emerald-green">✅ Conversations Manager</h3>
                <p className="text-sm text-muted-foreground">Fully functional</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}