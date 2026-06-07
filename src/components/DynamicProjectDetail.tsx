import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Project, projectManager } from '@/utils/projectManager';
import { ProjectPageTemplate } from '@/components/project-template';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DarkBand, SectionHeading, CTAGroup } from '@/components/ui-system';
import WebsitePreview from '@/components/WebsitePreview';
import ProjectInquiryForm from '@/components/ProjectInquiryForm';
import { analytics } from '@/utils/analytics';
import { PricingDisplay } from '@/components/ui/pricing-display';
import { InvestmentPricingDisplay } from '@/components/ui/investment-pricing-display';
import { PricingToggle } from '@/components/ui/pricing-toggle';
import { useCurrency } from '@/contexts/CurrencyContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import InvestmentSection from '@/components/project-template/InvestmentSection';
import SEOHead from '@/components/SEOHead';
import { generateOrganizationSchema, generateWebPageSchema, generateProductSchema } from '@/utils/structuredData';

export default function DynamicProjectDetail() {
  const { projectRoute } = useParams<{ projectRoute: string }>();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  const { t } = useTranslation();
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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6 pt-12">
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
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <main className="flex flex-grow items-center justify-center px-4 py-24">
          <div className="mx-auto max-w-md text-center">
            <h1 className="mb-3 font-heading text-3xl font-bold text-midnight-navy">
              {error || t('projectPage.notFoundTitle')}
            </h1>
            <p className="mb-8 text-cool-gray">
              {t('projectPage.notFoundDesc')}
            </p>
            <CTAGroup
              className="justify-center"
              primary={{ label: t('projectPage.returnHome'), href: '/' }}
              secondary={{ label: t('projectPage.goAdmin'), href: '/admin' }}
            />
          </div>
        </main>
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
      <SEOHead
        title={`${project.title} | ${isInvestmentProject ? 'Investment Opportunity' : 'For Sale'} - Vision-Sync Forge`}
        description={introText || project.description?.substring(0, 160) || `Discover ${project.title} - ${project.category} project available for ${isInvestmentProject ? 'investment' : 'purchase'}.`}
        keywords={`${project.title}, ${project.category}, ${isInvestmentProject ? 'investment opportunity' : 'platform for sale'}, ${project.technologies?.join(', ') || ''}`}
        canonical={`https://www.vision-sync.co${project.route}`}
        ogImage={project.image_url || undefined}
        structuredData={[
          generateOrganizationSchema(),
          generateWebPageSchema({
            name: project.title,
            description: introText || project.description || '',
            url: `https://www.vision-sync.co${project.route}`
          }),
          ...(project.price || project.investment_amount ? [generateProductSchema({
            name: project.title,
            description: introText || project.description || '',
            image: project.image_url,
            price: (project.price || project.investment_amount || 0).toString(),
            currency: 'USD',
            availability: project.status === 'active' ? 'InStock' : 'OutOfStock'
          })] : [])
        ]}
      />
      <ProjectPageTemplate>
        {/* Clean Hero Section */}
        <DarkBand className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in motion-reduce:animate-none">
              <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 tracking-tight">
                {project.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                {introText}
              </p>
            </div>
          </div>
        </DarkBand>

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
                showInvestmentTiers={false}
                investmentPercentage={project.investment_percentage}
              />
            </div>
          </section>
        )}

        {/* Visit Live Site Section */}
      {project.demo_url && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="rounded-3xl border border-soft-lilac/30 bg-gradient-to-br from-soft-lilac/20 to-slate-white p-8 shadow-card">
              <h3 className="text-2xl font-bold text-midnight-navy mb-4 font-heading">
                {t('projectPage.liveTitle')}
              </h3>
              <p className="text-cool-gray mb-6 text-lg">
                {t('projectPage.liveDesc')}
              </p>
              <CTAGroup
                className="justify-center"
                primary={{
                  label: t('projectPage.visitLive'),
                  onClick: () => {
                    analytics.trackInteraction('button_click', 'visit_live_site_button', project.id);
                    setShowLiveSiteModal(true);
                  },
                }}
                secondary={{
                  label: t('projectPage.contactProject'),
                  onClick: () => {
                    analytics.trackInteraction('button_click', 'contact_button', project.id);
                    setShowInquiryForm(true);
                  },
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* CTA Section for projects without demo */}
      {!project.demo_url && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="rounded-3xl border border-soft-lilac/30 bg-gradient-to-br from-soft-lilac/20 to-slate-white p-8 shadow-card">
              <h3 className="text-2xl font-bold text-midnight-navy mb-4 font-heading">
                {t('projectPage.interestedTitle')}
              </h3>
              <p className="text-cool-gray mb-6 text-lg">
                {t('projectPage.interestedDesc')}
              </p>
              <CTAGroup
                className="justify-center"
                primary={{
                  label: t('projectPage.contactUs'),
                  onClick: () => {
                    analytics.trackInteraction('button_click', 'contact_button', project.id);
                    setShowInquiryForm(true);
                  },
                }}
              />
            </div>
          </div>
        </section>
      )}


      {/* Pricing Section for For Sale / Purchase Projects */}
      {!isInvestmentProject && !isPlatformForSale && (project.price || project.subscription_price) && (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-soft-lilac/20 to-slate-white">
          <div className="container max-w-4xl">
            <SectionHeading
              title={isForSaleProject ? t('projectPage.purchaseOptions') : t('projectPage.pricingInvestment')}
              subtitle={t('projectPage.chooseOption')}
              className="mb-12"
            />

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
            <SectionHeading
              title={t('projectPage.previewTitle')}
              subtitle={t('projectPage.previewDesc')}
              className="mb-12"
            />
            <div className="bg-white rounded-2xl shadow-card p-8">
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
          <SectionHeading title={t('projectPage.aboutTitle')} className="mb-16" />

          <div className="bg-white rounded-xl p-8 shadow-card">
            <div className="space-y-6">
              {/* Full Description */}
              <div>
                <h3 className="text-2xl font-bold text-midnight-navy mb-4 font-heading">
                  {t('projectPage.description')}
                </h3>
                <div className="text-cool-gray leading-relaxed text-lg whitespace-pre-line">
                  {project.description}
                </div>
              </div>

              {/* Project Details */}
              <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-white">
                {project.category && (
                  <div>
                    <h4 className="text-lg font-semibold text-midnight-navy mb-2">{t('projectPage.category')}</h4>
                    <p className="text-cool-gray">{project.category}</p>
                  </div>
                )}

                {project.pricing && (
                  <div>
                    <h4 className="text-lg font-semibold text-midnight-navy mb-2">{t('projectPage.pricing')}</h4>
                    <p className="text-cool-gray">
                      {typeof project.pricing === 'object' 
                        ? JSON.stringify(project.pricing, null, 2) 
                        : project.pricing}
                    </p>
                  </div>
                )}
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="md:col-span-2">
                    <h4 className="text-lg font-semibold text-midnight-navy mb-2">{t('projectPage.technologies')}</h4>
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
              <div className="flex items-center justify-between px-6 py-4 border-b border-soft-lilac/20 bg-slate-white">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-emerald-green animate-pulse motion-reduce:animate-none" />
                  <h3 className="text-lg font-semibold text-midnight-navy">
                    {project.title} - {t('projectPage.livePreviewSuffix')}
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
