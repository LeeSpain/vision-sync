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

export default function Contracts() {
    const [searchParams] = useSearchParams();
    const dealId = searchParams.get("deal");

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Contracts</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Generate and manage digital service agreements.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button className="bg-brand hover:bg-brand-dark text-white shadow-sm">
                        <FileSignature className="h-4 w-4 mr-2" /> Generate Agreement
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 text-center flex flex-col items-center max-w-2xl mx-auto mt-12">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6">
                    <FileSignature className="h-10 w-10 text-indigo-500" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">No Active Contract</h3>

                {dealId ? (
                    <>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
                            A contract has not been generated for deal <strong>{dealId}</strong> yet. Generating a contract will auto-fill terms based on the accepted quote.
                        </p>
                        <Button className="bg-brand hover:bg-brand-dark text-white w-full sm:w-auto px-8">
                            Generate Draft Contract from Quote
                        </Button>
                    </>
                ) : (
                    <>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
                            Select a deal from your pipeline to generate and manage its specific legal agreements and signatures.
                        </p>
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg flex items-start text-left gap-3 max-w-lg">
                            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                                <strong>Digital Signature Engine:</strong> The contract platform integration (e.g. DocuSign/HelloSign representation) is ready for live wiring pending production launch.
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Template Mockup Display */}
            <div className="opacity-50 pointer-events-none mt-12">
                <h4 className="text-sm border-b border-slate-200 dark:border-slate-800 pb-2 mb-6 font-bold uppercase tracking-wider text-slate-400 text-center">Contract Preview Interface Mockup</h4>
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                            <FileCheck className="h-6 w-6 text-emerald-500" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">Master Service Agreement</h4>
                            <div className="text-sm text-slate-500 flex gap-4 mt-1">
                                <span>Generated: Oct 12, 2026</span>
                                <span>Signatory: Elena Rodriguez</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-none">Fully Signed</Badge>
                        <Button variant="outline" size="sm">Download PDF</Button>
                    </div>
                </div>
            </div>

        </div>
    );
}
