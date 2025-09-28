import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { ArrowRight, Shield, Smartphone, AlertTriangle, TrendingUp, Eye, ExternalLink, Users, Heart, MapPin } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

const IceSosLite = () => {
  const { formatPrice } = useCurrency();
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-emerald-green text-white mb-4">Live</Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-midnight-navy mb-6">
            ICE-SOS Lite
          </h1>
          <p className="text-xl text-cool-gray mb-8 max-w-2xl mx-auto">
            Critical emergency information platform providing instant access to medical data, emergency contacts, and vital information when it matters most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="view" size="lg" asChild>
              <a href="https://icesoslite.com" target="_blank" rel="noopener noreferrer">
                <Eye className="h-5 w-5" />
                View Live Platform
              </a>
            </Button>
            <Button variant="invest" size="lg">
              <TrendingUp className="h-5 w-5" />
              Purchase Info
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://icesoslite.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-5 w-5" />
                Request Demo
              </a>
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
                Critical Information Access
              </h2>
              <p className="text-cool-gray mb-6 leading-relaxed">
                ICE-SOS Lite provides emergency responders, medical personnel, and family members with instant access to critical health information, emergency contacts, and vital medical data when traditional communication fails.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-green/10 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-emerald-green rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-midnight-navy">Emergency Access</h4>
                    <p className="text-cool-gray text-sm">Instant access to medical information without passwords or login requirements</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-green/10 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-emerald-green rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-midnight-navy">Privacy Protected</h4>
                    <p className="text-cool-gray text-sm">Secure data storage with controlled access levels and privacy safeguards</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-green/10 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-emerald-green rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-midnight-navy">Family Notification</h4>
                    <p className="text-cool-gray text-sm">Automated emergency contact alerts and real-time status updates</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-card rounded-2xl p-8 shadow-card">
              <div className="aspect-video bg-gradient-hero rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-20 w-20 text-royal-purple/30" />
              </div>
              <h3 className="font-heading font-semibold text-midnight-navy mb-2">Platform Highlights</h3>
              <ul className="space-y-2 text-cool-gray">
                <li>• Mobile ready for all devices</li>
                <li>• Privacy protected access</li>
                <li>• Instant emergency alerts</li>
                <li>• Medical information storage</li>
                <li>• Family notification system</li>
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
              Key Features
            </h2>
            <p className="text-cool-gray max-w-2xl mx-auto">
              Essential tools for emergency information access and family communication.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-slate-white shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-green/10 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-emerald-green" />
                </div>
                <CardTitle className="font-heading">Mobile Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Optimized for all mobile devices with responsive design and offline access capabilities.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-white shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-royal-purple/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-royal-purple" />
                </div>
                <CardTitle className="font-heading">Privacy Protected</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Secure data encryption with controlled access levels to protect sensitive medical information.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-white shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-electric-blue/10 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-electric-blue" />
                </div>
                <CardTitle className="font-heading">Instant Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Real-time emergency notifications to family members and designated contacts during critical situations.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Purchase Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold text-midnight-navy mb-6">
            Complete Platform Available
          </h2>
          <p className="text-xl text-cool-gray mb-8">
            Full source code, mobile applications, and comprehensive documentation ready for deployment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-green mb-2">10K+</div>
              <div className="text-cool-gray">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-royal-purple mb-2">99.9%</div>
              <div className="text-cool-gray">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-electric-blue mb-2">{formatPrice(4999)}</div>
              <div className="text-cool-gray">Platform Cost</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-coral-orange mb-2">24/7</div>
              <div className="text-cool-gray">Support</div>
            </div>
          </div>
          
          <div className="bg-gradient-card rounded-2xl p-8 shadow-card max-w-2xl mx-auto mb-8">
            <h3 className="font-heading font-semibold text-midnight-navy mb-4">What's Included</h3>
            <div className="grid grid-cols-1 gap-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-emerald-green rounded-full mt-2"></div>
                <span className="text-cool-gray">Complete source code for web and mobile platforms</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-electric-blue rounded-full mt-2"></div>
                <span className="text-cool-gray">iOS and Android native applications</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-royal-purple rounded-full mt-2"></div>
                <span className="text-cool-gray">Comprehensive documentation and setup guides</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-coral-orange rounded-full mt-2"></div>
                <span className="text-cool-gray">12 months technical support included</span>
              </div>
            </div>
          </div>
          
          <Button variant="invest" size="lg" asChild>
            <a href="https://icesoslite.com" target="_blank" rel="noopener noreferrer">
              <TrendingUp className="h-5 w-5" />
              Purchase ICE-SOS Lite
              <ArrowRight className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IceSosLite;