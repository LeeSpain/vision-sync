import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectCard from '@/components/ProjectCard';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { leadManager } from '@/utils/leadManager';
import { ArrowRight, Sparkles, Target, Zap, Building2, Bot, Brain, TrendingUp, Rocket } from 'lucide-react';

const Index = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const featuredProjects = [
    {
      title: 'Global Health-Sync',
      description: 'Revolutionary healthcare synchronization platform connecting patients, providers, and data globally.',
      status: 'MVP' as const,
      category: 'Investment' as const,
      route: '/global-health-sync',
      actions: { view: true },
    },
    {
      title: 'Nurse-Sync',
      description: 'Advanced nursing workflow management and patient care coordination system.',
      status: 'Live' as const,
      category: 'Investment' as const,
      route: '/nurse-sync',
      actions: { view: true },
    },
    {
      title: 'ICE-SOS Lite',
      description: 'Emergency contact and medical information system for immediate crisis response.',
      status: 'For Sale' as const,
      category: 'For Sale' as const,
      route: '/ice-sos-lite',
      actions: { view: true },
    },
  ];

  const platformsForSale = [
    {
      title: 'Tether-Band',
      description: 'Innovative connectivity solution for secure device-to-device communication.',
      status: 'Beta' as const,
      category: 'For Sale' as const,
      route: '/tether-band',
      actions: { view: true },
    },
    {
      title: 'CustomBuilds Platform',
      description: 'White-label e-commerce solution with advanced customization capabilities.',
      status: 'Live' as const,
      category: 'For Sale' as const,
      route: '/custom-builds',
      actions: { view: true },
    },
  ];

  const offTheShelf = [
    {
      title: 'ForSale Portal',
      description: 'Ready-to-deploy marketplace platform with built-in payment processing.',
      status: 'Live' as const,
      category: 'For Sale' as const,
      route: '/for-sale',
      actions: { view: true },
    },
    {
      title: 'AI Spain Homes',
      description: 'Complete real estate platform with AI-powered property matching.',
      status: 'Beta' as const,
      category: 'For Sale' as const,
      route: '/ai-spain-homes',
      actions: { view: true },
    },
  ];

  const internalTools = [
    {
      title: 'Conneqt-Central',
      description: 'Internal project management and team collaboration platform.',
      status: 'Private' as const,
      category: 'Internal' as const,
      route: '/conneqt-central',
      actions: { view: true },
    },
    {
      title: 'Analytics Dashboard',
      description: 'Comprehensive business intelligence and reporting suite.',
      status: 'Private' as const,
      category: 'Internal' as const,
      route: '/admin',
      actions: { view: true },
    },
  ];

  const investmentOps = [
    {
      title: 'ForInvestors Platform',
      description: 'Comprehensive investor relations and portfolio management system.',
      status: 'MVP' as const,
      category: 'Investment' as const,
      route: '/for-investors',
      actions: { view: true },
    },
    {
      title: 'VisionSync Capital',
      description: 'Strategic investment fund focused on innovative technology platforms.',
      status: 'Concept' as const,
      category: 'Investment' as const,
      route: '/for-investors',
      actions: { view: true },
    },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save lead to database
    leadManager.saveLead({
      source: 'contact',
      name: contactForm.name,
      email: contactForm.email,
      message: contactForm.message
    });
    
    // Show success message
    alert('Thank you for your message! We\'ll get back to you soon.');
    
    // Reset form
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-midnight-navy mb-6">
              Welcome to{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Vision-Sync
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-cool-gray mb-8 max-w-3xl mx-auto">
              Discover intelligent AI solutions designed to transform your business and streamline operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/ai-agents">
                <Button variant="hero" size="lg" className="animate-float">
                  <Sparkles className="h-5 w-5" />
                  Meet Your AI Agents
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="view" size="lg">
                  <Target className="h-5 w-5" />
                  Contact Us Today
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center animate-slide-up">
              <div className="w-16 h-16 bg-emerald-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-emerald-green" />
              </div>
              <h3 className="font-heading font-semibold text-midnight-navy mb-2">Built to Scale</h3>
              <p className="text-cool-gray">Enterprise-ready platforms designed for growth</p>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-royal-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-royal-purple" />
              </div>
              <h3 className="font-heading font-semibold text-midnight-navy mb-2">Innovation First</h3>
              <p className="text-cool-gray">Cutting-edge technology solutions</p>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-coral-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-coral-orange" />
              </div>
              <h3 className="font-heading font-semibold text-midnight-navy mb-2">Market Ready</h3>
              <p className="text-cool-gray">Validated concepts with proven potential</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Agents & The Future Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-midnight-navy/5 via-royal-purple/5 to-emerald-green/5 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-royal-purple/5 to-transparent"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-green/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-royal-purple/10 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-coral-orange/5 rounded-full blur-2xl"></div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-gradient-primary px-6 py-2 rounded-full text-white font-medium mb-6 animate-fade-in shadow-glow">
              <Sparkles className="h-4 w-4 animate-pulse" />
              The Future is Now
            </div>
            <h2 className="text-5xl md:text-6xl font-heading font-bold bg-gradient-to-r from-midnight-navy via-royal-purple to-emerald-green bg-clip-text text-transparent mb-6 animate-slide-up">
              AI Agents & The Future
            </h2>
            <p className="text-xl md:text-2xl text-cool-gray max-w-4xl mx-auto mb-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
              We're pioneering the next generation of intelligent automation
            </p>
            <p className="text-lg text-royal-purple font-medium animate-fade-in" style={{animationDelay: '0.3s'}}>
              Leading the way in AI innovation - Let us help you transform your business!
            </p>
          </div>

          {/* Enhanced AI Capabilities Layout with Avatar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-16">
            {/* Left Side - Avatar Showcase */}
            <div className="lg:col-span-1">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-slate-white to-soft-lilac/30 rounded-3xl p-6 shadow-elegant border border-soft-lilac/20 hover:shadow-glow transition-all duration-500">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-heading font-bold text-midnight-navy mb-2">Meet Your AI Agent</h3>
                    <p className="text-cool-gray">Professional, intelligent, available 24/7</p>
                  </div>
                  
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur opacity-20"></div>
                    <img 
                      src="/lovable-uploads/afb9cb1e-a617-48d7-b0bf-062beac34324.png"
                      alt="Professional AI Agent Representative"
                      className="relative w-full h-64 object-cover rounded-2xl shadow-card"
                    />
                    <div className="absolute top-4 right-4 w-4 h-4 bg-emerald-green rounded-full animate-pulse shadow-lg"></div>
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-emerald-green text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                      Online Now
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-cool-gray">
                      <div className="w-2 h-2 bg-emerald-green rounded-full"></div>
                      <span>Instant responses</span>
                    </div>
                    <div className="flex items-center gap-3 text-cool-gray">
                      <div className="w-2 h-2 bg-royal-purple rounded-full"></div>
                      <span>Context-aware conversations</span>
                    </div>
                    <div className="flex items-center gap-3 text-cool-gray">
                      <div className="w-2 h-2 bg-coral-orange rounded-full"></div>
                      <span>Multi-language support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Main Features */}
            <div className="lg:col-span-2 space-y-6">
              {/* Conversational Intelligence */}
              <div className="bg-gradient-to-br from-slate-white to-soft-lilac/30 rounded-3xl p-8 shadow-elegant border border-soft-lilac/20 hover:shadow-glow transition-all duration-500 group">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-card">
                      <Brain className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-heading font-bold text-midnight-navy mb-3 group-hover:text-royal-purple transition-colors">
                      Conversational Intelligence
                    </h3>
                    <p className="text-cool-gray leading-relaxed mb-4">
                      Advanced voice agents and conversational AI that understand context, emotion, and intent. Transform customer interactions with natural, intelligent dialogue systems that feel genuinely human.
                    </p>
                    <div className="flex items-center gap-2 text-royal-purple font-medium">
                      <Sparkles className="h-4 w-4" />
                      Next-gen Communication
                    </div>
                  </div>
                </div>
              </div>

              {/* Two-column sub-features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-emerald-green/10 to-emerald-green/5 rounded-2xl p-6 border border-emerald-green/20 hover:border-emerald-green/40 transition-all duration-300 group hover:shadow-card">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-emerald-green rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-sm">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-midnight-navy">Smart Automation</h3>
                  </div>
                  <p className="text-cool-gray leading-relaxed">
                    Intelligent process automation that learns, adapts, and optimizes workflows in real-time, reducing manual tasks by up to 90%.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-coral-orange/10 to-coral-orange/5 rounded-2xl p-6 border border-coral-orange/20 hover:border-coral-orange/40 transition-all duration-300 group hover:shadow-card">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-coral-orange rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-sm">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-midnight-navy">Predictive Analytics</h3>
                  </div>
                  <p className="text-cool-gray leading-relaxed">
                    AI-powered insights that forecast trends, predict outcomes, and drive strategic decisions with 95% accuracy.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Link to="/ai-agent-questionnaire">
              <Button variant="hero" size="lg" className="animate-float">
                <Bot className="h-5 w-5" />
                Get Your AI Agent Now
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Featured Projects */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-heading font-bold text-midnight-navy mb-4">🔥 Featured Projects</h2>
              <p className="text-xl text-cool-gray max-w-2xl mx-auto">Flagship platforms ready for investment and growth</p>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
                {featuredProjects.map((project, index) => (
                  <ProjectCard key={index} {...project} />
                ))}
              </div>
            </div>
          </div>

          {/* Platforms for Sale */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-heading font-bold text-midnight-navy mb-4">🛒 Platforms for Sale</h2>
              <p className="text-xl text-cool-gray max-w-2xl mx-auto">Complete solutions ready for immediate deployment and ownership transfer</p>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                {platformsForSale.map((project, index) => (
                  <ProjectCard key={index} {...project} />
                ))}
              </div>
            </div>
          </div>

          {/* Off the Shelf */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-heading font-bold text-midnight-navy mb-4">📦 Off the Shelf</h2>
              <p className="text-xl text-cool-gray max-w-2xl mx-auto">Ready-to-deploy solutions with minimal customization required</p>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                {offTheShelf.map((project, index) => (
                  <ProjectCard key={index} {...project} />
                ))}
              </div>
            </div>
          </div>

          {/* Internal Tools */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-heading font-bold text-midnight-navy mb-4">🧠 Internal Tools</h2>
              <p className="text-xl text-cool-gray max-w-2xl mx-auto">Proprietary systems powering our operations and workflows</p>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                {internalTools.map((project, index) => (
                  <ProjectCard key={index} {...project} />
                ))}
              </div>
            </div>
          </div>

          {/* Investment Ops */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-heading font-bold text-midnight-navy mb-4">💼 Investment Ops</h2>
              <p className="text-xl text-cool-gray max-w-2xl mx-auto">Strategic investment opportunities and financial partnerships</p>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                {investmentOps.map((project, index) => (
                  <ProjectCard key={index} {...project} />
                ))}
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
    </div>
  );
};

export default Index;
