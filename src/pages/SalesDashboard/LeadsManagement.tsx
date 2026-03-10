import { useState, useEffect, useCallback } from "react";
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Phone,
    Calendar,
    Loader2,
    Trash2,
    CheckCircle,
    RefreshCw,
    Plus
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    next_follow_up: string | null;
    created_at: string;
    form_data: Record<string, unknown> | null;
}

const STATUS_COLORS: Record<string, string> = {
    new: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    contacted: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    qualified: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    converted: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    closed: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
};

const PRIORITY_COLORS: Record<string, string> = {
    low: "bg-slate-100 text-slate-600",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
};

export default function LeadsManagement() {
    const { t } = useTranslation();
    const [leads, setLeads] = useState<DbLead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [editingLead, setEditingLead] = useState<DbLead | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const loadLeads = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw new Error(`Failed to fetch leads: ${error.message}`);
            setLeads(data as DbLead[]);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load leads.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLeads();
    }, [loadLeads]);

    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (lead.company ?? '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const updateStatus = async (id: string, status: string) => {
        const { error } = await supabase.from('leads').update({ status }).eq('id', id);
        if (error) {
            toast.error("Failed to update status.");
            return;
        }
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
        toast.success(`Lead marked as ${status}.`);
    };

    const deleteLead = async (id: string) => {
        const { error } = await supabase.from('leads').delete().eq('id', id);
        if (error) {
            toast.error("Failed to delete lead.");
            return;
        }
        setLeads(prev => prev.filter(l => l.id !== id));
        setDeleteConfirmId(null);
        toast.success("Lead deleted.");
    };

    const saveNotes = async () => {
        if (!editingLead) return;
        setSaving(true);
        const { error } = await supabase
            .from('leads')
            .update({ notes: editingLead.notes, next_follow_up: editingLead.next_follow_up })
            .eq('id', editingLead.id);
        setSaving(false);
        if (error) {
            toast.error("Failed to save.");
            return;
        }
        setLeads(prev => prev.map(l => l.id === editingLead.id ? editingLead : l));
        setEditingLead(null);
        toast.success("Lead updated.");
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <Users className="h-6 w-6 text-indigo-500" />
                        {t('salesDashboard.leads.title')}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        {t('salesDashboard.leads.subtitle')}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={loadLeads} className="border-slate-200 dark:border-slate-800">
                        <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                    </Button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder={t('salesDashboard.leads.searchPlaceholder')}
                        className="pl-9 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full md:w-auto border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                                <Filter className="h-4 w-4 mr-2" /> {statusFilter === 'all' ? t('salesDashboard.leads.filterByStatus') : statusFilter}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {['all', 'new', 'contacted', 'qualified', 'converted', 'closed'].map(s => (
                                <DropdownMenuItem key={s} onClick={() => setStatusFilter(s)}>
                                    {s === 'all' ? t('salesDashboard.leads.allLeads') : s.charAt(0).toUpperCase() + s.slice(1)}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <div className="col-span-3">{t('salesDashboard.leads.colLead')}</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Priority</div>
                    <div className="col-span-3">{t('salesDashboard.leads.colContact')}</div>
                    <div className="col-span-1">Source</div>
                    <div className="col-span-1 text-right">{t('salesDashboard.leads.colActions')}</div>
                </div>

                {loading ? (
                    <div className="p-12 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-brand" />
                    </div>
                ) : filteredLeads.length === 0 ? (
                    <div className="p-12 text-center">
                        <Users className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-500 dark:text-slate-400 font-medium">
                            {searchQuery ? `No leads matching "${searchQuery}"` : "No leads yet. They'll appear here when captured via the AI chat."}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredLeads.map((lead) => (
                            <div key={lead.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors items-center">
                                <div className="col-span-1 md:col-span-3 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-brand/10 text-brand-dark dark:text-brand-light flex items-center justify-center font-bold shrink-0">
                                        {lead.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{lead.name}</h4>
                                        {lead.company && (
                                            <p className="text-xs text-slate-500 mt-0.5">{lead.company}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <Badge className={`${STATUS_COLORS[lead.status] ?? STATUS_COLORS.new} border-none shadow-none cursor-pointer hover:opacity-80`}>
                                                {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                                            </Badge>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {['new', 'contacted', 'qualified', 'converted', 'closed'].map(s => (
                                                <DropdownMenuItem key={s} onClick={() => updateStatus(lead.id, s)}>
                                                    <CheckCircle className="h-3.5 w-3.5 mr-2 text-slate-400" />
                                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <Badge className={`${PRIORITY_COLORS[lead.priority] ?? ''} border-none shadow-none`}>
                                        {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)}
                                    </Badge>
                                </div>

                                <div className="col-span-1 md:col-span-3 space-y-1.5">
                                    <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                                        <Mail className="h-3.5 w-3.5 mr-2 text-slate-400" />
                                        {lead.email}
                                    </div>
                                    {lead.phone && (
                                        <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                                            <Phone className="h-3.5 w-3.5 mr-2 text-slate-400" />
                                            {lead.phone}
                                        </div>
                                    )}
                                    {lead.next_follow_up && (
                                        <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                                            <Calendar className="h-3.5 w-3.5 mr-2 text-brand" />
                                            {new Date(lead.next_follow_up).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>

                                <div className="col-span-1 md:col-span-1">
                                    <span className="text-xs text-slate-500 capitalize">{lead.source.replace('-', ' ')}</span>
                                </div>

                                <div className="col-span-1 md:col-span-1 flex justify-end">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setEditingLead(lead)}>
                                                Edit Notes
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => updateStatus(lead.id, 'qualified')}>
                                                Mark Qualified
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => updateStatus(lead.id, 'converted')}>
                                                Mark Converted
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-rose-500"
                                                onClick={() => setDeleteConfirmId(lead.id)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5 mr-2" />
                                                Delete Lead
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Notes Dialog */}
            <Dialog open={!!editingLead} onOpenChange={() => setEditingLead(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Lead — {editingLead?.name}</DialogTitle>
                        <DialogDescription>Update notes and follow-up date for this lead.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Notes</Label>
                            <Textarea
                                value={editingLead?.notes ?? ''}
                                onChange={e => setEditingLead(prev => prev ? { ...prev, notes: e.target.value } : prev)}
                                rows={4}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label>Next Follow-Up Date</Label>
                            <Input
                                type="date"
                                value={editingLead?.next_follow_up ? editingLead.next_follow_up.split('T')[0] : ''}
                                onChange={e => setEditingLead(prev => prev ? { ...prev, next_follow_up: e.target.value ? `${e.target.value}T09:00:00Z` : null } : prev)}
                                className="mt-1"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingLead(null)}>Cancel</Button>
                        <Button onClick={saveNotes} disabled={saving}>
                            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirm Dialog */}
            <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Lead</DialogTitle>
                        <DialogDescription>This action cannot be undone. Are you sure you want to permanently delete this lead?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => deleteConfirmId && deleteLead(deleteConfirmId)}>
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
