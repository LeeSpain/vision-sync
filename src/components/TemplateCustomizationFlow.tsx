import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  ArrowLeft, ArrowRight, Sparkles, Target, DollarSign, Clock, Users, Zap, 
  Palette, CheckCircle, Star, Play, Settings, Eye, Code2, Smartphone
} from "lucide-react";
import { AppTemplate } from '@/utils/appTemplates';
import { useCurrency } from "@/contexts/CurrencyContext";
import { supabase } from "@/integrations/supabase/client";

interface CustomizationOptions {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  branding: {
    businessName: string;
    logo: string;
    tagline: string;
  };
  features: string[];
  layout: string;
  integrations: string[];
}

interface QuestionnaireData {
  businessType: string;
  industry: string;
  requirements: string[];
  businessSize: string;
  techComfort: string;
  budgetRange: string;
  timeline: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

interface TemplateCustomizationFlowProps {
  template: AppTemplate | null;
  isOpen: boolean;
  onClose: () => void;
}

const TemplateCustomizationFlow = ({ template, isOpen, onClose }: TemplateCustomizationFlowProps) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  
  // Flow state
  const [currentStep, setCurrentStep] = useState<'questionnaire' | 'customize' | 'preview' | 'success'>('questionnaire');
  const [questionnaireStep, setQuestionnaireStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Data state
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData>({
    businessType: '',
    industry: '',
    requirements: [],
    businessSize: '',
    techComfort: '',
    budgetRange: '',
    timeline: '',
    contactInfo: {
      name: '',
      email: '',
      phone: ''
    }
  });
  
  const [customizationOptions, setCustomizationOptions] = useState<CustomizationOptions>({
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#06b6d4'
    },
    branding: {
      businessName: '',
      logo: '',
      tagline: ''
    },
    features: [],
    layout: 'modern',
    integrations: []
  });

  const [recommendations, setRecommendations] = useState<any>(null);
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  const totalQuestionnaireSteps = 8;
  const questionnaireProgress = (questionnaireStep / totalQuestionnaireSteps) * 100;

  if (!template) return null;

  const IconComponent = template.icon;

  // Questionnaire handlers
  const handleQuestionnaireNext = () => {
    if (questionnaireStep < totalQuestionnaireSteps) {
      setQuestionnaireStep(questionnaireStep + 1);
    } else {
      handleQuestionnaireSubmit();
    }
  };

  const handleQuestionnaireBack = () => {
    if (questionnaireStep > 1) {
      setQuestionnaireStep(questionnaireStep - 1);
    }
  };

