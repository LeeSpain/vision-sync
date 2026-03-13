import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Building,
    MapPin,
    Globe,
    Phone,
    Mail,
    ArrowLeft,
    Calendar,
    Clock,
    MessageSquare,
    FileText,
    CreditCard,
    PenTool,
    PlaySquare,
    MoreHorizontal,
    Plus,
    Bot,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

interface DealRoomData {
    id: string;
    businessName: string;
    industry: string;
    location: string;
    website: string;
    currentStage: string;
    estimatedValue: number;
    priority: string;
    contact: {
        name: string;
        title: string;
        email: string;
        phone: string;
    };
    aiSummary: string;
}

interface ActivityItem {
    id: string;
    type: string;
    message: string;
    date: string;
    user: string;
}

function formatActivityDate(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    if (diffMs < 86400000) return `Today ${time}`;
    if (diffMs < 172800000) return `Yesterday ${time}`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ` ${time}`;
}

function dbRowToDealRoom(row: Record<string, unknown>): DealRoomData {
    return {
        id: row.id as string,
        businessName: row.business_name as string,
        industry: (row.industry as string) ?? '',
        location: (row.location as string) ?? '',
        website: (row.website as string) ?? '',
        currentStage: row.current_stage as string,
        estimatedValue: Number(row.estimated_value) || 0,
        priority: (row.priority as string) ?? 'Medium',
        contact: {
            name: (row.contact_name as string) ?? '',
            title: (row.contact_title as string) ?? '',
            email: (row.contact_email as string) ?? '',
            phone: (row.contact_phone as string) ?? '',
        },
        aiSummary: (row.ai_summary as string) ?? '',
    };
}

function dbRowToActivity(row: Record<string, unknown>): ActivityItem {
    return {
        id: row.id as string,
        type: (row.activity_type as string) ?? '',
        message: row.message as string,
        date: formatActivityDate(row.created_at as string),
        user: row.actor as string,
    };
}

