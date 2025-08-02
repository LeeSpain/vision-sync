import { useState } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowRight, Sparkles, MessageSquare, Building2, Users, Target } from 'lucide-react';
import { supabaseLeadManager } from '@/utils/supabaseLeadManager';
import { useBudgetOptions } from '@/utils/budgetOptions';
import AiChatWidget from '@/components/chat/AiChatWidget';

const Contact = () => {
  const { general: budgetOptions } = useBudgetOptions();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    inquiryType: '',
    industry: '',
    budget: '',
    timeline: '',
    message: ''
  });

  const inquiryTypes = [
    'AI Agent Development', 'Platform Purchase', 'Custom Development', 
    'Investment Opportunity', 'Partnership', 'General Inquiry'
  ];

  const industries = [
    'Healthcare', 'Real Estate', 'Finance', 'E-commerce', 'Manufacturing', 
    'Education', 'Technology', 'Marketing', 'Legal', 'Other'
  ];


  const timelines = [
    'ASAP (1-2 weeks)', '1 month', '2-3 months', '3-6 months', '6+ months', 'Not sure yet'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await supabaseLeadManager.saveLead({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        source: 'contact',
        form_data: {
          industry: formData.industry,
          inquiryType: formData.inquiryType,
          budget: formData.budget,
          timeline: formData.timeline,
          message: formData.message
        }
      });
      
      setCurrentStep(4); // Success step
    } catch (error) {
      console.error('Error submitting contact form:', error);
    }
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.phone && formData.company;
      case 2:
        return formData.inquiryType && formData.industry;
      case 3:
        return formData.budget && formData.timeline && formData.message;
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
                Contact Information
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
                Inquiry Details
              </h2>
              <p className="text-cool-gray">Help us understand what you're looking for</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-midnight-navy mb-2">
                  Type of Inquiry *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {inquiryTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleInputChange('inquiryType', type)}
                      className={`p-3 text-sm rounded-lg border transition-all ${
                        formData.inquiryType === type
                          ? 'bg-gradient-primary text-white border-royal-purple'
                          : 'bg-white text-midnight-navy border-soft-lilac/20 hover:border-royal-purple/40'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
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
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-heading font-bold text-midnight-navy mb-2">
                Project Scope
              </h2>
              <p className="text-cool-gray">Tell us about your budget, timeline, and requirements</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-midnight-navy mb-2">
                  Budget Range *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {budgetOptions.map((budget) => (
                    <button
                      key={budget}
                      type="button"
                      onClick={() => handleInputChange('budget', budget)}
                      className={`p-3 text-sm rounded-lg border transition-all ${
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
                <div className="grid grid-cols-2 gap-2">
                  {timelines.map((timeline) => (
                    <button
                      key={timeline}
                      type="button"
                      onClick={() => handleInputChange('timeline', timeline)}
                      className={`p-3 text-sm rounded-lg border transition-all ${
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
                  Detailed Message *
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Please describe your specific requirements, goals, or questions in detail..."
                  className="min-h-[120px]"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-green/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-emerald-green" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-midnight-navy">
              Message Sent!
            </h2>
            <p className="text-lg text-cool-gray max-w-md mx-auto">
              Thank you for reaching out! We've received your inquiry and will get back to you within 24 hours.
            </p>
            <div className="bg-gradient-to-r from-emerald-green/10 to-royal-purple/10 p-6 rounded-lg">
              <p className="text-midnight-navy font-medium">
                What happens next?
              </p>
              <ul className="text-sm text-cool-gray mt-2 space-y-1">
                <li>• Our team will review your inquiry</li>
                <li>• We'll prepare a personalized response</li>
                <li>• Expect to hear from us within 24 hours</li>
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
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-midnight-navy mb-6">
            Contact{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Us Today
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-cool-gray mb-8 max-w-3xl mx-auto">
            Ready to transform your business with AI? Let's discuss your project and explore how we can help you succeed.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Questionnaire */}
            <div className="order-2 lg:order-1">
              {/* Progress Bar */}
              {currentStep < 4 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-midnight-navy">
                      Step {currentStep} of 3
                    </span>
                    <span className="text-sm text-cool-gray">
                      {Math.round((currentStep / 3) * 100)}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-soft-lilac/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <Card className="p-8 shadow-lg border-slate-200/60">
                {renderStep()}
                
                {/* Navigation Buttons */}
                {currentStep < 4 && (
                  <div className="flex justify-between mt-8 pt-6 border-t border-soft-lilac/20">
                    <Button 
                      variant="ghost" 
                      onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                      disabled={currentStep === 1}
                    >
                      Previous
                    </Button>
                    
                    {currentStep < 3 ? (
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
                        Send Message
                        <Send className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            </div>

            {/* AI Assistant Section */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-8">
              <div className="bg-gradient-to-br from-midnight-navy via-royal-purple to-electric-blue rounded-2xl p-6 text-white shadow-2xl">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <Sparkles className="h-8 w-8 text-coral-orange" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold mb-2">
                    AI Guardian Assistant
                  </h2>
                  <p className="text-white/80">
                    Get instant answers about our services while you fill out the form
                  </p>
                </div>
                
                {/* AI Chat Widget - Always Open */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 h-[500px] flex flex-col">
                  <div className="flex-1 relative">
                    <AiChatWidget isMinimized={false} />
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center gap-4 text-sm text-white/70">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-green rounded-full animate-pulse"></div>
                      <span>AI Available 24/7</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>Instant Responses</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;