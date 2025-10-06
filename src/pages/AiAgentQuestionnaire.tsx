import { useState, useEffect } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Bot, Building2, MessageSquare, Zap, Users, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { supabaseLeadManager } from '@/utils/supabaseLeadManager';
import { useBudgetOptions } from '@/utils/budgetOptions';
import { analytics } from '@/utils/analytics';
import SEOHead from '@/components/SEOHead';
import { generateOrganizationSchema, generateWebPageSchema, generateServiceSchema } from '@/utils/structuredData';

const AiAgentQuestionnaire = () => {
  const { aiAgent: budgetOptions } = useBudgetOptions();
  const [currentStep, setCurrentStep] = useState(1);

  // Track page view
  useEffect(() => {
    analytics.trackPageView('/ai-agent-questionnaire');
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    businessType: '',
    primaryUseCase: '',
    specificNeeds: '',
    currentChallenges: '',
    budget: '',
    timeline: '',
    teamSize: '',
    techStack: '',
    additionalInfo: ''
  });

  const industries = [
    'Healthcare', 'Real Estate', 'Finance', 'E-commerce', 'Manufacturing', 
    'Education', 'Technology', 'Marketing', 'Legal', 'Other'
  ];

  const businessTypes = [
    'Startup', 'Small Business (1-50 employees)', 'Medium Business (51-200 employees)', 
    'Large Enterprise (200+ employees)', 'Non-profit', 'Government'
  ];

  const useCases = [
    'Customer Support', 'Sales Automation', 'Content Creation', 'Data Analysis', 
    'Process Automation', 'Lead Generation', 'Appointment Scheduling', 'Voice Assistance'
  ];


  const timelines = [
    'ASAP (1-2 weeks)', '1 month', '2-3 months', '3-6 months', '6+ months'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    analytics.trackInteraction('button_click', 'ai_agent_questionnaire_submit');
    analytics.trackConversion('interest');
    try {
      await supabaseLeadManager.saveLead({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        source: 'ai-agent',
        form_data: {
          industry: formData.industry,
          businessType: formData.businessType,
          primaryUseCase: formData.primaryUseCase,
          specificNeeds: formData.specificNeeds,
          currentChallenges: formData.currentChallenges,
          budget: formData.budget,
          timeline: formData.timeline,
          teamSize: formData.teamSize,
          techStack: formData.techStack,
          additionalInfo: formData.additionalInfo
        }
      });
      
      setCurrentStep(5); // Success step
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
    }
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.phone && formData.company;
      case 2:
        return formData.industry && formData.businessType;
      case 3:
        return formData.primaryUseCase && formData.specificNeeds;
      case 4:
        return formData.budget && formData.timeline;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-heading font-bold text-midnight-navy mb-2">
                Let's Get Started
              </h2>
              <p className="text-cool-gray">Tell us about yourself and your organization</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-midnight-navy mb-2">
                  Full Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-midnight-navy mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@company.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-midnight-navy mb-2">
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-midnight-navy mb-2">
                  Company Name *
                </label>
                <Input
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Your company name"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-heading font-bold text-midnight-navy mb-2">
                About Your Business
              </h2>
              <p className="text-cool-gray">Help us understand your industry and business size</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-midnight-navy mb-2">
                  Industry *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {industries.map((industry) => (
                    <button
                      key={industry}
                      type="button"
                      onClick={() => handleInputChange('industry', industry)}
                      className={`p-3 text-sm rounded-lg border transition-all ${
                        formData.industry === industry
                          ? 'bg-gradient-primary text-white border-royal-purple'
                          : 'bg-white text-midnight-navy border-soft-lilac/20 hover:border-royal-purple/40'
                      }`}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-midnight-navy mb-2">
                  Business Type *
                </label>
                <div className="space-y-2">
                  {businessTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleInputChange('businessType', type)}
                      className={`w-full p-3 text-sm rounded-lg border transition-all text-left ${
                        formData.businessType === type
                          ? 'bg-gradient-primary text-white border-royal-purple'
                          : 'bg-white text-midnight-navy border-soft-lilac/20 hover:border-royal-purple/40'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-heading font-bold text-midnight-navy mb-2">
                Your AI Agent Needs
              </h2>
              <p className="text-cool-gray">What would you like your AI agent to help with?</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-midnight-navy mb-2">
                  Primary Use Case *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {useCases.map((useCase) => (
                    <button
                      key={useCase}
                      type="button"
                      onClick={() => handleInputChange('primaryUseCase', useCase)}
                      className={`p-3 text-sm rounded-lg border transition-all ${
                        formData.primaryUseCase === useCase
                          ? 'bg-gradient-primary text-white border-royal-purple'
                          : 'bg-white text-midnight-navy border-soft-lilac/20 hover:border-royal-purple/40'
                      }`}
                    >
                      {useCase}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-midnight-navy mb-2">
                  Specific Needs & Requirements *
                </label>
                <Textarea
                  value={formData.specificNeeds}
                  onChange={(e) => handleInputChange('specificNeeds', e.target.value)}
                  placeholder="Describe exactly what you need your AI agent to do..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-midnight-navy mb-2">
                  Current Challenges
                </label>
                <Textarea
                  value={formData.currentChallenges}
                  onChange={(e) => handleInputChange('currentChallenges', e.target.value)}
                  placeholder="What problems are you trying to solve?"
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-heading font-bold text-midnight-navy mb-2">
                Project Details
              </h2>
              <p className="text-cool-gray">Help us understand your budget and timeline</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-midnight-navy mb-2">
                  Budget Range *
                </label>
                <div className="space-y-2">
                  {budgetOptions.map((budget) => (
                    <button
                      key={budget}
                      type="button"
                      onClick={() => handleInputChange('budget', budget)}
                      className={`w-full p-3 text-sm rounded-lg border transition-all text-left ${
                        formData.budget === budget
                          ? 'bg-gradient-primary text-white border-royal-purple'
                          : 'bg-white text-midnight-navy border-soft-lilac/20 hover:border-royal-purple/40'
                      }`}
                    >
                      {budget}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-midnight-navy mb-2">
                  Timeline *
                </label>
                <div className="space-y-2">
                  {timelines.map((timeline) => (
                    <button
                      key={timeline}
                      type="button"
                      onClick={() => handleInputChange('timeline', timeline)}
                      className={`w-full p-3 text-sm rounded-lg border transition-all text-left ${
                        formData.timeline === timeline
                          ? 'bg-gradient-primary text-white border-royal-purple'
                          : 'bg-white text-midnight-navy border-soft-lilac/20 hover:border-royal-purple/40'
                      }`}
                    >
                      {timeline}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-midnight-navy mb-2">
                  Additional Information
                </label>
                <Textarea
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                  placeholder="Any other details you'd like to share..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-green/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-emerald-green" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-midnight-navy">
              Thank You!
            </h2>
            <p className="text-lg text-cool-gray max-w-md mx-auto">
              We've received your AI agent questionnaire. Our team will review your requirements and get back to you within 24 hours with a custom proposal.
            </p>
            <div className="bg-gradient-to-r from-emerald-green/10 to-royal-purple/10 p-6 rounded-lg">
              <p className="text-midnight-navy font-medium">
                What happens next?
              </p>
              <ul className="text-sm text-cool-gray mt-2 space-y-1">
                <li>• Our AI specialists will analyze your requirements</li>
                <li>• We'll prepare a custom solution proposal</li>
                <li>• Schedule a demo call to discuss your project</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="AI Agent Questionnaire | Custom AI Solutions - Vision-Sync Forge"
        description="Get matched with the perfect AI agent for your business. Answer 7 questions, receive custom recommendations. Start automating in 48 hours."
        keywords="AI agent, custom AI solution, AI assistant, business automation, AI chatbot, AI questionnaire"
        canonical="https://vision-sync-forge.lovable.app/ai-agent-questionnaire"
        ogImage="https://vision-sync-forge.lovable.app/og-images/ai-agent-questionnaire.jpg"
        structuredData={[
          generateOrganizationSchema(),
          generateWebPageSchema({
            name: "AI Agent Questionnaire",
            description: "Custom AI agent solution questionnaire",
            url: "https://vision-sync-forge.lovable.app/ai-agent-questionnaire"
          }),
          generateServiceSchema({
            name: "Custom AI Agent Development",
            description: "Professional AI agent development tailored to your business needs",
            serviceType: "AI Development"
          })
        ]}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-midnight-navy mb-6">
            Get Your{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              AI Agent
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-cool-gray mb-8">
            Tell us about your needs and we'll create the perfect AI solution for your business
          </p>
        </div>
      </section>

      {/* Questionnaire Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          {currentStep < 5 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-midnight-navy">
                  Step {currentStep} of 4
                </span>
                <span className="text-sm text-cool-gray">
                  {Math.round((currentStep / 4) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-soft-lilac/20 rounded-full h-2">
                <div 
                  className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Form Card */}
          <Card className="p-8">
            {renderStep()}
            
            {/* Navigation Buttons */}
            {currentStep < 5 && (
              <div className="flex justify-between mt-8 pt-6 border-t border-soft-lilac/20">
                <Button 
                  variant="ghost" 
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                {currentStep < 4 ? (
                  <Button 
                    variant="hero"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!isStepComplete(currentStep)}
                  >
                    Next Step
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    variant="hero"
                    onClick={handleSubmit}
                    disabled={!isStepComplete(currentStep)}
                  >
                    Submit Questionnaire
                    <Sparkles className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            )}
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AiAgentQuestionnaire;