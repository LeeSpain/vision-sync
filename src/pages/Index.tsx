import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import SEOHead from '@/components/SEOHead';
import { generateOrganizationSchema, generateWebPageSchema } from '@/utils/structuredData';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Network, CheckCircle, Brain, Workflow, Loader2, Bot, Zap, Briefcase, MessageSquare, BarChart3 } from 'lucide-react';
import CustomQuoteModal from '@/components/CustomQuoteModal';
import { useTranslation } from 'react-i18next';
import { usePricing } from '@/hooks/usePricing';
import { Hero, GradientText, CTAGroup, SectionHeading, FeatureCard, DarkBand, SectionDivider } from '@/components/ui-system';
import { HeroChatCard } from '@/components/home/HeroChatCard';

export default function Index() {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [sections, setSections] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  // Industry cards source: published DB pricing, with automatic static fallback
  // (seeded with the static list, so the grid renders immediately — no empty flash).
  const { industries } = usePricing();

  useEffect(() => {
    const fetchData = async () => {
      const [sectionsRes, modulesRes] = await Promise.all([
        supabase.from('page_sections').select('*').eq('page_key', 'homepage').eq('is_active', true).order('sort_order', { ascending: true }),
        supabase.from('modules').select('*').eq('is_active', true).order('sort_order', { ascending: true }).limit(6)
      ]);

      if (sectionsRes.data && sectionsRes.data.length > 0) {
        setSections(sectionsRes.data);
      }
      if (modulesRes.data) setModules(modulesRes.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Helper to extract a section by key or provide a fallback
  const getSection = (key: string, fallbackTitle: string, fallbackContent: string) => {
    const s = sections.find(sec => sec.section_key === key);
    return {
      title: s?.title || fallbackTitle,
      content: s?.content || fallbackContent,
      ctaLabel: s?.cta_label,
      ctaLink: s?.cta_link
    };
  };

  const hero = getSection('hero-area', 'Premium AI Automation For Your Business', 'Vision-Sync is a modular AI platform providing complete control over your business infrastructure. From intelligent sales systems to automated CRM and communications, we build systems that scale.');
  const overview = getSection('platform-overview', 'Intelligence, Automation, and Complete Control', 'Vision-Sync goes beyond generic tools. We help businesses design and deploy tailored AI-powered systems. Our modular architecture means you only use what you need, with the power to scale endlessly.');
  const finalCta = getSection('final-cta', t('index.finalCtaTitle'), t('index.finalCtaContent'));

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Vision-Sync | Premium AI Automation Platform"
        description="Vision-Sync provides modular AI systems, automation infrastructure, business workflows, communications, CRM, analytics, and sales systems for enterprises."
        keywords="AI automation, business systems, CRM, workflow automation, AI agents, enterprise AI"
        canonical="https://www.vision-sync.co/"
        structuredData={[
          generateOrganizationSchema(),
          generateWebPageSchema({
            name: "Vision-Sync | Premium AI Automation Platform",
            description: "Modular AI systems and automation infrastructure for businesses.",
            url: "https://www.vision-sync.co/"
          })
        ]}
      />
      <Header />

      {/* Hero Section — product proof (Concept 1) */}
      <Hero
        eyebrow={{ icon: Sparkles, label: t('index.enterpriseInfrastructure') }}
        title={hero.title.split(' For Your Business')[0]}
        highlight={hero.title.includes('For Your Business') ? 'For Your Business' : undefined}
        subtitle={hero.content}
        primaryCta={{ label: hero.ctaLabel || t('index.requestDemo'), onClick: () => setShowQuoteModal(true) }}
        secondaryCta={{ label: t('index.explorePlatform'), href: hero.ctaLink || '/platform', icon: Network }}
        footnote={t('index.heroTrust')}
        media={
          <>
            <HeroChatCard />
            <div
              className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-soft-lilac/30 bg-slate-white px-5 py-4 shadow-card animate-float motion-reduce:animate-none sm:block"
              style={{ animationDelay: '0.6s' }}
            >
              <p className="font-heading text-3xl font-bold leading-none">
                <GradientText>{t('index.heroChat.statValue')}</GradientText>
              </p>
              <p className="mt-1 text-xs font-medium text-cool-gray">{t('index.heroChat.statLabel')}</p>
            </div>
          </>
        }
      />

      {/* Platform Overview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeading
                align="left"
                eyebrow={t('index.platformOverview')}
                eyebrowIcon={Brain}
                title={overview.title}
                subtitle={overview.content}
                className="mb-8"
              />
              <ul className="space-y-4">
                {[t('index.modularArchitecture'), t('index.seamlessAutomation'), t('index.predictiveIntelligence'), t('index.granularControl')].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-midnight-navy font-medium">
                    <CheckCircle className="h-6 w-6 text-emerald-green" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative isolate">
              <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-emerald-green/20 to-royal-purple/20 blur-3xl opacity-50 rounded-full"></div>
              <div className="aspect-square grid grid-cols-2 gap-4 w-full h-full">
                <div className="rounded-2xl shadow-lg border border-soft-lilac/20 overflow-hidden relative group">
                  <img src="/images/platform_ai_brain.png" alt="AI Neural Network" className="object-cover w-full h-full transform transition duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/90 via-midnight-navy/20 to-transparent opacity-90 transition-opacity group-hover:opacity-80"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white font-medium text-sm flex items-center">
                    <Brain className="h-4 w-4 mr-2 text-emerald-green" />
                    {t('index.cognitiveEngine')}
                  </div>
                </div>
                <div className="rounded-2xl shadow-lg border border-soft-lilac/20 overflow-hidden relative group">
                  <img src="/images/platform_workflow.png" alt="Data Pipeline Workflow" className="object-cover w-full h-full transform transition duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/90 via-midnight-navy/20 to-transparent opacity-90 transition-opacity group-hover:opacity-80"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white font-medium text-sm flex items-center">
                    <Workflow className="h-4 w-4 mr-2 text-emerald-green" />
                    {t('index.automatedFlows')}
                  </div>
                </div>
                <div className="rounded-2xl shadow-lg border border-soft-lilac/20 overflow-hidden relative col-span-2 group">
                  <img src="/images/platform_network.png" alt="Global Network Orchestration" className="object-cover w-full h-full transform transition duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/90 via-midnight-navy/20 to-transparent opacity-90 transition-opacity group-hover:opacity-80"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white font-medium text-lg flex items-center">
                    <Network className="h-6 w-6 mr-3 text-emerald-green" />
                    {t('index.globalOrchestration')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider className="mx-auto max-w-7xl" />

      {/* Industry Selector Section */}
      <section id="industries" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            className="mb-16"
            eyebrow="Your Industry"
            eyebrowIcon={Briefcase}
            title="What type of business"
            highlight="are you?"
            subtitle="Pick your industry and we'll show you exactly what Vision-Sync can do for you."
          />
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-stretch">
            {industries.map((industry) => (
              <FeatureCard
                key={industry.slug}
                href={`/solutions/${industry.slug}`}
                ctaLabel={t('index.seeHowItWorks')}
                icon={Briefcase}
                title={industry.name}
                body={industry.painStatement}
              />
            ))}
          </div>
        </div>
      </section>

      <SectionDivider className="mx-auto max-w-7xl" />

      {/* Dynamic Sections Loop (Middle Sections) */}
      {sections.filter(s => !['hero-area', 'platform-overview', 'final-cta'].includes(s.section_key)).map((sec) => (
        <section key={sec.id} className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-soft-lilac/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <SectionHeading title={sec.title} className="mb-6" />
              <div className="prose prose-lg prose-slate mx-auto text-cool-gray">
                {sec.content?.split('\n').map((paragraph: string, i: number) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              {sec.cta_label && sec.cta_link && (
                <CTAGroup className="mt-8 justify-center" primary={{ label: sec.cta_label, href: sec.cta_link }} />
              )}
            </div>
          </div>
        </section>
      ))}

      {/* Core Modules (Dynamic) */}
      {modules.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-soft-lilac/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-electric-blue/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              className="mb-16"
              eyebrow={t('index.modularArchitecture')}
              eyebrowIcon={Zap}
              title={t('index.coreModules')}
              subtitle={t('index.selectModulesDesc')}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {modules.map((mod: any) => (
                <FeatureCard
                  key={mod.id}
                  href="/modules"
                  ctaLabel={t('index.exploreModule')}
                  icon={Zap}
                  title={mod.name}
                  body={mod.short_description}
                />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button asChild variant="outline" size="lg" className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white">
                <Link to="/modules">{t('index.viewCatalog')}</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA — the one intentional dark band */}
      <DarkBand className="py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            {finalCta.title}
          </h2>
          <p className="text-xl text-white/80 mb-10 leading-relaxed">
            {finalCta.content}
          </p>
          <CTAGroup
            className="justify-center text-midnight-navy"
            primary={{ label: finalCta.ctaLabel || t('index.requestBlueprint'), onClick: () => setShowQuoteModal(true) }}
            secondary={{ label: t('index.viewPricing'), href: finalCta.ctaLink || '/pricing' }}
          />
        </div>
      </DarkBand>

      <Footer />
      <CustomQuoteModal open={showQuoteModal} onOpenChange={setShowQuoteModal} />
    </div>
  );
}
