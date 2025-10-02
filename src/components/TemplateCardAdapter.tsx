import React from 'react';
import { Template } from '@/hooks/useTemplates';
import { AppTemplate, templateCategories } from '@/utils/appTemplates';
import TemplateCard from '@/components/TemplateCard';
import { Package, Sparkles, UtensilsCrossed, Dumbbell, Home, ShoppingCart, Heart, MapPin } from 'lucide-react';

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
  // Get category-specific icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Hairdressing & Beauty': return Sparkles;
      case 'Restaurant & Food Service': return UtensilsCrossed;
      case 'Fitness & Wellness': return Dumbbell;
      case 'Home Services': return Home;
      case 'Retail & E-commerce': return ShoppingCart;
      case 'Healthcare': return Heart;
      case 'Real Estate': return MapPin;
      default: return Package;
    }
  };

  // Use features from database
  const allFeatures = template.features || [];

  // Convert Template to AppTemplate format
  const adaptedTemplate: AppTemplate = {
    id: template.id,
    title: template.title,
    overview: template.description,
    category: template.category as any,
    image_url: template.image_url,
    pricing: {
      base: template.pricing.base_price,
      customization: 999,
      subscription: {
        monthly: 299,
        benefits: ['Regular updates', 'Premium support', 'Monthly consultations']
      },
      deposit: {
        amount: template.pricing.base_price * 0.3,
        serviceMonthly: 199,
        description: 'Initial payment with monthly service'
      },
      installments: {
        available: true,
        plans: [
          { months: 6, monthlyAmount: template.pricing.base_price / 6, totalAmount: template.pricing.base_price },
          { months: 12, monthlyAmount: template.pricing.base_price / 12, totalAmount: template.pricing.base_price }
        ]
      },
      ownership: {
        buyOutright: template.pricing.base_price,
        serviceContract: {
          deposit: template.pricing.base_price * 0.3,
          monthly: 199,
          benefits: ['Ongoing support', 'Updates included']
        }
      }
    },
    keyFeatures: allFeatures,
    idealFor: [template.industry || template.category],
    personalizationOptions: [],
    icon: getCategoryIcon(template.category),
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