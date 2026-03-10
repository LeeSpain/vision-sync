import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Plus,
    MapPin,
    MoreVertical,
    Calendar,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Deal } from "@/types/sales";
import { useTranslation } from "react-i18next";

// Mock Data
const STAGES = [
    "New Lead",
    "Contacted",
    "Demo Prepared",
    "Proposal Sent",
    "Closing",
    "Won"
];

const mockDeals: Deal[] = [
    {
        id: "d1",
        leadId: "l1",
        businessName: "Costa Blanca Villas",
        currentStage: "Demo Prepared",
        estimatedValue: 4500,
        priority: "High",
        nextAction: "Send Demo Link",
        followUpDate: new Date(Date.now() + 86400000).toISOString(),
        quoteStatus: "Draft",
        contractStatus: null,
        paymentStatus: null,
        demoId: "demo-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "d2",
        leadId: "l2",
        businessName: "Marina Dental Clinic",
        currentStage: "Contacted",
        estimatedValue: 2800,
        priority: "Medium",
        nextAction: "Follow up call",
        followUpDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        quoteStatus: null,
        contractStatus: null,
        paymentStatus: null,
        demoId: null,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "d3",
        leadId: "l3",
        businessName: "Almeria Motors",
        currentStage: "Proposal Sent",
        estimatedValue: 6500,
        priority: "High",
        nextAction: "Awaiting Signature",
        followUpDate: new Date(Date.now() - 86400000).toISOString(), // Overdue
        quoteStatus: "Sent",
        contractStatus: "Draft",
        paymentStatus: null,
        demoId: "demo-2",
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        updatedAt: new Date().toISOString()
    }
];

export default function SalesPipeline() {
    const { t } = useTranslation();
    const [deals, setDeals] = useState<Deal[]>(mockDeals);

    // Filter deals by stage
    const getDealsForStage = (stage: string) => {
        return deals.filter(deal => deal.currentStage === stage);
    };

    // Calculate total value for a stage
    const getStageValue = (stage: string) => {
        return getDealsForStage(stage).reduce((sum, deal) => sum + deal.estimatedValue, 0);
    };

    const isOverdue = (dateString: string | null) => {
        if (!dateString) return false;
        return new Date(dateString) < new Date();
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('salesDashboard.pipeline.title')}</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        {t('salesDashboard.pipeline.subtitle')}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button className="bg-brand hover:bg-brand-dark text-white shadow-sm whitespace-nowrap">
                        <Plus className="h-4 w-4 mr-2" /> {t('salesDashboard.pipeline.addDeal')}
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar pb-4">
                <div className="flex h-full gap-4 px-1 min-w-max">
                    {STAGES.map((stage) => {
                        const stageDeals = getDealsForStage(stage);
                        const totalValue = getStageValue(stage);

                        return (
                            <div
                                key={stage}
                                className="w-80 flex flex-col bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800"
                            >
                                {/* Column Header */}
                                <div className="p-4 border-b border-slate-200 dark:border-slate-800 shrink-0 select-none">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">{t(`salesDashboard.pipeline.stage${stage.replace(/\s+/g, '')}`)}</h3>
                                        <Badge variant="outline" className="text-xs bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700">
                                            {stageDeals.length}
                                        </Badge>
                                    </div>
                                    <div className="text-sm font-medium text-brand">
                                        ${totalValue.toLocaleString()}
                                    </div>
                                </div>

                                {/* Deal Cards Container */}
                                <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                                    {stageDeals.map((deal) => (
                                        <Link
                                            to={`/sales-dashboard/deals/${deal.id}`}
                                            key={deal.id}
                                            className="block bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-brand/50 dark:hover:border-brand/50 transition-all cursor-pointer group"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-brand transition-colors">
                                                    {deal.businessName}
                                                </h4>
                                                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <div className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-3">
                                                ${deal.estimatedValue.toLocaleString()}
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {deal.priority === 'High' && (
                                                    <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400 shadow-none border-none text-[10px] uppercase tracking-wider rounded">
                                                        {t('salesDashboard.pipeline.hotPriority')}
                                                    </Badge>
                                                )}
                                                {deal.quoteStatus && (
                                                    <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 shadow-none border-none text-[10px] uppercase tracking-wider rounded">
                                                        {t('salesDashboard.pipeline.quote')} {deal.quoteStatus}
                                                    </Badge>
                                                )}
                                            </div>

                                            {deal.nextAction && (
                                                <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 truncate">
                                                    <span className="text-slate-400 font-normal mr-1">{t('salesDashboard.pipeline.next')}</span> {deal.nextAction}
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-700/50 mt-1">
                                                <div className={`flex items-center text-xs font-semibold ${isOverdue(deal.followUpDate) ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400'}`}>
                                                    {isOverdue(deal.followUpDate) ? (
                                                        <AlertCircle className="h-3.5 w-3.5 mr-1" />
                                                    ) : (
                                                        <Calendar className="h-3.5 w-3.5 mr-1 text-slate-400" />
                                                    )}
                                                    {deal.followUpDate ? new Date(deal.followUpDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : t('salesDashboard.pipeline.noDate')}
                                                </div>

                                                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold">
                                                    LW
                                                </div>
                                            </div>
                                        </Link>
                                    ))}

                                    {stageDeals.length === 0 && (
                                        <div className="h-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center">
                                            <p className="text-sm font-medium text-slate-400 dark:text-slate-500">{t('salesDashboard.pipeline.dropDealsHere')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
