import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus, Wand2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { templateCategories } from '@/utils/appTemplates';
import { IndustryTemplateSelector } from './IndustryTemplateSelector';
import { PricingDisplay } from '@/components/ui/pricing-display';
import { AutoImageGenerator } from './AutoImageGenerator';

interface EnhancedTemplateCreationModalProps {
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
  'Real Estate'
];

export function EnhancedTemplateCreationModal({ isOpen, onClose, onSuccess }: EnhancedTemplateCreationModalProps) {
  const [useIndustryTemplate, setUseIndustryTemplate] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'web-app',
    description: '',
    detailed_description: '',
    industry: '',
    image_url: '',
    sale_price: '',
    customization_price: '',
    is_popular: false,
    is_active: true
  });
  
  const [foundationFeatures, setFoundationFeatures] = useState<string[]>([]);
  const [coreIndustryFeatures, setCoreIndustryFeatures] = useState<string[]>([]);
  const [premiumFeatures, setPremiumFeatures] = useState<{name: string, price: number}[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [isSubscriptionPreview, setIsSubscriptionPreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.category || !formData.industry) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const templateData = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        detailed_description: formData.detailed_description,
        industry: formData.industry,
        image_url: formData.image_url,
        foundation_features: foundationFeatures,
        core_industry_features: coreIndustryFeatures,
        premium_features: premiumFeatures,
        gallery_images: galleryImages,
        sale_price: parseFloat(formData.sale_price) || 0,
        customization_price: parseFloat(formData.customization_price) || 0,
        is_popular: formData.is_popular,
        is_active: formData.is_active
      };

      const { error } = await supabase
        .from('app_templates')
        .insert(templateData);

      if (error) throw error;

      toast.success('Template created successfully!');
      resetForm();
      onSuccess();
      onClose();
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
      category: 'web-app',
      description: '',
      detailed_description: '',
      industry: '',
      image_url: '',
      sale_price: '',
      customization_price: '',
      is_popular: false,
      is_active: true
    });
    setFoundationFeatures([]);
    setCoreIndustryFeatures([]);
    setPremiumFeatures([]);
    setGalleryImages([]);
    setUseIndustryTemplate(false);
  };

  const handleIndustryTemplateGenerated = (templateData: any) => {
    setFormData(prev => ({
      ...prev,
      industry: templateData.industry,
      sale_price: templateData.salePrice.toString(),
      customization_price: templateData.customizationPrice.toString()
    }));
    setFoundationFeatures(templateData.foundationFeatures);
    setCoreIndustryFeatures(templateData.coreIndustryFeatures);
    setPremiumFeatures(templateData.premiumFeatures);
    setUseIndustryTemplate(false);
    toast.success('Industry template configuration applied!');
  };

  const addFoundationFeature = () => {
    setFoundationFeatures([...foundationFeatures, '']);
  };

  const removeFoundationFeature = (index: number) => {
    setFoundationFeatures(foundationFeatures.filter((_, i) => i !== index));
  };

  const updateFoundationFeature = (index: number, value: string) => {
    const updated = [...foundationFeatures];
    updated[index] = value;
    setFoundationFeatures(updated);
  };

  const addCoreFeature = () => {
    setCoreIndustryFeatures([...coreIndustryFeatures, '']);
  };

  const removeCoreFeature = (index: number) => {
    setCoreIndustryFeatures(coreIndustryFeatures.filter((_, i) => i !== index));
  };

  const updateCoreFeature = (index: number, value: string) => {
    const updated = [...coreIndustryFeatures];
    updated[index] = value;
    setCoreIndustryFeatures(updated);
  };

  const addPremiumFeature = () => {
    setPremiumFeatures([...premiumFeatures, { name: '', price: 0 }]);
  };

  const removePremiumFeature = (index: number) => {
    setPremiumFeatures(premiumFeatures.filter((_, i) => i !== index));
  };

  const updatePremiumFeature = (index: number, field: 'name' | 'price', value: string | number) => {
    const updated = [...premiumFeatures];
    updated[index] = { ...updated[index], [field]: value };
    setPremiumFeatures(updated);
  };

  const addGalleryImage = () => {
    setGalleryImages([...galleryImages, '']);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const updateGalleryImage = (index: number, value: string) => {
    const updated = [...galleryImages];
    updated[index] = value;
    setGalleryImages(updated);
  };

  const generateWithAI = async () => {
    if (!formData.industry || !formData.title) {
      toast.error('Please enter title and select industry first');
      return;
    }

    setAiGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-template-assistant', {
        body: {
          action: 'createTemplate',
          data: {
            industry: formData.industry,
            title: formData.title,
            description: formData.description
          }
        }
      });

      if (error) throw error;

      const template = data.template;
      setFormData(prev => ({
        ...prev,
        description: template.description,
        detailed_description: template.detailed_description
      }));
      setFoundationFeatures(template.foundation_features || []);
      setCoreIndustryFeatures(template.core_features || []);
      setPremiumFeatures(template.premium_features || []);

      toast.success('AI generated template content!');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate AI content');
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
          <DialogDescription>
            Create a new app template with industry-specific features and pricing
          </DialogDescription>
        </DialogHeader>

        {useIndustryTemplate ? (
          <IndustryTemplateSelector
            onTemplateGenerated={handleIndustryTemplateGenerated}
          />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template Creation Mode Toggle */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Template Creation Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Use Industry Template Builder</p>
                    <p className="text-sm text-muted-foreground">
                      Create from pre-configured industry templates with standard features
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setUseIndustryTemplate(true)}
                  >
                    Use Industry Builder
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Template Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Professional Salon Management App"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(templateCategories).map(([key, cat]) => (
                      <SelectItem key={key} value={key}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map((industry) => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* AI Image Generator */}
            <AutoImageGenerator
              onThumbnailGenerated={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
              onHeroGenerated={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
              projectName={formData.title}
              projectDescription={formData.description}
            />

            <div>
              <Label htmlFor="image_url">Main Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
              {formData.image_url && (
                <div className="mt-2">
                  <img src={formData.image_url} alt="Preview" className="w-full h-40 object-cover rounded-md" />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the template"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="detailed_description">Detailed Description</Label>
              <div className="flex gap-2 mb-2">
                <Textarea
                  id="detailed_description"
                  value={formData.detailed_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, detailed_description: e.target.value }))}
                  placeholder="Detailed description with benefits and features"
                  rows={4}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateWithAI}
                  disabled={aiGenerating}
                  className="self-end"
                >
                  {aiGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                  AI Generate
                </Button>
              </div>
            </div>

            {/* Pricing Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pricing Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sale_price">Sale Price *</Label>
                    <Input
                      id="sale_price"
                      type="number"
                      value={formData.sale_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, sale_price: e.target.value }))}
                      placeholder="3500"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Base ownership price</p>
                  </div>
                  <div>
                    <Label htmlFor="customization_price">Customization Price</Label>
                    <Input
                      id="customization_price"
                      type="number"
                      value={formData.customization_price}
                      onChange={(e) => setFormData(prev => ({ ...prev, customization_price: e.target.value }))}
                      placeholder="500"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Additional customization cost</p>
                  </div>
                </div>
                
                {/* Pricing Preview */}
                {formData.sale_price && (
                  <PricingDisplay
                    salePrice={parseFloat(formData.sale_price) || 0}
                    customizationPrice={parseFloat(formData.customization_price) || 0}
                    isSubscription={isSubscriptionPreview}
                    onToggle={setIsSubscriptionPreview}
                    showToggle={true}
                  />
                )}
              </CardContent>
            </Card>

            {/* Features Management */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Foundation Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Foundation Features</CardTitle>
                  <p className="text-sm text-muted-foreground">Basic features included in all templates</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {foundationFeatures.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={feature}
                          onChange={(e) => updateFoundationFeature(index, e.target.value)}
                          placeholder={`Foundation feature ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFoundationFeature(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addFoundationFeature}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Foundation Feature
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Core Industry Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Core Industry Features</CardTitle>
                  <p className="text-sm text-muted-foreground">Industry-specific features included</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {coreIndustryFeatures.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={feature}
                          onChange={(e) => updateCoreFeature(index, e.target.value)}
                          placeholder={`Core feature ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeCoreFeature(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCoreFeature}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Core Feature
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Premium Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Premium Add-on Features</CardTitle>
                <p className="text-sm text-muted-foreground">Optional features customers can purchase</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature.name}
                        onChange={(e) => updatePremiumFeature(index, 'name', e.target.value)}
                        placeholder="Premium feature name"
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={feature.price}
                        onChange={(e) => updatePremiumFeature(index, 'price', Number(e.target.value))}
                        placeholder="Price"
                        className="w-24"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePremiumFeature(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPremiumFeature}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Premium Feature
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Gallery Images */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Gallery Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {galleryImages.map((image, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={image}
                        onChange={(e) => updateGalleryImage(index, e.target.value)}
                        placeholder="Image URL"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addGalleryImage}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Gallery Image
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Template Settings */}
            <div className="flex items-center justify-between p-4 bg-soft-lilac/10 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_popular}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_popular: checked }))}
                  />
                  <Label>Mark as Popular</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label>Active Template</Label>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Template
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}