import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Bot, Brain, MessageSquare, Zap, Users, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';

const AiAgents = () => {
  const agents = [
    {
      name: "Healthcare Assistant",
      description: "AI-powered patient communication and care coordination",
      icon: <Bot className="h-8 w-8" />,
      features: ["24/7 Patient Support", "Appointment Scheduling", "Health Monitoring", "Emergency Response"]
    },
    {
      name: "Real Estate Advisor",
      description: "Intelligent property matching and investment guidance",
      icon: <Brain className="h-8 w-8" />,
      features: ["Property Analysis", "Market Insights", "Investment Calculations", "Virtual Tours"]
    },
    {
      name: "Business Operations",
      description: "Streamline workflows and automate routine tasks",
      icon: <Zap className="h-8 w-8" />,
      features: ["Process Automation", "Data Analysis", "Report Generation", "Task Management"]
    },
    {
      name: "Customer Support",
      description: "Enhanced customer service with AI-powered responses",
      icon: <MessageSquare className="h-8 w-8" />,
      features: ["Instant Responses", "Multi-language Support", "Sentiment Analysis", "Issue Resolution"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-midnight-navy mb-6">
            Meet Your{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              AI Agents
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-cool-gray mb-8 max-w-3xl mx-auto">
            Intelligent automation solutions designed to transform your business operations and enhance customer experiences.
          </p>
        </div>
      </section>

      {/* AI Agents Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-midnight-navy mb-4">
              AI-Powered Solutions
            </h2>
            <p className="text-lg text-cool-gray max-w-2xl mx-auto">
              Our AI agents are trained to handle complex tasks, provide intelligent insights, and deliver exceptional results across various industries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {agents.map((agent, index) => (
              <Card key={index} className="p-8 hover:shadow-elegant transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center text-white">
                    {agent.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-heading font-semibold text-midnight-navy mb-2">
                      {agent.name}
                    </h3>
                    <p className="text-cool-gray mb-4">{agent.description}</p>
                    <ul className="space-y-2">
                      {agent.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-cool-gray">
                          <Target className="h-4 w-4 text-emerald-green mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-midnight-navy/5 via-royal-purple/5 to-emerald-green/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-midnight-navy mb-4">
              Why Choose Our AI Agents?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-emerald-green" />
              </div>
              <h3 className="font-heading font-semibold text-midnight-navy mb-2">Easy Integration</h3>
              <p className="text-cool-gray">Seamlessly integrate with your existing systems and workflows</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-royal-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-royal-purple" />
              </div>
              <h3 className="font-heading font-semibold text-midnight-navy mb-2">Continuous Learning</h3>
              <p className="text-cool-gray">AI that adapts and improves based on your specific needs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-coral-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-coral-orange" />
              </div>
              <h3 className="font-heading font-semibold text-midnight-navy mb-2">Instant Results</h3>
              <p className="text-cool-gray">See immediate improvements in efficiency and customer satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AiAgents;