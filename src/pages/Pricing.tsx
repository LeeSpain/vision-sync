import { useState } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowRight, ArrowLeft, CheckCircle, Mic, Loader2,
  Mail, MessageSquare, RefreshCw, BarChart3, Phone,
  Calendar, UserCheck, Star, MessageCircle, Bot
} from 'lucide-react';
import { INDUSTRIES } from '@/data/industries';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

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
  { num: 1, label: 'Your Industry' },
  { num: 2, label: 'Base Package' },
  { num: 3, label: 'Extra Skills' },
  { num: 4, label: 'Your Details' },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-12">
      {STEPS.map((step, idx) => (
        <div key={step.num} className="flex items-center">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            current === step.num
              ? 'bg-cyan-500 text-white'
              : current > step.num
                ? 'bg-cyan-500/20 text-cyan-300'
                : 'bg-white/5 text-white/40'
          }`}>
            {current > step.num ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs">
                {step.num}
              </span>
            )}
            <span className="hidden sm:inline">{step.label}</span>
          </div>
          {idx < STEPS.length - 1 && (
            <div className={`w-8 h-px mx-1 ${current > step.num ? 'bg-cyan-500/40' : 'bg-white/10'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Color Maps ──────────────────────────────────────────────────────────────

const accentColorMap: Record<string, string> = {
  blue: 'border-blue-500 bg-blue-500/10',
  green: 'border-emerald-500 bg-emerald-500/10',
  purple: 'border-purple-500 bg-purple-500/10',
  orange: 'border-orange-500 bg-orange-500/10',
  amber: 'border-amber-500 bg-amber-500/10',
  red: 'border-red-500 bg-red-500/10',
  pink: 'border-pink-500 bg-pink-500/10',
};

const stripColorMap: Record<string, string> = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  pink: 'bg-pink-500',
};

// ─── Quote Reference Generator ───────────────────────────────────────────────

function generateQuoteRef(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `QT-${year}-${rand}`;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Pricing() {
  const [step, setStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [quoteRef, setQuoteRef] = useState('');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    email: '',
    phone: '',
    notes: '',
  });

  const industry = INDUSTRIES.find(i => i.slug === selectedIndustry);

  const toggleSkill = (id: string) => {
    setSelectedSkills(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!form.firstName || !form.email || !form.businessName || !industry) return;

    setSubmitting(true);
    const ref = generateQuoteRef();

    const selectedSkillNames = ADDON_SKILLS
      .filter(s => selectedSkills.has(s.id))
      .map(s => ({ id: s.id, name: s.name, exVatPrice: 0, ivaAmount: 0, totalIncVat: 0 }));

    const payload = {
      quote_reference: ref,
      client_first_name: form.firstName,
      client_last_name: form.lastName,
      business_name: form.businessName,
      email: form.email,
      phone: form.phone || null,
      industry_slug: industry.slug,
      industry_name: industry.name,
      base_package_name: `${industry.name} Base`,
      base_ex_vat: 0,
      base_iva: 0,
      base_inc_vat: 0,
      modules_selected: selectedSkillNames,
      modules_ex_vat_total: 0,
      modules_iva_total: 0,
      modules_inc_vat_total: 0,
      total_ex_vat: 0,
      total_iva: 0,
      total_inc_vat: 0,
      client_notes: form.notes || null,
      status: 'new',
    };

    const { error } = await supabase.from('quotes').insert(payload);

    if (error) {
      console.error('Quote submission error:', error);
    }

    setQuoteRef(ref);
    setSubmitted(true);
    setSubmitting(false);
  };

  // ─── Success Screen ─────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0f1e] font-sans">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="max-w-lg text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-10 w-10 text-emerald-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Quote Request Received
            </h1>
            <p className="text-white/60 text-lg mb-3">
              Your reference: <span className="font-mono font-bold text-cyan-400">{quoteRef}</span>
            </p>
            <p className="text-white/50 mb-10">
              We'll review your requirements and send a personalised proposal to <strong className="text-white/80">{form.email}</strong> within 24 hours.
            </p>
            <Link to="/">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-8 py-5">
                Back to Homepage
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── Wizard ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1e] font-sans">
      <Header />
      <main className="flex-grow pt-28 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Get Your Custom Quote
            </h1>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Tell us about your business, pick the AI skills you need, and receive a personalised proposal — no obligation, no hidden fees.
            </p>
          </div>

          {/* Step Indicator */}
          <StepIndicator current={step} />

          {/* ─── Step 1: Pick Industry ─────────────────────────────── */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-2 text-center">Which industry are you in?</h2>
              <p className="text-white/40 text-center mb-8">Select the industry that best matches your business.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {INDUSTRIES.map(ind => {
                  const isSelected = selectedIndustry === ind.slug;
                  const stripColor = stripColorMap[ind.color] || 'bg-blue-500';
                  const selectedClass = isSelected
                    ? (accentColorMap[ind.color] || 'border-blue-500 bg-blue-500/10') + ' border-2'
                    : 'border border-white/10 bg-white/[0.03] hover:bg-white/[0.06]';

                  return (
                    <button
                      key={ind.slug}
                      onClick={() => setSelectedIndustry(ind.slug)}
                      className={`relative rounded-2xl p-5 text-left transition-all overflow-hidden ${selectedClass}`}
                    >
                      <div className={`absolute top-0 left-0 w-full h-1 ${stripColor}`} />
                      <h3 className="font-semibold text-white text-sm mt-1 mb-2">{ind.name}</h3>
                      <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{ind.painStatement}</p>
                      {ind.voiceIncluded && (
                        <div className="flex items-center gap-1 mt-3 text-cyan-400 text-[10px] font-medium">
                          <Mic className="h-3 w-3" />
                          Voice included
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle className="h-5 w-5 text-cyan-400" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end mt-10">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedIndustry}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-8 py-5 disabled:opacity-40"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* ─── Step 2: Base Package ──────────────────────────────── */}
          {step === 2 && industry && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-2 text-center">Your {industry.name} Base Package</h2>
              <p className="text-white/40 text-center mb-8">Here's what's included as standard in every {industry.name} package.</p>

              <div className="max-w-2xl mx-auto bg-white/[0.04] border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl ${stripColorMap[industry.color] || 'bg-blue-500'} flex items-center justify-center`}>
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{industry.name}</h3>
                    <p className="text-white/40 text-sm">Industry-optimised AI base package</p>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {industry.baseIncludes.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <CheckCircle className="h-3 w-3 text-emerald-400" />
                      </div>
                      <span className="text-white/70 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>

                {industry.voiceIncluded && (
                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 flex items-center gap-3">
                    <Mic className="h-5 w-5 text-cyan-400 shrink-0" />
                    <div>
                      <p className="font-medium text-cyan-300 text-sm">Voice Agent Included</p>
                      <p className="text-cyan-400/60 text-xs">{industry.voiceMinutes?.toLocaleString()} inbound minutes per month</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-10">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="border-white/20 text-white/60 hover:bg-white/5 px-6 py-5"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-8 py-5"
                >
                  Add Extra Skills
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* ─── Step 3: Add Extra Skills ──────────────────────────── */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-2 text-center">Add Extra AI Skills</h2>
              <p className="text-white/40 text-center mb-8">Toggle on any additional capabilities you'd like included in your quote. Select as many as you need.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {ADDON_SKILLS.map(skill => {
                  const isOn = selectedSkills.has(skill.id);
                  return (
                    <button
                      key={skill.id}
                      onClick={() => toggleSkill(skill.id)}
                      className={`relative rounded-2xl p-5 text-left transition-all ${
                        isOn
                          ? 'bg-cyan-500/10 border-2 border-cyan-500'
                          : 'bg-white/[0.03] border border-white/10 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isOn ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-white/40'
                        }`}>
                          {skill.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-sm mb-1">{skill.name}</h3>
                          <p className="text-white/40 text-xs leading-relaxed">{skill.description}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          isOn ? 'border-cyan-400 bg-cyan-400' : 'border-white/20'
                        }`}>
                          {isOn && <CheckCircle className="h-3 w-3 text-[#0a0f1e]" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between mt-10">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="border-white/20 text-white/60 hover:bg-white/5 px-6 py-5"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-8 py-5"
                >
                  Continue to Details
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* ─── Step 4: Your Details ──────────────────────────────── */}
          {step === 4 && industry && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-2 text-center">Your Details</h2>
              <p className="text-white/40 text-center mb-8">Tell us about you and your business so we can prepare your personalised quote.</p>

              <div className="max-w-2xl mx-auto">
                {/* Summary strip */}
                <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 mb-8">
                  <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Quote Summary</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-white text-sm font-medium">{industry.name} Base Package</span>
                  </div>
                  {ADDON_SKILLS.filter(s => selectedSkills.has(s.id)).map(s => (
                    <div key={s.id} className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-3.5 w-3.5 text-cyan-400" />
                      <span className="text-white/60 text-sm">{s.name}</span>
                    </div>
                  ))}
                  {selectedSkills.size === 0 && (
                    <p className="text-white/30 text-sm mt-1">No extra skills selected — base package only.</p>
                  )}
                </div>

                {/* Form */}
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-white/50 font-medium">First name *</label>
                      <Input
                        value={form.firstName}
                        onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                        placeholder="John"
                        className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/20 focus:border-cyan-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-white/50 font-medium">Last name</label>
                      <Input
                        value={form.lastName}
                        onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                        placeholder="Smith"
                        className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/20 focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/50 font-medium">Business name *</label>
                    <Input
                      value={form.businessName}
                      onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
                      placeholder="Acme Properties SL"
                      className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/20 focus:border-cyan-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-white/50 font-medium">Email *</label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="john@acme.es"
                        className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/20 focus:border-cyan-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-white/50 font-medium">Phone</label>
                      <Input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+34 600 123 456"
                        className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/20 focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/50 font-medium">Anything else we should know?</label>
                    <Textarea
                      value={form.notes}
                      onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      placeholder="Tell us about your business, specific needs, or questions..."
                      rows={3}
                      className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/20 focus:border-cyan-500 resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-10">
                  <Button
                    variant="outline"
                    onClick={() => setStep(3)}
                    className="border-white/20 text-white/60 hover:bg-white/5 px-6 py-5"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting || !form.firstName || !form.email || !form.businessName}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-8 py-5 disabled:opacity-40"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Quote Request
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-center text-white/30 text-xs mt-6">
                  No obligation. We'll prepare a personalised proposal and send it to your email within 24 hours.
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
