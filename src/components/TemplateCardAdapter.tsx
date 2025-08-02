import React from 'react';
import { Template } from '@/hooks/useTemplates';
import { AppTemplate, templateCategories } from '@/utils/appTemplates';
import TemplateCard from '@/components/TemplateCard';
import { Package } from 'lucide-react';

interface TemplateCardAdapterProps {
  template: Template;
  onLearnMore: (template: AppTemplate) => void;
  onRequestTemplate: (template: AppTemplate) => void;
}

export const TemplateCardAdapter: React.FC<TemplateCardAdapterProps> = ({
  template,
  onLearnMore,
  onRequestTemplate
}) => {
  // Convert Template to AppTemplate format
  const adaptedTemplate: AppTemplate = {
    id: template.id,
    title: template.title,
    overview: template.detailed_description || template.description,
    category: template.category as any,
    pricing: {
      base: template.pricing.base,
      customization: template.pricing.customization,
      subscription: {
        monthly: 299,
        benefits: ['Regular updates', 'Support']
      },
      deposit: {
        amount: template.pricing.base * 0.3,
        serviceMonthly: 199,
        description: 'Initial payment with monthly service'
      },
      installments: {
        available: true,
        plans: [
          { months: 6, monthlyAmount: template.pricing.base / 6, totalAmount: template.pricing.base },
          { months: 12, monthlyAmount: template.pricing.base / 12, totalAmount: template.pricing.base }
        ]
      },
      ownership: {
        buyOutright: template.pricing.base,
        serviceContract: {
          deposit: template.pricing.base * 0.3,
          monthly: 199,
          benefits: ['Ongoing support', 'Updates included']
        }
      }
    },
    keyFeatures: template.key_features || [],
    idealFor: [template.industry || template.category],
    personalizationOptions: [],
    icon: Package, // Default icon
    popular: template.is_popular
  };

  return (
    <TemplateCard
      template={adaptedTemplate}
      onLearnMore={onLearnMore}
      onRequestTemplate={onRequestTemplate}
    />
  );
};