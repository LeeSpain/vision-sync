import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabaseLeadManager, Lead, ProjectLead } from '@/utils/supabaseLeadManager';
import { 
  Search, 
  Download, 
  Eye, 
  Edit, 
  Mail, 
  Phone, 
  Calendar, 
  Trash2,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter
} from 'lucide-react';

export function LeadsManager() {
  const [leads, setLeads] = useState<(Lead & { type?: string; project?: string })[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<(Lead & { type?: string; project?: string })[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<(Lead & { type?: string; project?: string }) | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    newLeads: 0,
    qualified: 0,
    converted: 0,
    todayLeads: 0,
    weekLeads: 0,
    conversionRate: 0
  });

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  const loadLeads = async () => {
    try {
      const [generalLeads, projectLeads, leadStats] = await Promise.all([
        supabaseLeadManager.getAllLeads(),
        supabaseLeadManager.getAllProjectLeads(),
        supabaseLeadManager.getLeadStats()
      ]);

      // Combine and format leads
      const combinedLeads = [
        ...generalLeads.map(lead => ({
          ...lead,
          type: 'General Lead',
          project: '',
          source: lead.source as Lead['source']
        })),
        ...projectLeads.map(lead => ({
          ...lead,
          type: 'Project Lead',
          project: (lead as any).projects?.name || lead.project_id,
          source: 'project-inquiry' as Lead['source'],
          company: lead.company,
          phone: lead.phone,
          form_data: lead.form_data
        }))
      ].sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());

      setLeads(combinedLeads);
      setStats(leadStats);
    } catch (error) {
      console.error('Error loading leads:', error);
    }
  };

  const filterLeads = () => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter(lead => lead.source === sourceFilter);
    }

    setFilteredLeads(filtered);
  };

  const updateLeadStatus = async (leadId: string, status: Lead['status']) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    if (lead.type === 'Project Lead') {
      await supabaseLeadManager.updateProjectLead(leadId, { status });
    } else {
      await supabaseLeadManager.updateLead(leadId, { status });
    }
    loadLeads();
  };

  const updateLeadPriority = async (leadId: string, priority: Lead['priority']) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    if (lead.type === 'Project Lead') {
      await supabaseLeadManager.updateProjectLead(leadId, { priority });
    } else {
      await supabaseLeadManager.updateLead(leadId, { priority });
    }
    loadLeads();
  };

  const deleteLead = async (leadId: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      const lead = leads.find(l => l.id === leadId);
      if (!lead) return;

      if (lead.type === 'Project Lead') {
        await supabaseLeadManager.deleteProjectLead(leadId);
      } else {
        await supabaseLeadManager.deleteLead(leadId);
      }
      loadLeads();
    }
  };

  const exportLeads = async () => {
    const csvContent = await supabaseLeadManager.exportLeads();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vision_sync_leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const sendEmail = (email: string) => {
    window.open(`mailto:${email}?subject=Follow up on your Vision-Sync inquiry`);
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'bg-electric-blue text-white';
      case 'contacted': return 'bg-coral-orange text-white';
      case 'qualified': return 'bg-royal-purple text-white';
      case 'converted': return 'bg-emerald-green text-white';
      case 'closed': return 'bg-cool-gray text-white';
      default: return 'bg-cool-gray text-white';
    }
  };

  const getPriorityColor = (priority: Lead['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-cool-gray';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-cool-gray" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-midnight-navy">{stats.total}</div>
            <p className="text-xs text-cool-gray">
              {stats.todayLeads} today, {stats.weekLeads} this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <AlertCircle className="h-4 w-4 text-electric-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-electric-blue">{stats.newLeads}</div>
            <p className="text-xs text-cool-gray">Require attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified</CardTitle>
            <CheckCircle className="h-4 w-4 text-royal-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-royal-purple">{stats.qualified}</div>
            <p className="text-xs text-cool-gray">Ready for conversion</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-green">{stats.conversionRate}%</div>
            <p className="text-xs text-cool-gray">{stats.converted} converted</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lead Management</span>
            <Button onClick={exportLeads} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cool-gray" />
                <Input
                  placeholder="Search leads by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="contact">Contact Form</SelectItem>
                <SelectItem value="custom-build">Custom Build</SelectItem>
                <SelectItem value="investor">Investor</SelectItem>
                <SelectItem value="project-inquiry">Project Inquiry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Leads Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-soft-lilac/30">
                  <th className="text-left p-3 font-medium text-midnight-navy">Lead</th>
                  <th className="text-left p-3 font-medium text-midnight-navy">Type</th>
                  <th className="text-left p-3 font-medium text-midnight-navy">Source</th>
                  <th className="text-left p-3 font-medium text-midnight-navy">Status</th>
                  <th className="text-left p-3 font-medium text-midnight-navy">Priority</th>
                  <th className="text-left p-3 font-medium text-midnight-navy">Date</th>
                  <th className="text-left p-3 font-medium text-midnight-navy">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-soft-lilac/20 hover:bg-soft-lilac/10">
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-midnight-navy">{lead.name}</div>
                        <div className="text-sm text-cool-gray">{lead.email}</div>
                        {lead.company && (
                          <div className="text-xs text-cool-gray">{lead.company}</div>
                        )}
                        {lead.project && (
                          <div className="text-xs text-royal-purple font-medium">Project: {lead.project}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-xs">
                        {lead.type}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{lead.source}</Badge>
                    </td>
                    <td className="p-3">
                      <Select
                        value={lead.status}
                        onValueChange={(value: Lead['status']) => updateLeadStatus(lead.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <Badge className={getStatusColor(lead.status)}>{lead.status}</Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3">
                      <Select
                        value={lead.priority}
                        onValueChange={(value: Lead['priority']) => updateLeadPriority(lead.id, value)}
                      >
                        <SelectTrigger className="w-24">
                          <span className={getPriorityColor(lead.priority)}>{lead.priority}</span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-3 text-sm text-cool-gray">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedLead(lead)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Lead Details: {lead.name}</DialogTitle>
                              <DialogDescription>
                                Complete information for this lead inquiry
                              </DialogDescription>
                            </DialogHeader>
                            {selectedLead && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Name</label>
                                    <p className="text-sm text-cool-gray">{selectedLead.name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <p className="text-sm text-cool-gray">{selectedLead.email}</p>
                                  </div>
                                  {selectedLead.company && (
                                    <div>
                                      <label className="text-sm font-medium">Company</label>
                                      <p className="text-sm text-cool-gray">{selectedLead.company}</p>
                                    </div>
                                  )}
                                  <div>
                                    <label className="text-sm font-medium">Source</label>
                                    <p className="text-sm text-cool-gray">{selectedLead.source}</p>
                                  </div>
                                   {selectedLead.type && (
                                     <div>
                                       <label className="text-sm font-medium">Lead Type</label>
                                       <p className="text-sm text-cool-gray">{selectedLead.type}</p>
                                     </div>
                                   )}
                                   {selectedLead.project && (
                                     <div>
                                       <label className="text-sm font-medium">Project</label>
                                       <p className="text-sm text-cool-gray">{selectedLead.project}</p>
                                     </div>
                                   )}
                                   {selectedLead.form_data?.projectType && (
                                     <div>
                                       <label className="text-sm font-medium">Project Type</label>
                                       <p className="text-sm text-cool-gray">{selectedLead.form_data.projectType}</p>
                                     </div>
                                   )}
                                   {selectedLead.form_data?.budget && (
                                     <div>
                                       <label className="text-sm font-medium">Budget</label>
                                       <p className="text-sm text-cool-gray">{selectedLead.form_data.budget}</p>
                                     </div>
                                   )}
                                   {selectedLead.form_data?.investmentRange && (
                                     <div>
                                       <label className="text-sm font-medium">Investment Range</label>
                                       <p className="text-sm text-cool-gray">{selectedLead.form_data.investmentRange}</p>
                                     </div>
                                   )}
                                   {selectedLead.form_data?.timeline && (
                                     <div>
                                       <label className="text-sm font-medium">Timeline</label>
                                       <p className="text-sm text-cool-gray">{selectedLead.form_data.timeline}</p>
                                     </div>
                                   )}
                                </div>
                                
                                 {selectedLead.form_data?.features && selectedLead.form_data.features.length > 0 && (
                                   <div>
                                     <label className="text-sm font-medium">Required Features</label>
                                     <div className="flex flex-wrap gap-2 mt-1">
                                       {selectedLead.form_data.features.map((feature: string, index: number) => (
                                         <Badge key={index} variant="outline">{feature}</Badge>
                                       ))}
                                     </div>
                                   </div>
                                 )}
                                
                                 {(selectedLead.form_data?.message || (selectedLead as any).message) && (
                                   <div>
                                     <label className="text-sm font-medium">Message</label>
                                     <p className="text-sm text-cool-gray bg-soft-lilac/10 p-3 rounded-md">
                                       {selectedLead.form_data?.message || (selectedLead as any).message}
                                     </p>
                                   </div>
                                 )}
                                 
                                 {selectedLead.form_data?.description && (
                                   <div>
                                     <label className="text-sm font-medium">Project Description</label>
                                     <p className="text-sm text-cool-gray bg-soft-lilac/10 p-3 rounded-md">
                                       {selectedLead.form_data.description}
                                     </p>
                                   </div>
                                 )}

                                 {selectedLead.form_data && Object.keys(selectedLead.form_data).length > 0 && (
                                   <div>
                                     <label className="text-sm font-medium">Additional Form Data</label>
                                     <pre className="text-xs text-cool-gray bg-soft-lilac/10 p-3 rounded-md overflow-auto max-h-32">
                                       {JSON.stringify(selectedLead.form_data, null, 2)}
                                     </pre>
                                   </div>
                                 )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => sendEmail(lead.email)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteLead(lead.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredLeads.length === 0 && (
              <div className="text-center py-8 text-cool-gray">
                {searchTerm || statusFilter !== 'all' || sourceFilter !== 'all' 
                  ? 'No leads match your current filters.' 
                  : 'No leads yet. Leads will appear here when visitors submit forms on your site.'
                }
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}