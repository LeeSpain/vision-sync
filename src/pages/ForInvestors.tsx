import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { supabaseLeadManager } from '@/utils/supabaseLeadManager';
import { TrendingUp, DollarSign, Users, BarChart3, ArrowRight, Shield, Target } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { projectManager, type Project } from '@/utils/projectManager';
import { useNavigate } from 'react-router-dom';

const ForInvestors = () => {
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [investmentOpportunities, setInvestmentOpportunities] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [investorForm, setInvestorForm] = useState({
    name: '',
    email: '',
    company: '',
    investmentRange: '',
    interests: '',
    message: '',
  });

  useEffect(() => {
    loadInvestmentOpportunities();
  }, []);

  const loadInvestmentOpportunities = async () => {
    try {
      setLoading(true);
      const projects = await projectManager.getProjectsByContentSection('investment-opportunities');
      setInvestmentOpportunities(projects);
    } catch (error) {
      console.error('Error loading investment opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Save lead to database
      await supabaseLeadManager.saveLead({
        source: 'investor',
        name: investorForm.name,
        email: investorForm.email,
        company: investorForm.company,
        form_data: {
          investmentRange: investorForm.investmentRange,
          interests: investorForm.interests,
          message: investorForm.message
        }
      });
      
      // Reset form
      setInvestorForm({
        name: '',
        email: '',
        company: '',
        investmentRange: '',
        interests: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting investor form:', error);
    }
  };


  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-midnight-navy mb-6">
            Investment Opportunities
          </h1>
          <p className="text-xl text-cool-gray mb-8 max-w-2xl mx-auto">
            Partner with Vision-Sync to build the future of digital innovation. Strategic investment opportunities in proven, market-ready platforms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="invest" size="lg">
              <TrendingUp className="h-5 w-5" />
              View Opportunities
            </Button>
            <Button variant="outline" size="lg">
              <Users className="h-5 w-5" />
              Schedule Meeting
            </Button>
          </div>
        </div>
      </section>

      {/* Why Invest Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-midnight-navy mb-4">
              Why Invest in Vision-Sync?
            </h2>
            <p className="text-cool-gray max-w-2xl mx-auto">
              Proven track record, innovative solutions, and strategic market positioning.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-card shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-green/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-emerald-green" />
                </div>
                <CardTitle className="font-heading">Proven Market Fit</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our platforms address real market needs with validated customer demand and growing user bases.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-royal-purple/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-royal-purple" />
                </div>
                <CardTitle className="font-heading">Low Risk Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Diversified portfolio of platforms across different sectors minimizes investment risk while maximizing potential returns.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card border-soft-lilac/30">
              <CardHeader>
                <div className="w-12 h-12 bg-electric-blue/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-electric-blue" />
                </div>
                <CardTitle className="font-heading">Growth Potential</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Strategic positioning in high-growth markets with clear scaling opportunities and exit strategies.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Investment Opportunities */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-soft-lilac/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-midnight-navy mb-4">
              Current Opportunities
            </h2>
            <p className="text-cool-gray">
              Strategic investment opportunities across our platform portfolio.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <Card key={i} className="bg-slate-white shadow-card border-soft-lilac/30">
                  <CardHeader className="space-y-3">
                    <div className="h-6 bg-slate-white/50 rounded animate-pulse"></div>
                    <div className="h-4 bg-slate-white/50 rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-20 bg-slate-white/50 rounded animate-pulse"></div>
                    <div className="h-10 bg-slate-white/50 rounded animate-pulse"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              investmentOpportunities.map((project) => {
                const slug = project.route || `/${(project.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                return (
                  <Card key={project.id} className="bg-slate-white shadow-card border-soft-lilac/30 hover:shadow-hover transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className="bg-electric-blue text-white">{project.status || 'Active'}</Badge>
                        <Badge variant="outline">{project.category || 'Investment'}</Badge>
                      </div>
                      <CardTitle className="font-heading">{project.title}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-midnight-navy">Target Investment</div>
                          <div className="text-cool-gray">{formatPrice(project.investment_amount || 0)}</div>
                        </div>
                        <div>
                          <div className="font-medium text-midnight-navy">Progress</div>
                          <div className="text-electric-blue font-medium">{project.funding_progress || 0}%</div>
                        </div>
                      </div>
                      {project.expected_roi && (
                        <div className="text-sm">
                          <div className="font-medium text-midnight-navy">Expected ROI</div>
                          <div className="text-emerald-green font-medium">{project.expected_roi}%</div>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <div className="font-medium text-midnight-navy">Investors</div>
                          <div className="text-electric-blue">{project.investor_count || 0}</div>
                        </div>
                        <Button variant="invest" size="sm" onClick={() => navigate(slug)}>
                          <TrendingUp className="h-4 w-4" />
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Investor Inquiry Form */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-midnight-navy mb-4">
              Partner With Us
            </h2>
            <p className="text-xl text-cool-gray">
              Submit your investor inquiry and we'll provide detailed information about our opportunities.
            </p>
          </div>

          <Card className="bg-slate-white shadow-card">
            <CardHeader>
              <CardTitle className="text-center font-heading">Investor Inquiry</CardTitle>
              <CardDescription className="text-center">
                Tell us about your investment interests and we'll get back to you promptly
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
                      value={investorForm.name}
                      onChange={(e) => setInvestorForm({ ...investorForm, name: e.target.value })}
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
                      value={investorForm.email}
                      onChange={(e) => setInvestorForm({ ...investorForm, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-midnight-navy mb-2">
                      Company/Fund
                    </label>
                    <Input
                      value={investorForm.company}
                      onChange={(e) => setInvestorForm({ ...investorForm, company: e.target.value })}
                      placeholder="Your organization"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-midnight-navy mb-2">
                      Investment Range
                    </label>
                    <Select onValueChange={(value) => setInvestorForm({ ...investorForm, investmentRange: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-100k">Under {formatPrice(100000)}</SelectItem>
                        <SelectItem value="100k-500k">{formatPrice(100000)} - {formatPrice(500000)}</SelectItem>
                        <SelectItem value="500k-1m">{formatPrice(500000)} - {formatPrice(1000000)}</SelectItem>
                        <SelectItem value="1m-5m">{formatPrice(1000000)} - {formatPrice(5000000)}</SelectItem>
                        <SelectItem value="over-5m">Over {formatPrice(5000000)}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-midnight-navy mb-2">
                    Areas of Interest
                  </label>
                  <Input
                    value={investorForm.interests}
                    onChange={(e) => setInvestorForm({ ...investorForm, interests: e.target.value })}
                    placeholder="e.g., Healthcare Tech, PropTech, SaaS"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-midnight-navy mb-2">
                    Additional Message
                  </label>
                  <Textarea
                    value={investorForm.message}
                    onChange={(e) => setInvestorForm({ ...investorForm, message: e.target.value })}
                    placeholder="Tell us more about your investment thesis and interests..."
                    rows={4}
                  />
                </div>
                
                <Button type="submit" variant="invest" size="lg" className="w-full">
                  <DollarSign className="h-5 w-5" />
                  Submit Investor Inquiry
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

export default ForInvestors;