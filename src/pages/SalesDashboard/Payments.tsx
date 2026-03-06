import { useSearchParams } from "react-router-dom";
import {
    CreditCard,
    Building,
    CheckCirle,
    Clock,
    Ban,
    Download,
    ExternalLink,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Payments() {
    const [searchParams] = useSearchParams();
    const dealId = searchParams.get("deal");

    const mockPayments = [
        { id: "inv-001", type: "Setup Fee", amount: 1500, status: "Paid", date: "Oct 10, 2026", method: "Credit Card ending in 4242" },
        { id: "inv-002", type: "Monthly Subscription", amount: 500, status: "Pending", date: "Oct 12, 2026", method: "SEPA Direct Debit" },
    ];

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Payments & Invoicing</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Track requested and completed deal payments.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button className="bg-brand hover:bg-brand-dark text-white shadow-sm">
                        <Plus className="h-4 w-4 mr-2" /> Request Payment
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Payment History {dealId && `for Deal ${dealId}`}</h3>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {mockPayments.map((payment) => (
                                <div key={payment.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${payment.status === 'Paid' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                payment.status === 'Pending' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                                                    'bg-slate-100 text-slate-600'
                                            }`}>
                                            <CreditCard className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-slate-900 dark:text-white">{payment.type}</h4>
                                                <Badge className={`${payment.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                    } border-none shadow-none`}>
                                                    {payment.status}
                                                </Badge>
                                            </div>
                                            <div className="text-sm text-slate-500 flex items-center gap-3">
                                                <span>{payment.date}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                <span>{payment.id}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full">
                                        <div className="text-xl font-bold text-slate-900 dark:text-white">
                                            ${payment.amount.toLocaleString()}
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

                            {!dealId && (
                                <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                                    Select a specific deal to view filtered payment history, or view all global transactions.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1 space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Payment Methods</h3>
                        <div className="space-y-3">
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                <div className="flex gap-3 items-center">
                                    <div className="w-10 h-6 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center text-[10px] font-bold">VISA</div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">•••• 4242</p>
                                        <p className="text-xs text-slate-500">Expires 12/28</p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800/50">Primary</Badge>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full mt-4 border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                            + Add Payment Method
                        </Button>
                    </div>

                    <div className="bg-brand/5 rounded-xl border border-brand/20 p-6">
                        <h3 className="text-sm font-bold text-brand-dark dark:text-brand-light mb-2">Stripe Integration Ready</h3>
                        <p className="text-sm text-brand/80 dark:text-brand/70 mb-4">
                            The platform is architected to utilize Stripe Connect for direct invoicing and recurring subscription handling.
                        </p>
                        <Button size="sm" className="w-full bg-brand hover:bg-brand-dark text-white">
                            Manage Stripe Dashboard
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
