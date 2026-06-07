import { Bot, Sparkles, Network, Zap, Shield, Workflow, BarChart3 } from 'lucide-react';
import {
  Eyebrow,
  GradientText,
  Hero,
  SectionHeading,
  FeatureCard,
  PricingCard,
  CTAGroup,
  DarkBand,
  SectionDivider,
} from '@/components/ui-system';

/**
 * Scratch preview route (/ui-system) — renders every ui-system component with
 * sample data so the library can be eyeballed in isolation. Not linked in nav;
 * dev-only. Copy here is illustrative (not routed through i18n).
 */
function Swatch({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <p className="font-mono text-xs uppercase tracking-wider text-cool-gray">{label}</p>
      {children}
    </div>
  );
}

export default function UiSystemPreview() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white font-body">
      <div className="mx-auto max-w-7xl space-y-20 px-4 py-16 sm:px-6 lg:px-8">
        <header className="space-y-3">
          <Eyebrow icon={Sparkles} label="UI System Preview" />
          <h1 className="font-heading text-4xl font-bold tracking-tight text-midnight-navy md:text-5xl">
            Vision-Sync <GradientText>component library</GradientText>
          </h1>
          <p className="max-w-2xl text-lg text-cool-gray">
            Every block below is styled purely from DESIGN.md brand tokens. Toggle your OS
            “reduce motion” setting to verify animations/hover lifts settle.
          </p>
        </header>

        <SectionDivider />

        {/* Hero */}
        <Swatch label="<Hero /> (atmospheric light hero — composes Eyebrow + GradientText + CTAGroup; staggered reveal, reduced-motion safe)">
          <div className="overflow-hidden rounded-3xl border border-soft-lilac/30">
            <Hero
              eyebrow={{ icon: Sparkles, label: 'Enterprise Infrastructure' }}
              title="Premium AI Automation"
              highlight="For Your Business"
              subtitle="Modular AI systems that scale with your business — only what you need, nothing you don't."
              primaryCta={{ label: 'Request a Demo', href: '/contact' }}
              secondaryCta={{ label: 'Explore Platform', href: '/platform', icon: Network }}
              footnote="Built for Costa Blanca businesses — answering in English and Spanish, day and night."
              media={
                <div className="rounded-3xl border border-soft-lilac/30 bg-slate-white p-6 shadow-hover">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <p className="font-heading text-sm font-semibold text-midnight-navy">Sample media slot</p>
                  </div>
                  <p className="mt-4 text-sm text-cool-gray">
                    Pass any ReactNode as <code>media</code> — e.g. the homepage chat card.
                  </p>
                </div>
              }
            />
          </div>
        </Swatch>

        <SectionDivider />

        {/* Eyebrow + GradientText */}
        <Swatch label="<Eyebrow /> + <GradientText />">
          <div className="flex flex-wrap items-center gap-4">
            <Eyebrow icon={Bot} label="AI Agents" />
            <Eyebrow icon={Shield} label="Enterprise-grade" />
            <Eyebrow label="No icon" />
          </div>
          <p className="font-heading text-2xl font-bold text-midnight-navy">
            Built <GradientText>enterprise-grade</GradientText> from day one.
          </p>
        </Swatch>

        <SectionDivider />

        {/* SectionHeading */}
        <Swatch label="<SectionHeading /> (center + left)">
          <SectionHeading
            eyebrow="Platform"
            eyebrowIcon={Network}
            title="Intelligence, automation, and"
            highlight="complete control"
            subtitle="Modular AI systems that scale with your business — only what you need, nothing you don't."
          />
          <SectionHeading
            align="left"
            eyebrow="Why us"
            title="One platform,"
            highlight="every workflow"
            subtitle="Left-aligned variant for split layouts."
          />
        </Swatch>

        <SectionDivider />

        {/* FeatureCard */}
        <Swatch label="<FeatureCard /> (single gradient accent — no per-item colours)">
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={Workflow}
              title="Automated flows"
              body="Wire up multi-step automations that run 24/7 without a human in the loop."
              items={['Visual builder', 'Conditional routing', 'Audit trail']}
            />
            <FeatureCard
              icon={BarChart3}
              title="Live analytics"
              body="See leads, conversations, and conversions update in real time."
              badge="New"
            />
            <FeatureCard
              icon={Zap}
              title="Instant deploy"
              body="From blueprint to live agent in 48 hours."
              items={['Bilingual', 'Hosted', 'On your domain']}
            />
          </div>
        </Swatch>

        <SectionDivider />

        {/* PricingCard */}
        <Swatch label="<PricingCard /> (Growth = gradient accent + Most Popular)">
          <div className="grid items-stretch gap-6 md:grid-cols-3">
            <PricingCard
              name="Base"
              tagline="Everything you need to capture and answer every enquiry."
              price="€489"
              perMonthLabel="/mo"
              vatNote="+21% IVA (€592 inc.)"
              voiceNote="1,500 voice min"
              includes={['AI receptionist', 'Website chat widget', '24/7 availability', 'Lead capture']}
              ctaLabel="Choose Base"
            />
            <PricingCard
              name="Growth"
              tagline="Booking, qualifying and CRM — turn enquiries into booked business."
              price="€689"
              perMonthLabel="/mo"
              vatNote="+21% IVA (€834 inc.)"
              voiceNote="1,500 voice min"
              includes={['Everything in Base', 'Appointment booking', 'Lead qualifier', 'CRM sync', 'Review manager']}
              popular
              ctaLabel="Choose Growth"
            />
            <PricingCard
              name="Everything"
              tagline="Full omnichannel coverage across voice, WhatsApp, social and email."
              price="€989"
              perMonthLabel="/mo"
              vatNote="+21% IVA (€1,197 inc.)"
              voiceNote="3,000 voice min"
              includes={['Everything in Growth', 'WhatsApp agent', 'Social responder', 'Email follow-up']}
              ctaLabel="Choose Everything"
            />
          </div>
        </Swatch>

        <SectionDivider />

        {/* CTAGroup */}
        <Swatch label="<CTAGroup /> (hero + outline, internal/external/onClick)">
          <CTAGroup
            primary={{ label: 'Get Your Quote', href: '/pricing' }}
            secondary={{ label: 'Explore Platform', href: '/platform', icon: Network }}
          />
          <CTAGroup
            align="center"
            primary={{ label: 'Open modal', onClick: () => alert('primary onClick') }}
            secondary={{ label: 'External link', href: 'https://www.vision-sync.co' }}
          />
        </Swatch>

        <SectionDivider variant="gradient" />

        {/* DarkBand */}
        <Swatch label="<DarkBand /> (the one approved dark surface)">
          <DarkBand as="div" className="rounded-3xl px-8 py-12">
            <div className="max-w-2xl space-y-4">
              <Eyebrow icon={Sparkles} label="Ready when you are" />
              <h2 className="font-heading text-3xl font-bold tracking-tight">
                Transform your operations with <GradientText>intelligent automation</GradientText>
              </h2>
              <p className="text-white/80">
                White text on the midnight-navy → royal-purple band, with brand glow orbs.
              </p>
              <CTAGroup primary={{ label: 'Request a Demo', href: '/contact' }} />
            </div>
          </DarkBand>
        </Swatch>
      </div>
    </div>
  );
}
