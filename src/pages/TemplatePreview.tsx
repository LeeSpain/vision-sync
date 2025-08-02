import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, Play, Star, CheckCircle, DollarSign, Clock, 
  Smartphone, Globe, Users, Zap, Shield, Headphones 
} from "lucide-react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { appTemplates, type AppTemplate } from "@/utils/appTemplates";
import { useCurrency } from "@/contexts/CurrencyContext";
import { supabase } from "@/integrations/supabase/client";

const TemplatePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [template, setTemplate] = useState<AppTemplate | null>(null);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  useEffect(() => {
    if (id) {
      const foundTemplate = appTemplates.find(t => t.id === id);
      setTemplate(foundTemplate || null);
      
      if (foundTemplate) {
        generateEnhancedContent(foundTemplate);
      }
    }
  }, [id]);

  const generateEnhancedContent = async (template: AppTemplate) => {
    setIsGeneratingContent(true);
    try {
      const { data } = await supabase.functions.invoke('ai-template-assistant', {
        body: { 
          action: 'generate-content',
          data: {
            type: 'template-description',
            context: `Template: ${template.title}, Category: ${template.category}, Features: ${template.keyFeatures.join(', ')}`,
            industry: template.category
          }
        }
      });

      setGeneratedContent(data);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleRequestQuote = () => {
    if (template) {
      sessionStorage.setItem('selectedTemplate', JSON.stringify(template));
      navigate('/contact');
    }
  };

  const handleTryDemo = () => {
    // In a real app, this would open a live demo
    window.open('#', '_blank');
  };

  if (!template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Template Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The template you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate('/templates')}>
              Browse All Templates
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const mockScreenshots = [
    "/placeholder.svg",
    "/placeholder.svg", 
    "/placeholder.svg"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">
                  <template.icon className="h-10 w-10" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{template.title}</h1>
                  <Badge variant="secondary" className="mt-1">{template.category}</Badge>
                </div>
              </div>
              
              <p className="text-lg text-muted-foreground mb-6">
                {template.overview}
              </p>

              {isGeneratingContent ? (
                <div className="space-y-3">
                  <div className="animate-pulse bg-muted h-4 rounded w-3/4"></div>
                  <div className="animate-pulse bg-muted h-4 rounded w-1/2"></div>
                  <div className="animate-pulse bg-muted h-4 rounded w-5/6"></div>
                </div>
              ) : generatedContent && (
                <div className="prose prose-sm max-w-none">
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {generatedContent.content}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3 mt-6">
                <Button onClick={handleTryDemo} className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Try Live Demo
                </Button>
                <Button variant="outline" onClick={handleRequestQuote}>
                  Request Quote
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Main Screenshot */}
              <div className="aspect-[9/16] bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border-2 border-dashed border-primary/20 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Smartphone className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Interactive Demo Preview</p>
                  <p className="text-xs">Live demo coming soon</p>
                </div>
              </div>
              
              {/* Additional Screenshots */}
              <div className="grid grid-cols-3 gap-2">
                {mockScreenshots.map((screenshot, index) => (
                  <div key={index} className="aspect-[9/16] bg-muted rounded border"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="features" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="customization">Customization</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Key Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {template.keyFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{feature}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Ideal For
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {template.idealFor.map((audience, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                        <Star className="h-4 w-4 text-primary" />
                        <span>{audience}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      Base Template
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">
                      {formatPrice(template.pricing.base)}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Ready-to-deploy template with standard features
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        All core features included
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Basic branding customization
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        3 months support
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      With Customization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">
                      {formatPrice(template.pricing.customization)}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Fully customized to your brand and requirements
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Everything in base template
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Custom design & branding
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Additional features
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        6 months support
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Delivery Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Base Template</div>
                        <div className="text-sm text-muted-foreground">2-3 weeks</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">With Customization</div>
                        <div className="text-sm text-muted-foreground">4-6 weeks</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customization" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customization Options</CardTitle>
                  <CardDescription>
                    Transform this template to match your exact needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Design Customizations</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Custom color scheme and branding</li>
                        <li>• Logo integration and brand assets</li>
                        <li>• Custom typography and styling</li>
                        <li>• Layout modifications</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Feature Additions</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Third-party integrations</li>
                        <li>• Advanced analytics</li>
                        <li>• Custom workflows</li>
                        <li>• Additional user roles</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="support" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      What's Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Deployment and setup assistance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Training and documentation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Bug fixes and maintenance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span>Security updates</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Headphones className="h-5 w-5 text-primary" />
                      Support Channels
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <Globe className="h-4 w-4 text-primary mt-0.5" />
                        <span>Email support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Globe className="h-4 w-4 text-primary mt-0.5" />
                        <span>Video call consultations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Globe className="h-4 w-4 text-primary mt-0.5" />
                        <span>Knowledge base access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Globe className="h-4 w-4 text-primary mt-0.5" />
                        <span>Priority response time</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* CTA Section */}
          <Card className="mt-12">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Transform your business with this proven template. Get a custom quote 
                tailored to your specific needs and timeline.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleRequestQuote} size="lg" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Get Custom Quote
                </Button>
                <Button variant="outline" size="lg" onClick={handleTryDemo}>
                  <Play className="h-4 w-4 mr-2" />
                  Try Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TemplatePreview;