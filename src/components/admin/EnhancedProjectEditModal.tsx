import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project, CreateProjectData } from '@/utils/projectManager';
import { X, Plus, Calendar, DollarSign, Package, Users, TrendingUp, ExternalLink } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';

interface EnhancedProjectEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, projectData: Partial<CreateProjectData>) => Promise<void>;
  project: Project | null;
  loading?: boolean;
}

const EnhancedProjectEditModal: React.FC<EnhancedProjectEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  project,
  loading = false
}) => {
  const [formData, setFormData] = useState<CreateProjectData>({
    title: '',
    description: '',
    category: '',
    image_url: '',
    demo_url: '',
    github_url: '',
    technologies: [],
    is_public: true,
    is_featured: false,
    content_section: '',
    billing_type: '',
    status: 'active',
    priority_order: 0
  });
  
  const [newTech, setNewTech] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  const categories = [
    'E-commerce', 'Healthcare', 'Real Estate', 'Finance', 'Education',
    'Travel', 'Productivity', 'Entertainment', 'Social', 'Business', 
    'Portfolio', 'AI/ML', 'SaaS', 'Marketplace', 'Other'
  ];

  const contentSections = [
    'featured', 'platforms-for-sale', 'off-the-shelf', 'internal-tools', 
    'investment-opportunities', 'ai-agents', 'templates'
  ];

  const billingTypes = [
    { value: 'free', label: 'Free' },
    { value: 'one-time', label: 'One-time Purchase' },
    { value: 'subscription', label: 'Subscription' },
    { value: 'investment', label: 'Investment' }
  ];

  const statusOptions = [
    'active', 'development', 'sold', 'funded', 'archived', 'paused'
  ];

  const subscriptionPeriods = ['monthly', 'yearly', 'weekly'];

  // Initialize form data when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description || '',
        category: project.category || '',
        image_url: project.image_url || '',
        demo_url: project.demo_url || '',
        github_url: project.github_url || '',
        technologies: project.technologies || [],
        is_public: project.is_public,
        is_featured: project.is_featured,
        content_section: project.content_section || '',
        pricing: project.pricing || null,
        billing_type: project.billing_type || '',
        investment_amount: project.investment_amount || undefined,
        funding_progress: project.funding_progress || 0,
        subscription_price: project.subscription_price || undefined,
        subscription_period: project.subscription_period || '',
        price: project.price || undefined,
        deposit_amount: project.deposit_amount || undefined,
        priority_order: project.priority_order || 0,
        status: project.status || 'active',
        route: project.route || '',
        expected_roi: project.expected_roi || undefined,
        investment_deadline: project.investment_deadline || '',
        investor_count: project.investor_count || 0,
        social_proof: project.social_proof || null
      });
    }
  }, [project]);

  const handleAddTechnology = () => {
    if (newTech.trim() && !formData.technologies?.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...(prev.technologies || []), newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const handleRemoveTechnology = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies?.filter(tech => tech !== techToRemove) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !project) {
      alert('Please enter a project title');
      return;
    }

    // Generate route from title if not provided
    const routeSlug = formData.route || `/${formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    
    const updatedData = {
      ...formData,
      route: routeSlug,
      investment_deadline: formData.investment_deadline || undefined
    };

    await onSubmit(project.id, updatedData);
  };

  const handleClose = () => {
    setNewTech('');
    setActiveTab('basic');
    onClose();
  };

  if (!project) return null;

  const renderBasicTab = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Project Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter project title"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe your project"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="content_section">Content Section</Label>
          <Select
            value={formData.content_section || ""}
            onValueChange={(value) => setFormData(prev => ({ ...prev, content_section: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {contentSections.map(section => (
                <SelectItem key={section} value={section}>
                  {section.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(status => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="priority_order">Priority Order</Label>
          <Input
            id="priority_order"
            type="number"
            value={formData.priority_order || 0}
            onChange={(e) => setFormData(prev => ({ ...prev, priority_order: parseInt(e.target.value) || 0 }))}
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="route">Custom Route (optional)</Label>
        <Input
          id="route"
          value={formData.route}
          onChange={(e) => setFormData(prev => ({ ...prev, route: e.target.value }))}
          placeholder="/custom-project-route"
        />
      </div>
    </div>
  );

  const renderPricingTab = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="billing_type">Billing Type</Label>
        <Select
          value={formData.billing_type}
          onValueChange={(value) => setFormData(prev => ({ ...prev, billing_type: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select billing type" />
          </SelectTrigger>
          <SelectContent>
            {billingTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {formData.billing_type === 'one-time' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || undefined }))}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="deposit_amount">Deposit Amount ($)</Label>
            <Input
              id="deposit_amount"
              type="number"
              step="0.01"
              value={formData.deposit_amount || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, deposit_amount: parseFloat(e.target.value) || undefined }))}
              placeholder="0.00"
            />
          </div>
        </div>
      )}

      {formData.billing_type === 'subscription' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="subscription_price">Subscription Price ($)</Label>
            <Input
              id="subscription_price"
              type="number"
              step="0.01"
              value={formData.subscription_price || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, subscription_price: parseFloat(e.target.value) || undefined }))}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="subscription_period">Billing Period</Label>
            <Select
              value={formData.subscription_period}
              onValueChange={(value) => setFormData(prev => ({ ...prev, subscription_period: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {subscriptionPeriods.map(period => (
                  <SelectItem key={period} value={period}>
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {formData.billing_type === 'investment' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="investment_amount">Investment Amount ($)</Label>
              <Input
                id="investment_amount"
                type="number"
                step="0.01"
                value={formData.investment_amount || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, investment_amount: parseFloat(e.target.value) || undefined }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="expected_roi">Expected ROI (%)</Label>
              <Input
                id="expected_roi"
                type="number"
                step="0.01"
                value={formData.expected_roi || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, expected_roi: parseFloat(e.target.value) || undefined }))}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="funding_progress">Funding Progress (%)</Label>
              <Input
                id="funding_progress"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.funding_progress || 0}
                onChange={(e) => setFormData(prev => ({ ...prev, funding_progress: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="investor_count">Investor Count</Label>
              <Input
                id="investor_count"
                type="number"
                value={formData.investor_count || 0}
                onChange={(e) => setFormData(prev => ({ ...prev, investor_count: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="investment_deadline">Investment Deadline</Label>
            <Input
              id="investment_deadline"
              type="datetime-local"
              value={formData.investment_deadline ? new Date(formData.investment_deadline).toISOString().slice(0, 16) : ''}
              onChange={(e) => setFormData(prev => ({ ...prev, investment_deadline: e.target.value ? new Date(e.target.value).toISOString() : '' }))}
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderMediaTab = () => (
    <div className="space-y-4">
      <ImageUpload
        currentUrl={formData.image_url}
        onImageChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
        label="Project Image"
        description="Upload an image to represent your project"
      />

      <div>
        <Label htmlFor="demo_url">Demo URL</Label>
        <div className="flex gap-2">
          <Input
            id="demo_url"
            type="url"
            value={formData.demo_url}
            onChange={(e) => setFormData(prev => ({ ...prev, demo_url: e.target.value }))}
            placeholder="https://demo.example.com"
          />
          {formData.demo_url && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.open(formData.demo_url, '_blank')}
              className="shrink-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="github_url">GitHub URL</Label>
        <div className="flex gap-2">
          <Input
            id="github_url"
            type="url"
            value={formData.github_url}
            onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
            placeholder="https://github.com/username/repo"
          />
          {formData.github_url && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.open(formData.github_url, '_blank')}
              className="shrink-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Technologies */}
      <div className="space-y-4">
        <Label>Technologies</Label>
        <div className="flex gap-2">
          <Input
            value={newTech}
            onChange={(e) => setNewTech(e.target.value)}
            placeholder="Add technology (e.g., React, Node.js)"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTechnology();
              }
            }}
          />
          <Button type="button" onClick={handleAddTechnology} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {formData.technologies && formData.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.technologies.map((tech, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tech}
                <button
                  type="button"
                  onClick={() => handleRemoveTechnology(tech)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="is_public">Public Project</Label>
        <Switch
          id="is_public"
          checked={formData.is_public}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: checked }))}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="is_featured">Featured Project</Label>
        <Switch
          id="is_featured"
          checked={formData.is_featured}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
        />
      </div>
    </div>
  );

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Package },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'media', label: 'Media & Tech', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Users }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Edit Project - {project?.title}</DialogTitle>
        </DialogHeader>

        <div className="flex h-[600px]">
          {/* Sidebar Navigation */}
          <div className="w-48 border-r pr-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </Button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 pl-6">
            <form onSubmit={handleSubmit} className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto">
                {activeTab === 'basic' && renderBasicTab()}
                {activeTab === 'pricing' && renderPricingTab()}
                {activeTab === 'media' && renderMediaTab()}
                {activeTab === 'settings' && renderSettingsTab()}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !formData.title.trim()}
                  className="flex-1"
                >
                  {loading ? 'Updating...' : 'Update Project'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedProjectEditModal;