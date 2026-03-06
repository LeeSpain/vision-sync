import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Users,
    Target,
    TrendingUp,
    Briefcase,
    PlaySquare,
    FileText,
    PenTool,
    CreditCard,
    ChevronRight,
    ArrowUpRight,
    TrendingDown
} from "lucide-react";

export default function DashboardOverview() {
    const [metrics] = useState({
        totalProspects: 1420,
        activeLeads: 85,
        activeDeals: 24,
        pipelineValue: 450000,
        demosGenerated: 12,
        quotesSent: 8,
        contractsPending: 3,
        wonThisMonth: 5,
    });

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Sales Control Center</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Your high-level pipeline and prospect overview.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        to="/sales-dashboard/prospects"
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors bg-white border border-slate-200 hover:bg-slate-100 rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-700 shadow-sm whitespace-nowrap"
                    >
                        Find Prospects
                    </Link>
                    <Link
                        to="/sales-dashboard/pipeline"
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors bg-brand hover:bg-brand-dark rounded-md shadow-sm whitespace-nowrap"
                    >
                        View Pipeline
                    </Link>
                </div>
            </div>

            {/* Primary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Prospects"
                    value={metrics.totalProspects.toLocaleString()}
                    icon={<Target className="h-5 w-5 text-blue-500" />}
                    trend="+120 this week"
                    trendUp={true}
                />
                <MetricCard
                    title="Active Leads"
                    value={metrics.activeLeads}
                    icon={<Users className="h-5 w-5 text-indigo-500" />}
                    trend="+12 this week"
                    trendUp={true}
                />
                <MetricCard
                    title="Active Deals"
                    value={metrics.activeDeals}
                    icon={<Briefcase className="h-5 w-5 text-orange-500" />}
                    trend="3 closing soon"
                    trendUp={true}
                />
                <MetricCard
                    title="Pipeline Value"
                    value={`$${(metrics.pipelineValue / 1000).toFixed(0)}k`}
                    icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
                    trend="+15% vs last month"
                    trendUp={true}
                    highlight={true}
                />
            </div>

            {/* Secondary Metrics Array */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MiniMetric
                    title="Demos"
                    value={metrics.demosGenerated}
                    icon={<PlaySquare className="h-4 w-4 text-purple-500" />}
                />
                <MiniMetric
                    title="Quotes"
                    value={metrics.quotesSent}
                    icon={<FileText className="h-4 w-4 text-amber-500" />}
                />
                <MiniMetric
                    title="Contracts"
                    value={metrics.contractsPending}
                    icon={<PenTool className="h-4 w-4 text-rose-500" />}
                />
                <MiniMetric
                    title="Won"
                    value={metrics.wonThisMonth}
                    icon={<CreditCard className="h-4 w-4 text-emerald-500" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI Recommendations */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-[400px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">AI Recommendations</h3>
                        <span className="px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full dark:bg-purple-900/30 dark:text-purple-300">
                            Copilot Active
                        </span>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        {[
                            { title: "3 high-opportunity estate agents in Almería", desc: "These prospects have outdated websites and no mobile optimization.", action: "Review Prospects", type: "Prospect" },
                            { title: "Follow up: Dental Care Plus", desc: "Demo was sent 3 days ago. They opened the link twice today.", action: "Open Deal Room", type: "Deal" },
                            { title: "Contract Pending: TechFlow Solutions", desc: "Contract has been pending for over 5 days.", action: "View Contract", type: "Contract" }
                        ].map((rec, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                                <div className="flex-shrink-0 mt-1 relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{rec.title}</h4>
                                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                                            {rec.type}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{rec.desc}</p>
                                </div>
                                <div className="flex shrink-0 items-center">
                                    <button className="text-xs font-medium text-brand hover:text-brand-dark dark:text-brand-light dark:hover:text-brand transition-colors flex items-center">
                                        {rec.action}
                                        <ChevronRight className="h-3 w-3 ml-1" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pipeline Summary Chart Placeholder */}
                <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-[400px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Sales Pipeline</h3>
                        <span className="text-sm text-slate-500 dark:text-slate-400">By Stage</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-end space-y-3">
                        {[
                            { stage: "Lead Saved", count: 42, color: "bg-slate-300 dark:bg-slate-700", width: "100%" },
                            { stage: "Contacted", count: 28, color: "bg-blue-400", width: "80%" },
                            { stage: "Demo Sent", count: 14, color: "bg-indigo-500", width: "60%" },
                            { stage: "Proposal", count: 8, color: "bg-brand", width: "40%" },
                            { stage: "Closing", count: 3, color: "bg-emerald-500", width: "20%" },
                        ].map((bar, i) => (
                            <div key={i} className="w-full">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-medium text-slate-600 dark:text-slate-400">{bar.stage}</span>
                                    <span className="text-slate-900 dark:text-white font-bold">{bar.count}</span>
                                </div>
                                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${bar.color} rounded-full`} style={{ width: bar.width }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ----------------------
// Sub-components
// ----------------------

function MetricCard({
    title,
    value,
    icon,
    trend,
    trendUp,
    highlight = false
}: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend: string;
    trendUp: boolean;
    highlight?: boolean;
}) {
    return (
        <div className={`p-5 lg:p-6 rounded-lg shadow-sm border ${highlight ? 'bg-gradient-to-br from-midnight-navy to-slate-900 border-slate-800 text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
            <div className="flex items-center justify-between">
                <p className={`text-sm font-medium ${highlight ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                    {title}
                </p>
                <div className={`p-2 rounded-md ${highlight ? 'bg-white/10' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    {icon}
                </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
                <h3 className={`text-2xl lg:text-3xl font-bold tracking-tight ${highlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {value}
                </h3>
            </div>
            <div className="mt-2 flex items-center text-xs lg:text-sm">
                {trendUp ? (
                    <ArrowUpRight className="h-3 w-3 lg:h-4 lg:w-4 text-emerald-500 mr-1" />
                ) : (
                    <TrendingDown className="h-3 w-3 lg:h-4 lg:w-4 text-rose-500 mr-1" />
                )}
                <span className={trendUp ? 'text-emerald-500 font-medium' : 'text-rose-500 font-medium'}>
                    {trend}
                </span>
            </div>
        </div>
    );
}

function MiniMetric({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
    return (
        <div className="flex items-center p-3 lg:p-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="p-2.5 lg:p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg mr-3 lg:mr-4">
                {icon}
            </div>
            <div>
                <p className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white leading-none">{value}</p>
                <p className="text-[10px] lg:text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">{title}</p>
            </div>
        </div>
    );
}
