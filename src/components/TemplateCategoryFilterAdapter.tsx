import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Users, Brain, LucideIcon, Sparkles, UtensilsCrossed, Dumbbell, Home, ShoppingCart, Heart, MapPin } from 'lucide-react';

interface TemplateCategoryFilterAdapterProps {
  selectedCategory: string | 'all';
  onCategoryChange: (category: string | 'all') => void;
  templateCounts?: Record<string, number>;
  availableCategories: string[];
}

const TemplateCategoryFilterAdapter = ({ 
  selectedCategory, 
  onCategoryChange,
  templateCounts = {},
  availableCategories
}: TemplateCategoryFilterAdapterProps) => {
  const getCategoryIcon = (category: string): LucideIcon => {
    switch (category) {
      case 'Hairdressing & Beauty':
        return Sparkles;
      case 'Restaurant & Food Service':
        return UtensilsCrossed;
      case 'Fitness & Wellness':
        return Dumbbell;
      case 'Home Services':
        return Home;
      case 'Retail & E-commerce':
        return ShoppingCart;
      case 'Healthcare':
        return Heart;
      case 'Real Estate':
        return MapPin;
      default:
        return Package;
    }
  };

  const categories = [
    { key: 'all' as const, label: 'All Templates', description: 'View all available app templates' },
    ...availableCategories.map(category => ({
      key: category,
      label: category,
      description: `Professional ${category.toLowerCase()} solutions`,
      icon: getCategoryIcon(category)
    }))
  ];

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => {
          const { key, label, description } = category;
          const IconComponent = 'icon' in category ? category.icon : Package;
          const isSelected = selectedCategory === key;
          const count = templateCounts[key] || 0;

          return (
            <Button
              key={key}
              variant={isSelected ? "default" : "outline"}
              size="lg"
              onClick={() => onCategoryChange(key)}
              className={`
                relative transition-all duration-300 group min-w-[140px] h-auto py-4 px-6
                ${isSelected 
                  ? 'bg-gradient-primary text-white shadow-glow border-0' 
                  : 'bg-white/70 backdrop-blur-sm hover:bg-white hover:shadow-card border-soft-lilac/30'
                }
              `}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex items-center gap-2">
                  {IconComponent && (
                    <IconComponent className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-royal-purple'}`} />
                  )}
                  <span className="font-medium text-sm">{label}</span>
                </div>
                
                {count > 0 && (
                  <Badge 
                    variant="secondary" 
                    className={`text-xs px-2 py-0.5 ${
                      isSelected 
                        ? 'bg-white/20 text-white border-white/30' 
                        : 'bg-royal-purple/10 text-royal-purple border-royal-purple/30'
                    }`}
                  >
                    {count} template{count !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateCategoryFilterAdapter;