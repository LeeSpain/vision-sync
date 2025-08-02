import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Package, Zap, TrendingUp, Building2, RefreshCw, CreditCard, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/contexts/CurrencyContext';

interface ShopCardProps {
  title: string;
  description: string;
  status: 'Live' | 'Beta' | 'Development' | 'Planning';
  category: 'For Sale' | 'Internal' | 'Investment';
  image?: string;
  route?: string;
  billing_type?: 'one-time' | 'subscription' | 'investment' | 'deposit-subscription';
  subscription_price?: number;
  price?: number;
  deposit_amount?: number;
  onViewClick?: () => void;
}

const ShopCard: React.FC<ShopCardProps> = ({
  title,
  description,
  status,
  category,
  image,
  route,
  billing_type,
  subscription_price,
  price,
  deposit_amount,
  onViewClick
}) => {
  const { formatPrice } = useCurrency();
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

  const getCategoryIcon = (category: string, billingType?: string) => {
    if (billingType === 'subscription') return <RefreshCw className="h-4 w-4" />;
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
            {getCategoryIcon(category, billing_type)}
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
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            {getCategoryIcon(category, billing_type)}
            <span className="ml-1">{category}</span>
          </Badge>
        </div>

        {/* Enhanced Pricing Display */}
        <div className="mb-4 space-y-2">
          {/* Primary Pricing */}
          {price && (
            <div className="bg-soft-lilac/10 p-2 rounded-lg border border-soft-lilac/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-emerald-green">
                  <CreditCard className="h-3 w-3" />
                  <span>From</span>
                </div>
                <div className="text-sm font-bold text-midnight-navy">
                  {formatPrice(price)}
                </div>
              </div>
            </div>
          )}
          
          {billing_type === 'subscription' && subscription_price && (
            <div className="bg-royal-purple/10 p-2 rounded-lg border border-royal-purple/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-royal-purple">
                  <Calendar className="h-3 w-3" />
                  <span>Monthly</span>
                </div>
                <div className="text-sm font-bold text-royal-purple">
                  {formatPrice(subscription_price)}/mo
                </div>
              </div>
            </div>
          )}
          
          {billing_type === 'deposit-subscription' && deposit_amount && subscription_price && (
            <div className="bg-coral-orange/10 p-2 rounded-lg border border-coral-orange/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-coral-orange">
                  <CreditCard className="h-3 w-3" />
                  <span>Deposit + Monthly</span>
                </div>
                <div className="text-sm font-bold text-coral-orange">
                  {formatPrice(deposit_amount)} + {formatPrice(subscription_price)}/mo
                </div>
              </div>
            </div>
          )}
          
          {/* Payment Options Based on Available Data */}
          {(price || subscription_price || deposit_amount) && (
            <div className="flex flex-wrap gap-1 text-xs">
              {price && (
                <span className="bg-emerald-green/10 text-emerald-green px-2 py-0.5 rounded-full">
                  One-time
                </span>
              )}
              {billing_type === 'subscription' && subscription_price && (
                <span className="bg-royal-purple/10 text-royal-purple px-2 py-0.5 rounded-full">
                  Monthly
                </span>
              )}
              {billing_type === 'deposit-subscription' && deposit_amount && subscription_price && (
                <span className="bg-coral-orange/10 text-coral-orange px-2 py-0.5 rounded-full">
                  Deposit+Monthly
                </span>
              )}
            </div>
          )}
        </div>

        {/* CTA Button */}
        <Button 
          variant="view" 
          size="sm"
          onClick={handleClick}
          className="w-full group-hover:scale-105 transition-transform"
        >
          View All Options
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ShopCard;