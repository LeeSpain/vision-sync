import {
    BarChart as BarChartIcon,
    LineChart as LineChartIcon,
    PieChart as PieChartIcon,
    TrendingUp,
    Users,
    Target,
    Briefcase
} from "lucide-react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
    BarChart, Bar
} from "recharts";
import { Badge } from "@/components/ui/badge";

const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 5200 },
    { name: 'Mar', revenue: 6100 },
    { name: 'Apr', revenue: 7400 },
    { name: 'May', revenue: 8500 },
    { name: 'Jun', revenue: 11000 },
];

const industryData = [
    { name: 'Real Estate', value: 40 },
    { name: 'Healthcare', value: 30 },
    { name: 'Services', value: 20 },
    { name: 'Hospitality', value: 10 },
];
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6'];

export default function Analytics() {
    return (
        <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Sales Analytics</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Review your performance, conversion rates, and pipeline health.
                    </p>
                </div>
                <div className="flex gap-2">
                    <select className="h-10 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm outline-none">
                        <option>Last 30 Days</option>
                        <option>This Quarter</option>
                        <option>This Year</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Win Rate", value: "24.5%", trend: "+2.1%", icon: Target, isPositive: true },
                    { label: "Avg Deal Size", value: "$4,250", trend: "+$450", icon: Briefcase, isPositive: true },
                    { label: "Sales Cycle", value: "18 Days", trend: "-2 Days", icon: TrendingUp, isPositive: true },
                    { label: "Lost Deals", value: "12", trend: "+3", icon: Users, isPositive: false },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</span>
                            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-md">
                                <stat.icon className="h-4 w-4 text-slate-400" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                            <span className={`text-xs font-bold ${stat.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {stat.trend}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm min-h-[350px] flex flex-col">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">Revenue Forecast</h3>
                    <div className="flex-1 w-full h-full min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
                                <CartesianGrid stroke="#e2e8f0" strokeDasharray="5 5" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `$${value / 1000}k`} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm min-h-[350px] flex flex-col">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">Leads by Industry</h3>
                    <div className="flex-1 w-full h-full min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={industryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {industryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number) => [`${value}%`, 'Share']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm min-h-[400px] flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Conversion Funnel</h3>
                        <Badge className="bg-brand/10 text-brand border-none">Last 30 Days</Badge>
                    </div>
                    <div className="flex-1 bg-slate-50/50 dark:bg-slate-800/20 rounded-lg flex items-center justify-center p-6">
                        <div className="w-full max-w-2xl">
                            <BarChartIcon className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-6" />

                            <div className="space-y-4 w-full">
                                {[
                                    { step: "Prospects Found", count: 1420, pct: "100%" },
                                    { step: "Leads Saved", count: 350, pct: "24.6%" },
                                    { step: "Demos Sent", count: 125, pct: "8.8%" },
                                    { step: "Proposals", count: 45, pct: "3.1%" },
                                    { step: "Won Deals", count: 18, pct: "1.2%" },
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">{row.step}</span>
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-slate-900 dark:text-white">{row.count}</span>
                                            <span className="text-xs text-slate-400 w-12 text-right">{row.pct}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
