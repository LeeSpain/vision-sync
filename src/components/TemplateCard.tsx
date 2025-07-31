import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AppTemplate } from '@/utils/appTemplates';
import { Star, ArrowRight, CheckCircle } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

interface TemplateCardProps {
  template: AppTemplate;
  onRequestTemplate: (template: AppTemplate) => void;
  onLearnMore: (template: AppTemplate) => void;
}

const TemplateCard = ({ template, onRequestTemplate, onLearnMore }: TemplateCardProps) => {
  const { formatPrice } = useCurrency();
  const IconComponent = template.icon;

  return (
    <Card className="group hover:shadow-hover transition-all duration-300 hover:scale-105 bg-gradient-card border-soft-lilac/30 relative overflow-hidden">
      {template.popular && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-coral-orange text-white border-0">
            <Star className="h-3 w-3 mr-1" />
            Popular
          </Badge>
        </div>
      )}
      
      <div className="aspect-video bg-gradient-hero rounded-t-xl flex items-center justify-center relative">
        <div className="text-6xl opacity-20 text-white">
          <IconComponent />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/20 to-transparent" />
      </div>
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-lg font-heading text-midnight-navy group-hover:text-royal-purple transition-colors">
              {template.title}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs bg-electric-blue/10 text-electric-blue border-electric-blue/30">
                {template.idealFor.length} Industries
              </Badge>
              <Badge variant="outline" className="text-xs bg-emerald-green/10 text-emerald-green border-emerald-green/30">
                {template.keyFeatures.length} Features
              </Badge>
            </div>
          </div>
        </div>
        
        <CardDescription className="text-cool-gray line-clamp-3">
          {template.overview}
        </CardDescription>
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

          <div className="bg-soft-lilac/10 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-midnight-navy">Starting at</div>
                <div className="text-lg font-bold text-royal-purple">
                  {formatPrice(template.pricing.base)}
                </div>
              </div>
              <div className="text-xs text-cool-gray">
                + customization from<br />
                <span className="font-semibold text-midnight-navy">{formatPrice(template.pricing.customization)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onLearnMore(template)}
          className="flex-1"
        >
          Learn More
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
        <Button 
          variant="premium" 
          size="sm" 
          onClick={() => onRequestTemplate(template)}
          className="flex-1"
        >
          Request Template
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;