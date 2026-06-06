import { Industry, Package, Tier } from '@/types/industries'

// ─────────────────────────────────────────────────────────────────────────────
// Canonical package building blocks — single source of truth.
// Derived from PRICING_PACKAGES.md §2 (universal spine) and §3 (tier additions).
// Do NOT hard-code prices or package contents anywhere else; read from here.
// ─────────────────────────────────────────────────────────────────────────────

// §2 — Universal base spine (every industry, every tier includes this)
const SPINE: string[] = [
  'Branded landing page / microsite — built, hosted, on your domain',
  'AI agent trained on your business — English + Spanish',
  'Website chat widget (embedded, live)',
  'Lead & enquiry capture',
  'Instant owner notifications (email + WhatsApp alert)',
  'Client dashboard — view leads & conversations (Data Intelligence Hub)',
  '24/7 availability',
  'Onboarding & setup',
]

// §3 — Growth adds (on top of Base)
const GROWTH_ADDS: string[] = [
  'Appointment Booking (calendar sync, confirmations, reminders)',
  'Lead Qualifier (scoring & routing)',
  'CRM Sync',
  'Review Manager',
]

// §3 — Everything adds (on top of Growth); voice handled per-tier below
const EVERYTHING_ADDS: string[] = [
  'WhatsApp Agent',
  'Social Media Responder',
  'Email Follow-Up Agent',
]

const TIER_TAGLINES: Record<Tier, string> = {
  base: 'Everything you need to capture and answer every enquiry, 24/7.',
  growth: 'Booking, qualifying, CRM and reviews — turn enquiries into booked business.',
  everything: 'Full omnichannel coverage — voice, WhatsApp, social and email.',
}

const voiceLine = (mins: number) => `Inbound Voice Agent (${mins.toLocaleString('en-US')} mins/mo)`

interface TierSpec {
  exVat: number
  voice: number // included voice minutes for this tier; 0 if none
}

// Builds the [base, growth, everything] packages with cumulative `includes`
// lists (spine + industry core + tier adds) and a single voice line per tier
// reflecting that tier's minutes. incVatPrice = round(exVat * 1.21).
function buildPackages(core: string[], base: TierSpec, growth: TierSpec, everything: TierSpec): Package[] {
  const baseNonVoice = [...SPINE, ...core]
  const growthNonVoice = [...baseNonVoice, ...GROWTH_ADDS]
  const everythingNonVoice = [...growthNonVoice, ...EVERYTHING_ADDS]

  const pkg = (tier: Tier, name: string, spec: TierSpec, nonVoice: string[]): Package => ({
    tier,
    name,
    exVatPrice: spec.exVat,
    incVatPrice: Math.round(spec.exVat * 1.21),
    voiceMinutes: spec.voice,
    tagline: TIER_TAGLINES[tier],
    includes: spec.voice > 0 ? [...nonVoice, voiceLine(spec.voice)] : nonVoice,
  })

  return [
    pkg('base', 'Base', base, baseNonVoice),
    pkg('growth', 'Growth', growth, growthNonVoice),
    pkg('everything', 'Everything', everything, everythingNonVoice),
  ]
}

export const INDUSTRIES: Industry[] = [
  {
    slug: 'estate-agents',
    name: 'Estate Agents',
    icon: 'Home',
    painStatement: 'Stop losing property leads overnight. Your AI agent answers enquiries at 2am, qualifies buyers, and books viewings automatically — in English and Spanish.',
    color: 'blue',
    packages: buildPackages(
      ['Buyer/seller enquiry capture', 'Viewing-request handling'],
      { exVat: 349, voice: 0 },
      { exVat: 549, voice: 0 },
      { exVat: 849, voice: 1000 },
    )
  },
  {
    slug: 'dental-clinics',
    name: 'Dental & Health Clinics',
    icon: 'HeartPulse',
    painStatement: 'Never miss a patient call again. Your AI receptionist answers in English and Spanish, handles appointment enquiries, and routes emergencies — 24 hours a day.',
    color: 'green',
    packages: buildPackages(
      ['AI receptionist', 'Appointment enquiries & emergency routing'],
      { exVat: 489, voice: 1500 },
      { exVat: 689, voice: 1500 },
      { exVat: 989, voice: 3000 },
    )
  },
  {
    slug: 'legal-gestorias',
    name: 'Legal Firms & Gestorias',
    icon: 'Scale',
    painStatement: 'Handle the flood of expat enquiries automatically. Your AI intake agent qualifies leads, answers FAQs, and books consultations — in perfect English and Spanish.',
    color: 'purple',
    packages: buildPackages(
      ['Client intake Q&A', 'Document FAQ & consultation enquiries'],
      { exVat: 279, voice: 0 },
      { exVat: 479, voice: 0 },
      { exVat: 779, voice: 1000 },
    )
  },
  {
    slug: 'holiday-rentals',
    name: 'Holiday Rentals & Property Management',
    icon: 'Umbrella',
    painStatement: 'Your guests have questions at midnight. Your AI concierge answers in any language, handles check-in queries, and manages maintenance requests automatically.',
    color: 'orange',
    packages: buildPackages(
      ['Multilingual guest concierge', 'Check-in & maintenance routing'],
      { exVat: 249, voice: 0 },
      { exVat: 449, voice: 0 },
      { exVat: 749, voice: 1000 },
    )
  },
  {
    slug: 'gyms-fitness',
    name: 'Gyms & Fitness Studios',
    icon: 'Dumbbell',
    painStatement: 'Turn every missed call into a new member. Your AI sales agent answers the phone, handles class enquiries, captures leads, and follows up automatically.',
    color: 'green',
    packages: buildPackages(
      ['Membership & class enquiries', 'Lead capture & follow-up'],
      { exVat: 319, voice: 500 },
      { exVat: 519, voice: 500 },
      { exVat: 819, voice: 1000 },
    )
  },
  {
    slug: 'building-renovation',
    name: 'Building & Renovation',
    icon: 'HardHat',
    painStatement: 'Stop losing jobs because nobody answered the enquiry. Your AI agent captures quote requests, qualifies the job, and notifies you instantly — day or night.',
    color: 'amber',
    packages: buildPackages(
      ['AI quote-intake & job-qualification agent'],
      { exVat: 209, voice: 0 },
      { exVat: 409, voice: 0 },
      { exVat: 709, voice: 1000 },
    )
  },
  {
    slug: 'restaurants-bars',
    name: 'Restaurants & Bars',
    icon: 'UtensilsCrossed',
    painStatement: 'Full tables every night. Your AI agent answers the phone, takes reservations in English and Spanish, handles menu questions, and sends booking confirmations automatically.',
    color: 'red',
    packages: buildPackages(
      ['AI reservations agent', 'Menu/hours FAQ & booking confirmations'],
      { exVat: 475, voice: 1500 },
      { exVat: 619, voice: 1500 },
      { exVat: 919, voice: 3000 },
    )
  },
  {
    slug: 'beauty-hair',
    name: 'Beauty & Hair Salons',
    icon: 'Scissors',
    painStatement: 'Every missed call is a missed appointment. Your AI booking agent answers the phone, handles bookings in English and Spanish, and chases cancellations automatically.',
    color: 'pink',
    packages: buildPackages(
      ['AI booking agent', 'Services & opening hours info'],
      { exVat: 249, voice: 500 },
      { exVat: 449, voice: 500 },
      { exVat: 749, voice: 1000 },
    )
  }
]
