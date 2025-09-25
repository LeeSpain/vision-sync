import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { MessageSquare, TrendingUp, Users, Clock } from "lucide-react";

interface ConversationsAnalyticsProps {
  agentId: string;
}

interface Conversation {
  id: string;
  agent_id: string;
  user_message: string;
  ai_response: string;
  context: any;
  session_id: string;
  created_at: string;
}

const ConversationsAnalytics: React.FC<ConversationsAnalyticsProps> = ({ agentId }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalConversations: 0,
    uniqueSessions: 0,
    avgMessagesPerSession: 0,
    totalMessages: 0
  });

  useEffect(() => {
    loadConversations();
  }, [agentId]);

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setConversations(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: Conversation[]) => {
    const totalConversations = data.length;
    const uniqueSessions = new Set(data.map(conv => conv.session_id)).size;
    const avgMessagesPerSession = uniqueSessions > 0 ? totalConversations / uniqueSessions : 0;
    
    setStats({
      totalConversations,
      uniqueSessions,
      avgMessagesPerSession: Math.round(avgMessagesPerSession * 10) / 10,
      totalMessages: totalConversations * 2 // Each conversation has user message + AI response
    });
  };

  const getHourlyData = () => {
    const hourlyCount: { [key: string]: number } = {};
    
    conversations.forEach(conv => {
      const hour = new Date(conv.created_at).getHours();
      const key = `${hour}:00`;
      hourlyCount[key] = (hourlyCount[key] || 0) + 1;
    });

    return Object.entries(hourlyCount)
      .map(([hour, count]) => ({ hour, conversations: count }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
  };

  const getDailyData = () => {
    const dailyCount: { [key: string]: number } = {};
    
    conversations.forEach(conv => {
      const date = new Date(conv.created_at).toDateString();
      dailyCount[date] = (dailyCount[date] || 0) + 1;
    });

    return Object.entries(dailyCount)
      .map(([date, count]) => ({ date: date.slice(0, 10), conversations: count }))
      .slice(-7); // Last 7 days
  };

  const getSessionLengthData = () => {
    const sessionData: { [key: string]: number } = {};
    
    conversations.forEach(conv => {
      const sessionId = conv.session_id;
      sessionData[sessionId] = (sessionData[sessionId] || 0) + 1;
    });

    const lengths = Object.values(sessionData);
    const ranges = [
      { range: '1 message', count: lengths.filter(l => l === 1).length },
      { range: '2-5 messages', count: lengths.filter(l => l >= 2 && l <= 5).length },
      { range: '6-10 messages', count: lengths.filter(l => l >= 6 && l <= 10).length },
      { range: '10+ messages', count: lengths.filter(l => l > 10).length }
    ];

    return ranges.filter(r => r.count > 0);
  };

  const getRecentConversations = () => {
    return conversations.slice(0, 10); // Most recent 10 conversations
  };

  if (loading) {
    return <div className="p-6">Loading analytics...</div>;
  }

  const hourlyData = getHourlyData();
  const dailyData = getDailyData();
  const sessionLengthData = getSessionLengthData();
  const recentConversations = getRecentConversations();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalConversations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueSessions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Messages/Session</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgMessagesPerSession}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily Conversations (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="conversations" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Length Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sessionLengthData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ range, count }) => `${range}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {sessionLengthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Activity Pattern</CardTitle>
              <CardDescription>
                Shows when users are most active throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="conversations" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
              <CardDescription>
                Latest {recentConversations.length} conversations with this agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentConversations.map((conversation) => (
                  <div key={conversation.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">
                        Session: {conversation.session_id?.slice(-8) || 'Unknown'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(conversation.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-blue-600">User:</p>
                        <p className="text-sm">{conversation.user_message}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-600">AI:</p>
                        <p className="text-sm">{conversation.ai_response || 'No response recorded'}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {recentConversations.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">
                    No conversations found for this agent
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConversationsAnalytics;