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
  const [showCustomizationFlow, setShowCustomizationFlow] = useState(false);

  // Track page view
  useEffect(() => {
    analytics.trackPageView('/templates');
  }, []);

  // Template handlers
  const getFilteredTemplates = () => {
    if (selectedCategory === 'all') {
      return templates;
    }
    return getTemplatesByCategory(selectedCategory);
  };

  const handleTemplateCustomize = (template: AppTemplate) => {
    analytics.trackInteraction('button_click', 'template_customize', template.id);
    setSelectedTemplate(template);
    setShowCustomizationFlow(true);
  };

  const handleTemplateRequest = handleTemplateCustomize;

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-purple mx-auto mb-4"></div>
            <p className="text-cool-gray">Loading templates...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-coral-orange mb-4">{error}</p>
            <p className="text-cool-gray">Please try again later.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <SEOHead
        title="App Templates | Ready-to-Deploy Solutions - Vision-Sync Forge"
        description={`Browse ${templates.length}+ professional app templates ready for instant customization. Industry-specific solutions for healthcare, e-commerce, real estate, and more. Deploy in 72 hours.`}
        keywords="app templates, ready-made applications, SaaS templates, web app templates, mobile app templates, industry solutions"
        canonical="https://vision-sync-forge.lovable.app/templates"
        ogImage="https://vision-sync-forge.lovable.app/favicon.png"
        structuredData={[
          generateOrganizationSchema(),
          generateWebPageSchema({
            name: "App Templates - Vision-Sync Forge",
            description: `Professional app templates ready for instant deployment across ${getAllCategories().length} industry categories`,
            url: "https://vision-sync-forge.lovable.app/templates"
          })
        ]}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Animation */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-green/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-royal-purple/10 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
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
            <div className="flex flex-wrap items-center justify-center gap-6 text-midnight-navy mb-16 animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-green" />
                <span className="font-medium">Live Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-royal-purple" />
                <span className="font-medium">Secure & Tested</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-coral-orange" />
                <span className="font-medium">Quick Deploy</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-electric-blue" />
                <span className="font-medium">Premium Quality</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <Card className="bg-gradient-card border-soft-lilac/30 shadow-card hover:shadow-hover transition-all duration-300 animate-slide-up" style={{animationDelay: '0.4s'}}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-emerald-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="h-6 w-6 text-emerald-green" />
                  </div>
                  <div className="text-4xl font-bold text-midnight-navy mb-1">{templates.length}</div>
                  <div className="text-cool-gray font-medium">Templates Available</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card border-soft-lilac/30 shadow-card hover:shadow-hover transition-all duration-300 animate-slide-up" style={{animationDelay: '0.5s'}}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-royal-purple/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Globe className="h-6 w-6 text-royal-purple" />
                  </div>
                  <div className="text-4xl font-bold text-midnight-navy mb-1">{getAllCategories().length}</div>
                  <div className="text-cool-gray font-medium">Industry Categories</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-card border-soft-lilac/30 shadow-card hover:shadow-hover transition-all duration-300 animate-slide-up" style={{animationDelay: '0.6s'}}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-coral-orange/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-6 w-6 text-coral-orange" />
                  </div>
                  <div className="text-4xl font-bold text-midnight-navy mb-1">72h</div>
                  <div className="text-cool-gray font-medium">Average Delivery</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-midnight-navy/5 via-royal-purple/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-midnight-navy mb-4">
              How It Works
            </h2>
            <p className="text-xl text-cool-gray max-w-2xl mx-auto">
              From selection to deployment in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="bg-gradient-card border-soft-lilac/30 shadow-card hover:shadow-hover transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-glow">
                  1
                </div>
                <Palette className="h-8 w-8 text-royal-purple mx-auto mb-3" />
                <h3 className="font-heading font-semibold text-midnight-navy mb-2">Choose Template</h3>
                <p className="text-cool-gray text-sm">Browse and select the perfect template for your needs</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-soft-lilac/30 shadow-card hover:shadow-hover transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-glow">
                  2
                </div>
                <Sparkles className="h-8 w-8 text-emerald-green mx-auto mb-3" />
                <h3 className="font-heading font-semibold text-midnight-navy mb-2">Customize</h3>
                <p className="text-cool-gray text-sm">Add your branding, content, and unique features</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-soft-lilac/30 shadow-card hover:shadow-hover transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-glow">
                  3
                </div>
                <Code className="h-8 w-8 text-coral-orange mx-auto mb-3" />
                <h3 className="font-heading font-semibold text-midnight-navy mb-2">Review</h3>
                <p className="text-cool-gray text-sm">Preview your customized app before launch</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-soft-lilac/30 shadow-card hover:shadow-hover transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-glow">
                  4
                </div>
                <Rocket className="h-8 w-8 text-electric-blue mx-auto mb-3" />
                <h3 className="font-heading font-semibold text-midnight-navy mb-2">Launch</h3>
                <p className="text-cool-gray text-sm">Deploy your app and start growing your business</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-midnight-navy mb-4">
              Browse Our Templates
            </h2>
            <p className="text-xl text-cool-gray max-w-2xl mx-auto">
              Filter by industry to find the perfect solution for your business
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-12">
            <TemplateCategoryFilterAdapter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              templateCounts={getTemplateCounts()}
              availableCategories={getAllCategories()}
            />
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getFilteredTemplates().map((template, index) => (
              <div
                key={template.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <TemplateCardAdapter
                  template={template}
                  onLearnMore={handleTemplateCustomize}
                  onRequestTemplate={handleTemplateRequest}
                />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {getFilteredTemplates().length === 0 && (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-cool-gray mx-auto mb-4 opacity-50" />
              <h3 className="text-2xl font-heading font-semibold text-midnight-navy mb-2">
                No templates found
              </h3>
              <p className="text-cool-gray mb-6">
                Try selecting a different category or browse all templates
              </p>
              <Button onClick={() => setSelectedCategory('all')} variant="outline">
                View All Templates
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-royal-purple/5 via-emerald-green/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-midnight-navy mb-4">
              Why Choose Our Templates
            </h2>
            <p className="text-xl text-cool-gray max-w-2xl mx-auto">
              Built with best practices and enterprise-grade quality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gradient-card border-soft-lilac/30 shadow-card hover:shadow-hover transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-royal-purple/10 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-royal-purple" />
                </div>
                <h3 className="font-heading font-semibold text-midnight-navy mb-2 text-lg">Professional Design</h3>
                <p className="text-cool-gray">Modern, responsive designs that work flawlessly on all devices</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-soft-lilac/30 shadow-card hover:shadow-hover transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-emerald-green/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-emerald-green" />
                </div>
                <h3 className="font-heading font-semibold text-midnight-navy mb-2 text-lg">Secure & Reliable</h3>
                <p className="text-cool-gray">Built with security best practices and thoroughly tested</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-soft-lilac/30 shadow-card hover:shadow-hover transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-coral-orange/10 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-coral-orange" />
                </div>
                <h3 className="font-heading font-semibold text-midnight-navy mb-2 text-lg">Lightning Fast</h3>
                <p className="text-cool-gray">Optimized for performance with lightning-fast load times</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-soft-lilac/30 shadow-card hover:shadow-hover transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-electric-blue/10 rounded-full flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-electric-blue" />
                </div>
                <h3 className="font-heading font-semibold text-midnight-navy mb-2 text-lg">Clean Code</h3>
                <p className="text-cool-gray">Well-documented, maintainable code following industry standards</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-soft-lilac/30 shadow-card hover:shadow-hover transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-royal-purple/10 rounded-full flex items-center justify-center mb-4">
                  <Palette className="h-6 w-6 text-royal-purple" />
                </div>
                <h3 className="font-heading font-semibold text-midnight-navy mb-2 text-lg">Fully Customizable</h3>
                <p className="text-cool-gray">Easy to customize with your brand colors, content, and features</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-soft-lilac/30 shadow-card hover:shadow-hover transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-emerald-green/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-emerald-green" />
                </div>
                <h3 className="font-heading font-semibold text-midnight-navy mb-2 text-lg">Expert Support</h3>
                <p className="text-cool-gray">Dedicated support team to help you succeed</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-midnight-navy via-royal-purple to-electric-blue rounded-3xl p-12 shadow-glow">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none"></div>
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
            
            <div className="relative text-center">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
                Need Something Unique?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                Can't find the perfect template? We'll create a custom solution specifically for your business needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button variant="secondary" size="lg" className="bg-white text-midnight-navy hover:bg-white/90 shadow-elegant">
                    <Users className="h-5 w-5 mr-2" />
                    Request Custom Template
                  </Button>
                </Link>
                <Link to="/custom-builds">
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Explore Custom Builds
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Template Customization Flow */}
      <TemplateCustomizationFlow
        template={selectedTemplate}
        isOpen={showCustomizationFlow}
        onClose={() => setShowCustomizationFlow(false)}
      />
    </div>
  );
};

export default Templates;