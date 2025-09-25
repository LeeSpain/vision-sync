import { supabase } from '@/integrations/supabase/client';

// Enhanced interface to match updated database schema
export interface Project {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  demo_url: string | null;
  github_url: string | null;
  technologies: string[] | null;
  is_public: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  content_section: string | null;
  pricing: any | null;
  billing_type: string | null;
  investment_amount: number | null;
  funding_progress: number | null;
  subscription_price: number | null;
  subscription_period: string | null;
  price: number | null;
  deposit_amount: number | null;
  priority_order: number | null;
  status: string | null;
  route: string | null;
  expected_roi: number | null;
  investment_deadline: string | null;
  investor_count: number | null;
  social_proof: any | null;
}

export interface CreateProjectData {
  title: string;
  description?: string;
  category?: string;
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  technologies?: string[];
  is_public?: boolean;
  is_featured?: boolean;
  content_section?: string;
  pricing?: any;
  billing_type?: string;
  investment_amount?: number;
  funding_progress?: number;
  subscription_price?: number;
  subscription_period?: string;
  price?: number;
  deposit_amount?: number;
  priority_order?: number;
  status?: string;
  route?: string;
  expected_roi?: number;
  investment_deadline?: string;
  investor_count?: number;
  social_proof?: any;
}

export const projectManager = {
  // Get all projects
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
      .eq('is_public', true)
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
      .eq('is_public', true)
      .order('priority_order', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects by category:', error);
      throw error;
    }

    return data || [];
  },

  // Get projects by content section
  async getProjectsByContentSection(section: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('content_section', section)
      .eq('is_public', true)
      .eq('status', 'active')
      .order('priority_order', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects by content section:', error);
      throw error;
    }

    return data || [];
  },

  // Get featured projects
  async getFeaturedProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_public', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
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

  // Get project by ID
  async getProjectById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching project by ID:', error);
      return null;
    }

    return data;
  },

  // Get project statistics
  async getProjectStats() {
    const { data, error } = await supabase
      .from('projects')
      .select('category, is_public, is_featured, created_at');

    if (error) {
      console.error('Error fetching project stats:', error);
      throw error;
    }

    const stats = {
      totalProjects: data?.length || 0,
      publicProjects: data?.filter(p => p.is_public).length || 0,
      featuredProjects: data?.filter(p => p.is_featured).length || 0,
      privateProjects: data?.filter(p => !p.is_public).length || 0,
      byCategory: {} as Record<string, number>,
      recentProjects: data?.filter(p => {
        const createdAt = new Date(p.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdAt >= weekAgo;
      }).length || 0,
    };

    // Count by category
    data?.forEach(project => {
      if (project.category) {
        stats.byCategory[project.category] = (stats.byCategory[project.category] || 0) + 1;
      }
    });

    return stats;
  },

  // Search projects by title or description
  async searchProjects(query: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_public', true)
      .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching projects:', error);
      throw error;
    }

    return data || [];
  },

  // Get projects by technology
  async getProjectsByTechnology(tech: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_public', true)
      .contains('technologies', [tech])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects by technology:', error);
      throw error;
    }

    return data || [];
  }
};