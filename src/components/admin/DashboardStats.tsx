import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabaseLeadManager } from '@/utils/supabaseLeadManager';
import { useCurrency } from '@/hooks/useCurrency';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface DashboardStatsProps {
  onStatsLoad?: (stats: any) => void;
}

export function DashboardStats({ onStatsLoad }: DashboardStatsProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get comprehensive stats from both leads and projects
      const [leadStats, allLeads, projectStats] = await Promise.all([
        supabaseLeadManager.getLeadStats(),
        supabaseLeadManager.getAllLeads(),
        // Import and use projectManager
        (async () => {
          const { projectManager } = await import('@/utils/projectManager');
          return await projectManager.getProjectStats();
        })()
      ]);

      // Calculate revenue pipeline from investment inquiries AND project values
      const investmentLeads = allLeads.filter(lead => 
        lead.form_data?.inquiry_type === 'investment' || 
        lead.form_data?.projectInterest?.includes('investment')
      );
      
      const leadsPipeline = investmentLeads.reduce((sum, lead) => {
        const amount = lead.form_data?.investment_amount || lead.form_data?.budget;
        if (amount && typeof amount === 'string') {
          const numericAmount = parseFloat(amount.replace(/[€,$,]/g, ''));
          return sum + (isNaN(numericAmount) ? 0 : numericAmount);
        }
        return sum;
      }, 0);

      // Add project revenue pipeline
      const totalPipeline = leadsPipeline + projectStats.totalRevenuePipeline;

      // Calculate source breakdown
      const sourceBreakdown = allLeads.reduce((acc, lead) => {
        const source = lead.source || 'unknown';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Get high priority leads count
      const highPriorityCount = allLeads.filter(lead => lead.priority === 'high').length;
      
      // Get leads requiring follow-up
      const now = new Date();
      const followUpNeeded = allLeads.filter(lead => {
        if (!lead.next_follow_up) return false;
        return new Date(lead.next_follow_up) <= now;
      }).length;

      // Calculate conversion rate based on qualified vs total leads
      const qualifiedLeads = allLeads.filter(lead => 
        lead.status === 'qualified' || lead.status === 'converted'
      ).length;
      const conversionRate = leadStats.total > 0 ? (qualifiedLeads / leadStats.total) * 100 : 0;

      const enhancedStats = {
        ...leadStats,
        totalPipeline,
        sourceBreakdown,
        highPriorityCount,
        followUpNeeded,
        projectsCount: projectStats.totalProjects,
        avgLeadsPerDay: leadStats.total > 0 ? Math.round(leadStats.total / 30) : 0,
        conversionRate,
        qualified: qualifiedLeads,
        converted: allLeads.filter(lead => lead.status === 'converted').length,
        projectStats
      };

      setStats(enhancedStats);
      onStatsLoad?.(enhancedStats);
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-card shadow-card border-coral-orange/30">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-coral-orange">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }


  const formatPercentage = (value: number) => {
    return `${Math.round(value)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Leads */}
      <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-cool-gray">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-electric-blue" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-midnight-navy">{stats.total}</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="text-xs text-emerald-green">+{stats.todayLeads} today</div>
            {stats.highPriorityCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {stats.highPriorityCount} high priority
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Pipeline */}
      <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-cool-gray">Revenue Pipeline</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-green" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-midnight-navy">
            {formatPrice(stats.totalPipeline)}
          </div>
          <div className="space-y-1 mt-2">
            {stats.projectStats && (
              <>
                <div className="flex justify-between text-xs">
                  <span className="text-cool-gray">Investment:</span>
                  <span className="font-medium text-royal-purple">
                    {formatPrice(stats.projectStats.revenueByCategory?.Investment || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-cool-gray">For Sale:</span>
                  <span className="font-medium text-emerald-green">
                    {formatPrice(stats.projectStats.revenueByCategory?.['For Sale'] || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-cool-gray">Subscription:</span>
                  <span className="font-medium text-sky-blue">
                    {formatPrice(stats.projectStats.subscriptionRevenue || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-cool-gray">Leads:</span>
                  <span className="text-emerald-green">{stats.qualified} qualified</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Rate */}
      <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-cool-gray">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-royal-purple" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-midnight-navy">
            {formatPercentage(stats.conversionRate)}
          </div>
          <div className="text-xs text-emerald-green">
            {stats.converted} converted
          </div>
        </CardContent>
      </Card>

      {/* Follow-ups Needed */}
      <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-cool-gray">Follow-ups</CardTitle>
            <Activity className="h-4 w-4 text-coral-orange" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-midnight-navy">{stats.followUpNeeded}</div>
          <div className="flex items-center gap-1 mt-1">
            {stats.followUpNeeded > 0 ? (
              <div className="text-xs text-coral-orange">Action needed</div>
            ) : (
              <div className="flex items-center gap-1 text-xs text-emerald-green">
                <CheckCircle className="h-3 w-3" />
                All caught up
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}