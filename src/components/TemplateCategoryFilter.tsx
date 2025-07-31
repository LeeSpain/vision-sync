import { Button } from '@/components/ui/button';
import { TemplateCategory, templateCategories } from '@/utils/appTemplates';
import { LucideIcon } from 'lucide-react';

interface TemplateCategoryFilterProps {
  selectedCategory: TemplateCategory | 'all';
  onCategoryChange: (category: TemplateCategory | 'all') => void;
  templateCounts?: Partial<Record<TemplateCategory | 'all', number>>;
}

const TemplateCategoryFilter = ({ 
  selectedCategory, 
  onCategoryChange,
  templateCounts = {}
}: TemplateCategoryFilterProps) => {
  const categories: Array<{ key: TemplateCategory | 'all'; label: string; description: string; icon?: LucideIcon }> = [
    { key: 'all', label: 'All Templates', description: 'View all available app templates' },
    ...Object.entries(templateCategories).map(([key, config]) => ({
      key: key as TemplateCategory,
      label: config.label,
      description: config.description,
      icon: config.icon
    }))
  ];

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map(({ key, label, description, icon: IconComponent }) => {
          const isSelected = selectedCategory === key;
          const count = templateCounts[key] || 0;
          
          return (
            <Button
              key={key}
              variant={isSelected ? "premium" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(key)}
              className={`
                transition-all duration-300 hover:scale-105
                ${isSelected 
                  ? 'bg-gradient-hero text-white border-royal-purple shadow-glow' 
                  : 'bg-white/50 text-midnight-navy border-soft-lilac/50 hover:bg-royal-purple/10 hover:text-royal-purple hover:border-royal-purple/30'
                }
              `}
            >
              {IconComponent && (
                <IconComponent className="h-4 w-4 mr-2" />
              )}
              <span className="font-medium">{label}</span>
              {count > 0 && (
                <span className={`
                  ml-2 px-2 py-0.5 rounded-full text-xs font-semibold
                  ${isSelected 
                    ? 'bg-white/20 text-white' 
                    : 'bg-royal-purple/10 text-royal-purple'
                  }
                `}>
                  {count}
                </span>
              )}
            </Button>
          );
        })}
      </div>
      
      {/* Description for selected category */}
      <div className="text-center mt-4">
        <p className="text-sm text-cool-gray max-w-2xl mx-auto">
          {selectedCategory === 'all' 
            ? 'Browse our complete collection of ready-to-deploy app templates for various industries'
            : templateCategories[selectedCategory as TemplateCategory]?.description
          }
        </p>
      </div>
    </div>
  );
};

export default TemplateCategoryFilter;