import { useState } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Bot, Building2, MessageSquare, Zap, Users, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { leadManager } from '@/utils/leadManager';

const AiAgentQuestionnaire = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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

  const budgetRanges = [
    'Under $10k', '$10k - $25k', '$25k - $50k', '$50k - $100k', '$100k+'
  ];

  const timelines = [
    'ASAP (1-2 weeks)', '1 month', '2-3 months', '3-6 months', '6+ months'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await leadManager.saveLead({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        message: `AI Agent Questionnaire:
        
Industry: ${formData.industry}
Business Type: ${formData.businessType}
Primary Use Case: ${formData.primaryUseCase}
Specific Needs: ${formData.specificNeeds}
Current Challenges: ${formData.currentChallenges}
Budget: ${formData.budget}
Timeline: ${formData.timeline}
Team Size: ${formData.teamSize}
Tech Stack: ${formData.techStack}
Additional Info: ${formData.additionalInfo}`,
        source: 'custom-build'
      });
      
      setCurrentStep(5); // Success step
    } catch (error) {
      alert('There was an error submitting your questionnaire. Please try again.');
    }
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.company;
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
                  {budgetRanges.map((budget) => (
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