import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { ArrowRight, Wifi, Link, DollarSign, Eye, ExternalLink, Shield, Zap, Radio } from 'lucide-react';

const TetherBand = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-electric-blue text-white mb-4">Beta</Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-midnight-navy mb-6">
            Tether-Band
          </h1>
          <p className="text-xl text-cool-gray mb-8 max-w-2xl mx-auto">
            Innovative connectivity solution for secure device-to-device communication and network bridging.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="buy" size="lg">
              <DollarSign className="h-5 w-5" />
              Purchase License
            </Button>
            <Button variant="view" size="lg">
              <Eye className="h-5 w-5" />
              Beta Demo
            </Button>
            <Button variant="outline" size="lg">
              <ExternalLink className="h-5 w-5" />
              Technical Specs
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
                Next-Generation Connectivity
              </h2>
              <p className="text-cool-gray mb-6 leading-relaxed">
                Tether-Band creates secure, direct device-to-device connections that bypass traditional network infrastructure, enabling reliable communication in any environment.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-electric-blue/10 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-electric-blue rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-midnight-navy">Mesh Networking</h4>
                    <p className="text-cool-gray text-sm">Self-healing network topology with automatic node discovery</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-electric-blue/10 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-electric-blue rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-midnight-navy">Zero-Trust Security</h4>
                    <p className="text-cool-gray text-sm">End-to-end encryption with device authentication protocols</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-electric-blue/10 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-electric-blue rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-midnight-navy">Ultra-Low Latency</h4>
                    <p className="text-cool-gray text-sm">Sub-millisecond response times for critical applications</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-card rounded-2xl p-8 shadow-card">
              <div className="aspect-video bg-gradient-hero rounded-xl flex items-center justify-center mb-6">
                <Radio className="h-20 w-20 text-royal-purple/30" />
              </div>
              <h3 className="font-heading font-semibold text-midnight-navy mb-2">Technical Specs</h3>
              <ul className="space-y-2 text-cool-gray">
                <li>• 5G/WiFi 6E compatible</li>
                <li>• 50km range (ideal conditions)</li>
                <li>• 1000+ concurrent connections</li>
                <li>• Military-grade encryption</li>
                <li>• Cross-platform SDK</li>
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
              Platform Capabilities
            </h2>
            <p className="text-cool-gray max-w-2xl mx-auto">
              Advanced connectivity features for mission-critical applications.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-slate-white shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-electric-blue/10 rounded-lg flex items-center justify-center mb-4">
                  <Wifi className="h-6 w-6 text-electric-blue" />
                </div>
                <CardTitle className="font-heading">Adaptive Protocols</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Automatically switches between communication protocols based on network conditions and device capabilities.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-white shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-royal-purple/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-royal-purple" />
                </div>
                <CardTitle className="font-heading">Quantum-Safe Security</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Future-proof encryption algorithms designed to withstand quantum computing attacks and ensure long-term security.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-white shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-green/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-emerald-green" />
                </div>
                <CardTitle className="font-heading">Edge Computing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Distributed processing capabilities that enable real-time data analysis and decision-making at the network edge.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-midnight-navy mb-4">
              Use Cases
            </h2>
            <p className="text-cool-gray">
              Versatile connectivity solutions for diverse industries and applications.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-card rounded-xl shadow-card">
              <div className="w-12 h-12 bg-emerald-green/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-emerald-green" />
              </div>
              <h3 className="font-heading font-semibold text-midnight-navy mb-2">Emergency Services</h3>
              <p className="text-cool-gray text-sm">Reliable communication during disasters and infrastructure failures</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-card rounded-xl shadow-card">
              <div className="w-12 h-12 bg-royal-purple/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-royal-purple" />
              </div>
              <h3 className="font-heading font-semibold text-midnight-navy mb-2">Industrial IoT</h3>
              <p className="text-cool-gray text-sm">Secure device communication in manufacturing and automation</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-card rounded-xl shadow-card">
              <div className="w-12 h-12 bg-electric-blue/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Link className="h-6 w-6 text-electric-blue" />
              </div>
              <h3 className="font-heading font-semibold text-midnight-navy mb-2">Remote Operations</h3>
              <p className="text-cool-gray text-sm">Connectivity for remote locations without traditional infrastructure</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-card rounded-xl shadow-card">
              <div className="w-12 h-12 bg-coral-orange/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Radio className="h-6 w-6 text-coral-orange" />
              </div>
              <h3 className="font-heading font-semibold text-midnight-navy mb-2">Smart Cities</h3>
              <p className="text-cool-gray text-sm">Urban infrastructure communication and monitoring systems</p>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase Information */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold text-midnight-navy mb-6">
            Beta License Available
          </h2>
          <p className="text-xl text-cool-gray mb-8">
            Early access to Tether-Band technology with development support and customization options.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-electric-blue mb-2">$150K</div>
              <div className="text-cool-gray">Beta License</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-royal-purple mb-2">6mo</div>
              <div className="text-cool-gray">Development Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-green mb-2">Q2 2025</div>
              <div className="text-cool-gray">Production Ready</div>
            </div>
          </div>
          <Button variant="buy" size="lg">
            <DollarSign className="h-5 w-5" />
            Request Beta Access
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TetherBand;