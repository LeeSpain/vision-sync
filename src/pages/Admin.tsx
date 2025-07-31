import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { ProjectManager } from '@/components/admin/ProjectManager';
import { ContentManager } from '@/components/admin/ContentManager';
import { LeadsManager } from '@/components/admin/LeadsManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Lock, Settings, Users, BarChart3, FileText, Plus, Edit, Trash2, Eye } from 'lucide-react';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Bypass login for testing
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [activeSection, setActiveSection] = useState('overview');

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

  const leads = [
    { id: 1, name: 'John Smith', email: 'john@example.com', type: 'Investment', project: 'Global Health-Sync', date: '2024-01-15' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@tech.com', type: 'Purchase', project: 'ICE-SOS Lite', date: '2024-01-14' },
    { id: 3, name: 'Mike Chen', email: 'mike@startup.io', type: 'Custom Build', project: 'Web Application', date: '2024-01-13' },
    { id: 4, name: 'Lisa Brown', email: 'lisa@corp.com', type: 'Investment', project: 'Nurse-Sync', date: '2024-01-12' },
  ];

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
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-card shadow-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-cool-gray">Total Projects</CardTitle>
                    <Settings className="h-4 w-4 text-royal-purple" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-midnight-navy">6</div>
                  <div className="text-xs text-emerald-green">+1 this month</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-cool-gray">Active Leads</CardTitle>
                    <Users className="h-4 w-4 text-electric-blue" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-midnight-navy">50</div>
                  <div className="text-xs text-emerald-green">+12 this week</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-cool-gray">Revenue Pipeline</CardTitle>
                    <BarChart3 className="h-4 w-4 text-emerald-green" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-midnight-navy">€2.1M</div>
                  <div className="text-xs text-emerald-green">+15% this quarter</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-cool-gray">Conversion Rate</CardTitle>
                    <FileText className="h-4 w-4 text-coral-orange" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-midnight-navy">24%</div>
                  <div className="text-xs text-emerald-green">+3% improvement</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-soft-lilac/20 rounded-lg">
                      <div>
                        <p className="font-medium">New lead from ICE-SOS Lite</p>
                        <p className="text-sm text-cool-gray">2 hours ago</p>
                      </div>
                      <Badge>New</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-soft-lilac/20 rounded-lg">
                      <div>
                        <p className="font-medium">Global Health-Sync page updated</p>
                        <p className="text-sm text-cool-gray">1 day ago</p>
                      </div>
                      <Badge variant="outline">Updated</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-20 flex-col" onClick={() => window.location.hash = 'add-project'}>
                      <Plus className="h-6 w-6 mb-2" />
                      Add Project
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => window.location.hash = 'content'}>
                      <FileText className="h-6 w-6 mb-2" />
                      Upload Content
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => window.open('/', '_blank')}>
                      <Eye className="h-6 w-6 mb-2" />
                      Preview Site
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => window.location.hash = 'analytics'}>
                      <BarChart3 className="h-6 w-6 mb-2" />
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'projects':
        return <ProjectManager />;

      case 'leads':
        return <LeadsManager />;

      case 'content':
        return <ContentManager />;

      case 'analytics':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Analytics Dashboard</CardTitle>
              <CardDescription>Monitor your platform performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-royal-purple">1,247</div>
                    <p className="text-sm text-cool-gray">Page Views (This Month)</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-green">89</div>
                    <p className="text-sm text-cool-gray">Unique Visitors</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-electric-blue">12</div>
                    <p className="text-sm text-cool-gray">Contact Forms Submitted</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Top Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Global Health-Sync</span>
                          <span className="font-medium">324 views</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ICE-SOS Lite</span>
                          <span className="font-medium">289 views</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nurse-Sync</span>
                          <span className="font-medium">156 views</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Conversion Funnel</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Homepage Visits</span>
                          <span className="font-medium">1,247</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Project Views</span>
                          <span className="font-medium">456</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Contact Forms</span>
                          <span className="font-medium">12</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        );

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