import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Target,
    TrendingUp,
    Briefcase,
    MonitorPlay,
    FileText,
    PenTool,
    CreditCard,
    BarChart,
    Bot
} from "lucide-react";
import { useTranslation } from "react-i18next";

const salesMenuItems = [
    { titleKey: "salesDashboard.sidebar.overview", icon: LayoutDashboard, url: "/sales-dashboard" },
    { titleKey: "salesDashboard.sidebar.prospectFinder", icon: Target, url: "/sales-dashboard/prospects" },
    { titleKey: "salesDashboard.sidebar.leads", icon: Users, url: "/sales-dashboard/leads" },
    { titleKey: "salesDashboard.sidebar.pipeline", icon: TrendingUp, url: "/sales-dashboard/pipeline" },
    { titleKey: "salesDashboard.sidebar.deals", icon: Briefcase, url: "/sales-dashboard/deals" },
];

const toolsMenuItems = [
    { titleKey: "salesDashboard.sidebar.demoGenerator", icon: MonitorPlay, url: "/sales-dashboard/demos" },
    { titleKey: "salesDashboard.sidebar.quotes", icon: FileText, url: "/sales-dashboard/quotes" },
    { titleKey: "salesDashboard.sidebar.contracts", icon: PenTool, url: "/sales-dashboard/contracts" },
    { titleKey: "salesDashboard.sidebar.payments", icon: CreditCard, url: "/sales-dashboard/payments" },
];

const analysisMenuItems = [
    { titleKey: "salesDashboard.sidebar.analytics", icon: BarChart, url: "/sales-dashboard/analytics" },
    { titleKey: "salesDashboard.sidebar.salesCopilot", icon: Bot, url: "/sales-dashboard/copilot" },
];

export function SalesSidebar() {
    const location = useLocation();
    const { t } = useTranslation();

    const isActive = (url: string) => {
        if (url === "/sales-dashboard") {
            return location.pathname === url;
        }
        return location.pathname.startsWith(url);
    };

    return (
        <Sidebar variant="sidebar" className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-midnight-navy">
            <SidebarHeader className="border-b border-slate-200 dark:border-slate-800 h-16 flex items-center px-4">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-brand flex items-center justify-center">
                        <span className="text-white font-bold text-lg">V</span>
                    </div>
                    <span className="text-lg font-heading font-bold text-slate-900 dark:text-white">{t('salesDashboard.sidebar.visionSales')}</span>
                </Link>
            </SidebarHeader>

            <SidebarContent className="p-2 gap-4 text-slate-600 dark:text-slate-300">

                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">{t('salesDashboard.sidebar.coreWorkflow')}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {salesMenuItems.map((item) => (
                                <SidebarMenuItem key={item.titleKey}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(item.url)}
                                        tooltip={t(item.titleKey)}
                                        className="hover:bg-slate-100 dark:hover:bg-slate-800 dark:data-[active=true]:bg-slate-800 data-[active=true]:bg-slate-100 dark:data-[active=true]:text-brand-light data-[active=true]:text-brand-dark transition-colors"
                                    >
                                        <Link to={item.url} className="flex items-center gap-3">
                                            <item.icon className="h-4 w-4" />
                                            <span>{t(item.titleKey)}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">{t('salesDashboard.sidebar.salesTools')}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {toolsMenuItems.map((item) => (
                                <SidebarMenuItem key={item.titleKey}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(item.url)}
                                        tooltip={t(item.titleKey)}
                                        className="hover:bg-slate-100 dark:hover:bg-slate-800 dark:data-[active=true]:bg-slate-800 data-[active=true]:bg-slate-100 dark:data-[active=true]:text-brand-light data-[active=true]:text-brand-dark transition-colors"
                                    >
                                        <Link to={item.url} className="flex items-center gap-3">
                                            <item.icon className="h-4 w-4" />
                                            <span>{t(item.titleKey)}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">{t('salesDashboard.sidebar.intelligence')}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {analysisMenuItems.map((item) => (
                                <SidebarMenuItem key={item.titleKey}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(item.url)}
                                        tooltip={t(item.titleKey)}
                                        className="hover:bg-slate-100 dark:hover:bg-slate-800 dark:data-[active=true]:bg-slate-800 data-[active=true]:bg-slate-100 dark:data-[active=true]:text-brand-light data-[active=true]:text-brand-dark transition-colors"
                                    >
                                        <Link to={item.url} className="flex items-center gap-3">
                                            <item.icon className="h-4 w-4" />
                                            <span>{t(item.titleKey)}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>
        </Sidebar>
    );
}
