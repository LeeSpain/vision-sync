import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, Loader2, ArrowLeft, Package, Plus, Mic } from 'lucide-react';
import { INDUSTRIES } from '@/data/industries';
import { Industry, QuoteModule } from '@/types/industries';
import { useToast } from '@/hooks/use-toast';

interface ModuleRow {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  features: string[] | null;
  ex_vat_price: number | null;
  iva_amount: number | null;
  total_inc_vat: number | null;
  is_voice_module: boolean | null;
  voice_minutes: number | null;
  industry_slugs: string[] | null;
  is_active: boolean | null;
}

interface QuoteFormData {
  firstName: string;
  lastName: string;
  businessName: string;
  email: string;
  phone: string;
  clientNotes: string;
}

export default function ModulePicker() {
  const { industrySlug } = useParams<{ industrySlug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [industry, setIndustry] = useState<Industry | null>(null);
  const [availableModules, setAvailableModules] = useState<QuoteModule[]>([]);
  const [selectedModuleIds, setSelectedModuleIds] = useState<Set<string>>(new Set());
  const [loadingModules, setLoadingModules] = useState(true);
  const [showDetailsGate, setShowDetailsGate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<QuoteFormData>({
    firstName: '',
    lastName: '',
    businessName: '',
    email: '',
    phone: '',
    clientNotes: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<QuoteFormData>>({});

  useEffect(() => {
    if (!industrySlug) {
      navigate('/');
      return;
    }
    const found = INDUSTRIES.find(i => i.slug === industrySlug);
    if (!found) {
      navigate('/');
      return;
    }
    setIndustry(found);
    fetchModules(industrySlug);
  }, [industrySlug, navigate]);

  const fetchModules = async (slug: string) => {
    setLoadingModules(true);
    const { data, error } = await supabase
      .from('modules')
      .select('id, name, slug, short_description, features, ex_vat_price, iva_amount, total_inc_vat, is_voice_module, voice_minutes, industry_slugs, is_active')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Failed to fetch modules:', error.message);
      setLoadingModules(false);
      return;
    }

    const rows = (data || []) as ModuleRow[];
    const filtered = rows.filter(mod => {
      if (!mod.industry_slugs) return false;
      return (mod.industry_slugs as string[]).includes(slug);
    });

    const mapped: QuoteModule[] = filtered.map(mod => ({
      id: mod.id,
      name: mod.name,
      slug: mod.slug,
      shortDescription: mod.short_description || '',
      exVatPrice: mod.ex_vat_price || 0,
      ivaAmount: mod.iva_amount || 0,
      totalIncVat: mod.total_inc_vat || 0,
      isVoice: mod.is_voice_module || false,
      voiceMinutes: mod.voice_minutes || undefined
    }));

    setAvailableModules(mapped);
    setLoadingModules(false);
  };

  const toggleModule = (moduleId: string) => {
    setSelectedModuleIds(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const selectedModules = availableModules.filter(m => selectedModuleIds.has(m.id));

  const validateForm = (): boolean => {
    const errors: Partial<QuoteFormData> = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.businessName.trim()) errors.businessName = 'Business name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !industry) return;
    setSubmitting(true);

    try {
      const modulesExVat = selectedModules.reduce((sum, m) => sum + m.exVatPrice, 0);
      const modulesIva = selectedModules.reduce((sum, m) => sum + m.ivaAmount, 0);
      const modulesIncVat = selectedModules.reduce((sum, m) => sum + m.totalIncVat, 0);
      const basePkg = industry.packages[0];
      const baseIva = basePkg.incVatPrice - basePkg.exVatPrice;
      const totalExVat = basePkg.exVatPrice + modulesExVat;
      const totalIva = baseIva + modulesIva;
      const totalIncVat = basePkg.incVatPrice + modulesIncVat;

      const quoteRef = `VS-${new Date().toISOString().slice(0,7).replace('-','')}-${Math.random().toString(36).substring(2,8).toUpperCase()}`;

      const modulesSelected = selectedModules.map(m => ({
        id: m.id,
        name: m.name,
        exVatPrice: m.exVatPrice,
        ivaAmount: m.ivaAmount,
        totalIncVat: m.totalIncVat
      }));

      const { data: insertedQuote, error: insertError } = await supabase
        .from('quotes')
        .insert({
          quote_reference: quoteRef,
          client_first_name: formData.firstName,
          client_last_name: formData.lastName,
          business_name: formData.businessName,
          email: formData.email,
          phone: formData.phone || null,
          industry_slug: industry.slug,
          industry_name: industry.name,
          base_package_name: `${industry.name} Base Package`,
          base_ex_vat: basePkg.exVatPrice,
          base_iva: baseIva,
          base_inc_vat: basePkg.incVatPrice,
          modules_selected: modulesSelected,
          modules_ex_vat_total: modulesExVat,
          modules_iva_total: modulesIva,
          modules_inc_vat_total: modulesIncVat,
          total_ex_vat: totalExVat,
          total_iva: totalIva,
          total_inc_vat: totalIncVat,
          client_notes: formData.clientNotes || null,
          status: 'new'
        })
        .select('quote_reference')
        .single();

      if (insertError) throw new Error(`Failed to save quote: ${insertError.message}`);
      if (!insertedQuote) throw new Error('Quote was not saved correctly');

      // Send quote email via edge function
      try {
        await supabase.functions.invoke('send-quote-email', {
          body: {
            quoteReference: insertedQuote.quote_reference,
            clientFirstName: formData.firstName,
            clientLastName: formData.lastName,
            businessName: formData.businessName,
            email: formData.email,
            phone: formData.phone || undefined,
            industryName: industry.name,
            industrySlug: industry.slug,
            basePackageName: `${industry.name} Base Package`,
            baseIncludes: basePkg.includes,
            baseExVat: basePkg.exVatPrice,
            baseIva: baseIva,
            baseIncVat: basePkg.incVatPrice,
            selectedModules: modulesSelected,
            modulesExVatTotal: modulesExVat,
            modulesIvaTotal: modulesIva,
            modulesIncVatTotal: modulesIncVat,
            totalExVat,
            totalIva,
            totalIncVat,
            clientNotes: formData.clientNotes || undefined
          }
        });
      } catch (emailErr) {
        // Email failure should not block the user — quote is already saved
        console.error('Quote email failed to send:', emailErr);
      }

      navigate(`/quote/${insertedQuote.quote_reference}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!industry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
      </div>
    );
  }

  const basePkg = industry.packages[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow pt-28 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

          {/* Back link */}
          <Link
            to={`/solutions/${industry.slug}`}
            className="inline-flex items-center gap-2 text-cool-gray hover:text-midnight-navy text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {industry.name}
          </Link>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-midnight-navy mb-3">
              Build your {industry.name} package
            </h1>
            <p className="text-lg text-cool-gray">
              Your base package is already included. Add the tools your business needs.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">

              {/* Base Package Card */}
              <Card className="border-emerald-500/30 bg-emerald-50/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-midnight-navy flex items-center gap-2">
                      <Package className="h-5 w-5 text-emerald-green" />
                      {industry.name} Base Package
                    </CardTitle>
                    <span className="text-xs font-semibold px-3 py-1 bg-emerald-green/10 text-emerald-700 rounded-full border border-emerald-200">
                      Always Included
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {basePkg.includes.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-midnight-navy">
                        <CheckCircle className="h-4 w-4 text-emerald-green shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                  {basePkg.voiceMinutes > 0 && (
                    <div className="mt-4 flex items-center gap-2 text-emerald-700 bg-emerald-green/10 px-3 py-2 rounded-lg text-sm font-medium">
                      <Mic className="h-4 w-4" />
                      {basePkg.voiceMinutes.toLocaleString()} voice minutes/month included
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Add-on Modules */}
              <div>
                <h2 className="text-lg font-bold text-midnight-navy mb-4 flex items-center gap-2">
                  <Plus className="h-5 w-5 text-electric-blue" />
                  Available Add-ons
                </h2>

                {loadingModules ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
                  </div>
                ) : availableModules.length === 0 ? (
                  <div className="text-center py-12 text-cool-gray bg-white rounded-xl border border-soft-lilac/20">
                    <p className="font-medium">No add-on modules available for this industry yet.</p>
                    <p className="text-sm mt-2">Your base package includes everything you need to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availableModules.map(mod => {
                      const isSelected = selectedModuleIds.has(mod.id);
                      return (
                        <button
                          key={mod.id}
                          onClick={() => toggleModule(mod.id)}
                          className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                            isSelected
                              ? 'border-electric-blue bg-electric-blue/5 shadow-md'
                              : 'border-soft-lilac/20 bg-white hover:border-slate-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <span className="font-semibold text-midnight-navy">{mod.name}</span>
                                {mod.isVoice && (
                                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                                    <Mic className="h-3 w-3" />
                                    Voice
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-cool-gray">{mod.shortDescription}</p>
                              {mod.isVoice && mod.voiceMinutes && (
                                <p className="text-xs text-blue-600 mt-1">{mod.voiceMinutes.toLocaleString()} mins/month</p>
                              )}
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                              isSelected ? 'bg-electric-blue border-electric-blue' : 'border-slate-300'
                            }`}>
                              {isSelected && <CheckCircle className="h-4 w-4 text-white" />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <Card className="bg-midnight-navy text-white">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Your Package</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-2">
                        <CheckCircle className="h-4 w-4" />
                        Base Package
                      </div>
                      <p className="text-white/80 text-sm">{industry.name}</p>
                    </div>

                    {selectedModules.length > 0 && (
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider mb-2">
                          {selectedModules.length} Add-on{selectedModules.length !== 1 ? 's' : ''}
                        </p>
                        <ul className="space-y-1">
                          {selectedModules.map(m => (
                            <li key={m.id} className="text-sm text-white/80 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-electric-blue/60 shrink-0" />
                              {m.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedModules.length === 0 && (
                      <p className="text-white/40 text-sm italic">No add-ons selected</p>
                    )}

                    <div className="border-t border-white/10 pt-4">
                      <Button
                        onClick={() => setShowDetailsGate(true)}
                        className="w-full bg-electric-blue hover:bg-electric-blue/90 text-white font-semibold"
                      >
                        Get your free quote →
                      </Button>
                      <p className="text-white/40 text-xs text-center mt-3">
                        No obligation. Quote emailed instantly.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Details Gate Modal */}
      <Dialog open={showDetailsGate} onOpenChange={setShowDetailsGate}>
        <DialogContent className="max-w-lg bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-midnight-navy text-xl">Get your personalised quote</DialogTitle>
            <p className="text-cool-gray text-sm">
              Your quote will be emailed to you instantly. No obligation.
            </p>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium">First Name <span className="text-coral-orange">*</span></Label>
                <Input
                  value={formData.firstName}
                  onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Juan"
                  className={formErrors.firstName ? 'border-red-400' : ''}
                />
                {formErrors.firstName && <p className="text-red-500 text-xs">{formErrors.firstName}</p>}
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium">Last Name <span className="text-coral-orange">*</span></Label>
                <Input
                  value={formData.lastName}
                  onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="García"
                  className={formErrors.lastName ? 'border-red-400' : ''}
                />
                {formErrors.lastName && <p className="text-red-500 text-xs">{formErrors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium">Business Name <span className="text-coral-orange">*</span></Label>
              <Input
                value={formData.businessName}
                onChange={e => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                placeholder="My Business SL"
                className={formErrors.businessName ? 'border-red-400' : ''}
              />
              {formErrors.businessName && <p className="text-red-500 text-xs">{formErrors.businessName}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium">Email <span className="text-coral-orange">*</span></Label>
              <Input
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="juan@mybusiness.com"
                className={formErrors.email ? 'border-red-400' : ''}
              />
              {formErrors.email && <p className="text-red-500 text-xs">{formErrors.email}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium">Phone <span className="text-cool-gray font-normal">(optional)</span></Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+34 600 000 000"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-medium">Anything specific you'd like to know? <span className="text-cool-gray font-normal">(optional)</span></Label>
              <Textarea
                value={formData.clientNotes}
                onChange={e => setFormData(prev => ({ ...prev, clientNotes: e.target.value }))}
                placeholder="Any questions, requirements, or special circumstances..."
                rows={3}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-midnight-navy hover:bg-midnight-navy/90 text-white font-semibold py-6 text-base"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Sending your quote...
                </>
              ) : (
                'Send me my quote →'
              )}
            </Button>

            <p className="text-center text-xs text-cool-gray">
              Your personalised quote will be emailed to you instantly. No obligation.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