  const handleRequirementChange = (requirement: string, checked: boolean) => {
    if (checked) {
      setQuestionnaireData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirement]
      }));
    } else {
      setQuestionnaireData(prev => ({
        ...prev,
        requirements: prev.requirements.filter(req => req !== requirement)
      }));
    }
  };

  const handleQuestionnaireSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Prepare the customization data
      const customizationRequest = {
        template: {
          id: template.id,
          title: template.title,
          category: template.category
        },
        questionnaire: questionnaireData,
        submittedAt: new Date().toISOString()
      };

      // Send to edge function for processing and email
      const { error } = await supabase.functions.invoke('send-customization-email', {
        body: {
          clientInfo: questionnaireData.contactInfo,
          templateTitle: template.title,
          customizationData: customizationRequest
        }
      });

      if (error) {
        console.error('Error sending customization email:', error);
        // Still show success message even if email fails
      }

      // Show success step
      setCurrentStep('success');
      
      // Redirect to homepage after 5 seconds
      setTimeout(() => {
        navigate('/');
        onClose();
      }, 5000);
      
    } catch (error) {
      console.error('Error generating customization:', error);
      toast.error('Something went wrong. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isQuestionnaireStepValid = () => {
    switch (questionnaireStep) {
      case 1: return questionnaireData.businessType !== '';
      case 2: return questionnaireData.industry !== '';
      case 3: return questionnaireData.requirements.length > 0;
      case 4: return questionnaireData.businessSize !== '';
      case 5: return questionnaireData.techComfort !== '';
      case 6: return questionnaireData.budgetRange !== '';
      case 7: return questionnaireData.timeline !== '';
      case 8: return questionnaireData.contactInfo.name !== '' && 
                    questionnaireData.contactInfo.email !== '' && 
                    questionnaireData.contactInfo.phone !== '';
      default: return false;
    }
  };

  const handleCustomizationUpdate = (key: keyof CustomizationOptions, value: any) => {
    setCustomizationOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFeatureToggle = (feature: string, checked: boolean) => {
    if (checked) {
      setCustomizationOptions(prev => ({
        ...prev,
        features: [...prev.features, feature]
      }));
    } else {
      setCustomizationOptions(prev => ({
        ...prev,
        features: prev.features.filter(f => f !== feature)
      }));
    }
  };

  const handleIntegrationToggle = (integration: string, checked: boolean) => {
    if (checked) {
      setCustomizationOptions(prev => ({
        ...prev,
        integrations: [...prev.integrations, integration]
      }));
    } else {
      setCustomizationOptions(prev => ({
        ...prev,
        integrations: prev.integrations.filter(i => i !== integration)
      }));
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Prepare the customization data for email
      const customizationRequest = {
        template: template,
        questionnaire: questionnaireData,
        customization: customizationOptions,
        estimatedPrice: estimatedPrice
      };

      // Send email with customization details
      const { error } = await supabase.functions.invoke('send-customization-email', {
        body: {
          clientInfo: questionnaireData.contactInfo,
          customizationData: customizationRequest
        }
      });

      if (error) {
        throw error;
      }

      toast.success(
        `Thank you ${questionnaireData.contactInfo.name}! We've sent your customization proposal to ${questionnaireData.contactInfo.email}. We'll contact you within 24 hours to discuss next steps.`
      );
      
      onClose();
    } catch (error) {
      console.error('Error submitting customization:', error);
      toast.error('Something went wrong. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestionnaireStep = () => {
    switch (questionnaireStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Target className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-2xl font-bold">What type of business do you run?</h3>
              <p className="text-muted-foreground">This helps us customize {template.title} for your needs</p>
            </div>
            <RadioGroup
              value={questionnaireData.businessType}
              onValueChange={(value) => setQuestionnaireData(prev => ({ ...prev, businessType: value }))}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="service" id="service" />
                <Label htmlFor="service" className="flex-1 cursor-pointer">
                  <div className="font-medium">Service-Based Business</div>
                  <div className="text-sm text-muted-foreground">Appointments, consultations, or on-site services</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="product" id="product" />
                <Label htmlFor="product" className="flex-1 cursor-pointer">
                  <div className="font-medium">Product-Based Business</div>
                  <div className="text-sm text-muted-foreground">Selling physical or digital products</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="location" id="location" />
                <Label htmlFor="location" className="flex-1 cursor-pointer">
                  <div className="font-medium">Location-Based Business</div>
                  <div className="text-sm text-muted-foreground">Restaurant, gym, retail store, or physical location</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="platform" id="platform" />
                <Label htmlFor="platform" className="flex-1 cursor-pointer">
                  <div className="font-medium">Platform/Marketplace</div>
                  <div className="text-sm text-muted-foreground">Connecting buyers and sellers or service providers</div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Sparkles className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-2xl font-bold">What industry are you in?</h3>
              <p className="text-muted-foreground">We'll customize features for your specific industry</p>
            </div>
            <RadioGroup
              value={questionnaireData.industry}
              onValueChange={(value) => setQuestionnaireData(prev => ({ ...prev, industry: value }))}
              className="grid grid-cols-2 gap-4"
            >
              {[
                'Beauty & Wellness', 'Home Services', 'Food & Beverage', 'Healthcare',
                'Fitness & Sports', 'Education', 'Real Estate', 'Professional Services',
                'Retail & E-commerce', 'Events & Entertainment', 'Technology', 'Other'
              ].map((industry) => (
                <div key={industry} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                  <RadioGroupItem value={industry.toLowerCase().replace(' & ', '-').replace(' ', '-')} id={industry} />
                  <Label htmlFor={industry} className="cursor-pointer">{industry}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Zap className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-2xl font-bold">What features do you need?</h3>
              <p className="text-muted-foreground">Select all that apply to customize {template.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                'Online Booking/Scheduling', 'Payment Processing', 'Customer Management',
                'Inventory Management', 'Mobile App', 'User Accounts/Profiles',
                'Messaging/Chat', 'Reviews & Ratings', 'Location Services',
                'Analytics & Reporting', 'Email Marketing', 'Social Media Integration'
              ].map((requirement) => (
                <div key={requirement} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent">
                  <Checkbox
                    id={requirement}
                    checked={questionnaireData.requirements.includes(requirement)}
                    onCheckedChange={(checked) => handleRequirementChange(requirement, checked as boolean)}
                  />
                  <Label htmlFor={requirement} className="cursor-pointer">{requirement}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Users className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-2xl font-bold">How big is your business?</h3>
              <p className="text-muted-foreground">This helps us recommend the right scale of solution</p>
            </div>
            <RadioGroup
              value={questionnaireData.businessSize}
              onValueChange={(value) => setQuestionnaireData(prev => ({ ...prev, businessSize: value }))}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="solo" id="solo" />
                <Label htmlFor="solo" className="flex-1 cursor-pointer">
                  <div className="font-medium">Solo Entrepreneur</div>
                  <div className="text-sm text-muted-foreground">Just me running the business</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="small" id="small" />
                <Label htmlFor="small" className="flex-1 cursor-pointer">
                  <div className="font-medium">Small Team (2-10 people)</div>
                  <div className="text-sm text-muted-foreground">Small business with a few employees</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="flex-1 cursor-pointer">
                  <div className="font-medium">Growing Business (10-50 people)</div>
                  <div className="text-sm text-muted-foreground">Established business looking to scale</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="large" id="large" />
                <Label htmlFor="large" className="flex-1 cursor-pointer">
                  <div className="font-medium">Large Organization (50+ people)</div>
                  <div className="text-sm text-muted-foreground">Enterprise-level requirements</div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Zap className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-2xl font-bold">How comfortable are you with technology?</h3>
              <p className="text-muted-foreground">We'll match you with the right level of complexity</p>
            </div>
            <RadioGroup
              value={questionnaireData.techComfort}
              onValueChange={(value) => setQuestionnaireData(prev => ({ ...prev, techComfort: value }))}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="basic" id="basic" />
                <Label htmlFor="basic" className="flex-1 cursor-pointer">
                  <div className="font-medium">Basic</div>
                  <div className="text-sm text-muted-foreground">I prefer simple, easy-to-use solutions</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate" className="flex-1 cursor-pointer">
                  <div className="font-medium">Intermediate</div>
                  <div className="text-sm text-muted-foreground">I'm comfortable with most apps and tools</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced" className="flex-1 cursor-pointer">
                  <div className="font-medium">Advanced</div>
                  <div className="text-sm text-muted-foreground">I want powerful features and customization options</div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <DollarSign className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-2xl font-bold">What's your budget range?</h3>
              <p className="text-muted-foreground">Base template starts at {formatPrice(template.pricing.base)}</p>
            </div>
            <RadioGroup
              value={questionnaireData.budgetRange}
              onValueChange={(value) => setQuestionnaireData(prev => ({ ...prev, budgetRange: value }))}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="2000-5000" id="budget1" />
                <Label htmlFor="budget1" className="flex-1 cursor-pointer">
                  <div className="font-medium">{formatPrice(2000)} - {formatPrice(5000)}</div>
                  <div className="text-sm text-muted-foreground">Basic template with minimal customization</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="5000-10000" id="budget2" />
                <Label htmlFor="budget2" className="flex-1 cursor-pointer">
                  <div className="font-medium">{formatPrice(5000)} - {formatPrice(10000)}</div>
                  <div className="text-sm text-muted-foreground">Template with moderate customization</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="10000-20000" id="budget3" />
                <Label htmlFor="budget3" className="flex-1 cursor-pointer">
                  <div className="font-medium">{formatPrice(10000)} - {formatPrice(20000)}</div>
                  <div className="text-sm text-muted-foreground">Fully customized template with additional features</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="20000+" id="budget4" />
                <Label htmlFor="budget4" className="flex-1 cursor-pointer">
                  <div className="font-medium">{formatPrice(20000)}+</div>
                  <div className="text-sm text-muted-foreground">Premium solution with advanced features</div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Clock className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-2xl font-bold">When do you need this ready?</h3>
              <p className="text-muted-foreground">Most templates can be delivered in 2-6 weeks</p>
            </div>
            <RadioGroup
              value={questionnaireData.timeline}
              onValueChange={(value) => setQuestionnaireData(prev => ({ ...prev, timeline: value }))}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="asap" id="asap" />
                <Label htmlFor="asap" className="flex-1 cursor-pointer">
                  <div className="font-medium">As soon as possible</div>
                  <div className="text-sm text-muted-foreground">Rush delivery (2-3 weeks)</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="1-month" id="month" />
                <Label htmlFor="month" className="flex-1 cursor-pointer">
                  <div className="font-medium">Within 1 month</div>
                  <div className="text-sm text-muted-foreground">Standard delivery (3-4 weeks)</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="2-months" id="2months" />
                <Label htmlFor="2months" className="flex-1 cursor-pointer">
                  <div className="font-medium">Within 2 months</div>
                  <div className="text-sm text-muted-foreground">Extended timeline for complex customization</div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Users className="h-12 w-12 text-primary mx-auto" />
              <h3 className="text-2xl font-bold">Your Contact Information</h3>
              <p className="text-muted-foreground">We'll use this to send you the customization proposal</p>
            </div>
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <Label htmlFor="contact-name">Full Name *</Label>
                <Input
                  id="contact-name"
                  value={questionnaireData.contactInfo.name}
                  onChange={(e) => setQuestionnaireData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, name: e.target.value }
                  }))}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact-email">Email Address *</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={questionnaireData.contactInfo.email}
                  onChange={(e) => setQuestionnaireData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, email: e.target.value }
                  }))}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact-phone">Phone Number *</Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  value={questionnaireData.contactInfo.phone}
                  onChange={(e) => setQuestionnaireData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, phone: e.target.value }
                  }))}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-primary to-primary/80 p-3 rounded-lg">
              <IconComponent className="h-8 w-8 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                Customize {template.title}
              </DialogTitle>
              <DialogDescription>
                {currentStep === 'questionnaire' && 'Tell us about your business to get personalized recommendations'}
                {currentStep === 'customize' && 'Customize your app design and features'}
                {currentStep === 'preview' && 'Preview your customized app'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {currentStep === 'questionnaire' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Step {questionnaireStep} of {totalQuestionnaireSteps}</span>
                  <span>{Math.round(questionnaireProgress)}% Complete</span>
                </div>
                <Progress value={questionnaireProgress} className="h-2" />
              </div>

              <div className="max-h-[50vh] overflow-y-auto pr-4">
                {renderQuestionnaireStep()}
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={questionnaireStep === 1 ? onClose : handleQuestionnaireBack}
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {questionnaireStep === 1 ? 'Cancel' : 'Previous'}
                </Button>
                <Button
                  onClick={handleQuestionnaireNext}
                  disabled={!isQuestionnaireStepValid() || isSubmitting}
                >
                  {isSubmitting ? (
                    'Processing...'
                  ) : questionnaireStep === totalQuestionnaireSteps ? (
                    'Generate Customization'
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 'customize' && (
            <Tabs defaultValue="branding" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="branding">Branding</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
              </TabsList>

              <div className="max-h-[50vh] overflow-y-auto">
                <TabsContent value="branding" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Brand Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          value={customizationOptions.branding.businessName}
                          onChange={(e) => handleCustomizationUpdate('branding', {
                            ...customizationOptions.branding,
                            businessName: e.target.value
                          })}
                          placeholder="Enter your business name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input
                          id="tagline"
                          value={customizationOptions.branding.tagline}
                          onChange={(e) => handleCustomizationUpdate('branding', {
                            ...customizationOptions.branding,
                            tagline: e.target.value
                          })}
                          placeholder="Enter your business tagline"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Primary Color</Label>
                          <Input
                            type="color"
                            value={customizationOptions.colors.primary}
                            onChange={(e) => handleCustomizationUpdate('colors', {
                              ...customizationOptions.colors,
                              primary: e.target.value
                            })}
                          />
                        </div>
                        <div>
                          <Label>Secondary Color</Label>
                          <Input
                            type="color"
                            value={customizationOptions.colors.secondary}
                            onChange={(e) => handleCustomizationUpdate('colors', {
                              ...customizationOptions.colors,
                              secondary: e.target.value
                            })}
                          />
                        </div>
                        <div>
                          <Label>Accent Color</Label>
                          <Input
                            type="color"
                            value={customizationOptions.colors.accent}
                            onChange={(e) => handleCustomizationUpdate('colors', {
                              ...customizationOptions.colors,
                              accent: e.target.value
                            })}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="features" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Additional Features
                      </CardTitle>
                      <CardDescription>
                        Select additional features to add to {template.title}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          'Advanced Analytics', 'Multi-language Support', 'Push Notifications',
                          'Social Login', 'Dark Mode', 'Offline Mode', 'Export Data',
                          'Custom Reports', 'API Access', 'White-label Branding'
                        ].map((feature) => (
                          <div key={feature} className="flex items-center space-x-2">
                            <Checkbox
                              id={feature}
                              checked={customizationOptions.features.includes(feature)}
                              onCheckedChange={(checked) => handleFeatureToggle(feature, checked as boolean)}
                            />
                            <Label htmlFor={feature} className="cursor-pointer">{feature}</Label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="design" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Design Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Layout Style</Label>
                        <RadioGroup
                          value={customizationOptions.layout}
                          onValueChange={(value) => handleCustomizationUpdate('layout', value)}
                          className="grid grid-cols-3 gap-4 mt-2"
                        >
                          <div className="flex items-center space-x-2 p-3 border rounded-lg">
                            <RadioGroupItem value="modern" id="modern" />
                            <Label htmlFor="modern" className="cursor-pointer">Modern</Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 border rounded-lg">
                            <RadioGroupItem value="classic" id="classic" />
                            <Label htmlFor="classic" className="cursor-pointer">Classic</Label>
                          </div>
                          <div className="flex items-center space-x-2 p-3 border rounded-lg">
                            <RadioGroupItem value="minimal" id="minimal" />
                            <Label htmlFor="minimal" className="cursor-pointer">Minimal</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="integrations" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code2 className="h-5 w-5" />
                        Third-party Integrations
                      </CardTitle>
                      <CardDescription>
                        Connect your app with popular services
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          'Stripe Payments', 'PayPal', 'Google Analytics', 'Mailchimp',
                          'Twilio SMS', 'Slack', 'Zapier', 'Google Maps',
                          'Facebook Pixel', 'Intercom', 'Hubspot', 'Salesforce'
                        ].map((integration) => (
                          <div key={integration} className="flex items-center space-x-2">
                            <Checkbox
                              id={integration}
                              checked={customizationOptions.integrations.includes(integration)}
                              onCheckedChange={(checked) => handleIntegrationToggle(integration, checked as boolean)}
                            />
                            <Label htmlFor={integration} className="cursor-pointer">{integration}</Label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('questionnaire')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Questions
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('preview')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button onClick={handleFinalSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Request Quote'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Tabs>
          )}

          {currentStep === 'preview' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Your Customized App Preview</h3>
                  
                  {/* Mock Preview */}
                  <div 
                    className="aspect-[9/16] bg-gradient-to-br rounded-lg border-2 flex items-center justify-center relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${customizationOptions.colors.primary}15, ${customizationOptions.colors.secondary}15)`
                    }}
                  >
                    <div className="text-center space-y-4">
                      <Smartphone className="h-16 w-16 mx-auto text-muted-foreground" />
                      <div className="space-y-2">
                        <div 
                          className="font-bold text-lg"
                          style={{ color: customizationOptions.colors.primary }}
                        >
                          {customizationOptions.branding.businessName || 'Your Business'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {customizationOptions.branding.tagline || 'Your tagline here'}
                        </div>
                      </div>
                      <div className="flex justify-center gap-2">
                        <div 
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: customizationOptions.colors.primary }}
                        />
                        <div 
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: customizationOptions.colors.secondary }}
                        />
                        <div 
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: customizationOptions.colors.accent }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Customization Summary</h3>
                  
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">TEMPLATE</h4>
                        <p>{template.title}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">BUSINESS INFO</h4>
                        <p>{customizationOptions.branding.businessName || 'Not specified'}</p>
                        <p className="text-sm text-muted-foreground">{customizationOptions.branding.tagline || 'No tagline'}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">ADDITIONAL FEATURES</h4>
                        <p className="text-sm">
                          {customizationOptions.features.length > 0 
                            ? customizationOptions.features.join(', ')
                            : 'None selected'
                          }
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">INTEGRATIONS</h4>
                        <p className="text-sm">
                          {customizationOptions.integrations.length > 0 
                            ? customizationOptions.integrations.join(', ')
                            : 'None selected'
                          }
                        </p>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Estimated Total:</span>
                          <span className="text-2xl font-bold text-primary">
                            {formatPrice(estimatedPrice)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('customize')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Customize
                </Button>
                <Button onClick={handleFinalSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Request This Customization'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {currentStep === 'success' && (
            <div className="space-y-6 text-center py-12">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-emerald-green/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-emerald-green" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-3xl font-bold text-midnight-navy">
                  Thank You, {questionnaireData.contactInfo.name}!
                </h3>
                <p className="text-xl text-cool-gray max-w-2xl mx-auto">
                  Your customization request has been received successfully
                </p>
              </div>

              <Card className="max-w-md mx-auto bg-gradient-card border-soft-lilac/30">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-royal-purple mt-1 flex-shrink-0" />
                    <div className="text-left">
                      <p className="font-semibold text-midnight-navy mb-1">
                        What happens next?
                      </p>
                      <p className="text-sm text-cool-gray">
                        A complete quote for your <span className="font-medium">{template.title}</span> customization will be sent to{' '}
                        <span className="font-medium">{questionnaireData.contactInfo.email}</span> within 24 hours.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-emerald-green mt-1 flex-shrink-0" />
                    <div className="text-left">
                      <p className="font-semibold text-midnight-navy mb-1">
                        Our team will review your requirements
                      </p>
                      <p className="text-sm text-cool-gray">
                        We'll prepare a detailed proposal with pricing, timeline, and next steps tailored to your needs.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-soft-lilac/30">
                    <p className="text-xs text-cool-gray">
                      Redirecting you to the homepage in a few seconds...
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={() => {
                  navigate('/');
                  onClose();
                }}
                variant="premium"
                size="lg"
              >
                Return to Homepage Now
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateCustomizationFlow;