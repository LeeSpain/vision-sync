import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { ArrowRight, Clock, Heart, TrendingUp, Eye, ExternalLink, Users, Shield, Zap } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

const NurseSync = () => {
  const { formatPrice } = useCurrency();
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-emerald-green text-white mb-4">Live</Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-midnight-navy mb-6">
            Nurse-Sync
          </h1>
          <p className="text-xl text-cool-gray mb-8 max-w-2xl mx-auto">
            Advanced nursing workflow management and patient care coordination system designed by nurses, for nurses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="view" size="lg">
              <Eye className="h-5 w-5" />
              Live Demo
            </Button>
            <Button variant="invest" size="lg">
              <TrendingUp className="h-5 w-5" />
              Investment Info
            </Button>
            <Button variant="outline" size="lg">
              <ExternalLink className="h-5 w-5" />
              Request Trial
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
                Empowering Nursing Excellence
              </h2>
              <p className="text-cool-gray mb-6 leading-relaxed">
                Nurse-Sync revolutionizes nursing workflows with intelligent task management, real-time patient updates, and seamless care coordination. Built with direct input from nursing professionals worldwide.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-green/10 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-emerald-green rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-midnight-navy">Smart Task Prioritization</h4>
                    <p className="text-cool-gray text-sm">AI-powered task ranking based on patient acuity and care protocols</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-green/10 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-emerald-green rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-midnight-navy">Real-time Care Updates</h4>
                    <p className="text-cool-gray text-sm">Instant synchronization across all care team members</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-green/10 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-emerald-green rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-midnight-navy">Burnout Prevention</h4>
                    <p className="text-cool-gray text-sm">Workload balancing and wellness monitoring features</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-card rounded-2xl p-8 shadow-card">
              <div className="aspect-video bg-gradient-hero rounded-xl flex items-center justify-center mb-6">
                <Heart className="h-20 w-20 text-royal-purple/30" />
              </div>
              <h3 className="font-heading font-semibold text-midnight-navy mb-2">Platform Stats</h3>
              <ul className="space-y-2 text-cool-gray">
                <li>• 2,500+ active nurses</li>
                <li>• 50+ healthcare facilities</li>
                <li>• 99.8% uptime</li>
                <li>• 40% reduction in task completion time</li>
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
              Everything nurses need to deliver exceptional patient care efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-slate-white shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-green/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-emerald-green" />
                </div>
                <CardTitle className="font-heading">Smart Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Intelligent shift management with automatic coverage suggestions and workload optimization.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-white shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-royal-purple/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-royal-purple" />
                </div>
                <CardTitle className="font-heading">Team Coordination</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Seamless communication tools for multidisciplinary care teams with role-based permissions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-white shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-electric-blue/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-electric-blue" />
                </div>
                <CardTitle className="font-heading">Mobile First</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Native mobile apps for iOS and Android with offline capabilities for uninterrupted care.
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
            Proven platform with strong traction seeking growth capital to expand to 500+ facilities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-green mb-2">{formatPrice(15000000)}</div>
              <div className="text-cool-gray">Market Opportunity</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-royal-purple mb-2">50+</div>
              <div className="text-cool-gray">Healthcare Facilities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-coral-orange mb-2">12mo</div>
              <div className="text-cool-gray">Expansion Timeline</div>
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

export default NurseSync;