import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Wand2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { templateCategories } from '@/utils/appTemplates';
import { ImageUpload } from '@/components/ui/image-upload';
import { AutoImageGenerator } from './AutoImageGenerator';

interface Industry {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
}

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
}

interface TemplateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: AppTemplate;
  onSuccess: () => void;
}

export function TemplateEditModal({ isOpen, onClose, template, onSuccess }: TemplateEditModalProps) {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    detailed_description: '',
    industry: '',
    image_url: '',
    is_popular: false,
    is_active: true,
    pricing: {
      base: '',
      customization: '',
      monthly: '',
      deposit: ''
    }
  });
  const [keyFeatures, setKeyFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newImage, setNewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Load industries
  useEffect(() => {
    loadIndustries();
  }, []);

  const loadIndustries = async () => {
    try {
      const { data, error } = await supabase
        .from('industries')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      setIndustries(data || []);
    } catch (error) {
      console.error('Error loading industries:', error);
    }
  };

  useEffect(() => {
    if (template) {
      setFormData({
        title: template.title || '',
        category: template.category || '',
        description: template.description || '',
        detailed_description: template.detailed_description || '',
        industry: template.industry || '',
        image_url: template.image_url || '',
        is_popular: template.is_popular || false,
        is_active: template.is_active !== false,
        pricing: {
          base: template.pricing?.base || template.pricing?.oneTime || '',
          customization: template.pricing?.customization || template.pricing?.setup || '',
          monthly: template.pricing?.subscription?.monthly || template.pricing?.monthly || '',
          deposit: template.pricing?.deposit?.amount || ''
        }
      });
      
      // Handle key_features - could be array or JSON
      const features = Array.isArray(template.key_features) 
        ? template.key_features 
        : (template.key_features ? Object.values(template.key_features) : []);
      setKeyFeatures(features.filter(f => typeof f === 'string'));
      
      setGalleryImages(template.gallery_images || []);
    }
  }, [template]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('app_templates')
        .update({
          title: formData.title,
          category: formData.category,
          description: formData.description,
          detailed_description: formData.detailed_description,
          industry: formData.industry,
          image_url: formData.image_url,
          key_features: keyFeatures,
          gallery_images: galleryImages,
          is_popular: formData.is_popular,
          is_active: formData.is_active,
          pricing: {
            base: parseInt(formData.pricing.base) || 2500,
            customization: parseInt(formData.pricing.customization) || 500,
            subscription: {
              monthly: parseInt(formData.pricing.monthly) || 199,
              benefits: ['Monthly updates', 'Priority support', 'Feature requests', 'Backup & maintenance']
            },
            deposit: {
              amount: parseInt(formData.pricing.deposit) || Math.floor((parseInt(formData.pricing.base) || 2500) * 0.3),
              serviceMonthly: Math.floor((parseInt(formData.pricing.monthly) || 199) * 0.75),
              description: 'Pay deposit + monthly service fee for ongoing management'
            },
            installments: {
              available: true,
              plans: [
                {
                  months: 6,
                  monthlyAmount: Math.floor(((parseInt(formData.pricing.base) || 2500) / 6) * 1.08),
                  totalAmount: Math.floor((parseInt(formData.pricing.base) || 2500) * 1.08)
                },
                {
                  months: 12,
                  monthlyAmount: Math.floor(((parseInt(formData.pricing.base) || 2500) / 12) * 1.15),
                  totalAmount: Math.floor((parseInt(formData.pricing.base) || 2500) * 1.15)
                }
              ]
            },
            ownership: {
              buyOutright: parseInt(formData.pricing.base) || 2500,
              serviceContract: {
                deposit: parseInt(formData.pricing.deposit) || Math.floor((parseInt(formData.pricing.base) || 2500) * 0.3),
                monthly: Math.floor((parseInt(formData.pricing.monthly) || 199) * 0.75),
                benefits: ['App hosting', 'Updates & maintenance', 'Technical support', 'Feature additions']
              }
            }
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', template.id);

      if (error) throw error;

      toast.success('Template updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Failed to update template');
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !keyFeatures.includes(newFeature.trim())) {
      setKeyFeatures([...keyFeatures, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setKeyFeatures(keyFeatures.filter(f => f !== feature));
  };

  const addGalleryImage = () => {
    if (newImage.trim() && !galleryImages.includes(newImage.trim())) {
      setGalleryImages([...galleryImages, newImage.trim()]);
      setNewImage('');
    }
  };

  const removeGalleryImage = (image: string) => {
    setGalleryImages(galleryImages.filter(img => img !== image));
  };

  const generateWithAI = async () => {
    if (!formData.title.trim() || !formData.category) {
      toast.error('Please enter title and category first');
      return;
    }

    setAiGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-template-assistant', {
        body: {
          action: 'enhance_template_content',
          data: {
            title: formData.title,
            category: formData.category,
            industry: formData.industry || 'General',
            current_description: formData.description,
            current_features: keyFeatures
          }
        }
      });

      if (error) throw error;

      if (data.description) {
        setFormData(prev => ({
          ...prev,
          description: data.description,
          detailed_description: data.detailed_description || data.description
        }));
      }

      if (data.key_features && Array.isArray(data.key_features)) {
        setKeyFeatures(data.key_features);
      }

      toast.success('AI enhancements applied successfully');
    } catch (error) {
      console.error('Error generating AI content:', error);
      toast.error('Failed to generate AI content');
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Template</DialogTitle>
          <DialogDescription>
            Update template details and content
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Restaurant Management System"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(templateCategories).map(([key, category]) => (
                    <SelectItem key={key} value={key}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select
              value={formData.industry}
              onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border z-[100]">
                {industries.map((industry) => (
                  <SelectItem key={industry.id} value={industry.name}>
                    {industry.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" onClick={generateWithAI} disabled={aiGenerating} variant="outline">
              {aiGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4 mr-2" />
              )}
              Enhance with AI
            </Button>
            <span className="text-sm text-muted-foreground">
              Improve description and features automatically
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the template"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detailed_description">Detailed Description</Label>
            <Textarea
              id="detailed_description"
              value={formData.detailed_description}
              onChange={(e) => setFormData(prev => ({ ...prev, detailed_description: e.target.value }))}
              placeholder="Detailed description with benefits and features"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Key Features</Label>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a key feature"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {keyFeatures.map((feature, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {feature}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeFeature(feature)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <AutoImageGenerator
            onThumbnailGenerated={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
            onHeroGenerated={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
            projectName={formData.title}
            projectDescription={formData.description}
          />

          <ImageUpload
            currentUrl={formData.image_url}
            onImageChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
            label="Main Template Image"
            description="Upload a JPEG, PNG, or WebP image (max 5MB)"
          />

          <div className="space-y-2">
            <Label>Gallery Images</Label>
            <ImageUpload
              onImageChange={(url) => {
                setGalleryImages([...galleryImages, url]);
                toast.success('Gallery image added');
              }}
              label="Add Gallery Image"
              description="Upload additional images for the template gallery"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {galleryImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img src={image} alt={`Gallery ${index + 1}`} className="h-20 w-20 object-cover rounded border" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeGalleryImage(image)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="base">Base Price ($)</Label>
              <Input
                id="base"
                type="number"
                value={formData.pricing.base}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  pricing: { ...prev.pricing, base: e.target.value }
                }))}
                placeholder="2500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customization">Customization ($)</Label>
              <Input
                id="customization"
                type="number"
                value={formData.pricing.customization}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  pricing: { ...prev.pricing, customization: e.target.value }
                }))}
                placeholder="500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly">Monthly Subscription ($)</Label>
              <Input
                id="monthly"
                type="number"
                value={formData.pricing.monthly}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  pricing: { ...prev.pricing, monthly: e.target.value }
                }))}
                placeholder="199"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deposit">Deposit Amount ($)</Label>
              <Input
                id="deposit"
                type="number"
                value={formData.pricing.deposit}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  pricing: { ...prev.pricing, deposit: e.target.value }
                }))}
                placeholder="750"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_popular"
                checked={formData.is_popular}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_popular: checked }))}
              />
              <Label htmlFor="is_popular">Mark as Popular</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Template'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}