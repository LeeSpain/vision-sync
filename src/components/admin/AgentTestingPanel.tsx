import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Send, 
  RotateCcw, 
  HeadphonesIcon, 
  TrendingUp, 
  Brain,
  Bug,
  Play,
  Sparkles,
  User,
  ArrowRightLeft,
  AlertTriangle,
  MessageSquare,
  Target,
  Heart,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TestMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  debug?: {
    intent?: string;
    sentiment?: number;
    routingDecision?: string;
    confidence?: number;
    agentName?: string;
    agentType?: string;
    handoff?: boolean;
    escalated?: boolean;
  };
}

interface TestMetrics {
  messagesSent: number;
  agentSwitches: number;
  intentsDetected: string[];
  leadScore: number;
  avgSentiment: number;
}

const TEST_SCENARIOS = {
  support: [
    { label: "App crashed", message: "My app crashed and I lost my data" },
    { label: "Password reset", message: "How do I reset my password?" },
    { label: "Angry customer", message: "This is completely unacceptable service!" },
    { label: "Integration help", message: "Can you help me set up integrations?" },
  ],
  sales: [
    { label: "Pricing inquiry", message: "How much does the enterprise plan cost?" },
    { label: "Demo request", message: "I'd like to see a demo" },
    { label: "Comparison", message: "We're comparing you to competitors" },
    { label: "Ready to buy", message: "I'm ready to buy, what's next?" },
  ],
  handoff: [
    { label: "Pricing then bug", messages: ["I have a pricing question", "Actually my app is broken"] },
    { label: "Bug then upgrade", messages: ["Need help with a bug", "How much to upgrade?"] },
  ],
  escalation: [
    { label: "Real person", message: "I want to speak to a real person" },
    { label: "Manager request", message: "Get me your manager" },
    { label: "AI frustration", message: "This AI is useless, I need a human" },
  ],
};

const PAGE_CONTEXTS = [
  { value: 'home', label: 'Home Page' },
  { value: 'pricing', label: 'Pricing Page' },
  { value: 'support', label: 'Support Page' },
  { value: 'templates', label: 'Templates Page' },
  { value: 'for-investors', label: 'Investors Page' },
];

const AGENTS = [
  { id: 'auto', name: 'Auto-Route', type: 'auto', icon: Sparkles },
  { id: 'support', name: 'Alex', type: 'support', icon: HeadphonesIcon },
  { id: 'sales', name: 'Morgan', type: 'sales', icon: TrendingUp },
  { id: 'brain', name: 'Nexus', type: 'brain', icon: Brain },
];

