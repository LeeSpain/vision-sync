import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Eye, DollarSign, TrendingUp, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  title: string;
  description: string;
  status: 'MVP' | 'Live' | 'Beta' | 'Private' | 'For Sale' | 'Concept';
  category: 'Featured' | 'Investment' | 'For Sale' | 'Internal';
  route?: string;
  image?: string;
  billing_type?: 'one-time' | 'subscription' | 'investment' | 'deposit-subscription';
  actions: {
    view?: boolean;
    invest?: boolean;
    buy?: boolean;
    demo?: boolean;
    subscribe?: boolean;
  };
}

const ProjectCard = ({ title, description, status, category, route, image, billing_type, actions }: ProjectCardProps) => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    if (route) {
      navigate(route);
    }
  };

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

  const getCategoryIcon = (category: string, billingType?: string) => {
    if (billingType === 'subscription' || billingType === 'deposit-subscription') return <RefreshCw className="h-4 w-4" />;
    switch (category) {
      case 'Investment': return <TrendingUp className="h-4 w-4" />;
      case 'For Sale': return <DollarSign className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  return (
    <Card className="group hover:shadow-glow transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-slate-white via-slate-white to-soft-lilac/20 border-2 border-soft-lilac/30 hover:border-royal-purple/40 relative overflow-hidden">
      {/* Premium Glow Effect */}
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl"></div>
      
      {/* Featured Badge */}
      {category === 'Featured' && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-gradient-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-elegant animate-pulse">
            ⭐ FEATURED
          </div>
        </div>
      )}

      {/* Hero Image/Icon Section */}
      <div className="relative aspect-video bg-gradient-to-br from-royal-purple/10 via-electric-blue/10 to-emerald-green/10 rounded-t-xl overflow-hidden">
        {image ? (
          <>
            <img 
              src={image} 
              alt={title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/40 via-transparent to-transparent"></div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-elegant">
                <div className="text-white text-2xl">{getCategoryIcon(category, billing_type)}</div>
              </div>
            </div>
          </>
        )}
        
        {/* Floating Elements */}
        <div className="absolute top-4 left-4 w-3 h-3 bg-emerald-green rounded-full opacity-60 group-hover:animate-bounce"></div>
        <div className="absolute bottom-4 right-8 w-2 h-2 bg-coral-orange rounded-full opacity-40 group-hover:animate-ping"></div>
        <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-electric-blue rounded-full opacity-50 group-hover:animate-pulse"></div>
      </div>
      
      <CardHeader className="relative z-10 pb-4">
        <div className="space-y-3">
          <CardTitle className="text-xl font-heading font-bold text-midnight-navy group-hover:text-royal-purple transition-colors duration-300 leading-tight">
            {title}
          </CardTitle>
          
          {/* Status and Category Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`${getStatusColor(status)} shadow-sm font-medium px-3 py-1`}>
              {status}
            </Badge>
            {billing_type === 'investment' && (
              <Badge className="bg-gradient-to-r from-emerald-green to-emerald-green/80 text-white border-0 shadow-sm font-medium px-3 py-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                Investment
              </Badge>
            )}
            {(billing_type === 'subscription' || billing_type === 'deposit-subscription') && (
              <Badge className="bg-gradient-to-r from-electric-blue to-electric-blue/80 text-white border-0 shadow-sm font-medium px-3 py-1">
                <RefreshCw className="h-3 w-3 mr-1" />
                {billing_type === 'deposit-subscription' ? 'Deposit+Sub' : 'SaaS'}
              </Badge>
            )}
          </div>
          
          <CardDescription className="text-cool-gray leading-relaxed text-sm line-clamp-3">
            {description}
          </CardDescription>
        </div>
      </CardHeader>

      {/* Enhanced Footer with Investment-style CTA */}
      <CardFooter className="relative z-10 pt-0 pb-6">
        <div className="w-full space-y-3">
          {/* Investment Amount Display for Featured */}
          {category === 'Featured' && (
            <div className="bg-gradient-to-r from-soft-lilac/20 to-soft-lilac/10 rounded-lg p-3 border border-soft-lilac/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-cool-gray uppercase tracking-wide">Starting Investment</span>
                <span className="text-lg font-bold text-royal-purple">From $25K</span>
              </div>
            </div>
          )}
          
          {actions.subscribe && (
            <Button 
              variant="premium" 
              size="lg" 
              onClick={handleViewClick}
              className="w-full group-hover:shadow-glow transition-all duration-300 font-semibold"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Subscribe Now
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          )}
          
          {actions.view && !actions.subscribe && (
            <Button 
              variant="hero" 
              size="lg" 
              onClick={handleViewClick}
              className="w-full group-hover:shadow-glow transition-all duration-300 font-semibold"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          )}
          
          {/* Investment Actions for Featured */}
          {category === 'Featured' && (
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" className="flex-1 text-xs font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                Invest
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs font-medium">
                <Eye className="h-3 w-3 mr-1" />
                Details
              </Button>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;