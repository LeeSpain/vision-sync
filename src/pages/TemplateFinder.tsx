import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Sparkles, Target, DollarSign, Clock, Users, Zap } from "lucide-react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { analytics } from '@/utils/analytics';
import SEOHead from '@/components/SEOHead';
import { generateOrganizationSchema, generateWebPageSchema } from '@/utils/structuredData';

interface QuestionnaireData {
  businessType: string;
  industry: string;
  requirements: string[];
  businessSize: string;
  techComfort: string;
  budgetRange: string;
  timeline: string;
}

const TemplateFinder = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData>({
    businessType: '',
    industry: '',
    requirements: [],
    businessSize: '',
    techComfort: '',
    budgetRange: '',
    timeline: ''
  });

  // Track page view
  useEffect(() => {
    analytics.trackPageView('/template-finder');
  }, []);

  const totalSteps = 7;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      analytics.trackInteraction('button_click', `template_finder_step_${currentStep}_next`);
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    analytics.trackInteraction('button_click', 'template_finder_submit');
    analytics.trackConversion('interest');
    try {
      const { data } = await supabase.functions.invoke('ai-template-assistant', {
        body: { 
          action: 'match-templates', 
          data: questionnaireData 
        }
      });

      // Store questionnaire data and navigate to recommendations
      sessionStorage.setItem('questionnaireData', JSON.stringify(questionnaireData));
      sessionStorage.setItem('templateRecommendations', JSON.stringify(data));
      navigate('/template-recommendations');
    } catch (error) {
      console.error('Error getting recommendations:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return questionnaireData.businessType !== '';
      case 2: return questionnaireData.industry !== '';
      case 3: return questionnaireData.requirements.length > 0;
      case 4: return questionnaireData.businessSize !== '';
      case 5: return questionnaireData.techComfort !== '';
      case 6: return questionnaireData.budgetRange !== '';
      case 7: return questionnaireData.timeline !== '';
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Target className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-2xl font-bold">What type of business do you run?</h2>
              <p className="text-muted-foreground">This helps us understand your core business model</p>
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
              <h2 className="text-2xl font-bold">What industry are you in?</h2>
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
              <h2 className="text-2xl font-bold">What features do you need?</h2>
              <p className="text-muted-foreground">Select all that apply to your business</p>
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
              <h2 className="text-2xl font-bold">How big is your business?</h2>
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
              <h2 className="text-2xl font-bold">How comfortable are you with technology?</h2>
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
              <h2 className="text-2xl font-bold">What's your budget range?</h2>
              <p className="text-muted-foreground">Our templates start at $2,000 and can be customized to fit your needs</p>
            </div>
            <RadioGroup
              value={questionnaireData.budgetRange}
              onValueChange={(value) => setQuestionnaireData(prev => ({ ...prev, budgetRange: value }))}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="2000-5000" id="budget1" />
                <Label htmlFor="budget1" className="flex-1 cursor-pointer">
                  <div className="font-medium">$2,000 - $5,000</div>
                  <div className="text-sm text-muted-foreground">Basic template with minimal customization</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="5000-10000" id="budget2" />
                <Label htmlFor="budget2" className="flex-1 cursor-pointer">
                  <div className="font-medium">$5,000 - $10,000</div>
                  <div className="text-sm text-muted-foreground">Template with moderate customization</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="10000-20000" id="budget3" />
                <Label htmlFor="budget3" className="flex-1 cursor-pointer">
                  <div className="font-medium">$10,000 - $20,000</div>
                  <div className="text-sm text-muted-foreground">Fully customized template with additional features</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="20000+" id="budget4" />
                <Label htmlFor="budget4" className="flex-1 cursor-pointer">
                  <div className="font-medium">$20,000+</div>
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
              <h2 className="text-2xl font-bold">When do you need this ready?</h2>
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
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="flexible" id="flexible" />
                <Label htmlFor="flexible" className="flex-1 cursor-pointer">
                  <div className="font-medium">I'm flexible</div>
                  <div className="text-sm text-muted-foreground">No rush, focus on getting it right</div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <SEOHead
        title="Template Finder | AI-Powered Recommendations - Vision-Sync Forge"
        description="Find your perfect app template with our AI-powered questionnaire. Answer a few questions and get personalized template recommendations tailored to your business needs and budget."
        keywords="template finder, AI recommendations, business template, app template, custom web app, template questionnaire"
        canonical="https://vision-sync-forge.lovable.app/template-finder"
        structuredData={[
          generateOrganizationSchema(),
          generateWebPageSchema({
            name: "Template Finder",
            description: "AI-powered template recommendation questionnaire",
            url: "https://vision-sync-forge.lovable.app/template-finder"
          })
        ]}
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Find Your Perfect App Template</h1>
            <p className="text-muted-foreground mb-6">
              Answer a few questions and we'll recommend the best template for your business
            </p>
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
          </div>

          {/* Question Card */}
          <Card className="mb-8">
            <CardHeader className="pb-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold">{currentStep}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {renderStep()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!isStepValid() || isSubmitting}
              className="flex items-center gap-2"
            >
              {currentStep === totalSteps ? (
                isSubmitting ? 'Finding Templates...' : 'Get My Recommendations'
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TemplateFinder;