const AgentTestingPanel: React.FC = () => {
  const [messages, setMessages] = useState<TestMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState('auto');
  const [pageContext, setPageContext] = useState('home');
  const [sessionId] = useState(() => `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [metrics, setMetrics] = useState<TestMetrics>({
    messagesSent: 0,
    agentSwitches: 0,
    intentsDetected: [],
    leadScore: 0,
    avgSentiment: 0,
  });
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  const updateMetrics = (debug: TestMessage['debug'], isHandoff: boolean) => {
    setMetrics(prev => {
      const newIntents = debug?.intent && !prev.intentsDetected.includes(debug.intent)
        ? [...prev.intentsDetected, debug.intent]
        : prev.intentsDetected;
      
      const sentimentSum = prev.avgSentiment * prev.messagesSent + (debug?.sentiment || 0);
      const newCount = prev.messagesSent + 1;
      
      return {
        messagesSent: newCount,
        agentSwitches: prev.agentSwitches + (isHandoff ? 1 : 0),
        intentsDetected: newIntents,
        leadScore: Math.min(100, prev.leadScore + (debug?.intent === 'purchase' ? 20 : debug?.intent === 'pricing' ? 10 : 5)),
        avgSentiment: sentimentSum / newCount,
      };
    });
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: TestMessage = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const conversationHistory = [...messages, userMessage].map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));

      const requestBody: any = {
        message: content,
        sessionId,
        conversationHistory,
        isAdmin: true,
        pageContext,
      };

      // Force specific agent if not auto
      if (selectedAgent !== 'auto') {
        requestBody.forceBrain = selectedAgent === 'brain';
        if (selectedAgent === 'support' || selectedAgent === 'sales') {
          // Fetch agent ID
          const { data: agentData } = await supabase
            .from('ai_agents')
            .select('id')
            .eq('agent_type', selectedAgent)
            .eq('is_active', true)
            .maybeSingle();
          
          if (agentData) {
            requestBody.currentAgentId = agentData.id;
          }
        }
      }

      const { data, error } = await supabase.functions.invoke('ai-router', {
        body: requestBody,
      });

      if (error) throw error;

      const isHandoff = data.handoff?.occurred || false;

      const aiMessage: TestMessage = {
        id: `msg_${Date.now()}_ai`,
        type: 'ai',
        content: data.response || 'No response received',
        timestamp: new Date(),
        debug: {
          intent: data.analysis?.intent,
          sentiment: data.analysis?.sentiment,
          routingDecision: data.agent?.name ? `Routed to ${data.agent.name}` : 'Default routing',
          confidence: data.analysis?.confidence || 0.85,
          agentName: data.agent?.name,
          agentType: data.agent?.type,
          handoff: isHandoff,
          escalated: data.analysis?.escalationRequested,
        },
      };

      setMessages(prev => [...prev, aiMessage]);
      updateMetrics(aiMessage.debug, isHandoff);

      if (data.analysis?.escalationRequested) {
        toast.warning('Escalation detected!', {
          description: 'User requested human assistance',
        });
      }

      if (isHandoff) {
        toast.info('Agent Handoff', {
          description: `Conversation routed to ${data.agent?.name || 'new agent'}`,
        });
      }

    } catch (error) {
      console.error('Test message error:', error);
      toast.error('Failed to send test message');
    } finally {
      setIsLoading(false);
    }
  };

  const runHandoffScenario = async (messages: string[]) => {
    for (let i = 0; i < messages.length; i++) {
      await sendMessage(messages[i]);
      if (i < messages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  };

  const resetConversation = () => {
    setMessages([]);
    setMetrics({
      messagesSent: 0,
      agentSwitches: 0,
      intentsDetected: [],
      leadScore: 0,
      avgSentiment: 0,
    });
    toast.success('Conversation reset');
  };

  const getSentimentEmoji = (sentiment: number) => {
    if (sentiment > 0.3) return '😊';
    if (sentiment < -0.3) return '😟';
    return '😐';
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.3) return 'text-emerald-500';
    if (sentiment < -0.3) return 'text-red-500';
    return 'text-amber-500';
  };

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'support': return HeadphonesIcon;
      case 'sales': return TrendingUp;
      case 'brain': return Brain;
      default: return Sparkles;
    }
  };

  const getAgentColor = (type: string) => {
    switch (type) {
      case 'support': return 'bg-blue-500';
      case 'sales': return 'bg-emerald-500';
      case 'brain': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-midnight-navy flex items-center gap-2">
            <Bug className="h-6 w-6 text-purple-500" />
            Agent Testing Panel
          </h2>
          <p className="text-cool-gray">Test the multi-agent routing system with simulated conversations</p>
        </div>
        <Button onClick={resetConversation} variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset Session
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Controls & Scenarios */}
        <div className="space-y-4">
          {/* Agent & Context Controls */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Test Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Agent Selector */}
              <div className="space-y-2">
                <Label>Force Agent</Label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AGENTS.map(agent => (
                      <SelectItem key={agent.id} value={agent.id}>
                        <div className="flex items-center gap-2">
                          <agent.icon className="h-4 w-4" />
                          {agent.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Page Context */}
              <div className="space-y-2">
                <Label>Page Context</Label>
                <Select value={pageContext} onValueChange={setPageContext}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_CONTEXTS.map(ctx => (
                      <SelectItem key={ctx.value} value={ctx.value}>
                        {ctx.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Debug Toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="debug-mode">Show Debug Info</Label>
                <Switch
                  id="debug-mode"
                  checked={showDebug}
                  onCheckedChange={setShowDebug}
                />
              </div>
            </CardContent>
          </Card>

          {/* Test Scenarios */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Test Scenarios</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="support" className="w-full">
                <TabsList className="grid w-full grid-cols-4 h-auto">
                  <TabsTrigger value="support" className="text-xs px-2 py-1.5">
                    <HeadphonesIcon className="h-3 w-3 mr-1" />
                    Support
                  </TabsTrigger>
                  <TabsTrigger value="sales" className="text-xs px-2 py-1.5">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Sales
                  </TabsTrigger>
                  <TabsTrigger value="handoff" className="text-xs px-2 py-1.5">
                    <ArrowRightLeft className="h-3 w-3 mr-1" />
                    Handoff
                  </TabsTrigger>
                  <TabsTrigger value="escalation" className="text-xs px-2 py-1.5">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Escalate
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="support" className="mt-3 space-y-2">
                  {TEST_SCENARIOS.support.map((scenario, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto py-2"
                      onClick={() => sendMessage(scenario.message)}
                      disabled={isLoading}
                    >
                      <Play className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="truncate">{scenario.label}</span>
                    </Button>
                  ))}
                </TabsContent>

                <TabsContent value="sales" className="mt-3 space-y-2">
                  {TEST_SCENARIOS.sales.map((scenario, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto py-2"
                      onClick={() => sendMessage(scenario.message)}
                      disabled={isLoading}
                    >
                      <Play className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="truncate">{scenario.label}</span>
                    </Button>
                  ))}
                </TabsContent>

                <TabsContent value="handoff" className="mt-3 space-y-2">
                  {TEST_SCENARIOS.handoff.map((scenario, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto py-2"
                      onClick={() => runHandoffScenario(scenario.messages)}
                      disabled={isLoading}
                    >
                      <Play className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="truncate">{scenario.label}</span>
                    </Button>
                  ))}
                </TabsContent>

                <TabsContent value="escalation" className="mt-3 space-y-2">
                  {TEST_SCENARIOS.escalation.map((scenario, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto py-2 text-red-600 hover:text-red-700"
                      onClick={() => sendMessage(scenario.message)}
                      disabled={isLoading}
                    >
                      <Play className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="truncate">{scenario.label}</span>
                    </Button>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Metrics Panel */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                Session Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-midnight-navy">{metrics.messagesSent}</div>
                  <div className="text-xs text-cool-gray">Messages</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{metrics.agentSwitches}</div>
                  <div className="text-xs text-cool-gray">Handoffs</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-cool-gray flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Lead Score
                  </span>
                  <span className="font-medium text-emerald-600">{metrics.leadScore}/100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cool-gray flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    Avg Sentiment
                  </span>
                  <span className={`font-medium ${getSentimentColor(metrics.avgSentiment)}`}>
                    {getSentimentEmoji(metrics.avgSentiment)} {metrics.avgSentiment.toFixed(2)}
                  </span>
                </div>
              </div>

              {metrics.intentsDetected.length > 0 && (
                <div className="pt-2 border-t">
                  <div className="text-xs text-cool-gray mb-2">Detected Intents:</div>
                  <div className="flex flex-wrap gap-1">
                    {metrics.intentsDetected.map((intent, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {intent}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Center & Right - Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[700px] flex flex-col">
            <CardHeader className="flex-shrink-0 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Test Chat
                  <Badge variant="outline" className="ml-2">
                    {selectedAgent === 'auto' ? 'Auto-Routing' : AGENTS.find(a => a.id === selectedAgent)?.name}
                  </Badge>
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  Context: {PAGE_CONTEXTS.find(c => c.value === pageContext)?.label}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              {/* Messages */}
              <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-cool-gray py-12">
                      <Bug className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Select a test scenario or type a message to begin</p>
                    </div>
                  )}

                  {messages.map((message) => {
                    const AgentIcon = message.debug?.agentType ? getAgentIcon(message.debug.agentType) : Sparkles;
                    
                    return (
                      <div key={message.id} className="space-y-2">
                        {/* Message */}
                        <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`flex items-start gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                            {message.type === 'user' ? (
                              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                                <User className="h-4 w-4" />
                              </div>
                            ) : (
                              <div className={`h-8 w-8 rounded-full ${getAgentColor(message.debug?.agentType || 'general')} flex items-center justify-center text-white flex-shrink-0`}>
                                <AgentIcon className="h-4 w-4" />
                              </div>
                            )}
                            <div className={`rounded-xl px-4 py-3 ${
                              message.type === 'user'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              <div className="text-sm">{message.content}</div>
                              <div className={`text-xs mt-1 ${message.type === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                {message.debug?.agentName && message.type === 'ai' && (
                                  <span className="ml-2">• {message.debug.agentName}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Debug Panel */}
                        {showDebug && message.type === 'ai' && message.debug && (
                          <div className="ml-10 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
                            <div className="flex items-center gap-2 text-slate-600 font-medium">
                              <Bug className="h-3 w-3" />
                              Debug Info
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-slate-500">Intent:</span>{' '}
                                <Badge variant="outline" className="text-xs">{message.debug.intent || 'unknown'}</Badge>
                              </div>
                              <div>
                                <span className="text-slate-500">Sentiment:</span>{' '}
                                <span className={getSentimentColor(message.debug.sentiment || 0)}>
                                  {getSentimentEmoji(message.debug.sentiment || 0)} {message.debug.sentiment?.toFixed(2)}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-500">Routing:</span>{' '}
                                <span className="text-slate-700">{message.debug.routingDecision}</span>
                              </div>
                              <div>
                                <span className="text-slate-500">Confidence:</span>{' '}
                                <span className="text-slate-700">{((message.debug.confidence || 0) * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                            {(message.debug.handoff || message.debug.escalated) && (
                              <div className="flex gap-2 pt-1 border-t border-slate-200">
                                {message.debug.handoff && (
                                  <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                                    <ArrowRightLeft className="h-3 w-3 mr-1" />
                                    Handoff
                                  </Badge>
                                )}
                                {message.debug.escalated && (
                                  <Badge className="bg-red-100 text-red-700 border-red-200">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Escalated
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-2">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-white flex-shrink-0 animate-pulse">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <div className="bg-gray-100 rounded-xl px-4 py-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="flex-shrink-0 p-4 border-t bg-white">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(inputMessage)}
                    placeholder="Type a test message..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => sendMessage(inputMessage)}
                    disabled={isLoading || !inputMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgentTestingPanel;
