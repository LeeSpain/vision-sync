import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import SEOHead from '@/components/SEOHead';
import { generateOrganizationSchema, generateWebPageSchema, generateServiceSchema } from '@/utils/structuredData';
import { Bot, Brain, MessageSquare, Zap, Users, Target, TrendingUp, Clock, Shield, Globe, BarChart3, Rocket, CheckCircle, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AiAgents = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Genuine, non-numeric value statements — how the AI agent actually works.
  const howItWorks = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'Trained on your business',
      description: 'Your agent learns your services, opening hours, and common questions, so it answers like a knowledgeable member of your team.',
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'English & Spanish',
      description: 'Every conversation is handled fluently in both languages, so no customer goes unanswered.',
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Available 24/7',
      description: 'Enquiries are captured and answered around the clock, and you are notified instantly.',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Works with your team',
      description: 'The AI handles routine questions and hands more complex cases to a human whenever needed.',
    },
  ];

  const agents = [
    {
      name: 'Customer Service Assistant',
      description: 'AI that supports your team with customer inquiries, day and night.',
      icon: <MessageSquare className="h-8 w-8" />,
      benefit: 'Handle routine inquiries automatically',
      features: ['24/7 Initial Response', 'English & Spanish', 'Smart Routing to Staff', 'Knowledge Base Integration'],
    },
    {
      name: 'Sales Support Assistant',
      description: 'AI that helps qualify leads and schedule appointments.',
      icon: <Target className="h-8 w-8" />,
      benefit: 'More time for your team to close deals',
      features: ['Lead Qualification', 'Automated Scheduling', 'Follow-up Reminders', 'CRM Integration'],
    },
    {
      name: 'Operations Assistant',
      description: 'AI that streamlines workflows and reduces repetitive tasks.',
      icon: <Zap className="h-8 w-8" />,
      benefit: 'Free your team for strategic work',
      features: ['Process Automation', 'Data Entry', 'Status Updates', 'Report Generation'],
    },
    {
      name: 'Business Intelligence Helper',
      description: 'AI that analyzes your data and surfaces insights for your team.',
      icon: <BarChart3 className="h-8 w-8" />,
      benefit: 'Make data-driven decisions faster',
      features: ['Trend Analysis', 'Custom Dashboards', 'Automated Reports', 'Plain-language Summaries'],
    },
  ];

  return (
    <div className="min-h-screen">
      <SEOHead
        title="AI Agents & Chatbots | Intelligent Business Automation - Vision-Sync Forge"
        description="Deploy AI agents for 24/7 customer service automation in English and Spanish. Conversational AI, virtual assistants, and intelligent automation for businesses of all sizes."
        keywords="AI agents, AI chatbots, conversational AI, intelligent automation, business automation, AI customer service, virtual assistants, chatbot development, AI sales assistant, enterprise AI, automated customer support"
        canonical="https://www.vision-sync.co/ai-agents"
        ogImage="https://www.vision-sync.co/lovable-uploads/afb9cb1e-a617-48d7-b0bf-062beac34324.png"
        structuredData={[
          generateOrganizationSchema(),
          generateWebPageSchema({
            name: "AI Agents & Chatbots - Vision-Sync Forge",
            description: "Professional AI agent and chatbot development for business automation, customer service, and sales support",
            url: "https://www.vision-sync.co/ai-agents"
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
      <section className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-royal-purple/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-emerald-green/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center gap-2 bg-gradient-primary px-4 py-1.5 rounded-full text-white text-sm font-medium mb-8 shadow-glow mx-auto">
            <Bot className="h-4 w-4" />
            {t('aiAgents.heroEyebrow')}
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-midnight-navy mb-6 tracking-tight">
            AI Agents & Chatbots for{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">Business Growth</span>
          </h1>
          <p className="text-lg md:text-xl text-cool-gray mb-10 max-w-3xl mx-auto leading-relaxed">
            Deploy intelligent AI agents and conversational chatbots to automate customer service, qualify leads, and streamline operations.
            <span className="text-emerald-green font-semibold"> Enterprise-grade AI automation for businesses of all sizes.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              variant="hero"
              size="lg"
              className="shadow-lg group"
              onClick={() => navigate('/contact')}
            >
              Contact Us
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/pricing')}
            >
              {t('aiAgents.heroCtaSecondary')}
            </Button>
          </div>
          {/* Genuine, non-numeric value points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 text-lg font-semibold text-emerald-green">
                <Clock className="h-5 w-5" />
                24/7 availability
              </div>
              <div className="text-sm text-cool-gray mt-1">Always on, even after hours</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 text-lg font-semibold text-emerald-green">
                <Globe className="h-5 w-5" />
                English &amp; Spanish
              </div>
              <div className="text-sm text-cool-gray mt-1">Bilingual by default</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 text-lg font-semibold text-emerald-green">
                <Users className="h-5 w-5" />
                Works with your team
              </div>
              <div className="text-sm text-cool-gray mt-1">Hands off to a human when needed</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - genuine value statements (no numbers/claims) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-midnight-navy mb-4">
              How your <span className="text-emerald-green">AI agent</span> works
            </h2>
            <p className="text-xl text-cool-gray">Trained on your business, available around the clock, always with a human in the loop.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-elegant transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-midnight-navy mb-2">{item.title}</h3>
                <p className="text-cool-gray">{item.description}</p>
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
                    <h3 className="text-xl font-heading font-semibold text-midnight-navy mb-2">
                      {agent.name}
                    </h3>
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
