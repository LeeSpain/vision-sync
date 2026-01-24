import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectCard from '@/components/ProjectCard';
import ShopCard from '@/components/ShopCard';
import { FeaturedProjectsCarousel } from '@/components/FeaturedProjectsCarousel';
import EnhancedTemplatesShowcase from '@/components/EnhancedTemplatesShowcase';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import AiChatWidget from '@/components/chat/AiChatWidget';
import SEOHead from '@/components/SEOHead';
import { generateOrganizationSchema, generateWebPageSchema, generateFAQSchema } from '@/utils/structuredData';
import { supabaseLeadManager } from '@/utils/supabaseLeadManager';
import { projectManager, type Project } from '@/utils/projectManager';
import { ArrowRight, Sparkles, Target, Zap, Building2, Bot, Brain, TrendingUp, Rocket, Star, Package, CheckCircle } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { analytics } from '@/utils/analytics';
import heroImage from '@/assets/hero-ai-visualization.jpg';

const Index = () => {
  const { formatPrice } = useCurrency();
  const [isChatMinimized, setIsChatMinimized] = useState(true);
  // Clean build - template components moved to /templates page
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  // Project state - now loaded from database
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [platformsForSale, setPlatformsForSale] = useState<Project[]>([]);
  const [offTheShelf, setOffTheShelf] = useState<Project[]>([]);
  const [internalTools, setInternalTools] = useState<Project[]>([]);
  const [investmentOps, setInvestmentOps] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);


  // Load projects on component mount
  useEffect(() => {
    loadAllProjects();
  }, []);

  const loadAllProjects = async () => {
    try {
      setLoading(true);
      
      // Load projects by content section with new schema
      const featured = await projectManager.getProjectsByContentSection('featured');
      const fallbackFeatured = await projectManager.getFeaturedProjects();
      setFeaturedProjects(featured.length > 0 ? featured.slice(0, 3) : fallbackFeatured.slice(0, 3));
      
      const forSale = await projectManager.getProjectsByContentSection('platforms-for-sale');
      setPlatformsForSale(forSale);
      
      const offShelf = await projectManager.getProjectsByContentSection('off-the-shelf');
      setOffTheShelf(offShelf);
      
      const internal = await projectManager.getProjectsByContentSection('internal-tools');
      setInternalTools(internal);
      
      const investment = await projectManager.getProjectsByContentSection('investment-opportunities');
      setInvestmentOps(investment);
      
      console.log('Loaded projects:', { featured, fallbackFeatured, forSale, offShelf, internal, investment });
      
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Convert database project to ProjectCard format
  const convertToProjectCard = (project: Project) => {
    const slug = `/${(project.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    return {
      title: project.title,
      description: project.description || '',
      status: 'Live' as const,
      category: (project.category as any) || 'Featured',
      route: slug,
      image: project.image_url || undefined,
      billing_type: undefined,
      actions: { view: true },
    };
  };

  // Convert database project to ShopCard format
  const convertToShopCard = (project: Project) => {
    const slug = project.route || `/${(project.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    return {
      title: project.title,
      description: project.description || '',
      status: 'Live' as const,
      category: (project.category as any) || 'For Sale',
      route: slug,
      image: project.image_url || undefined,
      billing_type: project.billing_type as any,
      subscription_price: project.subscription_price || undefined,
      price: project.price || undefined,
      deposit_amount: project.deposit_amount || undefined,
      investmentAmount: project.investment_amount || undefined,
      fundingProgress: project.funding_progress || undefined,
      investorCount: project.investor_count || undefined,
    };
  };

  // Convert database project to FeaturedProjectsCarousel ProjectData
  const convertToCarouselProject = (project: Project) => {
    const slug = `/${(project.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    return {
      id: project.id,
      name: project.title,
      description: project.description || '',
      image_url: project.image_url || undefined,
      hero_image_url: undefined,
      status: 'Active',
      category: project.category || 'Featured',
      route: slug,
      billing_type: undefined,
      investment_amount: undefined,
      price: undefined,
      subscription_price: undefined,
      subscription_period: undefined,
      funding_progress: undefined,
      expected_roi: undefined,
      investment_deadline: undefined,
      investor_count: undefined,
      social_proof: undefined,
    };
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track form submission
    analytics.trackInteraction('form_submit', 'contact_form');
    
    try {
      // Save lead to database
      const result = await supabaseLeadManager.saveLead({
        source: 'contact',
        name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone,
        form_data: {
          message: contactForm.message
        }
      });
      
      // Track conversion
      analytics.trackConversion('interest', undefined, result.id);
      
      // Reset form
      setContactForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Vision-Sync | AI Agents, App Templates & Custom Software"
        description="Transform your business with AI agents and intelligent automation. 50+ ready-to-deploy templates, custom AI chatbots, and business automation solutions. Launch in 72 hours."
        keywords="AI agents, AI chatbots, app templates, conversational AI, business automation, AI customer service, custom software development, web applications, SaaS templates"
        canonical="https://vision-sync-forge.lovable.app/"
        ogImage="https://vision-sync-forge.lovable.app/lovable-uploads/afb9cb1e-a617-48d7-b0bf-062beac34324.png"
        structuredData={[
          generateOrganizationSchema(),
          generateWebPageSchema({
            name: "Vision-Sync Forge - AI Agents & Custom Software Development",
            description: "Leading provider of AI agents, chatbots, and intelligent automation solutions for businesses. Custom software development with cutting-edge AI technology.",
            url: "https://vision-sync-forge.lovable.app/"
          })
        ]}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-royal-purple/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-green/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Two Column Hero Layout */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-12">
            {/* Left: Content */}
            <div className="text-center lg:text-left animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-gradient-primary px-4 py-1.5 rounded-full text-white text-sm font-medium mb-5 shadow-glow animate-scale-in">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                AI-Powered Solutions
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-midnight-navy mb-5 leading-tight animate-slide-up">
                Transform Your Business with{' '}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Vision-Sync
                </span>
              </h1>
              
              <p className="text-base md:text-lg text-cool-gray mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in" style={{animationDelay: '0.2s'}}>
                Professional app templates, custom AI solutions, and complete platforms. 
                Launch in 72 hours with intelligent technology that scales.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center animate-fade-in" style={{animationDelay: '0.3s'}}>
                <Link to="/templates" onClick={() => analytics.trackInteraction('button_click', 'hero_cta_templates')}>
                  <Button variant="hero" size="lg" className="hover-scale shadow-glow">
                    <Package className="h-5 w-5" />
                    Explore Templates
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/contact" onClick={() => analytics.trackInteraction('button_click', 'hero_cta_contact')}>
                  <Button variant="view" size="lg" className="hover-scale">
                    <Target className="h-5 w-5" />
                    Get Custom Solution
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative animate-fade-in hidden lg:block" style={{animationDelay: '0.3s'}}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-soft-lilac/20">
                <img 
                  src={heroImage} 
                  alt="AI-powered digital transformation visualization"
                  className="w-full h-auto object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-royal-purple/10 via-transparent to-emerald-green/10"></div>
              </div>
              {/* Floating Stats Badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 animate-float border border-soft-lilac/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-green/10 rounded-lg flex items-center justify-center">
                    <Rocket className="h-4 w-4 text-emerald-green" />
                  </div>
                  <div>
                    <p className="text-xs text-cool-gray">Deploy in</p>
                    <p className="text-sm font-bold text-midnight-navy">72 Hours</p>
                  </div>
                </div>
              </div>
              {/* Floating AI Badge */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 animate-float border border-soft-lilac/20" style={{animationDelay: '1s'}}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-royal-purple/10 rounded-lg flex items-center justify-center">
                    <Bot className="h-4 w-4 text-royal-purple" />
                  </div>
                  <div>
                    <p className="text-xs text-cool-gray">Powered by</p>
                    <p className="text-sm font-bold text-midnight-navy">AI Agents</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Key Features Strip */}
          <div className="flex flex-wrap justify-center gap-3 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-soft-lilac/30 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all group">
              <div className="w-7 h-7 bg-gradient-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Rocket className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-medium text-midnight-navy">72hr Deploy</span>
            </div>

            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-soft-lilac/30 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all group">
              <div className="w-7 h-7 bg-emerald-green/15 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bot className="h-3.5 w-3.5 text-emerald-green" />
              </div>
              <span className="text-sm font-medium text-midnight-navy">AI-Powered</span>
            </div>

            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-soft-lilac/30 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all group">
              <div className="w-7 h-7 bg-coral-orange/15 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="h-3.5 w-3.5 text-coral-orange" />
              </div>
              <span className="text-sm font-medium text-midnight-navy">Enterprise Scale</span>
            </div>

            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-soft-lilac/30 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all group">
              <div className="w-7 h-7 bg-electric-blue/15 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package className="h-3.5 w-3.5 text-electric-blue" />
              </div>
              <span className="text-sm font-medium text-midnight-navy">50+ Templates</span>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Featured Projects Carousel */}
          <div className="mb-32">
            <FeaturedProjectsCarousel 
              projects={featuredProjects.map(convertToCarouselProject)} 
              loading={loading}
            />
          </div>

          {/* Enhanced Templates Showcase */}
          <EnhancedTemplatesShowcase />

          {/* Platforms for Sale */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-heading font-bold text-midnight-navy mb-4">🛒 Platforms for Sale</h2>
              <p className="text-xl text-cool-gray max-w-2xl mx-auto">Complete solutions ready for immediate deployment and ownership transfer</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="h-56 bg-slate-white/50 rounded-xl animate-pulse"></div>
                ))
              ) : (
                platformsForSale.map((project, index) => (
                  <ShopCard key={project.id || index} {...convertToShopCard(project)} />
                ))
              )}
            </div>
          </div>

          {/* Internal Tools */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-heading font-bold text-midnight-navy mb-4">🧠 Internal Tools</h2>
              <p className="text-xl text-cool-gray max-w-2xl mx-auto">Proprietary systems powering our operations and workflows</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="h-56 bg-slate-white/50 rounded-xl animate-pulse"></div>
                ))
              ) : (
                internalTools.map((project, index) => (
                  <ShopCard key={project.id || index} {...convertToShopCard(project)} />
                ))
              )}
            </div>
          </div>

          {/* Investment Ops */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-heading font-bold text-midnight-navy mb-4">💼 Investment Ops</h2>
              <p className="text-xl text-cool-gray max-w-2xl mx-auto">Strategic investment opportunities and financial partnerships</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="h-56 bg-slate-white/50 rounded-xl animate-pulse"></div>
                ))
              ) : (
                investmentOps.map((project, index) => (
                  <ShopCard key={project.id || index} {...convertToShopCard(project)} />
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* AI Agents & The Future Section */}
      <section className="relative py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-midnight-navy via-midnight-navy/95 to-royal-purple/90 overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-royal-purple/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-green/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-coral-orange/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto">
          {/* Compact Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-emerald-green text-sm font-medium mb-3">
                <Sparkles className="h-3 w-3" />
                The Future is Now
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
                AI Agents & Automation
              </h2>
              <p className="text-white/70 max-w-xl">
                Next-generation intelligent automation that transforms how you work
              </p>
            </div>
            <Link to="/ai-agent-questionnaire">
              <Button variant="hero" size="default" className="shadow-glow whitespace-nowrap">
                <Bot className="h-4 w-4" />
                Get Your AI Agent
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Compact Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* AI Agent Card */}
            <div className="lg:row-span-2 bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all group">
              <div className="relative mb-4">
                <img 
                  src="/lovable-uploads/afb9cb1e-a617-48d7-b0bf-062beac34324.png"
                  alt="AI Agent"
                  className="w-full h-40 object-cover rounded-xl"
                />
                <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-emerald-green/90 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  Online
                </div>
              </div>
              <h3 className="text-lg font-heading font-semibold text-white mb-2">Your AI Agent</h3>
              <p className="text-white/60 text-sm mb-3">24/7 intelligent assistance</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-white/70 text-xs">
                  <CheckCircle className="h-3 w-3 text-emerald-green" />
                  Instant responses
                </div>
                <div className="flex items-center gap-2 text-white/70 text-xs">
                  <CheckCircle className="h-3 w-3 text-emerald-green" />
                  Context-aware
                </div>
                <div className="flex items-center gap-2 text-white/70 text-xs">
                  <CheckCircle className="h-3 w-3 text-emerald-green" />
                  Multi-language
                </div>
              </div>
            </div>

            {/* Conversational Intelligence */}
            <div className="bg-gradient-to-br from-royal-purple/30 to-royal-purple/10 backdrop-blur-sm rounded-2xl p-5 border border-royal-purple/20 hover:border-royal-purple/40 transition-all group">
              <div className="w-10 h-10 bg-royal-purple rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-base font-heading font-semibold text-white mb-1.5">Conversational AI</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Natural dialogue systems that understand context and emotion
              </p>
            </div>

            {/* Smart Automation */}
            <div className="bg-gradient-to-br from-emerald-green/30 to-emerald-green/10 backdrop-blur-sm rounded-2xl p-5 border border-emerald-green/20 hover:border-emerald-green/40 transition-all group">
              <div className="w-10 h-10 bg-emerald-green rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-base font-heading font-semibold text-white mb-1.5">Smart Automation</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Workflows that learn and adapt, reducing manual tasks by 90%
              </p>
            </div>

            {/* Predictive Analytics */}
            <div className="bg-gradient-to-br from-coral-orange/30 to-coral-orange/10 backdrop-blur-sm rounded-2xl p-5 border border-coral-orange/20 hover:border-coral-orange/40 transition-all group">
              <div className="w-10 h-10 bg-coral-orange rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-base font-heading font-semibold text-white mb-1.5">Predictive Analytics</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                AI insights that forecast trends with 95% accuracy
              </p>
            </div>

            {/* Voice Agents */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all group">
              <div className="w-10 h-10 bg-electric-blue rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-base font-heading font-semibold text-white mb-1.5">Voice Agents</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Real-time voice AI for seamless customer interactions
              </p>
            </div>

            {/* Custom Integration */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all group">
              <div className="w-10 h-10 bg-soft-lilac rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Target className="h-5 w-5 text-midnight-navy" />
              </div>
              <h3 className="text-base font-heading font-semibold text-white mb-1.5">Custom Integration</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Tailored AI solutions that fit your existing systems
              </p>
            </div>
          </div>

          {/* Stats Strip */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">90%</div>
                <div className="text-xs text-white/50">Task Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-xs text-white/50">Availability</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">95%</div>
                <div className="text-xs text-white/50">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">&lt;1s</div>
                <div className="text-xs text-white/50">Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-soft-lilac/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold text-midnight-navy mb-4">
              Ready to Sync Your Vision?
            </h2>
            <p className="text-xl text-cool-gray">
              Get in touch to discuss investment opportunities, purchases, or custom builds.
            </p>
          </div>

          <Card className="bg-slate-white shadow-card">
            <CardHeader>
              <CardTitle className="text-center font-heading">Contact Us</CardTitle>
              <CardDescription className="text-center">
                Let's discuss how we can work together
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-midnight-navy mb-2">
                      Name
                    </label>
                    <Input
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-midnight-navy mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-midnight-navy mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-midnight-navy mb-2">
                    Message
                  </label>
                  <Textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Tell us about your interests..."
                    rows={4}
                    required
                  />
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full">
                  Send Message
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
      
      {/* AI Chat Widget */}
      <AiChatWidget 
        isMinimized={isChatMinimized}
        onToggleMinimize={() => setIsChatMinimized(!isChatMinimized)}
      />
    </div>
  );
};

export default Index;
