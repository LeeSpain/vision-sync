import { useState } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import SEOHead from '@/components/SEOHead';
import { generateOrganizationSchema, generateWebPageSchema, generateFAQSchema } from '@/utils/structuredData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Shield, CheckCircle, ArrowRight, Send, MessageSquare } from 'lucide-react';
import { supabaseLeadManager } from '@/utils/supabaseLeadManager';
import { useBudgetOptions } from '@/utils/budgetOptions';
import AiChatWidget from '@/components/chat/AiChatWidget';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  const contactFAQs = [
    {
      question: "How quickly can you start my project?",
      answer: "We typically start new projects within 1-2 weeks of approval. For urgent projects, we can accommodate faster timelines."
    },
    {
      question: "What types of projects do you work on?",
      answer: "We develop custom web applications, mobile apps, AI solutions, e-commerce platforms, and enterprise systems across all industries."
    },
    {
      question: "Do you offer ongoing support after launch?",
      answer: "Yes, we provide comprehensive support and maintenance packages to ensure your application continues to perform optimally."
    }
  ];
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
    'AI Agent Development', 'Enterprise AI Automation', 'Module Integration',
    'Demo Request', 'Partnership', 'General Inquiry'
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
                {t('contact.infoTitle')}
              </h2>
              <p className="text-cool-gray">{t('contact.infoSubtitle')}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-midnight-navy mb-2">
                  {t('contact.fullName')}
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t('contact.fullNamePlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight-navy mb-2">
                  {t('contact.email')}
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={t('contact.emailPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight-navy mb-2">
                  {t('contact.phone')}
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder={t('contact.phonePlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-midnight-navy mb-2">
                  {t('contact.company')}
                </label>
                <Input
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder={t('contact.companyPlaceholder')}
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
                {t('contact.inquiryTitle')}
              </h2>
              <p className="text-cool-gray">{t('contact.inquirySubtitle')}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-midnight-navy mb-2">
                  {t('contact.inquiryType')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {inquiryTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleInputChange('inquiryType', type)}
                      className={`p-3 text-sm rounded-lg border transition-all ${formData.inquiryType === type
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
                  {t('contact.industry')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {industries.map((industry) => (
                    <button
                      key={industry}
                      type="button"
                      onClick={() => handleInputChange('industry', industry)}
                      className={`p-3 text-sm rounded-lg border transition-all ${formData.industry === industry
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
                {t('contact.scopeTitle')}
              </h2>
              <p className="text-cool-gray">{t('contact.scopeSubtitle')}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-midnight-navy mb-2">
                  {t('contact.budget')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {budgetOptions.map((budget) => (
                    <button
                      key={budget}
                      type="button"
                      onClick={() => handleInputChange('budget', budget)}
                      className={`p-3 text-sm rounded-lg border transition-all ${formData.budget === budget
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
                  {t('contact.timeline')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {timelines.map((timeline) => (
                    <button
                      key={timeline}
                      type="button"
                      onClick={() => handleInputChange('timeline', timeline)}
                      className={`p-3 text-sm rounded-lg border transition-all ${formData.timeline === timeline
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
                  {t('contact.message')}
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder={t('contact.messagePlaceholder')}
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
              {t('contact.sentTitle')}
            </h2>
            <p className="text-lg text-cool-gray max-w-md mx-auto">
              {t('contact.sentDesc')}
            </p>
            <div className="bg-gradient-to-r from-emerald-green/10 to-royal-purple/10 p-6 rounded-lg">
              <p className="text-midnight-navy font-medium">
                {t('contact.whatsNext')}
              </p>
              <ul className="text-sm text-cool-gray mt-2 space-y-1">
                <li>{t('contact.next1')}</li>
                <li>{t('contact.next2')}</li>
                <li>{t('contact.next3')}</li>
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
        title="Contact Vision-Sync Forge | Get Your Free Consultation"
        description="Get in touch with Vision-Sync Forge for custom software development, AI solutions, and app templates. Free consultation and personalized recommendations."
        keywords="contact, consultation, software development inquiry, custom software quote, AI solutions contact"
        canonical="https://vision-sync.com/contact"
        ogImage="https://vision-sync.com/og-images/contact.jpg"
        structuredData={[
          generateOrganizationSchema(),
          generateWebPageSchema({
            name: "Contact Vision-Sync",
            description: "Get in touch for custom software development and AI solutions",
            url: "https://vision-sync.com/contact"
          }),
          generateFAQSchema(contactFAQs)
        ]}
      />
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-midnight-navy mb-6">
            {t('contact.title')}{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              {t('contact.titleHighlight')}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-cool-gray mb-8 max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            {/* Contact Questionnaire */}
            <div className="order-2 lg:order-1 flex flex-col">
              {/* Progress Bar */}
              {currentStep < 4 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-midnight-navy">
                      {t('contact.step', { current: currentStep, total: 3 })}
                    </span>
                    <span className="text-sm text-cool-gray">
                      {t('contact.complete', { percent: Math.round((currentStep / 3) * 100) })}
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

              <Card className="p-8 shadow-lg border-slate-200/60 flex-1 flex flex-col">
                <div className="flex-1">
                  {renderStep()}
                </div>

                {/* Navigation Buttons */}
                {currentStep < 4 && (
                  <div className="flex justify-between mt-8 pt-6 border-t border-soft-lilac/20">
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                      disabled={currentStep === 1}
                    >
                      {t('contact.prev')}
                    </Button>

                    {currentStep < 3 ? (
                      <Button
                        variant="hero"
                        onClick={() => setCurrentStep(currentStep + 1)}
                        disabled={!isStepComplete(currentStep)}
                      >
                        {t('contact.next')}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        variant="hero"
                        onClick={handleSubmit}
                        disabled={!isStepComplete(currentStep)}
                      >
                        {t('contact.send')}
                        <Send className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            </div>

            {/* AI Guardian Section */}
            <div className="order-1 lg:order-2 flex flex-col">
              <div className="bg-gradient-to-br from-midnight-navy via-royal-purple to-electric-blue rounded-2xl p-6 text-white shadow-2xl flex-1 flex flex-col">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <Shield className="h-8 w-8 text-coral-orange" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold mb-2">
                    {t('contact.aiTitle')}
                  </h2>
                  <p className="text-white/80">
                    {t('contact.aiSubtitle')}
                  </p>
                </div>

                {/* Embedded AI Guardian Chat */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex-1 min-h-[500px] max-h-[600px] overflow-hidden flex">
                  <AiChatWidget embedded={true} />
                </div>

                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center gap-4 text-sm text-white/70">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-green rounded-full animate-pulse"></div>
                      <span>{t('contact.aiAvailable')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{t('contact.aiResponses')}</span>
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