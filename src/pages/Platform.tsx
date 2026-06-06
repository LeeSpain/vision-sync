import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Cpu, Database, Zap, Shield, Layers, ArrowRight, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ds, ACCENT_COLORS } from '@/styles/designSystem';

const PLATFORM_FEATURES = [
  {
    icon: Cpu,
    color: 'purple' as const,
    titleKey: 'platform.feature1Title' as const,
    descKey: 'platform.feature1Desc' as const,
    defaultTitle: 'Cognitive AI Engine',
    defaultDesc: 'Multi-agent orchestration powered by Claude. Each agent has a distinct role — sales, support, intake, or custom — trained on your business data and available 24/7.',
  },
  {
    icon: Database,
    color: 'green' as const,
    titleKey: 'platform.feature2Title' as const,
    descKey: 'platform.feature2Desc' as const,
    defaultTitle: 'Real-Time Data Layer',
    defaultDesc: 'Every conversation, lead, and action is captured, stored, and queryable. Your agents get smarter every week as they learn from real interactions.',
  },
  {
    icon: Zap,
    color: 'blue' as const,
    titleKey: 'platform.feature3Title' as const,
    descKey: 'platform.feature3Desc' as const,
    defaultTitle: 'Instant Automation',
    defaultDesc: 'Connect leads to your CRM, trigger follow-up emails, route escalations, and send notifications — all without a single manual step.',
  },
  {
    icon: Shield,
    color: 'orange' as const,
    titleKey: 'platform.feature4Title' as const,
    descKey: 'platform.feature4Desc' as const,
    defaultTitle: 'Enterprise Security',
    defaultDesc: 'GDPR-compliant by design. Row-level security, encrypted storage, JWT auth, and a full audit log of every AI action — built in from day one.',
  },
];

const PLATFORM_GUARANTEES = [
  'Live in 48 hours — no complex setup',
  'English + Spanish out of the box',
  'No per-seat pricing — flat monthly fee',
  'Cancel anytime — no lock-in contracts',
];

export default function Platform() {
  const { t } = useTranslation();

  return (
    <div className={ds.pageWrapper}>
      <Header />
      <main className={ds.main}>
        <div className={ds.container}>

          {/* ── Hero ─────────────────────────────────────────────────────── */}
          <div className={ds.heroWrapper}>
            <span className={ds.sectionLabel}>How It Works</span>
            <h1 className={ds.h1}>
              {t('platform.title', 'The AI platform built for local business')}
            </h1>
            <p className={ds.heroSubtitle}>
              {t('platform.subtitle', 'Vision-Sync plugs into your existing website and phone number. Your AI agents answer every enquiry, qualify every lead, and book every appointment — in English and Spanish, around the clock.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button asChild size="lg" className="bg-midnight-navy hover:bg-midnight-navy/90 text-white rounded-full px-8 group">
                <Link to="/pricing">
                  {t('platform.exploreSolutions', 'See pricing')}
                  <ArrowRight className={ds.ctaArrow} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className={`rounded-full px-8 ${ds.secondaryButton}`}>
                <Link to="/contact">{t('platform.requestDemo', 'Request a demo')}</Link>
              </Button>
            </div>
          </div>

          {/* ── Feature cards grid ───────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {PLATFORM_FEATURES.map(({ icon: Icon, color, titleKey, descKey, defaultTitle, defaultDesc }) => {
              const accent = ACCENT_COLORS[color];
              return (
                <div key={titleKey} className={ds.cardBase}>
                  <div className={`${ds.cardAccentStrip} ${accent.strip}`} />
                  <div className={ds.cardContent}>
                    <div className={`${ds.iconContainer} ${accent.icon}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className={ds.cardTitle}>{t(titleKey, defaultTitle)}</h3>
                    <p className={ds.cardBody}>{t(descKey, defaultDesc)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Guarantees strip ─────────────────────────────────────────── */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl border border-soft-lilac/20 shadow-sm p-8">
              <h3 className="text-center font-bold text-midnight-navy mb-8 text-lg">
                Everything included. No surprises.
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PLATFORM_GUARANTEES.map((item) => (
                  <div key={item} className={ds.featureItem}>
                    <div className="w-6 h-6 bg-emerald-green/10 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle className="h-4 w-4 text-emerald-green" />
                    </div>
                    <span className="font-medium text-midnight-navy">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Modular add-ons banner ───────────────────────────────────── */}
          <div className={`mt-16 ${ds.darkBanner}`}>
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Layers className="h-64 w-64" />
            </div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t('platform.growBannerTitle', 'Start with your base. Add as you grow.')}
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                {t('platform.growBannerDesc', 'Every package starts with the essentials for your industry. Stack on voice agents, CRM sync, WhatsApp, review management, and more — only pay for what you use.')}
              </p>
              <Button asChild size="lg" className="bg-white text-midnight-navy hover:bg-slate-100 font-semibold">
                <Link to="/modules">{t('platform.browseSkills', 'Browse add-on modules')}</Link>
              </Button>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
