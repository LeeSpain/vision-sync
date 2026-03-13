import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
    CreditCard,
    Download,
    ExternalLink,
    Plus,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

interface SalesPayment {
    id: string;
    dealId: string | null;
    paymentType: string;
    amount: number;
    currency: string;
    status: string;
    reference: string | null;
    dueDate: string | null;
    paidAt: string | null;
    createdAt: string;
}

function dbRowToPayment(row: Record<string, unknown>): SalesPayment {
    return {
        id: row.id as string,
        dealId: (row.deal_id as string) ?? null,
        paymentType: (row.payment_type as string) ?? '',
        amount: Number(row.amount) || 0,
        currency: (row.currency as string) ?? 'EUR',
        status: (row.status as string) ?? 'pending',
        reference: (row.reference as string) ?? null,
        dueDate: (row.due_date as string) ?? null,
        paidAt: (row.paid_at as string) ?? null,
        createdAt: row.created_at as string,
    };
}

export default function Payments() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const dealId = searchParams.get("deal");
    const [payments, setPayments] = useState<SalesPayment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchPayments(); }, [dealId]);

    async function fetchPayments() {
        setLoading(true);
        let query = supabase.from('sales_payments').select('*').order('created_at', { ascending: false });
        if (dealId) query = query.eq('deal_id', dealId);
        const { data, error } = await query;
        if (!error && data) setPayments(data.map(r => dbRowToPayment(r as Record<string, unknown>)));
        setLoading(false);
    }

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('salesDashboard.payments.title')}</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        {t('salesDashboard.payments.subtitle')}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button className="bg-brand hover:bg-brand-dark text-white shadow-sm">
                        <Plus className="h-4 w-4 mr-2" /> {t('salesDashboard.payments.requestPayment')}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('salesDashboard.payments.paymentHistory')} {dealId && t('salesDashboard.payments.forDeal', { id: dealId })}</h3>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <div className="p-12 flex justify-center">
                                    <Loader2 className="h-8 w-8 animate-spin text-brand" />
                                </div>
                            ) : payments.length === 0 ? (
                                <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                                    {t('salesDashboard.payments.noPayments', 'No payments found')}
                                </div>
                            ) : payments.map((payment) => (
                                <div key={payment.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${payment.status === 'paid' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                            payment.status === 'pending' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                            <CreditCard className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-slate-900 dark:text-white capitalize">{payment.paymentType.replace('_', ' ')}</h4>
                                                <Badge className={`${payment.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                                    payment.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-red-100 text-red-700'
                                                    } border-none shadow-none capitalize`}>
                                                    {payment.status}
                                                </Badge>
                                            </div>
                                            <div className="text-sm text-slate-500 flex items-center gap-3">
                                                <span>{new Date(payment.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                {payment.reference && (
                                                    <>
                                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                        <span>{payment.reference}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full">
                                        <div className="text-xl font-bold text-slate-900 dark:text-white">
                                            {payment.currency === 'EUR' ? '\u20AC' : '$'}{payment.amount.toLocaleString()}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-brand">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-brand">
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1 space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">{t('salesDashboard.payments.paymentMethods')}</h3>
                        <div className="space-y-3">
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                <div className="flex gap-3 items-center">
                                    <div className="w-10 h-6 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center text-[10px] font-bold">VISA</div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">&bull;&bull;&bull;&bull; 4242</p>
                                        <p className="text-xs text-slate-500">{t('salesDashboard.payments.expires')} 12/28</p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800/50">{t('salesDashboard.payments.primary')}</Badge>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full mt-4 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                            {t('salesDashboard.payments.addPaymentMethod')}
                        </Button>
                    </div>

                    <div className="bg-brand/5 rounded-xl border border-brand/20 p-6">
                        <h3 className="text-sm font-bold text-brand-dark dark:text-brand-light mb-2">{t('salesDashboard.payments.stripeReady')}</h3>
                        <p className="text-sm text-brand/80 dark:text-brand/70 mb-4">
                            {t('salesDashboard.payments.stripeDesc')}
                        </p>
                        <Button size="sm" className="w-full bg-brand hover:bg-brand-dark text-white">
                            {t('salesDashboard.payments.manageStripe')}
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
