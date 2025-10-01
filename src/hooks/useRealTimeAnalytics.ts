import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LiveMetrics {
  activeUsers: number;
  conversionRate: number;
  conversionRateChange: number;
  todayRevenue: number;
  leads: number;
  avgSessionTime: number;
  bounceRate: number;
}

interface ConversionFunnelStage {
  stage: string;
  users: number;
  conversions: number;
  rate: number;
}

interface PageView {
  date: string;
  views: number;
}

interface RevenueMetrics {
  pipelineValue: number;
  activeDeals: number;
  avgDealSize: number;
  winRate: number;
  dealVelocity: number;
  trendData: Array<{ date: string; revenue: number; pipeline: number }>;
}

interface UserBehavior {
  trafficSources: Array<{ name: string; value: number }>;
  topPages: Array<{ path: string; views: number; avgTime: number; conversions: number }>;
  sessionDuration: Array<{ range: string; count: number }>;
  deviceTypes: Array<{ name: string; value: number }>;
  pagesPerSession: number;
  avgScrollDepth: number;
  interactionsPerSession: number;
  topConvertingSources: Array<{ name: string; leads: number; conversionRate: number }>;
}

interface ProjectPerformance {
  id: string;
  name: string;
  category: string;
  views: number;
  inquiries: number;
  conversions: number;
  interactions: number;
  conversionRate: number;
  engagementRate: number;
  avgTimeOnPage: number;
  bounceRate: number;
  revenue: number;
  status: string;
}

export function useRealTimeAnalytics() {
  const [loading, setLoading] = useState(true);
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>({
    activeUsers: 0,
    conversionRate: 0,
    conversionRateChange: 0,
    todayRevenue: 0,
    leads: 0,
    avgSessionTime: 0,
    bounceRate: 0,
  });
  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnelStage[]>([]);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics>({
    pipelineValue: 0,
    activeDeals: 0,
    avgDealSize: 0,
    winRate: 0,
    dealVelocity: 0,
    trendData: [],
  });
  const [userBehavior, setUserBehavior] = useState<UserBehavior>({
    trafficSources: [],
    topPages: [],
    sessionDuration: [],
    deviceTypes: [],
    pagesPerSession: 0,
    avgScrollDepth: 0,
    interactionsPerSession: 0,
    topConvertingSources: [],
  });
  const [projectPerformance, setProjectPerformance] = useState<ProjectPerformance[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(true);

  const fetchAnalyticsData = async (showNotification = false) => {
    try {
      // Fetch live metrics from various sources
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get today's leads
      const { data: todayLeads } = await supabase
        .from('leads')
        .select('*')
        .gte('created_at', today.toISOString());

      // Get page analytics
      const { data: pageAnalyticsData } = await supabase
        .from('page_analytics')
        .select('*')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      // Get conversion tracking
      const { data: conversionData } = await supabase
        .from('conversion_tracking')
        .select('*')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Get quotes for revenue metrics
      const { data: quotesData } = await supabase
        .from('quotes')
        .select('*');

      // Get projects for performance metrics
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('is_public', true);

      // Calculate active users (unique sessions in last 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const activeSessions = new Set(
        pageAnalyticsData?.filter(p => new Date(p.created_at) > fiveMinutesAgo).map(p => p.session_id) || []
      );

      // Calculate conversion funnel
      const funnelStages = [
        { stage: 'Awareness', users: pageAnalyticsData?.length || 0 },
        { stage: 'Interest', users: conversionData?.filter(c => c.funnel_stage === 'interest').length || 0 },
        { stage: 'Consideration', users: conversionData?.filter(c => c.funnel_stage === 'consideration').length || 0 },
        { stage: 'Purchase Intent', users: todayLeads?.length || 0 },
        { stage: 'Conversion', users: quotesData?.filter(q => q.status === 'accepted').length || 0 },
      ];

      const funnelWithRates = funnelStages.map((stage, index) => ({
        ...stage,
        conversions: index < funnelStages.length - 1 ? funnelStages[index + 1].users : stage.users,
        rate: stage.users > 0 ? Math.round((index < funnelStages.length - 1 ? funnelStages[index + 1].users : stage.users) / stage.users * 100) : 0,
      }));

      // Calculate page views for last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      const pageViewsData = last7Days.map(date => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: pageAnalyticsData?.filter(p => p.created_at.startsWith(date)).length || 0,
      }));

      // Calculate traffic sources
      const sources = pageAnalyticsData?.reduce((acc, page) => {
        const source = page.referrer ? new URL(page.referrer).hostname : 'Direct';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const trafficSources = Object.entries(sources)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      // Calculate top pages
      const pageStats = pageAnalyticsData?.reduce((acc, page) => {
        if (!acc[page.page_path]) {
          acc[page.page_path] = { views: 0, totalTime: 0, conversions: 0 };
        }
        acc[page.page_path].views++;
        acc[page.page_path].totalTime += page.duration_seconds || 0;
        return acc;
      }, {} as Record<string, { views: number; totalTime: number; conversions: number }>) || {};

      const topPages = Object.entries(pageStats)
        .map(([path, stats]) => ({
          path,
          views: stats.views,
          avgTime: Math.round(stats.totalTime / stats.views),
          conversions: conversionData?.filter(c => c.page_path === path).length || 0,
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

      // Calculate device types
      const devices = pageAnalyticsData?.reduce((acc, page) => {
        const device = page.device_type || 'Unknown';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const deviceTypes = Object.entries(devices).map(([name, value]) => ({ name, value }));

      // Calculate session duration ranges
      const sessionDuration = [
        { range: '0-30s', count: pageAnalyticsData?.filter(p => (p.duration_seconds || 0) <= 30).length || 0 },
        { range: '31-60s', count: pageAnalyticsData?.filter(p => (p.duration_seconds || 0) > 30 && (p.duration_seconds || 0) <= 60).length || 0 },
        { range: '61-120s', count: pageAnalyticsData?.filter(p => (p.duration_seconds || 0) > 60 && (p.duration_seconds || 0) <= 120).length || 0 },
        { range: '120s+', count: pageAnalyticsData?.filter(p => (p.duration_seconds || 0) > 120).length || 0 },
      ];

      // Calculate revenue metrics
      const activeQuotes = quotesData?.filter(q => q.status !== 'rejected' && q.status !== 'draft') || [];
      const acceptedQuotes = quotesData?.filter(q => q.status === 'accepted') || [];
      const pipelineValue = activeQuotes.reduce((sum, q) => sum + (Number(q.total) || 0), 0);
      const avgDealSize = acceptedQuotes.length > 0 
        ? acceptedQuotes.reduce((sum, q) => sum + (Number(q.total) || 0), 0) / acceptedQuotes.length 
        : 0;
      const winRate = quotesData && quotesData.length > 0
        ? Math.round((acceptedQuotes.length / quotesData.length) * 100)
        : 0;

      // Calculate revenue trend for last 30 days
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toISOString().split('T')[0];
      });

      const trendData = last30Days.map(date => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: acceptedQuotes?.filter(q => q.accepted_at?.startsWith(date)).reduce((sum, q) => sum + (Number(q.total) || 0), 0) || 0,
        pipeline: activeQuotes?.filter(q => q.created_at.startsWith(date)).reduce((sum, q) => sum + (Number(q.total) || 0), 0) || 0,
      }));

      // Calculate project performance with comprehensive metrics
      const projectStats = projectsData?.map(project => {
        const projectRoute = project.route || '';
        const projectPageViews = pageAnalyticsData?.filter(p => 
          p.page_path.includes(projectRoute) || p.page_path.includes(project.id)
        ).length || 0;
        
        const projectLeads = todayLeads?.filter(l => {
          const formData = l.form_data as any;
          return formData?.projectId === project.id || l.message?.includes(project.title);
        }).length || 0;

        const projectConversions = conversionData?.filter(c =>
          c.page_path?.includes(projectRoute) || c.project_id === project.id
        ).length || 0;

        const projectInteractions = pageAnalyticsData?.filter(p =>
          p.page_path.includes(projectRoute)
        ).reduce((sum, p) => sum + (p.interactions_count || 0), 0) || 0;

        const avgTimeOnPage = pageAnalyticsData?.filter(p => p.page_path.includes(projectRoute))
          .reduce((sum, p, _, arr) => {
            const duration = p.duration_seconds || 0;
            return arr.length > 0 ? sum + duration / arr.length : 0;
          }, 0) || 0;

        const bounceRate = (() => {
          const projectViews = pageAnalyticsData?.filter(p => p.page_path.includes(projectRoute)) || [];
          const bounces = projectViews.filter(p => (p.duration_seconds || 0) < 10).length;
          return projectViews.length > 0 ? Math.round((bounces / projectViews.length) * 100) : 0;
        })();

        const revenue = quotesData?.filter(q => 
          q.project_name?.includes(project.title) && q.status === 'accepted'
        ).reduce((sum, q) => sum + (Number(q.total) || 0), 0) || 0;
        
        return {
          id: project.id,
          name: project.title,
          category: project.category || 'Uncategorized',
          views: projectPageViews,
          inquiries: projectLeads,
          conversions: projectConversions,
          interactions: projectInteractions,
          conversionRate: projectPageViews > 0 ? Math.round((projectLeads / projectPageViews) * 100) : 0,
          engagementRate: projectPageViews > 0 ? Math.round((projectInteractions / projectPageViews) * 100) : 0,
          avgTimeOnPage: Math.round(avgTimeOnPage),
          bounceRate,
          revenue,
          status: project.status || 'active',
        };
      }).sort((a, b) => b.views - a.views) || [];

      // Calculate lead source conversions
      const leadSources = todayLeads?.reduce((acc, lead) => {
        const source = lead.source || 'Unknown';
        if (!acc[source]) {
          acc[source] = { leads: 0, conversions: 0 };
        }
        acc[source].leads++;
        if (lead.status === 'qualified' || lead.status === 'converted') {
          acc[source].conversions++;
        }
        return acc;
      }, {} as Record<string, { leads: number; conversions: number }>) || {};

      const topConvertingSources = Object.entries(leadSources)
        .map(([name, stats]) => ({
          name,
          leads: stats.leads,
          conversionRate: stats.leads > 0 ? Math.round((stats.conversions / stats.leads) * 100) : 0,
        }))
        .sort((a, b) => b.conversionRate - a.conversionRate)
        .slice(0, 5);

      // Calculate avg session time and bounce rate
      const totalDuration = pageAnalyticsData?.reduce((sum, p) => sum + (p.duration_seconds || 0), 0) || 0;
      const avgSessionTime = pageAnalyticsData && pageAnalyticsData.length > 0 
        ? Math.round(totalDuration / pageAnalyticsData.length) 
        : 0;
      const bounceRate = pageAnalyticsData && pageAnalyticsData.length > 0
        ? Math.round((pageAnalyticsData.filter(p => (p.duration_seconds || 0) < 10).length / pageAnalyticsData.length) * 100)
        : 0;

      // Calculate conversion rate
      const totalVisitors = pageAnalyticsData?.length || 1;
      const conversions = todayLeads?.length || 0;
      const conversionRate = Math.round((conversions / totalVisitors) * 100);

      setLiveMetrics({
        activeUsers: activeSessions.size,
        conversionRate,
        conversionRateChange: Math.round(Math.random() * 10 - 5), // Placeholder - would calculate from historical data
        todayRevenue: acceptedQuotes.filter(q => {
          const acceptedDate = new Date(q.accepted_at || '');
          return acceptedDate >= today;
        }).reduce((sum, q) => sum + (Number(q.total) || 0), 0),
        leads: todayLeads?.length || 0,
        avgSessionTime,
        bounceRate,
      });

      setConversionFunnel(funnelWithRates);
      setPageViews(pageViewsData);
      setRevenueMetrics({
        pipelineValue,
        activeDeals: activeQuotes.length,
        avgDealSize: Math.round(avgDealSize),
        winRate,
        dealVelocity: 14, // Placeholder - would calculate from quote data
        trendData,
      });
      setUserBehavior({
        trafficSources,
        topPages,
        sessionDuration,
        deviceTypes,
        pagesPerSession: 3.2, // Placeholder
        avgScrollDepth: 65, // Placeholder
        interactionsPerSession: 5, // Placeholder
        topConvertingSources,
      });
      setProjectPerformance(projectStats);
      setLastUpdate(new Date());

      if (showNotification) {
        toast.success('Analytics data updated in real-time!', {
          description: `New data detected at ${new Date().toLocaleTimeString()}`,
          duration: 2000,
        });
      }

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setIsLive(false);
      toast.error('Analytics update failed', {
        description: 'Real-time connection lost. Retrying...',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();

    // Set up real-time subscriptions with notifications
    const pageAnalyticsChannel = supabase
      .channel('page_analytics_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'page_analytics' }, (payload) => {
        console.log('📊 New page analytics data:', payload);
        setIsLive(true);
        fetchAnalyticsData(true);
      })
      .subscribe();

    const conversionChannel = supabase
      .channel('conversion_tracking_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversion_tracking' }, (payload) => {
        console.log('🎯 New conversion data:', payload);
        setIsLive(true);
        fetchAnalyticsData(true);
      })
      .subscribe();

    const leadsChannel = supabase
      .channel('leads_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload) => {
        console.log('🚀 New lead data:', payload);
        setIsLive(true);
        fetchAnalyticsData(true);
      })
      .subscribe();

    const quotesChannel = supabase
      .channel('quotes_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quotes' }, (payload) => {
        console.log('💰 New quote data:', payload);
        setIsLive(true);
        fetchAnalyticsData(true);
      })
      .subscribe();

    const projectsChannel = supabase
      .channel('projects_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, (payload) => {
        console.log('🚀 Project updated:', payload);
        setIsLive(true);
        fetchAnalyticsData(true);
      })
      .subscribe();

    // Refresh data every 30 seconds (without notification)
    const interval = setInterval(() => fetchAnalyticsData(false), 30000);

    return () => {
      supabase.removeChannel(pageAnalyticsChannel);
      supabase.removeChannel(conversionChannel);
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(quotesChannel);
      supabase.removeChannel(projectsChannel);
      clearInterval(interval);
    };
  }, []);

  return {
    liveMetrics,
    conversionFunnel,
    pageViews,
    revenueMetrics,
    userBehavior,
    projectPerformance,
    loading,
    lastUpdate,
    isLive,
  };
}