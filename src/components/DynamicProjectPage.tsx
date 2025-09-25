import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DynamicProjectPage() {
  const { projectRoute } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal-purple via-electric-blue to-emerald-green">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Project: {projectRoute}</CardTitle>
            <CardDescription>
              Dynamic project pages are temporarily disabled while we update the database schema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Badge variant="secondary" className="text-sm">
                Under Development
              </Badge>
              <p className="text-muted-foreground">
                This feature will be restored once the project schema migration is complete.
                The core admin functionality for templates, AI agents, and conversations is working properly.
              </p>
              <div className="flex gap-4">
                <a 
                  href="/" 
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Return Home
                </a>
                <a 
                  href="/admin" 
                  className="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
                >
                  Go to Admin
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}