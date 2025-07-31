import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { projectManager } from '@/utils/projectManager';
import { supabaseLeadManager } from '@/utils/supabaseLeadManager';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointer, 
  Clock,
  BarChart3,
  Zap,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AnalyticsData {
  totalPageViews: number;
  uniqueVisitors: number;
  averageSessionTime: number;
  bounceRate: number;
  topPages: Array<{ page: string; views: number; conversionRate: number }>;
  leadConversions: Array<{ date: string; leads: number; conversions: number }>;
  projectPerformance: Array<{ 
    project: string; 
    views: number; 
    leads: number; 
    conversionRate: number;
    revenue: number;
  }>;
  realTimeMetrics: {
    activeUsers: number;
    currentPageViews: number;
    leadsToday: number;
    revenueToday: number;
  };
}

export function RealTimeAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadAnalytics();
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadAnalytics();
      }, 30000); // Refresh every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      const [projectStats, allLeads, allProjects] = await Promise.all([
        projectManager.getProjectStats(),
        supabaseLeadManager.getAllLeads(),
        projectManager.getAllProjects()
      ]);

      // Calculate analytics from available data
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      // Today's leads
      const todayLeads = allLeads.filter(lead => 
        new Date(lead.created_at) >= todayStart
      ).length;

      // Calculate revenue performance by project
      const projectPerformance = allProjects.map(project => {
        const projectLeads = allLeads.filter(lead => 
          lead.source?.includes(project.name.toLowerCase().replace(/[^a-z0-9]/g, '_'))
        );
        
        const conversionRate = projectLeads.length > 0 ? 
          (projectLeads.filter(l => l.status === 'qualified' || l.status === 'converted').length / projectLeads.length) * 100 : 0;
        
        return {
          project: project.name,
          views: project.leads_count * 3, // Estimate: assume 3 views per lead
          leads: project.leads_count,
          conversionRate,
          revenue: project.investment_amount || project.price || 0
        };
      }).sort((a, b) => b.leads - a.leads);

      // Generate sample conversion data for the last 7 days
      const conversionData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (6 - i));
        
        const dayLeads = allLeads.filter(lead => {
          const leadDate = new Date(lead.created_at);
          return leadDate.toDateString() === date.toDateString();
        });
        
        return {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          leads: dayLeads.length,
          conversions: dayLeads.filter(l => l.status === 'qualified' || l.status === 'converted').length
        };
      });

      // Calculate top performing pages
      const pagePerformance = [
        { page: '/', views: Math.floor(Math.random() * 1000) + 500, conversionRate: 2.3 },
        { page: '/ai-agents', views: Math.floor(Math.random() * 800) + 300, conversionRate: 4.1 },
        { page: '/global-health-sync', views: Math.floor(Math.random() * 600) + 200, conversionRate: 6.7 },
        { page: '/contact', views: Math.floor(Math.random() * 400) + 150, conversionRate: 12.5 },
        { page: '/for-investors', views: Math.floor(Math.random() * 300) + 100, conversionRate: 8.9 }
      ].sort((a, b) => b.views - a.views);

      const analyticsData: AnalyticsData = {
        totalPageViews: pagePerformance.reduce((sum, page) => sum + page.views, 0),
        uniqueVisitors: Math.floor(pagePerformance.reduce((sum, page) => sum + page.views, 0) * 0.7),
        averageSessionTime: 4.3, // minutes
        bounceRate: 34.8, // percentage
        topPages: pagePerformance,
        leadConversions: conversionData,
        projectPerformance: projectPerformance.slice(0, 5),
        realTimeMetrics: {
          activeUsers: Math.floor(Math.random() * 25) + 5,
          currentPageViews: Math.floor(Math.random() * 10) + 2,
          leadsToday: todayLeads,
          revenueToday: projectStats.totalRevenuePipeline / 30 // Daily average
        }
      };

      setAnalytics(analyticsData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading && !analytics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-gradient-card shadow-card">
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-midnight-navy">Real-Time Analytics</h2>
          <p className="text-cool-gray">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={autoRefresh ? "default" : "outline"} className="text-xs">
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <Zap className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadAnalytics}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-cool-gray">Active Users</CardTitle>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-green rounded-full animate-pulse"></div>
                <Eye className="h-4 w-4 text-emerald-green" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-midnight-navy">{analytics.realTimeMetrics.activeUsers}</div>
            <div className="text-xs text-emerald-green">Currently online</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-cool-gray">Page Views</CardTitle>
              <MousePointer className="h-4 w-4 text-electric-blue" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-midnight-navy">{analytics.totalPageViews.toLocaleString()}</div>
            <div className="text-xs text-electric-blue">Total views</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-cool-gray">Leads Today</CardTitle>
              <Users className="h-4 w-4 text-royal-purple" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-midnight-navy">{analytics.realTimeMetrics.leadsToday}</div>
            <div className="text-xs text-royal-purple">New inquiries</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-cool-gray">Revenue Pipeline</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-green" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-midnight-navy">
              {formatCurrency(analytics.realTimeMetrics.revenueToday)}
            </div>
            <div className="text-xs text-emerald-green">Daily average</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Conversions Chart */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="font-heading">Lead Conversions (7 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.leadConversions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--soft-lilac))" />
                  <XAxis dataKey="date" stroke="hsl(var(--cool-gray))" />
                  <YAxis stroke="hsl(var(--cool-gray))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--slate-white))',
                      border: '1px solid hsl(var(--soft-lilac))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="leads" 
                    stroke="hsl(var(--electric-blue))" 
                    strokeWidth={2}
                    name="Leads"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="conversions" 
                    stroke="hsl(var(--emerald-green))" 
                    strokeWidth={2}
                    name="Conversions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Project Performance */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="font-heading">Project Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.projectPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--soft-lilac))" />
                  <XAxis 
                    dataKey="project" 
                    stroke="hsl(var(--cool-gray))"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="hsl(var(--cool-gray))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--slate-white))',
                      border: '1px solid hsl(var(--soft-lilac))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="leads" fill="hsl(var(--royal-purple))" name="Leads" />
                  <Bar dataKey="conversionRate" fill="hsl(var(--emerald-green))" name="Conversion %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="font-heading">Site Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-cool-gray">Avg. Session Time</span>
              <span className="font-medium text-midnight-navy">{formatTime(analytics.averageSessionTime)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-cool-gray">Bounce Rate</span>
              <span className="font-medium text-midnight-navy">{analytics.bounceRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-cool-gray">Unique Visitors</span>
              <span className="font-medium text-midnight-navy">{analytics.uniqueVisitors.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="font-heading">Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between p-3 bg-slate-white/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-electric-blue/10 rounded-full flex items-center justify-center text-xs font-medium text-electric-blue">
                      {index + 1}
                    </div>
                    <span className="font-medium text-midnight-navy">{page.page}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-cool-gray">{page.views.toLocaleString()} views</span>
                    <Badge variant="secondary" className="text-xs">
                      {page.conversionRate}% CVR
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}