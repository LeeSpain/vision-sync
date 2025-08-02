import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Template {
  id: string;
  title: string;
  description: string;
  detailed_description?: string;
  category: string;
  industry?: string;
  pricing: {
    base: number;
    customization: number;
    premium?: number;
    subscription?: {
      monthly: number;
      benefits: string[];
    };
  };
  key_features: string[];
  foundation_features?: string[];
  core_industry_features?: string[];
  premium_features?: string[];
  is_popular: boolean;
  is_active: boolean;
  image_url?: string;
  gallery_images?: string[];
  ai_generated_content?: any;
  template_config?: any;
  questionnaire_weight?: any;
  sale_price?: number;
  customization_price?: number;
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
      const transformedTemplates: Template[] = (data || []).map(template => {
        // Use the standardized pricing structure from the database
        let pricing = { base: 2999, customization: 999 };
        
        if (template.pricing && typeof template.pricing === 'object' && !Array.isArray(template.pricing)) {
          const pricingData = template.pricing as any;
          pricing = {
            base: pricingData.base || template.sale_price || 2999,
            customization: pricingData.customization || template.customization_price || 999
          };
          
          // Add premium pricing if available
          if (pricingData.subscription?.monthly) {
            (pricing as any).premium = pricingData.subscription.monthly;
            (pricing as any).subscription = {
              monthly: pricingData.subscription.monthly,
              benefits: pricingData.subscription.benefits || ['Regular updates', 'Premium support']
            };
          }
        }

        return {
          id: template.id,
          title: template.title,
          description: template.description || '',
          detailed_description: template.detailed_description,
          category: template.category,
          industry: template.industry,
          pricing,
          key_features: Array.isArray(template.key_features) ? template.key_features.filter(f => typeof f === 'string') : [],
          foundation_features: Array.isArray(template.foundation_features) ? template.foundation_features.filter(f => typeof f === 'string') : [],
          core_industry_features: Array.isArray(template.core_industry_features) ? template.core_industry_features.filter(f => typeof f === 'string') : [],
          premium_features: Array.isArray(template.premium_features) ? template.premium_features.filter(f => typeof f === 'string') : [],
          is_popular: template.is_popular,
          is_active: template.is_active,
          image_url: template.image_url,
          gallery_images: Array.isArray(template.gallery_images) ? template.gallery_images : [],
          ai_generated_content: template.ai_generated_content,
          template_config: template.template_config,
          questionnaire_weight: template.questionnaire_weight,
          sale_price: template.sale_price,
          customization_price: template.customization_price,
          created_at: template.created_at,
          updated_at: template.updated_at
        };
      });

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