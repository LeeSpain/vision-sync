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
    sale_price: template.pricing.base,
    customization_price: template.pricing.customization,
    pricing: {
      base: template.pricing.base,
      customization: template.pricing.customization,
      subscription: {
        monthly: template.pricing.monthly,
        benefits: ['Regular updates', 'Premium support', 'Monthly consultations', 'Priority bug fixes']
      },
      deposit: {
        amount: template.pricing.deposit,
        serviceMonthly: template.pricing.monthly,
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
          deposit: template.pricing.deposit,
          monthly: template.pricing.monthly,
          benefits: ['Ongoing support', 'Updates included', 'Feature enhancements']
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