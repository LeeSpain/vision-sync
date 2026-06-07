import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Cpu, Database, Zap, Shield, Layers, BadgeCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Hero, FeatureCard, DarkBand, CTAGroup, SectionDivider } from '@/components/ui-system';
import { HeroInfraCard } from '@/components/platform/HeroInfraCard';

const PLATFORM_FEATURES = [
  { icon: Cpu, titleKey: 'platform.feature1Title' as const, descKey: 'platform.feature1Desc' as const },
  { icon: Database, titleKey: 'platform.feature2Title' as const, descKey: 'platform.feature2Desc' as const },
  { icon: Zap, titleKey: 'platform.feature3Title' as const, descKey: 'platform.feature3Desc' as const },
  { icon: Shield, titleKey: 'platform.feature4Title' as const, descKey: 'platform.feature4Desc' as const },
];

const PLATFORM_GUARANTEES = [
  'platform.guarantee1',
  'platform.guarantee2',
  'platform.guarantee3',
  'platform.guarantee4',
] as const;

export default function Platform() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <Hero
        eyebrow={{ label: t('platform.heroEyebrow') }}
        title={t('platform.heroTitle')}
        highlight={t('platform.heroHighlight')}
        subtitle={t('platform.subtitle')}
        primaryCta={{ label: t('platform.exploreSolutions'), href: '/pricing' }}
        secondaryCta={{ label: t('platform.requestDemo'), href: '/contact' }}
        media={<HeroInfraCard />}
      />

      <main>
        {/* Feature cards + guarantees */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {PLATFORM_FEATURES.map(({ icon: Icon, titleKey, descKey }) => (
                <FeatureCard
                  key={titleKey}
                  icon={Icon}
                  title={t(titleKey)}
                  body={t(descKey)}
                />
              ))}
            </div>

            {/* Guarantees */}
            <FeatureCard
              className="mx-auto mt-12 max-w-2xl"
              icon={BadgeCheck}
              title={t('platform.guaranteesTitle')}
              items={PLATFORM_GUARANTEES.map((key) => t(key))}
            />
          </div>
        </section>

        <SectionDivider />

        {/* Modular add-ons banner */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <DarkBand as="div" className="rounded-3xl p-10 text-center md:p-16">
              <div className="pointer-events-none absolute right-0 top-0 p-8 opacity-10">
                <Layers className="h-64 w-64" />
              </div>
              <div className="mx-auto max-w-3xl">
                <h2 className="mb-6 font-heading text-3xl font-bold tracking-tight md:text-4xl">
                  {t('platform.growBannerTitle')}
                </h2>
                <p className="mb-8 text-lg text-white/80">
                  {t('platform.growBannerDesc')}
                </p>
                <CTAGroup
                  className="justify-center"
                  primary={{ label: t('platform.browseSkills'), href: '/modules' }}
                />
              </div>
            </DarkBand>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
