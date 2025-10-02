import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCurrency } from '@/contexts/CurrencyContext';
import { PricingToggle } from './pricing-toggle';
import { Check, Crown, Code, Shield } from 'lucide-react';

interface PricingDisplayProps {
  salePrice: number;
  customizationPrice?: number;
  maintenanceFee?: number;
  monthlySubscription?: number;
  isSubscription: boolean;
  onToggle: (value: boolean) => void;
  showToggle?: boolean;
  className?: string;
}

export const PricingDisplay = ({ 
  salePrice, 
  customizationPrice = 0,
  maintenanceFee,
  monthlySubscription,
  isSubscription, 
  onToggle, 
  showToggle = true,
  className = ""
}: PricingDisplayProps) => {
  const { formatPrice } = useCurrency();
  
  // Use actual monthly subscription from database, fallback to calculation if not provided
  const actualMonthlySubscription = monthlySubscription || Math.round(salePrice * 0.1);
  // Services & maintenance: use custom fee if provided, otherwise 5% of sale price
  const servicesAndMaintenance = maintenanceFee || Math.round(salePrice * 0.05);
  
  // For one-time purchase: total is just the sale price, deposit is part of it
  const totalOneTime = salePrice;
  const balanceRemaining = customizationPrice > 0 ? salePrice - customizationPrice : 0;
  const totalMonthly = actualMonthlySubscription;

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
                  <span>Monthly subscription</span>
                  <span>{formatPrice(actualMonthlySubscription)}</span>
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
            <div className="space-y-6 animate-fade-in">
              {/* Header with gradient */}
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-emerald-green/10 via-electric-blue/10 to-royal-purple/10 p-6 border-2 border-emerald-green/30">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-green/20 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-5 w-5 text-emerald-green" />
                    <span className="text-lg font-bold text-midnight-navy">Buy Now (Own It)</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold bg-gradient-to-r from-emerald-green to-electric-blue bg-clip-text text-transparent">
                      {formatPrice(totalOneTime)}
                    </span>
                    <span className="text-sm text-cool-gray">one-time</span>
                  </div>
                </div>
              </div>
              
              {/* Pricing breakdown */}
              <div className="space-y-3 px-2">
                <div className="flex justify-between items-center py-2 border-b border-slate-white">
                  <span className="text-sm text-midnight-navy font-medium">Total platform price</span>
                  <span className="text-sm font-semibold text-midnight-navy">{formatPrice(salePrice)}</span>
                </div>
                {customizationPrice > 0 && (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-slate-white">
                      <span className="text-sm text-midnight-navy font-medium">Deposit required</span>
                      <span className="text-sm font-semibold text-emerald-green">{formatPrice(customizationPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-white">
                      <span className="text-sm text-midnight-navy font-medium">Balance remaining</span>
                      <span className="text-sm font-semibold text-midnight-navy">{formatPrice(balanceRemaining)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center py-2">
                  <div>
                    <span className="text-sm text-midnight-navy font-medium">Services & maintenance</span>
                    <span className="block text-xs text-cool-gray">(optional add-on)</span>
                  </div>
                  <span className="text-sm font-semibold text-electric-blue">{formatPrice(servicesAndMaintenance)}/mo</span>
                </div>
              </div>
              
              {/* Benefits section */}
              <div className="bg-gradient-to-br from-slate-white/50 to-soft-lilac/20 rounded-lg p-5 space-y-3">
                <h4 className="text-sm font-bold text-midnight-navy mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-green" />
                  What's Included
                </h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 group">
                    <div className="mt-0.5 flex-shrink-0">
                      <div className="h-5 w-5 rounded-full bg-emerald-green/20 flex items-center justify-center group-hover:bg-emerald-green/30 transition-colors">
                        <Check className="h-3 w-3 text-emerald-green" />
                      </div>
                    </div>
                    <span className="text-sm text-midnight-navy">Full ownership & IP rights transfer</span>
                  </div>
                  <div className="flex items-start gap-3 group">
                    <div className="mt-0.5 flex-shrink-0">
                      <div className="h-5 w-5 rounded-full bg-emerald-green/20 flex items-center justify-center group-hover:bg-emerald-green/30 transition-colors">
                        <Code className="h-3 w-3 text-emerald-green" />
                      </div>
                    </div>
                    <span className="text-sm text-midnight-navy">Complete source code included</span>
                  </div>
                  <div className="flex items-start gap-3 group">
                    <div className="mt-0.5 flex-shrink-0">
                      <div className="h-5 w-5 rounded-full bg-emerald-green/20 flex items-center justify-center group-hover:bg-emerald-green/30 transition-colors">
                        <Check className="h-3 w-3 text-emerald-green" />
                      </div>
                    </div>
                    <span className="text-sm text-midnight-navy">No recurring fees or subscriptions</span>
                  </div>
                  <div className="flex items-start gap-3 group">
                    <div className="mt-0.5 flex-shrink-0">
                      <div className="h-5 w-5 rounded-full bg-electric-blue/20 flex items-center justify-center group-hover:bg-electric-blue/30 transition-colors">
                        <Check className="h-3 w-3 text-electric-blue" />
                      </div>
                    </div>
                    <span className="text-sm text-midnight-navy">Optional maintenance plan available</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};