import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AppTemplate } from '@/utils/appTemplates';
import { CheckCircle, Palette, Star, Users, DollarSign } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

interface TemplateDetailModalProps {
  template: AppTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestTemplate: (template: AppTemplate) => void;
}

const TemplateDetailModal = ({ template, isOpen, onClose, onRequestTemplate }: TemplateDetailModalProps) => {
  const { formatPrice } = useCurrency();

  if (!template) return null;

  const IconComponent = template.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-start space-x-4">
            <div className="bg-gradient-hero p-3 rounded-lg">
              <IconComponent className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <DialogTitle className="text-2xl font-heading text-midnight-navy">
                  {template.title}
                </DialogTitle>
                {template.popular && (
                  <Badge className="bg-coral-orange text-white border-0">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                )}
              </div>
              <DialogDescription className="text-cool-gray">
                {template.overview}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Ideal For Section */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Users className="h-5 w-5 text-royal-purple" />
                <h3 className="text-lg font-semibold text-midnight-navy">Ideal For</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {template.idealFor.map((industry, index) => (
                  <Badge key={index} variant="outline" className="bg-electric-blue/10 text-electric-blue border-electric-blue/30">
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Key Features Section */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="h-5 w-5 text-emerald-green" />
                <h3 className="text-lg font-semibold text-midnight-navy">Key Features</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {template.keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-emerald-green flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-cool-gray">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Personalization Options Section */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Palette className="h-5 w-5 text-coral-orange" />
                <h3 className="text-lg font-semibold text-midnight-navy">Customization Options</h3>
              </div>
              <div className="space-y-2">
                {template.personalizationOptions.map((option, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Palette className="h-4 w-4 text-coral-orange flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-cool-gray">{option}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Pricing Section */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <DollarSign className="h-5 w-5 text-royal-purple" />
                <h3 className="text-lg font-semibold text-midnight-navy">Pricing</h3>
              </div>
              <div className="bg-gradient-card p-4 rounded-lg border border-soft-lilac/30">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm text-cool-gray">Base Template</div>
                    <div className="text-2xl font-bold text-royal-purple">
                      {formatPrice(template.pricing.base)}
                    </div>
                    <div className="text-xs text-cool-gray">
                      Includes all core features and basic setup
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-cool-gray">Customization</div>
                    <div className="text-xl font-semibold text-midnight-navy">
                      From {formatPrice(template.pricing.customization)}
                    </div>
                    <div className="text-xs text-cool-gray">
                      Personalization, branding, and feature modifications
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            variant="premium" 
            onClick={() => {
              onRequestTemplate(template);
              onClose();
            }}
          >
            Request This Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateDetailModal;