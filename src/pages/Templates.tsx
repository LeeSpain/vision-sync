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
import { Package, Star, Rocket, Sparkles, ArrowRight, CheckCircle, TrendingUp, Users, Zap, Shield, Clock, Code, Palette, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analytics } from '@/utils/analytics';
import heroImage from '@/assets/hero-templates-visualization.jpg';

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
    analytics.trackInteraction('button_click', 'template_category', category);
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
        canonical="https://www.vision-sync.co/templates"
        ogImage="https://www.vision-sync.co/og-images/templates.jpg"
        structuredData={[
          generateOrganizationSchema(),
          generateWebPageSchema({
            name: "Professional App Templates",
            description: "Explore professional app templates for various industries",
            url: "https://www.vision-sync.co/templates"
          })
        ]}
      />
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-royal-purple/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-green/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left: Content */}
            <div className="text-center lg:text-left animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-primary px-4 py-1.5 rounded-full text-white text-sm font-medium mb-5 shadow-glow animate-scale-in">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                Ready-to-Deploy Solutions
              </div>
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-midnight-navy mb-5 leading-tight animate-slide-up">
                Professional App{' '}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Templates
                </span>
              </h1>
              
              {/* Description */}
              <p className="text-base md:text-lg text-cool-gray mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in" style={{animationDelay: '0.2s'}}>
                Choose from <span className="text-royal-purple font-semibold">{templates.length} industry-specific solutions</span>, 
                customize with your branding, and launch in <span className="text-emerald-green font-semibold">72 hours</span> or less.
              </p>

              {/* Trust Indicators - Horizontal */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-6 animate-fade-in" style={{animationDelay: '0.25s'}}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-green" />
                  <span className="text-sm text-midnight-navy">Expertly Designed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-royal-purple" />
                  <span className="text-sm text-midnight-navy">Secure & Reliable</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-coral-orange" />
                  <span className="text-sm text-midnight-navy">Instant Deployment</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start animate-fade-in" style={{animationDelay: '0.3s'}}>
                <Link to="/template-finder">
                  <Button variant="hero" size="lg" className="hover-scale shadow-glow">
                    <Rocket className="h-5 w-5" />
                    Find My Template
                    <ArrowRight className="h-5 w-5" />
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

            {/* Right: Hero Image */}
            <div className="relative animate-fade-in hidden lg:block" style={{animationDelay: '0.3s'}}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-soft-lilac/20">
                <img 
                  src={heroImage} 
                  alt="Collection of professional app templates displayed on multiple devices"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-royal-purple/10 via-transparent to-emerald-green/10"></div>
              </div>
              
              {/* Floating Badge: Templates Count */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 animate-float border border-soft-lilac/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-green/10 rounded-lg flex items-center justify-center">
                    <Package className="h-4 w-4 text-emerald-green" />
                  </div>
                  <div>
                    <p className="text-xs text-cool-gray">Templates</p>
                    <p className="text-sm font-bold text-midnight-navy">{templates.length}+ Ready</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Badge: Deploy Time */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 animate-float border border-soft-lilac/20" style={{animationDelay: '1s'}}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-royal-purple/10 rounded-lg flex items-center justify-center">
                    <Rocket className="h-4 w-4 text-royal-purple" />
                  </div>
                  <div>
                    <p className="text-xs text-cool-gray">Deploy in</p>
                    <p className="text-sm font-bold text-midnight-navy">72 Hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <TemplateCategoryFilterAdapter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            availableCategories={categories}
            templateCounts={getTemplateCounts()}
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
              displayedTemplates.map((template: Template) => (
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
