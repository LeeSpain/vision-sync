import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, ArrowRight, Mic, Users, Target } from 'lucide-react';
import { INDUSTRIES } from '@/data/industries';

export default function Solutions() {
  const { industrySlug } = useParams<{ industrySlug: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!industrySlug) {
      navigate('/#industries', { replace: true });
      return;
    }
    const found = INDUSTRIES.find(i => i.slug === industrySlug);
    if (!found) {
      navigate('/#industries', { replace: true });
    }
  }, [industrySlug, navigate]);

  const industry = INDUSTRIES.find(i => i.slug === industrySlug);

  if (!industry) return null;

  const basePkg = industry.packages[0];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow pt-20">

        {/* Back link */}
        <div className="bg-slate-50 border-b border-soft-lilac/20 px-4 py-3">
          <div className="container mx-auto max-w-5xl">
            <Link
              to="/#industries"
              className="inline-flex items-center gap-2 text-cool-gray hover:text-midnight-navy text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              View all industries
            </Link>
          </div>
        </div>

        {/* Hero */}
        <section className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-royal-purple/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-emerald-green/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <div className="inline-flex items-center justify-center gap-2 bg-gradient-primary px-4 py-1.5 rounded-full text-white text-sm font-medium mb-8 shadow-glow mx-auto">
              <Target className="h-4 w-4" />
              {t('solutions.heroEyebrow', { industry: industry.name })}
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-midnight-navy mb-6 tracking-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">{industry.name}</span>
            </h1>
            <p className="text-lg md:text-xl text-cool-gray mb-10 max-w-3xl mx-auto leading-relaxed">
              {industry.painStatement}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/pricing">
                <Button variant="hero" size="lg" className="shadow-lg group">
                  Get Your Quote
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Talk to our team
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <span className="text-xs font-bold text-electric-blue uppercase tracking-widest">Base Package</span>
                <h2 className="text-3xl font-bold text-midnight-navy mt-2 mb-6">
                  What's included as standard
                </h2>
                <ul className="space-y-4">
                  {basePkg.includes.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-emerald-green/10 rounded-full flex items-center justify-center shrink-0">
                        <CheckCircle className="h-4 w-4 text-emerald-green" />
                      </div>
                      <span className="text-midnight-navy">{item}</span>
                    </li>
                  ))}
                </ul>
                {basePkg.voiceMinutes > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3">
                    <Mic className="h-5 w-5 text-blue-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-blue-900 text-sm">Voice Agent Included</p>
                      <p className="text-blue-700 text-sm">{basePkg.voiceMinutes.toLocaleString()} inbound voice minutes per month</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Social Proof */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-soft-lilac/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-midnight-navy rounded-xl flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-midnight-navy">Trusted by businesses</p>
                      <p className="text-sm text-cool-gray">across the Costa Blanca and Costa del Sol</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    From Alicante and Almeria to the Costa Blanca and beyond, Vision-Sync AI agents are helping {industry.name.toLowerCase()} businesses capture more leads, reduce admin, and work smarter — in English and Spanish.
                  </p>
                </div>

                {/* CTA Card */}
                <div className="bg-midnight-navy rounded-2xl p-6 text-white">
                  <h3 className="font-bold text-lg mb-2">Ready to get started?</h3>
                  <p className="text-white/70 text-sm mb-6">
                    Get a personalised quote for your business — select your industry, pick your AI skills, and receive your custom proposal instantly.
                  </p>
                  <Link to="/pricing" className="block">
                    <Button className="w-full bg-electric-blue hover:bg-electric-blue/90 text-white font-bold py-5">
                      Get Your Quote →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Packages & pricing */}
        <section className="py-20 px-4 bg-slate-50 border-t border-soft-lilac/20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-sm font-bold text-electric-blue uppercase tracking-wider mb-3">{t('solutions.packagesEyebrow')}</h2>
              <h3 className="text-3xl md:text-4xl font-heading font-bold text-midnight-navy mb-4">{t('solutions.packagesTitle')}</h3>
              <p className="text-cool-gray text-lg">{t('solutions.packagesSubtitle', { industry: industry.name })}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {industry.packages.map((pkg) => {
                const isPopular = pkg.tier === 'growth';
                return (
                  <div
                    key={pkg.tier}
                    className={`relative rounded-3xl p-7 bg-white flex flex-col shadow-card ${
                      isPopular ? 'border-2 border-royal-purple/40' : 'border border-soft-lilac/20'
                    }`}
                  >
                    {isPopular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-white text-xs font-semibold px-3 py-1 rounded-full shadow-glow whitespace-nowrap">
                        {t('pricing.mostPopular')}
                      </span>
                    )}

                    <h4 className="text-xl font-heading font-bold text-midnight-navy mb-1">{pkg.name}</h4>
                    <p className="text-sm text-cool-gray mb-5 leading-relaxed min-h-[40px]">{pkg.tagline}</p>

                    <div className="mb-1">
                      <span className="text-4xl font-bold text-midnight-navy">€{pkg.exVatPrice}</span>
                      <span className="text-cool-gray text-base">{t('pricing.perMonth')}</span>
                    </div>
                    <p className="text-xs text-cool-gray mb-5">{t('pricing.vatNote', { inc: pkg.incVatPrice })}</p>

                    {pkg.voiceMinutes > 0 && (
                      <div className="flex items-center gap-2 text-electric-blue text-sm font-medium mb-5">
                        <Mic className="h-4 w-4 shrink-0" />
                        {t('pricing.voiceMinutes', { mins: pkg.voiceMinutes.toLocaleString() })}
                      </div>
                    )}

                    <ul className="space-y-2.5 mb-6 flex-grow">
                      {pkg.includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle className="h-4 w-4 text-emerald-green shrink-0 mt-0.5" />
                          <span className="text-sm text-midnight-navy/80 leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <Link to={`/pricing?industry=${industry.slug}&tier=${pkg.tier}`} className="mt-auto block">
                      <Button variant={isPopular ? 'hero' : 'outline'} size="lg" className="w-full group">
                        {t('solutions.getThisPackage')}
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
