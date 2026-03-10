import { useState, useEffect } from "react";
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
    TrendingDown,
    Loader2
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

interface DashboardMetrics {
    totalProspects: number;
    activeLeads: number;
    activeDeals: number;
    pipelineValue: number;
    demosGenerated: number;
    quotesSent: number;
    contractsPending: number;
    wonThisMonth: number;
}

export default function DashboardOverview() {
    const { t } = useTranslation();
    const [metrics, setMetrics] = useState<DashboardMetrics>({
        totalProspects: 0,
        activeLeads: 0,
        activeDeals: 0,
        pipelineValue: 0,
        demosGenerated: 0,
        quotesSent: 0,
        contractsPending: 0,
        wonThisMonth: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMetrics();
    }, []);

    const loadMetrics = async () => {
        try {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);

            const [
                prospectsResult,
                leadsResult,
                newLeadsResult,
                qualifiedLeadsResult,
                conversationsResult,
            ] = await Promise.all([
                // Total prospects (all leads ever captured)
                supabase.from('leads').select('*', { count: 'exact', head: true }),
                // Active leads (not closed)
                supabase.from('leads').select('*', { count: 'exact', head: true }).not('status', 'in', '("Won","Lost","Closed")'),
                // New leads this month
                supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth.toISOString()).eq('status', 'New'),
                // Qualified leads (won this month)
                supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth.toISOString()).eq('status', 'Won'),
                // AI conversations this month (used for pipeline activity)
                supabase.from('ai_conversations').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth.toISOString()),
            ]);

            // Estimate pipeline value from active leads (opportunityScore * avg deal size)
            const { data: activeLeadData } = await supabase
                .from('leads')
                .select('opportunity_score')
                .not('status', 'in', '("Won","Lost","Closed")');

            const avgDealSize = 5000;
            const pipelineValue = (activeLeadData || []).reduce((sum, lead) => {
                const score = (lead as { opportunity_score: number | null }).opportunity_score ?? 5;
                return sum + (score / 10) * avgDealSize;
            }, 0);

            setMetrics({
                totalProspects: prospectsResult.count ?? 0,
                activeLeads: leadsResult.count ?? 0,
                activeDeals: qualifiedLeadsResult.count ?? 0,
                pipelineValue: Math.round(pipelineValue),
                demosGenerated: conversationsResult.count ?? 0,
                quotesSent: newLeadsResult.count ?? 0,
                contractsPending: 0,
                wonThisMonth: qualifiedLeadsResult.count ?? 0,
            });
        } catch (err) {
            console.error('Error loading dashboard metrics:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-brand" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('salesDashboard.overview.title')}</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        {t('salesDashboard.overview.subtitle')}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        to="/sales-dashboard/prospects"
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors bg-white border border-slate-200 hover:bg-slate-100 rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-700 shadow-sm whitespace-nowrap"
                    >
                        {t('salesDashboard.overview.findProspects')}
                    </Link>
                    <Link
                        to="/sales-dashboard/pipeline"
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors bg-brand hover:bg-brand-dark rounded-md shadow-sm whitespace-nowrap"
                    >
                        {t('salesDashboard.overview.viewPipeline')}
                    </Link>
                </div>
            </div>

            {/* Primary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title={t('salesDashboard.overview.totalProspects')}
                    value={metrics.totalProspects.toLocaleString()}
                    icon={<Target className="h-5 w-5 text-blue-500" />}
                    trend={t('salesDashboard.overview.prospectsTrend')}
                    trendUp={metrics.totalProspects > 0}
                />
                <MetricCard
                    title={t('salesDashboard.overview.activeLeads')}
                    value={metrics.activeLeads}
                    icon={<Users className="h-5 w-5 text-indigo-500" />}
                    trend={t('salesDashboard.overview.leadsTrend')}
                    trendUp={metrics.activeLeads > 0}
                />
                <MetricCard
                    title={t('salesDashboard.overview.activeDeals')}
                    value={metrics.activeDeals}
                    icon={<Briefcase className="h-5 w-5 text-orange-500" />}
                    trend={t('salesDashboard.overview.dealsTrend')}
                    trendUp={metrics.activeDeals > 0}
                />
                <MetricCard
                    title={t('salesDashboard.overview.pipelineValue')}
                    value={metrics.pipelineValue > 0 ? `$${(metrics.pipelineValue / 1000).toFixed(0)}k` : '$0'}
                    icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
                    trend={t('salesDashboard.overview.pipelineTrend')}
                    trendUp={metrics.pipelineValue > 0}
                    highlight={true}
                />
            </div>

            {/* Secondary Metrics Array */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MiniMetric
                    title={t('salesDashboard.overview.miniDemos')}
                    value={metrics.demosGenerated}
                    icon={<PlaySquare className="h-4 w-4 text-purple-500" />}
                />
                <MiniMetric
                    title={t('salesDashboard.overview.miniQuotes')}
                    value={metrics.quotesSent}
                    icon={<FileText className="h-4 w-4 text-amber-500" />}
                />
                <MiniMetric
                    title={t('salesDashboard.overview.miniContracts')}
                    value={metrics.contractsPending}
                    icon={<PenTool className="h-4 w-4 text-rose-500" />}
                />
                <MiniMetric
                    title={t('salesDashboard.overview.miniWon')}
                    value={metrics.wonThisMonth}
                    icon={<CreditCard className="h-4 w-4 text-emerald-500" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI Recommendations */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-[400px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t('salesDashboard.overview.aiRecs')}</h3>
                        <span className="px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full dark:bg-purple-900/30 dark:text-purple-300">
                            {t('salesDashboard.overview.copilotActive')}
                        </span>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        {[
                            { title: t('salesDashboard.overview.rec1Title'), desc: t('salesDashboard.overview.rec1Desc'), action: t('salesDashboard.overview.actionProspects'), type: t('salesDashboard.overview.typeProspect') },
                            { title: t('salesDashboard.overview.rec2Title'), desc: t('salesDashboard.overview.rec2Desc'), action: t('salesDashboard.overview.actionDeal'), type: t('salesDashboard.overview.typeDeal') },
                            { title: t('salesDashboard.overview.rec3Title'), desc: t('salesDashboard.overview.rec3Desc'), action: t('salesDashboard.overview.actionContract'), type: t('salesDashboard.overview.typeContract') }
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

                {/* Pipeline Summary */}
                <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-[400px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t('salesDashboard.overview.pipelineChart')}</h3>
                        <span className="text-sm text-slate-500 dark:text-slate-400">{t('salesDashboard.overview.byStage')}</span>
                    </div>
                    <PipelineStages />
                </div>
            </div>
        </div>
    );
}

function PipelineStages() {
    const { t } = useTranslation();
    const [stageCounts, setStageCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStages = async () => {
            try {
                const { data, error } = await supabase
                    .from('leads')
                    .select('status');

                if (error) throw error;

                const counts: Record<string, number> = {};
                (data || []).forEach(lead => {
                    counts[lead.status] = (counts[lead.status] ?? 0) + 1;
                });
                setStageCounts(counts);
            } catch (err) {
                console.error('Error loading pipeline stages:', err);
            } finally {
                setLoading(false);
            }
        };
        loadStages();
    }, []);

    const stages = [
        { key: 'New', label: t('salesDashboard.overview.stageLead'), color: "bg-slate-300 dark:bg-slate-700" },
        { key: 'Contacted', label: t('salesDashboard.overview.stageContacted'), color: "bg-blue-400" },
        { key: 'Qualified', label: t('salesDashboard.overview.stageDemo'), color: "bg-indigo-500" },
        { key: 'Proposal', label: t('salesDashboard.overview.stageProposal'), color: "bg-brand" },
        { key: 'Won', label: t('salesDashboard.overview.stageClosing'), color: "bg-emerald-500" },
    ];

    const maxCount = Math.max(...stages.map(s => stageCounts[s.key] ?? 0), 1);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col justify-end space-y-3">
            {stages.map((stage) => {
                const count = stageCounts[stage.key] ?? 0;
                const widthPct = `${Math.max((count / maxCount) * 100, count > 0 ? 5 : 0)}%`;
                return (
                    <div key={stage.key} className="w-full">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-slate-600 dark:text-slate-400">{stage.label}</span>
                            <span className="text-slate-900 dark:text-white font-bold">{count}</span>
                        </div>
                        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full ${stage.color} rounded-full transition-all duration-500`} style={{ width: widthPct }}></div>
                        </div>
                    </div>
                );
            })}
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
