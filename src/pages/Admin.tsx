import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { AdminErrorBoundary } from '@/components/AdminErrorBoundary';
import { AdminLayout } from '@/components/AdminLayout';
import { ProjectManager } from '@/components/admin/ProjectManager';
import { ContentManager } from '@/components/admin/ContentManager';
import { MessagesManager } from '@/components/admin/MessagesManager';
import { ConversationsManager } from '@/components/admin/ConversationsManager';
import { LeadsManager } from '@/components/admin/LeadsManager';
import { EnhancedLeadsManager } from '@/components/admin/EnhancedLeadsManager';
import { ProductCatalogManager } from '@/components/admin/ProductCatalogManager';
import { CurrencyAwareTemplateManager } from '@/components/admin/CurrencyAwareTemplateManager';
import { IndustryManager } from '@/components/admin/IndustryManager';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { RecentActivity } from '@/components/admin/RecentActivity';
import { QuickActions } from '@/components/admin/QuickActions';
import { LeadSourceChart } from '@/components/admin/LeadSourceChart';
import { RealTimeAnalytics } from '@/components/admin/RealTimeAnalytics';
import AiAgentManager from '@/components/admin/AiAgentManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Lock, Settings, Users, BarChart3, FileText, Plus, Edit, Trash2, Eye, Mail, RefreshCw, MessageCircle, Building2, Layout, Bot } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const { user, adminStatus, loading: authLoading, signOut } = useAuthContext();
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
        const [conversationsResult, leadsResult, templatesResult, projectsResult, agentsResult] = await Promise.all([
          supabase.from('ai_conversations').select('id, created_at', { count: 'exact' }),
          supabase.from('leads').select('id, created_at', { count: 'exact' }),
          supabase.from('app_templates').select('id').eq('is_active', true),
          supabase.from('projects').select('id', { count: 'exact' }),
          supabase.from('ai_agents').select('id').eq('is_active', true)
        ]);

        const today = new Date().toISOString().split('T')[0];
        const conversationsToday = conversationsResult.data?.filter(conv => 
          conv.created_at && conv.created_at.startsWith(today)
        ).length || 0;
        const leadsToday = leadsResult.data?.filter(lead => 
          lead.created_at && lead.created_at.startsWith(today)
        ).length || 0;

        setRealTimeMetrics({
          totalConversations: conversationsResult.count || 0,
          conversationsToday,
          totalLeads: leadsResult.count || 0,
          leadsToday,
          activeTemplates: templatesResult.data?.length || 0,
          totalProjects: projectsResult.count || 0,
          activeAgents: agentsResult.data?.length || 0
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
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Enhanced Stats Overview */}
            <DashboardStats key={refreshKey} onStatsLoad={handleStatsLoad} />

            {/* Comprehensive Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Messages Metrics */}
              <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-cool-gray">Messages</CardTitle>
                    <Mail className="h-4 w-4 text-electric-blue" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-midnight-navy">{realTimeMetrics?.totalLeads || 0}</div>
                  <div className="text-xs text-emerald-green">+{realTimeMetrics?.leadsToday || 0} today</div>
                  <div className="text-xs text-cool-gray mt-1">Via contact forms</div>
                </CardContent>
              </Card>

              {/* AI Conversations Metrics */}
              <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-cool-gray">AI Conversations</CardTitle>
                    <MessageCircle className="h-4 w-4 text-royal-purple" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-midnight-navy">{realTimeMetrics?.totalConversations || 0}</div>
                  <div className="text-xs text-royal-purple">+{realTimeMetrics?.conversationsToday || 0} today</div>
                  <div className="text-xs text-cool-gray mt-1">{realTimeMetrics?.activeAgents || 0} active agents</div>
                </CardContent>
              </Card>

              {/* Templates Performance */}
              <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-cool-gray">Templates</CardTitle>
                    <FileText className="h-4 w-4 text-emerald-green" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-midnight-navy">{realTimeMetrics?.activeTemplates || 0}</div>
                  <div className="text-xs text-emerald-green">Active templates</div>
                  <div className="text-xs text-cool-gray mt-1">Ready for use</div>
                </CardContent>
              </Card>

              {/* Content Performance */}
              <Card className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-cool-gray">Projects</CardTitle>
                    <Eye className="h-4 w-4 text-sky-blue" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-midnight-navy">{realTimeMetrics?.totalProjects || 0}</div>
                  <div className="text-xs text-sky-blue">Total projects</div>
                  <div className="text-xs text-cool-gray mt-1">In portfolio</div>
                </CardContent>
              </Card>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity - Takes 2 columns */}
              <div className="lg:col-span-2">
                <RecentActivity key={refreshKey} />
              </div>
              
              {/* Quick Actions - Takes 1 column */}
              <QuickActions stats={dashboardStats} onRefresh={handleRefresh} />
            </div>

            {/* Advanced Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lead Sources Chart */}
              <LeadSourceChart 
                sourceBreakdown={dashboardStats?.sourceBreakdown} 
                loading={!dashboardStats}
              />
              
              {/* Project Performance */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading">Project Performance</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="space-y-4">
                     <div className="flex justify-between items-center">
                       <span className="text-cool-gray">Total Projects</span>
                       <span className="text-2xl font-bold text-midnight-navy">{realTimeMetrics?.totalProjects || 0}</span>
                     </div>
                     <div className="space-y-2">
                       <div className="flex justify-between text-sm">
                         <span className="text-cool-gray">Live:</span>
                         <span className="text-emerald-green font-medium">0</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-cool-gray">Development:</span>
                         <span className="text-electric-blue font-medium">{realTimeMetrics?.totalProjects || 0}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-cool-gray">Pipeline Value:</span>
                         <span className="text-royal-purple font-medium">€{dashboardStats?.totalPipeline?.toLocaleString() || '0'}</span>
                       </div>
                     </div>
                     <div className="pt-3 border-t border-soft-lilac/30">
                       <div className="text-sm text-cool-gray mb-2">Recent Activity</div>
                       <div className="text-xs text-midnight-navy">+{realTimeMetrics?.leadsToday || 0} leads today</div>
                     </div>
                   </div>
                </CardContent>
              </Card>
              
              {/* AI Agent Performance */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading">AI Agent Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gradient-subtle rounded-lg">
                        <div className="text-xl font-bold text-royal-purple">94%</div>
                        <div className="text-xs text-cool-gray">Satisfaction</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-subtle rounded-lg">
                        <div className="text-xl font-bold text-emerald-green">1.8s</div>
                        <div className="text-xs text-cool-gray">Avg Response</div>
                      </div>
                    </div>
                     <div className="space-y-2">
                       <div className="flex justify-between text-sm">
                         <span className="text-cool-gray">Active Agents:</span>
                         <span className="font-medium">{realTimeMetrics?.activeAgents || 0}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-cool-gray">Total Interactions:</span>
                         <span className="font-medium">{realTimeMetrics?.totalConversations || 0}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                         <span className="text-cool-gray">Lead Generation:</span>
                         <span className="text-emerald-green font-medium">{realTimeMetrics?.totalLeads ? `${Math.round((realTimeMetrics.totalLeads / (realTimeMetrics.totalConversations || 1)) * 100)}%` : '0%'}</span>
                       </div>
                     </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Business Intelligence Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue & Sales Intelligence */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading">Revenue Intelligence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-subtle rounded-lg">
                        <div className="text-2xl font-bold text-emerald-green">
                          €{dashboardStats?.totalPipeline?.toLocaleString() || '0'}
                        </div>
                        <div className="text-sm text-cool-gray">Total Pipeline</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-subtle rounded-lg">
                        <div className="text-2xl font-bold text-royal-purple">
                          {dashboardStats?.conversionRate ? `${Math.round(dashboardStats.conversionRate)}%` : '0%'}
                        </div>
                        <div className="text-sm text-cool-gray">Conversion Rate</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-cool-gray">Investment Pipeline:</span>
                        <span className="text-royal-purple font-medium">€{dashboardStats?.projectStats?.revenueByBilling?.investment?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-cool-gray">One-time Revenue:</span>
                        <span className="text-emerald-green font-medium">€{dashboardStats?.projectStats?.revenueByBilling?.['one-time']?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-cool-gray">Monthly Recurring:</span>
                        <span className="text-sky-blue font-medium">€{dashboardStats?.projectStats?.revenueByBilling?.subscription?.toLocaleString() || '0'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Operational Intelligence */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading">Operational Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardStats?.followUpNeeded > 0 && (
                      <div className="p-4 bg-coral-orange/10 border border-coral-orange/30 rounded-lg">
                        <div className="flex items-center gap-2 text-coral-orange mb-1">
                          <RefreshCw className="h-4 w-4" />
                          <span className="font-medium">Action Required</span>
                        </div>
                        <p className="text-sm text-midnight-navy">
                          {dashboardStats.followUpNeeded} leads need follow-up
                        </p>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-cool-gray">Avg Leads/Day:</span>
                        <span className="font-medium">{dashboardStats?.avgLeadsPerDay || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-cool-gray">This Week:</span>
                        <span className="font-medium">{dashboardStats?.weekLeads || 0} leads</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-cool-gray">Qualified:</span>
                        <span className="text-emerald-green font-medium">{dashboardStats?.qualified || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-cool-gray">Converted:</span>
                        <span className="text-royal-purple font-medium">{dashboardStats?.converted || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-cool-gray">High Priority:</span>
                        <span className="text-coral-orange font-medium">{dashboardStats?.highPriorityCount || 0}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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

      case 'leads':
        return <LeadsManager />;

      case 'sales-pipeline':
        return <EnhancedLeadsManager />;

      case 'catalog':
        return <ProductCatalogManager />;

      case 'content':
        return <ContentManager />;

      case 'analytics':
        return <RealTimeAnalytics />;

      case 'ai-agent':
        return <AiAgentManager />;

      case 'settings':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Site Settings</CardTitle>
                <CardDescription>Configure global site settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-midnight-navy mb-2">
                    Site Title
                  </label>
                  <Input defaultValue="Vision-Sync" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-midnight-navy mb-2">
                    Site Tagline
                  </label>
                  <Input defaultValue="Build. Showcase. Sell. Invest. Sync your vision with the future." />
                </div>
                <Button variant="premium">
                  Save Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading">User Management</CardTitle>
                <CardDescription>Manage admin users and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-soft-lilac/30 rounded-lg">
                    <div>
                      <div className="font-medium">Lee (Admin)</div>
                      <div className="text-sm text-cool-gray">admin@vision-sync.com</div>
                    </div>
                    <Badge>Super Admin</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <AdminErrorBoundary>
      <AdminLayout>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-midnight-navy mb-2">Admin Dashboard</h1>
              <p className="text-cool-gray">Manage your projects, templates, and leads</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-cool-gray">{user.email}</span>
              <Button variant="outline" onClick={signOut}>Sign Out</Button>
            </div>
          </div>
          {renderContent()}
        </div>
      </AdminLayout>
    </AdminErrorBoundary>
  );
};

export default Admin;