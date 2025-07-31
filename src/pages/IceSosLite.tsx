import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { ArrowRight, Shield, Smartphone, DollarSign, Eye, ExternalLink, AlertTriangle, Clock, Users } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

const IceSosLite = () => {
  const { formatPrice } = useCurrency();
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-coral-orange text-white mb-4">For Sale</Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-midnight-navy mb-6">
            ICE-SOS Lite
          </h1>
          <p className="text-xl text-cool-gray mb-8 max-w-2xl mx-auto">
            Emergency contact and medical information system for immediate crisis response and family notification.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="buy" size="lg">
              <DollarSign className="h-5 w-5" />
              Purchase Platform
            </Button>
            <Button variant="view" size="lg">
              <Eye className="h-5 w-5" />
              View Demo
            </Button>
            <Button variant="outline" size="lg">
              <ExternalLink className="h-5 w-5" />
              Request Info
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
                Critical Information When It Matters Most
              </h2>
              <p className="text-cool-gray mb-6 leading-relaxed">
                ICE-SOS Lite provides instant access to emergency contacts, medical conditions, allergies, and vital information when first responders and medical professionals need it most.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-coral-orange/10 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-coral-orange rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-midnight-navy">Instant Emergency Access</h4>
                    <p className="text-cool-gray text-sm">Quick access via QR codes, NFC tags, and emergency apps</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-coral-orange/10 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-coral-orange rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-midnight-navy">Medical Information Storage</h4>
                    <p className="text-cool-gray text-sm">Secure storage of conditions, medications, and allergies</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-coral-orange/10 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-coral-orange rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-midnight-navy">Family Notification</h4>
                    <p className="text-cool-gray text-sm">Automated alerts to emergency contacts and family members</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-card rounded-2xl p-8 shadow-card">
              <div className="aspect-video bg-gradient-hero rounded-xl flex items-center justify-center mb-6">
                <AlertTriangle className="h-20 w-20 text-coral-orange/30" />
              </div>
              <h3 className="font-heading font-semibold text-midnight-navy mb-2">Platform Details</h3>
              <ul className="space-y-2 text-cool-gray">
                <li>• Mobile & web applications</li>
                <li>• QR code & NFC integration</li>
                <li>• HIPAA compliant</li>
                <li>• Multi-language support</li>
                <li>• Cloud-based with offline access</li>
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
              Platform Features
            </h2>
            <p className="text-cool-gray max-w-2xl mx-auto">
              Everything needed for comprehensive emergency information management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-slate-white shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-coral-orange/10 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-coral-orange" />
                </div>
                <CardTitle className="font-heading">Mobile Ready</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Native iOS and Android apps with offline access for emergency situations when connectivity is limited.
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
                  HIPAA compliant with encrypted data storage and controlled access for authorized emergency personnel only.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-white shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-electric-blue/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-electric-blue" />
                </div>
                <CardTitle className="font-heading">Instant Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Real-time notifications to emergency contacts via SMS, email, and push notifications when needed.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Purchase Information */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold text-midnight-navy mb-6">
            Complete Platform Available for Purchase
          </h2>
          <p className="text-xl text-cool-gray mb-8">
            Ready-to-deploy solution with full source code, documentation, and deployment support.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-coral-orange mb-2">{formatPrice(75000)}</div>
              <div className="text-cool-gray">Platform License</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-royal-purple mb-2">500+</div>
              <div className="text-cool-gray">Beta Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-green mb-2">4.8★</div>
              <div className="text-cool-gray">User Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-electric-blue mb-2">30 days</div>
              <div className="text-cool-gray">Support Included</div>
            </div>
          </div>
          
          <div className="bg-gradient-card rounded-2xl p-8 shadow-card max-w-2xl mx-auto mb-8">
            <h3 className="font-heading font-semibold text-midnight-navy mb-4">What's Included</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-green rounded-full"></div>
                  <span className="text-cool-gray text-sm">Complete source code</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-green rounded-full"></div>
                  <span className="text-cool-gray text-sm">Mobile apps (iOS/Android)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-green rounded-full"></div>
                  <span className="text-cool-gray text-sm">Admin dashboard</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-green rounded-full"></div>
                  <span className="text-cool-gray text-sm">Documentation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-green rounded-full"></div>
                  <span className="text-cool-gray text-sm">Deployment support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-green rounded-full"></div>
                  <span className="text-cool-gray text-sm">30-day support</span>
                </div>
              </div>
            </div>
          </div>
          
          <Button variant="buy" size="lg">
            <DollarSign className="h-5 w-5" />
            Purchase ICE-SOS Lite
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IceSosLite;