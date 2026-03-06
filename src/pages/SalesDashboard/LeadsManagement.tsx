import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Phone,
    Calendar,
    Clock,
    ChevronDown
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
import { Lead } from "@/types/sales";

// Mock Data
const mockLeads: Lead[] = [
    {
        id: "l1",
        prospectId: "p1",
        businessName: "Costa Blanca Villas",
        contactName: "Elena Rodriguez",
        title: "Director",
        email: "elena@costablancavillas.example.com",
        phone: "+34 600 123 456",
        source: "Prospect Finder",
        industry: "Real Estate",
        location: "Alicante, Spain",
        status: "New",
        websiteScore: 4,
        opportunityScore: 9,
        recommendedPackage: "Real Estate Pro",
        notes: "Needs modern landing page ASAP.",
        followUpDate: new Date(Date.now() + 86400000).toISOString(),
        assignedTo: "me",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "l2",
        prospectId: "p2",
        businessName: "Marina Dental Clinic",
        contactName: "Dr. Carlos Mendez",
        title: "Lead Dentist",
        email: "carlos@marinadental.example.com",
        phone: "+34 600 987 654",
        source: "Inbound",
        industry: "Healthcare",
        location: "Malaga, Spain",
        status: "Contacted",
        websiteScore: 6,
        opportunityScore: 7,
        recommendedPackage: "Healthcare Starter",
        notes: "Followed up via email regarding AI booking bot.",
        followUpDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        assignedTo: "me",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString()
    }
];

export default function LeadsManagement() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredLeads = mockLeads.filter(lead =>
        lead.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.businessName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "New": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case "Contacted": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
            case "Qualified": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            default: return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Leads Management</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Track and prioritize your saved business contacts.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-slate-200 dark:border-slate-800">
                        Import Leads
                    </Button>
                    <Link
                        to="/sales-dashboard/pipeline"
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors bg-brand hover:bg-brand-dark rounded-md shadow-sm whitespace-nowrap"
                    >
                        Create New Lead
                    </Link>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search leads..."
                        className="pl-9 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full md:w-auto border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                                <Filter className="h-4 w-4 mr-2" /> Filter by Status
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>All Leads</DropdownMenuItem>
                            <DropdownMenuItem>New</DropdownMenuItem>
                            <DropdownMenuItem>Contacted</DropdownMenuItem>
                            <DropdownMenuItem>Qualified</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Leads Table/Cards View */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Desktop Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <div className="col-span-4">Lead Contact / Business</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-3">Contact Info</div>
                    <div className="col-span-2">Next Follow-up</div>
                    <div className="col-span-1 text-right">Actions</div>
                </div>

                {/* Lead Rows */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredLeads.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                            No leads found matching "{searchQuery}". Try a different term.
                        </div>
                    ) : (
                        filteredLeads.map((lead) => (
                            <div key={lead.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors items-center">

                                {/* Name/Company */}
                                <div className="col-span-1 md:col-span-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-brand/10 dark:bg-brand/20 text-brand-dark dark:text-brand-light flex items-center justify-center font-bold shrink-0">
                                        {lead.contactName.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                            {lead.contactName} <span className="text-slate-500 font-normal">({lead.title})</span>
                                        </h4>
                                        <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                                            {lead.businessName}
                                        </div>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="col-span-1 md:col-span-2">
                                    <Badge className={`${getStatusColor(lead.status)} border-none shadow-none`}>
                                        {lead.status}
                                    </Badge>
                                </div>

                                {/* Contact Info */}
                                <div className="col-span-1 md:col-span-3 space-y-1.5">
                                    {lead.email && (
                                        <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                                            <Mail className="h-3.5 w-3.5 mr-2 text-slate-400" />
                                            {lead.email}
                                        </div>
                                    )}
                                    {lead.phone && (
                                        <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                                            <Phone className="h-3.5 w-3.5 mr-2 text-slate-400" />
                                            {lead.phone}
                                        </div>
                                    )}
                                </div>

                                {/* Follow-up Date */}
                                <div className="col-span-1 md:col-span-2">
                                    {lead.followUpDate ? (
                                        <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                                            <Calendar className="h-4 w-4 mr-2 text-brand" />
                                            {new Date(lead.followUpDate).toLocaleDateString()}
                                        </div>
                                    ) : (
                                        <span className="text-sm text-slate-400">Not set</span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 md:col-span-1 flex justify-end">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>View Lead Profile</DropdownMenuItem>
                                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                            <DropdownMenuItem>Convert to Deal</DropdownMenuItem>
                                            <DropdownMenuItem className="text-rose-500">Delete Lead</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                            </div>
                        )))}
                </div>
            </div>
        </div>
    );
}
