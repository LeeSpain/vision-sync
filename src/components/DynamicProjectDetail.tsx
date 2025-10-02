import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Project, projectManager } from '@/utils/projectManager';
import { ProjectPageTemplate } from '@/components/project-template';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { ArrowLeft, ExternalLink, X } from 'lucide-react';
import WebsitePreview from '@/components/WebsitePreview';
import ProjectInquiryForm from '@/components/ProjectInquiryForm';
import { analytics } from '@/utils/analytics';
import { PricingDisplay } from '@/components/ui/pricing-display';
import { InvestmentPricingDisplay } from '@/components/ui/investment-pricing-display';
import { PricingToggle } from '@/components/ui/pricing-toggle';
import { useCurrency } from '@/contexts/CurrencyContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import InvestmentSection from '@/components/project-template/InvestmentSection';

export default function DynamicProjectDetail() {
  const { projectRoute } = useParams<{ projectRoute: string }>();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showLiveSiteModal, setShowLiveSiteModal] = useState(false);
  const [isSubscription, setIsSubscription] = useState(true);
  
  const isInvestmentProject = project?.content_section?.includes('investment-opportunities');
  const isForSaleProject = project?.content_section?.includes('platforms-for-sale');

  useEffect(() => {
    loadProject();
  }, [projectRoute, location.pathname]);

  const loadProject = async () => {
    const routeFromParam = projectRoute;
    const routeFromPath = location.pathname.replace(/^\//, '');
    const effectiveRoute = routeFromParam || routeFromPath;

    try {
      setLoading(true);
      setError(null);

      // Try to find project by route first, then by generated route from title
      const allProjects = await projectManager.getAllProjects();
      const foundProject = allProjects.find(p =>
        p.route === `/${effectiveRoute}` ||
        p.route === effectiveRoute ||
        p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === effectiveRoute
      );

      if (foundProject) {
        setProject(foundProject);
        // Track project view with analytics
        analytics.trackProjectView(foundProject.id, foundProject.title);
      } else {
        setError('Project not found');
      }
    } catch (err) {
      console.error('Error loading project:', err);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-royal-purple via-electric-blue to-emerald-green">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-royal-purple via-electric-blue to-emerald-green">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-destructive">
                {error || 'Project Not Found'}
              </CardTitle>
              <CardDescription>
                The project you're looking for doesn't exist or has been moved.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Link to="/">
                  <Button variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Return Home
                  </Button>
                </Link>
                <Link to="/admin">
                  <Button>
                    Go to Admin
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Simple content extraction for clean display
  const getIntroText = (description: string) => {
    if (!description) return '';
    const paragraphs = description.split('\n\n');
    return paragraphs[0] || '';
  };

  const introText = getIntroText(project.description || '');
  
  // Check if this is a "Platforms for Sale" product
  const isPlatformForSale = project.content_section?.includes('platforms-for-sale');

  return (
    <CurrencyProvider>
      <ProjectPageTemplate>
        {/* Clean Hero Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-royal-purple via-electric-blue to-emerald-green">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 tracking-tight">
                {project.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                {introText}
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section - Only for Platforms for Sale */}
        {isPlatformForSale && (project.price || project.subscription_price) && (
          <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-white">
            <div className="max-w-4xl mx-auto">
              <PricingDisplay
                salePrice={project.price || 0}
                customizationPrice={project.deposit_amount || 0}
                maintenanceFee={(project as any).maintenance_fee}
                isSubscription={project.billing_type === 'subscription'}
                onToggle={() => {}}
                showToggle={false}
              />
            </div>
          </section>
        )}

        {/* Investment Pricing Section - Only for Investment Projects */}
        {isInvestmentProject && (
          <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-white">
            <div className="max-w-4xl mx-auto">
              <InvestmentPricingDisplay
                investmentAmount={project.investment_amount}
                fundingProgress={project.funding_progress}
                investmentReceived={(project.investment_amount || 0) * ((project.funding_progress || 0) / 100)}
                expectedRoi={project.expected_roi}
                investmentDeadline={project.investment_deadline}
                investorCount={project.investor_count}
                onInvestClick={() => setShowInquiryForm(true)}
                showInvestmentTiers={true}
              />
            </div>
          </section>
        )}

        {/* Visit Live Site Section */}
      {project.demo_url && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-emerald-green/10 to-electric-blue/10 rounded-xl p-8 border border-emerald-green/20">
              <h3 className="text-2xl font-bold text-midnight-navy mb-4 font-heading">
                Experience the Live Platform
              </h3>
              <p className="text-cool-gray mb-6 text-lg">
                Ready to explore? Visit the live site and see it in action.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => {
                    analytics.trackInteraction('button_click', 'visit_live_site_button', project.id);
                    setShowLiveSiteModal(true);
                  }}
                  className="bg-emerald-green hover:bg-emerald-green/90 text-white px-8 py-3 text-lg font-semibold"
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Visit Live Site
                </Button>
                <Button 
                  onClick={() => {
                    analytics.trackInteraction('button_click', 'contact_button', project.id);
                    setShowInquiryForm(true);
                  }}
                  variant="outline"
                  className="px-8 py-3 text-lg font-semibold"
                >
                  Contact Us About This Project
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section for projects without demo */}
      {!project.demo_url && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-royal-purple/10 to-electric-blue/10 rounded-xl p-8 border border-royal-purple/20">
              <h3 className="text-2xl font-bold text-midnight-navy mb-4 font-heading">
                Interested in This Project?
              </h3>
              <p className="text-cool-gray mb-6 text-lg">
                Get in touch to learn more about investment opportunities or purchase options.
              </p>
              <Button 
                onClick={() => {
                  analytics.trackInteraction('button_click', 'contact_button', project.id);
                  setShowInquiryForm(true);
                }}
                className="bg-royal-purple hover:bg-royal-purple/90 text-white px-8 py-3 text-lg font-semibold"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      )}


      {/* Pricing Section for For Sale / Purchase Projects */}
      {!isInvestmentProject && !isPlatformForSale && (project.price || project.subscription_price) && (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-soft-lilac/20 to-slate-white">
          <div className="container max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-midnight-navy mb-4 font-heading">
                {isForSaleProject ? 'Purchase Options' : 'Pricing & Investment'}
              </h2>
              <p className="text-cool-gray text-lg">
                Choose the option that works best for you
              </p>
            </div>

            {(project.billing_type === 'deposit-subscription' || 
              project.subscription_price) && (
              <div className="mb-8 flex justify-center">
                <PricingToggle
                  isSubscription={isSubscription}
                  onToggle={setIsSubscription}
                />
              </div>
            )}

            <PricingDisplay
              salePrice={project.deposit_amount || project.price || 0}
              customizationPrice={project.price}
              maintenanceFee={project.maintenance_fee}
              isSubscription={isSubscription}
              onToggle={setIsSubscription}
              showToggle={false}
            />
          </div>
        </section>
      )}

      {/* Website Preview Section */}
      {project.demo_url && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-midnight-navy mb-4 font-heading">
                Live Platform Preview
              </h2>
              <p className="text-xl text-cool-gray max-w-2xl mx-auto">
                Experience the platform in action
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-elegant p-8">
              <WebsitePreview 
                url={project.demo_url} 
                title={project.title}
                fallbackImageUrl={project.image_url}
                className="rounded-xl overflow-hidden"
              />
            </div>
          </div>
        </section>
      )}

      {/* About This Project Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-white/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-midnight-navy mb-6 font-heading">
              About This Project
            </h2>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-card">
            <div className="space-y-6">
              {/* Full Description */}
              <div>
                <h3 className="text-2xl font-bold text-midnight-navy mb-4 font-heading">
                  Description
                </h3>
                <div className="text-cool-gray leading-relaxed text-lg whitespace-pre-line">
                  {project.description}
                </div>
              </div>

              {/* Project Details */}
              <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-white">
                {project.category && (
                  <div>
                    <h4 className="text-lg font-semibold text-midnight-navy mb-2">Category</h4>
                    <p className="text-cool-gray">{project.category}</p>
                  </div>
                )}
                
                {project.pricing && (
                  <div>
                    <h4 className="text-lg font-semibold text-midnight-navy mb-2">Pricing</h4>
                    <p className="text-cool-gray">
                      {typeof project.pricing === 'object' 
                        ? JSON.stringify(project.pricing, null, 2) 
                        : project.pricing}
                    </p>
                  </div>
                )}
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="md:col-span-2">
                    <h4 className="text-lg font-semibold text-midnight-navy mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="bg-emerald-green/10 text-emerald-green px-3 py-1 rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

        <ProjectInquiryForm
          projectId={project.id}
          projectName={project.title}
          projectDescription={getIntroText(project.description || '')}
          isOpen={showInquiryForm}
          onClose={() => setShowInquiryForm(false)}
        />

        {/* Full-Screen Live Site Modal */}
        <Dialog open={showLiveSiteModal} onOpenChange={setShowLiveSiteModal}>
          <DialogContent className="max-w-full h-screen w-screen p-0 gap-0 bg-background">
            <div className="flex flex-col h-full">
              {/* Header Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-emerald-green/10 to-electric-blue/10">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-emerald-green animate-pulse" />
                  <h3 className="text-lg font-semibold text-midnight-navy">
                    {project.title} - Live Preview
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowLiveSiteModal(false)}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Full-Screen Iframe */}
              <div className="flex-1 relative bg-white">
                <iframe
                  src={project.demo_url || ''}
                  className="w-full h-full border-0"
                  title={`${project.title} Live Site`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </ProjectPageTemplate>
    </CurrencyProvider>
  );
}
