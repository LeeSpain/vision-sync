import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TemplateCardAdapter } from '@/components/TemplateCardAdapter';
import SEOHead from '@/components/SEOHead';
import { generateOrganizationSchema, generateWebPageSchema } from '@/utils/structuredData';
import { AppTemplate } from '@/utils/appTemplates';
import TemplateCategoryFilterAdapter from '@/components/TemplateCategoryFilterAdapter';
import TemplateCustomizationFlow from '@/components/TemplateCustomizationFlow';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { useTemplates, Template } from '@/hooks/useTemplates';
import { Package, Star, Rocket, Sparkles, ArrowLeft, CheckCircle, TrendingUp, Users, Zap, Shield, Clock, Code, Palette, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analytics } from '@/utils/analytics';

const Templates = () => {
  const { 
    templates, 
    loading, 
    error, 
    getTemplatesByCategory, 
    getAllCategories, 
    getTemplateCounts 
  } = useTemplates();
  
  // Template state
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<AppTemplate | null>(null);
  
  const [isCustomizationFlowOpen, setIsCustomizationFlowOpen] = useState(false);

  const handleCloseCustomizationFlow = () => {
    setIsCustomizationFlowOpen(false);
    setSelectedTemplate(null);
  };

  const handleOpenCustomizationFlow = (template: AppTemplate) => {
    setSelectedTemplate(template);
    setIsCustomizationFlowOpen(true);
  };

  const handleLearnMore = (template: AppTemplate) => {
    analytics.trackInteraction('button_click', 'template_learn_more', template.id);
    analytics.trackConversion('interest');
    setSelectedTemplate(template);
  };

  const handleRequestTemplate = (template: AppTemplate) => {
    analytics.trackInteraction('button_click', 'template_request', template.id);
    analytics.trackConversion('interest');
    setSelectedTemplate(template);
  };

  const handleCategoryChange = (category: string) => {
    analytics.trackInteraction('filter_change', 'template_category', category);
    setSelectedCategory(category);
  };

  useEffect(() => {
    analytics.trackPageView('/templates');
  }, []);

  const categories = getAllCategories();
  const totalTemplates = templates.length;
  const displayedTemplates = selectedCategory === 'all' 
    ? templates 
    : getTemplatesByCategory(selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-white via-background to-soft-lilac/10">
      <SEOHead
        title="50+ Professional App Templates | Deploy in 72 Hours"
        description="Browse 50+ professional app templates ready for instant customization. Industry-specific solutions for healthcare, e-commerce, real estate. Deploy in 72 hours."
        keywords="app templates, web app templates, business app templates, ready-to-deploy apps, customizable templates, professional templates"
        canonical="https://vision-sync-forge.lovable.app/templates"
        ogImage="https://vision-sync-forge.lovable.app/og-images/templates.jpg"
        structuredData={[
          generateOrganizationSchema(),
          generateWebPageSchema({
            name: "Professional App Templates",
            description: "Explore professional app templates for various industries",
            url: "https://vision-sync-forge.lovable.app/templates"
          })
        ]}
      />
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-royal-purple/5 via-transparent to-emerald-green/5"></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-emerald-green/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-coral-orange/10 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
        
        <div className="max-w-7xl mx-auto relative">

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-primary px-6 py-2 rounded-full text-white font-medium mb-6 animate-fade-in shadow-glow">
              <Sparkles className="h-4 w-4 animate-pulse" />
              Ready-to-Deploy Solutions
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-midnight-navy mb-6 leading-tight animate-slide-up">
              Professional App Templates
            </h1>
            <p className="text-xl md:text-2xl text-cool-gray max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in" style={{animationDelay: '0.2s'}}>
              Choose from <span className="text-royal-purple font-semibold">{templates.length} industry-specific solutions</span>, customize with your branding, 
              and launch in <span className="text-emerald-green font-semibold">72 hours</span> or less.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-green" />
                <span className="text-sm font-medium text-midnight-navy">Expertly Designed</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-royal-purple" />
                <span className="text-sm font-medium text-midnight-navy">Secure & Reliable</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-coral-orange" />
                <span className="text-sm font-medium text-midnight-navy">Instant Deployment</span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{animationDelay: '0.4s'}}>
              <Link to="/template-finder">
                <Button variant="hero" size="lg" className="hover-scale shadow-glow">
                  <Rocket className="h-5 w-5" />
                  Find My Template
                  <ArrowLeft className="h-5 w-5 rotate-180" />
                </Button>
              </Link>
              <Link to="/custom-builds">
                <Button variant="secondary" size="lg" className="hover-scale">
                  <Code className="h-5 w-5" />
                  Request Custom Build
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <TemplateCategoryFilterAdapter
            categories={categories}
            selectedCategory={selectedCategory}
            totalTemplates={totalTemplates}
            templateCounts={getTemplateCounts()}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-slate-white/50 rounded-xl animate-pulse"></div>
              ))
            ) : error ? (
              <div className="text-center text-red-500">Error loading templates. Please try again later.</div>
            ) : displayedTemplates.length > 0 ? (
              displayedTemplates.map((template: AppTemplate) => (
                <TemplateCardAdapter
                  key={template.id}
                  template={template}
                  onRequestTemplate={handleRequestTemplate}
                  onLearnMore={handleLearnMore}
                />
              ))
            ) : (
              <div className="text-center text-cool-gray">No templates found in this category.</div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Templates;
