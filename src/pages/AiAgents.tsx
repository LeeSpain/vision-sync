import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import SEOHead from '@/components/SEOHead';
import { generateOrganizationSchema, generateWebPageSchema, generateServiceSchema } from '@/utils/structuredData';
import { Bot, Brain, MessageSquare, Zap, Users, Target, Calculator, TrendingUp, Clock, DollarSign, Shield, Globe, BarChart3, Rocket, CheckCircle, ArrowRight, Play, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '@/contexts/CurrencyContext';


const AiAgents = () => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [roiInputs, setRoiInputs] = useState({
    employees: 5,
    avgSalary: 50000,
    hoursPerWeek: 40
  });

  const calculateROI = () => {
    // Calculate efficiency gains, not replacement
    const hoursPerEmployee = roiInputs.hoursPerWeek * 52;
    const hoursSavedPerEmployee = hoursPerEmployee * 0.15; // 15% efficiency gain
    const totalHoursSaved = hoursSavedPerEmployee * roiInputs.employees;
    const hourlyRate = roiInputs.avgSalary / hoursPerEmployee;
    const annualTimeSavings = totalHoursSaved * hourlyRate;
    const aiAgentCost = 6000; // €500/month for AI assistance
    const netBenefit = annualTimeSavings - aiAgentCost;
    
    return {
      hoursSaved: Math.round(totalHoursSaved),
      timeSavings: formatPrice(annualTimeSavings),
      netBenefit: formatPrice(Math.max(0, netBenefit)),
      efficiencyGain: "15-25%"
    };
  };

  const roi = calculateROI();

  const successStories = [
    {
      company: "Local Healthcare Clinic",
      industry: "Healthcare",
      improvement: "18% faster response times",
      staffImpact: "Staff now focus on patient care",
      quote: "Our AI assistant helps triage inquiries and schedule appointments, giving our team more time with patients."
    },
    {
      company: "Regional Realty Group",
      industry: "Real Estate", 
      improvement: "23% increase in qualified leads",
      staffImpact: "Agents close more deals",
      quote: "AI helps qualify leads 24/7. Our agents spend time with serious buyers instead of cold calls."
    },
    {
      company: "Small Business Services",
      industry: "Business Services",
      improvement: "30% faster onboarding", 
      staffImpact: "Team handles complex cases",
      quote: "AI guides customers through routine setup. Our team focuses on strategic consulting."
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
      name: "Customer Service Assistant",
      description: "AI that supports your team with 24/7 customer inquiries",
      icon: <MessageSquare className="h-8 w-8" />,
      benefit: "Handle routine inquiries automatically",
      features: ["24/7 Initial Response", "Multi-Language Support", "Smart Routing to Staff", "Knowledge Base Integration"],
      impact: "15-25% efficiency gain"
    },
    {
      name: "Sales Support Assistant", 
      description: "AI that helps qualify leads and schedule appointments",
      icon: <Target className="h-8 w-8" />,
      benefit: "More time for your team to close deals",
      features: ["Lead Qualification", "Automated Scheduling", "Follow-up Reminders", "CRM Integration"],
      impact: "20-30% more qualified leads"
    },
    {
      name: "Operations Assistant",
      description: "AI that streamlines workflows and reduces repetitive tasks", 
      icon: <Zap className="h-8 w-8" />,
      benefit: "Free your team for strategic work",
      features: ["Process Automation", "Data Entry", "Status Updates", "Report Generation"],
      impact: "10-20% time savings"
    },
    {
      name: "Business Intelligence Helper",
      description: "AI that analyzes data and generates insights for your team",
      icon: <BarChart3 className="h-8 w-8" />,
      benefit: "Make data-driven decisions faster",
      features: ["Trend Analysis", "Custom Dashboards", "Automated Reports", "Predictive Insights"],
      impact: "Better decision making"
    }
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="AI Agents & Chatbots | Intelligent Business Automation - Vision-Sync Forge"
        description="Deploy AI agents and chatbots for 24/7 customer service automation. Conversational AI, virtual assistants, and intelligent automation solutions. Achieve 15-25% efficiency gains with enterprise-grade AI technology."
        keywords="AI agents, AI chatbots, conversational AI, intelligent automation, business automation, AI customer service, virtual assistants, chatbot development, AI sales assistant, machine learning automation, enterprise AI, automated customer support"
        canonical="https://vision-sync-forge.lovable.app/ai-agents"
        ogImage="https://vision-sync-forge.lovable.app/lovable-uploads/afb9cb1e-a617-48d7-b0bf-062beac34324.png"
        structuredData={[
          generateOrganizationSchema(),
          generateWebPageSchema({
            name: "AI Agents & Chatbots - Vision-Sync Forge",
            description: "Professional AI agent and chatbot development for business automation, customer service, and sales support",
            url: "https://vision-sync-forge.lovable.app/ai-agents"
          }),
          generateServiceSchema({
            name: "AI Agent & Chatbot Development",
            description: "Custom AI agents and conversational chatbots for business automation",
            provider: "Vision-Sync Forge"
          })
        ]}
      />
      <Header />
      
      {/* Hero Section - Partnership Focus */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-midnight-navy via-royal-purple to-emerald-green text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-midnight-navy/90 to-royal-purple/90"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-emerald-green/20 text-emerald-green border-emerald-green/30">
            <Star className="h-4 w-4 mr-2" />
            Empowering Businesses to Achieve Excellence
          </Badge>
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
            AI Agents & Chatbots for{' '}
            <span className="bg-gradient-to-r from-emerald-green to-coral-orange bg-clip-text text-transparent">
              Business Growth
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto opacity-90">
            Deploy intelligent AI agents and conversational chatbots to automate customer service, qualify leads, and streamline operations.
            <span className="text-emerald-green font-semibold"> Enterprise-grade AI automation for businesses of all sizes.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-emerald-green hover:bg-emerald-green/90 text-white px-8 py-4 text-lg"
              onClick={() => navigate('/contact')}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Contact Us
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-green">15-25%</div>
              <div className="text-sm opacity-80">Typical Efficiency Gains</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-coral-orange">24/7</div>
              <div className="text-sm opacity-80">AI Support Availability</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-soft-lilac">3-6 Months</div>
              <div className="text-sm opacity-80">Typical ROI Timeline</div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section - Focus on Efficiency */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-midnight-navy mb-4">
              Calculate Your <span className="text-emerald-green">Efficiency Gains</span>
            </h2>
            <p className="text-xl text-cool-gray">See how AI assistance can improve your team's productivity</p>
          </div>
          
          <Card className="p-8 shadow-elegant">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-midnight-navy mb-6">Your Team Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-cool-gray mb-2">Number of Team Members</label>
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
                <h3 className="text-xl font-semibold text-midnight-navy mb-6">Estimated Productivity Gains</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-cool-gray">Hours Saved/Year:</span>
                    <span className="text-2xl font-bold text-emerald-green">{roi.hoursSaved}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cool-gray">Time Value:</span>
                    <span className="text-xl font-semibold text-emerald-green">{roi.timeSavings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cool-gray">Net Benefit:</span>
                    <span className="text-xl font-semibold text-emerald-green">{roi.netBenefit}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cool-gray">Efficiency Gain:</span>
                    <span className="text-lg font-semibold text-coral-orange">{roi.efficiencyGain}</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white rounded-lg border border-emerald-green/20">
                  <p className="text-sm text-cool-gray">
                    These estimates assume AI handles routine tasks, freeing your team to focus on high-value work.
                  </p>
                </div>
                <Button 
                  className="w-full mt-4 bg-emerald-green hover:bg-emerald-green/90"
                  onClick={() => navigate('/contact')}
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Discuss Your Needs
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Success Stories Section - Realistic Results */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-midnight-navy mb-4">
              Real Businesses, <span className="text-emerald-green">Real Results</span>
            </h2>
            <p className="text-xl text-cool-gray">See how AI assistance has helped businesses improve operations</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="p-6 hover:shadow-elegant transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary">{story.industry}</Badge>
                  <CheckCircle className="h-6 w-6 text-emerald-green" />
                </div>
                <h3 className="font-semibold text-midnight-navy mb-2">{story.company}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-emerald-green font-semibold">{story.improvement}</p>
                  <p className="text-sm text-cool-gray flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    {story.staffImpact}
                  </p>
                </div>
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

      {/* AI Agents Showcase - Partnership Focus */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-midnight-navy mb-4">
              Meet Your <span className="text-emerald-green">AI Assistants</span>
            </h2>
            <p className="text-xl text-cool-gray">Smart AI solutions that enhance your team's capabilities and grow with your business</p>
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
                        {agent.impact}
                      </Badge>
                    </div>
                    <p className="text-cool-gray mb-3">{agent.description}</p>
                    <div className="text-emerald-green font-semibold mb-4 flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      {agent.benefit}
                    </div>
                    <ul className="space-y-2">
                      {agent.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-cool-gray">
                          <CheckCircle className="h-4 w-4 text-emerald-green mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="mt-4 w-full bg-midnight-navy hover:bg-midnight-navy/90"
                      onClick={() => navigate('/contact')}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Learn More
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Partnership Messaging */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-midnight-navy to-royal-purple text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Ready to <span className="text-emerald-green">Enhance</span> Your Business?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Whether you're a small business looking to compete or an enterprise seeking efficiency, our AI solutions grow with you. Let's build your success together.
          </p>
          <div className="mb-12 p-6 bg-white/10 rounded-lg border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-emerald-green" />
                  Small Business Benefits
                </h3>
                <ul className="space-y-2 text-sm opacity-90">
                  <li>• Affordable AI solutions</li>
                  <li>• Level the playing field</li>
                  <li>• 24/7 customer support</li>
                  <li>• Scale as you grow</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-emerald-green" />
                  Enterprise Benefits
                </h3>
                <ul className="space-y-2 text-sm opacity-90">
                  <li>• Handle peak demand</li>
                  <li>• Consistent quality at scale</li>
                  <li>• Data-driven insights</li>
                  <li>• Integration with existing systems</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              className="bg-emerald-green hover:bg-emerald-green/90 px-8 py-4 text-lg"
              onClick={() => navigate('/contact')}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Start a Conversation
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-midnight-navy px-8 py-4 text-lg"
              onClick={() => navigate('/templates')}
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              Explore Solutions
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm opacity-80">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Secure & Reliable
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Dedicated Support
            </div>
            <div className="flex items-center">
              <Rocket className="h-4 w-4 mr-2" />
              Growing With You
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AiAgents;