import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    FileText,
    Plus,
    Send,
    Download,
    CheckCircle2,
    Trash2,
    Euro,
    Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

export default function Quotes() {
    const [searchParams] = useSearchParams();
    const dealId = searchParams.get("deal");

    const [items, setItems] = useState([
        { id: 1, name: "Premium Website Build (Setup)", type: "Setup", price: 1500 },
        { id: 2, name: "AI Local SEO Package", type: "Monthly", price: 350 },
        { id: 3, name: "Automated Chat Receptionist", type: "Monthly", price: 150 },
    ]);

    const addLineItem = () => {
        setItems([...items, { id: Date.now(), name: t('salesDashboard.quotes.newAddon'), type: "Monthly", price: 100 }]);
    };

    const removeItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    const updateItem = (id: number, field: string, value: string | number) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const setupTotal = items.filter(i => i.type === 'Setup').reduce((sum, item) => sum + Number(item.price), 0);
    const monthlyTotal = items.filter(i => i.type === 'Monthly').reduce((sum, item) => sum + Number(item.price), 0);

    return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('salesDashboard.quotes.title')}</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        {t('salesDashboard.quotes.subtitle')}
                    </p>
                </div>
                <div className="flex gap-3">
                    {dealId && (
                        <div className="text-sm px-4 py-2 bg-indigo-50 border border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-300 rounded-lg flex items-center shadow-sm mr-2">
                            <Link to={`/sales-dashboard/deals/${dealId}`} className="hover:underline font-medium">
                                {t('salesDashboard.quotes.dealLabel', { dealId })}
                            </Link>
                        </div>
                    )}
                    <Button variant="outline" className="text-slate-600 dark:text-slate-300">
                        <Download className="h-4 w-4 mr-2" /> {t('salesDashboard.quotes.pdfPreview')}
                    </Button>
                    <Button className="bg-brand hover:bg-brand-dark text-white shadow-sm">
                        <Send className="h-4 w-4 mr-2" /> {t('salesDashboard.quotes.sendProposal')}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Editor */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('salesDashboard.quotes.lineItems')}</h3>
                            <Button size="sm" variant="outline" onClick={addLineItem} className="border-brand/30 text-brand hover:bg-brand/5 dark:hover:bg-brand/10">
                                <Plus className="h-4 w-4 mr-1" /> {t('salesDashboard.quotes.addItem')}
                            </Button>
                        </div>

                        <div className="p-6">
                            {/* Setup Fees Section */}
                            <div className="mb-8">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">{t('salesDashboard.quotes.setupFees')}</h4>
                                <div className="space-y-3">
                                    {items.filter(i => i.type === 'Setup').map((item) => (
                                        <div key={item.id} className="flex items-center gap-3">
                                            <Input
                                                value={item.name}
                                                onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                                className="flex-1 bg-slate-50 dark:bg-slate-800/50"
                                            />
                                            <div className="relative w-32 shrink-0">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">$</span>
                                                <Input
                                                    type="number"
                                                    value={item.price}
                                                    onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                                                    className="pl-7 bg-slate-50 dark:bg-slate-800/50 text-right"
                                                />
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 shrink-0">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Monthly Fees Section */}
                            <div>
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">{t('salesDashboard.quotes.monthlyServices')}</h4>
                                <div className="space-y-3">
                                    {items.filter(i => i.type === 'Monthly').map((item) => (
                                        <div key={item.id} className="flex items-center gap-3">
                                            <Input
                                                value={item.name}
                                                onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                                className="flex-1 bg-slate-50 dark:bg-slate-800/50"
                                            />
                                            <div className="relative w-32 shrink-0">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">$</span>
                                                <Input
                                                    type="number"
                                                    value={item.price}
                                                    onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                                                    className="pl-7 bg-slate-50 dark:bg-slate-800/50 text-right"
                                                />
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 shrink-0">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t('salesDashboard.quotes.termsNotes')}</h3>
                        <textarea
                            className="w-full h-32 p-3 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 resize-none focus:outline-none focus:ring-2 focus:ring-brand/50"
                            defaultValue={t('salesDashboard.quotes.defaultTerms')}
                        />
                    </div>
                </div>

                {/* Summary Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 sticky top-24">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900 flex justify-between items-center rounded-t-xl">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('salesDashboard.quotes.proposalSummary')}</h3>
                        </div>

                        <div className="p-6 space-y-6">

                            <div className="flex justify-between items-end pb-4 border-b border-slate-200 dark:border-slate-800">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('salesDashboard.quotes.totalSetup')}</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">${setupTotal.toLocaleString()}</p>
                                </div>
                                <Badge className="bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-none shadow-none">{t('salesDashboard.quotes.oneTime')}</Badge>
                            </div>

                            <div className="flex justify-between items-end pb-4 border-b border-slate-200 dark:border-slate-800">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{t('salesDashboard.quotes.monthlySub')}</p>
                                    <div className="flex items-baseline gap-1">
                                        <p className="text-3xl font-black text-brand">${monthlyTotal.toLocaleString()}</p>
                                        <span className="text-sm text-slate-500">{t('salesDashboard.quotes.perMonth')}</span>
                                    </div>
                                </div>
                                <Badge className="bg-brand/10 text-brand border-none shadow-none">{t('salesDashboard.quotes.recurring')}</Badge>
                            </div>

                            <div className="pt-2">
                                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                                    <span>{t('salesDashboard.quotes.contractTerm')}</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{t('salesDashboard.quotes.months12')}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                                    <span>{t('salesDashboard.quotes.annualValue')}</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">${(setupTotal + (monthlyTotal * 12)).toLocaleString()}</span>
                                </div>
                            </div>

                        </div>

                        <div className="p-4 bg-slate-100 dark:bg-slate-800/80 rounded-b-xl border-t border-slate-200 dark:border-slate-700 space-y-3">
                            <Button className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900 text-white shadow-sm">
                                <CheckCircle2 className="h-4 w-4 mr-2" /> {t('salesDashboard.quotes.markAccepted')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
