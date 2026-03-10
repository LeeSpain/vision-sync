import { useSearchParams } from "react-router-dom";
import {
    FileSignature,
    FileCheck,
    Send,
    Eye,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation, Trans } from "react-i18next";

export default function Contracts() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const dealId = searchParams.get("deal");

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('salesDashboard.contracts.title')}</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        {t('salesDashboard.contracts.subtitle')}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button className="bg-brand hover:bg-brand-dark text-white shadow-sm">
                        <FileSignature className="h-4 w-4 mr-2" /> {t('salesDashboard.contracts.generateAgreement')}
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 text-center flex flex-col items-center max-w-2xl mx-auto mt-12">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6">
                    <FileSignature className="h-10 w-10 text-indigo-500" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('salesDashboard.contracts.noActiveContract')}</h3>

                {dealId ? (
                    <>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
                            <Trans i18nKey="salesDashboard.contracts.noContractForDeal" values={{ dealId }}>
                                A contract has not been generated for deal <strong>{{ dealId }}</strong> yet. Generating a contract will auto-fill terms based on the accepted quote.
                            </Trans>
                        </p>
                        <Button className="bg-brand hover:bg-brand-dark text-white w-full sm:w-auto px-8">
                            {t('salesDashboard.contracts.generateDraft')}
                        </Button>
                    </>
                ) : (
                    <>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
                            {t('salesDashboard.contracts.selectDeal')}
                        </p>
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg flex items-start text-left gap-3 max-w-lg">
                            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                                <strong>{t('salesDashboard.contracts.digitalSignatureEngine')}</strong> {t('salesDashboard.contracts.signatureEngineDesc')}
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Template Mockup Display */}
            <div className="opacity-50 pointer-events-none mt-12">
                <h4 className="text-sm border-b border-slate-200 dark:border-slate-800 pb-2 mb-6 font-bold uppercase tracking-wider text-slate-400 text-center">{t('salesDashboard.contracts.previewMockup')}</h4>
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                            <FileCheck className="h-6 w-6 text-emerald-500" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{t('salesDashboard.contracts.masterServiceAgreement')}</h4>
                            <div className="text-sm text-slate-500 flex gap-4 mt-1">
                                <span>{t('salesDashboard.contracts.generated')} Oct 12, 2026</span>
                                <span>{t('salesDashboard.contracts.signatory')} Elena Rodriguez</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-none">{t('salesDashboard.contracts.fullySigned')}</Badge>
                        <Button variant="outline" size="sm">{t('salesDashboard.contracts.downloadPdf')}</Button>
                    </div>
                </div>
            </div>

        </div>
    );
}
