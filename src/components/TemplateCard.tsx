import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AppTemplate } from '@/utils/appTemplates';
import { Star, ArrowRight, CheckCircle, Calendar, Sparkles, Settings } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { PricingDisplay } from '@/components/ui/pricing-display';

interface TemplateCardProps {
  template: AppTemplate;
  onRequestTemplate: (template: AppTemplate) => void;
  onLearnMore: (template: AppTemplate) => void;
}

  const TemplateCard = ({ template, onRequestTemplate, onLearnMore }: TemplateCardProps) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [isSubscription, setIsSubscription] = useState(false);

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
      
      <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 via-slate-50 to-white rounded-t-xl relative overflow-hidden">
        {template.image_url ? (
          <img 
            src={template.image_url} 
            alt={`${template.title} - ${template.category} app template preview showcasing modern design and key features`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-midnight-navy via-royal-purple/80 to-electric-blue">
            <div className="text-5xl text-white/90 relative z-10">
              <Sparkles className="h-16 w-16" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardHeader className="pb-6 pt-6">
        <div className="space-y-3">
          <CardTitle className="text-xl font-heading font-bold text-midnight-navy group-hover:text-royal-purple transition-colors leading-tight">
            {template.title}
          </CardTitle>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs bg-electric-blue/10 text-electric-blue border-electric-blue/40 font-medium">
              {template.idealFor?.length || 0} Industries
            </Badge>
            <Badge variant="outline" className="text-xs bg-emerald-green/10 text-emerald-green border-emerald-green/40 font-medium">
              {template.keyFeatures?.length || 0} Features
            </Badge>
          </div>
          
          <CardDescription className="text-cool-gray leading-relaxed text-sm line-clamp-2 group-hover:text-midnight-navy/80 transition-colors">
            {template.overview}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Features Preview */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-midnight-navy mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-green" />
              Ideal for
            </h4>
            <div className="flex flex-wrap gap-1">
              {template.idealFor?.slice(0, 3).map((industry, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">
                  {industry}
                </Badge>
              ))}
              {template.idealFor && template.idealFor.length > 3 && (
                <Badge variant="outline" className="text-xs bg-slate-50 text-slate-500 border-slate-200">
                  +{template.idealFor.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-midnight-navy mb-2 flex items-center gap-2">
              <Star className="h-4 w-4 text-electric-blue" />
              Key Features
            </h4>
            <div className="space-y-1">
              {template.keyFeatures?.slice(0, 3).map((feature, index) => (
                <div key={index} className="text-xs text-cool-gray flex items-center gap-2">
                  <div className="w-1 h-1 bg-electric-blue rounded-full flex-shrink-0" />
                  {feature}
                </div>
              ))}
              {template.keyFeatures && template.keyFeatures.length > 3 && (
                <div className="text-xs text-electric-blue font-medium">
                  +{template.keyFeatures.length - 3} more features
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="space-y-3">
          <PricingDisplay
            salePrice={template.sale_price || template.pricing?.base || 0}
            customizationPrice={template.customization_price || template.pricing?.customization || 0}
            monthlySubscription={template.pricing?.subscription?.monthly}
            isSubscription={isSubscription}
            onToggle={setIsSubscription}
            showToggle={true}
          />
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
          onClick={() => navigate('/contact')}
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