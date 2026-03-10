import { useState, useEffect, useCallback, Fragment } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Eye, Phone, CheckCircle, XCircle, ChevronDown, ChevronUp,
  Loader2, TrendingUp, FileText, Users, Euro
} from 'lucide-react';

interface SelectedModule {
  id: string;
  name: string;
  exVatPrice: number;
  ivaAmount: number;
  totalIncVat: number;
}

interface Quote {
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
  updated_at: string;
}

type StatusFilter = 'all' | 'new' | 'viewed' | 'contacted' | 'accepted' | 'declined';

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: 'New', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  viewed: { label: 'Viewed', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  contacted: { label: 'Contacted', className: 'bg-purple-100 text-purple-700 border-purple-200' },
  accepted: { label: 'Accepted', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  declined: { label: 'Declined', className: 'bg-red-100 text-red-700 border-red-200' },
};

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);

const formatDate = (dateString: string | null): string => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

export function QuotesManager() {
  const { toast } = useToast();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQuoteId, setExpandedQuoteId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: `Failed to load quotes: ${error.message}`, variant: 'destructive' });
    } else {
      const parsed = (data || []).map(q => ({
        ...q,
        modules_selected: Array.isArray(q.modules_selected) ? q.modules_selected : []
      })) as Quote[];
      setQuotes(parsed);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const updateStatus = async (quoteId: string, newStatus: string, extraFields?: Record<string, string>) => {
    setUpdatingId(quoteId);
    const { error } = await supabase
      .from('quotes')
      .update({ status: newStatus, ...extraFields })
      .eq('id', quoteId);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Updated', description: `Quote marked as ${newStatus}` });
      fetchQuotes();
    }
    setUpdatingId(null);
  };

  const thisMonthQuotes = quotes.filter(q => q.created_at >= thisMonthStart);
  const pipelineValue = quotes
    .filter(q => q.status !== 'declined')
    .reduce((sum, q) => sum + (q.total_inc_vat || 0), 0);
  const acceptedThisMonth = thisMonthQuotes.filter(q => q.status === 'accepted').length;
  const newQuotes = quotes.filter(q => q.status === 'new').length;

  const filteredQuotes = quotes.filter(q => {
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || [
      q.client_first_name, q.client_last_name, q.business_name, q.quote_reference
    ].some(field => field?.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });

  const statusTabs: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'new', label: 'New' },
    { key: 'viewed', label: 'Viewed' },
    { key: 'contacted', label: 'Contacted' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'declined', label: 'Declined' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-midnight-navy">Quotes</h2>
        <p className="text-cool-gray">Manage all client quotes and track their progress.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-cool-gray uppercase tracking-wide">This Month</span>
              <FileText className="h-4 w-4 text-electric-blue" />
            </div>
            <div className="text-2xl font-bold text-midnight-navy">{thisMonthQuotes.length}</div>
            <div className="text-xs text-cool-gray">quotes received</div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-cool-gray uppercase tracking-wide">Pipeline Value</span>
              <Euro className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-midnight-navy">{formatCurrency(pipelineValue)}</div>
            <div className="text-xs text-cool-gray">monthly recurring</div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-cool-gray uppercase tracking-wide">Accepted</span>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-midnight-navy">{acceptedThisMonth}</div>
            <div className="text-xs text-cool-gray">this month</div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-cool-gray uppercase tracking-wide">Uncontacted</span>
              <Users className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-midnight-navy">{newQuotes}</div>
            <div className="text-xs text-cool-gray">need attention</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1">
          {statusTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === tab.key
                  ? 'bg-midnight-navy text-white'
                  : 'bg-white border border-slate-200 text-cool-gray hover:bg-slate-50'
              }`}
            >
              {tab.label}
              {tab.key !== 'all' && (
                <span className="ml-1.5 text-xs opacity-70">
                  {quotes.filter(q => q.status === tab.key).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="ml-auto">
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, business, or reference..."
            className="w-64"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div className="text-center py-16 text-cool-gray">
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No quotes found</p>
              <p className="text-sm mt-1">Quotes will appear here once clients submit a package request.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote Ref</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead className="text-right">Monthly Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map(quote => (
                  <Fragment key={quote.id}>
                    <TableRow className="cursor-pointer hover:bg-slate-50">
                      <TableCell className="font-mono text-xs font-bold text-midnight-navy">
                        {quote.quote_reference}
                      </TableCell>
                      <TableCell className="font-medium">
                        {quote.client_first_name} {quote.client_last_name}
                      </TableCell>
                      <TableCell className="text-cool-gray">{quote.business_name}</TableCell>
                      <TableCell className="text-cool-gray text-sm">{quote.industry_name}</TableCell>
                      <TableCell className="text-right font-semibold text-midnight-navy">
                        {formatCurrency(quote.total_inc_vat)}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${statusConfig[quote.status]?.className || ''}`}>
                          {statusConfig[quote.status]?.label || quote.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-cool-gray">
                        {formatDate(quote.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setExpandedQuoteId(expandedQuoteId === quote.id ? null : quote.id)}
                            title="View details"
                          >
                            {expandedQuoteId === quote.id
                              ? <ChevronUp className="h-4 w-4 text-electric-blue" />
                              : <ChevronDown className="h-4 w-4 text-electric-blue" />
                            }
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={updatingId === quote.id}
                            onClick={() => updateStatus(quote.id, 'contacted', { contacted_at: new Date().toISOString() })}
                            title="Mark as contacted"
                          >
                            <Phone className="h-4 w-4 text-purple-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={updatingId === quote.id}
                            onClick={() => updateStatus(quote.id, 'accepted')}
                            title="Mark as accepted"
                          >
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={updatingId === quote.id}
                            onClick={() => updateStatus(quote.id, 'declined')}
                            title="Mark as declined"
                          >
                            <XCircle className="h-4 w-4 text-red-400" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Detail Row */}
                    {expandedQuoteId === quote.id && (
                      <TableRow>
                        <TableCell colSpan={8} className="bg-slate-50 px-6 py-5">
                          <div className="grid md:grid-cols-3 gap-6">
                            {/* Client Info */}
                            <div>
                              <h4 className="text-xs font-bold text-midnight-navy uppercase tracking-wider mb-3">Client Details</h4>
                              <dl className="space-y-2 text-sm">
                                <div><dt className="text-cool-gray">Name</dt><dd className="font-medium">{quote.client_first_name} {quote.client_last_name}</dd></div>
                                <div><dt className="text-cool-gray">Business</dt><dd className="font-medium">{quote.business_name}</dd></div>
                                <div><dt className="text-cool-gray">Email</dt><dd className="text-electric-blue"><a href={`mailto:${quote.email}`}>{quote.email}</a></dd></div>
                                <div><dt className="text-cool-gray">Phone</dt><dd>{quote.phone || '—'}</dd></div>
                                <div><dt className="text-cool-gray">Industry</dt><dd>{quote.industry_name}</dd></div>
                              </dl>
                            </div>

                            {/* Package Detail */}
                            <div>
                              <h4 className="text-xs font-bold text-midnight-navy uppercase tracking-wider mb-3">Package</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-cool-gray">Base Package</span>
                                  <span className="font-medium">{formatCurrency(quote.base_inc_vat)}/mo</span>
                                </div>
                                {quote.modules_selected.map((mod, idx) => (
                                  <div key={idx} className="flex justify-between">
                                    <span className="text-cool-gray truncate max-w-[140px]">{mod.name}</span>
                                    <span className="font-medium">{formatCurrency(mod.totalIncVat)}/mo</span>
                                  </div>
                                ))}
                                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold">
                                  <span>Total inc. IVA</span>
                                  <span className="text-midnight-navy">{formatCurrency(quote.total_inc_vat)}/mo</span>
                                </div>
                                <div className="flex justify-between text-xs text-cool-gray">
                                  <span>ex IVA</span>
                                  <span>{formatCurrency(quote.total_ex_vat)}/mo</span>
                                </div>
                              </div>
                            </div>

                            {/* Timeline & Notes */}
                            <div>
                              <h4 className="text-xs font-bold text-midnight-navy uppercase tracking-wider mb-3">Timeline</h4>
                              <dl className="space-y-2 text-sm">
                                <div><dt className="text-cool-gray">Created</dt><dd>{formatDate(quote.created_at)}</dd></div>
                                <div><dt className="text-cool-gray">Sent</dt><dd>{formatDate(quote.sent_at)}</dd></div>
                                <div><dt className="text-cool-gray">Viewed</dt><dd>{formatDate(quote.viewed_at)}</dd></div>
                                <div><dt className="text-cool-gray">Contacted</dt><dd>{formatDate(quote.contacted_at)}</dd></div>
                              </dl>
                              {quote.client_notes && (
                                <div className="mt-4">
                                  <h4 className="text-xs font-bold text-midnight-navy uppercase tracking-wider mb-2">Client Notes</h4>
                                  <p className="text-sm text-slate-600 bg-amber-50 border border-amber-200 rounded-lg p-3">{quote.client_notes}</p>
                                </div>
                              )}
                              <div className="mt-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs w-full"
                                  onClick={() => {
                                    // Log follow-up action — extend with actual email function if needed
                                    console.log('Follow-up for quote:', quote.quote_reference);
                                    toast({ title: 'Follow-up logged', description: 'In production, this triggers a follow-up email.' });
                                  }}
                                >
                                  Send follow-up email
                                </Button>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
