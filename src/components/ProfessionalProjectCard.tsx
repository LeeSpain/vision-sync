import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Globe, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ProfessionalProjectCardProps {
  id: string;
  title: string;
  description: string;
  image?: string;
  status: string;
  category: string;
  route?: string;
  billing_type?: string;
  investmentAmount?: number;
  fundingProgress?: number;
  investorCount?: number;
}

export const ProfessionalProjectCard: React.FC<ProfessionalProjectCardProps> = ({
  id,
  title,
  description,
  image,
  status,
  category,
  route,
  billing_type,
  investmentAmount,
  fundingProgress,
  investorCount,
}) => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    if (route) {
      navigate(route);
    }
  };

  const getStatusColor = (status?: string) => {
    const normalized = (status ?? 'active').toLowerCase();
    switch (normalized) {
      case 'active':
        return 'bg-emerald-green/10 text-emerald-green border-emerald-green/20';
      case 'live':
        return 'bg-emerald-green/10 text-emerald-green border-emerald-green/20';
      case 'new':
        return 'bg-royal-purple/10 text-royal-purple border-royal-purple/20';
      case 'featured':
        return 'bg-coral-orange/10 text-coral-orange border-coral-orange/20';
      default:
        return 'bg-cool-gray/10 text-cool-gray border-cool-gray/20';
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-white to-soft-lilac/20 border-soft-lilac/30 hover:border-royal-purple/40 transition-all duration-300 hover:shadow-lg hover:shadow-royal-purple/10 transform hover:-translate-y-1">
      <CardContent className="p-0 relative">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-royal-purple/5 to-emerald-green/5">
          {image ? (
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="h-8 w-8 text-white" />
              </div>
            </div>
          )}
          
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/20 via-transparent to-transparent"></div>
        </div>

          {/* Content Section */}
          <div className="p-6 space-y-4">
            {/* Status and Category */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className={getStatusColor(status)}>
                {status}
              </Badge>
              <span className="text-sm text-cool-gray font-medium capitalize">{category}</span>
            </div>

            {/* Title and Description */}
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-xl text-midnight-navy group-hover:text-royal-purple transition-colors line-clamp-1">
                {title}
              </h3>
              <p className="text-cool-gray text-sm leading-relaxed line-clamp-3 min-h-[3.75rem]">
                {description}
              </p>
            </div>

            {/* Investment Details for Investment Projects */}
            {billing_type === 'investment' && investmentAmount && (
              <div className="bg-gradient-to-r from-emerald-green/10 to-electric-blue/10 rounded-lg p-3 border border-emerald-green/20">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-cool-gray">Target Investment</span>
                    <span className="text-sm font-bold text-royal-purple">
                      ${investmentAmount.toLocaleString()}
                    </span>
                  </div>
                  {fundingProgress !== undefined && fundingProgress > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-cool-gray">Progress</span>
                        <span className="font-bold text-emerald-green">{fundingProgress}%</span>
                      </div>
                      <div className="h-1.5 bg-soft-lilac/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-green to-electric-blue"
                          style={{ width: `${Math.min(fundingProgress, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2">
              <Button 
                variant="outline" 
                className="w-full group-hover:bg-royal-purple group-hover:text-white group-hover:border-royal-purple transition-all duration-300"
                onClick={handleViewClick}
              >
                <span className="flex items-center justify-center gap-2">
                  {billing_type === 'investment' ? 'View Investment' : 'View Website'}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          </div>
      </CardContent>
    </Card>
  );
};