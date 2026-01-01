import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, 
  MessageSquare, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Send, 
  Sparkles,
  RefreshCw,
  ExternalLink,
  UserCheck,
  Clock,
  HeadphonesIcon
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from 'date-fns';

interface Conversation {
  id: string;
  session_id: string;
  current_agent_id: string;
  user_message: string;
  ai_response: string;
  sentiment: number;
  intent: string;
  status: string;
  created_at: string;
  agent?: { name: string; agent_type: string };
}

interface Escalation {
  id: string;
  conversation_id: string;
  reason: string;
  priority: string;
  status: string;
  assigned_to: string | null;
  created_at: string;
}

interface AgentPerformance {
  id: string;
  name: string;
  agent_type: string;
  conversationsToday: number;
  avgSentiment: number;
  leadsGenerated: number;
  escalations: number;
}

interface BrainMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const BrainAgentDashboard: React.FC = () => {
  // Stats state
  const [activeConversations, setActiveConversations] = useState(0);
  const [todaysLeads, setTodaysLeads] = useState(0);
  const [pendingEscalations, setPendingEscalations] = useState(0);
  const [avgSentiment, setAvgSentiment] = useState(0);
  
  // Data state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [agentPerformance, setAgentPerformance] = useState<AgentPerformance[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [escalationFilter, setEscalationFilter] = useState<string>('all');
  
  // Brain chat state
  const [brainMessages, setBrainMessages] = useState<BrainMessage[]>([]);
  const [brainInput, setBrainInput] = useState('');
  const [isBrainLoading, setIsBrainLoading] = useState(false);
  const [brainSessionId] = useState(() => `brain_${Date.now()}`);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick questions for Brain
  const quickQuestions = [
    "Give me today's summary",
    "How many qualified leads this week?",
    "What are common customer complaints?",
    "Show high-value prospects",
    "Agent performance comparison"
  ];

