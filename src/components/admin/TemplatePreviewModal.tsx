import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { X, CheckCircle2, Settings, Palette, Users, Calendar } from 'lucide-react';

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
  template_config: any;
}

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: AppTemplate;
}

export function TemplatePreviewModal({ isOpen, onClose, template }: TemplatePreviewModalProps) {
  const keyFeatures = Array.isArray(template.key_features) 
    ? template.key_features 
    : (template.key_features ? Object.values(template.key_features) : []);

  const whitelabelFields = template.template_config?.whitelabel_fields || [];
  const industryFeatures = template.template_config?.industry_features || {};

  const getWhitelabelFieldLabel = (field: string) => {
    const labels: any = {
      logo: 'Logo Upload',
      primaryColor: 'Primary Color',
      secondaryColor: 'Secondary Color',
      businessName: 'Business Name',
      businessInfo: 'Business Info',
      contactDetails: 'Contact Details',
      services: 'Services/Products',
      gallery: 'Gallery Images'
    };
    return labels[field] || field;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Template Preview: {template.title}
            <div className="flex gap-1">
              {template.is_popular && (
                <Badge variant="secondary" className="text-xs">Popular</Badge>
              )}
              <Badge variant={template.is_active ? "default" : "secondary"} className="text-xs">
                {template.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription>
            Preview how this template will appear to clients and what they can customize
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Template Details</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Badge variant="outline">{template.category}</Badge>
                    {template.industry && (
                      <Badge variant="secondary">{template.industry}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  {template.detailed_description && (
                    <p className="text-sm">{template.detailed_description}</p>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pricing Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {template.pricing?.oneTime && (
                    <div className="flex justify-between">
                      <span>One-time Purchase:</span>
                      <span className="font-semibold">${template.pricing.oneTime}</span>
                    </div>
                  )}
                  {template.pricing?.monthly && (
                    <div className="flex justify-between">
                      <span>Monthly Subscription:</span>
                      <span className="font-semibold">${template.pricing.monthly}/month</span>
                    </div>
                  )}
                  {template.pricing?.setup && (
                    <div className="flex justify-between">
                      <span>Setup Fee:</span>
                      <span className="font-semibold">${template.pricing.setup}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Template Image */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Template Preview</h3>
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  {template.image_url ? (
                    <img 
                      src={template.image_url} 
                      alt={template.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Settings className="h-12 w-12 mx-auto mb-2" />
                        <p>No preview image available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Key Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Key Features
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {keyFeatures.map((feature: string, index: number) => (
                <Badge key={index} variant="outline" className="justify-start">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Client Customization Options */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Client Customization Options
            </h3>
            {whitelabelFields.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {whitelabelFields.map((field: string) => (
                  <div key={field} className="flex items-center gap-2 p-2 border rounded">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{getWhitelabelFieldLabel(field)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No customization options configured. Clients will receive the template as-is.
              </p>
            )}
          </div>

          <Separator />

          {/* Industry-Specific Features */}
          {Object.keys(industryFeatures).length > 0 && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Industry-Specific Features ({template.industry})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(industryFeatures).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 p-2 border rounded">
                      {value ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Client Experience Simulation */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              What Clients Will See
            </h3>
            <Card className="bg-muted/50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <h4 className="text-xl font-bold">{template.title}</h4>
                    <p className="text-muted-foreground">{template.description}</p>
                  </div>
                  
                  <div className="border-2 border-dashed border-primary/20 rounded-lg p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Client Customization Interface
                    </p>
                    <div className="space-y-2">
                      {whitelabelFields.includes('businessName') && (
                        <div className="text-sm">✏️ Enter your business name</div>
                      )}
                      {whitelabelFields.includes('logo') && (
                        <div className="text-sm">🖼️ Upload your logo</div>
                      )}
                      {whitelabelFields.includes('primaryColor') && (
                        <div className="text-sm">🎨 Choose your brand colors</div>
                      )}
                      {whitelabelFields.includes('services') && (
                        <div className="text-sm">📝 Add your services/products</div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>Close Preview</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}