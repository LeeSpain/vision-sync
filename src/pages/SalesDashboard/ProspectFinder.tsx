import { useState } from "react";
import {
    Search,
    MapPin,
    Filter,
    Briefcase,
    Star,
    Globe,
    MoreVertical,
    ChevronDown,
    BrainCircuit,
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
import { Prospect } from "@/types/sales";
import { ProspectIntelligencePanel } from "@/components/sales-dashboard/ProspectIntelligencePanel";
import { useTranslation } from "react-i18next";

// Mock data
const mockProspects: Prospect[] = [
    {
        id: "p1",
        businessName: "Costa Blanca Villas",
        industry: "Real Estate",
        location: "Alicante, Spain",
        website: "costablancavillas.example.com",
        facebook: null,
        instagram: null,
        googleProfile: "https://google.com/...",
        email: "info@costablancavillas.example.com",
        phone: "+34 600 123 456",
        websiteScore: 4,
        opportunityScore: 9,
        priority: "High",
        aiSummary: "Outdated property listings, missing clear CTA for viewings. Needs modern landing page.",
        analysis: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "p2",
        businessName: "Marina Dental Clinic",
        industry: "Healthcare",
        location: "Malaga, Spain",
        website: "marinadental.example.com",
        facebook: "https://facebook.com/...",
        instagram: null,
        googleProfile: "https://google.com/...",
        email: "contact@marinadental.example.com",
        phone: "+34 600 987 654",
        websiteScore: 6,
        opportunityScore: 7,
        priority: "Medium",
        aiSummary: "Good reviews but terrible mobile booking experience. High potential for AI receptionist.",
        analysis: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "p3",
        businessName: "Sun Coast Care Home",
        industry: "Aged Care",
        location: "Marbella, Spain",
        website: null,
        facebook: "https://facebook.com/...",
        instagram: null,
        googleProfile: null,
        email: null,
        phone: "+34 600 555 111",
        websiteScore: 0,
        opportunityScore: 8,
        priority: "High",
        aiSummary: "No website detected. Relies entirely on Facebook page. Needs complete digital presence.",
        analysis: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

export default function ProspectFinder() {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState("");
    const [industryFilter, setIndustryFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearching(true);
        // Simulate API call
        setTimeout(() => setIsSearching(false), 800);
    };

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
                <form onSubmit={handleSearch} className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input
                                placeholder={t('salesDashboard.prospectFinder.searchPlaceholder')}
                                className="pl-10 h-12 text-base border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button type="submit" disabled={isSearching} className="h-12 px-8 bg-brand hover:bg-brand-dark text-white text-base">
                            {isSearching ? t('salesDashboard.prospectFinder.searching') : t('salesDashboard.prospectFinder.findBtn')}
                        </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 mr-2">
                            <Filter className="h-4 w-4 mr-2" /> {t('salesDashboard.prospectFinder.filters')}
                        </div>

                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder={t('salesDashboard.prospectFinder.industry')}
                                className="pl-9 h-9 text-sm w-[150px] border-slate-200 dark:border-slate-800"
                                value={industryFilter}
                                onChange={(e) => setIndustryFilter(e.target.value)}
                            />
                        </div>

                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder={t('salesDashboard.prospectFinder.location')}
                                className="pl-9 h-9 text-sm w-[150px] border-slate-200 dark:border-slate-800"
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                            />
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                                    {t('salesDashboard.prospectFinder.oppScoreFilter')} <ChevronDown className="h-4 w-4 ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem>{t('salesDashboard.prospectFinder.anyScore')}</DropdownMenuItem>
                                <DropdownMenuItem>{t('salesDashboard.prospectFinder.highScore')}</DropdownMenuItem>
                                <DropdownMenuItem>{t('salesDashboard.prospectFinder.mediumScore')}</DropdownMenuItem>
                                <DropdownMenuItem>{t('salesDashboard.prospectFinder.lowScore')}</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                                    {t('salesDashboard.prospectFinder.websiteStatus')} <ChevronDown className="h-4 w-4 ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem>{t('salesDashboard.prospectFinder.anyStatus')}</DropdownMenuItem>
                                <DropdownMenuItem>{t('salesDashboard.prospectFinder.hasWebsite')}</DropdownMenuItem>
                                <DropdownMenuItem>{t('salesDashboard.prospectFinder.noWebsite')}</DropdownMenuItem>
                                <DropdownMenuItem>{t('salesDashboard.prospectFinder.lowScoreWeb')}</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </form>
            </div>

            {/* Results Section */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {t('salesDashboard.prospectFinder.resultsFound', { count: mockProspects.length })}
                    </h3>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-xs h-8">{t('salesDashboard.prospectFinder.exportList')}</Button>
                        <Button variant="outline" size="sm" className="text-xs h-8 ml-2">{t('salesDashboard.prospectFinder.saveSearch')}</Button>
                    </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {mockProspects.map((prospect) => (
                        <div key={prospect.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">

                                <div className="flex-1">
                                    <div className="flex items-start gap-3 mb-2">
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                                            {prospect.businessName}
                                        </h4>
                                        {prospect.opportunityScore >= 8 && (
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                                                {t('salesDashboard.prospectFinder.highOpp')}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600 dark:text-slate-400 mb-3">
                                        <span className="flex items-center"><Briefcase className="h-4 w-4 mr-1.5 text-slate-400" /> {prospect.industry}</span>
                                        <span className="flex items-center"><MapPin className="h-4 w-4 mr-1.5 text-slate-400" /> {prospect.location}</span>
                                        {prospect.website ? (
                                            <a href={`https://${prospect.website}`} target="_blank" rel="noreferrer" className="flex items-center text-brand hover:underline">
                                                <Globe className="h-4 w-4 mr-1.5" /> {prospect.website}
                                            </a>
                                        ) : (
                                            <span className="flex items-center text-rose-500"><Globe className="h-4 w-4 mr-1.5" /> {t('salesDashboard.prospectFinder.noWebsiteBadge')}</span>
                                        )}
                                    </div>

                                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30 rounded-md flex items-start gap-3">
                                        <BrainCircuit className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                                            <span className="font-semibold">{t('salesDashboard.prospectFinder.aiInsight')}</span> {prospect.aiSummary}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 lg:gap-3 py-2 lg:py-0 w-full lg:w-48 shrink-0 lg:border-l border-slate-100 dark:border-slate-800 lg:pl-6">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <Star className={`h-4 w-4 ${prospect.opportunityScore >= 8 ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                                            <span className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{prospect.opportunityScore}</span>
                                            <span className="text-sm text-slate-500">/10</span>
                                        </div>
                                        <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">{t('salesDashboard.prospectFinder.oppScoreBadge')}</span>
                                    </div>

                                    <div className="flex flex-col gap-2 w-full max-w-[140px]">
                                        <Button size="sm" className="w-full bg-brand hover:bg-brand-dark text-white">
                                            <Plus className="h-4 w-4 mr-1" /> {t('salesDashboard.prospectFinder.saveLead')}
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm" className="w-full h-8">
                                                    {t('salesDashboard.prospectFinder.moreActions')} <ChevronDown className="h-3 w-3 ml-2" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setSelectedProspect(prospect)}>{t('salesDashboard.prospectFinder.viewProfile')}</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setSelectedProspect(prospect)}>{t('salesDashboard.prospectFinder.runAnalysis')}</DropdownMenuItem>
                                                <DropdownMenuItem>{t('salesDashboard.prospectFinder.generateDemo')}</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Slide-out Intelligence Panel */}
            {selectedProspect && (
                <>
                    <div
                        className="fixed inset-0 bg-slate-900/20 dark:bg-black/40 backdrop-blur-sm z-40 transition-opacity animate-fade-in"
                        onClick={() => setSelectedProspect(null)}
                    />
                    <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] md:w-[500px] z-50 shadow-2xl animate-fade-in flex">
                        <div className="w-full h-full bg-white dark:bg-slate-950 overflow-y-auto">
                            <ProspectIntelligencePanel
                                prospect={selectedProspect}
                                onClose={() => setSelectedProspect(null)}
                                onSaveLead={() => setSelectedProspect(null)}
                                onGenerateDemo={() => { }}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
