import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Package, Shield, Headphones, CheckCircle } from 'lucide-react';

interface PurchaseSectionProps {
  title?: string;
  description?: string;
  pricing: {
    amount: string;
    currency?: string;
    period?: string;
    originalPrice?: string;
  };
  includes: string[];
  features?: string[];
  onPurchase: () => void;
  badge?: string;
}

const PurchaseSection = ({ 
  title = "Get Started Today", 
  description = "Complete platform with everything you need to get started.",
  pricing,
  includes,
  features,
  onPurchase,
  badge
}: PurchaseSectionProps) => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-primary">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl font-heading">
            {title}
          </h2>
          <p className="mb-12 text-lg text-white/90 leading-relaxed">
            {description}
          </p>

          <Card className="bg-white/10 border-white/20 backdrop-blur-md">
            <CardHeader className="text-center">
              {badge && (
                <Badge className="mx-auto mb-4 bg-emerald-green text-white">
                  {badge}
                </Badge>
              )}
              <CardTitle className="text-white font-heading">
                <div className="flex items-center justify-center gap-2">
                  {pricing.originalPrice && (
                    <span className="text-xl text-white/60 line-through">
                      {pricing.currency || '$'}{pricing.originalPrice}
                    </span>
                  )}
                  <span className="text-4xl font-bold">
                    {pricing.currency || '$'}{pricing.amount}
                  </span>
                  {pricing.period && (
                    <span className="text-lg text-white/80">
                      /{pricing.period}
                    </span>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Includes */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white font-heading">
                  What's Included:
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {includes.map((item, index) => (
                    <div key={index} className="flex items-center text-white/90">
                      <CheckCircle className="mr-3 h-5 w-5 text-emerald-green flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              {features && features.length > 0 && (
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-white font-heading">
                    Key Features:
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center text-white/90">
                        <Package className="mr-3 h-5 w-5 text-emerald-green flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Purchase Button */}
              <div className="text-center">
                <Button
                  onClick={onPurchase}
                  size="lg"
                  className="bg-white text-royal-purple hover:bg-white/90 font-semibold"
                >
                  <DollarSign className="mr-2 h-5 w-5" />
                  Purchase Now
                </Button>
              </div>

              {/* Support Info */}
              <div className="flex items-center justify-center gap-6 text-sm text-white/70">
                <div className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  Secure Payment
                </div>
                <div className="flex items-center">
                  <Headphones className="mr-2 h-4 w-4" />
                  24/7 Support
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PurchaseSection;