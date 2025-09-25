import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Bot, User, MessageSquare, Settings } from "lucide-react";

interface AgentTemplate {
  id: string;
  name: string;
  category: string;
  role: string;
  description: string;
  personality: string;
  voice_id: string;
  default_settings: Record<string, any>;
  created_at: string;
}

interface AgentCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgentCreated: () => void;
}

const AgentCreationModal: React.FC<AgentCreationModalProps> = ({
  isOpen,
  onClose,
  onAgentCreated,
}) => {
  const [templates, setTemplates] = useState<AgentTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_agent_templates')
        .select('*')
        .order('category');

      if (error) throw error;
      
      const mappedTemplates: AgentTemplate[] = (data || []).map(template => ({
        ...template,
        default_settings: template.default_settings as Record<string, any> || {}
      }));
      
      setTemplates(mappedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Failed to load agent templates');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'support': return User;
      case 'sales': return MessageSquare;
      case 'technical': return Settings;
      default: return Bot;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'support': return 'bg-blue-100 text-blue-800';
      case 'sales': return 'bg-green-100 text-green-800';
      case 'technical': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const createAgent = async () => {
    if (!selectedTemplate || !agentName.trim()) {
      toast.error('Please select a template and provide an agent name');
      return;
    }

    setLoading(true);
    try {
      // Create the agent
      const { data: agent, error: agentError } = await supabase
        .from('ai_agents')
        .insert([{
          name: agentName,
          description: agentDescription || selectedTemplate.description,
          personality: selectedTemplate.personality,
          voice_id: selectedTemplate.voice_id,
          category: selectedTemplate.category,
          role: selectedTemplate.role,
          department: selectedTemplate.category, // Using category as department for now
          is_active: true
        }])
        .select()
        .single();

      if (agentError) throw agentError;

      // Create agent-specific settings if available
      if (selectedTemplate.default_settings && Object.keys(selectedTemplate.default_settings).length > 0) {
        const settingsToInsert = Object.entries(selectedTemplate.default_settings).map(([key, value]) => ({
          agent_id: agent.id,
          setting_key: key,
          setting_value: value,
          description: `Default ${key} setting`
        }));

        const { error: settingsError } = await supabase
          .from('ai_agent_settings')
          .insert(settingsToInsert);

        if (settingsError) throw settingsError;
      }

      toast.success(`${agentName} created successfully!`);
      onAgentCreated();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating agent:', error);
      toast.error('Failed to create agent');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedTemplate(null);
    setAgentName('');
    setAgentDescription('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Create New AI Agent
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Selection */}
          <div>
            <Label className="text-base font-semibold">Select Agent Template</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              {templates.map((template) => {
                const Icon = getCategoryIcon(template.category);
                const isSelected = selectedTemplate?.id === template.id;
                
                return (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? 'ring-2 ring-primary border-primary' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <CardTitle className="text-sm">{template.name}</CardTitle>
                        </div>
                        <Badge className={getCategoryColor(template.category)}>
                          {template.category}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        {template.description}
                      </CardDescription>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Role: {template.role}
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Agent Configuration */}
          {selectedTemplate && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="agentName">Agent Name *</Label>
                  <Input
                    id="agentName"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="Enter a unique name for this agent"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="agentDescription">Description (Optional)</Label>
                  <Textarea
                    id="agentDescription"
                    value={agentDescription}
                    onChange={(e) => setAgentDescription(e.target.value)}
                    placeholder="Customize the agent description or leave blank to use template default"
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Template Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Template Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><strong>Category:</strong> {selectedTemplate.category}</div>
                  <div><strong>Role:</strong> {selectedTemplate.role}</div>
                  <div><strong>Voice:</strong> {selectedTemplate.voice_id}</div>
                  <div><strong>Personality:</strong> {selectedTemplate.personality}</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={createAgent}
              disabled={!selectedTemplate || !agentName.trim() || loading}
            >
              {loading ? 'Creating...' : 'Create Agent'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentCreationModal;