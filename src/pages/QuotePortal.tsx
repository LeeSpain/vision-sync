import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Loader2, Home, Calendar, Phone, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { DarkBand } from '@/components/ui-system';

interface SelectedModule {
  id: string;
  name: string;
  exVatPrice: number;
  ivaAmount: number;
  totalIncVat: number;
}

interface QuoteRow {
  id: string;
  quote_reference: string;
  client_first_name: string;
  client_last_name: string;
  business_name: string;
  email: string;
  phone: string | null;
  industry_slug: string;
  industry_name: string;
  base_package_name: string;
  selected_tier: string | null;
  base_ex_vat: number;
  base_iva: number;
  base_inc_vat: number;
  modules_selected: SelectedModule[];
  modules_ex_vat_total: number;
  modules_iva_total: number;
  modules_inc_vat_total: number;
  total_ex_vat: number;
  total_iva: number;
  total_inc_vat: number;
  client_notes: string | null;
  status: string;
  sent_at: string | null;
  viewed_at: string | null;
  contacted_at: string | null;
  created_at: string;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export default function QuotePortal() {
  const { quoteReference } = useParams<{ quoteReference: string }>();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [quote, setQuote] = useState<QuoteRow | null>(null);
  const [packageDetail, setPackageDetail] = useState<{ voiceMinutes: number; includes: string[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [showRequestChange, setShowRequestChange] = useState(false);
  const [changeMessage, setChangeMessage] = useState('');
  const [sendingChange, setSendingChange] = useState(false);

  useEffect(() => {
    if (!quoteReference) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    loadQuote(quoteReference);
  }, [quoteReference]);

  const loadQuote = async (ref: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('quote_reference', ref)
      .single();

    if (error || !data) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const quoteData = data as QuoteRow;
    setQuote(quoteData);

    // Mark as viewed if not already
    if (!quoteData.viewed_at) {
      await supabase
        .from('quotes')
        .update({ viewed_at: new Date().toISOString(), status: quoteData.status === 'new' ? 'viewed' : quoteData.status })
        .eq('id', quoteData.id);
    }

    // Re-derive voice minutes + "what's included" from the canonical pricing
    // tables (no extra columns on quotes) via industry_slug + selected_tier.
    if (quoteData.industry_slug && quoteData.selected_tier) {
      const { data: ind } = await supabase
        .from('pricing_industries')
        .select('id')
        .eq('slug', quoteData.industry_slug)
        .maybeSingle();
      if (ind) {
        const { data: pkg } = await supabase
          .from('pricing_packages')
          .select('voice_minutes, includes')
          .eq('industry_id', ind.id)
          .eq('tier', quoteData.selected_tier)
          .maybeSingle();
        if (pkg) {
          setPackageDetail({
            voiceMinutes: Number(pkg.voice_minutes) || 0,
            includes: Array.isArray(pkg.includes) ? (pkg.includes as string[]) : [],
          });
        }
      }
    }

    setLoading(false);
  };

  const handleAccept = async () => {
    if (!quote) return;
    setAccepting(true);
    const { error } = await supabase
      .from('quotes')
      .update({ status: 'accepted' })
      .eq('id', quote.id);

    if (error) {
      toast({ title: t('quotePortal.toastErrorTitle'), description: t('quotePortal.toastAcceptFail'), variant: 'destructive' });
    } else {
      setAccepted(true);
      toast({ title: t('quotePortal.toastAcceptedTitle'), description: t('quotePortal.toastAcceptedDesc') });
    }
    setAccepting(false);
  };

  const handleRequestChange = async () => {
    if (!changeMessage.trim() || !quote) return;
    setSendingChange(true);

    // Log the change request — in production this would trigger a notification
    console.log('Change request for quote:', quote.quote_reference, changeMessage);

    setSendingChange(false);
    setShowRequestChange(false);
    setChangeMessage('');
    toast({
      title: t('quotePortal.toastChangeSentTitle'),
      description: t('quotePortal.toastChangeSentDesc')
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-electric-blue mx-auto mb-4" />
          <p className="text-cool-gray">{t('quotePortal.loading')}</p>
        </div>
      </div>
    );
  }

  if (notFound || !quote) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-soft-lilac/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="h-10 w-10 text-cool-gray" />
            </div>
            <h1 className="text-2xl font-bold text-midnight-navy mb-3">{t('quotePortal.notFoundTitle')}</h1>
            <p className="text-cool-gray mb-8">
              {t('quotePortal.notFoundDesc')}
            </p>
            <Link to="/">
              <Button className="bg-midnight-navy hover:bg-midnight-navy/90 text-white">
                {t('quotePortal.goHome')}
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const modules = Array.isArray(quote.modules_selected) ? quote.modules_selected : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow pt-28 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">

          {/* Quote Header */}
          <DarkBand as="div" className="rounded-t-2xl p-10 text-center">
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-black text-2xl">V</span>
            </div>
            <h1 className="text-white text-3xl font-bold mb-2">{t('quotePortal.heroTitle')}</h1>
            <p className="text-white/70 text-sm">{t('quotePortal.heroSubtitle')}</p>
            <div className="mt-6 inline-block bg-white/10 border border-white/20 rounded-lg px-6 py-3">
              <p className="text-white/60 text-xs uppercase tracking-wider mb-1">{t('quotePortal.quoteReference')}</p>
              <p className="text-white font-mono font-bold text-xl tracking-widest">{quote.quote_reference}</p>
            </div>
          </DarkBand>

          {/* Quote Body */}
          <div className="bg-white rounded-b-2xl shadow-lg p-8">

            {/* Client & Date */}
            <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-soft-lilac/20">
              <div>
                <p className="text-xs text-cool-gray uppercase tracking-wider mb-1">{t('quotePortal.preparedFor')}</p>
                <p className="font-bold text-midnight-navy text-lg">{quote.client_first_name} {quote.client_last_name}</p>
                <p className="text-cool-gray">{quote.business_name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-cool-gray uppercase tracking-wider mb-1">{t('quotePortal.quoteDate')}</p>
                <p className="font-semibold text-midnight-navy">{formatDate(quote.created_at)}</p>
                <p className="text-xs text-cool-gray mt-1">{t('quotePortal.industry')}: {quote.industry_name}</p>
              </div>
            </div>

            {/* Base Package */}
            <div className="mb-6">
              <h2 className="text-sm font-bold text-midnight-navy uppercase tracking-wider mb-4">
                {t('quotePortal.basePackage')}
              </h2>
              <div className="bg-slate-50 rounded-xl border border-soft-lilac/30 p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-midnight-navy">{quote.base_package_name}</p>
                    <p className="text-sm text-cool-gray mt-1">{t('quotePortal.alwaysIncluded')}</p>
                  </div>
                </div>

                {packageDetail && packageDetail.voiceMinutes > 0 && (
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-electric-blue">
                    <Mic className="h-4 w-4 shrink-0" />
                    {t('pricing.voiceMinutes', { mins: packageDetail.voiceMinutes.toLocaleString() })}
                  </div>
                )}

                {packageDetail && packageDetail.includes.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-cool-gray uppercase tracking-wide mb-2">{t('quotePortal.whatsIncluded')}</p>
                    <ul className="space-y-2">
                      {packageDetail.includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-midnight-navy/80">
                          <CheckCircle className="h-4 w-4 text-emerald-green shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-soft-lilac/30 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-cool-gray uppercase tracking-wide">{t('quotePortal.exIva')}</p>
                    <p className="font-semibold text-midnight-navy">{formatCurrency(quote.base_ex_vat)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cool-gray uppercase tracking-wide">{t('quotePortal.iva21')}</p>
                    <p className="font-semibold text-cool-gray">{formatCurrency(quote.base_iva)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cool-gray uppercase tracking-wide">{t('quotePortal.monthlyTotal')}</p>
                    <p className="font-bold text-midnight-navy">{formatCurrency(quote.base_inc_vat)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add-on Modules */}
            {modules.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-bold text-midnight-navy uppercase tracking-wider mb-4">
                  {t('quotePortal.addonModules')}
                </h2>
                <div className="space-y-3">
                  {modules.map((mod, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-xl border border-soft-lilac/30 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="h-4 w-4 text-electric-blue" />
                        <span className="font-semibold text-midnight-navy">{mod.name}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs text-cool-gray uppercase tracking-wide">{t('quotePortal.exIva')}</p>
                          <p className="font-semibold text-midnight-navy">{formatCurrency(mod.exVatPrice)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-cool-gray uppercase tracking-wide">{t('quotePortal.iva21')}</p>
                          <p className="font-semibold text-cool-gray">{formatCurrency(mod.ivaAmount)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-cool-gray uppercase tracking-wide">{t('quotePortal.monthlyTotal')}</p>
                          <p className="font-bold text-midnight-navy">{formatCurrency(mod.totalIncVat)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total Summary */}
            <DarkBand as="div" glow={false} className="rounded-xl p-6 mb-8">
              <div className="flex justify-between items-center text-white/60 text-sm mb-2">
                <span>{t('quotePortal.subtotalExIva')}</span>
                <span>{formatCurrency(quote.total_ex_vat)}</span>
              </div>
              <div className="flex justify-between items-center text-white/60 text-sm mb-4">
                <span>{t('quotePortal.iva21')}</span>
                <span>{formatCurrency(quote.total_iva)}</span>
              </div>
              <div className="flex justify-between items-center text-white border-t border-white/10 pt-4">
                <span className="text-lg font-bold">{t('quotePortal.monthlyInvestment')}</span>
                <span className="text-3xl font-black">{formatCurrency(quote.total_inc_vat)}</span>
              </div>
            </DarkBand>

            {/* Client Notes */}
            {quote.client_notes && (
              <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs text-amber-700 uppercase tracking-wider mb-1 font-semibold">{t('quotePortal.yourNotes')}</p>
                <p className="text-slate-700 text-sm">{quote.client_notes}</p>
              </div>
            )}

            {/* CTAs */}
            {!accepted && (
              <div className="space-y-3">
                <Button
                  onClick={handleAccept}
                  disabled={accepting || quote.status === 'accepted'}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 text-base"
                >
                  {accepting ? (
                    <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> {t('quotePortal.processing')}</>
                  ) : quote.status === 'accepted' ? (
                    <><CheckCircle className="h-5 w-5 mr-2" /> {t('quotePortal.packageAccepted')}</>
                  ) : (
                    t('quotePortal.wantPackage')
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRequestChange(true)}
                  className="w-full border-soft-lilac/40 text-midnight-navy hover:bg-slate-50"
                >
                  {t('quotePortal.requestChange')}
                </Button>
              </div>
            )}

            {accepted && (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-midnight-navy mb-2">{t('quotePortal.acceptedTitle')}</h3>
                <p className="text-cool-gray">{t('quotePortal.acceptedDesc')}</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-soft-lilac/20 text-center">
              <div className="flex items-center justify-center gap-4 text-sm text-cool-gray">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {t('quotePortal.responseTime')}
                </span>
                <span>|</span>
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {t('quotePortal.location')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-3">
                Vision-Sync Forge | <a href="https://www.vision-sync.co" className="hover:text-electric-blue transition-colors">vision-sync.co</a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Request Change Modal */}
      <Dialog open={showRequestChange} onOpenChange={setShowRequestChange}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-midnight-navy">{t('quotePortal.requestChange')}</DialogTitle>
            <p className="text-cool-gray text-sm">{t('quotePortal.changeModalDesc')}</p>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Textarea
              value={changeMessage}
              onChange={e => setChangeMessage(e.target.value)}
              placeholder={t('quotePortal.changePlaceholder')}
              rows={4}
            />
            <Button
              onClick={handleRequestChange}
              disabled={!changeMessage.trim() || sendingChange}
              className="w-full bg-midnight-navy hover:bg-midnight-navy/90 text-white"
            >
              {sendingChange ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              {t('quotePortal.sendRequest')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
