import { useEffect, useState } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import {
  Loader2, Layers,
  Mic, RefreshCw, Calendar, UserCheck, Star,
  MessageCircle, MessageSquare, Mail, BarChart3, Bot,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Hero, FeatureCard, SectionHeading, CTAGroup, SectionDivider } from '@/components/ui-system';
import { HeroSkillsGrid } from '@/components/modules/HeroSkillsGrid';

interface Module {
  id: string;
  name: string;
  short_description: string;
  long_description: string | null;
  monthly_addon_price: number | null;
  setup_fee?: number | null;
  features: string[];
  iconKey: string;
}

interface DbModule {
  id: string;
  name: string;
  short_description: string | null;
  long_description: string | null;
  monthly_addon_price: number | null;
  setup_fee: number | null;
  features: unknown;
  is_active: boolean | null;
  sort_order: number | null;
}

type IconComponent = React.FC<{ className?: string }>;

const ICON_MAP: Record<string, IconComponent> = {
  Mail, Mic, BarChart3, Bot, RefreshCw, Calendar, UserCheck, Star, MessageCircle, MessageSquare,
};

const FALLBACK_MODULES: Module[] = [
  {
    id: 'fm-1',
    name: 'Email Follow-Up Agent',
    short_description: 'Automated personalised follow-ups that convert leads while you sleep.',
    long_description: 'Your AI agent sends personalised follow-up email sequences to every lead — triggered by their enquiry type, urgency, and behaviour. No mail-merge. No manual chasing.',
    monthly_addon_price: 199,
    features: ['Personalised email sequences', 'Trigger-based timing', 'Multilingual (EN + ES)', 'Open & click tracking'],
    iconKey: 'Mail',
  },
  {
    id: 'fm-2',
    name: 'Voice Assistant',
    short_description: 'AI answers your phone line in English and Spanish — 24/7, zero hold times.',
    long_description: 'An inbound voice agent that answers every call, handles FAQs, captures caller details, and escalates urgently when needed. Works with your existing number.',
    monthly_addon_price: 349,
    features: ['Inbound call handling', '1,000 minutes included', 'English + Spanish', 'Instant owner alerts'],
    iconKey: 'Mic',
  },
  {
    id: 'fm-3',
    name: 'Data Intelligence Hub',
    short_description: 'Live dashboards showing leads, conversations, conversions, and agent performance.',
    long_description: 'A unified analytics layer across all your AI agents. See which channels drive the best leads, how agents perform, and where drop-offs happen — updated in real-time.',
    monthly_addon_price: null,
    features: ['Real-time dashboards', 'Lead source attribution', 'Agent performance metrics', 'Exportable reports'],
    iconKey: 'BarChart3',
  },
  {
    id: 'fm-4',
    name: 'CRM Sync',
    short_description: 'Every lead and conversation pushed to your CRM automatically.',
    long_description: 'Vision-Sync connects to your existing CRM and pushes every lead, contact update, and conversation summary in real-time — no manual data entry.',
    monthly_addon_price: 149,
    features: ['Bi-directional sync', 'Zapier / Make compatible', 'Custom field mapping', 'Duplicate detection'],
    iconKey: 'RefreshCw',
  },
  {
    id: 'fm-5',
    name: 'Appointment Booking',
    short_description: 'AI books, confirms, and reminds — your calendar stays full automatically.',
    long_description: 'Your AI agent checks availability, books appointments, sends confirmations, and fires reminders — in the customer\'s preferred language.',
    monthly_addon_price: 199,
    features: ['Calendar integration', 'Confirmation + reminders', 'Cancellation handling', 'Multi-staff booking'],
    iconKey: 'Calendar',
  },
  {
    id: 'fm-6',
    name: 'Lead Qualifier',
    short_description: 'Score every lead instantly so you focus only on the ones that will close.',
    long_description: 'A qualification layer that asks the right questions and scores leads by budget, timeline, intent, and fit — before they ever reach your inbox.',
    monthly_addon_price: 249,
    features: ['Custom scoring model', 'Budget & timeline capture', 'Intent classification', 'Priority routing'],
    iconKey: 'UserCheck',
  },
  {
    id: 'fm-7',
    name: 'Review Manager',
    short_description: 'Monitor, respond to, and grow your Google reviews on autopilot.',
    long_description: 'Your AI monitors Google Business reviews, drafts contextual responses for your approval, flags negatives for immediate action, and sends review-request messages to happy customers.',
    monthly_addon_price: 129,
    features: ['Google review monitoring', 'AI-drafted responses', 'Negative review alerts', 'Review request campaigns'],
    iconKey: 'Star',
  },
  {
    id: 'fm-8',
    name: 'Social Media Responder',
    short_description: 'Auto-reply to Instagram and Facebook DMs and comments in seconds.',
    long_description: 'Your AI agent monitors your social inboxes and responds to enquiries, comments, and DMs with on-brand replies — capturing leads and qualifying interest before the user moves on.',
    monthly_addon_price: 179,
    features: ['Instagram + Facebook DMs', 'Comment monitoring', 'Lead capture from social', 'Brand voice trained'],
    iconKey: 'MessageCircle',
  },
  {
    id: 'fm-9',
    name: 'WhatsApp Agent',
    short_description: 'An AI sales agent inside WhatsApp Business — where your customers already are.',
    long_description: 'Deploy a full AI agent to your WhatsApp Business number. Handles enquiries, sends quotes, books appointments, and escalates complex conversations — in English and Spanish.',
    monthly_addon_price: 299,
    features: ['WhatsApp Business API', 'Media + document sharing', 'Broadcast campaigns', 'Opt-in management'],
    iconKey: 'MessageSquare',
  },
  {
    id: 'fm-10',
    name: 'AI Chatbot Widget',
    short_description: 'A fully trained chat agent embedded on your website — live in 48 hours.',
    long_description: 'The core Vision-Sync web agent. Embedded on your site, trained on your business, able to answer FAQs, capture leads, and qualify visitors — in English and Spanish — every hour of every day.',
    monthly_addon_price: null,
    features: ['Embed on any website', 'Custom brand styling', 'Lead capture forms', 'Seamless handoff to human'],
    iconKey: 'Bot',
  },
];

