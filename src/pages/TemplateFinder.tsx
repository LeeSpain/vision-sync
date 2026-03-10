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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
              <h2 className="text-2xl font-bold">{t('templateFinder.step1.title')}</h2>
              <p className="text-muted-foreground">{t('templateFinder.step1.subtitle')}</p>
            </div>
            <RadioGroup
              value={questionnaireData.businessType}
              onValueChange={(value) => setQuestionnaireData(prev => ({ ...prev, businessType: value }))}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="service" id="service" />
                <Label htmlFor="service" className="flex-1 cursor-pointer">
                  <div className="font-medium">{t('templateFinder.step1.service.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('templateFinder.step1.service.desc')}</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="product" id="product" />
                <Label htmlFor="product" className="flex-1 cursor-pointer">
                  <div className="font-medium">{t('templateFinder.step1.product.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('templateFinder.step1.product.desc')}</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="location" id="location" />
                <Label htmlFor="location" className="flex-1 cursor-pointer">
                  <div className="font-medium">{t('templateFinder.step1.location.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('templateFinder.step1.location.desc')}</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="platform" id="platform" />
                <Label htmlFor="platform" className="flex-1 cursor-pointer">
                  <div className="font-medium">{t('templateFinder.step1.platform.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('templateFinder.step1.platform.desc')}</div>
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
              <h2 className="text-2xl font-bold">{t('templateFinder.step2.title')}</h2>
              <p className="text-muted-foreground">{t('templateFinder.step2.subtitle')}</p>
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
                  <Label htmlFor={industry} className="cursor-pointer">{t(`templateFinder.industries.${industry}`)}</Label>
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
              <h2 className="text-2xl font-bold">{t('templateFinder.step3.title')}</h2>
              <p className="text-muted-foreground">{t('templateFinder.step3.subtitle')}</p>
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
                  <Label htmlFor={requirement} className="cursor-pointer">{t(`templateFinder.requirements.${requirement}`)}</Label>
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
              <h2 className="text-2xl font-bold">{t('templateFinder.step4.title')}</h2>
              <p className="text-muted-foreground">{t('templateFinder.step4.subtitle')}</p>
            </div>
            <RadioGroup
              value={questionnaireData.businessSize}
              onValueChange={(value) => setQuestionnaireData(prev => ({ ...prev, businessSize: value }))}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="solo" id="solo" />
                <Label htmlFor="solo" className="flex-1 cursor-pointer">
                  <div className="font-medium">{t('templateFinder.step4.solo.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('templateFinder.step4.solo.desc')}</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="small" id="small" />
                <Label htmlFor="small" className="flex-1 cursor-pointer">
                  <div className="font-medium">{t('templateFinder.step4.small.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('templateFinder.step4.small.desc')}</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="flex-1 cursor-pointer">
                  <div className="font-medium">{t('templateFinder.step4.medium.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('templateFinder.step4.medium.desc')}</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="large" id="large" />
                <Label htmlFor="large" className="flex-1 cursor-pointer">
                  <div className="font-medium">{t('templateFinder.step4.large.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('templateFinder.step4.large.desc')}</div>
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
              <h2 className="text-2xl font-bold">{t('templateFinder.step5.title')}</h2>
              <p className="text-muted-foreground">{t('templateFinder.step5.subtitle')}</p>
            </div>
            <RadioGroup
              value={questionnaireData.techComfort}
              onValueChange={(value) => setQuestionnaireData(prev => ({ ...prev, techComfort: value }))}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="basic" id="basic" />
                <Label htmlFor="basic" className="flex-1 cursor-pointer">
                  <div className="font-medium">{t('templateFinder.step5.basic.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('templateFinder.step5.basic.desc')}</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate" className="flex-1 cursor-pointer">
                  <div className="font-medium">{t('templateFinder.step5.intermediate.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('templateFinder.step5.intermediate.desc')}</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced" className="flex-1 cursor-pointer">
                  <div className="font-medium">{t('templateFinder.step5.advanced.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('templateFinder.step5.advanced.desc')}</div>
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
              <h2 className="text-2xl font-bold">{t('templateFinder.step6.title')}</h2>
              <p className="text-muted-foreground">{t('templateFinder.step6.subtitle')}</p>
            </div>
            <RadioGroup
              value={questionnaireData.budgetRange}
              onValueChange={(value) => setQuestionnaireData(prev => ({ ...prev, budgetRange: value }))}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="2000-5000" id="budget1" />
                <Label htmlFor="budget1" className="flex-1 cursor-pointer">
                  <div className="font-medium">{t('templateFinder.step6.b2000.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('templateFinder.step6.b2000.desc')}</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="5000-10000" id="budget2" />
                <Label htmlFor="budget2" className="flex-1 cursor-pointer">
                  <div className="font-medium">{t('templateFinder.step6.b5000.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('templateFinder.step6.b5000.desc')}</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="10000-20000" id="budget3" />
                <Label htmlFor="budget3" className="flex-1 cursor-pointer">
                  <div className="font-medium">{t('templateFinder.step6.b10000.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('templateFinder.step6.b10000.desc')}</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="20000+" id="budget4" />
                <Label htmlFor="budget4" className="flex-1 cursor-pointer">
                  <div className="font-medium">{t('templateFinder.step6.b20000.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('templateFinder.step6.b20000.desc')}</div>
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
              <h2 className="text-2xl font-bold">{t('templateFinder.step7.title')}</h2>
              <p className="text-muted-foreground">{t('templateFinder.step7.subtitle')}</p>
            </div>
            <RadioGroup
              value={questionnaireData.timeline}
              onValueChange={(value) => setQuestionnaireData(prev => ({ ...prev, timeline: value }))}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="asap" id="asap" />
                <Label htmlFor="asap" className="flex-1 cursor-pointer">
                  <div className="font-medium">{t('templateFinder.step7.asap.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('templateFinder.step7.asap.desc')}</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="1-month" id="month" />
                <Label htmlFor="month" className="flex-1 cursor-pointer">
                  <div className="font-medium">{t('templateFinder.step7.month1.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('templateFinder.step7.month1.desc')}</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="2-months" id="2months" />
                <Label htmlFor="2months" className="flex-1 cursor-pointer">
                  <div className="font-medium">{t('templateFinder.step7.month2.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('templateFinder.step7.month2.desc')}</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="flexible" id="flexible" />
                <Label htmlFor="flexible" className="flex-1 cursor-pointer">
                  <div className="font-medium">{t('templateFinder.step7.flexible.title')}</div>
                  <div className="text-sm text-muted-foreground">{t('templateFinder.step7.flexible.desc')}</div>
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
        ogImage="https://vision-sync-forge.lovable.app/og-images/template-finder.jpg"
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
            <h1 className="text-3xl font-bold mb-2">{t('templateFinder.title')}</h1>
            <p className="text-muted-foreground mb-6">
              {t('templateFinder.subtitle')}
            </p>
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {t('templateFinder.step', { current: currentStep, total: totalSteps })}
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
              {t('templateFinder.back')}
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isStepValid() || isSubmitting}
              className="flex items-center gap-2"
            >
              {currentStep === totalSteps ? (
                isSubmitting ? t('templateFinder.finding') : t('templateFinder.getRecommendations')
              ) : (
                <>
                  {t('templateFinder.next')}
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