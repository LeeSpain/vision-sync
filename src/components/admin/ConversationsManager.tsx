import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

// Updated interface to match actual database schema
interface Conversation {
  id: string;
  agent_id: string | null;
  ai_response: string | null;
  context: any;
  created_at: string;
  session_id: string | null;
  user_message: string;
}

interface ConversationStats {
  totalConversations: number;
  activeChats: number;
  qualificationRate: number;
  averageScore: number;
  totalMessages: number;
  avgMessagesPerConvo: number;
}

export function ConversationsManager() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [qualificationFilter, setQualificationFilter] = useState<string>('all');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [stats, setStats] = useState<ConversationStats>({
    totalConversations: 0,
    activeChats: 0,
    qualificationRate: 0,
    averageScore: 0,
    totalMessages: 0,
    avgMessagesPerConvo: 0
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
    const totalConversations = convos.length;
    const activeChats = convos.filter(c => c.session_id).length;
    const qualifiedLeads = Math.floor(convos.length * 0.3); // Mock calculation
    const avgScore = 7.5; // Mock average score
    const totalMessages = convos.length * 2; // Estimate 2 messages per conversation

    setStats({
      totalConversations,
      activeChats,
      qualificationRate: totalConversations > 0 ? (qualifiedLeads / totalConversations) * 100 : 0,
      averageScore: avgScore,
      totalMessages,
      avgMessagesPerConvo: 2
    });
  };

  const filterConversations = () => {
    let filtered = conversations;

    if (searchTerm) {
      filtered = filtered.filter(conv =>
        conv.session_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.user_message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.ai_response?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(conv => conv.session_id);
      } else if (statusFilter === 'ended') {
        filtered = filtered.filter(conv => !conv.session_id);
      }
    }

    if (qualificationFilter !== 'all') {
      // Mock qualification filtering
      if (qualificationFilter === 'qualified') {
        filtered = filtered.filter((_, index) => index % 3 === 0);
      } else if (qualificationFilter === 'unqualified') {
        filtered = filtered.filter((_, index) => index % 3 !== 0);
      }
    }

    setFilteredConversations(filtered);
  };

  const exportConversations = async () => {
    try {
      const csvData = [
        ['ID', 'Session ID', 'Agent ID', 'User Message', 'AI Response', 'Created At'].join(','),
        ...filteredConversations.map(conv => [
          conv.id,
          conv.session_id || 'N/A',
          conv.agent_id || 'N/A',
          `"${conv.user_message.replace(/"/g, '""')}"`,
          `"${(conv.ai_response || '').replace(/"/g, '""')}"`,
          new Date(conv.created_at).toLocaleString()
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
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.floor(durationMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const getQualificationColor = (qualified: boolean, score: number) => {
    if (!qualified) return "bg-red-500";
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const renderConversationMessages = (conversation: Conversation) => {
    return (
      <ScrollArea className="h-96 w-full">
        <div className="space-y-4 pr-4">
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-soft-lilac/20 text-midnight-navy">
              <div className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4" />
                <span className="text-xs font-medium">User</span>
                <span className="text-xs opacity-70">
                  {new Date(conversation.created_at).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm">{conversation.user_message}</p>
            </div>
          </div>
          
          {conversation.ai_response && (
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-lg p-3 bg-royal-purple text-white">
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="h-4 w-4" />
                  <span className="text-xs font-medium">AI Agent</span>
                </div>
                <p className="text-sm">{conversation.ai_response}</p>
              </div>
            </div>
          )}
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
            <div className="text-2xl font-bold text-midnight-navy">{stats.totalConversations}</div>
            <p className="text-xs text-cool-gray">{stats.totalMessages} total messages</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
            <Star className="h-4 w-4 text-emerald-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-green">
              {Math.floor(stats.totalConversations * 0.3)}
            </div>
            <p className="text-xs text-cool-gray">
              {stats.qualificationRate.toFixed(1)}% qualification rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-royal-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-royal-purple">{stats.averageScore}</div>
            <p className="text-xs text-cool-gray">Conversion potential</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <Zap className="h-4 w-4 text-electric-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-electric-blue">{stats.activeChats}</div>
            <p className="text-xs text-cool-gray">Currently ongoing</p>
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
                  placeholder="Search by session ID or message content..."
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Qualification</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConversations.map((conversation) => (
                  <TableRow key={conversation.id}>
                    <TableCell className="font-mono text-sm">
                      {conversation.session_id?.slice(0, 8) || conversation.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={conversation.session_id ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {conversation.session_id ? 'Active' : 'Completed'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDate(conversation.created_at)}
                    </TableCell>
                    <TableCell>
                      {formatDuration(conversation.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`text-white ${getQualificationColor(Math.random() > 0.7, Math.floor(Math.random() * 10) + 1)}`}
                      >
                        {Math.random() > 0.7 ? 'Qualified' : 'Not Qualified'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`font-medium text-green-600`}>
                        {(Math.floor(Math.random() * 5) + 6)}/10
                      </span>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedConversation(conversation)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Conversation Details</DialogTitle>
                            <DialogDescription>
                              Session: {conversation.session_id || conversation.id}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedConversation && renderConversationMessages(selectedConversation)}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredConversations.length === 0 && (
            <div className="text-center py-8 text-cool-gray">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No conversations found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}