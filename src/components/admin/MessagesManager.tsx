import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabaseLeadManager, Lead } from '@/utils/supabaseLeadManager';
import { 
  Search, 
  Download, 
  Eye, 
  Mail, 
  Phone, 
  Calendar, 
  MessageSquare,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter
} from 'lucide-react';

export function MessagesManager() {
  const [messages, setMessages] = useState<Lead[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<Lead | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    week: 0,
    unread: 0
  });

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, searchTerm, sourceFilter]);

  const loadMessages = async () => {
    try {
      const allLeads = await supabaseLeadManager.getAllLeads();
      const leadStats = await supabaseLeadManager.getLeadStats();
      
      setMessages(allLeads);
      setStats({
        total: allLeads.length,
        today: leadStats.todayLeads,
        week: leadStats.weekLeads,
        unread: allLeads.filter(lead => lead.status === 'new').length
      });
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const filterMessages = () => {
    let filtered = messages;

    if (searchTerm) {
      filtered = filtered.filter(message =>
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (message.company && message.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (message.form_data?.message && message.form_data.message.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter(message => message.source === sourceFilter);
    }

    setFilteredMessages(filtered);
  };

  const exportMessages = async () => {
    const csvContent = await supabaseLeadManager.exportLeads();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contact_messages_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const sendEmail = (email: string) => {
    window.open(`mailto:${email}?subject=Re: Your inquiry with Vision-Sync`);
  };

  const getSourceColor = (source: Lead['source']) => {
    switch (source) {
      case 'contact': return 'bg-electric-blue text-white';
      case 'custom-build': return 'bg-royal-purple text-white';
      case 'investor': return 'bg-emerald-green text-white';
      case 'ai-agent': return 'bg-coral-orange text-white';
      default: return 'bg-cool-gray text-white';
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

  const getSourceDisplayName = (source: string) => {
    switch (source) {
      case 'contact': return 'General Contact';
      case 'custom-build': return 'Custom Build Request';
      case 'investor': return 'Investor Inquiry';
      case 'ai-agent': return 'AI Agent Questionnaire';
      default: return source;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-cool-gray" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-midnight-navy">{stats.total}</div>
            <p className="text-xs text-cool-gray">All contact forms</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Clock className="h-4 w-4 text-electric-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-electric-blue">{stats.today}</div>
            <p className="text-xs text-cool-gray">Messages today</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-royal-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-royal-purple">{stats.week}</div>
            <p className="text-xs text-cool-gray">Messages this week</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <AlertCircle className="h-4 w-4 text-coral-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-coral-orange">{stats.unread}</div>
            <p className="text-xs text-cool-gray">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Messages
            </span>
            <Button onClick={exportMessages} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </CardTitle>
          <CardDescription>
            All messages from contact forms across your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cool-gray" />
                <Input
                  placeholder="Search messages by name, email, company, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="contact">General Contact</SelectItem>
                <SelectItem value="custom-build">Custom Build</SelectItem>
                <SelectItem value="investor">Investor</SelectItem>
                <SelectItem value="ai-agent">AI Agent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Messages Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-soft-lilac/30">
                  <th className="text-left p-3 font-medium text-midnight-navy">Sender</th>
                  <th className="text-left p-3 font-medium text-midnight-navy">Source</th>
                  <th className="text-left p-3 font-medium text-midnight-navy">Preview</th>
                  <th className="text-left p-3 font-medium text-midnight-navy">Date</th>
                  <th className="text-left p-3 font-medium text-midnight-navy">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((message) => (
                  <tr key={message.id} className="border-b border-soft-lilac/20 hover:bg-soft-lilac/10">
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-midnight-navy">{message.name}</div>
                        <div className="text-sm text-cool-gray">{message.email}</div>
                        {message.company && (
                          <div className="text-xs text-cool-gray">{message.company}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={getSourceColor(message.source)}>
                        {getSourceDisplayName(message.source)}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="max-w-xs">
                        <p className="text-sm text-cool-gray truncate">
                          {message.form_data?.message || 'No message content'}
                        </p>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-cool-gray">
                      {formatDate(message.created_at)}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedMessage(message)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Message from {message.name}</DialogTitle>
                              <DialogDescription>
                                {getSourceDisplayName(message.source)} • {formatDate(message.created_at)}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedMessage && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Name</label>
                                    <p className="text-sm text-cool-gray">{selectedMessage.name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <p className="text-sm text-cool-gray">{selectedMessage.email}</p>
                                  </div>
                                  {selectedMessage.company && (
                                    <div>
                                      <label className="text-sm font-medium">Company</label>
                                      <p className="text-sm text-cool-gray">{selectedMessage.company}</p>
                                    </div>
                                  )}
                                  {selectedMessage.phone && (
                                    <div>
                                      <label className="text-sm font-medium">Phone</label>
                                      <p className="text-sm text-cool-gray">{selectedMessage.phone}</p>
                                    </div>
                                  )}
                                  <div>
                                    <label className="text-sm font-medium">Source</label>
                                    <p className="text-sm text-cool-gray">{getSourceDisplayName(selectedMessage.source)}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Received</label>
                                    <p className="text-sm text-cool-gray">{formatDate(selectedMessage.created_at)}</p>
                                  </div>
                                </div>
                                
                                {selectedMessage.form_data?.message && (
                                  <div>
                                    <label className="text-sm font-medium">Message</label>
                                    <div className="text-sm text-cool-gray bg-soft-lilac/10 p-3 rounded-md mt-1">
                                      {selectedMessage.form_data.message}
                                    </div>
                                  </div>
                                )}

                                {selectedMessage.form_data && Object.keys(selectedMessage.form_data).length > 1 && (
                                  <div>
                                    <label className="text-sm font-medium">Additional Information</label>
                                    <div className="text-xs text-cool-gray bg-soft-lilac/10 p-3 rounded-md mt-1 max-h-32 overflow-auto">
                                      {Object.entries(selectedMessage.form_data)
                                        .filter(([key, value]) => key !== 'message' && value)
                                        .map(([key, value]) => (
                                          <div key={key} className="mb-1">
                                            <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                )}

                                <div className="flex gap-2 pt-4">
                                  <Button onClick={() => sendEmail(selectedMessage.email)} variant="outline">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Reply via Email
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => sendEmail(message.email)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMessages.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-cool-gray mx-auto mb-4" />
              <h3 className="text-lg font-medium text-midnight-navy mb-2">No messages found</h3>
              <p className="text-cool-gray">
                {searchTerm || sourceFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Contact form messages will appear here'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}