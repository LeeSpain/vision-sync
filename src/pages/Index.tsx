import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectCard from '@/components/ProjectCard';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { ArrowRight, Sparkles, Target, Zap, Building2 } from 'lucide-react';

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
    // Handle form submission
    console.log('Contact form submitted:', contactForm);
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
              Explore what I've built, invest in innovation, or request a custom platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button variant="hero" size="lg" className="animate-float">
                <Sparkles className="h-5 w-5" />
                Explore Projects
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="view" size="lg">
                <Target className="h-5 w-5" />
                For Investors
              </Button>
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