export default function DealRooms() {
    const { t } = useTranslation();
    const { id } = useParams();
    const [deal, setDeal] = useState<DealRoomData | null>(null);
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (id) fetchDeal(id);
    }, [id]);

    async function fetchDeal(dealId: string) {
        setLoading(true);
        setNotFound(false);

        const { data, error } = await supabase
            .from('deals')
            .select('*')
            .eq('id', dealId)
            .single();

        if (error || !data) {
            setNotFound(true);
            setLoading(false);
            return;
        }

        setDeal(dbRowToDealRoom(data as Record<string, unknown>));

        const { data: acts } = await supabase
            .from('deal_activities')
            .select('*')
            .eq('deal_id', dealId)
            .order('created_at', { ascending: false });

        if (acts) setActivities(acts.map(a => dbRowToActivity(a as Record<string, unknown>)));
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-brand" />
            </div>
        );
    }

    if (notFound || !deal) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('salesDashboard.dealRooms.notFound', 'Deal not found')}</h2>
                <Link to="/sales-dashboard/pipeline">
                    <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" /> {t('salesDashboard.dealRooms.backToPipeline')}
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
            {/* Header Back Navigation */}
            <div className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors w-fit cursor-pointer">
                <Link to="/sales-dashboard/pipeline" className="flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-2" /> {t('salesDashboard.dealRooms.backToPipeline')}
                </Link>
            </div>

            {/* Main Deal Header */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 lg:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-8">

                    <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                                {deal.businessName}
                            </h2>
                            <Badge className="bg-indigo-100 text-indigo-700 border-none shadow-none text-xs dark:bg-indigo-900/30 dark:text-indigo-400">
                                {deal.currentStage}
                            </Badge>
                            {deal.priority === 'High' && (
                                <Badge className="bg-rose-100 text-rose-700 border-none shadow-none text-xs dark:bg-rose-900/30 dark:text-rose-400">
                                    {t('salesDashboard.dealRooms.highPriority')}
                                </Badge>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
                            {deal.industry && <span className="flex items-center"><Building className="h-4 w-4 mr-2" /> {deal.industry}</span>}
                            {deal.location && <span className="flex items-center"><MapPin className="h-4 w-4 mr-2" /> {deal.location}</span>}
                            {deal.website && (
                                <a href={`https://${deal.website}`} target="_blank" rel="noreferrer" className="flex items-center text-brand hover:underline">
                                    <Globe className="h-4 w-4 mr-2" /> {deal.website}
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end justify-between lg:justify-start lg:min-w-[200px]">
                        <div className="text-left lg:text-right">
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{t('salesDashboard.dealRooms.estimatedValue')}</p>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white leading-none">${deal.estimatedValue.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button className="flex-1 bg-brand hover:bg-brand-dark text-white shadow-sm">
                                <PlaySquare className="h-4 w-4 mr-2" /> {t('salesDashboard.dealRooms.presentPitch')}
                            </Button>
                            <Button variant="outline" size="icon" className="border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Grid content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column - Details */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Contact Details Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-5">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                            {t('salesDashboard.dealRooms.primaryContact')}
                        </h3>
                        {deal.contact.name ? (
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-lg shrink-0">
                                        {deal.contact.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white">{deal.contact.name}</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{deal.contact.title}</p>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                                    {deal.contact.email && (
                                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                            <Mail className="h-4 w-4 mr-3 text-slate-400" />
                                            <span className="truncate">{deal.contact.email}</span>
                                        </div>
                                    )}
                                    {deal.contact.phone && (
                                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                            <Phone className="h-4 w-4 mr-3 text-slate-400" />
                                            <span>{deal.contact.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400">{t('salesDashboard.dealRooms.noContact', 'No contact info added yet')}</p>
                        )}
                    </div>

                    {/* AI Insight Card */}
                    {deal.aiSummary && (
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-900/20 rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-800/50 p-5">
                            <h3 className="text-base font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center">
                                <Bot className="h-4 w-4 mr-2" /> {t('salesDashboard.dealRooms.aiDealOverview')}
                            </h3>
                            <p className="text-sm text-indigo-800/80 dark:text-indigo-200/80 leading-relaxed mb-4">
                                {deal.aiSummary}
                            </p>
                            <Button size="sm" variant="outline" className="w-full bg-white/50 dark:bg-slate-900/50 border-indigo-200 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 hover:bg-white dark:hover:bg-slate-800">
                                {t('salesDashboard.dealRooms.openFullAnalysis')}
                            </Button>
                        </div>
                    )}

                    {/* Quick Actions Base */}
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-5">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                            {t('salesDashboard.dealRooms.salesHub')}
                        </h3>
                        <div className="space-y-2">
                            <Link to={`/sales-dashboard/demos?deal=${deal.id}`}>
                                <div className="group flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-brand/30 transition-colors mb-2">
                                    <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <PlaySquare className="h-4 w-4 mr-3 text-purple-500" /> {t('salesDashboard.dealRooms.demo')}
                                    </div>
                                    <Badge className="bg-emerald-100 text-emerald-700 shadow-none border-none dark:bg-emerald-900/30 dark:text-emerald-400">{t('salesDashboard.dealRooms.ready')}</Badge>
                                </div>
                            </Link>

                            <Link to={`/sales-dashboard/quotes?deal=${deal.id}`}>
                                <div className="group flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-brand/30 transition-colors mb-2">
                                    <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <FileText className="h-4 w-4 mr-3 text-amber-500" /> {t('salesDashboard.dealRooms.quote')}
                                    </div>
                                    <span className="text-xs text-slate-400 group-hover:text-brand transition-colors">{t('salesDashboard.dealRooms.createPlus')}</span>
                                </div>
                            </Link>

                            <Link to={`/sales-dashboard/contracts?deal=${deal.id}`}>
                                <div className="group flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-brand/30 transition-colors mb-2">
                                    <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <PenTool className="h-4 w-4 mr-3 text-rose-500" /> {t('salesDashboard.dealRooms.contract')}
                                    </div>
                                    <span className="text-xs text-slate-400 group-hover:text-brand transition-colors">{t('salesDashboard.dealRooms.createPlus')}</span>
                                </div>
                            </Link>

                            <Link to={`/sales-dashboard/payments?deal=${deal.id}`}>
                                <div className="group flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-brand/30 transition-colors">
                                    <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <CreditCard className="h-4 w-4 mr-3 text-emerald-500" /> {t('salesDashboard.dealRooms.payment')}
                                    </div>
                                    <span className="text-xs text-slate-400 group-hover:text-brand transition-colors">{t('salesDashboard.dealRooms.setupPlus')}</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Column - Activities & Workflows */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs defaultValue="activity" className="w-full">
                        <TabsList className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-1 flex mb-4 h-12">
                            <TabsTrigger value="activity" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-brand data-[state=active]:shadow-sm">{t('salesDashboard.dealRooms.timelineNotes')}</TabsTrigger>
                            <TabsTrigger value="emails" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-brand data-[state=active]:shadow-sm">{t('salesDashboard.dealRooms.emailsComms')}</TabsTrigger>
                            <TabsTrigger value="tasks" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-brand data-[state=active]:shadow-sm">{t('salesDashboard.dealRooms.nextSteps')}</TabsTrigger>
                        </TabsList>

                        <TabsContent value="activity" className="mt-0 outline-none">
                            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">

                                {/* Add Note Input */}
                                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                                    <div className="flex gap-3 mt-1">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs flex items-center justify-center font-bold shrink-0">ME</div>
                                        <div className="flex-1 relative">
                                            <Input
                                                placeholder={t('salesDashboard.dealRooms.logActivity')}
                                                className="pb-10 pt-3 h-20 text-sm resize-none bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                                                as="textarea"
                                            />
                                            <div className="absolute bottom-2 right-2 left-2 flex justify-between items-center">
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                        <MessageSquare className="h-3 w-3" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                        <Phone className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <Button size="sm" className="h-7 text-xs bg-brand hover:bg-brand-dark text-white px-4">
                                                    {t('salesDashboard.dealRooms.postNote')}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline Feed */}
                                <div className="p-6 relative">
                                    {activities.length > 0 && (
                                        <div className="absolute left-[39px] top-6 bottom-6 w-px bg-slate-200 dark:bg-slate-800"></div>
                                    )}

                                    <div className="space-y-6">
                                        {activities.length === 0 ? (
                                            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                                                <MessageSquare className="h-8 w-8 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                                                <p className="text-sm font-medium">{t('salesDashboard.dealRooms.noActivities', 'No activities yet')}</p>
                                            </div>
                                        ) : activities.map((event) => (
                                            <div key={event.id} className="flex gap-4 relative z-10">
                                                <div className="shrink-0 mt-0.5 relative">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 ${event.user === 'AI Copilot' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/60 dark:text-indigo-400' :
                                                        event.type === 'Demo' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/60 dark:text-purple-400' :
                                                            'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                        }`}>
                                                        {event.user === 'AI Copilot' ? <Bot className="h-4 w-4" /> :
                                                            event.type === 'Demo' ? <PlaySquare className="h-4 w-4" /> :
                                                                event.type === 'Call' ? <Phone className="h-4 w-4" /> :
                                                                    <MessageSquare className="h-4 w-4" />}
                                                    </div>
                                                </div>
                                                <div className="flex-1 bg-slate-50 dark:bg-slate-800/40 rounded-lg p-4 border border-slate-100 dark:border-slate-800/60">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <span className="font-bold text-slate-900 dark:text-white">{event.user}</span>
                                                            <span className="text-slate-400 dark:text-slate-500">{t('salesDashboard.dealRooms.loggedA', { type: event.type })}</span>
                                                        </div>
                                                        <span className="text-xs text-slate-400 flex items-center">
                                                            <Clock className="h-3 w-3 mr-1" /> {event.date}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                                        {event.message}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="emails" className="mt-0">
                            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-8 text-center h-[500px] flex flex-col justify-center items-center">
                                <Mail className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('salesDashboard.dealRooms.emailSandbox')}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">{t('salesDashboard.dealRooms.emailSandboxDesc')}</p>
                                <Button className="mt-6 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">{t('salesDashboard.dealRooms.connectEmail')}</Button>
                            </div>
                        </TabsContent>

                        <TabsContent value="tasks" className="mt-0">
                            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-8 text-center h-[500px] flex flex-col justify-center items-center">
                                <Calendar className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('salesDashboard.dealRooms.upcomingTasks')}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">{t('salesDashboard.dealRooms.noTasks')}</p>
                                <Button className="mt-6 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700">
                                    <Plus className="h-4 w-4 mr-2" /> {t('salesDashboard.dealRooms.addTask')}
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>

                </div>

            </div>
        </div>
    );
}
