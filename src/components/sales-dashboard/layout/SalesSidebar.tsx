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

const salesMenuItems = [
    { title: "Overview", icon: LayoutDashboard, url: "/sales-dashboard" },
    { title: "Prospect Finder", icon: Target, url: "/sales-dashboard/prospects" },
    { title: "Leads", icon: Users, url: "/sales-dashboard/leads" },
    { title: "Pipeline", icon: TrendingUp, url: "/sales-dashboard/pipeline" },
    { title: "Deals", icon: Briefcase, url: "/sales-dashboard/deals" },
];

const toolsMenuItems = [
    { title: "Demo Generator", icon: MonitorPlay, url: "/sales-dashboard/demos" },
    { title: "Quotes", icon: FileText, url: "/sales-dashboard/quotes" },
    { title: "Contracts", icon: PenTool, url: "/sales-dashboard/contracts" },
    { title: "Payments", icon: CreditCard, url: "/sales-dashboard/payments" },
];

const analysisMenuItems = [
    { title: "Analytics", icon: BarChart, url: "/sales-dashboard/analytics" },
    { title: "Sales AI Copilot", icon: Bot, url: "/sales-dashboard/copilot" },
];

export function SalesSidebar() {
    const location = useLocation();

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
                    <span className="text-lg font-heading font-bold text-slate-900 dark:text-white">Vision Sales</span>
                </Link>
            </SidebarHeader>

            <SidebarContent className="p-2 gap-4 text-slate-600 dark:text-slate-300">

                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">Core Workflow</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {salesMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(item.url)}
                                        tooltip={item.title}
                                        className="hover:bg-slate-100 dark:hover:bg-slate-800 dark:data-[active=true]:bg-slate-800 data-[active=true]:bg-slate-100 dark:data-[active=true]:text-brand-light data-[active=true]:text-brand-dark transition-colors"
                                    >
                                        <Link to={item.url} className="flex items-center gap-3">
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">Sales Tools</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {toolsMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(item.url)}
                                        tooltip={item.title}
                                        className="hover:bg-slate-100 dark:hover:bg-slate-800 dark:data-[active=true]:bg-slate-800 data-[active=true]:bg-slate-100 dark:data-[active=true]:text-brand-light data-[active=true]:text-brand-dark transition-colors"
                                    >
                                        <Link to={item.url} className="flex items-center gap-3">
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">Intelligence</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {analysisMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive(item.url)}
                                        tooltip={item.title}
                                        className="hover:bg-slate-100 dark:hover:bg-slate-800 dark:data-[active=true]:bg-slate-800 data-[active=true]:bg-slate-100 dark:data-[active=true]:text-brand-light data-[active=true]:text-brand-dark transition-colors"
                                    >
                                        <Link to={item.url} className="flex items-center gap-3">
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
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
