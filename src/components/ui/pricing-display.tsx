import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCurrency } from '@/contexts/CurrencyContext';
import { PricingToggle } from './pricing-toggle';

interface PricingDisplayProps {
  salePrice: number;
  customizationPrice?: number;
  isSubscription: boolean;
  onToggle: (value: boolean) => void;
  showToggle?: boolean;
  className?: string;
}

export const PricingDisplay = ({ 
  salePrice, 
  customizationPrice = 0, 
  isSubscription, 
  onToggle, 
  showToggle = true,
  className = ""
}: PricingDisplayProps) => {
  const { formatPrice } = useCurrency();
  
  // Calculate subscription pricing: 10% of sale price monthly
  const monthlySubscription = Math.round(salePrice * 0.1);
  // Services & maintenance: 5% of sale price (included in subscription)
  const servicesAndMaintenance = Math.round(salePrice * 0.05);
  
  const totalOneTime = salePrice + customizationPrice;
  const totalMonthly = monthlySubscription;

  return (
    <div className={`space-y-4 ${className}`}>
      {showToggle && (
        <PricingToggle isSubscription={isSubscription} onToggle={onToggle} />
      )}
      
      <Card className="border-soft-lilac/30">
        <CardContent className="p-4">
          {isSubscription ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-midnight-navy">Monthly Subscription</span>
                <Badge variant="secondary" className="bg-soft-lilac/20 text-midnight-navy">
                  {formatPrice(totalMonthly)}/month
                </Badge>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Base subscription (10% of {formatPrice(salePrice)})</span>
                  <span>{formatPrice(monthlySubscription)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Services & maintenance (5% included)</span>
                  <span className="text-green-600">Included</span>
                </div>
                {customizationPrice > 0 && (
                  <div className="flex justify-between">
                    <span>Customization (one-time)</span>
                    <span>{formatPrice(customizationPrice)}</span>
                  </div>
                )}
              </div>
              
              <div className="pt-2 border-t border-soft-lilac/20">
                <p className="text-xs text-muted-foreground">
                  • No ownership transfer
                  • Ongoing updates & support included
                  • Cancel anytime
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-midnight-navy">Buy Now (Own It)</span>
                <Badge variant="default" className="bg-midnight-navy text-white">
                  {formatPrice(totalOneTime)}
                </Badge>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Base price</span>
                  <span>{formatPrice(salePrice)}</span>
                </div>
                {customizationPrice > 0 && (
                  <div className="flex justify-between">
                    <span>Customization</span>
                    <span>{formatPrice(customizationPrice)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Services & maintenance (optional)</span>
                  <span>{formatPrice(servicesAndMaintenance)}/month</span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-soft-lilac/20">
                <p className="text-xs text-muted-foreground">
                  • Full ownership transfer
                  • Source code included
                  • Optional maintenance plan available
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};