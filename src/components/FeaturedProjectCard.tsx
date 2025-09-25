import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  Clock, 
  DollarSign, 
  Target,
  Sparkles,
  Timer,
  FlameKindling
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface FeaturedProjectCardProps {
  id: string;
  title: string;
  description: string;
  image?: string;
  status: string;
  category: string;
  route?: string;
  pricing?: string;
  roi?: string;
  fundingProgress?: number;
  investorsViewing?: number;
  timeLeft?: string;
  isHot?: boolean;
  limitedSpots?: number;
  socialProof?: string;
  actions?: {
    view?: boolean;
    invest?: boolean;
    buy?: boolean;
    demo?: boolean;
    subscribe?: boolean;
  };
}

export const FeaturedProjectCard: React.FC<FeaturedProjectCardProps> = ({
  id,
  title,
  description,
  image,
  status,
  category,
  route,
  pricing = "Contact for pricing",
  roi = "25-40%",
  fundingProgress = 65,
  investorsViewing = Math.floor(Math.random() * 50) + 20,
  timeLeft = "5 days",
  isHot = true,
  limitedSpots = Math.floor(Math.random() * 5) + 3,
  socialProof,
  actions = { view: true, invest: true }
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [currentViewers, setCurrentViewers] = useState(investorsViewing);
  const [animatedROI, setAnimatedROI] = useState(0);

  // Animate ROI counter on mount
  useEffect(() => {
    const targetROI = parseInt(roi.split('-')[0]) || 25;
    let current = 0;
    const increment = targetROI / 30;
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetROI) {
        setAnimatedROI(targetROI);
        clearInterval(timer);
      } else {
        setAnimatedROI(Math.floor(current));
      }
    }, 50);

    return () => clearInterval(timer);
  }, [roi]);

  // Simulate live viewer updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentViewers(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleViewClick = () => {
    if (route) {
      window.location.href = route;
    }
  };

  const getStatusColor = (status?: string) => {
    const normalized = (status ?? 'active').toLowerCase();
    switch (normalized) {
      case 'active':
        return 'bg-emerald-green/10 text-emerald-green border-emerald-green/20';
      case 'hot':
        return 'bg-coral-orange/10 text-coral-orange border-coral-orange/20';
      case 'new':
        return 'bg-royal-purple/10 text-royal-purple border-royal-purple/20';
      default:
        return 'bg-cool-gray/10 text-cool-gray border-cool-gray/20';
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-white to-soft-lilac/30 border-soft-lilac/20 hover:border-royal-purple/40 transition-all duration-500 hover:shadow-glow hover:shadow-royal-purple/20 transform hover:scale-[1.02]">
      {/* Floating background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-royal-purple/5 via-transparent to-emerald-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-primary rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
      
      {/* Hot Deal Badge */}
      {isHot && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-gradient-to-r from-coral-orange to-coral-orange/80 text-white border-none shadow-lg animate-pulse">
            <FlameKindling className="h-3 w-3 mr-1" />
            HOT DEAL
          </Badge>
        </div>
      )}

      {/* Viewer Count */}
      <div className="absolute top-3 right-3 z-10">
        <div className="bg-midnight-navy/80 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1 backdrop-blur-sm">
          <Eye className="h-3 w-3" />
          {currentViewers} viewing
        </div>
      </div>

      <CardContent className="p-0 relative">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-royal-purple/10 to-emerald-green/10">
          {image ? (
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/60 via-transparent to-transparent"></div>
          
          {/* Heart icon */}
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="absolute bottom-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
          >
            <Heart className={cn("h-4 w-4 transition-colors", isLiked ? "fill-coral-orange text-coral-orange" : "text-white")} />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Status and Category */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={getStatusColor(status)}>
              {status}
            </Badge>
            <span className="text-sm text-cool-gray font-medium">{category}</span>
          </div>

          {/* Title and Description */}
          <div>
            <h3 className="font-heading font-bold text-xl text-midnight-navy mb-2 group-hover:text-royal-purple transition-colors line-clamp-2">
              {title}
            </h3>
            <p className="text-cool-gray text-sm leading-relaxed line-clamp-3">
              {description}
            </p>
          </div>

          {/* Investment Metrics */}
          <div className="space-y-3">
            {/* Pricing and ROI */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-green" />
                <span className="font-semibold text-midnight-navy">{pricing}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-coral-orange" />
                <span className="font-semibold text-coral-orange">ROI: {animatedROI}%+</span>
              </div>
            </div>

            {/* Funding Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-cool-gray">Funding Progress</span>
                <span className="font-semibold text-midnight-navy">{fundingProgress}%</span>
              </div>
              <Progress value={fundingProgress} className="h-2" />
            </div>

            {/* Social Proof and Time Left */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-emerald-green">
                <Users className="h-4 w-4" />
                <span className="font-medium">{socialProof || `${investorsViewing} viewing`}</span>
              </div>
              <div className="flex items-center gap-2 text-cool-gray">
                <Clock className="h-4 w-4" />
                <span>{timeLeft}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {actions.view && (
              <Button 
                variant="view" 
                size="sm" 
                className="flex-1 group-hover:scale-105 transition-transform"
                onClick={handleViewClick}
              >
                <Target className="h-4 w-4" />
                View Details
              </Button>
            )}
            {actions.invest && (
              <Button 
                variant="invest" 
                size="sm" 
                className="flex-1 group-hover:scale-105 transition-transform"
              >
                <TrendingUp className="h-4 w-4" />
                Invest Now
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};