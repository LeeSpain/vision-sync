import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabaseLeadManager } from '@/utils/supabaseLeadManager';
import { 
  Calendar,
  User,
  Mail,
  Phone,
  ArrowUpRight,
  Clock,
  AlertCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function RecentActivity() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentActivity();
  }, []);

  const loadRecentActivity = async () => {
    try {
      setLoading(true);
      const leads = await supabaseLeadManager.getAllLeads();
      
      // Sort by creation date and take the most recent 8
      const recentLeads = leads
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 8);

      // Transform leads into activity items
      const activityItems = recentLeads.map(lead => ({
        id: lead.id,
        type: 'lead_created',
        title: `New ${getLeadTypeDisplay(lead)} inquiry`,
        subtitle: `${lead.name} - ${lead.email}`,
        timestamp: lead.created_at,
        priority: lead.priority,
        source: lead.source,
        lead: lead
      }));

      setActivities(activityItems);
    } catch (error) {
      console.error('Error loading recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLeadTypeDisplay = (lead: any) => {
    if (lead.form_data?.inquiry_type) {
      return lead.form_data.inquiry_type;
    }
    if (lead.source === 'custom_build') return 'Custom Build';
    if (lead.source === 'investor') return 'Investment';
    if (lead.source?.includes('project')) return 'Project';
    return 'Contact';
  };

  const getActivityIcon = (type: string, priority: string) => {
    if (priority === 'high') return AlertCircle;
    return User;
  };

  const getActivityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-coral-orange';
      case 'medium': return 'text-electric-blue';
      case 'low': return 'text-cool-gray';
      default: return 'text-midnight-navy';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="font-heading">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-heading">Recent Activity</CardTitle>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => window.location.hash = 'leads'}
          className="text-royal-purple hover:text-royal-purple/80"
        >
          View All
          <ArrowUpRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-cool-gray">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
            </div>
          ) : (
            activities.map((activity) => {
              const Icon = getActivityIcon(activity.type, activity.priority);
              const timeAgo = formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true });
              
              return (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-white/50 hover:bg-slate-white/80 transition-colors cursor-pointer"
                  onClick={() => window.location.hash = 'leads'}
                >
                  <div className={`p-2 rounded-full bg-gradient-subtle ${getActivityColor(activity.priority)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-midnight-navy truncate">
                        {activity.title}
                      </p>
                      <Badge 
                        variant={getPriorityBadgeVariant(activity.priority)}
                        className="text-xs"
                      >
                        {activity.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-cool-gray truncate mb-1">
                      {activity.subtitle}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-cool-gray">
                      <span>{timeAgo}</span>
                      <span>•</span>
                      <span className="capitalize">{activity.source?.replace('_', ' ')}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    {activity.lead.phone && (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Phone className="h-3 w-3" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`mailto:${activity.lead.email}`);
                      }}
                    >
                      <Mail className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}