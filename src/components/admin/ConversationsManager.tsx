import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Download, 
  Eye, 
  Bot,
  MessageCircle,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  Filter,
  BarChart3,
  Star,
  User,
  Zap
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Conversation {
  id: string;
  session_id: string;
  agent_id: string | null;
  lead_id: string | null;
  visitor_id: string | null;
  status: string;
  lead_qualified: boolean;
  conversion_score: number;
  conversation_data: any;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ConversationStats {
  total: number;
  active: number;
  qualified: number;
  avgConversionScore: number;
  today: number;
  week: number;
  avgDuration: number;
  totalMessages: number;
}

export function ConversationsManager() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [qualificationFilter, setQualificationFilter] = useState<string>('all');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [stats, setStats] = useState<ConversationStats>({
    total: 0,
    active: 0,
    qualified: 0,
    avgConversionScore: 0,
    today: 0,
    week: 0,
    avgDuration: 0,
    totalMessages: 0
  });

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    filterConversations();
  }, [conversations, searchTerm, statusFilter, qualificationFilter]);

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setConversations(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    }
  };

  const calculateStats = (convos: Conversation[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const totalMessages = convos.reduce((sum, conv) => {
      const data = Array.isArray(conv.conversation_data) ? conv.conversation_data : [];
      return sum + data.length;
    }, 0);
    const qualifiedCount = convos.filter(conv => conv.lead_qualified).length;
    const avgConversionScore = convos.length > 0 ? 
      convos.reduce((sum, conv) => sum + conv.conversion_score, 0) / convos.length : 0;

    const todayConversations = convos.filter(conv => 
      new Date(conv.created_at) >= today
    ).length;

    const weekConversations = convos.filter(conv => 
      new Date(conv.created_at) >= weekAgo
    ).length;

    const completedConversations = convos.filter(conv => conv.ended_at);
    const avgDuration = completedConversations.length > 0 ? 
      completedConversations.reduce((sum, conv) => {
        const start = new Date(conv.started_at);
        const end = new Date(conv.ended_at!);
        return sum + (end.getTime() - start.getTime());
      }, 0) / completedConversations.length / 1000 / 60 : 0; // Average in minutes

    setStats({
      total: convos.length,
      active: convos.filter(conv => conv.status === 'active').length,
      qualified: qualifiedCount,
      avgConversionScore: Math.round(avgConversionScore),
      today: todayConversations,
      week: weekConversations,
      avgDuration: Math.round(avgDuration),
      totalMessages
    });
  };

  const filterConversations = () => {
    let filtered = conversations;

    if (searchTerm) {
      filtered = filtered.filter(conv =>
        conv.session_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.visitor_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (Array.isArray(conv.conversation_data) && conv.conversation_data.some((msg: any) => 
          msg.content?.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(conv => conv.status === statusFilter);
    }

    if (qualificationFilter !== 'all') {
      if (qualificationFilter === 'qualified') {
        filtered = filtered.filter(conv => conv.lead_qualified);
      } else if (qualificationFilter === 'unqualified') {
        filtered = filtered.filter(conv => !conv.lead_qualified);
      }
    }

    setFilteredConversations(filtered);
  };

  const exportConversations = async () => {
    try {
      const csvData = [
        ['Session ID', 'Agent ID', 'Status', 'Qualified', 'Conversion Score', 'Messages', 'Started', 'Duration', 'Lead ID'].join(','),
        ...filteredConversations.map(conv => [
          conv.session_id,
          conv.agent_id || 'N/A',
          conv.status,
          conv.lead_qualified ? 'Yes' : 'No',
          conv.conversion_score,
          Array.isArray(conv.conversation_data) ? conv.conversation_data.length : 0,
          new Date(conv.started_at).toLocaleString(),
          conv.ended_at ? `${Math.round((new Date(conv.ended_at).getTime() - new Date(conv.started_at).getTime()) / 1000 / 60)}min` : 'Ongoing',
          conv.lead_id || 'N/A'
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai_conversations_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Conversations exported successfully",
      });
    } catch (error) {
      console.error('Error exporting conversations:', error);
      toast({
        title: "Error",
        description: "Failed to export conversations",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (startDate: string, endDate?: string | null) => {
    if (!endDate) return 'Ongoing';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.round((end.getTime() - start.getTime()) / 1000 / 60);
    return `${duration}min`;
  };

  const getQualificationColor = (qualified: boolean, score: number) => {
    if (qualified) return 'bg-emerald-green text-white';
    if (score >= 70) return 'bg-royal-purple text-white';
    if (score >= 50) return 'bg-electric-blue text-white';
    return 'bg-cool-gray text-white';
  };

  const renderConversationMessages = (conversation: Conversation) => {
    const messages = Array.isArray(conversation.conversation_data) ? conversation.conversation_data : [];
    
    if (messages.length === 0) {
      return <p className="text-cool-gray text-center py-8">No messages in this conversation</p>;
    }

    return (
      <ScrollArea className="h-96 w-full">
        <div className="space-y-4 pr-4">
          {messages.map((message: any, index: number) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-royal-purple text-white'
                    : 'bg-soft-lilac/20 text-midnight-navy'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                  <span className="text-xs font-medium">
                    {message.role === 'user' ? 'Visitor' : 'AI Agent'}
                  </span>
                  {message.timestamp && (
                    <span className="text-xs opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                <p className="text-sm">{message.content || message.message}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageCircle className="h-4 w-4 text-cool-gray" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-midnight-navy">{stats.total}</div>
            <p className="text-xs text-cool-gray">{stats.totalMessages} total messages</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
            <Star className="h-4 w-4 text-emerald-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-green">{stats.qualified}</div>
            <p className="text-xs text-cool-gray">
              {stats.total > 0 ? Math.round((stats.qualified / stats.total) * 100) : 0}% qualification rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-royal-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-royal-purple">{stats.avgConversionScore}</div>
            <p className="text-xs text-cool-gray">Conversion potential</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <Zap className="h-4 w-4 text-electric-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-electric-blue">{stats.active}</div>
            <p className="text-xs text-cool-gray">Currently ongoing</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-subtle rounded-lg">
                  <div className="text-2xl font-bold text-royal-purple">{stats.today}</div>
                  <div className="text-sm text-cool-gray">Today</div>
                </div>
                <div className="text-center p-4 bg-gradient-subtle rounded-lg">
                  <div className="text-2xl font-bold text-emerald-green">{stats.week}</div>
                  <div className="text-sm text-cool-gray">This Week</div>
                </div>
              </div>
              <div className="pt-2 border-t border-soft-lilac/30">
                <div className="flex justify-between text-sm">
                  <span>Avg Duration:</span>
                  <span className="font-medium">{stats.avgDuration}min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Messages/Conversation:</span>
                  <span className="font-medium">
                    {stats.total > 0 ? Math.round(stats.totalMessages / stats.total) : 0}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Qualification Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-cool-gray">High Quality (Score 80+)</span>
                <Badge className="bg-emerald-green text-white">
                  {conversations.filter(c => c.conversion_score >= 80).length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-cool-gray">Medium Quality (Score 50-79)</span>
                <Badge className="bg-royal-purple text-white">
                  {conversations.filter(c => c.conversion_score >= 50 && c.conversion_score < 80).length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-cool-gray">Low Quality (Score &lt;50)</span>
                <Badge className="bg-cool-gray text-white">
                  {conversations.filter(c => c.conversion_score < 50).length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Conversations
            </span>
            <div className="flex gap-2">
              <Button onClick={exportConversations} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Monitor and analyze all AI chat interactions with visitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cool-gray" />
                <Input
                  placeholder="Search by session ID, visitor ID, or message content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="ended">Ended</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={qualificationFilter} onValueChange={setQualificationFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by qualification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conversations</SelectItem>
                  <SelectItem value="qualified">Qualified Only</SelectItem>
                  <SelectItem value="unqualified">Unqualified Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-soft-lilac/30">
                  <th className="text-left p-3 font-medium text-midnight-navy">Session</th>
                  <th className="text-left p-3 font-medium text-midnight-navy">Status</th>
                  <th className="text-left p-3 font-medium text-midnight-navy">Qualification</th>
                  <th className="text-left p-3 font-medium text-midnight-navy">Score</th>
                  <th className="text-left p-3 font-medium text-midnight-navy">Messages</th>
                  <th className="text-left p-3 font-medium text-midnight-navy">Duration</th>
                  <th className="text-left p-3 font-medium text-midnight-navy">Started</th>
                  <th className="text-left p-3 font-medium text-midnight-navy">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredConversations.map((conversation) => (
                  <tr key={conversation.id} className="border-b border-soft-lilac/20 hover:bg-soft-lilac/10">
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-midnight-navy font-mono text-sm">
                          {conversation.session_id.slice(0, 8)}...
                        </div>
                        {conversation.visitor_id && (
                          <div className="text-xs text-cool-gray">
                            Visitor: {conversation.visitor_id.slice(0, 8)}...
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant={conversation.status === 'active' ? 'default' : 'secondary'}>
                        {conversation.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={getQualificationColor(conversation.lead_qualified, conversation.conversion_score)}>
                        {conversation.lead_qualified ? 'Qualified' : 'Not Qualified'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{conversation.conversion_score}</div>
                        <div className="w-12 h-2 bg-soft-lilac/30 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-primary"
                            style={{ width: `${conversation.conversion_score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-cool-gray">
                      {Array.isArray(conversation.conversation_data) ? conversation.conversation_data.length : 0}
                    </td>
                    <td className="p-3 text-sm text-cool-gray">
                      {formatDuration(conversation.started_at, conversation.ended_at)}
                    </td>
                    <td className="p-3 text-sm text-cool-gray">
                      {formatDate(conversation.started_at)}
                    </td>
                    <td className="p-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedConversation(conversation)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh]">
                          <DialogHeader>
                            <DialogTitle>Conversation Details</DialogTitle>
                            <DialogDescription>
                              Session: {conversation.session_id} • Started: {formatDate(conversation.started_at)}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedConversation && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 p-4 bg-soft-lilac/10 rounded-lg">
                                <div>
                                  <span className="text-sm font-medium">Status:</span>
                                  <Badge className="ml-2" variant={conversation.status === 'active' ? 'default' : 'secondary'}>
                                    {conversation.status}
                                  </Badge>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Qualification:</span>
                                  <Badge className={`ml-2 ${getQualificationColor(conversation.lead_qualified, conversation.conversion_score)}`}>
                                    {conversation.lead_qualified ? 'Qualified' : 'Not Qualified'}
                                  </Badge>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Conversion Score:</span>
                                  <span className="ml-2 font-bold">{conversation.conversion_score}/100</span>
                                </div>
                                <div>
                                  <span className="text-sm font-medium">Duration:</span>
                                  <span className="ml-2">{formatDuration(conversation.started_at, conversation.ended_at)}</span>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-3">Conversation Messages</h4>
                                {renderConversationMessages(conversation)}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredConversations.length === 0 && (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-cool-gray mx-auto mb-4" />
              <p className="text-cool-gray">No conversations found matching your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}