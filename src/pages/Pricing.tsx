import { useState, useEffect } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowRight, ArrowLeft, CheckCircle, Mic, Loader2, Sparkles, AlertCircle,
  Mail, MessageSquare, RefreshCw, BarChart3, Phone,
  Calendar, UserCheck, Star, MessageCircle, Bot
} from 'lucide-react';
import { usePricing } from '@/hooks/usePricing';
import { ADDON_MONTHLY_PRICE_EX_VAT } from '@/lib/pricing';
import { Tier } from '@/types/industries';
import { supabase } from '@/integrations/supabase/client';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Hero, PricingCard, SectionHeading, CTAGroup } from '@/components/ui-system';

// ─── Add-on Skills (no prices shown to the user) ────────────────────────────

interface Skill {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const ADDON_SKILLS: Skill[] = [
  { id: 'email-followup', name: 'Email Follow-Up Agent', description: 'Automated personalised follow-up sequences that convert leads while you sleep.', icon: <Mail className="h-5 w-5" /> },
  { id: 'voice-assistant', name: 'Voice Assistant', description: 'AI answers your phone line in English and Spanish — 24/7, zero hold times.', icon: <Phone className="h-5 w-5" /> },
  { id: 'crm-sync', name: 'CRM Sync', description: 'Every lead and conversation pushed to your CRM automatically.', icon: <RefreshCw className="h-5 w-5" /> },
  { id: 'analytics-brain', name: 'Data Intelligence Hub', description: 'Live dashboards showing leads, conversations, conversions, and agent performance.', icon: <BarChart3 className="h-5 w-5" /> },
  { id: 'appointment-booking', name: 'Appointment Booking', description: 'AI books, confirms, and reminds — your calendar stays full automatically.', icon: <Calendar className="h-5 w-5" /> },
  { id: 'lead-qualifier', name: 'Lead Qualifier', description: 'Score every lead instantly so you focus only on the ones that will close.', icon: <UserCheck className="h-5 w-5" /> },
  { id: 'review-manager', name: 'Review Manager', description: 'Monitor, respond to, and grow your Google reviews on autopilot.', icon: <Star className="h-5 w-5" /> },
  { id: 'social-responder', name: 'Social Media Responder', description: 'Auto-reply to Instagram and Facebook DMs and comments in seconds.', icon: <MessageCircle className="h-5 w-5" /> },
  { id: 'whatsapp-agent', name: 'WhatsApp Agent', description: 'An AI sales agent inside WhatsApp Business — where your customers already are.', icon: <MessageSquare className="h-5 w-5" /> },
  { id: 'chatbot-widget', name: 'AI Chatbot Widget', description: 'A fully trained chat agent embedded on your website — live in 48 hours.', icon: <Bot className="h-5 w-5" /> },
];

// ─── Step Indicator ──────────────────────────────────────────────────────────

const STEPS = [
  { num: 1, labelKey: 'pricing.step1Label' },
  { num: 2, labelKey: 'pricing.step2Label' },
  { num: 3, labelKey: 'pricing.step3Label' },
  { num: 4, labelKey: 'pricing.step4Label' },
];

function StepIndicator({ current }: { current: number }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center gap-2 mb-12">
      {STEPS.map((step, idx) => (
        <div key={step.num} className="flex items-center">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            current === step.num
              ? 'bg-gradient-primary text-white shadow-glow'
              : current > step.num
                ? 'bg-emerald-green/10 text-emerald-green'
                : 'bg-white text-cool-gray border border-soft-lilac/20'
          }`}>
            {current > step.num ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs">
                {step.num}
              </span>
            )}
            <span className="hidden sm:inline">{t(step.labelKey)}</span>
          </div>
          {idx < STEPS.length - 1 && (
            <div className={`w-8 h-px mx-1 ${current > step.num ? 'bg-emerald-green/40' : 'bg-soft-lilac/40'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Quote Reference Generator ───────────────────────────────────────────────

function generateQuoteRef(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `QT-${year}-${rand}`;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Pricing() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [quoteRef, setQuoteRef] = useState('');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    email: '',
    phone: '',
    notes: '',
  });

  const [searchParams] = useSearchParams();

  // Pricing source of truth: published DB pricing, with automatic static fallback.
  // Seeded with the static list, so the wizard renders immediately (no empty flash).
  const { industries } = usePricing();

  // Pre-select industry + tier from query params (e.g. /pricing?industry=estate-agents&tier=growth)
  // so "Get this package" links from Solutions pages land on the package step ready to confirm.
  useEffect(() => {
    const ind = searchParams.get('industry');
    const tier = searchParams.get('tier');
    if (ind && industries.some(i => i.slug === ind)) {
      setSelectedIndustry(ind);
      if (tier === 'base' || tier === 'growth' || tier === 'everything') {
        setSelectedTier(tier);
      }
      setStep(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const industry = industries.find(i => i.slug === selectedIndustry);
  const selectedPackage = industry?.packages.find(p => p.tier === selectedTier);

  const toggleSkill = (id: string) => {
    setSelectedSkills(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!form.firstName || !form.email || !form.businessName || !industry || !selectedPackage) return;

    setSubmitting(true);
    setSubmitError(false);
    const ref = generateQuoteRef();

    const pkg = selectedPackage;
    const baseIva = pkg.incVatPrice - pkg.exVatPrice;

    // INTERIM: flat add-on price — to be made admin-editable via DB.
    // Per-add-on figures derived from the single ADDON_MONTHLY_PRICE_EX_VAT constant.
    const addonEx = ADDON_MONTHLY_PRICE_EX_VAT;
    const addonIva = Math.round(addonEx * 0.21);
    const addonInc = Math.round(addonEx * 1.21);

    const selectedSkillNames = ADDON_SKILLS
      .filter(s => selectedSkills.has(s.id))
      .map(s => ({ id: s.id, name: s.name, exVatPrice: addonEx, ivaAmount: addonIva, totalIncVat: addonInc }));

    const modulesExVat = addonEx * selectedSkillNames.length;
    const modulesIva = addonIva * selectedSkillNames.length;
    const modulesIncVat = addonInc * selectedSkillNames.length;
    const totalExVat = pkg.exVatPrice + modulesExVat;
    const totalIva = baseIva + modulesIva;
    const totalIncVat = pkg.incVatPrice + modulesIncVat;

    const payload = {
      quote_reference: ref,
      client_first_name: form.firstName,
      client_last_name: form.lastName,
      business_name: form.businessName,
      email: form.email,
      phone: form.phone || null,
      industry_slug: industry.slug,
      industry_name: industry.name,
      base_package_name: `${industry.name} ${pkg.name}`,
      selected_tier: selectedTier,
      base_ex_vat: pkg.exVatPrice,
      base_iva: baseIva,
      base_inc_vat: pkg.incVatPrice,
      modules_selected: selectedSkillNames,
      modules_ex_vat_total: modulesExVat,
      modules_iva_total: modulesIva,
      modules_inc_vat_total: modulesIncVat,
      total_ex_vat: totalExVat,
      total_iva: totalIva,
      total_inc_vat: totalIncVat,
      client_notes: form.notes || null,
      status: 'new',
    };

    const { error } = await supabase.from('quotes').insert(payload);

    // Save failed: surface a clear error, keep the user's details, and let them
    // retry. Do NOT show the success screen or a reference for an unsaved quote.
    if (error) {
      console.error('Quote submission error:', error);
      setSubmitError(true);
      setSubmitting(false);
      return;
    }

    // Save confirmed — only now email the customer their quote + /quote/:ref link
    // via the send-quote-email edge function. Non-blocking: the quote is saved.
    try {
      await supabase.functions.invoke('send-quote-email', {
        body: {
          quoteReference: ref,
          clientFirstName: form.firstName,
          clientLastName: form.lastName,
          businessName: form.businessName,
          email: form.email,
          phone: form.phone || undefined,
          industryName: industry.name,
          industrySlug: industry.slug,
          basePackageName: `${industry.name} ${pkg.name}`,
          baseIncludes: pkg.includes,
          baseExVat: pkg.exVatPrice,
          baseIva: baseIva,
          baseIncVat: pkg.incVatPrice,
          selectedModules: selectedSkillNames,
          modulesExVatTotal: modulesExVat,
          modulesIvaTotal: modulesIva,
          modulesIncVatTotal: modulesIncVat,
          totalExVat: totalExVat,
          totalIva: totalIva,
          totalIncVat: totalIncVat,
          clientNotes: form.notes || undefined,
        },
      });
    } catch (emailErr) {
      console.error('Quote email failed to send:', emailErr);
    }

    setQuoteRef(ref);
    setSubmitted(true);
    setSubmitting(false);
  };

  // ─── Success Screen ─────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white font-sans">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="max-w-lg text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-green/10 flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-10 w-10 text-emerald-green" />
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-midnight-navy mb-4">
              {t('pricing.successTitle')}
            </h1>
            <p className="text-cool-gray text-lg mb-3">
              {t('pricing.successRef')} <span className="font-mono font-bold text-royal-purple">{quoteRef}</span>
            </p>
            <p className="text-cool-gray mb-10">
              {t('pricing.successBody', { email: form.email })}
            </p>
            <CTAGroup
              className="justify-center"
              primary={{ label: t('pricing.viewYourQuote'), href: `/quote/${quoteRef}` }}
              secondary={{ label: t('pricing.backHome'), href: '/' }}
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── Wizard ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white font-sans">
      <Header />

      {/* Light hero */}
      <Hero
        eyebrow={{ icon: Sparkles, label: t('pricing.heroEyebrow') }}
        title={t('pricing.heroTitle')}
        highlight={t('pricing.heroHighlight')}
        subtitle={t('pricing.heroSubtitle')}
      />

      <main className="flex-grow pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

          {/* Step Indicator */}
          <StepIndicator current={step} />

          {/* ─── Step 1: Pick Industry ─────────────────────────────── */}
          {step === 1 && (
            <div>
              <SectionHeading
                title={t('pricing.step1Title')}
                subtitle={t('pricing.step1Subtitle')}
                className="mb-8"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {industries.map(ind => {
                  const isSelected = selectedIndustry === ind.slug;
                  return (
                    <button
                      key={ind.slug}
                      onClick={() => setSelectedIndustry(ind.slug)}
                      className={`relative rounded-2xl p-5 text-left transition-all overflow-hidden bg-white ${
                        isSelected
                          ? 'border-2 border-royal-purple shadow-card'
                          : 'border border-soft-lilac/20 shadow-card hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary" />
                      <h3 className="font-semibold text-midnight-navy text-sm mt-1 mb-2">{ind.name}</h3>
                      <p className="text-cool-gray text-xs leading-relaxed line-clamp-2">{ind.painStatement}</p>
                      {ind.packages[0].voiceMinutes > 0 && (
                        <div className="flex items-center gap-1 mt-3 text-electric-blue text-[10px] font-medium">
                          <Mic className="h-3 w-3" />
                          {t('pricing.voiceIncluded')}
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle className="h-5 w-5 text-royal-purple" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end mt-10">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => setStep(2)}
                  disabled={!selectedIndustry}
                  className="group"
                >
                  {t('pricing.continue')}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          )}

          {/* ─── Step 2: Choose Package ────────────────────────────── */}
          {step === 2 && industry && (
            <div>
              <SectionHeading
                title={t('pricing.step2Title')}
                subtitle={t('pricing.step2Subtitle', { industry: industry.name })}
                className="mb-10"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {industry.packages.map(pkg => {
                  const isPopular = pkg.tier === 'growth';
                  const isSelected = selectedTier === pkg.tier;
                  return (
                    <PricingCard
                      key={pkg.tier}
                      name={pkg.name}
                      tagline={pkg.tagline}
                      price={`€${pkg.exVatPrice}`}
                      perMonthLabel={t('pricing.perMonth')}
                      vatNote={t('pricing.vatNote', { inc: pkg.incVatPrice })}
                      voiceNote={pkg.voiceMinutes > 0 ? t('pricing.voiceMinutes', { mins: pkg.voiceMinutes.toLocaleString() }) : undefined}
                      includes={pkg.includes}
                      popular={isPopular}
                      popularLabel={t('pricing.mostPopular')}
                      selected={isSelected}
                      onClick={() => setSelectedTier(pkg.tier)}
                      selectLabel={t('pricing.selectPackage')}
                      selectedLabel={t('pricing.selected')}
                    />
                  );
                })}
              </div>

              <div className="flex justify-between mt-10">
                <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('pricing.back')}
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => setStep(3)}
                  disabled={!selectedTier}
                  className="group"
                >
                  {t('pricing.continue')}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          )}

          {/* ─── Step 3: Add Extra Skills (optional) ───────────────── */}
          {step === 3 && (
            <div>
              <SectionHeading
                title={t('pricing.step3Title')}
                subtitle={t('pricing.step3Subtitle', { package: selectedPackage?.name })}
                className="mb-8"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {ADDON_SKILLS.map(skill => {
                  const isOn = selectedSkills.has(skill.id);
                  return (
                    <button
                      key={skill.id}
                      onClick={() => toggleSkill(skill.id)}
                      className={`relative rounded-2xl p-5 text-left transition-all bg-white ${
                        isOn
                          ? 'border-2 border-royal-purple shadow-card'
                          : 'border border-soft-lilac/20 shadow-card hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isOn ? 'bg-royal-purple/10 text-royal-purple' : 'bg-slate-50 text-cool-gray'
                        }`}>
                          {skill.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-midnight-navy text-sm mb-1">{skill.name}</h3>
                          <p className="text-cool-gray text-xs leading-relaxed">{skill.description}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          isOn ? 'border-royal-purple bg-royal-purple' : 'border-soft-lilac/40'
                        }`}>
                          {isOn && <CheckCircle className="h-3 w-3 text-white" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between mt-10">
                <Button variant="outline" size="lg" onClick={() => setStep(2)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('pricing.back')}
                </Button>
                <Button variant="hero" size="lg" onClick={() => setStep(4)} className="group">
                  {t('pricing.continue')}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          )}

          {/* ─── Step 4: Your Details ──────────────────────────────── */}
          {step === 4 && industry && (
            <div>
              <SectionHeading
                title={t('pricing.step4Title')}
                subtitle={t('pricing.step4Subtitle')}
                className="mb-8"
              />

              <div className="max-w-2xl mx-auto">
                {/* Summary strip */}
                <div className="bg-white border border-soft-lilac/20 shadow-card rounded-2xl p-5 mb-8">
                  <h3 className="text-xs font-semibold text-cool-gray uppercase tracking-wider mb-3">{t('pricing.summaryHeading')}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-emerald-green" />
                    <span className="text-midnight-navy text-sm font-medium">
                      {industry.name} {selectedPackage?.name}
                      {selectedPackage && <span className="text-cool-gray font-normal"> — €{selectedPackage.exVatPrice}{t('pricing.perMonth')}</span>}
                    </span>
                  </div>
                  {ADDON_SKILLS.filter(s => selectedSkills.has(s.id)).map(s => (
                    <div key={s.id} className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-3.5 w-3.5 text-royal-purple" />
                      <span className="text-cool-gray text-sm">{s.name}</span>
                    </div>
                  ))}
                  {selectedSkills.size === 0 && (
                    <p className="text-cool-gray text-sm mt-1">{t('pricing.summaryNoExtras', { package: selectedPackage?.name })}</p>
                  )}
                </div>

                {/* Form */}
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-midnight-navy/70 font-medium">{t('pricing.firstName')} *</label>
                      <Input
                        value={form.firstName}
                        onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                        placeholder={t('pricing.firstNamePlaceholder')}
                        className="focus:border-royal-purple"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-midnight-navy/70 font-medium">{t('pricing.lastName')}</label>
                      <Input
                        value={form.lastName}
                        onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                        placeholder={t('pricing.lastNamePlaceholder')}
                        className="focus:border-royal-purple"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-midnight-navy/70 font-medium">{t('pricing.businessName')} *</label>
                    <Input
                      value={form.businessName}
                      onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
                      placeholder={t('pricing.businessPlaceholder')}
                      className="focus:border-royal-purple"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-midnight-navy/70 font-medium">{t('pricing.emailLabel')} *</label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder={t('pricing.emailPlaceholder')}
                        className="focus:border-royal-purple"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-midnight-navy/70 font-medium">{t('pricing.phoneLabel')}</label>
                      <Input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder={t('pricing.phonePlaceholder')}
                        className="focus:border-royal-purple"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-midnight-navy/70 font-medium">{t('pricing.notesLabel')}</label>
                    <Textarea
                      value={form.notes}
                      onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      placeholder={t('pricing.notesPlaceholder')}
                      rows={3}
                      className="focus:border-royal-purple resize-none"
                    />
                  </div>
                </div>

                {submitError && (
                  <div className="mt-6 flex items-start gap-3 rounded-xl border border-coral-orange/30 bg-coral-orange/10 p-4">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-coral-orange" />
                    <p className="text-sm text-midnight-navy">{t('pricing.submitError')}</p>
                  </div>
                )}

                <div className="flex flex-col gap-4 mt-10 sm:flex-row sm:justify-between">
                  <Button variant="outline" size="lg" onClick={() => setStep(3)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('pricing.back')}
                  </Button>
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={submitting || !form.firstName || !form.email || !form.businessName}
                    className="group"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t('pricing.submitting')}
                      </>
                    ) : (
                      <>
                        {t('pricing.submit')}
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-center text-cool-gray text-xs mt-6">
                  {t('pricing.disclaimer')}
                </p>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
