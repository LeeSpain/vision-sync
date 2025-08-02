import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Conversation = Database['public']['Tables']['ai_conversations']['Row'];

interface ConversationStats {
  total: number;
  active: number;
  qualified: number;
  avgScore: number;
  todayTotal: number;
}

const ConversationsAnalytics: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [stats, setStats] = useState<ConversationStats>({
    total: 0,
    active: 0,
    qualified: 0,
    avgScore: 0,
    todayTotal: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const { toast } = useToast();

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setConversations(data || []);
      
      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayConversations = data?.filter(conv => 
        conv.created_at.startsWith(today)
      ) || [];
      
      const qualified = data?.filter(conv => conv.lead_qualified) || [];
      const active = data?.filter(conv => conv.status === 'active') || [];
      const avgScore = data?.length > 0 
        ? data.reduce((sum, conv) => sum + (conv.conversion_score || 0), 0) / data.length 
        : 0;

      setStats({
        total: data?.length || 0,
        active: active.length,
        qualified: qualified.length,
        avgScore: Math.round(avgScore),
        todayTotal: todayConversations.length
      });
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();

    // Set up real-time subscription
    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_conversations'
        },
        () => {
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatDuration = (startedAt: string, endedAt: string | null) => {
    const start = new Date(startedAt);
    const end = endedAt ? new Date(endedAt) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    return `${diffMins}m`;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      completed: 'secondary',
      abandoned: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-green';
    if (score >= 60) return 'text-coral-orange';
    return 'text-cool-gray';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4 text-royal-purple" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Conversations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-coral-orange" />
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Active Now</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-emerald-green" />
              <div>
                <p className="text-2xl font-bold">{stats.qualified}</p>
                <p className="text-xs text-muted-foreground">Qualified Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-royal-purple" />
              <div>
                <p className="text-2xl font-bold">{stats.avgScore}%</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-emerald-green" />
              <div>
                <p className="text-2xl font-bold">{stats.todayTotal}</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversations Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Conversations</CardTitle>
            <p className="text-sm text-muted-foreground">
              Real-time conversation monitoring and analytics
            </p>
          </div>
          <Button onClick={loadConversations} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Qualified</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Messages</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conversations.map((conversation) => (
                  <TableRow key={conversation.id}>
                    <TableCell className="font-mono text-xs">
                      {conversation.session_id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(conversation.status)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(conversation.started_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {formatDuration(conversation.started_at, conversation.ended_at)}
                    </TableCell>
                    <TableCell>
                      {conversation.lead_qualified ? (
                        <CheckCircle className="h-4 w-4 text-emerald-green" />
                      ) : (
                        <XCircle className="h-4 w-4 text-cool-gray" />
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={getScoreColor(conversation.conversion_score)}>
                        {conversation.conversion_score}%
                      </span>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        try {
                          const data = typeof conversation.conversation_data === 'string' 
                            ? JSON.parse(conversation.conversation_data) 
                            : conversation.conversation_data;
                          return Array.isArray(data) ? data.length : 0;
                        } catch {
                          return 0;
                        }
                      })()}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => setSelectedConversation(conversation)}
                        variant="ghost"
                        size="sm"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Conversation Detail Modal */}
      {selectedConversation && (
        <Card className="fixed inset-4 z-50 bg-background border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Conversation Details</CardTitle>
              <p className="text-sm text-muted-foreground">
                Session: {selectedConversation.session_id}
              </p>
            </div>
            <Button 
              onClick={() => setSelectedConversation(null)}
              variant="ghost"
              size="sm"
            >
              ×
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-sm text-muted-foreground">{selectedConversation.status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Lead Qualified</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.lead_qualified ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Conversion Score</p>
                    <p className="text-sm text-muted-foreground">{selectedConversation.conversion_score}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Visitor ID</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {selectedConversation.visitor_id || 'Anonymous'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Conversation Data</p>
                  <div className="space-y-2">
                    {(() => {
                      try {
                        const data = typeof selectedConversation.conversation_data === 'string' 
                          ? JSON.parse(selectedConversation.conversation_data) 
                          : selectedConversation.conversation_data;
                        
                        if (Array.isArray(data) && data.length > 0) {
                          return data.map((message, index) => (
                            <div key={index} className="p-3 bg-muted rounded-lg">
                              <pre className="text-xs whitespace-pre-wrap">
                                {JSON.stringify(message, null, 2)}
                              </pre>
                            </div>
                          ));
                        }
                        return <p className="text-sm text-muted-foreground">No conversation data available</p>;
                      } catch {
                        return <p className="text-sm text-muted-foreground">Invalid conversation data format</p>;
                      }
                    })()}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConversationsAnalytics;