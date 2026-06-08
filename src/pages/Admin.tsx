import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { AdminErrorBoundary } from '@/components/AdminErrorBoundary';
import { AdminLayout } from '@/components/AdminLayout';
import { ProjectManager } from '@/components/admin/ProjectManager';
import { MessagesManager } from '@/components/admin/MessagesManager';
import { ConversationsManager } from '@/components/admin/ConversationsManager';
import { LeadsManager } from '@/components/admin/LeadsManager';
import { EnhancedLeadsManager } from '@/components/admin/EnhancedLeadsManager';
import { CurrencyAwareTemplateManager } from '@/components/admin/CurrencyAwareTemplateManager';
import { IndustryManager } from '@/components/admin/IndustryManager';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { RecentActivity } from '@/components/admin/RecentActivity';
import { ActionQueue } from '@/components/admin/ActionQueue';
import { LeadSourceChart } from '@/components/admin/LeadSourceChart';
import { RealTimeAnalytics } from '@/components/admin/RealTimeAnalytics';
import { WelcomeSection } from '@/components/admin/WelcomeSection';
import { TodaySummary } from '@/components/admin/TodaySummary';
import { SettingsManager } from '@/components/admin/SettingsManager';
import { SolutionsManager } from '@/components/admin/SolutionsManager';
import { PricingManager } from '@/components/admin/PricingManager';
import { SkillsManager } from '@/components/admin/SkillsManager';
import { PageSectionsManager } from '@/components/admin/PageSectionsManager';
import AiAgentManager from '@/components/admin/AiAgentManager';
import BrainAgentDashboard from '@/components/admin/BrainAgentDashboard';
import AgentTestingPanel from '@/components/admin/AgentTestingPanel';
import RoutingRulesManager from '@/components/admin/RoutingRulesManager';
import { SalesTeamManager } from '@/components/admin/SalesTeamManager';
import { QuotesManager } from '@/components/admin/QuotesManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Eye, Mail, RefreshCw, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

