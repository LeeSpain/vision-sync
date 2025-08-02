import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Bot, Users, Headphones, Wrench, Building } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AgentTemplate {
  id: string;
  name: string;
  category: string;
  role: string;
  department: string;
  description: string;
  personality: string;
  voice_id: string;
  default_settings: Record<string, any>;
  training_data: Record<string, any>;
}

interface AgentCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgentCreated: () => void;
}

const AgentCreationModal: React.FC<AgentCreationModalProps> = ({
  isOpen,
  onClose,
  onAgentCreated
}) => {
  const [templates, setTemplates] = useState<AgentTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);
  const [agentName, setAgentName] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        default_settings: template.default_settings as Record<string, any> || {},
        training_data: Array.isArray(template.training_data) ? template.training_data : []
      }));
      
      setTemplates(mappedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Failed to load agent templates');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'customer_support': return <Headphones className="h-5 w-5" />;
      case 'sales': return <Users className="h-5 w-5" />;
      case 'marketing': return <Bot className="h-5 w-5" />;
      case 'technical_support': return <Wrench className="h-5 w-5" />;
      case 'hr': return <Building className="h-5 w-5" />;
      default: return <Bot className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'customer_support': return 'bg-blue-100 text-blue-800';
      case 'sales': return 'bg-green-100 text-green-800';
      case 'marketing': return 'bg-purple-100 text-purple-800';
      case 'technical_support': return 'bg-orange-100 text-orange-800';
      case 'hr': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const createAgent = async () => {
    if (!selectedTemplate || !agentName.trim()) {
      toast.error('Please select a template and provide an agent name');
      return;
    }

    setIsLoading(true);
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
          department: selectedTemplate.department,
          is_active: true
        }])
        .select()
        .single();

      if (agentError) throw agentError;

      // Create agent-specific settings
      if (selectedTemplate.default_settings && Object.keys(selectedTemplate.default_settings).length > 0) {
        const settingsToInsert = Object.entries(selectedTemplate.default_settings).map(([key, value]) => ({
          setting_key: key,
          setting_value: value,
          agent_id: agent.id,
          description: `${key.replace(/_/g, ' ')} setting for ${agentName}`
        }));

        const { error: settingsError } = await supabase
          .from('ai_agent_settings')
          .insert(settingsToInsert);

        if (settingsError) throw settingsError;
      }

      // Create agent-specific training data
      if (selectedTemplate.training_data && Array.isArray(selectedTemplate.training_data) && selectedTemplate.training_data.length > 0) {
        const trainingDataToInsert = selectedTemplate.training_data.map((data: any) => ({
          ...data,
          agent_id: agent.id
        }));

        const { error: trainingError } = await supabase
          .from('ai_training_data')
          .insert(trainingDataToInsert);

        if (trainingError) throw trainingError;
      }

      toast.success(`${agentName} created successfully!`);
      onAgentCreated();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating agent:', error);
      toast.error('Failed to create agent');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedTemplate(null);
    setAgentName('');
    setAgentDescription('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New AI Agent</DialogTitle>
          <DialogDescription>
            Choose a template and customize your new AI agent
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Selection */}
          <div>
            <Label className="text-base font-medium">Choose Agent Template</Label>
            <div className="grid gap-3 mt-3 md:grid-cols-2">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate?.id === template.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(template.category)}
                        <CardTitle className="text-sm">{template.name}</CardTitle>
                      </div>
                      <Badge className={getCategoryColor(template.category)}>
                        {template.category.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-xs">
                      {template.description}
                    </CardDescription>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Department: {template.department.replace('_', ' ')}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Agent Configuration */}
          {selectedTemplate && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="agent-name">Agent Name *</Label>
                <Input
                  id="agent-name"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder={`e.g., ${selectedTemplate.name}`}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="agent-description">Custom Description (Optional)</Label>
                <Textarea
                  id="agent-description"
                  value={agentDescription}
                  onChange={(e) => setAgentDescription(e.target.value)}
                  placeholder={selectedTemplate.description}
                  className="mt-1"
                  rows={3}
                />
              </div>

              {/* Template Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Template Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div><strong>Category:</strong> {selectedTemplate.category.replace('_', ' ')}</div>
                  <div><strong>Role:</strong> {selectedTemplate.role.replace('_', ' ')}</div>
                  <div><strong>Department:</strong> {selectedTemplate.department.replace('_', ' ')}</div>
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
              disabled={!selectedTemplate || !agentName.trim() || isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Agent'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentCreationModal;