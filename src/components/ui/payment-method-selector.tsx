import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Check, CreditCard, Calendar, Banknote, UserCheck } from 'lucide-react';

export type PaymentMethod = 'one-time' | 'subscription' | 'deposit-service' | 'installments' | 'service-contract';

interface PaymentMethodSelectorProps {
  pricing: {
    base: number;
    customization: number;
    subscription: {
      monthly: number;
      benefits: string[];
    };
    deposit: {
      amount: number;
      serviceMonthly: number;
      description: string;
    };
    installments: {
      available: boolean;
      plans: {
        months: number;
        monthlyAmount: number;
        totalAmount: number;
      }[];
    };
    ownership: {
      buyOutright: number;
      serviceContract: {
        deposit: number;
        monthly: number;
        benefits: string[];
      };
    };
  };
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  className?: string;
}

export const PaymentMethodSelector = ({ 
  pricing, 
  selectedMethod, 
  onMethodChange, 
  className = "" 
}: PaymentMethodSelectorProps) => {
  const { formatPrice } = useCurrency();
  const [selectedInstallmentPlan, setSelectedInstallmentPlan] = useState(0);

  const paymentMethods = [
    {
      id: 'one-time' as PaymentMethod,
      title: 'Buy Outright',
      description: 'One-time purchase with full ownership',
      price: formatPrice(pricing.base),
      icon: CreditCard,
      badge: 'Popular',
      benefits: ['Full ownership', 'No monthly fees', 'Complete control', 'Source code included']
    },
    {
      id: 'subscription' as PaymentMethod,
      title: 'Monthly Subscription',
      description: 'Ongoing monthly payments with benefits',
      price: `${formatPrice(pricing.subscription.monthly)}/month`,
      icon: Calendar,
      badge: 'Flexible',
      benefits: pricing.subscription.benefits
    },
    {
      id: 'deposit-service' as PaymentMethod,
      title: 'Deposit + Service',
      description: pricing.deposit.description,
      price: `${formatPrice(pricing.deposit.amount)} + ${formatPrice(pricing.deposit.serviceMonthly)}/month`,
      icon: Banknote,
      badge: 'Managed',
      benefits: ['Lower upfront cost', 'Professional management', 'Ongoing support', 'Regular updates']
    },
    {
      id: 'installments' as PaymentMethod,
      title: 'Installment Plan',
      description: 'Split the cost over multiple months',
      price: `${formatPrice(pricing.installments.plans[selectedInstallmentPlan]?.monthlyAmount)} x ${pricing.installments.plans[selectedInstallmentPlan]?.months} months`,
      icon: Calendar,
      badge: 'Easy',
      benefits: ['Spread the cost', 'No interest', 'Full ownership at end', 'Flexible terms'],
      disabled: !pricing.installments.available
    },
    {
      id: 'service-contract' as PaymentMethod,
      title: 'Service Contract',
      description: 'We manage everything for you',
      price: `${formatPrice(pricing.ownership.serviceContract.deposit)} + ${formatPrice(pricing.ownership.serviceContract.monthly)}/month`,
      icon: UserCheck,
      badge: 'Full Service',
      benefits: pricing.ownership.serviceContract.benefits
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {paymentMethods.map((method) => (
        <Card 
          key={method.id} 
          className={`cursor-pointer transition-all duration-200 ${
            selectedMethod === method.id 
              ? 'ring-2 ring-royal-purple border-royal-purple shadow-glow' 
              : 'hover:shadow-card border-soft-lilac/30'
          } ${method.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => !method.disabled && onMethodChange(method.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedMethod === method.id 
                    ? 'bg-royal-purple text-white' 
                    : 'bg-soft-lilac/20 text-midnight-navy'
                }`}>
                  <method.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {method.title}
                    {method.badge && (
                      <Badge variant={selectedMethod === method.id ? 'default' : 'secondary'} className="text-xs">
                        {method.badge}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {method.description}
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-midnight-navy">
                  {method.price}
                </div>
                {selectedMethod === method.id && (
                  <Check className="h-5 w-5 text-emerald-green ml-auto mt-1" />
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {method.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-cool-gray">
                  <div className="w-1.5 h-1.5 bg-emerald-green rounded-full flex-shrink-0"></div>
                  {benefit}
                </div>
              ))}
            </div>
            
            {/* Installment Plan Selector */}
            {method.id === 'installments' && selectedMethod === 'installments' && pricing.installments.available && (
              <div className="mt-4 space-y-2">
                <div className="text-sm font-medium text-midnight-navy">Choose your plan:</div>
                {pricing.installments.plans.map((plan, index) => (
                  <Button
                    key={index}
                    variant={selectedInstallmentPlan === index ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-between"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedInstallmentPlan(index);
                    }}
                  >
                    <span>{plan.months} months</span>
                    <span>{formatPrice(plan.monthlyAmount)}/month</span>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};