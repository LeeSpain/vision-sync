import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useTemplates } from '@/hooks/useTemplates';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ArrowRight, 
  Sparkles, 
  Star, 
  CheckCircle, 
  TrendingUp, 
  Zap, 
  Clock,
  Users,
  Palette,
  Rocket
} from 'lucide-react';
import { useState, useEffect } from 'react';

const EnhancedTemplatesShowcase = () => {
  const { formatPrice } = useCurrency();
  const { templates, getPopularTemplates, getAllCategories, loading } = useTemplates();
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL LOGIC
  // Animated statistics
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  const popularTemplates = getPopularTemplates();
  const totalTemplates = templates.length;
  const categories = getAllCategories();

  if (loading) {
    return (
      <div className="mb-20">
        <div className="bg-gradient-to-br from-midnight-navy/5 via-royal-purple/5 to-emerald-green/5 rounded-3xl p-8 md:p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-purple mx-auto mb-4"></div>
            <p className="text-cool-gray">Loading templates...</p>
          </div>
        </div>
      </div>
    );
  }

  const getAnimatedStat = () => {
    const stats = [
      { value: totalTemplates, label: 'App Templates', icon: Package },
      { value: categories.length, label: 'Industry Categories', icon: TrendingUp },
      { value: 72, label: 'Hours Avg. Delivery', icon: Clock },
      { value: 100, label: '% Customizable', icon: Palette }
    ];
    return stats[animationPhase];
  };

  const currentStat = getAnimatedStat();
  const StatIcon = currentStat.icon;

  return (
    <div className="mb-20">
      <div className="bg-gradient-to-br from-midnight-navy/5 via-royal-purple/5 to-emerald-green/5 rounded-3xl p-8 md:p-12 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-6 right-6 w-32 h-32 bg-coral-orange/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-6 left-6 w-24 h-24 bg-emerald-green/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-royal-purple/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-primary px-6 py-3 rounded-full text-white font-medium mb-6 animate-fade-in shadow-glow">
              <Package className="h-5 w-5" />
              Ready-to-Deploy Apps
            </div>
            
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-midnight-navy mb-6 leading-tight">
              📦 Off the Shelf
              <span className="block bg-gradient-to-r from-coral-orange via-emerald-green to-electric-blue bg-clip-text text-transparent mt-2">
                Templates
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-cool-gray max-w-4xl mx-auto mb-8 leading-relaxed">
              Skip months of development with our professional app templates. 
              <span className="font-semibold text-royal-purple"> {totalTemplates} industry-specific solutions</span> ready for 
              immediate customization and deployment.
            </p>
          </div>

          {/* Animated Statistics */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-card min-w-[280px]">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <StatIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-midnight-navy animate-fade-in">
                    {currentStat.value}
                  </div>
                </div>
                <div className="text-cool-gray font-medium animate-fade-in">
                  {currentStat.label}
                </div>
              </div>
            </div>
          </div>

          {/* Featured Templates Preview */}
          <div className="mb-12">
            <h3 className="text-2xl font-heading font-bold text-midnight-navy text-center mb-8">
              🌟 Most Popular Templates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {popularTemplates.slice(0, 2).map((template, index) => {
                const isHovered = hoveredTemplate === template.id;
                
                return (
                  <Card 
                    key={template.id}
                    className={`group relative overflow-hidden border-0 bg-white/70 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-hover cursor-pointer ${
                      isHovered ? 'shadow-hover scale-105' : ''
                    }`}
                    onMouseEnter={() => setHoveredTemplate(template.id)}
                    onMouseLeave={() => setHoveredTemplate(null)}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-coral-orange/10 via-transparent to-emerald-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <CardContent className="p-6 relative">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glow">
                          <Package className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-heading font-bold text-lg text-midnight-navy group-hover:text-royal-purple transition-colors">
                              {template.title}
                            </h4>
                            <Badge className="bg-coral-orange/20 text-coral-orange border-0 text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          </div>
                          <p className="text-cool-gray text-sm mb-3 line-clamp-2">
                            {template.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <span className="text-royal-purple font-bold">
                                From {formatPrice(template.pricing.base)}
                              </span>
                            </div>
                            <div className="text-xs text-cool-gray">
                              {template.category}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Industry Categories */}
          <div className="mb-12">
            <h3 className="text-2xl font-heading font-bold text-midnight-navy text-center mb-8">
              🎯 Industry Categories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {categories.slice(0, 3).map((category, index) => {
                const templateCount = templates.filter(t => t.category === category).length;
                
                return (
                  <Card 
                    key={category}
                    className="group bg-white/70 backdrop-blur-sm border-0 hover:shadow-card transition-all duration-300 hover:scale-105 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-royal-purple to-electric-blue rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow group-hover:scale-110 transition-transform duration-300">
                        <Package className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="font-heading font-bold text-lg text-midnight-navy mb-2 group-hover:text-royal-purple transition-colors">
                        {category}
                      </h4>
                      <p className="text-cool-gray text-sm mb-3">
                        Professional templates for {category.toLowerCase()}
                      </p>
                      <Badge variant="outline" className="bg-emerald-green/10 text-emerald-green border-emerald-green/30">
                        {templateCount} Templates
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Key Benefits Grid */}
          <div className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                <Rocket className="h-8 w-8 text-coral-orange mx-auto mb-2" />
                <div className="text-sm font-semibold text-midnight-navy">Quick Deploy</div>
                <div className="text-xs text-cool-gray">72h Average</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                <Palette className="h-8 w-8 text-royal-purple mx-auto mb-2" />
                <div className="text-sm font-semibold text-midnight-navy">Full Custom</div>
                <div className="text-xs text-cool-gray">100% Flexible</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                <Users className="h-8 w-8 text-emerald-green mx-auto mb-2" />
                <div className="text-sm font-semibold text-midnight-navy">Pro Support</div>
                <div className="text-xs text-cool-gray">Expert Team</div>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                <Zap className="h-8 w-8 text-electric-blue mx-auto mb-2" />
                <div className="text-sm font-semibold text-midnight-navy">Ready Now</div>
                <div className="text-xs text-cool-gray">Start Today</div>
              </div>
            </div>
          </div>

          {/* Enhanced Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-md rounded-2xl p-8 border border-white/50 shadow-card max-w-2xl mx-auto">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-coral-orange to-emerald-green text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Sparkles className="h-4 w-4" />
                  Limited Time: Professional Setup Included
                </div>
                <h3 className="text-2xl font-heading font-bold text-midnight-navy mb-2">
                  Transform Your Business Today
                </h3>
                <p className="text-cool-gray">
                  Join hundreds of businesses who've launched with our templates
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/templates">
                  <Button variant="hero" size="lg" className="group animate-float shadow-glow">
                    <Package className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    Browse All {totalTemplates} Templates
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="bg-white/70 hover:bg-white/90 border-royal-purple/30 text-royal-purple hover:text-royal-purple">
                    <Sparkles className="h-5 w-5" />
                    Get Custom Quote
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-cool-gray">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-emerald-green" />
                  <span>No Setup Fees</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-emerald-green" />
                  <span>Money Back Guarantee</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-emerald-green" />
                  <span>Free Updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTemplatesShowcase;