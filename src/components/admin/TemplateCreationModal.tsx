import React, { useState } from 'react';
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

interface TemplateCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const industryOptions = [
  'Hairdressing & Beauty',
  'Restaurant & Food Service',
  'Fitness & Wellness', 
  'Home Services',
  'Retail & E-commerce',
  'Healthcare',
  'Real Estate',
  'Education & Training',
  'Legal Services',
  'Automotive',
  'Event Planning',
  'Photography',
  'Construction',
  'Consulting',
  'Other'
];

const whitelabelFields = [
  { key: 'logo', label: 'Logo Upload', type: 'image' },
  { key: 'primaryColor', label: 'Primary Color', type: 'color' },
  { key: 'secondaryColor', label: 'Secondary Color', type: 'color' },
  { key: 'businessName', label: 'Business Name', type: 'text' },
  { key: 'businessInfo', label: 'Business Info', type: 'textarea' },
  { key: 'contactDetails', label: 'Contact Details', type: 'textarea' },
  { key: 'services', label: 'Services/Products', type: 'array' },
  { key: 'gallery', label: 'Gallery Images', type: 'images' }
];

export function TemplateCreationModal({ isOpen, onClose, onSuccess }: TemplateCreationModalProps) {
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
      oneTime: '',
      monthly: '',
      setup: ''
    }
  });
  const [keyFeatures, setKeyFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newImage, setNewImage] = useState('');
  const [whitelabelConfig, setWhitelabelConfig] = useState<string[]>([]);
  const [industrySpecificFeatures, setIndustrySpecificFeatures] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

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
        .insert({
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
          pricing: formData.pricing,
          questionnaire_weight: {},
          ai_generated_content: {},
          template_config: {
            whitelabel_fields: whitelabelConfig,
            industry_features: industrySpecificFeatures,
            customization_level: 'full'
          }
        });

      if (error) throw error;

      toast.success('Template created successfully');
      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      detailed_description: '',
      industry: '',
      image_url: '',
      is_popular: false,
      is_active: true,
      pricing: { oneTime: '', monthly: '', setup: '' }
    });
    setKeyFeatures([]);
    setGalleryImages([]);
    setWhitelabelConfig([]);
    setIndustrySpecificFeatures({});
    setNewFeature('');
    setNewImage('');
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
          action: 'generate_template_content',
          data: {
            title: formData.title,
            category: formData.category,
            industry: formData.industry || 'General'
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

      toast.success('AI content generated successfully');
    } catch (error) {
      console.error('Error generating AI content:', error);
      toast.error('Failed to generate AI content');
    } finally {
      setAiGenerating(false);
    }
  };

  const getIndustryDefaults = (industry: string) => {
    const defaults: any = {
      'Hairdressing & Beauty': {
        booking_system: true,
        service_menu: true,
        gallery: true,
        staff_profiles: true,
        loyalty_program: true
      },
      'Restaurant & Food Service': {
        menu_management: true,
        online_ordering: true,
        table_booking: true,
        delivery_tracking: true,
        payment_integration: true
      },
      'Fitness & Wellness': {
        class_booking: true,
        membership_management: true,
        workout_plans: true,
        progress_tracking: true,
        trainer_profiles: true
      },
      'Home Services': {
        service_areas: true,
        quote_calculator: true,
        before_after_gallery: true,
        scheduling: true,
        customer_reviews: true
      },
      'Retail & E-commerce': {
        product_catalog: true,
        inventory_management: true,
        shopping_cart: true,
        customer_accounts: true,
        payment_processing: true
      }
    };
    return defaults[industry] || {};
  };

  const renderIndustryFeatures = (industry: string, features: any, setFeatures: any) => {
    const industryFeatures = getIndustryDefaults(industry);
    
    return (
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(industryFeatures).map(([key, defaultValue]) => (
          <label key={key} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={features[key] !== undefined ? features[key] : defaultValue}
              onChange={(e) => {
                setFeatures((prev: any) => ({
                  ...prev,
                  [key]: e.target.checked
                }));
              }}
              className="rounded"
            />
            <span className="text-sm">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
          </label>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
          <DialogDescription>
            Create a new app template that can be recommended to users
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
            <Label htmlFor="industry">Industry *</Label>
            <Select
              value={formData.industry}
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, industry: value }));
                // Auto-populate industry-specific features
                setIndustrySpecificFeatures(getIndustryDefaults(value));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industryOptions.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
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
              Generate with AI
            </Button>
            <span className="text-sm text-muted-foreground">
              Generate description and features automatically
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

          <div className="space-y-2">
            <Label htmlFor="image_url">Main Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label>Gallery Images</Label>
            <div className="flex gap-2">
              <Input
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="Add gallery image URL"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryImage())}
              />
              <Button type="button" onClick={addGalleryImage}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {galleryImages.map((image, index) => (
                <Badge key={index} variant="outline" className="gap-1">
                  Image {index + 1}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeGalleryImage(image)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Whitelabel Configuration */}
          <div className="space-y-4 border rounded-lg p-4">
            <h3 className="text-lg font-semibold">Client Customization Options</h3>
            <p className="text-sm text-muted-foreground">
              Select which elements clients can customize in their app
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {whitelabelFields.map((field) => (
                <label key={field.key} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whitelabelConfig.includes(field.key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setWhitelabelConfig([...whitelabelConfig, field.key]);
                      } else {
                        setWhitelabelConfig(whitelabelConfig.filter(f => f !== field.key));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{field.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Industry-Specific Features */}
          {formData.industry && (
            <div className="space-y-4 border rounded-lg p-4">
              <h3 className="text-lg font-semibold">Industry-Specific Features</h3>
              <p className="text-sm text-muted-foreground">
                Configure features specific to {formData.industry}
              </p>
              {renderIndustryFeatures(formData.industry, industrySpecificFeatures, setIndustrySpecificFeatures)}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="oneTime">One-time Price ($)</Label>
              <Input
                id="oneTime"
                type="number"
                value={formData.pricing.oneTime}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  pricing: { ...prev.pricing, oneTime: e.target.value }
                }))}
                placeholder="2500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly">Monthly Price ($)</Label>
              <Input
                id="monthly"
                type="number"
                value={formData.pricing.monthly}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  pricing: { ...prev.pricing, monthly: e.target.value }
                }))}
                placeholder="99"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="setup">Setup Fee ($)</Label>
              <Input
                id="setup"
                type="number"
                value={formData.pricing.setup}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  pricing: { ...prev.pricing, setup: e.target.value }
                }))}
                placeholder="500"
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
              {loading ? 'Creating...' : 'Create Template'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}