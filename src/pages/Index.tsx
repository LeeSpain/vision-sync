import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import SEOHead from '@/components/SEOHead';
import { generateOrganizationSchema, generateWebPageSchema } from '@/utils/structuredData';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, Sparkles, Network, CheckCircle, Brain, Workflow, Loader2, Target, Bot, Zap, Briefcase, MessageSquare, BarChart3 } from 'lucide-react';
import CustomQuoteModal from '@/components/CustomQuoteModal';

export default function Index() {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [sections, setSections] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        canonical="https://vision-sync.com/"
        structuredData={[
          generateOrganizationSchema(),
          generateWebPageSchema({
            name: "Vision-Sync | Premium AI Automation Platform",
            description: "Modular AI systems and automation infrastructure for businesses.",
            url: "https://vision-sync.com/"
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
            Enterprise Infrastructure
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
              {hero.ctaLabel || 'Request a Demo'}
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Link to={hero.ctaLink || "/platform"}>
              <Button variant="outline" size="lg" className="group">
                <Network className="h-5 w-5 mr-2" />
                Explore Platform
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
              <h2 className="text-sm font-bold text-royal-purple uppercase tracking-wider mb-3">Platform Overview</h2>
              <h3 className="text-4xl font-heading font-bold text-midnight-navy mb-6">
                {overview.title}
              </h3>
              <p className="text-lg text-cool-gray mb-6 leading-relaxed">
                {overview.content}
              </p>
              <ul className="space-y-4">
                {['Modular Architecture', 'Seamless Automation', 'Predictive Intelligence', 'Granular Control & Analytics'].map((feature, i) => (
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
                <div className="rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden relative group">
                  <img src="/images/platform_ai_brain.png" alt="AI Neural Network" className="object-cover w-full h-full transform transition duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/90 via-midnight-navy/20 to-transparent opacity-90 transition-opacity group-hover:opacity-80"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white font-medium text-sm flex items-center">
                    <Brain className="h-4 w-4 mr-2 text-royal-purple" />
                    Cognitive Engine
                  </div>
                </div>
                <div className="rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden relative group">
                  <img src="/images/platform_workflow.png" alt="Data Pipeline Workflow" className="object-cover w-full h-full transform transition duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/90 via-midnight-navy/20 to-transparent opacity-90 transition-opacity group-hover:opacity-80"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white font-medium text-sm flex items-center">
                    <Workflow className="h-4 w-4 mr-2 text-emerald-green" />
                    Automated Flows
                  </div>
                </div>
                <div className="rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden relative col-span-2 group">
                  <img src="/images/platform_network.png" alt="Global Network Orchestration" className="object-cover w-full h-full transform transition duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/90 via-midnight-navy/20 to-transparent opacity-90 transition-opacity group-hover:opacity-80"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white font-medium text-lg flex items-center">
                    <Network className="h-6 w-6 mr-3 text-electric-blue" />
                    Global Orchestration Layer
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Sales Sync Promo */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-midnight-navy text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-electric-blue/10 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-white text-sm font-medium mb-8 border border-white/10">
                <Target className="h-4 w-4 text-emerald-green" />
                Featured Integration
              </div>
              <h3 className="text-4xl font-heading font-bold mb-6">
                Supercharge Revenue with <span className="text-electric-blue">AI Sales Sync</span>
              </h3>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                Connect Vision-Sync to our specialized AI Sales platform. Automate your entire sales funnel, from lead generation and qualifying conversations to meeting bookings and follow-ups.
              </p>
              <ul className="space-y-4 mb-8">
                {['Autonomous Lead Qualification', '24/7 Multi-channel Sales Agents', 'Seamless Vision-Sync CRM Integration'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 font-medium text-white/90">
                    <CheckCircle className="h-5 w-5 text-emerald-green" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="hero" size="lg" className="shadow-lg group">
                  <a href="https://www.aisales-sync.com/" target="_blank" rel="noopener noreferrer">
                    Explore AI Sales Sync
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </div>
            <div className="relative z-10 lg:h-full">
              <div className="h-full bg-slate-900/50 rounded-2xl border border-white/10 p-8 shadow-2xl overflow-hidden group relative flex flex-col justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <h4 className="text-2xl font-bold mb-8 text-white">The Automated AI Funnel</h4>

                <div className="space-y-0 relative">
                  {[
                    { number: 1, title: 'Find', desc: 'Discover leads' },
                    { number: 2, title: 'Outreach', desc: 'Send messages' },
                    { number: 3, title: 'Calls', desc: 'AI conversations' },
                    { number: 4, title: 'Proposals', desc: 'Generate docs' },
                    { number: 5, title: 'Close', desc: 'Win the deal', isLast: true }
                  ].map((step) => (
                    <div key={step.number} className="flex gap-5 relative">
                      {/* Vertical line connector */}
                      {!step.isLast && (
                        <div className="absolute left-[15px] top-[32px] bottom-[-8px] w-px bg-white/10"></div>
                      )}

                      <div className="relative z-10 flex flex-col items-center shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-transform duration-300 group-hover:scale-110 ${step.isLast
                            ? 'bg-emerald-green/20 border border-emerald-green text-emerald-green shadow-emerald-green/20'
                            : 'bg-electric-blue/10 border border-electric-blue/50 text-electric-blue shadow-electric-blue/10'
                          }`}>
                          {step.number}
                        </div>
                      </div>

                      <div className={step.isLast ? 'pt-1' : 'pb-8 pt-1'}>
                        <h5 className="font-bold text-lg text-white leading-none mb-1">{step.title}</h5>
                        <p className="text-white/60 text-sm">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
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
              <h2 className="text-sm font-bold text-electric-blue uppercase tracking-wider mb-3">Modular Architecture</h2>
              <h3 className="text-4xl font-heading font-bold text-midnight-navy">Core Platform Modules</h3>
              <p className="mt-4 text-lg text-cool-gray max-w-2xl mx-auto">
                Select and integrate specialized intelligence nodes to construct a bespoke ecosystem tailored precisely to your operational needs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {modules.map((mod: any) => (
                <Card key={mod.id} className="hover:shadow-xl transition-all duration-300 border-slate-200 bg-white group hover:-translate-y-1 flex flex-col">
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
                        Explore Module
                        <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button asChild variant="outline" size="lg" className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white">
                <Link to="/modules">View Entire Catalog</Link>
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
              {finalCta.ctaLabel || 'Request Custom Blueprint'}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Link to={finalCta.ctaLink || "/pricing"}>
              <Button variant="outline" size="lg" className="border-white text-midnight-navy bg-white hover:bg-slate-100">
                View Pricing
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
