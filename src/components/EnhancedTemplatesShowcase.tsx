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

        </div>
      </div>
    </div>
  );
};

export default EnhancedTemplatesShowcase;