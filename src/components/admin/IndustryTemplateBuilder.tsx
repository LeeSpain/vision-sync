import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Plus, Wand2, Palette, Settings, Users } from 'lucide-react';

interface IndustryTemplate {
  industry: string;
  description: string;
  commonFeatures: string[];
  whitelabelOptions: string[];
  industrySpecific: Record<string, boolean>;
  suggested_pricing: {
    oneTime: string;
    monthly: string;
    setup: string;
  };
}

const industryTemplates: Record<string, IndustryTemplate> = {
  'Hairdressing & Beauty': {
    industry: 'Hairdressing & Beauty',
    description: 'Complete salon management app with booking, services, and client management',
    commonFeatures: [
      'Online Booking System',
      'Service Menu Management',
      'Staff Profiles & Schedules',
      'Client Management',
      'Photo Gallery',
      'Loyalty Program',
      'Payment Processing',
      'SMS Notifications'
    ],
    whitelabelOptions: [
      'logo', 'primaryColor', 'secondaryColor', 'businessName', 
      'businessInfo', 'contactDetails', 'services', 'gallery'
    ],
    industrySpecific: {
      booking_system: true,
      service_menu: true,
      staff_profiles: true,
      client_history: true,
      loyalty_program: true,
      photo_gallery: true,
      appointment_reminders: true,
      product_sales: true
    },
    suggested_pricing: {
      oneTime: '3500',
      monthly: '149',
      setup: '500'
    }
  },
  'Restaurant & Food Service': {
    industry: 'Restaurant & Food Service',
    description: 'Full-featured restaurant app with ordering, delivery, and table management',
    commonFeatures: [
      'Digital Menu',
      'Online Ordering',
      'Table Reservations',
      'Delivery Tracking',
      'Payment Integration',
      'Customer Reviews',
      'Loyalty Program',
      'Kitchen Display'
    ],
    whitelabelOptions: [
      'logo', 'primaryColor', 'secondaryColor', 'businessName',
      'businessInfo', 'contactDetails', 'services', 'gallery'
    ],
    industrySpecific: {
      menu_management: true,
      online_ordering: true,
      table_booking: true,
      delivery_tracking: true,
      payment_integration: true,
      kitchen_display: true,
      inventory_alerts: true,
      customer_reviews: true
    },
    suggested_pricing: {
      oneTime: '4500',
      monthly: '199',
      setup: '750'
    }
  },
  'Fitness & Wellness': {
    industry: 'Fitness & Wellness',
    description: 'Complete fitness center management with classes, memberships, and progress tracking',
    commonFeatures: [
      'Class Scheduling',
      'Membership Management',
      'Trainer Profiles',
      'Workout Plans',
      'Progress Tracking',
      'Payment Processing',
      'Member Portal',
      'Equipment Booking'
    ],
    whitelabelOptions: [
      'logo', 'primaryColor', 'secondaryColor', 'businessName',
      'businessInfo', 'contactDetails', 'services'
    ],
    industrySpecific: {
      class_booking: true,
      membership_management: true,
      workout_plans: true,
      progress_tracking: true,
      trainer_profiles: true,
      equipment_booking: true,
      nutrition_tracking: true,
      member_community: true
    },
    suggested_pricing: {
      oneTime: '4000',
      monthly: '179',
      setup: '600'
    }
  }
};

interface IndustryTemplateBuilderProps {
  selectedIndustry: string;
  onTemplateGenerated: (templateData: any) => void;
}

export function IndustryTemplateBuilder({ selectedIndustry, onTemplateGenerated }: IndustryTemplateBuilderProps) {
  const [customizations, setCustomizations] = useState<any>({});
  const [additionalFeatures, setAdditionalFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');

  const template = industryTemplates[selectedIndustry];

  if (!template) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Custom Industry Setup</h3>
          <p className="text-muted-foreground">
            This industry doesn't have a pre-built template. You can create a custom template using the standard template creator.
          </p>
        </CardContent>
      </Card>
    );
  }

  const addFeature = () => {
    if (newFeature.trim() && !additionalFeatures.includes(newFeature.trim())) {
      setAdditionalFeatures([...additionalFeatures, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const generateTemplate = () => {
    const templateData = {
      title: `${selectedIndustry} App`,
      category: 'business',
      industry: selectedIndustry,
      description: template.description,
      detailed_description: `Professional ${selectedIndustry.toLowerCase()} management application with industry-specific features and complete customization options.`,
      key_features: [...template.commonFeatures, ...additionalFeatures],
      pricing: template.suggested_pricing,
      template_config: {
        whitelabel_fields: template.whitelabelOptions,
        industry_features: { ...template.industrySpecific, ...customizations },
        customization_level: 'full'
      },
      is_popular: false,
      is_active: true
    };

    onTemplateGenerated(templateData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {template.industry} Template Builder
          </CardTitle>
          <CardDescription>
            Pre-configured template with industry-specific features and customization options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Overview */}
          <div>
            <h4 className="font-semibold mb-2">Template Description</h4>
            <p className="text-sm text-muted-foreground">{template.description}</p>
          </div>

          <Separator />

          {/* Common Features */}
          <div>
            <h4 className="font-semibold mb-3">Included Features</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {template.commonFeatures.map((feature, index) => (
                <Badge key={index} variant="secondary" className="justify-start">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Industry-Specific Features */}
          <div>
            <h4 className="font-semibold mb-3">Industry-Specific Features</h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(template.industrySpecific).map(([key, defaultValue]) => (
                <label key={key} className="flex items-center space-x-2 cursor-pointer">
                  <Switch
                    checked={customizations[key] !== undefined ? customizations[key] : defaultValue}
                    onCheckedChange={(checked) => {
                      setCustomizations((prev: any) => ({
                        ...prev,
                        [key]: checked
                      }));
                    }}
                  />
                  <span className="text-sm">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <Separator />

          {/* Client Customization Options */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Client Customization Options
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {template.whitelabelOptions.map((option) => (
                <Badge key={option} variant="outline" className="justify-start">
                  {option.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Additional Features */}
          <div>
            <h4 className="font-semibold mb-3">Additional Features</h4>
            <div className="flex gap-2 mb-3">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add custom feature"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {additionalFeatures.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {additionalFeatures.map((feature, index) => (
                  <Badge key={index} variant="outline">
                    {feature}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Suggested Pricing */}
          <div>
            <h4 className="font-semibold mb-3">Suggested Pricing</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">One-time</Label>
                <div className="text-lg font-semibold">${template.suggested_pricing.oneTime}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Monthly</Label>
                <div className="text-lg font-semibold">${template.suggested_pricing.monthly}</div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Setup Fee</Label>
                <div className="text-lg font-semibold">${template.suggested_pricing.setup}</div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <Button onClick={generateTemplate} className="w-full" size="lg">
            <Wand2 className="h-4 w-4 mr-2" />
            Generate {selectedIndustry} Template
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}