const Admin = () => {
  const { t } = useTranslation();
  const { user, adminStatus, loading: authLoading, signOut, profile, refreshProfile } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [realTimeMetrics, setRealTimeMetrics] = useState<any>(null);

  // Get section from URL hash, default to 'overview'
  const activeSection = location.hash.replace('#', '') || 'overview';

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
      } else if (adminStatus === 'user') {
        navigate('/');
      }
    }
  }, [user, adminStatus, authLoading, navigate]);

  // Scroll to top when admin section changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [activeSection]);

  // Fetch real-time metrics
  useEffect(() => {
    const fetchRealTimeMetrics = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];

        // Use server-side counts and date filtering
        const [
          conversationsCount,
          conversationsToday,
          leadsCount,
          leadsToday,
          templatesResult,
          projectsCount,
          agentsResult
        ] = await Promise.all([
          supabase.from('ai_conversations').select('id', { count: 'exact', head: true }),
          supabase.from('ai_conversations').select('id', { count: 'exact', head: true }).gte('created_at', today),
          supabase.from('leads').select('id', { count: 'exact', head: true }),
          supabase.from('leads').select('id', { count: 'exact', head: true }).gte('created_at', today),
          supabase.from('app_templates').select('id', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('projects').select('id', { count: 'exact', head: true }),
          supabase.from('ai_agents').select('id', { count: 'exact', head: true }).eq('is_active', true)
        ]);

        setRealTimeMetrics({
          totalConversations: conversationsCount.count || 0,
          conversationsToday: conversationsToday.count || 0,
          totalLeads: leadsCount.count || 0,
          leadsToday: leadsToday.count || 0,
          activeTemplates: templatesResult.count || 0,
          totalProjects: projectsCount.count || 0,
          activeAgents: agentsResult.count || 0
        });
      } catch (err) {
        console.error('Error fetching metrics:', err);
      }
    };

    fetchRealTimeMetrics();

    // Refresh every 30 seconds
    const interval = setInterval(fetchRealTimeMetrics, 30000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  // Add error boundary logging
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);



  const handleStatsLoad = (stats: any) => {
    setDashboardStats(stats);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (authLoading || !user || adminStatus !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-white">{t('adminOverview.loading')}</div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Welcome Section with Quick Actions */}
            <WelcomeSection
              userEmail={user?.email}
              userProfile={{ firstName: profile?.first_name, lastName: profile?.last_name }}
              onRefresh={handleRefresh}
            />

            {/* Today's Summary */}
            <TodaySummary
              metrics={{
                leadsToday: realTimeMetrics?.leadsToday || 0,
                conversationsToday: realTimeMetrics?.conversationsToday || 0,
                qualifiedToday: dashboardStats?.qualifiedToday || 0,
                revenueToday: dashboardStats?.revenueToday || 0
              }}
            />

            {/* Enhanced Stats Overview */}
            <DashboardStats key={refreshKey} onStatsLoad={handleStatsLoad} />

            {/* Section: Action Center */}
            <div>
              <h2 className="text-sm font-semibold text-cool-gray uppercase tracking-wide mb-4">
                {t('adminOverview.actionCenter')}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Action Queue - Takes 1 column */}
                <ActionQueue />

                {/* Recent Activity - Takes 2 columns */}
                <div className="lg:col-span-2">
                  <RecentActivity key={refreshKey} />
                </div>
              </div>
            </div>

            {/* Section: Quick Metrics */}
            <div>
              <h2 className="text-sm font-semibold text-cool-gray uppercase tracking-wide mb-4">
                {t('adminOverview.quickMetrics')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Messages Metrics */}
                <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-cool-gray">{t('adminOverview.messages')}</CardTitle>
                      <Mail className="h-4 w-4 text-electric-blue" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-midnight-navy">{realTimeMetrics?.totalLeads || 0}</div>
                    <div className="text-xs text-emerald-green">{t('adminOverview.today', { count: realTimeMetrics?.leadsToday || 0 })}</div>
                    <div className="text-xs text-cool-gray mt-1">{t('adminOverview.viaContactForms')}</div>
                  </CardContent>
                </Card>

                {/* AI Conversations Metrics */}
                <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-cool-gray">{t('adminOverview.aiConversations')}</CardTitle>
                      <MessageCircle className="h-4 w-4 text-royal-purple" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-midnight-navy">{realTimeMetrics?.totalConversations || 0}</div>
                    <div className="text-xs text-royal-purple">{t('adminOverview.today', { count: realTimeMetrics?.conversationsToday || 0 })}</div>
                    <div className="text-xs text-cool-gray mt-1">{t('adminOverview.activeAgents', { count: realTimeMetrics?.activeAgents || 0 })}</div>
                  </CardContent>
                </Card>

                {/* Templates Performance */}
                <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-cool-gray">{t('adminOverview.templates')}</CardTitle>
                      <FileText className="h-4 w-4 text-emerald-green" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-midnight-navy">{realTimeMetrics?.activeTemplates || 0}</div>
                    <div className="text-xs text-emerald-green">{t('adminOverview.activeTemplates')}</div>
                    <div className="text-xs text-cool-gray mt-1">{t('adminOverview.readyForUse')}</div>
                  </CardContent>
                </Card>

                {/* Content Performance */}
                <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-cool-gray">{t('adminOverview.projects')}</CardTitle>
                      <Eye className="h-4 w-4 text-sky-blue" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-midnight-navy">{realTimeMetrics?.totalProjects || 0}</div>
                    <div className="text-xs text-sky-blue">{t('adminOverview.totalProjects')}</div>
                    <div className="text-xs text-cool-gray mt-1">{t('adminOverview.inPortfolio')}</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Section: Analytics */}
            <div>
              <h2 className="text-sm font-semibold text-cool-gray uppercase tracking-wide mb-4">
                {t('adminOverview.analyticsInsights')}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lead Sources Chart */}
                <LeadSourceChart
                  sourceBreakdown={dashboardStats?.sourceBreakdown}
                  loading={!dashboardStats}
                />

                {/* Project Performance */}
                <Card className="bg-gradient-card shadow-card">
                  <CardHeader>
                    <CardTitle className="font-heading">{t('adminOverview.projectPerformance')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-cool-gray">{t('adminOverview.totalProjects')}</span>
                        <span className="text-2xl font-bold text-midnight-navy">{realTimeMetrics?.totalProjects || 0}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-cool-gray">{t('adminOverview.live')}</span>
                          <span className="text-emerald-green font-medium">0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-cool-gray">{t('adminOverview.development')}</span>
                          <span className="text-electric-blue font-medium">{realTimeMetrics?.totalProjects || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-cool-gray">{t('adminOverview.pipelineValue')}</span>
                          <span className="text-royal-purple font-medium">€{dashboardStats?.totalPipeline?.toLocaleString() || '0'}</span>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-soft-lilac/30">
                        <div className="text-sm text-cool-gray mb-2">{t('adminOverview.recentActivity')}</div>
                        <div className="text-xs text-midnight-navy">{t('adminOverview.leadsToday', { count: realTimeMetrics?.leadsToday || 0 })}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Agent Performance */}
                <Card className="bg-gradient-card shadow-card">
                  <CardHeader>
                    <CardTitle className="font-heading">{t('adminOverview.aiAgentMetrics')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-cool-gray">{t('adminOverview.activeAgents', { count: '' }).trim()}:</span>
                          <span className="font-medium">{realTimeMetrics?.activeAgents || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-cool-gray">{t('adminOverview.totalInteractions')}</span>
                          <span className="font-medium">{realTimeMetrics?.totalConversations || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-cool-gray">{t('adminOverview.leadGeneration')}</span>
                          <span className="text-emerald-green font-medium">{realTimeMetrics?.totalLeads && realTimeMetrics?.totalConversations ? `${Math.round((realTimeMetrics.totalLeads / realTimeMetrics.totalConversations) * 100)}%` : '0%'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-cool-gray">{t('adminOverview.todaysConversations')}</span>
                          <span className="text-royal-purple font-medium">+{realTimeMetrics?.conversationsToday || 0}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Section: Business Intelligence */}
            <div>
              <h2 className="text-sm font-semibold text-cool-gray uppercase tracking-wide mb-4">
                {t('adminOverview.businessIntelligence')}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue & Sales Intelligence */}
                <Card className="bg-gradient-card shadow-card">
                  <CardHeader>
                    <CardTitle className="font-heading">{t('adminOverview.revenueIntelligence')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-gradient-subtle rounded-lg">
                          <div className="text-2xl font-bold text-emerald-green">
                            €{dashboardStats?.totalPipeline?.toLocaleString() || '0'}
                          </div>
                          <div className="text-sm text-cool-gray">{t('adminOverview.totalPipeline')}</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-subtle rounded-lg">
                          <div className="text-2xl font-bold text-royal-purple">
                            {dashboardStats?.conversionRate ? `${Math.round(dashboardStats.conversionRate)}%` : '0%'}
                          </div>
                          <div className="text-sm text-cool-gray">{t('adminOverview.conversionRate')}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-cool-gray">{t('adminOverview.investmentPipeline')}</span>
                          <span className="text-royal-purple font-medium">€{dashboardStats?.projectStats?.revenueByBilling?.investment?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-cool-gray">{t('adminOverview.oneTimeRevenue')}</span>
                          <span className="text-emerald-green font-medium">€{dashboardStats?.projectStats?.revenueByBilling?.['one-time']?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-cool-gray">{t('adminOverview.monthlyRecurring')}</span>
                          <span className="text-sky-blue font-medium">€{dashboardStats?.projectStats?.revenueByBilling?.subscription?.toLocaleString() || '0'}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Operational Intelligence */}
                <Card className="bg-gradient-card shadow-card">
                  <CardHeader>
                    <CardTitle className="font-heading">{t('adminOverview.operationalMetrics')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardStats?.followUpNeeded > 0 && (
                        <div className="p-4 bg-coral-orange/10 border border-coral-orange/30 rounded-lg">
                          <div className="flex items-center gap-2 text-coral-orange mb-1">
                            <RefreshCw className="h-4 w-4" />
                            <span className="font-medium">{t('adminOverview.actionRequired')}</span>
                          </div>
                          <p className="text-sm text-midnight-navy">
                            {t('adminOverview.leadsNeedFollowUp', { count: dashboardStats.followUpNeeded })}
                          </p>
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-cool-gray">{t('adminOverview.avgLeadsPerDay')}</span>
                          <span className="font-medium">{dashboardStats?.avgLeadsPerDay || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-cool-gray">{t('adminOverview.thisWeek')}</span>
                          <span className="font-medium">{t('adminOverview.leads', { count: dashboardStats?.weekLeads || 0 })}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-cool-gray">{t('adminOverview.qualified')}</span>
                          <span className="text-emerald-green font-medium">{dashboardStats?.qualified || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-cool-gray">{t('adminOverview.converted')}</span>
                          <span className="text-royal-purple font-medium">{dashboardStats?.converted || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-cool-gray">{t('adminOverview.highPriority')}</span>
                          <span className="text-coral-orange font-medium">{dashboardStats?.highPriorityCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 'messages':
        return <MessagesManager />;

      case 'conversations':
        return <ConversationsManager />;

      case 'projects':
        return <ProjectManager />;

      case 'templates':
        return <CurrencyAwareTemplateManager />;

      case 'industries':
        return <IndustryManager />;

      case 'pricing':
        return <PricingManager />;

      case 'skills':
        return <SkillsManager />;

      case 'solutions':
        return <SolutionsManager />;

      case 'page-sections':
        return <PageSectionsManager />;

      case 'leads':
        return <LeadsManager />;

      case 'quotes':
        return <QuotesManager />;

      case 'sales-pipeline':
        return <EnhancedLeadsManager />;

      case 'analytics':
        return <RealTimeAnalytics />;

      case 'ai-agent':
        return <AiAgentManager />;

      case 'brain-command':
        return <BrainAgentDashboard />;

      case 'agent-testing':
        return <AgentTestingPanel />;

      case 'routing-rules':
        return <RoutingRulesManager />;

      case 'sales-team':
        return <SalesTeamManager />;

      case 'settings':
        return (
          <SettingsManager
            userId={user?.id || ''}
            userEmail={user?.email}
            onProfileUpdate={refreshProfile}
          />
        );

      default:
        return <div>{t('adminOverview.sectionNotFound')}</div>;
    }
  };

  return (
    <AdminErrorBoundary>
      <AdminLayout>
        <div className="p-6">
          {renderContent()}
        </div>
      </AdminLayout>
    </AdminErrorBoundary>
  );
};

export default Admin;