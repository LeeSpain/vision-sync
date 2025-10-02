import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  industry: string;
  image_url: string;
  demo_url: string;
  pricing: {
    base: number;
    customization: number;
    subscription: {
      monthly: number;
      benefits: string[];
    };
    deposit: {
      amount: number;
      serviceMonthly: number;
      description: string;
    };
    currency?: string;
  };
  features: string[];
  complexity_level: string;
  estimated_hours: number;
  is_active: boolean;
  is_popular: boolean;
  created_at: string;
  updated_at: string;
}

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('app_templates')
        .select('*')
        .eq('is_active', true)
        .order('is_popular', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

        // Transform the data to match our interface
        const transformedTemplates: Template[] = (data || []).map(template => ({
          id: template.id,
          title: template.title,
          description: template.description || '',
          category: template.category || 'Other',
          industry: template.industry || 'General',
          image_url: template.image_url || '/placeholder.svg',
          demo_url: template.demo_url || '',
          pricing: {
            base: (template.pricing as any)?.base || 2999,
            customization: (template.pricing as any)?.customization || 750,
            subscription: {
              monthly: (template.pricing as any)?.subscription?.monthly || 199,
              benefits: (template.pricing as any)?.subscription?.benefits || []
            },
            deposit: {
              amount: (template.pricing as any)?.deposit?.amount || 720,
              serviceMonthly: (template.pricing as any)?.deposit?.serviceMonthly || 149,
              description: (template.pricing as any)?.deposit?.description || ''
            },
            currency: (template.pricing as any)?.currency || 'USD'
          },
          features: Array.isArray(template.features) ? template.features.filter(f => typeof f === 'string') : [],
          complexity_level: template.complexity_level || 'medium',
          estimated_hours: template.estimated_hours || 40,
          is_active: template.is_active ?? true,
          is_popular: template.is_popular ?? false,
          created_at: template.created_at,
          updated_at: template.updated_at
        }));

      setTemplates(transformedTemplates);
      setError(null);
    } catch (err) {
      console.error('Error loading templates:', err);
      setError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const getTemplatesByCategory = (category: string) => {
    return templates.filter(template => 
      template.category.toLowerCase() === category.toLowerCase()
    );
  };

  const getPopularTemplates = () => {
    return templates.filter(template => template.is_popular);
  };

  const getAllCategories = () => {
    const categories = [...new Set(templates.map(template => template.category))];
    return categories;
  };

  const getTemplateCounts = () => {
    const counts: Record<string, number> = {
      all: templates.length
    };
    
    getAllCategories().forEach(category => {
      counts[category] = getTemplatesByCategory(category).length;
    });
    
    return counts;
  };

  return {
    templates,
    loading,
    error,
    getTemplatesByCategory,
    getPopularTemplates,
    getAllCategories,
    getTemplateCounts,
    refetch: loadTemplates
  };
};