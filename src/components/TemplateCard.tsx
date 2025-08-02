import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AppTemplate } from '@/utils/appTemplates';
import { Star, ArrowRight, CheckCircle, Calendar, Sparkles, Settings } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { PricingToggle } from '@/components/ui/pricing-toggle';
import { useState } from 'react';

interface TemplateCardProps {
  template: AppTemplate;
  onRequestTemplate: (template: AppTemplate) => void;
  onLearnMore: (template: AppTemplate) => void;
}

const TemplateCard = ({ template, onRequestTemplate, onLearnMore }: TemplateCardProps) => {
  const { formatPrice } = useCurrency();
  const [isSubscription, setIsSubscription] = useState(false);
  const IconComponent = template.icon;

  return (
    <Card className="group hover:shadow-hover transition-all duration-300 hover:scale-[1.02] bg-white/80 backdrop-blur-sm border border-slate-200/60 relative overflow-hidden shadow-lg">
      {template.popular && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-coral-orange to-emerald-green text-white border-0 shadow-md">
            <Star className="h-3 w-3 mr-1" />
            Popular Choice
          </Badge>
        </div>
      )}
      
      <div className="aspect-[4/3] bg-gradient-to-br from-midnight-navy via-royal-purple/80 to-electric-blue rounded-t-xl flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/30 to-transparent" />
        <div className="text-5xl text-white/90 relative z-10 group-hover:scale-110 transition-transform duration-300">
          <IconComponent />
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
      </div>
      
      <CardHeader className="pb-6 pt-6">
        <div className="space-y-3">
          <CardTitle className="text-xl font-heading font-bold text-midnight-navy group-hover:text-royal-purple transition-colors leading-tight">
            {template.title}
          </CardTitle>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs bg-electric-blue/10 text-electric-blue border-electric-blue/40 font-medium">
              {template.idealFor.length} Industries
            </Badge>
            <Badge variant="outline" className="text-xs bg-emerald-green/10 text-emerald-green border-emerald-green/40 font-medium">
              {template.keyFeatures.length} Features
            </Badge>
          </div>
          
          <CardDescription className="text-cool-gray/90 line-clamp-2 leading-relaxed">
            {template.overview}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="py-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-midnight-navy mb-2">Ideal for:</h4>
            <div className="flex flex-wrap gap-1">
              {template.idealFor.slice(0, 3).map((industry, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-soft-lilac/20 text-midnight-navy border-soft-lilac/50">
                  {industry}
                </Badge>
              ))}
              {template.idealFor.length > 3 && (
                <Badge variant="outline" className="text-xs bg-soft-lilac/20 text-midnight-navy border-soft-lilac/50">
                  +{template.idealFor.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-midnight-navy mb-2">Key Features:</h4>
            <div className="space-y-1">
              {template.keyFeatures.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-xs text-cool-gray">
                  <CheckCircle className="h-3 w-3 text-emerald-green flex-shrink-0" />
                  <span className="truncate">{feature}</span>
                </div>
              ))}
              {template.keyFeatures.length > 3 && (
                <div className="text-xs text-royal-purple font-medium">
                  +{template.keyFeatures.length - 3} more features
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <PricingToggle 
              isSubscription={isSubscription} 
              onToggle={setIsSubscription} 
            />
            
            <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-xl p-4 border border-slate-200/60">
              {isSubscription ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-midnight-navy flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-royal-purple" />
                        Monthly Subscription
                      </div>
                      <div className="text-2xl font-bold text-royal-purple">
                        {formatPrice(template.pricing.subscription.monthly)}
                        <span className="text-sm font-medium text-cool-gray">/month</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-cool-gray mb-1">Setup Fee</div>
                      <div className="text-sm font-semibold text-midnight-navy">
                        {formatPrice(typeof template.pricing.deposit === 'number' ? template.pricing.deposit : template.pricing.deposit?.amount || 0)}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-cool-gray bg-white/60 rounded-lg p-2">
                    <span className="font-medium">Includes:</span> {template.pricing.subscription.benefits.slice(0, 2).join(', ')}
                    {template.pricing.subscription.benefits.length > 2 && ' + more'}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-midnight-navy">Base Template</div>
                      <div className="text-2xl font-bold text-royal-purple">
                        {formatPrice(template.pricing.base)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-cool-gray mb-1">Customization</div>
                      <div className="text-sm font-semibold text-emerald-green">
                        from {formatPrice(template.pricing.customization)}
                      </div>
                    </div>
                  </div>
                  <div className="bg-emerald-green/5 rounded-lg p-2 border border-emerald-green/20">
                    <div className="text-xs text-emerald-green font-medium">
                      ✓ Ready to deploy • ✓ Full source code • ✓ Commercial license
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-3 pt-6 bg-slate-50/50">
        <Button 
          variant="premium" 
          size="sm" 
          onClick={() => onLearnMore(template)}
          className="flex-1 font-medium shadow-sm"
        >
          <Settings className="h-4 w-4 mr-2" />
          Customize Now
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.location.href = '/contact'}
          className="flex-1 font-medium border-royal-purple/30 text-royal-purple hover:bg-royal-purple hover:text-white"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Contact Us Today
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;