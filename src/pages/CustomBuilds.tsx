import { useState } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/SEOHead';
import { generateOrganizationSchema, generateWebPageSchema, generateServiceSchema } from '@/utils/structuredData';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { supabaseLeadManager } from '@/utils/supabaseLeadManager';
import { ArrowRight, Code, Smartphone, Globe, Database, Zap, Shield, Users, DollarSign } from 'lucide-react';

const CustomBuilds = () => {
  const { formatPrice } = useCurrency();
  const [projectForm, setProjectForm] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
    features: [] as string[],
    urgency: '',
  });

  const handleFeatureChange = (feature: string, checked: boolean) => {
    if (checked) {
      setProjectForm({ 
        ...projectForm, 
        features: [...projectForm.features, feature] 
      });
    } else {
      setProjectForm({ 
        ...projectForm, 
        features: projectForm.features.filter(f => f !== feature) 
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Save lead to database
      await supabaseLeadManager.saveLead({
        source: 'custom-build',
        name: projectForm.name,
        email: projectForm.email,
        company: projectForm.company,
        form_data: {
          projectType: projectForm.projectType,
          budget: projectForm.budget,
          timeline: projectForm.timeline,
          features: projectForm.features,
          urgency: projectForm.urgency,
          description: projectForm.description
        }
      });
      
      // Reset form
      setProjectForm({
        name: '',
        email: '',
        company: '',
        projectType: '',
        budget: '',
        timeline: '',
        description: '',
        features: [],
        urgency: '',
      });
    } catch (error) {
      console.error('Error submitting custom build request:', error);
    }
  };

  const serviceCategories = [
    {
      title: 'Web Applications',
      description: 'Custom web platforms and SaaS solutions',
      icon: Globe,
      features: ['React/Vue.js', 'Node.js Backend', 'Database Design', 'API Development']
    },
    {
      title: 'Mobile Apps',
      description: 'Native iOS and Android applications',
      icon: Smartphone,
      features: ['iOS (Swift)', 'Android (Kotlin)', 'React Native', 'Flutter']
    },
    {
      title: 'Enterprise Systems',
      description: 'Large-scale business automation',
      icon: Database,
      features: ['ERP Systems', 'CRM Platforms', 'Workflow Automation', 'Data Analytics']
    },
    {
      title: 'AI/ML Solutions',
      description: 'Artificial intelligence implementations',
      icon: Zap,
      features: ['Machine Learning', 'Natural Language Processing', 'Computer Vision', 'Predictive Analytics']
    }
  ];

  const availableFeatures = [
    'User Authentication',
    'Payment Processing',
    'Real-time Chat',
    'File Upload/Storage',
    'Push Notifications',
    'Analytics Dashboard',
    'API Integration',
    'Mobile Responsive',
    'Admin Panel',
    'Reporting System',
    'Email Automation',
    'Multi-language Support'
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Custom Software Development | Enterprise Solutions - Vision-Sync Forge"
        description="Transform your vision into reality with custom-built web applications, mobile apps, and enterprise systems. Expert development team specializing in React, Node.js, AI/ML, and cloud solutions."
        keywords="custom software development, web application development, mobile app development, enterprise software, custom CRM, custom ERP, bespoke software solutions"
        canonical="https://vision-sync-forge.lovable.app/custom-builds"
        ogImage="https://vision-sync-forge.lovable.app/favicon.png"
        structuredData={[
          generateOrganizationSchema(),
          generateWebPageSchema({
            name: "Custom Build Projects - Vision-Sync Forge",
            description: "Custom software development services for web, mobile, and enterprise applications",
            url: "https://vision-sync-forge.lovable.app/custom-builds"
          }),
          generateServiceSchema({
            name: "Custom Software Development",
            description: "End-to-end custom software development from concept to deployment, including web apps, mobile apps, and enterprise systems",
            serviceType: "Software Development"
          })
        ]}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-midnight-navy mb-6">
            Custom Build Projects
          </h1>
          <p className="text-xl text-cool-gray mb-8 max-w-2xl mx-auto">
            Transform your vision into reality with custom-built platforms, applications, and digital solutions tailored to your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg">
              <Code className="h-5 w-5" />
              Start Your Project
            </Button>
            <Button variant="outline" size="lg">
              <Users className="h-5 w-5" />
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Our Expertise */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-midnight-navy mb-4">
              Our Development Expertise
            </h2>
            <p className="text-cool-gray max-w-2xl mx-auto">
              From concept to deployment, we build innovative solutions across all platforms and technologies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {serviceCategories.map((category, index) => (
              <Card key={index} className="bg-gradient-card shadow-card border-soft-lilac/30 hover:shadow-hover transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-royal-purple/10 rounded-lg flex items-center justify-center mb-4">
                    <category.icon className="h-6 w-6 text-royal-purple" />
                  </div>
                  <CardTitle className="font-heading">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {category.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-green rounded-full"></div>
                        <span className="text-cool-gray text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-soft-lilac/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-midnight-navy mb-4">
              Why Choose Vision-Sync for Custom Development?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-emerald-green" />
              </div>
              <h3 className="font-heading font-semibold text-midnight-navy mb-2">Rapid Prototyping</h3>
              <p className="text-cool-gray">Quick MVP development to validate your concept and get to market faster</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-royal-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-royal-purple" />
              </div>
              <h3 className="font-heading font-semibold text-midnight-navy mb-2">Enterprise Grade</h3>
              <p className="text-cool-gray">Scalable, secure solutions built with enterprise-level architecture and best practices</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-electric-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-electric-blue" />
              </div>
              <h3 className="font-heading font-semibold text-midnight-navy mb-2">Dedicated Team</h3>
              <p className="text-cool-gray">Experienced developers, designers, and project managers focused on your success</p>
            </div>
          </div>
        </div>
      </section>

      {/* Project Request Form */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-midnight-navy mb-4">
              Start Your Custom Project
            </h2>
            <p className="text-xl text-cool-gray">
              Tell us about your vision and we'll provide a detailed proposal with timeline and pricing.
            </p>
          </div>

          <Card className="bg-slate-white shadow-card">
            <CardHeader>
              <CardTitle className="text-center font-heading">Project Request Form</CardTitle>
              <CardDescription className="text-center">
                Provide as much detail as possible to help us understand your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-midnight-navy mb-2">
                      Full Name *
                    </label>
                    <Input
                      value={projectForm.name}
                      onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-midnight-navy mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={projectForm.email}
                      onChange={(e) => setProjectForm({ ...projectForm, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-midnight-navy mb-2">
                    Company/Organization
                  </label>
                  <Input
                    value={projectForm.company}
                    onChange={(e) => setProjectForm({ ...projectForm, company: e.target.value })}
                    placeholder="Your company name"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-midnight-navy mb-2">
                      Project Type *
                    </label>
                    <Select onValueChange={(value) => setProjectForm({ ...projectForm, projectType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web-app">Web Application</SelectItem>
                        <SelectItem value="mobile-app">Mobile App</SelectItem>
                        <SelectItem value="enterprise-system">Enterprise System</SelectItem>
                        <SelectItem value="ai-ml">AI/ML Solution</SelectItem>
                        <SelectItem value="ecommerce">E-commerce Platform</SelectItem>
                        <SelectItem value="cms">Content Management</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-midnight-navy mb-2">
                      Budget Range *
                    </label>
                    <Select onValueChange={(value) => setProjectForm({ ...projectForm, budget: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-25k">Under {formatPrice(25000)}</SelectItem>
                        <SelectItem value="25k-50k">{formatPrice(25000)} - {formatPrice(50000)}</SelectItem>
                        <SelectItem value="50k-100k">{formatPrice(50000)} - {formatPrice(100000)}</SelectItem>
                        <SelectItem value="100k-250k">{formatPrice(100000)} - {formatPrice(250000)}</SelectItem>
                        <SelectItem value="over-250k">Over {formatPrice(250000)}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-midnight-navy mb-2">
                      Desired Timeline *
                    </label>
                    <Select onValueChange={(value) => setProjectForm({ ...projectForm, timeline: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Project timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-3-months">1-3 months</SelectItem>
                        <SelectItem value="3-6-months">3-6 months</SelectItem>
                        <SelectItem value="6-12-months">6-12 months</SelectItem>
                        <SelectItem value="over-12-months">12+ months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-midnight-navy mb-2">
                      Project Urgency
                    </label>
                    <Select onValueChange={(value) => setProjectForm({ ...projectForm, urgency: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="How urgent?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Planning phase</SelectItem>
                        <SelectItem value="medium">Medium - Ready to start</SelectItem>
                        <SelectItem value="high">High - Need to start ASAP</SelectItem>
                        <SelectItem value="critical">Critical - Emergency project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-midnight-navy mb-4">
                    Required Features (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {availableFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature}
                          checked={projectForm.features.includes(feature)}
                          onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
                        />
                        <label htmlFor={feature} className="text-sm text-cool-gray">
                          {feature}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-midnight-navy mb-2">
                    Project Description *
                  </label>
                  <Textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    placeholder="Describe your project in detail. What problem are you solving? Who are your users? What are your specific requirements?"
                    rows={6}
                    required
                  />
                </div>
                
                <Button type="submit" variant="hero" size="lg" className="w-full">
                  <DollarSign className="h-5 w-5" />
                  Submit Project Request
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-soft-lilac/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-midnight-navy mb-4">
              Our Development Process
            </h2>
            <p className="text-cool-gray">
              Transparent, collaborative approach from concept to deployment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-electric-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-electric-blue font-bold">1</span>
              </div>
              <h3 className="font-heading font-semibold text-midnight-navy mb-2">Discovery</h3>
              <p className="text-cool-gray text-sm">Requirements gathering and project planning</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-royal-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-royal-purple font-bold">2</span>
              </div>
              <h3 className="font-heading font-semibold text-midnight-navy mb-2">Design</h3>
              <p className="text-cool-gray text-sm">UI/UX design and architecture planning</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-emerald-green font-bold">3</span>
              </div>
              <h3 className="font-heading font-semibold text-midnight-navy mb-2">Development</h3>
              <p className="text-cool-gray text-sm">Agile development with regular updates</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-coral-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-coral-orange font-bold">4</span>
              </div>
              <h3 className="font-heading font-semibold text-midnight-navy mb-2">Launch</h3>
              <p className="text-cool-gray text-sm">Testing, deployment, and ongoing support</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CustomBuilds;