import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Lead {
  id?: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  source: 'contact' | 'custom-build' | 'investor' | 'ai-agent';
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  form_data?: any;
  notes?: string | null;
  last_contact?: string | null;
  next_follow_up?: string | null;
}

export interface ProjectLead {
  id?: string;
  created_at?: string;
  updated_at?: string;
  project_id: string;
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  inquiry_type: 'investment' | 'purchase' | 'demo' | 'partnership';
  message?: string | null;
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  investment_amount?: number | null;
  form_data?: any;
  notes?: string | null;
  last_contact?: string | null;
  next_follow_up?: string | null;
}

export const supabaseLeadManager = {
  // Save general lead
  async saveLead(leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead | null> {
    try {
      // Determine priority based on form data
      let priority: Lead['priority'] = 'medium';
      if (leadData.form_data?.urgency === 'critical' || leadData.form_data?.urgency === 'high') {
        priority = 'urgent';
      } else if (leadData.form_data?.budget === 'over-250k' || leadData.form_data?.investmentRange === 'over-5m') {
        priority = 'high';
      } else if (leadData.form_data?.budget === '100k-250k' || leadData.form_data?.investmentRange === '1m-5m') {
        priority = 'medium';
      } else {
        priority = 'low';
      }

      const { data, error } = await supabase
        .from('leads')
        .insert([{
          ...leadData,
          status: 'new',
          priority
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving lead:', error);
        toast({
          title: "Error",
          description: "Failed to save lead. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      // Send email notification
      await this.sendEmailNotification(data);

      toast({
        title: "Success",
        description: "Your inquiry has been submitted successfully!",
      });

      return data;
    } catch (error) {
      console.error('Error saving lead:', error);
      toast({
        title: "Error",
        description: "Failed to save lead. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  },

  // Save project-specific lead
  async saveProjectLead(leadData: Omit<ProjectLead, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectLead | null> {
    try {
      // Determine priority based on inquiry type and investment amount
      let priority: ProjectLead['priority'] = 'medium';
      if (leadData.inquiry_type === 'investment' && leadData.investment_amount && leadData.investment_amount > 1000000) {
        priority = 'urgent';
      } else if (leadData.inquiry_type === 'investment') {
        priority = 'high';
      } else if (leadData.inquiry_type === 'purchase') {
        priority = 'medium';
      } else {
        priority = 'low';
      }

      const { data, error } = await supabase
        .from('project_leads' as any)
        .insert([{
          ...leadData,
          status: 'new',
          priority
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving project lead:', error);
        toast({
          title: "Error",
          description: "Failed to save project inquiry. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      // Send email notification
      await this.sendProjectEmailNotification(data);

      toast({
        title: "Success",
        description: "Your project inquiry has been submitted successfully!",
      });

      return data;
    } catch (error) {
      console.error('Error saving project lead:', error);
      toast({
        title: "Error",
        description: "Failed to save project inquiry. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  },

  // Get all leads
  async getAllLeads(): Promise<Lead[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  },

  // Get all project leads
  async getAllProjectLeads(): Promise<ProjectLead[]> {
    try {
      const { data, error } = await supabase
        .from('project_leads' as any)
        .select(`
          *,
          projects (
            name,
            slug
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching project leads:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching project leads:', error);
      return [];
    }
  },

  // Update lead
  async updateLead(leadId: string, updates: Partial<Lead>): Promise<Lead | null> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', leadId)
        .select()
        .single();

      if (error) {
        console.error('Error updating lead:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error updating lead:', error);
      return null;
    }
  },

  // Update project lead
  async updateProjectLead(leadId: string, updates: Partial<ProjectLead>): Promise<ProjectLead | null> {
    try {
      const { data, error } = await supabase
        .from('project_leads' as any)
        .update(updates)
        .eq('id', leadId)
        .select()
        .single();

      if (error) {
        console.error('Error updating project lead:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error updating project lead:', error);
      return null;
    }
  },

  // Delete lead
  async deleteLead(leadId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (error) {
        console.error('Error deleting lead:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting lead:', error);
      return false;
    }
  },

  // Delete project lead
  async deleteProjectLead(leadId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('project_leads' as any)
        .delete()
        .eq('id', leadId);

      if (error) {
        console.error('Error deleting project lead:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting project lead:', error);
      return false;
    }
  },

  // Get lead statistics
  async getLeadStats() {
    try {
      const [leadsResponse, projectLeadsResponse] = await Promise.all([
        supabase.from('leads').select('status, created_at'),
        supabase.from('project_leads' as any).select('status, created_at')
      ]);

      const allLeads = [
        ...(leadsResponse.data || []),
        ...(projectLeadsResponse.data || [])
      ];

      const total = allLeads.length;
      const newLeads = allLeads.filter(lead => lead.status === 'new').length;
      const qualified = allLeads.filter(lead => lead.status === 'qualified').length;
      const converted = allLeads.filter(lead => lead.status === 'converted').length;

      const today = new Date().toDateString();
      const todayLeads = allLeads.filter(lead => 
        new Date(lead.created_at).toDateString() === today
      ).length;

      const thisWeek = new Date();
      thisWeek.setDate(thisWeek.getDate() - 7);
      const weekLeads = allLeads.filter(lead => 
        new Date(lead.created_at) > thisWeek
      ).length;

      return {
        total,
        newLeads,
        qualified,
        converted,
        todayLeads,
        weekLeads,
        conversionRate: total > 0 ? Math.round((converted / total) * 100) : 0
      };
    } catch (error) {
      console.error('Error getting lead stats:', error);
      return {
        total: 0,
        newLeads: 0,
        qualified: 0,
        converted: 0,
        todayLeads: 0,
        weekLeads: 0,
        conversionRate: 0
      };
    }
  },

  // Send email notification
  async sendEmailNotification(lead: Lead) {
    try {
      const response = await fetch('https://bqcmhkajtuzovmvwblbe.supabase.co/functions/v1/send-lead-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxY21oa2FqdHV6b3ZtdndibGJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5Nzc1MzYsImV4cCI6MjA2OTU1MzUzNn0.30fGqpWjKYteiMhQWts28ShnVmdP3TZg8B49OLLMdt8`
        },
        body: JSON.stringify({
          type: 'general_lead',
          lead
        })
      });

      if (!response.ok) {
        console.error('Failed to send email notification');
      }
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  },

  // Send project email notification
  async sendProjectEmailNotification(lead: ProjectLead) {
    try {
      const response = await fetch('https://bqcmhkajtuzovmvwblbe.supabase.co/functions/v1/send-lead-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxY21oa2FqdHV6b3ZtdndibGJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5Nzc1MzYsImV4cCI6MjA2OTU1MzUzNn0.30fGqpWjKYteiMhQWts28ShnVmdP3TZg8B49OLLMdt8`
        },
        body: JSON.stringify({
          type: 'project_lead',
          lead
        })
      });

      if (!response.ok) {
        console.error('Failed to send project email notification');
      }
    } catch (error) {
      console.error('Error sending project email notification:', error);
    }
  },

  // Export leads to CSV
  async exportLeads(): Promise<string> {
    const [leads, projectLeads] = await Promise.all([
      this.getAllLeads(),
      this.getAllProjectLeads()
    ]);

    const headers = [
      'ID', 'Type', 'Date', 'Source', 'Status', 'Priority', 'Name', 'Email', 'Company', 
      'Phone', 'Inquiry Type', 'Project', 'Message', 'Form Data'
    ];

    const allLeadsForExport = [
      ...leads.map(lead => ({
        ...lead,
        type: 'General Lead',
        inquiry_type: lead.source,
        project: '',
        message: lead.form_data?.message || '',
        form_data_string: JSON.stringify(lead.form_data || {})
      })),
      ...projectLeads.map(lead => ({
        ...lead,
        type: 'Project Lead',
        source: 'project-inquiry',
        form_data_string: JSON.stringify(lead.form_data || {})
      }))
    ];

    const csvContent = [
      headers.join(','),
      ...allLeadsForExport.map(lead => [
        lead.id,
        lead.type,
        lead.created_at,
        lead.source || lead.inquiry_type,
        lead.status,
        lead.priority,
        `"${lead.name}"`,
        lead.email,
        `"${lead.company || ''}"`,
        lead.phone || '',
        lead.inquiry_type || '',
        lead.project || '',
        `"${lead.message || ''}"`,
        `"${lead.form_data_string}"`
      ].join(','))
    ].join('\n');

    return csvContent;
  }
};