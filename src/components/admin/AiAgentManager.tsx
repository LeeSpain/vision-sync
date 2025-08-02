import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Brain, MessageSquare, Settings, Database, Mic, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AiAgent {
  id: string;
  name: string;
  description: string;
  personality: string;
  voice_id: string;
  avatar_config: any;
  is_active: boolean;
  business_knowledge: any;
  conversation_rules: any;
  created_at: string;
  updated_at: string;
}

interface AiSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description: string;
}

interface TrainingData {
  id: string;
  category: string;
  question: string;
  answer: string;
  context: any;
  is_active: boolean;
  priority: number;
}

const AiAgentManager: React.FC = () => {
  const [agents, setAgents] = useState<AiAgent[]>([]);
  const [settings, setSettings] = useState<AiSetting[]>([]);
  const [trainingData, setTrainingData] = useState<TrainingData[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AiAgent | null>(null);
  const [newTrainingData, setNewTrainingData] = useState({
    category: '',
    question: '',
    answer: '',
    priority: 1
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [agentsRes, settingsRes, trainingRes] = await Promise.all([
        supabase.from('ai_agents').select('*').order('created_at', { ascending: false }),
        supabase.from('ai_agent_settings').select('*').order('setting_key'),
        supabase.from('ai_training_data').select('*').order('priority', { ascending: false })
      ]);

      if (agentsRes.data) setAgents(agentsRes.data);
      if (settingsRes.data) setSettings(settingsRes.data);
      if (trainingRes.data) setTrainingData(trainingRes.data);
    } catch (error) {
      console.error('Error loading AI data:', error);
      toast.error('Failed to load AI agent data');
    }
  };

  const updateAgentField = async (field: string, value: any) => {
    if (!selectedAgent) return;

    try {
      const { error } = await supabase
        .from('ai_agents')
        .update({ [field]: value })
        .eq('id', selectedAgent.id);

      if (error) throw error;

      setSelectedAgent({ ...selectedAgent, [field]: value });
      setAgents(agents.map(agent => 
        agent.id === selectedAgent.id ? { ...agent, [field]: value } : agent
      ));
      toast.success('Agent updated successfully');
    } catch (error) {
      console.error('Error updating agent:', error);
      toast.error('Failed to update agent');
    }
  };

  const updateSetting = async (settingKey: string, value: any) => {
    try {
      const { error } = await supabase
        .from('ai_agent_settings')
        .update({ setting_value: value })
        .eq('setting_key', settingKey);

      if (error) throw error;

      setSettings(settings.map(setting => 
        setting.setting_key === settingKey ? { ...setting, setting_value: value } : setting
      ));
      toast.success('Setting updated successfully');
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Failed to update setting');
    }
  };

  const addTrainingData = async () => {
    if (!newTrainingData.question || !newTrainingData.answer) {
      toast.error('Please fill in question and answer');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('ai_training_data')
        .insert([newTrainingData])
        .select()
        .single();

      if (error) throw error;

      setTrainingData([data, ...trainingData]);
      setNewTrainingData({ category: '', question: '', answer: '', priority: 1 });
      toast.success('Training data added successfully');
    } catch (error) {
      console.error('Error adding training data:', error);
      toast.error('Failed to add training data');
    }
  };

  const deleteTrainingData = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ai_training_data')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTrainingData(trainingData.filter(item => item.id !== id));
      toast.success('Training data deleted successfully');
    } catch (error) {
      console.error('Error deleting training data:', error);
      toast.error('Failed to delete training data');
    }
  };

  const voiceOptions = [
    { value: 'alloy', label: 'Alloy' },
    { value: 'echo', label: 'Echo' },
    { value: 'fable', label: 'Fable' },
    { value: 'onyx', label: 'Onyx' },
    { value: 'nova', label: 'Nova' },
    { value: 'shimmer', label: 'Shimmer' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Agent Manager</h1>
          <p className="text-muted-foreground">
            Configure your AI agent, manage conversations, and train the knowledge base
          </p>
        </div>
      </div>

      <Tabs defaultValue="agent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agent" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Agent Config
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Training Data
          </TabsTrigger>
          <TabsTrigger value="conversations" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Conversations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agent" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Available Agents</CardTitle>
                <CardDescription>Select an agent to configure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedAgent?.id === agent.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{agent.name}</h4>
                        <p className="text-sm text-muted-foreground">{agent.description}</p>
                      </div>
                      <Badge variant={agent.is_active ? "default" : "secondary"}>
                        {agent.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {selectedAgent && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Agent Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="agent-name">Agent Name</Label>
                    <Input
                      id="agent-name"
                      value={selectedAgent.name}
                      onChange={(e) => updateAgentField('name', e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="agent-description">Description</Label>
                    <Textarea
                      id="agent-description"
                      value={selectedAgent.description || ''}
                      onChange={(e) => updateAgentField('description', e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="agent-personality">Personality</Label>
                    <Textarea
                      id="agent-personality"
                      value={selectedAgent.personality}
                      onChange={(e) => updateAgentField('personality', e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="voice-select">Voice</Label>
                    <Select
                      value={selectedAgent.voice_id}
                      onValueChange={(value) => updateAgentField('voice_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {voiceOptions.map((voice) => (
                          <SelectItem key={voice.value} value={voice.value}>
                            {voice.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="agent-active"
                      checked={selectedAgent.is_active}
                      onCheckedChange={(checked) => updateAgentField('is_active', checked)}
                    />
                    <Label htmlFor="agent-active">Agent Active</Label>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-4">
            {settings.map((setting) => (
              <Card key={setting.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    {setting.setting_key.replace(/_/g, ' ').toUpperCase()}
                  </CardTitle>
                  <CardDescription>{setting.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {setting.setting_key.includes('_enabled') ? (
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={setting.setting_value === true || setting.setting_value === 'true'}
                        onCheckedChange={(checked) => updateSetting(setting.setting_key, checked)}
                      />
                      <Label>
                        {setting.setting_value === true || setting.setting_value === 'true' ? 'Enabled' : 'Disabled'}
                      </Label>
                    </div>
                  ) : setting.setting_key === 'quick_actions' || setting.setting_key === 'initial_prompts' || setting.setting_key === 'escalation_triggers' ? (
                    <Textarea
                      value={typeof setting.setting_value === 'string' ? setting.setting_value : JSON.stringify(setting.setting_value, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          updateSetting(setting.setting_key, parsed);
                        } catch {
                          updateSetting(setting.setting_key, e.target.value);
                        }
                      }}
                      placeholder={`Enter ${setting.setting_key.replace(/_/g, ' ')} as JSON array`}
                      rows={4}
                    />
                  ) : setting.setting_key === 'welcome_message' ? (
                    <Textarea
                      value={typeof setting.setting_value === 'string' ? (
                        setting.setting_value.startsWith('"') ? 
                          JSON.parse(setting.setting_value || '""') : 
                          setting.setting_value
                      ) : setting.setting_value}
                      onChange={(e) => updateSetting(setting.setting_key, JSON.stringify(e.target.value))}
                      placeholder="Enter welcome message"
                      rows={3}
                    />
                  ) : setting.setting_key === 'response_tone' || setting.setting_key === 'response_format' || setting.setting_key === 'emoji_usage' || setting.setting_key === 'contact_collection_timing' ? (
                    <Select
                      value={typeof setting.setting_value === 'string' ? (
                        setting.setting_value.startsWith('"') ? 
                          JSON.parse(setting.setting_value || '""') : 
                          setting.setting_value
                      ) : setting.setting_value}
                      onValueChange={(value) => updateSetting(setting.setting_key, JSON.stringify(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {setting.setting_key === 'response_tone' && [
                          <SelectItem key="professional" value="professional">Professional</SelectItem>,
                          <SelectItem key="friendly" value="friendly">Friendly</SelectItem>,
                          <SelectItem key="casual" value="casual">Casual</SelectItem>,
                          <SelectItem key="friendly_professional" value="friendly_professional">Friendly Professional</SelectItem>
                        ]}
                        {setting.setting_key === 'response_format' && [
                          <SelectItem key="bullet_points" value="bullet_points">Bullet Points</SelectItem>,
                          <SelectItem key="paragraphs" value="paragraphs">Paragraphs</SelectItem>,
                          <SelectItem key="conversational" value="conversational">Conversational</SelectItem>
                        ]}
                        {setting.setting_key === 'emoji_usage' && [
                          <SelectItem key="disabled" value="disabled">Disabled</SelectItem>,
                          <SelectItem key="minimal" value="minimal">Minimal</SelectItem>,
                          <SelectItem key="moderate" value="moderate">Moderate</SelectItem>,
                          <SelectItem key="frequent" value="frequent">Frequent</SelectItem>
                        ]}
                        {setting.setting_key === 'contact_collection_timing' && [
                          <SelectItem key="immediate" value="immediate">Immediate</SelectItem>,
                          <SelectItem key="after_2_messages" value="after_2_messages">After 2 Messages</SelectItem>,
                          <SelectItem key="after_3_messages" value="after_3_messages">After 3 Messages</SelectItem>,
                          <SelectItem key="after_5_messages" value="after_5_messages">After 5 Messages</SelectItem>,
                          <SelectItem key="on_trigger" value="on_trigger">On Trigger</SelectItem>
                        ]}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type={setting.setting_key.includes('api_key') ? 'password' : setting.setting_key === 'greeting_delay' || setting.setting_key === 'max_response_length' ? 'number' : 'text'}
                      value={typeof setting.setting_value === 'string' && (setting.setting_key === 'greeting_delay' || setting.setting_key === 'max_response_length') ? setting.setting_value : (typeof setting.setting_value === 'string' ? (
                        setting.setting_value.startsWith('"') ? 
                          JSON.parse(setting.setting_value || '""') : 
                          setting.setting_value
                      ) : setting.setting_value)}
                      onChange={(e) => {
                        if (setting.setting_key === 'greeting_delay' || setting.setting_key === 'max_response_length') {
                          updateSetting(setting.setting_key, parseInt(e.target.value) || 0);
                        } else {
                          updateSetting(setting.setting_key, JSON.stringify(e.target.value));
                        }
                      }}
                      placeholder={`Enter ${setting.setting_key.replace(/_/g, ' ')}`}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Training Data</CardTitle>
              <CardDescription>Teach your AI agent about your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newTrainingData.category}
                    onChange={(e) => setNewTrainingData({...newTrainingData, category: e.target.value})}
                    placeholder="e.g., pricing, services, contact"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTrainingData.priority.toString()}
                    onValueChange={(value) => setNewTrainingData({...newTrainingData, priority: parseInt(value)})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Low</SelectItem>
                      <SelectItem value="2">Medium</SelectItem>
                      <SelectItem value="3">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  value={newTrainingData.question}
                  onChange={(e) => setNewTrainingData({...newTrainingData, question: e.target.value})}
                  placeholder="What question might customers ask?"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  value={newTrainingData.answer}
                  onChange={(e) => setNewTrainingData({...newTrainingData, answer: e.target.value})}
                  placeholder="How should the AI respond?"
                  rows={3}
                />
              </div>

              <Button onClick={addTrainingData}>Add Training Data</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Training Data</CardTitle>
              <CardDescription>Manage your AI's knowledge base</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingData.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.category}</Badge>
                        <Badge variant={item.priority === 3 ? "default" : item.priority === 2 ? "secondary" : "outline"}>
                          Priority {item.priority}
                        </Badge>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => deleteTrainingData(item.id)}>
                        Delete
                      </Button>
                    </div>
                    <div>
                      <p className="font-medium">Q: {item.question}</p>
                      <p className="text-muted-foreground">A: {item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>Conversation analytics and monitoring will be available here</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This section will show real-time conversations, lead qualification status, and conversion analytics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AiAgentManager;