import { supabase } from '@/integrations/supabase/client';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  category: string;
  visibility: string;
  route: string | null;
  image_url: string | null;
  leads_count: number;
  investment_amount: number | null;
  price: number | null;
  features: any;
  created_at: string;
  updated_at: string;
  // New rich content fields
  content: any;
  hero_image_url: string | null;
  gallery_images: string[] | null;
  key_features: any;
  stats: any;
  use_cases: any;
  purchase_info: any;
  // Subscription fields
  subscription_price: number | null;
  subscription_period: string | null;
  billing_type: string;
  featured: boolean;
  domain_url: string | null;
  // Investment tracking fields
  funding_progress: number | null;
  expected_roi: number | null;
  investment_deadline: string | null;
  investor_count: number;
  social_proof: string | null;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  status: string;
  category: string;
  visibility: string;
  route?: string;
  image_url?: string;
  hero_image_url?: string;
  gallery_images?: string[];
  investment_amount?: number;
  price?: number;
  features?: any;
  key_features?: any;
  stats?: any;
  use_cases?: any;
  purchase_info?: any;
  content?: any;
  subscription_price?: number;
  subscription_period?: string;
  billing_type?: string;
  featured?: boolean;
  domain_url?: string;
  funding_progress?: number;
  expected_roi?: number;
  investment_deadline?: string;
  investor_count?: number;
  social_proof?: string;
}

export const projectManager = {
  // Get all projects (respects visibility)
  async getAllProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }

    return data || [];
  },

  // Get public projects only
  async getPublicProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('visibility', 'Public')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching public projects:', error);
      throw error;
    }

    return data || [];
  },

  // Get projects by category
  async getProjectsByCategory(category: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('category', category)
      .eq('visibility', 'Public')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects by category:', error);
      throw error;
    }

    return data || [];
  },

  // Get featured projects (you can define criteria for featured)
  async getFeaturedProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('visibility', 'Public')
      .eq('featured', true)
      .order('leads_count', { ascending: false })
      .limit(6);

    if (error) {
      console.error('Error fetching featured projects:', error);
      throw error;
    }

    return data || [];
  },

  // Create new project
  async createProject(projectData: CreateProjectData): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      throw error;
    }

    return data;
  },

  // Update project
  async updateProject(id: string, projectData: Partial<CreateProjectData>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      throw error;
    }

    return data;
  },

  // Delete project
  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  // Increment lead count for a project
  async incrementLeadCount(projectName: string): Promise<void> {
    // Find project by name and increment leads_count
    const { data: project } = await supabase
      .from('projects')
      .select('id, leads_count')
      .eq('name', projectName)
      .single();

    if (project) {
      await supabase
        .from('projects')
        .update({ leads_count: project.leads_count + 1 })
        .eq('id', project.id);
    }
  },

  // Get project statistics
  async getProjectStats() {
    const { data, error } = await supabase
      .from('projects')
      .select('status, category, leads_count, investment_amount, price, subscription_price, billing_type');

    if (error) {
      console.error('Error fetching project stats:', error);
      throw error;
    }

    const stats = {
      totalProjects: data?.length || 0,
      totalLeads: data?.reduce((sum, p) => sum + p.leads_count, 0) || 0,
      totalRevenuePipeline: data?.reduce((sum, p) => {
        return sum + (p.investment_amount || 0) + (p.price || 0) + (p.subscription_price || 0);
      }, 0) || 0,
      byStatus: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      revenueByCategory: {} as Record<string, number>,
      revenueByBilling: {} as Record<string, number>,
      subscriptionRevenue: data?.reduce((sum, p) => sum + (p.subscription_price || 0), 0) || 0,
    };

    // Count by status and category, calculate revenue by category and billing type
    data?.forEach(project => {
      stats.byStatus[project.status] = (stats.byStatus[project.status] || 0) + 1;
      stats.byCategory[project.category] = (stats.byCategory[project.category] || 0) + 1;
      
      // Calculate revenue by category
      const projectRevenue = (project.investment_amount || 0) + (project.price || 0) + (project.subscription_price || 0);
      stats.revenueByCategory[project.category] = (stats.revenueByCategory[project.category] || 0) + projectRevenue;
      
      // Calculate revenue by billing type
      const billingType = project.billing_type || 'investment';
      if (billingType === 'investment' && project.investment_amount) {
        stats.revenueByBilling[billingType] = (stats.revenueByBilling[billingType] || 0) + project.investment_amount;
      } else if (billingType === 'one-time' && project.price) {
        stats.revenueByBilling[billingType] = (stats.revenueByBilling[billingType] || 0) + project.price;
      } else if (billingType === 'subscription' && project.subscription_price) {
        stats.revenueByBilling[billingType] = (stats.revenueByBilling[billingType] || 0) + project.subscription_price;
      }
    });

    return stats;
  }
};