import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Settings, Users, BarChart3, FileText, Plus, Edit, Trash2, Eye, Lock } from 'lucide-react';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo authentication - in real app, use proper authentication
    if (loginForm.email === 'admin@vision-sync.com' && loginForm.password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials. Use: admin@vision-sync.com / admin123');
    }
  };

  const projects = [
    { id: 1, name: 'Global Health-Sync', status: 'MVP', category: 'Investment', visibility: 'Public', leads: 12 },
    { id: 2, name: 'Nurse-Sync', status: 'Live', category: 'Investment', visibility: 'Public', leads: 8 },
    { id: 3, name: 'Conneqt-Central', status: 'Private', category: 'Internal', visibility: 'Private', leads: 0 },
    { id: 4, name: 'ICE-SOS Lite', status: 'For Sale', category: 'For Sale', visibility: 'Public', leads: 15 },
    { id: 5, name: 'AI Spain Homes', status: 'Concept', category: 'Investment', visibility: 'Public', leads: 6 },
    { id: 6, name: 'Tether-Band', status: 'Beta', category: 'For Sale', visibility: 'Public', leads: 9 },
  ];

  const leads = [
    { id: 1, name: 'John Smith', email: 'john@example.com', type: 'Investment', project: 'Global Health-Sync', date: '2024-01-15' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@tech.com', type: 'Purchase', project: 'ICE-SOS Lite', date: '2024-01-14' },
    { id: 3, name: 'Mike Chen', email: 'mike@startup.io', type: 'Custom Build', project: 'Web Application', date: '2024-01-13' },
    { id: 4, name: 'Lisa Brown', email: 'lisa@corp.com', type: 'Investment', project: 'Nurse-Sync', date: '2024-01-12' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <Header />
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
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Admin Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-midnight-navy text-slate-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold mb-2">Admin Dashboard</h1>
              <p className="text-slate-white/80">Manage Vision-Sync platform content and leads</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                onClick={() => window.open('/', '_blank')}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Homepage
              </Button>
              <Badge className="bg-emerald-green text-white">
                Admin Access
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <div className="text-2xl font-bold text-midnight-navy">$2.3M</div>
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

          {/* Main Content Tabs */}
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-heading">Project Management</CardTitle>
                      <CardDescription>Manage project visibility, status, and information</CardDescription>
                    </div>
                    <Button variant="premium">
                      <Plus className="h-4 w-4" />
                      Add Project
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Visibility</TableHead>
                        <TableHead>Leads</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{project.status}</Badge>
                          </TableCell>
                          <TableCell>{project.category}</TableCell>
                          <TableCell>
                            <Badge variant={project.visibility === 'Public' ? 'default' : 'secondary'}>
                              {project.visibility}
                            </Badge>
                          </TableCell>
                          <TableCell>{project.leads}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leads">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Lead Management</CardTitle>
                  <CardDescription>Track and manage incoming leads and inquiries</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell className="font-medium">{lead.name}</TableCell>
                          <TableCell>{lead.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{lead.type}</Badge>
                          </TableCell>
                          <TableCell>{lead.project}</TableCell>
                          <TableCell>{lead.date}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Homepage Layout</CardTitle>
                    <CardDescription>Drag and drop to rearrange homepage sections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-4 border border-soft-lilac/30 rounded-lg bg-gradient-card">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">🔥 Featured Projects</span>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 border border-soft-lilac/30 rounded-lg bg-gradient-card">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">💼 Investment Opportunities</span>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 border border-soft-lilac/30 rounded-lg bg-gradient-card">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">🛒 Platforms for Sale</span>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading">Content Library</CardTitle>
                    <CardDescription>Manage images, documents, and assets</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full">
                        <Plus className="h-4 w-4" />
                        Upload Files
                      </Button>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="aspect-square bg-gradient-hero rounded-lg flex items-center justify-center">
                          <FileText className="h-8 w-8 text-royal-purple/30" />
                        </div>
                        <div className="aspect-square bg-gradient-hero rounded-lg flex items-center justify-center">
                          <FileText className="h-8 w-8 text-royal-purple/30" />
                        </div>
                        <div className="aspect-square bg-gradient-hero rounded-lg flex items-center justify-center">
                          <FileText className="h-8 w-8 text-royal-purple/30" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings">
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
                          <div className="font-medium">Admin User</div>
                          <div className="text-sm text-cool-gray">admin@vision-sync.com</div>
                        </div>
                        <Badge>Super Admin</Badge>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Plus className="h-4 w-4" />
                        Add User
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Admin;