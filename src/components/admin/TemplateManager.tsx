import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, BarChart3, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TemplateCreationModal } from './TemplateCreationModal';
import { TemplateEditModal } from './TemplateEditModal';
import { TemplateAnalytics } from './TemplateAnalytics';
import { TemplatePreviewModal } from './TemplatePreviewModal';

interface AppTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  detailed_description: string;
  key_features: any;
  industry: string;
  pricing: any;
  image_url: string;
  gallery_images: string[];
  is_popular: boolean;
  is_active: boolean;
  questionnaire_weight: any;
  ai_generated_content: any;
  template_config: any;
  created_at: string;
  updated_at: string;
}

export function TemplateManager() {
  const [templates, setTemplates] = useState<AppTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<AppTemplate | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  
  const industryFilters = ['all', 'Hairdressing & Beauty', 'Restaurant & Food Service', 'Fitness & Wellness', 
                          'Home Services', 'Retail & E-commerce', 'Healthcare', 'Real Estate'];
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    popular: 0,
    questionnaire_responses: 0
  });

  useEffect(() => {
    loadTemplates();
    loadStats();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('app_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const [templatesRes, responsesRes] = await Promise.all([
        supabase.from('app_templates').select('is_active, is_popular'),
        supabase.from('template_questionnaire_responses').select('id')
      ]);

      const templates = templatesRes.data || [];
      const responses = responsesRes.data || [];

      setStats({
        total: templates.length,
        active: templates.filter(t => t.is_active).length,
        popular: templates.filter(t => t.is_popular).length,
        questionnaire_responses: responses.length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleToggleActive = async (template: AppTemplate) => {
    try {
      const { error } = await supabase
        .from('app_templates')
        .update({ is_active: !template.is_active })
        .eq('id', template.id);

      if (error) throw error;
      
      await loadTemplates();
      await loadStats();
      toast.success(`Template ${template.is_active ? 'deactivated' : 'activated'}`);
    } catch (error) {
      console.error('Error toggling template status:', error);
      toast.error('Failed to update template status');
    }
  };

  const handleTogglePopular = async (template: AppTemplate) => {
    try {
      const { error } = await supabase
        .from('app_templates')
        .update({ is_popular: !template.is_popular })
        .eq('id', template.id);

      if (error) throw error;
      
      await loadTemplates();
      await loadStats();
      toast.success(`Template ${template.is_popular ? 'removed from' : 'marked as'} popular`);
    } catch (error) {
      console.error('Error toggling popular status:', error);
      toast.error('Failed to update popular status');
    }
  };

  const handleDelete = async (template: AppTemplate) => {
    if (!confirm(`Are you sure you want to delete "${template.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('app_templates')
        .delete()
        .eq('id', template.id);

      if (error) throw error;
      
      await loadTemplates();
      await loadStats();
      toast.success('Template deleted successfully');
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };

  const handleEdit = (template: AppTemplate) => {
    setSelectedTemplate(template);
    setIsEditModalOpen(true);
  };

  const handlePreview = (template: AppTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const filteredTemplates = selectedIndustry === 'all' 
    ? templates 
    : templates.filter(template => template.industry === selectedIndustry);

  const handleCreateSuccess = () => {
    loadTemplates();
    loadStats();
  };

  const handleEditSuccess = () => {
    loadTemplates();
    loadStats();
    setSelectedTemplate(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Template Manager</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                <div className="h-8 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Template Manager</h2>
          <p className="text-muted-foreground">Manage your app templates and track performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by industry" />
            </SelectTrigger>
            <SelectContent>
              {industryFilters.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry === 'all' ? 'All Industries' : industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setIsAnalyticsOpen(true)} variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Templates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-sm text-muted-foreground">Active Templates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">{stats.popular}</div>
            <p className="text-sm text-muted-foreground">Popular Templates</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-600">{stats.questionnaire_responses}</div>
            <p className="text-sm text-muted-foreground">Questionnaire Responses</p>
          </CardContent>
        </Card>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              {template.image_url ? (
                <img 
                  src={template.image_url} 
                  alt={template.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                {template.is_popular && (
                  <Badge variant="secondary" className="text-xs">Popular</Badge>
                )}
                <Badge variant={template.is_active ? "default" : "secondary"} className="text-xs">
                  {template.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{template.title}</CardTitle>
              <CardDescription>
                <div className="flex gap-2 mb-2">
                  <Badge variant="outline">{template.category}</Badge>
                  {template.industry && (
                    <Badge variant="secondary" className="text-xs">{template.industry}</Badge>
                  )}
                </div>
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.isArray(template.key_features) ? template.key_features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                )) : null}
                {Array.isArray(template.key_features) && template.key_features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.key_features.length - 3} more
                  </Badge>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePreview(template)}
                    className="flex-1"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(template)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(template)}
                    className="flex-1"
                  >
                    {template.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTogglePopular(template)}
                    className="flex-1"
                  >
                    {template.is_popular ? 'Unpopular' : 'Popular'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(template)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && templates.length > 0 && (
        <Card className="p-12 text-center">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-muted-foreground mb-4">
              No templates match the selected industry filter
            </p>
            <Button onClick={() => setSelectedIndustry('all')} variant="outline">
              Show All Templates
            </Button>
          </CardContent>
        </Card>
      )}

      {templates.length === 0 && (
        <Card className="p-12 text-center">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">No templates yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first template to get started
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <TemplateCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {selectedTemplate && (
        <TemplateEditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTemplate(null);
          }}
          template={selectedTemplate}
          onSuccess={handleEditSuccess}
        />
      )}

      <TemplateAnalytics
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />

      {selectedTemplate && (
        <TemplatePreviewModal
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            setSelectedTemplate(null);
          }}
          template={selectedTemplate}
        />
      )}
    </div>
  );
}