  useEffect(() => {
    loadDashboardData();
    setupRealtimeSubscription();
    
    // Add welcome message from Nexus
    setBrainMessages([{
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm Nexus, your AI orchestrator. I have full visibility into all business operations, conversations, leads, and metrics. How can I help you today?",
      timestamp: new Date()
    }]);
  }, []);

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('brain-dashboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ai_conversations' },
        () => {
          loadConversations();
          loadStats();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'human_escalations' },
        () => {
          loadEscalations();
          loadStats();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        () => {
          loadStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const loadDashboardData = async () => {
    await Promise.all([
      loadStats(),
      loadConversations(),
      loadEscalations(),
      loadAgentPerformance()
    ]);
  };

  const loadStats = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      // Active conversations
      const { count: activeCount } = await supabase
        .from('ai_conversations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      setActiveConversations(activeCount || 0);

      // Today's leads
      const { count: leadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`);
      setTodaysLeads(leadsCount || 0);

      // Pending escalations
      const { count: escCount } = await supabase
        .from('human_escalations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      setPendingEscalations(escCount || 0);

      // Average sentiment
      const { data: sentimentData } = await supabase
        .from('ai_conversations')
        .select('sentiment')
        .not('sentiment', 'is', null)
        .gte('created_at', `${today}T00:00:00`);
      
      if (sentimentData && sentimentData.length > 0) {
        const avg = sentimentData.reduce((sum, c) => sum + (c.sentiment || 0), 0) / sentimentData.length;
        setAvgSentiment(avg);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select(`
          id,
          session_id,
          current_agent_id,
          user_message,
          ai_response,
          sentiment,
          intent,
          status,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Fetch agent names for each conversation
      const agentIds = [...new Set(data?.map(c => c.current_agent_id).filter(Boolean))];
      const { data: agents } = await supabase
        .from('ai_agents')
        .select('id, name, agent_type')
        .in('id', agentIds);

      const agentMap = new Map(agents?.map(a => [a.id, a]) || []);
      
      const enrichedConversations = data?.map(c => ({
        ...c,
        agent: c.current_agent_id ? agentMap.get(c.current_agent_id) : undefined
      })) || [];

      setConversations(enrichedConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadEscalations = async () => {
    try {
      const { data, error } = await supabase
        .from('human_escalations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setEscalations(data || []);
    } catch (error) {
      console.error('Error loading escalations:', error);
    }
  };

  const loadAgentPerformance = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      // Get active agents
      const { data: agents } = await supabase
        .from('ai_agents')
        .select('id, name, agent_type')
        .eq('is_active', true)
        .in('agent_type', ['sales', 'support']);

      if (!agents) return;

      const performance: AgentPerformance[] = [];

      for (const agent of agents) {
        // Conversations today
        const { count: convCount } = await supabase
          .from('agent_conversations')
          .select('*', { count: 'exact', head: true })
          .eq('agent_id', agent.id)
          .gte('started_at', `${today}T00:00:00`);

        // Average sentiment from conversations
        const { data: sentData } = await supabase
          .from('ai_conversations')
          .select('sentiment')
          .eq('current_agent_id', agent.id)
          .not('sentiment', 'is', null)
          .gte('created_at', `${today}T00:00:00`);

        const avgSent = sentData && sentData.length > 0
          ? sentData.reduce((sum, c) => sum + (c.sentiment || 0), 0) / sentData.length
          : 0;

        // Leads generated (for sales)
        const { count: leadsCount } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('source', 'ai_chat')
          .gte('created_at', `${today}T00:00:00`);

        // Escalations (for support)
        const { count: escCount } = await supabase
          .from('human_escalations')
          .select('*', { count: 'exact', head: true })
          .eq('escalated_by_agent', agent.id)
          .gte('created_at', `${today}T00:00:00`);

        performance.push({
          id: agent.id,
          name: agent.name,
          agent_type: agent.agent_type,
          conversationsToday: convCount || 0,
          avgSentiment: avgSent,
          leadsGenerated: agent.agent_type === 'sales' ? (leadsCount || 0) : 0,
          escalations: agent.agent_type === 'support' ? (escCount || 0) : 0
        });
      }

      setAgentPerformance(performance);
    } catch (error) {
      console.error('Error loading agent performance:', error);
    }
  };

  const sendBrainMessage = async (content: string = brainInput) => {
    if (!content.trim()) return;

    const userMessage: BrainMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setBrainMessages(prev => [...prev, userMessage]);
    setBrainInput('');
    setIsBrainLoading(true);

    try {
      const conversationHistory = brainMessages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const { data, error } = await supabase.functions.invoke('ai-router', {
        body: {
          message: content,
          sessionId: brainSessionId,
          conversationHistory: [...conversationHistory, { role: 'user', content }],
          isAdmin: true,
          forceBrain: true,
          pageContext: 'admin-brain-dashboard'
        }
      });

      if (error) throw error;

      const assistantMessage: BrainMessage = {
        id: `msg_${Date.now()}_response`,
        role: 'assistant',
        content: data.response || "I couldn't process that request.",
        timestamp: new Date()
      };

      setBrainMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Brain chat error:', error);
      toast.error('Failed to communicate with Nexus');
    } finally {
      setIsBrainLoading(false);
    }
  };

  const handleTakeOver = async (conversationId: string) => {
    try {
      // Get Brain agent
      const { data: brainAgent } = await supabase
        .from('ai_agents')
        .select('id')
        .eq('agent_type', 'brain')
        .single();

      if (!brainAgent) {
        toast.error('Brain agent not found');
        return;
      }

      await supabase
        .from('ai_conversations')
        .update({ current_agent_id: brainAgent.id })
        .eq('id', conversationId);

      toast.success('Conversation taken over by Nexus');
      loadConversations();
    } catch (error) {
      console.error('Take over error:', error);
      toast.error('Failed to take over conversation');
    }
  };

  const handleAssignEscalation = async (escalationId: string, assignee: string) => {
    try {
      await supabase
        .from('human_escalations')
        .update({ 
          assigned_to: assignee, 
          status: 'assigned' 
        })
        .eq('id', escalationId);

      toast.success('Escalation assigned');
      loadEscalations();
    } catch (error) {
      console.error('Assign error:', error);
      toast.error('Failed to assign escalation');
    }
  };

  const getSentimentEmoji = (sentiment: number) => {
    if (sentiment > 0.3) return '😊';
    if (sentiment < -0.3) return '😟';
    return '😐';
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.3) return 'bg-green-500';
    if (sentiment < -0.3) return 'bg-red-500';
    return 'bg-yellow-500';
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge className="bg-red-500 text-white">High</Badge>;
      case 'normal': return <Badge className="bg-blue-500 text-white">Normal</Badge>;
      default: return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge className="bg-amber-500 text-white">Pending</Badge>;
      case 'assigned': return <Badge className="bg-blue-500 text-white">Assigned</Badge>;
      case 'resolved': return <Badge className="bg-green-500 text-white">Resolved</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredEscalations = escalationFilter === 'all' 
    ? escalations 
    : escalations.filter(e => e.status === escalationFilter);

  return (
    <div className="space-y-6 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 rounded-xl p-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Brain className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Brain Command Center</h1>
            <p className="text-purple-300/70">Nexus AI Orchestrator Dashboard</p>
          </div>
        </div>
        <Button onClick={loadDashboardData} variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300/70 text-sm">Active Conversations</p>
                <p className="text-3xl font-bold text-white">{activeConversations}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-green-400">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse mr-1"></div>
              Live
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300/70 text-sm">Today's Leads</p>
                <p className="text-3xl font-bold text-white">{todaysLeads}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-300/70 text-sm">Pending Escalations</p>
                <p className="text-3xl font-bold text-white">{pendingEscalations}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300/70 text-sm">Avg Sentiment</p>
                <p className="text-3xl font-bold text-white">{getSentimentEmoji(avgSentiment)}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <p className="text-xs text-blue-300/70 mt-2">
              Score: {avgSentiment.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Live Conversations Panel - 60% */}
        <Card className="lg:col-span-3 bg-slate-800/50 border-purple-500/20">
          <CardHeader className="border-b border-purple-500/20">
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              Live Conversations
            </CardTitle>
            <CardDescription className="text-purple-300/60">
              Real-time conversation monitoring
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              <div className="divide-y divide-purple-500/10">
                {conversations.map((conv) => (
                  <div 
                    key={conv.id}
                    className={`p-4 cursor-pointer transition-colors hover:bg-purple-500/10 ${
                      selectedConversation?.id === conv.id ? 'bg-purple-500/20' : ''
                    }`}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-purple-300/70 bg-slate-700/50 px-2 py-1 rounded">
                          {conv.session_id?.slice(0, 12)}...
                        </code>
                        {conv.agent && (
                          <Badge className={`text-xs ${
                            conv.agent.agent_type === 'sales' 
                              ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                              : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          }`}>
                            {conv.agent.name}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${getSentimentColor(conv.sentiment || 0)}`}></div>
                        <span className="text-xs text-purple-300/50">
                          {formatDistanceToNow(new Date(conv.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-white/80 line-clamp-1">
                      {conv.user_message}
                    </p>
                    {selectedConversation?.id === conv.id && (
                      <div className="mt-3 pt-3 border-t border-purple-500/20 space-y-2">
                        <div className="bg-slate-700/30 rounded-lg p-3">
                          <p className="text-xs text-purple-300/70 mb-1">AI Response:</p>
                          <p className="text-sm text-white/70">{conv.ai_response}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs text-purple-300/70">
                            Intent: {conv.intent || 'general'}
                          </Badge>
                          <Button 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTakeOver(conv.id);
                            }}
                            className="ml-auto bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <Brain className="h-3 w-3 mr-1" />
                            Take Over
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {conversations.length === 0 && (
                  <div className="p-8 text-center text-purple-300/50">
                    No active conversations
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat with Nexus Panel - 40% */}
        <Card className="lg:col-span-2 bg-slate-800/50 border-indigo-500/20 flex flex-col">
          <CardHeader className="border-b border-indigo-500/20">
            <CardTitle className="text-white flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              Chat with Nexus
            </CardTitle>
            <CardDescription className="text-indigo-300/60">
              Your AI business intelligence assistant
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 h-[250px] p-4">
              <div className="space-y-3">
                {brainMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-2 ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-700/50 text-white/90 border border-indigo-500/20'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isBrainLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700/50 rounded-xl px-4 py-2 border border-indigo-500/20">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-indigo-300/70">Nexus is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Questions */}
            <div className="p-3 border-t border-indigo-500/20">
              <div className="flex flex-wrap gap-1 mb-3">
                {quickQuestions.map((q, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    onClick={() => sendBrainMessage(q)}
                    disabled={isBrainLoading}
                    className="text-xs border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 h-7"
                  >
                    {q}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={brainInput}
                  onChange={(e) => setBrainInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendBrainMessage()}
                  placeholder="Ask Nexus anything..."
                  disabled={isBrainLoading}
                  className="bg-slate-700/50 border-indigo-500/30 text-white placeholder:text-indigo-300/50"
                />
                <Button 
                  onClick={() => sendBrainMessage()}
                  disabled={isBrainLoading || !brainInput.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Escalations */}
      <Card className="bg-slate-800/50 border-amber-500/20">
        <CardHeader className="border-b border-amber-500/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                Recent Escalations
              </CardTitle>
              <CardDescription className="text-amber-300/60">
                Conversations requiring human intervention
              </CardDescription>
            </div>
            <Select value={escalationFilter} onValueChange={setEscalationFilter}>
              <SelectTrigger className="w-32 bg-slate-700/50 border-amber-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-amber-500/20 hover:bg-transparent">
                <TableHead className="text-amber-300/70">Time</TableHead>
                <TableHead className="text-amber-300/70">Reason</TableHead>
                <TableHead className="text-amber-300/70">Priority</TableHead>
                <TableHead className="text-amber-300/70">Status</TableHead>
                <TableHead className="text-amber-300/70">Assigned To</TableHead>
                <TableHead className="text-amber-300/70">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEscalations.map((esc) => (
                <TableRow key={esc.id} className="border-amber-500/10 hover:bg-amber-500/5">
                  <TableCell className="text-white/70">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(esc.created_at), { addSuffix: true })}
                    </div>
                  </TableCell>
                  <TableCell className="text-white/90 max-w-xs truncate">
                    {esc.reason}
                  </TableCell>
                  <TableCell>{getPriorityBadge(esc.priority)}</TableCell>
                  <TableCell>{getStatusBadge(esc.status)}</TableCell>
                  <TableCell className="text-white/70">
                    {esc.assigned_to || '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                        onClick={() => handleAssignEscalation(esc.id, 'Admin')}
                        disabled={esc.status !== 'pending'}
                      >
                        <UserCheck className="h-3 w-3 mr-1" />
                        Assign
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredEscalations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-amber-300/50 py-8">
                    No escalations found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Agent Performance Cards */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-400" />
          Agent Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agentPerformance.map((agent) => (
            <Card key={agent.id} className={`bg-slate-800/50 ${
              agent.agent_type === 'sales' ? 'border-green-500/20' : 'border-blue-500/20'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className={`h-10 w-10 ${
                    agent.agent_type === 'sales' ? 'ring-2 ring-green-500/30' : 'ring-2 ring-blue-500/30'
                  }`}>
                    <AvatarFallback className={`text-white font-bold ${
                      agent.agent_type === 'sales' 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                        : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                    }`}>
                      {agent.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-white">{agent.name}</h3>
                    <Badge className={`text-xs ${
                      agent.agent_type === 'sales' 
                        ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    }`}>
                      {agent.agent_type === 'sales' ? <TrendingUp className="h-3 w-3 mr-1" /> : <HeadphonesIcon className="h-3 w-3 mr-1" />}
                      {agent.agent_type === 'sales' ? 'Sales' : 'Support'}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-slate-700/30 rounded-lg">
                    <p className="text-2xl font-bold text-white">{agent.conversationsToday}</p>
                    <p className="text-xs text-purple-300/70">Chats Today</p>
                  </div>
                  <div className="text-center p-2 bg-slate-700/30 rounded-lg">
                    <p className="text-2xl font-bold text-white">{getSentimentEmoji(agent.avgSentiment)}</p>
                    <p className="text-xs text-purple-300/70">Avg Sentiment</p>
                  </div>
                  {agent.agent_type === 'sales' && (
                    <div className="col-span-2 text-center p-2 bg-green-500/10 rounded-lg">
                      <p className="text-lg font-bold text-green-400">{agent.leadsGenerated}</p>
                      <p className="text-xs text-green-300/70">Leads Generated</p>
                    </div>
                  )}
                  {agent.agent_type === 'support' && (
                    <div className="col-span-2 text-center p-2 bg-blue-500/10 rounded-lg">
                      <p className="text-lg font-bold text-blue-400">{agent.escalations}</p>
                      <p className="text-xs text-blue-300/70">Escalations</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {agentPerformance.length === 0 && (
            <Card className="col-span-full bg-slate-800/50 border-purple-500/20">
              <CardContent className="p-8 text-center text-purple-300/50">
                No agent performance data available. Initialize the multi-agent system first.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrainAgentDashboard;
