export interface Lead {
  id: string;
  timestamp: string;
  source: 'contact' | 'custom-build' | 'investor' | 'project-inquiry';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Contact Information
  name: string;
  email: string;
  company?: string;
  phone?: string;
  
  // Lead Details
  message?: string;
  interests?: string;
  
  // Custom Build Specific
  projectType?: string;
  budget?: string;
  timeline?: string;
  features?: string[];
  urgency?: string;
  description?: string;
  
  // Investor Specific
  investmentRange?: string;
  
  // Project Inquiry Specific
  projectName?: string;
  inquiryType?: 'investment' | 'purchase' | 'demo' | 'partnership';
  
  // Admin Notes
  notes?: string;
  lastContact?: string;
  nextFollowUp?: string;
}

export const leadManager = {
  // Save lead to localStorage
  saveLead: (leadData: Omit<Lead, 'id' | 'timestamp' | 'status' | 'priority'>): Lead => {
    const lead: Lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      status: 'new',
      priority: leadData.urgency === 'critical' || leadData.urgency === 'high' ? 'urgent' : 
                leadData.budget === 'over-250k' || leadData.investmentRange === 'over-5m' ? 'high' :
                leadData.budget === '100k-250k' || leadData.investmentRange === '1m-5m' ? 'medium' : 'low',
      ...leadData
    };

    const existingLeads = leadManager.getAllLeads();
    const updatedLeads = [lead, ...existingLeads];
    localStorage.setItem('vision_sync_leads', JSON.stringify(updatedLeads));
    
    // Send email notification
    leadManager.sendEmailNotification(lead);
    
    return lead;
  },

  // Get all leads
  getAllLeads: (): Lead[] => {
    const leads = localStorage.getItem('vision_sync_leads');
    return leads ? JSON.parse(leads) : [];
  },

  // Update lead
  updateLead: (leadId: string, updates: Partial<Lead>): Lead | null => {
    const leads = leadManager.getAllLeads();
    const leadIndex = leads.findIndex(lead => lead.id === leadId);
    
    if (leadIndex === -1) return null;
    
    const updatedLead = { ...leads[leadIndex], ...updates };
    leads[leadIndex] = updatedLead;
    
    localStorage.setItem('vision_sync_leads', JSON.stringify(leads));
    return updatedLead;
  },

  // Delete lead
  deleteLead: (leadId: string): boolean => {
    const leads = leadManager.getAllLeads();
    const filteredLeads = leads.filter(lead => lead.id !== leadId);
    
    if (filteredLeads.length === leads.length) return false;
    
    localStorage.setItem('vision_sync_leads', JSON.stringify(filteredLeads));
    return true;
  },

  // Get lead statistics
  getLeadStats: () => {
    const leads = leadManager.getAllLeads();
    const total = leads.length;
    const newLeads = leads.filter(lead => lead.status === 'new').length;
    const qualified = leads.filter(lead => lead.status === 'qualified').length;
    const converted = leads.filter(lead => lead.status === 'converted').length;
    
    const today = new Date().toDateString();
    const todayLeads = leads.filter(lead => new Date(lead.timestamp).toDateString() === today).length;
    
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const weekLeads = leads.filter(lead => new Date(lead.timestamp) > thisWeek).length;
    
    return {
      total,
      newLeads,
      qualified,
      converted,
      todayLeads,
      weekLeads,
      conversionRate: total > 0 ? Math.round((converted / total) * 100) : 0
    };
  },

  // Send email notification (simulated for now)
  sendEmailNotification: (lead: Lead) => {
    // For now, we'll simulate email sending
    // In a real implementation, this would call an API
    console.log('Email notification sent for new lead:', {
      to: 'lee@vision-sync.com', // Gmail address for now
      subject: `New ${lead.source} Lead: ${lead.name}`,
      lead: lead
    });
    
    // Store notification in localStorage for admin to see
    const notifications = JSON.parse(localStorage.getItem('vision_sync_notifications') || '[]');
    notifications.unshift({
      id: `notif_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'new_lead',
      title: `New ${lead.source} lead`,
      message: `${lead.name} (${lead.email}) submitted a ${lead.source} inquiry`,
      leadId: lead.id,
      read: false
    });
    localStorage.setItem('vision_sync_notifications', JSON.stringify(notifications.slice(0, 50))); // Keep last 50
  },

  // Export leads to CSV
  exportLeads: (): string => {
    const leads = leadManager.getAllLeads();
    const headers = [
      'ID', 'Timestamp', 'Source', 'Status', 'Priority', 'Name', 'Email', 'Company', 
      'Message', 'Project Type', 'Budget', 'Timeline', 'Investment Range', 'Urgency'
    ];
    
    const csvContent = [
      headers.join(','),
      ...leads.map(lead => [
        lead.id,
        lead.timestamp,
        lead.source,
        lead.status,
        lead.priority,
        `"${lead.name}"`,
        lead.email,
        `"${lead.company || ''}"`,
        `"${lead.message || ''}"`,
        lead.projectType || '',
        lead.budget || '',
        lead.timeline || '',
        lead.investmentRange || '',
        lead.urgency || ''
      ].join(','))
    ].join('\n');
    
    return csvContent;
  }
};