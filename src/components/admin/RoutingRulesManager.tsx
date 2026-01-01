import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  RotateCcw,
  ArrowRightLeft,
  HeadphonesIcon,
  TrendingUp,
  Brain,
  Target,
  Tag,
  Heart,
  MessageSquare,
  Sparkles,
  Check,
  X,
  AlertTriangle,
  Download,
  BarChart3,
  GitBranch,
  Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RoutingRule {
  id: string;
  trigger_type: string;
  trigger_value: string;
  target_agent_id: string | null;
  source_agent_id: string | null;
  priority: number;
  is_active: boolean;
  created_at: string;
  target_agent?: {
    id: string;
    name: string;
    agent_type: string;
  };
}

interface Agent {
  id: string;
  name: string;
  agent_type: string;
}

interface RuleAnalytics {
  rule_id: string;
  trigger_count: number;
  last_triggered: string | null;
}

const TRIGGER_TYPES = [
  { value: 'intent', label: 'Intent Match', icon: Target, description: 'Route based on detected user intent' },
  { value: 'keyword', label: 'Keyword Match', icon: Tag, description: 'Route when specific keywords are detected' },
  { value: 'sentiment', label: 'Sentiment Threshold', icon: Heart, description: 'Route based on conversation sentiment' },
  { value: 'explicit', label: 'Explicit Request', icon: MessageSquare, description: 'Route when user explicitly asks for something' },
];

const INTENT_OPTIONS = [
  { value: 'pricing_inquiry', label: 'Pricing Inquiry' },
  { value: 'technical_support', label: 'Technical Support' },
  { value: 'purchase_intent', label: 'Purchase Intent' },
  { value: 'complaint', label: 'Complaint' },
  { value: 'feature_request', label: 'Feature Request' },
  { value: 'demo_request', label: 'Demo Request' },
  { value: 'partnership', label: 'Partnership Inquiry' },
  { value: 'general_inquiry', label: 'General Inquiry' },
  { value: 'investment', label: 'Investment Interest' },
  { value: 'comparison', label: 'Competitor Comparison' },
];

const DEFAULT_RULES = [
  { trigger_type: 'intent', trigger_value: 'pricing_inquiry', target_type: 'sales', priority: 9 },
  { trigger_type: 'intent', trigger_value: 'purchase_intent', target_type: 'sales', priority: 10 },
  { trigger_type: 'intent', trigger_value: 'demo_request', target_type: 'sales', priority: 8 },
  { trigger_type: 'intent', trigger_value: 'investment', target_type: 'sales', priority: 9 },
  { trigger_type: 'intent', trigger_value: 'technical_support', target_type: 'support', priority: 9 },
  { trigger_type: 'intent', trigger_value: 'complaint', target_type: 'support', priority: 10 },
  { trigger_type: 'intent', trigger_value: 'feature_request', target_type: 'support', priority: 7 },
  { trigger_type: 'keyword', trigger_value: 'price,pricing,cost,quote,budget', target_type: 'sales', priority: 8 },
  { trigger_type: 'keyword', trigger_value: 'buy,purchase,order,subscribe', target_type: 'sales', priority: 9 },
  { trigger_type: 'keyword', trigger_value: 'help,support,issue,problem,bug,error', target_type: 'support', priority: 8 },
  { trigger_type: 'keyword', trigger_value: 'broken,crashed,not working,failed', target_type: 'support', priority: 9 },
  { trigger_type: 'sentiment', trigger_value: '-0.5', target_type: 'support', priority: 10 },
  { trigger_type: 'explicit', trigger_value: 'speak to sales', target_type: 'sales', priority: 10 },
  { trigger_type: 'explicit', trigger_value: 'talk to support', target_type: 'support', priority: 10 },
];

