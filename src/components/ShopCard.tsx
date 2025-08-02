import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Package, Zap, TrendingUp, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShopCardProps {
  title: string;
  description: string;
  status: 'Live' | 'Beta' | 'Development' | 'Planning';
  category: 'For Sale' | 'Internal' | 'Investment';
  image?: string;
  route?: string;
  onViewClick?: () => void;
}

const ShopCard: React.FC<ShopCardProps> = ({
  title,
  description,
  status,
  category,
  image,
  route,
  onViewClick
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live':
        return 'bg-emerald-green text-white';
      case 'Beta':
        return 'bg-royal-purple text-white';
      case 'Development':
        return 'bg-coral-orange text-white';
      default:
        return 'bg-cool-gray text-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'For Sale':
        return <Package className="h-4 w-4" />;
      case 'Internal':
        return <Building2 className="h-4 w-4" />;
      case 'Investment':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const handleClick = () => {
    if (onViewClick) {
      onViewClick();
    }
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-glow hover:-translate-y-1",
        "bg-gradient-to-br from-slate-white to-soft-lilac/30 border-soft-lilac/20",
        "hover:border-royal-purple/40"
      )}
    >
      {/* Image Section */}
      <div className="relative h-32 overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
            {getCategoryIcon(category)}
          </div>
        )}
        
        {/* Status Badge */}
        <Badge 
          className={cn(
            "absolute top-2 right-2 text-xs font-medium shadow-sm",
            getStatusColor(status)
          )}
        >
          {status}
        </Badge>
      </div>

      <CardContent className="p-4">
        {/* Title */}
        <h3 className="font-heading font-bold text-midnight-navy text-lg mb-2 line-clamp-1 group-hover:text-royal-purple transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-cool-gray text-sm mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Category Badge */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {getCategoryIcon(category)}
            <span className="ml-1">{category}</span>
          </Badge>

          {/* CTA Button */}
          <Button 
            variant="view" 
            size="sm"
            onClick={handleClick}
            className="h-8 px-3 text-xs group-hover:scale-105 transition-transform"
          >
            View
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopCard;