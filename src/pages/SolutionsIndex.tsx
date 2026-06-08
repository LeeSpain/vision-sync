import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { CheckCircle2, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePricing } from '@/hooks/usePricing';
import { Hero, FeatureCard, SectionHeading, CTAGroup, SectionDivider } from '@/components/ui-system';
import { HeroBlueprintCard } from '@/components/solutions/HeroBlueprintCard';

// Map industry slugs to the top pain point solved (one-line summary)
const PAIN_SOLVED: Record<string, string> = {
  'estate-agents':    'Stop losing property leads overnight — answered and qualified 24/7.',
  'dental-clinics':   'Never miss a patient call — AI receptionist handles calls around the clock.',
  'legal-gestorias':  'Handle every expat enquiry automatically — consultations booked instantly.',
  'holiday-rentals':  'Guests have questions at midnight — AI concierge answers in any language.',
  'gyms-fitness':     'Turn every missed call into a new member — AI sales agent answers the phone.',
  'building-renovation': 'Stop losing jobs to voicemail — quote requests captured day and night.',
  'restaurants-bars': 'Full tables every night — AI takes reservations in English and Spanish.',
  'beauty-hair':      'Every missed call is a missed appointment — AI fills your calendar automatically.',
};

export default function SolutionsIndex() {
  const { t } = useTranslation();
  // Pricing source of truth: published DB pricing, with automatic static fallback
  // (seeded with the static list, so the grid renders immediately — no empty flash).
  const { industries } = usePricing();

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <Hero
        eyebrow={{ icon: Lightbulb, label: t('solutionsIndex.heroEyebrow') }}
        title={t('solutionsIndex.heroTitle')}
        highlight={t('solutionsIndex.heroHighlight')}
        subtitle={t('solutionsIndex.heroSubtitle')}
        primaryCta={{ label: t('solutionsIndex.heroCta'), href: '/pricing' }}
        media={<HeroBlueprintCard />}
      />

      <main>
        {/* Industry blueprint cards */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {industries.map((industry) => {
                const painSolved = PAIN_SOLVED[industry.slug] ?? industry.painStatement;
                const basePkg = industry.packages[0];

                return (
                  <FeatureCard
                    key={industry.slug}
                    icon={Lightbulb}
                    title={industry.name}
                    body={painSolved}
                    badge={basePkg.voiceMinutes > 0 ? t('solutionsIndex.voiceIncluded') : undefined}
                    items={basePkg.includes.slice(0, 3)}
                    meta={t('solutionsIndex.cardStatus')}
                    href="/pricing"
                    ctaLabel={t('solutionsIndex.seeSolution')}
                  />
                );
              })}
            </div>

            {/* Bilingual note */}
            <div className="mt-12 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-soft-lilac/30 bg-slate-white px-4 py-2 shadow-card">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-green" />
                <p className="text-sm text-cool-gray">{t('solutionsIndex.bilingualNote')}</p>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Closing CTA */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionHeading title={t('solutionsIndex.notSure')} />
            <CTAGroup
              className="mt-8 justify-center"
              primary={{ label: t('solutionsIndex.talkToTeam'), href: '/contact' }}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
