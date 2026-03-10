import { useState, useEffect, useCallback } from "react";
import {
    Search,
    Filter,
    Briefcase,
    Star,
    Globe,
    ChevronDown,
    BrainCircuit,
    Plus,
    Loader2,
    Users,
    Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface DbLead {
    id: string;
    name: string;
    email: string;
    company: string | null;
    phone: string | null;
    source: string;
    status: string;
    priority: string;
    notes: string | null;
    form_data: Record<string, unknown> | null;
    created_at: string;
}

const PRIORITY_BADGE: Record<string, string> = {
    high: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200",
    urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200",
    medium: "bg-slate-100 text-slate-700 border-slate-200",
    low: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function ProspectFinder() {
    const { t } = useTranslation();
    const [allLeads, setAllLeads] = useState<DbLead[]>([]);
    const [displayedLeads, setDisplayedLeads] = useState<DbLead[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sourceFilter, setSourceFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);

    const loadLeads = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw new Error(`Failed to fetch prospects: ${error.message}`);
            const leads = data as DbLead[];
            setAllLeads(leads);
            setDisplayedLeads(leads);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load prospects.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLeads();
    }, [loadLeads]);

    const applyFilters = (query: string, source: string, priority: string, base?: DbLead[]) => {
        let results = base ?? allLeads;

        if (query.trim()) {
            const q = query.toLowerCase();
            results = results.filter(l =>
                l.name.toLowerCase().includes(q) ||
                (l.company ?? '').toLowerCase().includes(q) ||
                l.email.toLowerCase().includes(q) ||
                (l.notes ?? '').toLowerCase().includes(q)
            );
        }

        if (source !== 'all') {
            results = results.filter(l => l.source === source);
        }

        if (priority !== 'all') {
            results = results.filter(l => l.priority === priority);
        }

        setDisplayedLeads(results);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        applyFilters(value, sourceFilter, priorityFilter);
    };

    const handleSourceFilter = (source: string) => {
        setSourceFilter(source);
        applyFilters(searchQuery, source, priorityFilter);
    };

    const handlePriorityFilter = (priority: string) => {
        setPriorityFilter(priority);
        applyFilters(searchQuery, sourceFilter, priority);
    };

    const saveAsQualified = async (lead: DbLead) => {
        setSavingId(lead.id);
        const { error } = await supabase
            .from('leads')
            .update({ status: 'qualified' })
            .eq('id', lead.id);
        setSavingId(null);
        if (error) {
            toast.error("Failed to qualify lead.");
            return;
        }
        const updated = allLeads.map(l => l.id === lead.id ? { ...l, status: 'qualified' } : l);
        setAllLeads(updated);
        applyFilters(searchQuery, sourceFilter, priorityFilter, updated);
        toast.success(`${lead.name} marked as qualified.`);
    };

    const uniqueSources = ['all', ...Array.from(new Set(allLeads.map(l => l.source)))];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('salesDashboard.prospectFinder.title')}</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        {t('salesDashboard.prospectFinder.subtitle')}
                    </p>
                </div>
            </div>

            {/* Search Header */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                placeholder={t('salesDashboard.prospectFinder.searchPlaceholder')}
                                className="pl-10 h-12 text-base border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 mr-2">
                            <Filter className="h-4 w-4 mr-2" /> {t('salesDashboard.prospectFinder.filters')}
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                                    <Briefcase className="h-4 w-4 mr-2" /> Source: {sourceFilter === 'all' ? 'All' : sourceFilter.replace('-', ' ')} <ChevronDown className="h-4 w-4 ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {uniqueSources.map(s => (
                                    <DropdownMenuItem key={s} onClick={() => handleSourceFilter(s)}>
                                        {s === 'all' ? 'All Sources' : s.replace('-', ' ')}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                                    {t('salesDashboard.prospectFinder.oppScoreFilter')}: {priorityFilter === 'all' ? 'All' : priorityFilter} <ChevronDown className="h-4 w-4 ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {['all', 'urgent', 'high', 'medium', 'low'].map(p => (
                                    <DropdownMenuItem key={p} onClick={() => handlePriorityFilter(p)}>
                                        {p === 'all' ? t('salesDashboard.prospectFinder.anyScore') : p.charAt(0).toUpperCase() + p.slice(1)}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {loading ? 'Loading...' : `${displayedLeads.length} prospect${displayedLeads.length !== 1 ? 's' : ''} found`}
                    </h3>
                </div>

                {loading ? (
                    <div className="p-12 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-brand" />
                    </div>
                ) : displayedLeads.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500 dark:text-slate-400 font-medium">
                            {searchQuery
                                ? `No prospects matching "${searchQuery}"`
                                : "No prospects yet. Leads captured via the AI chat widget will appear here."}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {displayedLeads.map((lead) => (
                            <div key={lead.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-3 mb-2">
                                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                                                {lead.company ?? lead.name}
                                            </h4>
                                            {(lead.priority === 'high' || lead.priority === 'urgent') && (
                                                <Badge className={`${PRIORITY_BADGE[lead.priority]} border`}>
                                                    {lead.priority === 'urgent' ? 'Urgent' : 'High Priority'}
                                                </Badge>
                                            )}
                                            {lead.status === 'qualified' && (
                                                <Badge className="bg-purple-100 text-purple-700 border border-purple-200">Qualified</Badge>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
                                            <span className="flex items-center">
                                                <Briefcase className="h-4 w-4 mr-1.5 text-slate-400" />
                                                {lead.source.replace('-', ' ')}
                                            </span>
                                            {lead.phone && (
                                                <span className="flex items-center">
                                                    <Phone className="h-4 w-4 mr-1.5 text-slate-400" />
                                                    {lead.phone}
                                                </span>
                                            )}
                                            <span className="flex items-center">
                                                <Globe className="h-4 w-4 mr-1.5 text-slate-400" />
                                                {lead.email}
                                            </span>
                                        </div>

                                        {lead.notes && (
                                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 rounded-md flex items-start gap-3">
                                                <BrainCircuit className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                                                <p className="text-sm text-indigo-900 dark:text-indigo-200">
                                                    <span className="font-semibold">Notes: </span>{lead.notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 lg:gap-3 py-2 lg:py-0 w-full lg:w-48 shrink-0 lg:border-l border-slate-100 dark:border-slate-800 lg:pl-6">
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-1 mb-1">
                                                <Star className={`h-4 w-4 ${lead.priority === 'high' || lead.priority === 'urgent' ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                                                <span className="text-lg font-bold text-slate-900 dark:text-white leading-none capitalize">
                                                    {lead.priority}
                                                </span>
                                            </div>
                                            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Priority</span>
                                        </div>

                                        <div className="flex flex-col gap-2 w-full max-w-[140px]">
                                            <Button
                                                size="sm"
                                                className="w-full bg-brand hover:bg-brand-dark text-white"
                                                onClick={() => saveAsQualified(lead)}
                                                disabled={savingId === lead.id || lead.status === 'qualified'}
                                            >
                                                {savingId === lead.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Plus className="h-4 w-4 mr-1" />
                                                        {lead.status === 'qualified' ? 'Qualified ✓' : 'Qualify Lead'}
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
