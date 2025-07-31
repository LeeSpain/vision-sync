import { useState } from 'react';
import { Button } from '@/components/ui/button';
import TemplateCard from '@/components/TemplateCard';
import TemplateDetailModal from '@/components/TemplateDetailModal';
import TemplateCategoryFilter from '@/components/TemplateCategoryFilter';
import TemplateInquiryForm from '@/components/TemplateInquiryForm';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { appTemplates, getTemplatesByCategory, getAllCategories, TemplateCategory, AppTemplate } from '@/utils/appTemplates';
import { Package, Star, Rocket, Sparkles, ArrowLeft, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Templates = () => {
  // Template state
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<AppTemplate | null>(null);
  const [showTemplateDetail, setShowTemplateDetail] = useState(false);
  const [showTemplateInquiry, setShowTemplateInquiry] = useState(false);

  // Template handlers
  const getFilteredTemplates = () => {
    if (selectedCategory === 'all') {
      return appTemplates;
    }
    return getTemplatesByCategory(selectedCategory);
  };

  const getTemplateCounts = () => {
    const counts: Partial<Record<TemplateCategory | 'all', number>> = {
      all: appTemplates.length
    };
    getAllCategories().forEach(category => {
      counts[category] = getTemplatesByCategory(category).length;
    });
    return counts;
  };

  const handleTemplateLearnMore = (template: AppTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateDetail(true);
  };

  const handleTemplateRequest = (template: AppTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateInquiry(true);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-7xl mx-auto">
          {/* Back Link */}
          <div className="mb-8">
            <Link to="/">
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-primary px-6 py-2 rounded-full text-white font-medium mb-6 animate-fade-in shadow-glow">
              <Package className="h-4 w-4" />
              Ready-to-Deploy Apps
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6">
              Off the Shelf
              <span className="block bg-gradient-to-r from-coral-orange to-emerald-green bg-clip-text text-transparent">
                App Templates
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto mb-8">
              Professional app templates designed for immediate deployment. Choose from 9 industry-specific solutions 
              with full customization options and professional support.
            </p>
            
            {/* Key Benefits */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/90 mb-12">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-coral-orange" />
                <span className="font-medium">Professional Design</span>
              </div>
              <div className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-emerald-green" />
                <span className="font-medium">Quick Deployment</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-royal-purple" />
                <span className="font-medium">Full Customization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-electric-blue" />
                <span className="font-medium">Ready to Launch</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">9</div>
                <div className="text-white/70">App Templates</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">3</div>
                <div className="text-white/70">Industry Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">72h</div>
                <div className="text-white/70">Avg. Delivery Time</div>
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
            <TemplateCategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              templateCounts={getTemplateCounts()}
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
                <TemplateCard
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