import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TemplateCardAdapter } from '@/components/TemplateCardAdapter';
import { AppTemplate } from '@/utils/appTemplates';
import TemplateDetailModal from '@/components/TemplateDetailModal';
import TemplateCategoryFilterAdapter from '@/components/TemplateCategoryFilterAdapter';
import TemplateInquiryForm from '@/components/TemplateInquiryForm';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { useTemplates, Template } from '@/hooks/useTemplates';
import { Package, Star, Rocket, Sparkles, ArrowLeft, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const [showTemplateDetail, setShowTemplateDetail] = useState(false);
  const [showTemplateInquiry, setShowTemplateInquiry] = useState(false);

  // Template handlers
  const getFilteredTemplates = () => {
    if (selectedCategory === 'all') {
      return templates;
    }
    return getTemplatesByCategory(selectedCategory);
  };

  const handleTemplateLearnMore = (template: AppTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateDetail(true);
  };

  const handleTemplateRequest = (template: AppTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateInquiry(true);
  };

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
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-midnight-navy via-royal-purple to-electric-blue overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.08),transparent_50%)] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative">
          {/* Back Link */}
          <div className="mb-8">
            <Link to="/">
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-6 py-3 rounded-full text-white font-medium mb-8 animate-fade-in shadow-elegant border border-white/20">
              <Package className="h-5 w-5 text-coral-orange" />
              Ready-to-Deploy Apps
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 leading-tight">
              Off the Shelf
              <span className="block bg-gradient-to-r from-coral-orange via-emerald-green to-electric-blue bg-clip-text text-transparent mt-2">
                App Templates
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-12 leading-relaxed">
              Professional app templates designed for immediate deployment. Choose from 9 industry-specific solutions 
              with full customization options and professional support.
            </p>
            
            {/* Key Benefits */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-white mb-16">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <Star className="h-5 w-5 text-coral-orange" />
                <span className="font-semibold">Professional Design</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <Rocket className="h-5 w-5 text-emerald-green" />
                <span className="font-semibold">Quick Deployment</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <Sparkles className="h-5 w-5 text-royal-purple" />
                <span className="font-semibold">Full Customization</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <CheckCircle className="h-5 w-5 text-electric-blue" />
                <span className="font-semibold">Ready to Launch</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-white mb-2">{templates.length}</div>
                <div className="text-white/80 font-medium">App Templates</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-white mb-2">{getAllCategories().length}</div>
                <div className="text-white/80 font-medium">Industry Categories</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-white mb-2">72h</div>
                <div className="text-white/80 font-medium">Avg. Delivery Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TemplateCardAdapter
                  template={template}
                  onLearnMore={handleTemplateLearnMore}
                  onRequestTemplate={handleTemplateRequest}
                />
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-card p-8 rounded-3xl border border-soft-lilac/30 max-w-4xl mx-auto">
              <h3 className="text-3xl font-heading font-bold text-midnight-navy mb-4">
                Don't See What You Need?
              </h3>
              <p className="text-xl text-cool-gray mb-6">
                We can create a custom app template specifically for your industry or use case.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button variant="premium" size="lg">
                    <Users className="h-5 w-5 mr-2" />
                    Request Custom Template
                  </Button>
                </Link>
                <Link to="/custom-builds">
                  <Button variant="outline" size="lg">
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

      {/* Template Modals */}
      <TemplateDetailModal
        template={selectedTemplate}
        isOpen={showTemplateDetail}
        onClose={() => setShowTemplateDetail(false)}
        onRequestTemplate={handleTemplateRequest}
      />
      
      <TemplateInquiryForm
        template={selectedTemplate}
        isOpen={showTemplateInquiry}
        onClose={() => setShowTemplateInquiry(false)}
      />
    </div>
  );
};

export default Templates;