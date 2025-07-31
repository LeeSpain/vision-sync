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
      await this.sendEmailNotification(data as Lead);

      toast({
        title: "Success",
        description: "Your inquiry has been submitted successfully!",
      });

      return data as Lead;
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

  // Save project-specific lead (using leads table with project data in form_data)
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

      // Store project lead data in the regular leads table with special source
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          name: leadData.name,
          email: leadData.email,
          company: leadData.company,
          phone: leadData.phone,
          source: 'contact', // Use existing enum value
          status: 'new',
          priority,
          form_data: {
            type: 'project_inquiry',
            project_id: leadData.project_id,
            inquiry_type: leadData.inquiry_type,
            message: leadData.message,
            investment_amount: leadData.investment_amount,
            ...leadData.form_data
          }
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

      // Convert back to ProjectLead format
      const formData = data.form_data as any;
      const projectLead: ProjectLead = {
        id: data.id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        project_id: formData?.project_id || '',
        name: data.name,
        email: data.email,
        company: data.company,
        phone: data.phone,
        inquiry_type: formData?.inquiry_type || 'demo',
        message: formData?.message,
        status: data.status as ProjectLead['status'],
        priority: data.priority as ProjectLead['priority'],
        investment_amount: formData?.investment_amount,
        form_data: data.form_data
      };

      toast({
        title: "Success",
        description: "Your project inquiry has been submitted successfully!",
      });

      return projectLead;
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

      return (data || []) as Lead[];
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  },

  // Get all project leads (from leads table where form_data.type = 'project_inquiry')
  async getAllProjectLeads(): Promise<ProjectLead[]> {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('source', 'contact') // Filter for project inquiries stored as contact
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching project leads:', error);
        return [];
      }

      // Convert and filter for project inquiries
      const projectLeads = (data || [])
        .filter(lead => {
          const formData = lead.form_data as any;
          return formData?.type === 'project_inquiry';
        })
        .map(lead => {
          const formData = lead.form_data as any;
          return {
            id: lead.id,
            created_at: lead.created_at,
            updated_at: lead.updated_at,
            project_id: formData?.project_id || '',
            name: lead.name,
            email: lead.email,
            company: lead.company,
            phone: lead.phone,
            inquiry_type: formData?.inquiry_type || 'demo',
            message: formData?.message,
            status: lead.status as ProjectLead['status'],
            priority: lead.priority as ProjectLead['priority'],
            investment_amount: formData?.investment_amount,
            form_data: lead.form_data
          };
        }) as ProjectLead[];

      return projectLeads;
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

      return data as Lead;
    } catch (error) {
      console.error('Error updating lead:', error);
      return null;
    }
  },

  // Update project lead (updates the lead in leads table)
  async updateProjectLead(leadId: string, updates: Partial<ProjectLead>): Promise<ProjectLead | null> {
    try {
      // Convert ProjectLead updates to Lead format
      const leadUpdates: any = {};
      if (updates.status) leadUpdates.status = updates.status;
      if (updates.priority) leadUpdates.priority = updates.priority;
      if (updates.notes) leadUpdates.notes = updates.notes;
      if (updates.last_contact) leadUpdates.last_contact = updates.last_contact;
      if (updates.next_follow_up) leadUpdates.next_follow_up = updates.next_follow_up;

      const { data, error } = await supabase
        .from('leads')
        .update(leadUpdates)
        .eq('id', leadId)
        .select()
        .single();

      if (error) {
        console.error('Error updating project lead:', error);
        return null;
      }

      // Convert back to ProjectLead format
      const formData = data.form_data as any;
      return {
        id: data.id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        project_id: formData?.project_id || '',
        name: data.name,
        email: data.email,
        company: data.company,
        phone: data.phone,
        inquiry_type: formData?.inquiry_type || 'demo',
        message: formData?.message,
        status: data.status as ProjectLead['status'],
        priority: data.priority as ProjectLead['priority'],
        investment_amount: formData?.investment_amount,
        form_data: data.form_data
      } as ProjectLead;
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

  // Delete project lead (deletes from leads table)
  async deleteProjectLead(leadId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('leads')
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
      const { data: leadsData, error } = await supabase
        .from('leads')
        .select('status, created_at, form_data');

      if (error) {
        console.error('Error fetching lead stats:', error);
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

      const allLeads = leadsData || [];
      const total = allLeads.length;
      const newLeads = allLeads.filter(lead => lead.status === 'new').length;
      const qualified = allLeads.filter(lead => lead.status === 'qualified').length;
      const converted = allLeads.filter(lead => lead.status === 'converted').length;

      const today = new Date().toDateString();
      const todayLeads = allLeads.filter(lead => 
        lead.created_at && new Date(lead.created_at).toDateString() === today
      ).length;

      const thisWeek = new Date();
      thisWeek.setDate(thisWeek.getDate() - 7);
      const weekLeads = allLeads.filter(lead => 
        lead.created_at && new Date(lead.created_at) > thisWeek
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
      const { data, error } = await supabase.functions.invoke('send-lead-notification', {
        body: {
          type: 'general_lead',
          lead
        }
      });

      if (error) {
        console.error('Failed to send email notification:', error);
      } else {
        console.log('Email notification sent successfully:', data);
      }
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  },

  // Send project email notification
  async sendProjectEmailNotification(lead: ProjectLead) {
    try {
      const { data, error } = await supabase.functions.invoke('send-lead-notification', {
        body: {
          type: 'project_lead',
          lead
        }
      });

      if (error) {
        console.error('Failed to send project email notification:', error);
      } else {
        console.log('Project email notification sent successfully:', data);
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