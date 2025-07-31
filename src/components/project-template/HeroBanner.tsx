import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface HeroBannerProps {
  title: string;
  description: string;
  status: 'MVP' | 'Live' | 'Beta' | 'Private' | 'For Sale' | 'Concept';
  category: 'Featured' | 'Investment' | 'For Sale' | 'Internal';
  primaryCTA?: {
    text: string;
    action: () => void;
    icon?: LucideIcon;
  };
  secondaryCTA?: {
    text: string;
    action: () => void;
    icon?: LucideIcon;
  };
  backgroundPattern?: ReactNode;
}

const HeroBanner = ({ 
  title, 
  description, 
  status, 
  category, 
  primaryCTA, 
  secondaryCTA,
  backgroundPattern 
}: HeroBannerProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Live': return 'bg-emerald-green text-white';
      case 'MVP': return 'bg-electric-blue text-white';
      case 'Beta': return 'bg-coral-orange text-white';
      case 'Private': return 'bg-cool-gray text-white';
      case 'For Sale': return 'bg-royal-purple text-white';
      case 'Concept': return 'bg-soft-lilac text-midnight-navy';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-primary py-20 lg:py-32">
      {/* Background Pattern */}
      {backgroundPattern && (
        <div className="absolute inset-0 opacity-10">
          {backgroundPattern}
        </div>
      )}
      
      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          {/* Status & Category Badges */}
          <div className="mb-6 flex items-center justify-center gap-3">
            <Badge className={getStatusColor(status)}>
              {status}
            </Badge>
            <Badge variant="outline" className="border-white/30 bg-white/10 text-white">
              {category}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-4xl font-bold text-white lg:text-6xl font-heading">
            {title}
          </h1>

          {/* Description */}
          <p className="mb-10 text-lg text-white/90 lg:text-xl max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>

          {/* CTAs */}
          {(primaryCTA || secondaryCTA) && (
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {primaryCTA && (
                <Button
                  onClick={primaryCTA.action}
                  size="lg"
                  className="bg-white text-royal-purple hover:bg-white/90 font-semibold"
                >
                  {primaryCTA.icon && <primaryCTA.icon className="mr-2 h-5 w-5" />}
                  {primaryCTA.text}
                </Button>
              )}
              {secondaryCTA && (
                <Button
                  onClick={secondaryCTA.action}
                  variant="outline"
                  size="lg"
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                >
                  {secondaryCTA.icon && <secondaryCTA.icon className="mr-2 h-5 w-5" />}
                  {secondaryCTA.text}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;