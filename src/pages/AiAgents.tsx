import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Bot, Brain, MessageSquare, Zap, Users, Target, Calculator, TrendingUp, Clock, DollarSign, Shield, Globe, BarChart3, Rocket, CheckCircle, ArrowRight, Play, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';


const AiAgents = () => {
  const { formatPrice } = useCurrency();
  const [roiInputs, setRoiInputs] = useState({
    employees: 5,
    avgSalary: 50000,
    hoursPerWeek: 40
  });

  const calculateROI = () => {
    const annualEmployeeCost = roiInputs.employees * roiInputs.avgSalary;
    const aiAgentCost = roiInputs.employees * 6000; // €500/month per agent
    const annualSavings = annualEmployeeCost - aiAgentCost;
    const monthlySavings = annualSavings / 12;
    const paybackDays = Math.round((aiAgentCost / annualSavings) * 365);
    
    return {
      annualSavings: formatPrice(annualSavings),
      monthlySavings: formatPrice(monthlySavings),
      paybackDays,
      roiPercentage: Math.round((annualSavings / aiAgentCost) * 100)
    };
  };

  const roi = calculateROI();

  const successStories = [
    {
      company: "TechCorp Healthcare",
      industry: "Healthcare",
      savings: `${formatPrice(180000)}/year`,
      improvement: "85% faster response times",
      quote: "Our AI agent handles 3,000+ patient inquiries daily, freeing our staff for critical care."
    },
    {
      company: "Urban Realty Group",
      industry: "Real Estate", 
      savings: `${formatPrice(120000)}/year`,
      improvement: "300% increase in lead conversion",
      quote: "AI agents qualify leads 24/7, resulting in 40% more closed deals per month."
    },
    {
      company: "Global Services Inc",
      industry: "Business Services",
      savings: `${formatPrice(250000)}/year`, 
      improvement: "90% reduction in processing time",
      quote: "Automated our entire customer onboarding process. What took 5 days now takes 2 hours."
    }
  ];

  const futureCapabilities = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Predictive Analytics",
      description: "AI that predicts customer needs before they ask",
      timeline: "Available Now"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Multi-Modal Intelligence", 
      description: "Voice, text, image, and video understanding",
      timeline: "Q2 2024"
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Autonomous Operations",
      description: "Self-managing business processes end-to-end",
      timeline: "Q4 2024"
    }
  ];

  const agents = [
    {
      name: "Customer Service Revolution",
      description: "Replace entire call centers with AI that never sleeps",
      icon: <MessageSquare className="h-8 w-8" />,
      savings: `Save ${formatPrice(120000)}+ annually per agent`,
      features: ["24/7/365 Availability", "0-second Response Time", "50+ Languages", "100% Consistency"],
      roi: "ROI: 400% in first year"
    },
    {
      name: "Sales Automation Engine", 
      description: "AI that qualifies, nurtures, and closes deals automatically",
      icon: <Target className="h-8 w-8" />,
      savings: "Increase revenue by 300%+",
      features: ["Lead Qualification", "Automated Follow-ups", "Deal Closing", "CRM Integration"],
      roi: "Payback in 30 days"
    },
    {
      name: "Operations Optimizer",
      description: "Eliminate repetitive tasks and streamline workflows", 
      icon: <Zap className="h-8 w-8" />,
      savings: "Reduce costs by 70%",
      features: ["Process Automation", "Error Elimination", "Real-time Analytics", "Predictive Maintenance"],
      roi: "Break-even in 60 days"
    },
    {
      name: "Business Intelligence AI",
      description: "Turn data into actionable insights automatically",
      icon: <BarChart3 className="h-8 w-8" />,
      savings: "Increase efficiency by 85%",
      features: ["Data Analysis", "Report Generation", "Trend Prediction", "Decision Support"],
      roi: "5x return in 6 months"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Future-Focused Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-midnight-navy via-royal-purple to-emerald-green text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-midnight-navy/90 to-royal-purple/90"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-emerald-green/20 text-emerald-green border-emerald-green/30">
            <Star className="h-4 w-4 mr-2" />
            Join 500+ businesses already saving {formatPrice(2000000)}+ monthly
          </Badge>
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
            The Future of Business is{' '}
            <span className="bg-gradient-to-r from-emerald-green to-coral-orange bg-clip-text text-transparent">
              Here
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto opacity-90">
            Meet Your AI Workforce: Save 70% on operational costs while working 24/7/365. 
            <span className="text-emerald-green font-semibold">The AI revolution isn't coming - it's here.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-emerald-green hover:bg-emerald-green/90 text-white px-8 py-4 text-lg"
              onClick={() => window.location.href = '/contact'}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Contact Us
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-green">{formatPrice(250000)}+</div>
              <div className="text-sm opacity-80">Average Annual Savings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-coral-orange">24/7</div>
              <div className="text-sm opacity-80">Never Stops Working</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-soft-lilac">30 Days</div>
              <div className="text-sm opacity-80">Average Payback Period</div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-midnight-navy mb-4">
              See Your <span className="text-emerald-green">Money-Saving</span> Potential
            </h2>
            <p className="text-xl text-cool-gray">Calculate exactly how much you'll save with AI agents</p>
          </div>
          
          <Card className="p-8 shadow-elegant">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-midnight-navy mb-6">Your Current Situation</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-cool-gray mb-2">Number of Employees</label>
                    <Input 
                      type="number" 
                      value={roiInputs.employees}
                      onChange={(e) => setRoiInputs({...roiInputs, employees: parseInt(e.target.value) || 0})}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cool-gray mb-2">Average Annual Salary</label>
                    <Input 
                      type="number" 
                      value={roiInputs.avgSalary}
                      onChange={(e) => setRoiInputs({...roiInputs, avgSalary: parseInt(e.target.value) || 0})}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cool-gray mb-2">Hours Worked Per Week</label>
                    <Input 
                      type="number" 
                      value={roiInputs.hoursPerWeek}
                      onChange={(e) => setRoiInputs({...roiInputs, hoursPerWeek: parseInt(e.target.value) || 0})}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-green/10 to-royal-purple/10 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-midnight-navy mb-6">Your AI Agent Savings</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-cool-gray">Annual Savings:</span>
                    <span className="text-2xl font-bold text-emerald-green">{roi.annualSavings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cool-gray">Monthly Savings:</span>
                    <span className="text-xl font-semibold text-emerald-green">{roi.monthlySavings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cool-gray">ROI Percentage:</span>
                    <span className="text-xl font-semibold text-emerald-green">{roi.roiPercentage}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cool-gray">Payback Period:</span>
                    <span className="text-lg font-semibold text-coral-orange">{roi.paybackDays} days</span>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-emerald-green hover:bg-emerald-green/90">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Start Saving Today
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-midnight-navy mb-4">
              Real Businesses, <span className="text-emerald-green">Real Transformations</span>
            </h2>
            <p className="text-xl text-cool-gray">See how AI agents have revolutionized operations across industries</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="p-6 hover:shadow-elegant transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary">{story.industry}</Badge>
                  <div className="text-right">
                    <div className="text-xl font-bold text-emerald-green">{story.savings}</div>
                    <div className="text-sm text-cool-gray">Annual Savings</div>
                  </div>
                </div>
                <h3 className="font-semibold text-midnight-navy mb-2">{story.company}</h3>
                <p className="text-coral-orange font-semibold mb-3">{story.improvement}</p>
                <blockquote className="text-cool-gray italic border-l-4 border-emerald-green pl-4">
                  "{story.quote}"
                </blockquote>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Future Capabilities Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-midnight-navy/5 to-royal-purple/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-midnight-navy mb-4">
              Your Business in <span className="text-royal-purple">2025</span>
            </h2>
            <p className="text-xl text-cool-gray">Advanced capabilities coming to transform your operations</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {futureCapabilities.map((capability, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-elegant transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {capability.icon}
                </div>
                <h3 className="text-xl font-semibold text-midnight-navy mb-2">{capability.title}</h3>
                <p className="text-cool-gray mb-4">{capability.description}</p>
                <Badge className="bg-emerald-green/10 text-emerald-green border-emerald-green/30">
                  {capability.timeline}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents Showcase */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-midnight-navy mb-4">
              Meet Your <span className="text-emerald-green">AI Workforce</span>
            </h2>
            <p className="text-xl text-cool-gray">Enterprise-grade AI agents that never sleep, never call in sick, and never make mistakes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {agents.map((agent, index) => (
              <Card key={index} className="p-8 hover:shadow-elegant transition-all duration-300 group">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    {agent.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-heading font-semibold text-midnight-navy">
                        {agent.name}
                      </h3>
                      <Badge className="bg-emerald-green/10 text-emerald-green border-emerald-green/30">
                        {agent.roi}
                      </Badge>
                    </div>
                    <p className="text-cool-gray mb-3">{agent.description}</p>
                    <div className="text-emerald-green font-semibold mb-4">{agent.savings}</div>
                    <ul className="space-y-2">
                      {agent.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-cool-gray">
                          <CheckCircle className="h-4 w-4 text-emerald-green mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="mt-4 w-full bg-midnight-navy hover:bg-midnight-navy/90">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Deploy This Agent
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-midnight-navy to-royal-purple text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Don't Get Left Behind in the <span className="text-emerald-green">AI Revolution</span>
          </h2>
          <p className="text-xl mb-8 opacity-90">
            While your competitors are still hiring and training, you could be saving hundreds of thousands with AI that works instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-emerald-green hover:bg-emerald-green/90 px-8 py-4 text-lg">
              <Calculator className="mr-2 h-5 w-5" />
              Start Free 30-Day Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-midnight-navy px-8 py-4 text-lg">
              <Clock className="mr-2 h-5 w-5" />
              Schedule Strategy Call
            </Button>
          </div>
          <div className="flex items-center justify-center space-x-6 text-sm opacity-80">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              30-Day Money Back Guarantee
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Setup in 24 Hours
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              24/7 Support
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AiAgents;