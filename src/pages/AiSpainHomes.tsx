import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import SEOHead from '@/components/SEOHead';
import { generateOrganizationSchema, generateWebPageSchema, generateSoftwareApplicationSchema } from '@/utils/structuredData';
import { ArrowRight, Home, Brain, TrendingUp, Eye, ExternalLink, MapPin, Euro, BarChart3 } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { analytics } from '@/utils/analytics';

const AiSpainHomes = () => {
  const { formatPrice } = useCurrency();
  
  useEffect(() => {
    analytics.trackPageView('/ai-spain-homes');
  }, []);
  
  return (
    <div className="min-h-screen">
      <SEOHead
        title="AI Spain Homes | AI-Powered Spanish Property Investment Platform"
        description="Revolutionary AI-powered platform for Spanish real estate investment. Smart property analysis, ROI predictions, and market insights for international buyers. Costa del Sol, Barcelona, Madrid."
        keywords="AI real estate Spain, Spanish property investment, PropTech Spain, AI property analysis, Costa del Sol real estate, Barcelona property investment, Madrid real estate"
        canonical="https://vision-sync-forge.lovable.app/ai-spain-homes"
        ogImage="https://vision-sync-forge.lovable.app/favicon.png"
        structuredData={[
          generateOrganizationSchema(),
          generateWebPageSchema({
            name: "AI Spain Homes - AI-Powered Spanish Real Estate Platform",
            description: "AI-driven platform for smart real estate investment in Spain with market analysis and ROI predictions",
            url: "https://vision-sync-forge.lovable.app/ai-spain-homes"
          }),
          generateSoftwareApplicationSchema({
            name: "AI Spain Homes",
            description: "AI-powered real estate platform for Spanish property investment analysis and portfolio management",
            applicationCategory: "RealEstateApplication"
          })
        ]}
      />
      <Header />
      
      {/* Hero Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-electric-blue text-white mb-4">Concept</Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-midnight-navy mb-6">
            AI Spain Homes
          </h1>
          <p className="text-xl text-cool-gray mb-8 max-w-2xl mx-auto">
            AI-powered real estate platform for Spanish property investment, analysis, and management with intelligent market insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="invest" size="lg">
              <TrendingUp className="h-5 w-5" />
              Investment Info
            </Button>
            <Button variant="view" size="lg">
              <Eye className="h-5 w-5" />
              View Concept
            </Button>
            <Button variant="outline" size="lg">
              <ExternalLink className="h-5 w-5" />
              Early Access
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
                Smart Property Investment in Spain
              </h2>
              <p className="text-cool-gray mb-6 leading-relaxed">
                AI Spain Homes leverages artificial intelligence to analyze Spanish real estate markets, predict property values, and identify optimal investment opportunities for international buyers.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-electric-blue/10 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-electric-blue rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-midnight-navy">AI Market Analysis</h4>
                    <p className="text-cool-gray text-sm">Machine learning algorithms analyze market trends and predict ROI</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-electric-blue/10 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-electric-blue rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-midnight-navy">Location Intelligence</h4>
                    <p className="text-cool-gray text-sm">Comprehensive neighborhood analysis and growth potential scoring</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-electric-blue/10 rounded-full flex items-center justify-center mt-1">
                    <div className="w-2 h-2 bg-electric-blue rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-midnight-navy">Investment Tracking</h4>
                    <p className="text-cool-gray text-sm">Portfolio management with automated performance reporting</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-card rounded-2xl p-8 shadow-card">
              <div className="aspect-video bg-gradient-hero rounded-xl flex items-center justify-center mb-6">
                <Home className="h-20 w-20 text-royal-purple/30" />
              </div>
              <h3 className="font-heading font-semibold text-midnight-navy mb-2">Market Focus</h3>
              <ul className="space-y-2 text-cool-gray">
                <li>• Costa del Sol & Costa Brava</li>
                <li>• Madrid & Barcelona metros</li>
                <li>• Emerging markets analysis</li>
                <li>• International buyer focus</li>
                <li>• {formatPrice(50000)} - {formatPrice(2000000)} property range</li>
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
              Advanced AI tools for smart real estate investment decisions in Spain.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-slate-white shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-electric-blue/10 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-electric-blue" />
                </div>
                <CardTitle className="font-heading">AI Property Scoring</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced algorithms analyze dozens of factors to provide investment scores and ROI predictions for every property.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-white shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-green/10 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-emerald-green" />
                </div>
                <CardTitle className="font-heading">Location Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive neighborhood analysis including demographics, infrastructure, and development plans.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-white shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-royal-purple/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-royal-purple" />
                </div>
                <CardTitle className="font-heading">Portfolio Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Track investment performance, rental yields, and market value changes across your Spanish property portfolio.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Investment Opportunity */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold text-midnight-navy mb-6">
            Early Investment Opportunity
          </h2>
          <p className="text-xl text-cool-gray mb-8">
            Join us in building the future of Spanish real estate investment technology. Seeking strategic partners and early-stage funding.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-electric-blue mb-2">{formatPrice(50000000000)}</div>
              <div className="text-cool-gray">Spanish Property Market</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-green mb-2">25%</div>
              <div className="text-cool-gray">International Buyers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-royal-purple mb-2">{formatPrice(1000000)}</div>
              <div className="text-cool-gray">Seed Funding Target</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-coral-orange mb-2">24mo</div>
              <div className="text-cool-gray">Development Timeline</div>
            </div>
          </div>
          
          <div className="bg-gradient-card rounded-2xl p-8 shadow-card max-w-2xl mx-auto mb-8">
            <h3 className="font-heading font-semibold text-midnight-navy mb-4">Why Now?</h3>
            <div className="grid grid-cols-1 gap-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-emerald-green rounded-full mt-2"></div>
                <span className="text-cool-gray">Post-pandemic Spanish property market recovery presents unique opportunities</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-electric-blue rounded-full mt-2"></div>
                <span className="text-cool-gray">Increasing international investment in Spanish real estate</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-royal-purple rounded-full mt-2"></div>
                <span className="text-cool-gray">Limited AI-powered tools in European property markets</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-coral-orange rounded-full mt-2"></div>
                <span className="text-cool-gray">Growing demand for data-driven investment decisions</span>
              </div>
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

export default AiSpainHomes;