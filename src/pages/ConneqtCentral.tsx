import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { ArrowRight, Lock, Network, Eye, Settings, Users, Shield } from 'lucide-react';

const ConneqtCentral = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-cool-gray text-white mb-4">Private</Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-midnight-navy mb-6">
            Conneqt-Central
          </h1>
          <p className="text-xl text-cool-gray mb-8 max-w-2xl mx-auto">
            Internal project management and team collaboration platform powering Vision-Sync operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="view" size="lg">
              <Eye className="h-5 w-5" />
              View Overview
            </Button>
            <Button variant="outline" size="lg" disabled>
              <Lock className="h-5 w-5" />
              Private Access
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
                The Engine Behind Vision-Sync
              </h2>
              <p className="text-cool-gray mb-6 leading-relaxed">
                Conneqt-Central is our proprietary operations platform that orchestrates project development, team collaboration, and client management across all Vision-Sync initiatives.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-royal-purple/10 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-royal-purple rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-midnight-navy">Unified Dashboard</h4>
                    <p className="text-cool-gray text-sm">Single view of all projects, timelines, and resources</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-royal-purple/10 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-royal-purple rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-midnight-navy">Secure Communications</h4>
                    <p className="text-cool-gray text-sm">End-to-end encrypted team messaging and file sharing</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-royal-purple/10 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-royal-purple rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-midnight-navy">Client Portal Integration</h4>
                    <p className="text-cool-gray text-sm">Seamless investor and client communication tools</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-card rounded-2xl p-8 shadow-card">
              <div className="aspect-video bg-gradient-hero rounded-xl flex items-center justify-center mb-6">
                <Network className="h-20 w-20 text-royal-purple/30" />
              </div>
              <h3 className="font-heading font-semibold text-midnight-navy mb-2">System Capabilities</h3>
              <ul className="space-y-2 text-cool-gray">
                <li>• Multi-project orchestration</li>
                <li>• Real-time team collaboration</li>
                <li>• Automated reporting</li>
                <li>• Enterprise-grade security</li>
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
              Built for scale, security, and seamless operations management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-slate-white shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-royal-purple/10 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-royal-purple" />
                </div>
                <CardTitle className="font-heading">Project Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced project tracking with milestone management, resource allocation, and timeline optimization.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-white shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-green/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-emerald-green" />
                </div>
                <CardTitle className="font-heading">Team Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Integrated communication tools, shared workspaces, and role-based access controls for efficient teamwork.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-white shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-electric-blue/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-electric-blue" />
                </div>
                <CardTitle className="font-heading">Security & Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Enterprise-grade security with audit trails, compliance reporting, and data protection protocols.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Access Information */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold text-midnight-navy mb-6">
            Internal Operations Platform
          </h2>
          <p className="text-xl text-cool-gray mb-8">
            Conneqt-Central is our proprietary internal system. Access is restricted to Vision-Sync team members and authorized partners.
          </p>
          <div className="bg-gradient-card rounded-2xl p-8 shadow-card max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-cool-gray/10 rounded-full flex items-center justify-center">
                <Lock className="h-8 w-8 text-cool-gray" />
              </div>
            </div>
            <h3 className="font-heading font-semibold text-midnight-navy mb-4">Restricted Access</h3>
            <p className="text-cool-gray mb-6">
              This platform contains sensitive business operations data and is not available for public demonstration or investment review.
            </p>
            <Button variant="outline" disabled>
              <Lock className="h-5 w-5" />
              Access Restricted
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ConneqtCentral;