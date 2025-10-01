import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { ProfessionalProjectCard } from './ProfessionalProjectCard';
import Autoplay from 'embla-carousel-autoplay';
import { Sparkles, Globe } from 'lucide-react';
import { analytics } from '@/utils/analytics';

interface ProjectData {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  hero_image_url?: string;
  status: string;
  category: string;
  route?: string;
  billing_type?: string;
  investment_amount?: number;
  price?: number;
  subscription_price?: number;
  subscription_period?: string;
  funding_progress?: number;
  expected_roi?: number;
  investment_deadline?: string;
  investor_count?: number;
  social_proof?: string;
}

interface FeaturedProjectsCarouselProps {
  projects: ProjectData[];
  loading?: boolean;
}

export const FeaturedProjectsCarousel: React.FC<FeaturedProjectsCarouselProps> = ({
  projects,
  loading = false
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Auto-play plugin with slower speed for smooth movement
  const autoplay = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      const newIndex = api.selectedScrollSnap();
      setCurrent(newIndex + 1);
      
      // Track carousel interaction
      if (projects[newIndex]) {
        analytics.trackInteraction('button_click', 'featured_projects_carousel', projects[newIndex].id);
      }
    });
  }, [api, projects]);

  const convertToProjectCard = (project: ProjectData) => {
    return {
      id: project.id,
      title: project.name,
      description: project.description,
      image: project.image_url || project.hero_image_url,
      status: project.status,
      category: project.category,
      route: project.route,
    };
  };

  const generatePricing = (category: string) => {
    const ranges = {
      'ai-tools': ['$2,500', '$5,000', '$7,500', '$10,000'],
      'platforms': ['$15,000', '$25,000', '$35,000', '$50,000'],
      'investment': ['$50,000', '$100,000', '$250,000', '$500,000'],
      'default': ['$5,000', '$10,000', '$15,000', '$25,000']
    };
    
    const categoryKey = category.toLowerCase().includes('ai') ? 'ai-tools' :
                       category.toLowerCase().includes('platform') ? 'platforms' :
                       category.toLowerCase().includes('investment') ? 'investment' : 'default';
    
    const prices = ranges[categoryKey];
    return `Starting at ${prices[Math.floor(Math.random() * prices.length)]}`;
  };

  const generateROI = () => {
    const ranges = ['15-25%', '20-35%', '25-40%', '30-50%', '35-60%'];
    return ranges[Math.floor(Math.random() * ranges.length)];
  };

  const generateTimeLeft = () => {
    const options = ['2 days', '3 days', '5 days', '1 week', '2 weeks'];
    return options[Math.floor(Math.random() * options.length)];
  };

  if (loading) {
    return (
      <div className="relative">
        {/* Loading Header */}
        <div className="text-center mb-12">
          <div className="h-10 bg-slate-white/50 rounded mx-auto mb-4 w-80 animate-pulse"></div>
          <div className="h-6 bg-slate-white/30 rounded mx-auto w-96 animate-pulse"></div>
        </div>
        
        {/* Loading Carousel */}
        <div className="flex gap-6 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="flex-shrink-0 w-80 h-96 animate-pulse">
              <div className="h-48 bg-slate-white/50 rounded-t-xl"></div>
              <div className="p-6 space-y-3">
                <div className="h-4 bg-slate-white/50 rounded w-3/4"></div>
                <div className="h-4 bg-slate-white/30 rounded w-1/2"></div>
                <div className="h-6 bg-slate-white/50 rounded w-full"></div>
                <div className="h-2 bg-slate-white/30 rounded w-full"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-slate-white/50 rounded flex-1"></div>
                  <div className="h-8 bg-slate-white/50 rounded flex-1"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Enhanced Header */}
      <div className="text-center mb-16 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-royal-purple/5 to-transparent"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-emerald-green/10 rounded-full blur-xl animate-float"></div>
        
        <div className="relative z-10">
          {/* Professional Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-primary px-6 py-2 rounded-full text-white font-medium mb-6 animate-fade-in shadow-glow">
            <Globe className="h-4 w-4" />
            Featured Websites
          </div>
          
          <h2 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-midnight-navy via-royal-purple to-emerald-green bg-clip-text text-transparent mb-6 animate-slide-up">
            Our Latest Projects
          </h2>
          
          <p className="text-lg md:text-xl text-cool-gray max-w-3xl mx-auto animate-fade-in">
            Explore our portfolio of professional websites and applications
          </p>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative px-4">
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          plugins={[autoplay.current]}
          className="w-full max-w-7xl mx-auto"
          setApi={setApi}
        >
          <CarouselContent className="-ml-6">
            {projects.map((project, index) => (
              <CarouselItem key={project.id || index} className="pl-6 basis-full md:basis-1/2 lg:basis-1/3">
                <div className="transform transition-all duration-300">
                  <ProfessionalProjectCard {...convertToProjectCard(project)} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Custom Navigation */}
          <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 bg-gradient-primary text-white border-none hover:bg-gradient-primary/80 shadow-lg h-12 w-12" />
          <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 bg-gradient-primary text-white border-none hover:bg-gradient-primary/80 shadow-lg h-12 w-12" />
        </Carousel>

        {/* Carousel Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === current - 1
                  ? 'bg-gradient-primary shadow-glow'
                  : 'bg-cool-gray/30 hover:bg-cool-gray/50'
              }`}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute top-20 right-10 w-40 h-40 bg-royal-purple/10 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-coral-orange/10 rounded-full blur-xl animate-float" style={{animationDelay: '4s'}}></div>
    </div>
  );
};