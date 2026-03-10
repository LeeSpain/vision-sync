import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Loader2, Home, Calendar, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

  const [quote, setQuote] = useState<QuoteRow | null>(null);
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
      toast({ title: 'Error', description: 'Failed to update quote status.', variant: 'destructive' });
    } else {
      setAccepted(true);
      toast({ title: 'Quote accepted!', description: 'Our team will be in touch very shortly.' });
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
      title: 'Request sent',
      description: 'We\'ve received your change request. Our team will be in touch shortly.'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-electric-blue mx-auto mb-4" />
          <p className="text-cool-gray">Loading your quote...</p>
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
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="h-10 w-10 text-cool-gray" />
            </div>
            <h1 className="text-2xl font-bold text-midnight-navy mb-3">Quote not found</h1>
            <p className="text-cool-gray mb-8">
              We couldn't find a quote with that reference. Please check the link or contact our team.
            </p>
            <Link to="/">
              <Button className="bg-midnight-navy hover:bg-midnight-navy/90 text-white">
                Go to Homepage
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
          <div className="bg-gradient-to-r from-[#0A1628] to-[#1E3A8A] rounded-t-2xl p-10 text-center">
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-black text-2xl">V</span>
            </div>
            <h1 className="text-white text-3xl font-bold mb-2">Your Personalised Quote</h1>
            <p className="text-white/70 text-sm">Vision-Sync Forge | AI Agents & Automation</p>
            <div className="mt-6 inline-block bg-white/10 border border-white/20 rounded-lg px-6 py-3">
              <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Quote Reference</p>
              <p className="text-white font-mono font-bold text-xl tracking-widest">{quote.quote_reference}</p>
            </div>
          </div>

          {/* Quote Body */}
          <div className="bg-white rounded-b-2xl shadow-lg p-8">

            {/* Client & Date */}
            <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-slate-100">
              <div>
                <p className="text-xs text-cool-gray uppercase tracking-wider mb-1">Prepared for</p>
                <p className="font-bold text-midnight-navy text-lg">{quote.client_first_name} {quote.client_last_name}</p>
                <p className="text-cool-gray">{quote.business_name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-cool-gray uppercase tracking-wider mb-1">Quote Date</p>
                <p className="font-semibold text-midnight-navy">{formatDate(quote.created_at)}</p>
                <p className="text-xs text-cool-gray mt-1">Industry: {quote.industry_name}</p>
              </div>
            </div>

            {/* Base Package */}
            <div className="mb-6">
              <h2 className="text-sm font-bold text-midnight-navy uppercase tracking-wider mb-4">
                Base Package
              </h2>
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-midnight-navy">{quote.base_package_name}</p>
                    <p className="text-sm text-cool-gray mt-1">Always included</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-cool-gray uppercase tracking-wide">Ex IVA</p>
                    <p className="font-semibold text-midnight-navy">{formatCurrency(quote.base_ex_vat)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cool-gray uppercase tracking-wide">IVA 21%</p>
                    <p className="font-semibold text-cool-gray">{formatCurrency(quote.base_iva)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cool-gray uppercase tracking-wide">Monthly Total</p>
                    <p className="font-bold text-midnight-navy">{formatCurrency(quote.base_inc_vat)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add-on Modules */}
            {modules.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-bold text-midnight-navy uppercase tracking-wider mb-4">
                  Add-on Modules
                </h2>
                <div className="space-y-3">
                  {modules.map((mod, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="h-4 w-4 text-electric-blue" />
                        <span className="font-semibold text-midnight-navy">{mod.name}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs text-cool-gray uppercase tracking-wide">Ex IVA</p>
                          <p className="font-semibold text-midnight-navy">{formatCurrency(mod.exVatPrice)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-cool-gray uppercase tracking-wide">IVA 21%</p>
                          <p className="font-semibold text-cool-gray">{formatCurrency(mod.ivaAmount)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-cool-gray uppercase tracking-wide">Monthly Total</p>
                          <p className="font-bold text-midnight-navy">{formatCurrency(mod.totalIncVat)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total Summary */}
            <div className="bg-[#0A1628] rounded-xl p-6 mb-8">
              <div className="flex justify-between items-center text-white/60 text-sm mb-2">
                <span>Subtotal ex IVA</span>
                <span>{formatCurrency(quote.total_ex_vat)}</span>
              </div>
              <div className="flex justify-between items-center text-white/60 text-sm mb-4">
                <span>IVA 21%</span>
                <span>{formatCurrency(quote.total_iva)}</span>
              </div>
              <div className="flex justify-between items-center text-white border-t border-white/10 pt-4">
                <span className="text-lg font-bold">Monthly Investment</span>
                <span className="text-3xl font-black">{formatCurrency(quote.total_inc_vat)}</span>
              </div>
            </div>

            {/* Client Notes */}
            {quote.client_notes && (
              <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs text-amber-700 uppercase tracking-wider mb-1 font-semibold">Your Notes</p>
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
                    <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Processing...</>
                  ) : quote.status === 'accepted' ? (
                    <><CheckCircle className="h-5 w-5 mr-2" /> Package Accepted</>
                  ) : (
                    'I want this package →'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRequestChange(true)}
                  className="w-full border-slate-300 text-midnight-navy hover:bg-slate-50"
                >
                  Request a change
                </Button>
              </div>
            )}

            {accepted && (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-midnight-navy mb-2">Brilliant! Package accepted.</h3>
                <p className="text-cool-gray">A member of our team will be in touch within 24 hours to get you started.</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <div className="flex items-center justify-center gap-4 text-sm text-cool-gray">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Team response within 24 hours
                </span>
                <span>|</span>
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  Alicante & Almeria
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
            <DialogTitle className="text-midnight-navy">Request a change</DialogTitle>
            <p className="text-cool-gray text-sm">Tell us what you'd like to change and we'll get back to you.</p>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Textarea
              value={changeMessage}
              onChange={e => setChangeMessage(e.target.value)}
              placeholder="e.g. I'd like to add the voice module, or I have a question about..."
              rows={4}
            />
            <Button
              onClick={handleRequestChange}
              disabled={!changeMessage.trim() || sendingChange}
              className="w-full bg-midnight-navy hover:bg-midnight-navy/90 text-white"
            >
              {sendingChange ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Send request
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
