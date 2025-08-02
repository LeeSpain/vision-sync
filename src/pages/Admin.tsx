import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { ProjectManager } from '@/components/admin/ProjectManager';
import { ContentManager } from '@/components/admin/ContentManager';
import { MessagesManager } from '@/components/admin/MessagesManager';
import { ConversationsManager } from '@/components/admin/ConversationsManager';
import { LeadsManager } from '@/components/admin/LeadsManager';
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
import { Lock, Settings, Users, BarChart3, FileText, Plus, Edit, Trash2, Eye, Mail, RefreshCw } from 'lucide-react';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Bypass login for testing
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [activeSection, setActiveSection] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '') || 'overview';
    setActiveSection(hash);

    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '') || 'overview';
      setActiveSection(newHash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.email === 'admin@vision-sync.com' && loginForm.password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials. Use: admin@vision-sync.com / admin123');
    }
  };

  const handleStatsLoad = (stats: any) => {
    setDashboardStats(stats);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <div className="min-h-screen flex items-center justify-center bg-gradient-hero py-20">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-royal-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-royal-purple" />
              </div>
              <CardTitle className="font-heading">Admin Access</CardTitle>
              <CardDescription>
                Enter your credentials to access the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-midnight-navy mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    placeholder="admin@vision-sync.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-midnight-navy mb-2">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="Enter password"
                    required
                  />
                </div>
                <Button type="submit" variant="premium" className="w-full">
                  Access Admin Panel
                </Button>
                <p className="text-xs text-cool-gray text-center">
                  Demo: admin@vision-sync.com / admin123
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
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

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity - Takes 2 columns */}
              <div className="lg:col-span-2">
                <RecentActivity key={refreshKey} />
              </div>
              
              {/* Quick Actions - Takes 1 column */}
              <QuickActions stats={dashboardStats} onRefresh={handleRefresh} />
            </div>

            {/* Secondary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lead Sources Chart */}
              <LeadSourceChart 
                sourceBreakdown={dashboardStats?.sourceBreakdown} 
                loading={!dashboardStats}
              />
              
              {/* Business Intelligence Card */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="font-heading">Business Intelligence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-subtle rounded-lg">
                        <div className="text-2xl font-bold text-royal-purple">
                          {dashboardStats?.avgLeadsPerDay || 0}
                        </div>
                        <div className="text-sm text-cool-gray">Avg Leads/Day</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-subtle rounded-lg">
                        <div className="text-2xl font-bold text-emerald-green">
                          {dashboardStats?.conversionRate ? `${Math.round(dashboardStats.conversionRate)}%` : '0%'}
                        </div>
                        <div className="text-sm text-cool-gray">Conversion Rate</div>
                      </div>
                    </div>
                    
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
                    
                    <div className="pt-2 border-t border-soft-lilac/30">
                      <div className="text-sm text-cool-gray mb-2">Performance This Week</div>
                      <div className="flex justify-between text-sm">
                        <span>New Leads:</span>
                        <span className="font-medium">{dashboardStats?.weekLeads || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Qualified:</span>
                        <span className="font-medium">{dashboardStats?.qualified || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Converted:</span>
                        <span className="font-medium">{dashboardStats?.converted || 0}</span>
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

      case 'leads':
        return <LeadsManager />;

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
    <AdminLayout>
      <div className="p-6">
        {renderContent()}
      </div>
    </AdminLayout>
  );
};

export default Admin;