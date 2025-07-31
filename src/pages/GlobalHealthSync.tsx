import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { ArrowRight, Users, Shield, Globe, TrendingUp, Eye, ExternalLink } from 'lucide-react';

const GlobalHealthSync = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-electric-blue text-white mb-4">MVP</Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-midnight-navy mb-6">
            Global Health-Sync
          </h1>
          <p className="text-xl text-cool-gray mb-8 max-w-2xl mx-auto">
            Revolutionary healthcare synchronization platform connecting patients, providers, and data globally for seamless healthcare delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="view" size="lg">
              <Eye className="h-5 w-5" />
              View Demo
            </Button>
            <Button variant="invest" size="lg">
              <TrendingUp className="h-5 w-5" />
              Investment Info
            </Button>
            <Button variant="outline" size="lg">
              <ExternalLink className="h-5 w-5" />
              Contact for More
            </Button>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-midnight-navy mb-6">
                Transforming Global Healthcare
              </h2>
              <p className="text-cool-gray mb-6 leading-relaxed">
                Global Health-Sync is a comprehensive platform that synchronizes healthcare data, workflows, and communications across different healthcare systems worldwide. Our innovative approach breaks down silos and creates a unified ecosystem for better patient outcomes.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-green/10 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-emerald-green rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-midnight-navy">Real-time Synchronization</h4>
                    <p className="text-cool-gray text-sm">Instant updates across all connected healthcare systems</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-green/10 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-emerald-green rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-midnight-navy">Global Interoperability</h4>
                    <p className="text-cool-gray text-sm">Seamless integration with international healthcare standards</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-green/10 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-emerald-green rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-midnight-navy">Advanced Analytics</h4>
                    <p className="text-cool-gray text-sm">AI-powered insights for better healthcare decisions</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-card rounded-2xl p-8 shadow-card">
              <div className="aspect-video bg-gradient-hero rounded-xl flex items-center justify-center mb-6">
                <Globe className="h-20 w-20 text-royal-purple/30" />
              </div>
              <h3 className="font-heading font-semibold text-midnight-navy mb-2">Platform Highlights</h3>
              <ul className="space-y-2 text-cool-gray">
                <li>• Multi-language support</li>
                <li>• HIPAA & GDPR compliant</li>
                <li>• 99.9% uptime guarantee</li>
                <li>• Mobile-first design</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-soft-lilac/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-midnight-navy mb-4">
              Core Features
            </h2>
            <p className="text-cool-gray max-w-2xl mx-auto">
              Designed for healthcare professionals who need seamless, secure, and scalable solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-slate-white shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-green/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-emerald-green" />
                </div>
                <CardTitle className="font-heading">Patient Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive patient profiles with real-time health data synchronization across all care providers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-white shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-royal-purple/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-royal-purple" />
                </div>
                <CardTitle className="font-heading">Security & Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Enterprise-grade security with multi-layer encryption and compliance with global healthcare regulations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-white shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-electric-blue/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-electric-blue" />
                </div>
                <CardTitle className="font-heading">Global Network</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect with healthcare systems worldwide through our standardized API and integration protocols.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Investment Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold text-midnight-navy mb-6">
            Investment Opportunity
          </h2>
          <p className="text-xl text-cool-gray mb-8">
            Join us in revolutionizing global healthcare connectivity. Early investment opportunity available for strategic partners.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-green mb-2">$2.5M</div>
              <div className="text-cool-gray">Market Opportunity</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-royal-purple mb-2">50+</div>
              <div className="text-cool-gray">Healthcare Partners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-coral-orange mb-2">18mo</div>
              <div className="text-cool-gray">Development Timeline</div>
            </div>
          </div>
          <Button variant="invest" size="lg">
            <TrendingUp className="h-5 w-5" />
            Request Investment Details
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GlobalHealthSync;