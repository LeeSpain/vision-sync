import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Eye, DollarSign, TrendingUp } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  status: 'MVP' | 'Live' | 'Beta' | 'Private' | 'For Sale' | 'Concept';
  category: 'Featured' | 'Investment' | 'For Sale' | 'Internal';
  route?: string;
  image?: string;
  actions: {
    view?: boolean;
    invest?: boolean;
    buy?: boolean;
    demo?: boolean;
  };
}

const ProjectCard = ({ title, description, status, category, route, image, actions }: ProjectCardProps) => {
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Investment': return <TrendingUp className="h-4 w-4" />;
      case 'For Sale': return <DollarSign className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  return (
    <Card className="group hover:shadow-hover transition-all duration-300 hover:scale-105 bg-gradient-card border-soft-lilac/30">
      {image && (
        <div className="aspect-video bg-gradient-hero rounded-t-xl flex items-center justify-center">
          <div className="text-6xl opacity-20">{getCategoryIcon(category)}</div>
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-heading text-midnight-navy group-hover:text-royal-purple transition-colors">
              {title}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(status)}>
                {status}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {category}
              </Badge>
            </div>
          </div>
        </div>
        <CardDescription className="text-cool-gray">
          {description}
        </CardDescription>
      </CardHeader>

      <CardFooter className="flex flex-wrap gap-2">
        {actions.view && (
          <Button variant="view" size="sm" className="flex-1">
            <Eye className="h-4 w-4" />
            View
          </Button>
        )}
        {actions.demo && (
          <Button variant="outline" size="sm" className="flex-1">
            <ExternalLink className="h-4 w-4" />
            Demo
          </Button>
        )}
        {actions.invest && (
          <Button variant="invest" size="sm" className="flex-1">
            <TrendingUp className="h-4 w-4" />
            Invest
          </Button>
        )}
        {actions.buy && (
          <Button variant="buy" size="sm" className="flex-1">
            <DollarSign className="h-4 w-4" />
            Buy
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;