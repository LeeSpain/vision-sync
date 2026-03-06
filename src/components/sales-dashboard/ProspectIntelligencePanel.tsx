import { Prospect } from "@/types/sales";
import {
    Building,
    MapPin,
    Globe,
    Phone,
    Mail,
    BrainCircuit,
    Star,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    TrendingUp,
    Settings
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProspectIntelligencePanelProps {
    prospect: Prospect;
    onClose: () => void;
    onSaveLead: () => void;
    onGenerateDemo: () => void;
}

export function ProspectIntelligencePanel({
    prospect,
    onClose,
    onSaveLead,
    onGenerateDemo
}: ProspectIntelligencePanelProps) {
    return (
        <div className="flex flex-col h-full bg-white dark:bg-midnight-navy border-l border-slate-200 dark:border-slate-800 animate-slide-in-right shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-midnight-navy/95 backdrop-blur-sm z-10 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">
                        {prospect.businessName}
                    </h2>
                    <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center"><Building className="h-4 w-4 mr-1" /> {prospect.industry}</span>
                        <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {prospect.location}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <Badge className={prospect.priority === 'High' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-slate-500 border-none'}>
                        {prospect.priority} Priority
                    </Badge>
                    <button onClick={onClose} className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mt-2">
                        Close Panel
                    </button>
                </div>
            </div>

            {/* Content Scroll */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

                {/* Core Intelligence Score */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-900/40 border border-indigo-100 dark:border-indigo-800/50 flex flex-col items-center justify-center text-center">
                        <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-2">Opportunity Score</span>
                        <div className="flex items-center justify-center gap-1">
                            <Star className={`h-6 w-6 ${prospect.opportunityScore >= 8 ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
                            <span className="text-4xl font-black text-indigo-950 dark:text-indigo-100">{prospect.opportunityScore}</span>
                            <span className="text-lg text-indigo-400">/10</span>
                        </div>
                        <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-2 font-medium">
                            {prospect.opportunityScore >= 8 ? "Highly Recommended Pitch" : "Standard Outreach"}
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">Digital Presence</span>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600 dark:text-slate-300">Website Score</span>
                                <span className={`font-bold ${prospect.websiteScore > 6 ? 'text-emerald-500' : 'text-rose-500'}`}>{prospect.websiteScore}/10</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${prospect.websiteScore > 6 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                    style={{ width: `${(prospect.websiteScore / 10) * 100}%` }}
                                />
                            </div>

                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                <Globe className={`h-4 w-4 ${prospect.website ? 'text-emerald-500' : 'text-slate-400'}`} />
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Website: {prospect.website ? 'Found' : 'Missing'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Analysis Breakdown */}
                <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <BrainCircuit className="h-5 w-5 text-brand" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Web Assessment</h3>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                        {prospect.aiSummary}
                    </p>

                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-2">Weaknesses Identified</h4>
                        <div className="flex items-start gap-3">
                            <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
                            <p className="text-sm text-slate-700 dark:text-slate-300">No clear Lead Capture form or "Book Now" CTA visible above the fold.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
                            <p className="text-sm text-slate-700 dark:text-slate-300">Mobile experience is extremely slow (LCP &gt; 4.5s) and not responsive.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                            <p className="text-sm text-slate-700 dark:text-slate-300">No automated chat or WhatsApp widget for instant customer inquiries.</p>
                        </div>
                    </div>
                </div>

                {/* Recommended Solution Pitch */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-brand/10 to-transparent border border-brand/20 my-4">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-5 w-5 text-brand" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Recommended Pitch Angle</h3>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-brand/20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">Vision-Sync Local Business Suite</span>
                            <Badge className="bg-brand text-white">High Conversion</Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Focus the conversation on lost mobile traffic and capturing after-hours leads. A modern, mobile-first design with AI chat will differentiate them from local competitors.
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                Mobile-Optimized Landing Page
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                AI Receptionist Chatbot
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                Integrated Lead CRM
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Info Footer Grid */}
                <div className="grid grid-cols-2 gap-4 pb-6">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">{prospect.phone || "No phone"}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-300 truncate">{prospect.email || "No email"}</span>
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-midnight-navy/95 backdrop-blur-sm sticky bottom-0 flex gap-3 z-10">
                <Button variant="outline" className="flex-1 border-slate-300 dark:border-slate-700 py-6" onClick={onGenerateDemo}>
                    <Settings className="h-4 w-4 mr-2" />
                    Build Demo
                </Button>
                <Button className="flex-1 bg-brand hover:bg-brand-dark text-white py-6" onClick={onSaveLead}>
                    Save as Lead
                </Button>
            </div>
        </div>
    );
}
