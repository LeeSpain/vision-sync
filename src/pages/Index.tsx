import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import SEOHead from '@/components/SEOHead';
import { generateOrganizationSchema, generateWebPageSchema } from '@/utils/structuredData';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, Sparkles, Network, CheckCircle, Brain, Workflow, Loader2, Bot, Zap, Briefcase, MessageSquare, BarChart3 } from 'lucide-react';
import CustomQuoteModal from '@/components/CustomQuoteModal';
import { useTranslation } from 'react-i18next';
import { INDUSTRIES } from '@/data/industries';

export default function Index() {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [sections, setSections] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

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
  const finalCta = getSection('final-cta', 'Ready to Transform Your Business Operations?', 'Join enterprise leaders leveraging Vision-Sync to automate workflows, scale AI agents, and dominate their industries.');

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

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-royal-purple/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-emerald-green/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center gap-2 bg-gradient-primary px-4 py-1.5 rounded-full text-white text-sm font-medium mb-8 shadow-glow mx-auto">
            <Sparkles className="h-4 w-4" />
            {t('index.enterpriseInfrastructure')}
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-midnight-navy mb-6 tracking-tight">
            {hero.title.split(' For Your Business')[0]}<br />
            {hero.title.includes('For Your Business') && (
              <span className="bg-gradient-primary bg-clip-text text-transparent">For Your Business</span>
            )}
          </h1>
          <p className="text-lg md:text-xl text-cool-gray mb-10 max-w-3xl mx-auto leading-relaxed">
            {hero.content}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="lg" onClick={() => setShowQuoteModal(true)} className="shadow-lg group">
              {hero.ctaLabel || t('index.requestDemo')}
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Link to={hero.ctaLink || "/platform"}>
              <Button variant="outline" size="lg" className="group">
                <Network className="h-5 w-5 mr-2" />
                {t('index.explorePlatform')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-soft-lilac/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-bold text-royal-purple uppercase tracking-wider mb-3">{t('index.platformOverview')}</h2>
              <h3 className="text-4xl font-heading font-bold text-midnight-navy mb-6">
                {overview.title}
              </h3>
              <p className="text-lg text-cool-gray mb-6 leading-relaxed">
                {overview.content}
              </p>
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
                    <Brain className="h-4 w-4 mr-2 text-royal-purple" />
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
                    <Network className="h-6 w-6 mr-3 text-electric-blue" />
                    {t('index.globalOrchestration')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Selector Section */}
      <section id="industries" className="py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-soft-lilac/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-electric-blue uppercase tracking-wider mb-3">Your Industry</h2>
            <h3 className="text-4xl font-heading font-bold text-midnight-navy mb-4">
              What type of business are you?
            </h3>
            <p className="text-lg text-cool-gray max-w-2xl mx-auto">
              Pick your industry and we'll show you exactly what Vision-Sync can do for you.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {INDUSTRIES.map((industry) => (
              <Link
                key={industry.slug}
                to={`/solutions/${industry.slug}`}
                className="group bg-white border-2 border-soft-lilac/20 rounded-2xl p-6 hover:border-electric-blue hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="mb-4">
                  <div className="w-12 h-12 bg-slate-50 group-hover:bg-electric-blue/10 rounded-xl flex items-center justify-center transition-colors">
                    <Briefcase className="h-6 w-6 text-midnight-navy group-hover:text-electric-blue transition-colors" />
                  </div>
                </div>
                <h4 className="font-bold text-midnight-navy group-hover:text-electric-blue transition-colors mb-2 leading-snug">
                  {industry.name}
                </h4>
                <p className="text-sm text-cool-gray line-clamp-2 flex-grow leading-relaxed">
                  {industry.painStatement}
                </p>
                <div className="mt-4 flex items-center text-electric-blue text-sm font-medium group-hover:gap-2 transition-all">
                  See how it works
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Sections Loop (Middle Sections) */}
      {sections.filter(s => !['hero-area', 'platform-overview', 'final-cta'].includes(s.section_key)).map((sec) => (
        <section key={sec.id} className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-b border-soft-lilac/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-midnight-navy mb-6">{sec.title}</h2>
              <div className="prose prose-lg prose-slate mx-auto text-cool-gray">
                {sec.content?.split('\n').map((paragraph: string, i: number) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              {sec.cta_label && sec.cta_link && (
                <Button asChild className="mt-8 bg-electric-blue hover:bg-electric-blue/90" size="lg">
                  <Link to={sec.cta_link}>{sec.cta_label}</Link>
                </Button>
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
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold text-electric-blue uppercase tracking-wider mb-3">{t('index.modularArchitecture')}</h2>
              <h3 className="text-4xl font-heading font-bold text-midnight-navy">{t('index.coreModules')}</h3>
              <p className="mt-4 text-lg text-cool-gray max-w-2xl mx-auto">
                {t('index.selectModulesDesc')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {modules.map((mod: any) => (
                <Card key={mod.id} className="hover:shadow-xl transition-all duration-300 border-soft-lilac/20 bg-white group hover:-translate-y-1 flex flex-col">
                  <CardHeader>
                    <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center mb-4 text-midnight-navy group-hover:bg-electric-blue/10 group-hover:text-electric-blue transition-colors">
                      <Zap className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl text-midnight-navy">{mod.name}</CardTitle>
                    <CardDescription className="text-base mt-2 line-clamp-2">{mod.short_description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {/* Room for quick module metrics or feature list */}
                  </CardContent>
                  <div className="px-6 pb-6 mt-auto">
                    <Button asChild variant="ghost" className="w-full justify-between hover:bg-slate-50 text-electric-blue group/btn">
                      <Link to="/modules">
                        {t('index.exploreModule')}
                        <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </Card>
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

      {/* Final CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-midnight-navy text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            {finalCta.title}
          </h2>
          <p className="text-xl text-white/80 mb-10 leading-relaxed">
            {finalCta.content}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" onClick={() => setShowQuoteModal(true)}>
              {finalCta.ctaLabel || t('index.requestBlueprint')}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Link to={finalCta.ctaLink || "/pricing"}>
              <Button variant="outline" size="lg" className="border-white text-midnight-navy bg-white hover:bg-slate-100">
                {t('index.viewPricing')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <CustomQuoteModal open={showQuoteModal} onOpenChange={setShowQuoteModal} />
    </div>
  );
}
