import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Mic, CheckCircle2, Lightbulb } from 'lucide-react';
import { INDUSTRIES } from '@/data/industries';
import { ds, ACCENT_COLORS } from '@/styles/designSystem';
import type { AccentColor } from '@/styles/designSystem';

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
  return (
    <div className={ds.pageWrapper}>
      <Header />
      <main className={ds.main}>
        <div className={ds.container}>

          {/* Hero */}
          <div className={ds.heroWrapper}>
            <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-6">
              <Lightbulb className="h-6 w-6 text-indigo-600" />
            </div>
            <span className={ds.sectionLabel}>Ready-to-Use AI Blueprints</span>
            <h1 className={`${ds.h1} mt-3`}>
              Pre-built AI solutions for your industry
            </h1>
            <p className={ds.heroSubtitle}>
              Each blueprint is a fully-configured AI system designed for one industry — trained on real pain points, ready to go live in 48 hours.
            </p>
          </div>

          {/* Industry blueprint cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {INDUSTRIES.map((industry) => {
              const color = (industry.color ?? 'blue') as AccentColor;
              const accent = ACCENT_COLORS[color] ?? ACCENT_COLORS.blue;
              const painSolved = PAIN_SOLVED[industry.slug] ?? industry.painStatement;

              return (
                <div key={industry.slug} className={ds.cardBase}>
                  {/* Top accent strip */}
                  <div className={`${ds.cardAccentStrip} ${accent.strip}`} />

                  <div className={ds.cardContent}>
                    {/* Industry name */}
                    <h3 className={ds.cardTitle}>{industry.name}</h3>

                    {/* Core pain point solved */}
                    <p className="text-sm font-medium text-emerald-600 mb-3 leading-snug">
                      {painSolved}
                    </p>

                    {/* Voice badge */}
                    {industry.voiceIncluded && (
                      <div className={`${ds.badge} ${accent.badge} mb-4`}>
                        <Mic className="h-3 w-3" />
                        Voice included
                      </div>
                    )}

                    {/* 3 key features from baseIncludes */}
                    <ul className="space-y-2 mb-5 flex-grow">
                      {industry.baseIncludes.slice(0, 3).map((item) => (
                        <li key={item} className={ds.featureItem}>
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Status line */}
                    <div className="border-t border-slate-100 pt-4 mb-4">
                      <p className="text-sm font-medium text-slate-500">
                        Fully configured · Live in 48 hours
                      </p>
                    </div>

                    {/* CTA */}
                    <Link to="/pricing">
                      <Button className={`w-full ${ds.primaryButton} group`}>
                        See this solution
                        <ArrowRight className={ds.ctaArrow} />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom notes */}
          <div className="text-center mt-12 max-w-2xl mx-auto">
            <div className={ds.infoStrip}>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <p className="text-sm text-cool-gray">
                Every blueprint includes a bilingual AI agent — English and Spanish — ready in 48 hours.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <p className="text-cool-gray mb-4">Not sure which solution fits your business?</p>
            <Link to="/contact">
              <Button variant="outline" size="lg" className={ds.secondaryButton}>
                Talk to our team
              </Button>
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
