import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { DollarSign, ShoppingCart, Download, ArrowRight, CheckCircle, Shield, Headphones } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { useBudgetOptions } from '@/utils/budgetOptions';

const ForSale = () => {
  const { formatPrice } = useCurrency();
  const { forSale: budgetOptions } = useBudgetOptions();
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    company: '',
    platform: '',
    budget: '',
    timeline: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Purchase inquiry submitted:', inquiryForm);
    // Reset form
    setInquiryForm({
      name: '',
      email: '',
      company: '',
      platform: '',
      budget: '',
      timeline: '',
      message: '',
    });
  };

  const platformsForSale = [
    {
      title: 'ICE-SOS Lite',
      description: 'Emergency contact and medical information system',
      price: formatPrice(75000),
      stage: 'For Sale',
      users: '500+ Beta Users',
      rating: '4.8★',
      features: [
        'Complete source code',
        'Mobile apps (iOS/Android)',
        'Admin dashboard',
        'Documentation',
        'Deployment support',
        '30-day support included'
      ]
    },
    {
      title: 'Tether-Band',
      description: 'Secure device-to-device connectivity solution',
      price: formatPrice(150000),
      stage: 'Beta License',
      users: 'Early Access',
      rating: 'In Development',
      features: [
        'Beta technology access',
        'Development SDK',
        'Technical documentation',
        '6-month dev support',
        'Customization options',
        'Production license path'
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-midnight-navy mb-6">
            Platforms for Sale
          </h1>
          <p className="text-xl text-cool-gray mb-8 max-w-2xl mx-auto">
            Complete, ready-to-deploy platforms with full source code, documentation, and support. Start your business with proven solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="buy" size="lg">
              <ShoppingCart className="h-5 w-5" />
              Browse Platforms
            </Button>
            <Button variant="outline" size="lg">
              <Download className="h-5 w-5" />
              Download Catalog
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Our Platforms */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-midnight-navy mb-4">
              Why Choose Vision-Sync Platforms?
            </h2>
            <p className="text-cool-gray max-w-2xl mx-auto">
              Proven, market-tested solutions ready for immediate deployment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-card shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-green/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-emerald-green" />
                </div>
                <CardTitle className="font-heading">Battle-Tested</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  All platforms have been tested with real users and proven in live environments with measurable results.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-royal-purple/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-royal-purple" />
                </div>
                <CardTitle className="font-heading">Complete Package</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Full source code, documentation, deployment guides, and ongoing support to ensure successful implementation.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-electric-blue/10 rounded-lg flex items-center justify-center mb-4">
                  <Headphones className="h-6 w-6 text-electric-blue" />
                </div>
                <CardTitle className="font-heading">Ongoing Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive support packages available with training, customization, and maintenance options.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platforms for Sale */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-soft-lilac/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-midnight-navy mb-4">
              Available Platforms
            </h2>
            <p className="text-cool-gray">
              Ready-to-deploy solutions for immediate business launch.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {platformsForSale.map((platform, index) => (
              <Card key={index} className="bg-slate-white shadow-card border-soft-lilac/30">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="bg-coral-orange text-white">{platform.stage}</Badge>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-midnight-navy">{platform.price}</div>
                      <div className="text-sm text-cool-gray">One-time license</div>
                    </div>
                  </div>
                  <CardTitle className="font-heading text-xl">{platform.title}</CardTitle>
                  <CardDescription className="text-base">{platform.description}</CardDescription>
                  <div className="flex items-center space-x-4 text-sm text-cool-gray mt-2">
                    <span>{platform.users}</span>
                    <span>•</span>
                    <span>{platform.rating}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-midnight-navy mb-2">What's Included:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {platform.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-emerald-green flex-shrink-0" />
                          <span className="text-cool-gray text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <Button variant="buy" className="flex-1">
                      <DollarSign className="h-4 w-4" />
                      Purchase Now
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4" />
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Purchase Inquiry Form */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-midnight-navy mb-4">
              Purchase Inquiry
            </h2>
            <p className="text-xl text-cool-gray">
              Get detailed information about pricing, customization options, and deployment support.
            </p>
          </div>

          <Card className="bg-slate-white shadow-card">
            <CardHeader>
              <CardTitle className="text-center font-heading">Request Platform Information</CardTitle>
              <CardDescription className="text-center">
                Tell us about your needs and we'll provide a customized proposal
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
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
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
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-midnight-navy mb-2">
                      Company
                    </label>
                    <Input
                      value={inquiryForm.company}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, company: e.target.value })}
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-midnight-navy mb-2">
                      Platform of Interest
                    </label>
                    <Select onValueChange={(value) => setInquiryForm({ ...inquiryForm, platform: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ice-sos-lite">ICE-SOS Lite</SelectItem>
                        <SelectItem value="tether-band">Tether-Band</SelectItem>
                        <SelectItem value="multiple">Multiple Platforms</SelectItem>
                        <SelectItem value="custom">Custom Package</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-midnight-navy mb-2">
                      Budget Range
                    </label>
                    <Select onValueChange={(value) => setInquiryForm({ ...inquiryForm, budget: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetOptions.map((budget, index) => (
                          <SelectItem key={index} value={budget.toLowerCase().replace(/[^a-z0-9]/g, '-')}>
                            {budget}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-midnight-navy mb-2">
                      Timeline
                    </label>
                    <Select onValueChange={(value) => setInquiryForm({ ...inquiryForm, timeline: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Implementation timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="1-3-months">1-3 months</SelectItem>
                        <SelectItem value="3-6-months">3-6 months</SelectItem>
                        <SelectItem value="6-plus-months">6+ months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-midnight-navy mb-2">
                    Additional Requirements
                  </label>
                  <Textarea
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    placeholder="Tell us about your specific needs, customization requirements, or questions..."
                    rows={4}
                  />
                </div>
                
                <Button type="submit" variant="buy" size="lg" className="w-full">
                  <ShoppingCart className="h-5 w-5" />
                  Submit Purchase Inquiry
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

export default ForSale;