const AGENT_COLORS: Record<string, string> = {
  support: '#3b82f6',
  sales: '#10b981',
  brain: '#8b5cf6',
  general: '#6b7280',
};
const RoutingRulesManager: React.FC = () => {
  const [rules, setRules] = useState<RoutingRule[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [ruleAnalytics, setRuleAnalytics] = useState<RuleAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<RoutingRule | null>(null);
  const [testMessage, setTestMessage] = useState('');
  const [testResult, setTestResult] = useState<{ matched: boolean; rule?: RoutingRule; agent?: Agent } | null>(null);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('rules');

  // Form state
  const [formData, setFormData] = useState({
    trigger_type: 'intent',
    trigger_value: '',
    target_agent_id: '',
    priority: 5,
    is_active: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [rulesResult, agentsResult, analyticsResult] = await Promise.all([
        supabase
          .from('agent_routing_rules')
          .select('*')
          .order('priority', { ascending: false }),
        supabase
          .from('ai_agents')
          .select('id, name, agent_type')
          .eq('is_active', true),
        supabase
          .from('routing_rule_analytics')
          .select('rule_id, triggered_at'),
      ]);

      if (rulesResult.error) throw rulesResult.error;
      if (agentsResult.error) throw agentsResult.error;

      // Process analytics data - count triggers per rule
      const analyticsMap = new Map<string, { count: number; lastTriggered: string | null }>();
      if (analyticsResult.data) {
        analyticsResult.data.forEach((item: { rule_id: string | null; triggered_at: string }) => {
          if (!item.rule_id) return;
          const existing = analyticsMap.get(item.rule_id);
          if (existing) {
            existing.count++;
            if (!existing.lastTriggered || item.triggered_at > existing.lastTriggered) {
              existing.lastTriggered = item.triggered_at;
            }
          } else {
            analyticsMap.set(item.rule_id, { count: 1, lastTriggered: item.triggered_at });
          }
        });
      }

      const processedAnalytics: RuleAnalytics[] = Array.from(analyticsMap.entries()).map(([rule_id, data]) => ({
        rule_id,
        trigger_count: data.count,
        last_triggered: data.lastTriggered,
      }));

      // Map agent data to rules
      const rulesWithAgents = rulesResult.data?.map(rule => ({
        ...rule,
        target_agent: agentsResult.data?.find(a => a.id === rule.target_agent_id),
      })) || [];

      setRules(rulesWithAgents);
      setAgents(agentsResult.data || []);
      setRuleAnalytics(processedAnalytics);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load routing rules');
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async () => {
    if (!formData.trigger_value.trim() || !formData.target_agent_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingRule) {
        const { error } = await supabase
          .from('agent_routing_rules')
          .update({
            trigger_type: formData.trigger_type,
            trigger_value: formData.trigger_value,
            target_agent_id: formData.target_agent_id,
            priority: formData.priority,
            is_active: formData.is_active,
          })
          .eq('id', editingRule.id);

        if (error) throw error;
        toast.success('Rule updated successfully');
      } else {
        const { error } = await supabase
          .from('agent_routing_rules')
          .insert({
            trigger_type: formData.trigger_type,
            trigger_value: formData.trigger_value,
            target_agent_id: formData.target_agent_id,
            priority: formData.priority,
            is_active: formData.is_active,
          });

        if (error) throw error;
        toast.success('Rule created successfully');
      }

      setIsAddDialogOpen(false);
      setEditingRule(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving rule:', error);
      toast.error('Failed to save rule');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('agent_routing_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Rule deleted');
      loadData();
    } catch (error) {
      console.error('Error deleting rule:', error);
      toast.error('Failed to delete rule');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('agent_routing_rules')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error toggling rule:', error);
      toast.error('Failed to update rule');
    }
  };

  const handleEdit = (rule: RoutingRule) => {
    setEditingRule(rule);
    setFormData({
      trigger_type: rule.trigger_type,
      trigger_value: rule.trigger_value,
      target_agent_id: rule.target_agent_id || '',
      priority: rule.priority || 5,
      is_active: rule.is_active,
    });
    setIsAddDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      trigger_type: 'intent',
      trigger_value: '',
      target_agent_id: '',
      priority: 5,
      is_active: true,
    });
    setEditingRule(null);
  };

  const handleTestRouting = async () => {
    if (!testMessage.trim()) {
      toast.error('Please enter a test message');
      return;
    }

    setIsTestLoading(true);
    try {
      // Simple client-side routing test
      const message = testMessage.toLowerCase();
      let matchedRule: RoutingRule | undefined;

      // Sort by priority and check each rule
      const activeRules = rules.filter(r => r.is_active).sort((a, b) => (b.priority || 0) - (a.priority || 0));

      for (const rule of activeRules) {
        let matches = false;

        switch (rule.trigger_type) {
          case 'keyword':
            const keywords = rule.trigger_value.split(',').map(k => k.trim().toLowerCase());
            matches = keywords.some(kw => message.includes(kw));
            break;
          case 'explicit':
            matches = message.includes(rule.trigger_value.toLowerCase());
            break;
          case 'intent':
            // Simplified intent matching for testing
            const intentKeywords: Record<string, string[]> = {
              pricing_inquiry: ['price', 'cost', 'pricing', 'how much'],
              technical_support: ['help', 'issue', 'problem', 'bug', 'error', 'broken'],
              purchase_intent: ['buy', 'purchase', 'order', 'subscribe'],
              demo_request: ['demo', 'trial', 'try'],
              complaint: ['terrible', 'awful', 'unacceptable', 'angry', 'frustrated'],
            };
            const intentKws = intentKeywords[rule.trigger_value] || [];
            matches = intentKws.some(kw => message.includes(kw));
            break;
          case 'sentiment':
            // Simplified sentiment check
            const negativeWords = ['angry', 'frustrated', 'terrible', 'awful', 'hate', 'useless', 'broken'];
            const threshold = parseFloat(rule.trigger_value);
            const hasNegative = negativeWords.some(w => message.includes(w));
            if (threshold < 0 && hasNegative) matches = true;
            break;
        }

        if (matches) {
          matchedRule = rule;
          break;
        }
      }

      if (matchedRule) {
        setTestResult({
          matched: true,
          rule: matchedRule,
          agent: agents.find(a => a.id === matchedRule?.target_agent_id),
        });
      } else {
        setTestResult({ matched: false });
      }
    } catch (error) {
      console.error('Test error:', error);
      toast.error('Failed to test routing');
    } finally {
      setIsTestLoading(false);
    }
  };

  const loadDefaultRules = async () => {
    try {
      // Get agent IDs by type
      const agentMap: Record<string, string> = {};
      agents.forEach(agent => {
        agentMap[agent.agent_type] = agent.id;
      });

      // Delete existing rules
      await supabase.from('agent_routing_rules').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      // Insert default rules
      const rulesToInsert = DEFAULT_RULES.map(rule => ({
        trigger_type: rule.trigger_type,
        trigger_value: rule.trigger_value,
        target_agent_id: agentMap[rule.target_type] || null,
        priority: rule.priority,
        is_active: true,
      })).filter(r => r.target_agent_id);

      const { error } = await supabase.from('agent_routing_rules').insert(rulesToInsert);
      if (error) throw error;

      toast.success(`Loaded ${rulesToInsert.length} default routing rules`);
      loadData();
    } catch (error) {
      console.error('Error loading defaults:', error);
      toast.error('Failed to load default rules');
    }
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
      case 'support': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'sales': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'brain': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTriggerIcon = (type: string) => {
    const trigger = TRIGGER_TYPES.find(t => t.value === type);
    return trigger?.icon || Target;
  };

  // Get analytics for a specific rule
  const getRuleAnalytics = (ruleId: string): RuleAnalytics | undefined => {
    return ruleAnalytics.find(a => a.rule_id === ruleId);
  };

  // Prepare chart data for rule analytics
  const analyticsChartData = useMemo(() => {
    return rules
      .map(rule => {
        const analytics = getRuleAnalytics(rule.id);
        return {
          name: `${rule.trigger_type}: ${rule.trigger_value.substring(0, 15)}${rule.trigger_value.length > 15 ? '...' : ''}`,
          triggers: analytics?.trigger_count || 0,
          agentType: rule.target_agent?.agent_type || 'general',
          fullName: `${rule.trigger_type}: ${rule.trigger_value}`,
          agent: rule.target_agent?.name || 'Unknown',
        };
      })
      .sort((a, b) => b.triggers - a.triggers)
      .slice(0, 10); // Top 10 rules
  }, [rules, ruleAnalytics]);

  // Generate flowchart data for visualization
  const flowchartSvg = useMemo(() => {
    const activeRules = rules.filter(r => r.is_active);
    const agentGroups: Record<string, RoutingRule[]> = {};
    
    activeRules.forEach(rule => {
      const agentType = rule.target_agent?.agent_type || 'general';
      if (!agentGroups[agentType]) {
        agentGroups[agentType] = [];
      }
      agentGroups[agentType].push(rule);
    });

    return { agentGroups, activeRules };
  }, [rules]);

  // Render the visual flowchart
  const renderFlowchart = () => {
    const { agentGroups } = flowchartSvg;
    const agentTypes = Object.keys(agentGroups);
    
    if (agentTypes.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <GitBranch className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No active routing rules to visualize</p>
        </div>
      );
    }

    return (
      <div className="relative">
        {/* Message Input Node */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <span className="font-semibold">Incoming Message</span>
          </div>
        </div>
        
        {/* Router Node */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute left-1/2 -top-8 h-8 w-0.5 bg-gray-300 -translate-x-1/2" />
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5" />
              <div>
                <div className="font-semibold">AI Router</div>
                <div className="text-xs opacity-80">Analyzes intent, sentiment, keywords</div>
              </div>
            </div>
          </div>
        </div>

        {/* Branching lines */}
        <div className="flex justify-center mb-4">
          <div className="flex items-end gap-8">
            {agentTypes.map((type, idx) => (
              <div key={type} className="flex flex-col items-center">
                <div className="h-8 w-0.5 bg-gray-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Agent Nodes with Rules */}
        <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${Math.min(agentTypes.length, 3)}, 1fr)` }}>
          {agentTypes.map(type => {
            const agentRules = agentGroups[type];
            const agent = agents.find(a => a.agent_type === type);
            const Icon = getAgentIcon(type);
            const color = AGENT_COLORS[type] || AGENT_COLORS.general;
            
            return (
              <Card key={type} className="border-2" style={{ borderColor: color }}>
                <CardHeader className="pb-3" style={{ backgroundColor: `${color}15` }}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="p-2 rounded-lg" 
                      style={{ backgroundColor: color }}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{agent?.name || type}</CardTitle>
                      <CardDescription className="text-xs capitalize">{type} Agent</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-3">
                  <div className="space-y-2">
                    {agentRules.slice(0, 5).map((rule, idx) => {
                      const analytics = getRuleAnalytics(rule.id);
                      return (
                        <div 
                          key={rule.id} 
                          className="flex items-center justify-between text-xs p-2 rounded bg-muted/50"
                        >
                          <div className="flex items-center gap-1.5 truncate flex-1">
                            <Badge variant="outline" className="text-[10px] px-1.5">
                              P{rule.priority}
                            </Badge>
                            <span className="truncate">
                              {rule.trigger_type}: {rule.trigger_value.substring(0, 20)}
                              {rule.trigger_value.length > 20 ? '...' : ''}
                            </span>
                          </div>
                          {analytics && analytics.trigger_count > 0 && (
                            <Badge 
                              className="ml-2 text-[10px]" 
                              style={{ backgroundColor: color, color: 'white' }}
                            >
                              {analytics.trigger_count}×
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                    {agentRules.length > 5 && (
                      <div className="text-xs text-muted-foreground text-center pt-1">
                        +{agentRules.length - 5} more rules
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: AGENT_COLORS.support }} />
              <span>Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: AGENT_COLORS.sales }} />
              <span>Sales</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: AGENT_COLORS.brain }} />
              <span>Brain</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render analytics panel
  const renderAnalytics = () => {
    const totalTriggers = ruleAnalytics.reduce((sum, a) => sum + a.trigger_count, 0);
    const topRule = analyticsChartData[0];

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Triggers</p>
                  <p className="text-2xl font-bold">{totalTriggers}</p>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Rules</p>
                  <p className="text-2xl font-bold">{rules.filter(r => r.is_active).length}</p>
                </div>
                <Target className="h-8 w-8 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rules Triggered</p>
                  <p className="text-2xl font-bold">{ruleAnalytics.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Top Rule</p>
                  <p className="text-lg font-bold truncate max-w-[150px]">
                    {topRule?.agent || 'N/A'}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              Rule Trigger Frequency
            </CardTitle>
            <CardDescription>Top 10 most triggered routing rules</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsChartData.length > 0 && totalTriggers > 0 ? (
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsChartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={150}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border rounded-lg shadow-lg p-3">
                              <p className="font-medium text-sm">{data.fullName}</p>
                              <p className="text-sm text-muted-foreground">Agent: {data.agent}</p>
                              <p className="text-sm font-semibold mt-1">Triggers: {data.triggers}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="triggers" radius={[0, 4, 4, 0]}>
                      {analyticsChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={AGENT_COLORS[entry.agentType] || AGENT_COLORS.general}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No analytics data yet</p>
                <p className="text-sm mt-1">Rule triggers will be tracked as messages are routed</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Triggers Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rule Performance</CardTitle>
            <CardDescription>Trigger counts for each active rule</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule</TableHead>
                  <TableHead>Target Agent</TableHead>
                  <TableHead className="text-center">Priority</TableHead>
                  <TableHead className="text-center">Triggers</TableHead>
                  <TableHead>Last Triggered</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.filter(r => r.is_active).map(rule => {
                  const analytics = getRuleAnalytics(rule.id);
                  const AgentIcon = rule.target_agent ? getAgentIcon(rule.target_agent.agent_type) : Sparkles;
                  
                  return (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {rule.trigger_type}
                          </Badge>
                          <span className="text-sm truncate max-w-[200px]">
                            {rule.trigger_value}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {rule.target_agent && (
                          <Badge className={getAgentColor(rule.target_agent.agent_type)}>
                            <AgentIcon className="h-3 w-3 mr-1" />
                            {rule.target_agent.name}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{rule.priority}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-semibold">
                          {analytics?.trigger_count || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        {analytics?.last_triggered ? (
                          <span className="text-sm text-muted-foreground">
                            {new Date(analytics.last_triggered).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-midnight-navy flex items-center gap-2">
            <ArrowRightLeft className="h-6 w-6 text-purple-500" />
            Routing Rules Manager
          </h2>
          <p className="text-cool-gray">Configure how conversations are routed between agents</p>
        </div>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Load Defaults
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Load Default Routing Rules?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete all existing rules and load the recommended default configuration. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={loadDefaultRules}>Load Defaults</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingRule ? 'Edit Rule' : 'Add New Routing Rule'}</DialogTitle>
                <DialogDescription>
                  Configure how messages should be routed to agents based on triggers.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Trigger Type */}
                <div className="space-y-2">
                  <Label>Trigger Type</Label>
                  <Select
                    value={formData.trigger_type}
                    onValueChange={(value) => setFormData({ ...formData, trigger_type: value, trigger_value: '' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRIGGER_TYPES.map(type => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {TRIGGER_TYPES.find(t => t.value === formData.trigger_type)?.description}
                  </p>
                </div>

                {/* Trigger Value - Dynamic based on type */}
                <div className="space-y-2">
                  <Label>Trigger Value</Label>
                  {formData.trigger_type === 'intent' ? (
                    <Select
                      value={formData.trigger_value}
                      onValueChange={(value) => setFormData({ ...formData, trigger_value: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an intent..." />
                      </SelectTrigger>
                      <SelectContent>
                        {INTENT_OPTIONS.map(intent => (
                          <SelectItem key={intent.value} value={intent.value}>
                            {intent.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : formData.trigger_type === 'sentiment' ? (
                    <div className="space-y-2">
                      <Input
                        type="number"
                        min="-1"
                        max="1"
                        step="0.1"
                        value={formData.trigger_value}
                        onChange={(e) => setFormData({ ...formData, trigger_value: e.target.value })}
                        placeholder="-0.5 (negative sentiment threshold)"
                      />
                      <p className="text-xs text-muted-foreground">
                        -1 = very negative, 0 = neutral, 1 = very positive
                      </p>
                    </div>
                  ) : formData.trigger_type === 'keyword' ? (
                    <div className="space-y-2">
                      <Input
                        value={formData.trigger_value}
                        onChange={(e) => setFormData({ ...formData, trigger_value: e.target.value })}
                        placeholder="price, cost, quote, budget"
                      />
                      <p className="text-xs text-muted-foreground">
                        Separate multiple keywords with commas
                      </p>
                    </div>
                  ) : (
                    <Input
                      value={formData.trigger_value}
                      onChange={(e) => setFormData({ ...formData, trigger_value: e.target.value })}
                      placeholder="speak to sales"
                    />
                  )}
                </div>

                {/* Target Agent */}
                <div className="space-y-2">
                  <Label>Target Agent</Label>
                  <Select
                    value={formData.target_agent_id}
                    onValueChange={(value) => setFormData({ ...formData, target_agent_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select agent..." />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map(agent => {
                        const Icon = getAgentIcon(agent.agent_type);
                        return (
                          <SelectItem key={agent.id} value={agent.id}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span>{agent.name}</span>
                              <Badge variant="outline" className="text-xs ml-2">
                                {agent.agent_type}
                              </Badge>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label>Priority (1-10)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 5 })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher priority rules are checked first
                  </p>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="rule-active">Active</Label>
                  <Switch
                    id="rule-active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingRule ? 'Update Rule' : 'Create Rule'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs for Rules, Analytics, and Flowchart */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="rules" className="gap-2">
            <Target className="h-4 w-4" />
            Rules
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="flowchart" className="gap-2">
            <GitBranch className="h-4 w-4" />
            Flowchart
          </TabsTrigger>
        </TabsList>

        {/* Rules Tab */}
        <TabsContent value="rules" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rules Table */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Routing Rules</CardTitle>
                  <CardDescription>
                    {rules.length} rules configured • Sorted by priority (highest first)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading rules...</div>
                  ) : rules.length === 0 ? (
                    <div className="text-center py-8">
                      <ArrowRightLeft className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                      <p className="text-muted-foreground">No routing rules configured</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Add rules or load defaults to get started
                      </p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[500px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Trigger</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Target</TableHead>
                            <TableHead className="text-center">Priority</TableHead>
                            <TableHead className="text-center">Triggers</TableHead>
                            <TableHead className="text-center">Active</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rules.map(rule => {
                            const TriggerIcon = getTriggerIcon(rule.trigger_type);
                            const AgentIcon = rule.target_agent ? getAgentIcon(rule.target_agent.agent_type) : Sparkles;
                            const analytics = getRuleAnalytics(rule.id);
                            
                            return (
                              <TableRow key={rule.id} className={!rule.is_active ? 'opacity-50' : ''}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <TriggerIcon className="h-4 w-4 text-muted-foreground" />
                                    <span className="capitalize">{rule.trigger_type}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <code className="text-xs bg-muted px-2 py-1 rounded">
                                    {rule.trigger_value.length > 25
                                      ? rule.trigger_value.substring(0, 25) + '...'
                                      : rule.trigger_value}
                                  </code>
                                </TableCell>
                                <TableCell>
                                  {rule.target_agent ? (
                                    <Badge className={getAgentColor(rule.target_agent.agent_type)}>
                                      <AgentIcon className="h-3 w-3 mr-1" />
                                      {rule.target_agent.name}
                                    </Badge>
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="outline">{rule.priority || 5}</Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge 
                                    variant={analytics?.trigger_count ? "default" : "secondary"}
                                    className={analytics?.trigger_count ? "bg-purple-100 text-purple-700" : ""}
                                  >
                                    {analytics?.trigger_count || 0}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Switch
                                    checked={rule.is_active}
                                    onCheckedChange={(checked) => handleToggleActive(rule.id, checked)}
                                  />
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEdit(rule)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete Rule?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This will permanently delete this routing rule. This action cannot be undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDelete(rule.id)}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Test Panel */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Play className="h-5 w-5 text-emerald-500" />
                    Test Routing
                  </CardTitle>
                  <CardDescription>
                    Test which rule matches a given message
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Test Message</Label>
                    <Input
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                      placeholder="Type a test message..."
                      onKeyPress={(e) => e.key === 'Enter' && handleTestRouting()}
                    />
                  </div>
                  <Button
                    onClick={handleTestRouting}
                    disabled={isTestLoading || !testMessage.trim()}
                    className="w-full"
                  >
                    {isTestLoading ? 'Testing...' : 'Test Routing'}
                  </Button>

                  {testResult && (
                    <div className={`p-4 rounded-lg border ${testResult.matched ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                      {testResult.matched ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-emerald-700">
                            <Check className="h-5 w-5" />
                            <span className="font-medium">Rule Matched!</span>
                          </div>
                          <div className="text-sm text-emerald-600">
                            <div><strong>Trigger:</strong> {testResult.rule?.trigger_type}</div>
                            <div><strong>Value:</strong> {testResult.rule?.trigger_value}</div>
                            <div className="flex items-center gap-1 mt-2">
                              <strong>Routes to:</strong>
                              {testResult.agent && (
                                <Badge className={getAgentColor(testResult.agent.agent_type)}>
                                  {testResult.agent.name}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-700">
                          <AlertTriangle className="h-5 w-5" />
                          <span className="font-medium">No matching rule found</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Rule Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Rules</span>
                    <span className="font-medium">{rules.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active Rules</span>
                    <span className="font-medium text-emerald-600">
                      {rules.filter(r => r.is_active).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Triggers</span>
                    <span className="font-medium text-purple-600">
                      {ruleAnalytics.reduce((sum, a) => sum + a.trigger_count, 0)}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground mb-2">By Trigger Type:</div>
                    <div className="flex flex-wrap gap-1">
                      {TRIGGER_TYPES.map(type => {
                        const count = rules.filter(r => r.trigger_type === type.value).length;
                        if (count === 0) return null;
                        return (
                          <Badge key={type.value} variant="outline" className="text-xs">
                            {type.label}: {count}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6">
          {renderAnalytics()}
        </TabsContent>

        {/* Flowchart Tab */}
        <TabsContent value="flowchart" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-purple-500" />
                Routing Flowchart
              </CardTitle>
              <CardDescription>
                Visual representation of how messages are routed to different agents based on active rules
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderFlowchart()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoutingRulesManager;
