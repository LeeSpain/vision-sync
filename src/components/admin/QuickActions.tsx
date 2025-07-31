import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Users, 
  Plus, 
  Eye, 
  BarChart3, 
  Settings,
  FileText,
  Download,
  RefreshCw
} from 'lucide-react';

interface QuickActionsProps {
  stats?: any;
  onRefresh?: () => void;
}

export function QuickActions({ stats, onRefresh }: QuickActionsProps) {
  const quickActionItems = [
    {
      title: 'View Messages',
      icon: Mail,
      action: () => window.location.hash = 'messages',
      badge: stats?.newLeads > 0 ? stats.newLeads : null,
      description: 'Check new inquiries'
    },
    {
      title: 'Manage Leads',
      icon: Users,
      action: () => window.location.hash = 'leads',
      badge: stats?.followUpNeeded > 0 ? stats.followUpNeeded : null,
      description: 'Follow up required'
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      action: () => window.location.hash = 'analytics',
      badge: null,
      description: 'View performance'
    },
    {
      title: 'Preview Site',
      icon: Eye,
      action: () => window.open('/', '_blank'),
      badge: null,
      description: 'Check live site'
    }
  ];

  const secondaryActions = [
    {
      title: 'Add Project',
      icon: Plus,
      action: () => window.location.hash = 'projects',
      variant: 'outline' as const
    },
    {
      title: 'Export Data',
      icon: Download,
      action: () => {
        // This will be handled by the leads manager
        window.location.hash = 'leads';
      },
      variant: 'outline' as const
    },
    {
      title: 'Settings',
      icon: Settings,
      action: () => window.location.hash = 'settings',
      variant: 'outline' as const
    },
    {
      title: 'Refresh',
      icon: RefreshCw,
      action: onRefresh,
      variant: 'ghost' as const
    }
  ];

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="font-heading">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Actions */}
        <div className="grid grid-cols-2 gap-3">
          {quickActionItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.title}
                variant="premium"
                className="h-20 flex-col gap-2 relative"
                onClick={item.action}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {item.badge && (
                    <Badge variant="secondary" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{item.title}</div>
                  {item.description && (
                    <div className="text-xs opacity-80">{item.description}</div>
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-4 gap-2">
          {secondaryActions.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.title}
                variant={item.variant}
                size="sm"
                className="h-12 flex-col gap-1"
                onClick={item.action}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{item.title}</span>
              </Button>
            );
          })}
        </div>

        {/* Business Insights */}
        {stats && (
          <div className="pt-4 border-t border-soft-lilac/30">
            <div className="text-sm font-medium text-midnight-navy mb-2">Today's Summary</div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-royal-purple">{stats.todayLeads || 0}</div>
                <div className="text-xs text-cool-gray">New Leads</div>
              </div>
              <div>
                <div className="text-lg font-bold text-emerald-green">{stats.qualified || 0}</div>
                <div className="text-xs text-cool-gray">Qualified</div>
              </div>
              <div>
                <div className="text-lg font-bold text-electric-blue">{stats.converted || 0}</div>
                <div className="text-xs text-cool-gray">Converted</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}