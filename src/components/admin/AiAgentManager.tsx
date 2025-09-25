import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Brain, MessageSquare, Settings, Database, Mic, User, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ConversationsAnalytics from './ConversationsAnalytics';
import AgentCreationModal from './AgentCreationModal';
import { QuickActionsEditor } from './QuickActionsEditor';

interface AiAgent {
  id: string;
  name: string;
  description: string;
  personality: string;
  voice_id: string;
  is_active: boolean;
  category: string;
  role: string;
  department: string;
  created_at: string;
  updated_at: string;
}

interface AiSetting {
  id: string;
  agent_id: string;
  setting_key: string;
  setting_value: any;
  description: string;
  created_at: string;
}

interface TrainingData {
  id: string;
  agent_id: string;
  training_type: string;
  content: string;
  metadata: any;
  is_active: boolean;
  created_at: string;
}

const AiAgentManager: React.FC = () => {
  const [agents, setAgents] = useState<AiAgent[]>([]);
  const [settings, setSettings] = useState<AiSetting[]>([]);
  const [trainingData, setTrainingData] = useState<TrainingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<AiAgent | null>(null);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [newTrainingItem, setNewTrainingItem] = useState({
    training_type: '',
    content: '',
    metadata: {}
  });

  useEffect(() => {
    loadAgents();
    loadSettings();
    loadTrainingData();
  }, []);

  const loadAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      console.error('Error loading agents:', error);
      toast.error('Failed to load AI agents');
    }
  };

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_agent_settings')
        .select('*');

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadTrainingData = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_training_data')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrainingData(data || []);
    } catch (error) {
      console.error('Error loading training data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAgent = async (agentId: string, updates: Partial<AiAgent>) => {
    try {
      const { error } = await supabase
        .from('ai_agents')
        .update(updates)
        .eq('id', agentId);

      if (error) throw error;
      
      setAgents(agents.map(agent => 
        agent.id === agentId ? { ...agent, ...updates } : agent
      ));
      
      if (selectedAgent?.id === agentId) {
        setSelectedAgent({ ...selectedAgent, ...updates });
      }
      
      toast.success('Agent updated successfully');
    } catch (error) {
      console.error('Error updating agent:', error);
      toast.error('Failed to update agent');
    }
  };

  const deleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;

    try {
      const { error } = await supabase
        .from('ai_agents')
        .delete()
        .eq('id', agentId);

      if (error) throw error;
      
      setAgents(agents.filter(agent => agent.id !== agentId));
      if (selectedAgent?.id === agentId) {
        setSelectedAgent(null);
      }
      
      toast.success('Agent deleted successfully');
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast.error('Failed to delete agent');
    }
  };

  const addTrainingData = async () => {
    if (!selectedAgent || !newTrainingItem.training_type || !newTrainingItem.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('ai_training_data')
        .insert([{
          agent_id: selectedAgent.id,
          training_type: newTrainingItem.training_type,
          content: newTrainingItem.content,
          metadata: newTrainingItem.metadata,
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;
      
      setTrainingData([data, ...trainingData]);
      setNewTrainingItem({ training_type: '', content: '', metadata: {} });
      toast.success('Training data added successfully');
    } catch (error) {
      console.error('Error adding training data:', error);
      toast.error('Failed to add training data');
    }
  };

  const deleteTrainingData = async (trainingId: string) => {
    try {
      const { error } = await supabase
        .from('ai_training_data')
        .delete()
        .eq('id', trainingId);

      if (error) throw error;
      
      setTrainingData(trainingData.filter(item => item.id !== trainingId));
      toast.success('Training data deleted successfully');
    } catch (error) {
      console.error('Error deleting training data:', error);
      toast.error('Failed to delete training data');
    }
  };

  const getAgentSettings = (agentId: string) => {
    return settings.filter(setting => setting.agent_id === agentId);
  };

  const getAgentTrainingData = (agentId: string) => {
    return trainingData.filter(item => item.agent_id === agentId);
  };

  if (loading) {
    return <div className="p-6">Loading AI agents...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">AI Agent Manager</h2>
          <p className="text-muted-foreground">Configure and manage your AI agents</p>
        </div>
        <Button onClick={() => setIsCreationModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agents List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Active Agents ({agents.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedAgent?.id === agent.id
                      ? 'bg-primary/5 border-primary'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{agent.name}</h4>
                      <p className="text-sm text-muted-foreground">{agent.category}</p>
                    </div>
                    <Badge variant={agent.is_active ? "default" : "secondary"}>
                      {agent.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              ))}
              {agents.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No agents created yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Agent Details */}
        <div className="lg:col-span-2">
          {selectedAgent ? (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="training">Training</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{selectedAgent.name}</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteAgent(selectedAgent.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Agent Name</Label>
                      <Input
                        id="name"
                        value={selectedAgent.name}
                        onChange={(e) => updateAgent(selectedAgent.id, { name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={selectedAgent.description || ''}
                        onChange={(e) => updateAgent(selectedAgent.id, { description: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="personality">Personality</Label>
                      <Textarea
                        id="personality"
                        value={selectedAgent.personality || ''}
                        onChange={(e) => updateAgent(selectedAgent.id, { personality: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <Label>Status</Label>
                        <Button
                          variant={selectedAgent.is_active ? "default" : "secondary"}
                          onClick={() => updateAgent(selectedAgent.id, { is_active: !selectedAgent.is_active })}
                        >
                          {selectedAgent.is_active ? "Active" : "Inactive"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Agent Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getAgentSettings(selectedAgent.id).map((setting) => (
                        <div key={setting.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{setting.setting_key}</h4>
                              <p className="text-sm text-muted-foreground">{setting.description}</p>
                              <p className="text-sm mt-1">
                                Value: {JSON.stringify(setting.setting_value)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {getAgentSettings(selectedAgent.id).length === 0 && (
                        <p className="text-muted-foreground text-center py-4">
                          No settings configured for this agent
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="training">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Training Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Add new training data */}
                    <div className="p-4 border rounded-lg space-y-3">
                      <h4 className="font-medium">Add Training Data</h4>
                      <div>
                        <Label htmlFor="training_type">Training Type</Label>
                        <Input
                          id="training_type"
                          value={newTrainingItem.training_type}
                          onChange={(e) => setNewTrainingItem({
                            ...newTrainingItem,
                            training_type: e.target.value
                          })}
                          placeholder="e.g., faq, knowledge, instructions"
                        />
                      </div>
                      <div>
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          value={newTrainingItem.content}
                          onChange={(e) => setNewTrainingItem({
                            ...newTrainingItem,
                            content: e.target.value
                          })}
                          placeholder="Training content..."
                        />
                      </div>
                      <Button onClick={addTrainingData}>
                        Add Training Data
                      </Button>
                    </div>

                    {/* Existing training data */}
                    <div className="space-y-3">
                      {getAgentTrainingData(selectedAgent.id).map((item) => (
                        <div key={item.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">{item.training_type}</Badge>
                                <Badge variant={item.is_active ? "default" : "secondary"}>
                                  {item.is_active ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              <p className="text-sm">{item.content}</p>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteTrainingData(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {getAgentTrainingData(selectedAgent.id).length === 0 && (
                        <p className="text-muted-foreground text-center py-4">
                          No training data available for this agent
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <ConversationsAnalytics agentId={selectedAgent.id} />
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Select an Agent</h3>
                  <p className="text-muted-foreground">
                    Choose an agent from the list to view and edit its details
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <AgentCreationModal
        isOpen={isCreationModalOpen}
        onClose={() => setIsCreationModalOpen(false)}
        onAgentCreated={() => {
          loadAgents();
          setIsCreationModalOpen(false);
        }}
      />
    </div>
  );
};

export default AiAgentManager;