function parseFeatures(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((f): f is string => typeof f === 'string');
  return [];
}

export default function Modules() {
  const [dbModules, setDbModules] = useState<DbModule[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchModules = async () => {
      const { data } = await supabase
        .from('modules')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (data) setDbModules(data as DbModule[]);
      setLoading(false);
    };

    fetchModules();
  }, []);

  const displayModules: Module[] = dbModules.length > 0
    ? dbModules.map((mod, i) => ({
        id: mod.id,
        name: mod.name,
        short_description: mod.short_description ?? '',
        long_description: mod.long_description,
        monthly_addon_price: mod.monthly_addon_price,
        setup_fee: mod.setup_fee,
        features: parseFeatures(mod.features),
        iconKey: FALLBACK_MODULES[i % FALLBACK_MODULES.length]?.iconKey ?? 'Bot',
      }))
    : FALLBACK_MODULES;

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <Hero
        eyebrow={{ icon: Layers, label: t('modules.heroEyebrow') }}
        title={t('modules.heroTitle')}
        highlight={t('modules.heroHighlight')}
        subtitle={t('modules.subtitle')}
        primaryCta={{ label: t('modules.heroCta'), href: '/pricing' }}
        media={<HeroSkillsGrid />}
      />

      <main>
        {/* Module cards */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-green" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {displayModules.map((mod) => {
                  const Icon = ICON_MAP[mod.iconKey] ?? Bot;
                  const isCoreFeature = mod.monthly_addon_price === null;

                  return (
                    <FeatureCard
                      key={mod.id}
                      icon={Icon}
                      title={mod.name}
                      body={[mod.short_description, mod.long_description].filter(Boolean).join(' ')}
                      badge={isCoreFeature ? t('modules.coreFeature') : undefined}
                      items={mod.features}
                      meta={isCoreFeature ? t('modules.included') : undefined}
                      href="/pricing"
                      ctaLabel={t('modules.getQuote')}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <SectionDivider />

        {/* Bottom CTA */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading title={t('modules.bottomCtaText')} />
            <CTAGroup
              className="mt-8 justify-center"
              primary={{ label: t('modules.bottomCtaButton'), href: '/pricing' }}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
