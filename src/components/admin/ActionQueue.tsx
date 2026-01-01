import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { supabaseLeadManager } from '@/utils/supabaseLeadManager';
import { 
  Clock, 
  AlertTriangle, 
  User, 
  MessageCircle,
  ChevronRight,
  CheckCircle,
  Phone,
  Mail
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActionItem {
  id: string;
  type: 'follow-up' | 'high-priority' | 'escalation' | 'new-lead';
  title: string;
  subtitle: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  actionUrl: string;
}

export function ActionQueue() {
  const [items, setItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActionItems();
  }, []);

  const loadActionItems = async () => {
    try {
      setLoading(true);
      const actionItems: ActionItem[] = [];

      // 1. Follow-ups due
      const allLeads = await supabaseLeadManager.getAllLeads();
      const now = new Date();
      
      const followUpsDue = allLeads
        .filter(lead => lead.next_follow_up && new Date(lead.next_follow_up) <= now)
        .slice(0, 3)
        .map(lead => ({
          id: `followup-${lead.id}`,
          type: 'follow-up' as const,
          title: `Follow up with ${lead.name}`,
          subtitle: lead.company || lead.email,
          timestamp: lead.next_follow_up!,
          priority: 'high' as const,
          actionUrl: '#leads'
        }));
      
      actionItems.push(...followUpsDue);

      // 2. High priority leads
      const highPriorityLeads = allLeads
        .filter(lead => lead.priority === 'high' && lead.status === 'new')
        .slice(0, 3)
        .map(lead => ({
          id: `priority-${lead.id}`,
          type: 'high-priority' as const,
          title: lead.name,
          subtitle: `${lead.budget_range || 'Budget TBD'} • ${lead.source || 'Direct'}`,
          timestamp: lead.created_at || new Date().toISOString(),
          priority: 'high' as const,
          actionUrl: '#leads'
        }));
      
      actionItems.push(...highPriorityLeads);

      // 3. Pending escalations
      const { data: escalations } = await supabase
        .from('human_escalations')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(3);

      if (escalations) {
        const escalationItems = escalations.map(esc => ({
          id: `esc-${esc.id}`,
          type: 'escalation' as const,
          title: 'Human escalation needed',
          subtitle: esc.reason.slice(0, 50) + (esc.reason.length > 50 ? '...' : ''),
          timestamp: esc.created_at || new Date().toISOString(),
          priority: esc.priority === 'urgent' ? 'high' as const : 'medium' as const,
          actionUrl: '#brain-command'
        }));
        actionItems.push(...escalationItems);
      }

      // 4. Newest leads (fill remaining slots)
      const newestLeads = allLeads
        .filter(lead => lead.status === 'new')
        .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        .slice(0, Math.max(0, 5 - actionItems.length))
        .map(lead => ({
          id: `new-${lead.id}`,
          type: 'new-lead' as const,
          title: `New lead: ${lead.name}`,
          subtitle: lead.company || lead.email,
          timestamp: lead.created_at || new Date().toISOString(),
          priority: 'medium' as const,
          actionUrl: '#leads'
        }));

      actionItems.push(...newestLeads);

      // Sort by priority and timestamp
      actionItems.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });

      setItems(actionItems.slice(0, 5));
    } catch (error) {
      console.error('Error loading action items:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: ActionItem['type']) => {
    switch (type) {
      case 'follow-up': return <Clock className="h-4 w-4" />;
      case 'high-priority': return <AlertTriangle className="h-4 w-4" />;
      case 'escalation': return <MessageCircle className="h-4 w-4" />;
      case 'new-lead': return <User className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: ActionItem['type']) => {
    switch (type) {
      case 'follow-up': return 'text-amber-500 bg-amber-500/10';
      case 'high-priority': return 'text-coral-orange bg-coral-orange/10';
      case 'escalation': return 'text-royal-purple bg-royal-purple/10';
      case 'new-lead': return 'text-emerald-green bg-emerald-green/10';
    }
  };

  const handleAction = (item: ActionItem) => {
    window.location.hash = item.actionUrl.replace('#', '');
  };

  if (loading) {
    return (
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-coral-orange" />
            Action Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-soft-lilac/20 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-coral-orange" />
            Action Queue
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {items.length} pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <div className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-emerald-green mx-auto mb-2" />
            <p className="text-sm text-cool-gray">All caught up!</p>
          </div>
        ) : (
          <ScrollArea className="h-[320px]">
            <div className="space-y-1 p-4 pt-0">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleAction(item)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-soft-lilac/10 transition-colors text-left group"
                >
                  <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-midnight-navy truncate">
                      {item.title}
                    </div>
                    <div className="text-xs text-cool-gray truncate">
                      {item.subtitle}
                    </div>
                    <div className="text-xs text-cool-gray/70 mt-0.5">
                      {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-cool-gray opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
