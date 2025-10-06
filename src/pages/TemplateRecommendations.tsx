import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, CheckCircle, ArrowRight, Sparkles, DollarSign, Clock, RefreshCw } from "lucide-react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { appTemplates, type AppTemplate } from "@/utils/appTemplates";
import { analytics } from '@/utils/analytics';
import SEOHead from '@/components/SEOHead';
import { generateOrganizationSchema, generateWebPageSchema } from '@/utils/structuredData';

interface Recommendation {
  templateId: string;
  templateName: string;
  matchScore: number;
  explanation: string;
  customizations: string[];
  estimatedPrice: number;
  timeline: string;
}

interface RecommendationData {
  recommendations: Recommendation[];
  additionalSuggestions: string;
}

const TemplateRecommendations = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);
  const [questionnaireData, setQuestionnaireData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Track page view
    analytics.trackPageView('/template-recommendations');
    
    // Get data from session storage
    const storedRecommendations = sessionStorage.getItem('templateRecommendations');
    const storedQuestionnaire = sessionStorage.getItem('questionnaireData');

    if (storedRecommendations && storedQuestionnaire) {
      setRecommendations(JSON.parse(storedRecommendations));
      setQuestionnaireData(JSON.parse(storedQuestionnaire));
    } else {
      // Redirect to questionnaire if no data
      navigate('/template-finder');
    }
    setLoading(false);
  }, [navigate]);

  const getTemplateById = (templateId: string): AppTemplate | undefined => {
    return appTemplates.find(template => 
      template.id === templateId || 
      template.title.toLowerCase().includes(templateId.toLowerCase())
    );
  };

  const handleViewTemplate = (templateId: string) => {
    const template = getTemplateById(templateId);
    if (template) {
      analytics.trackInteraction('button_click', 'view_template_details', templateId);
      navigate(`/template-preview/${template.id}`);
    }
  };

  const handleRetakeQuestionnaire = () => {
    sessionStorage.removeItem('templateRecommendations');
    sessionStorage.removeItem('questionnaireData');
    navigate('/template-finder');
  };

  const handleRequestQuote = (recommendation: Recommendation) => {
    analytics.trackInteraction('button_click', 'request_quote', recommendation.templateId);
    analytics.trackConversion('interest');
    // Store the selected recommendation and navigate to quote request
    sessionStorage.setItem('selectedRecommendation', JSON.stringify(recommendation));
    navigate('/contact');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your recommendations...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!recommendations || !questionnaireData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">No Recommendations Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find your questionnaire data. Please retake the questionnaire.
            </p>
            <Button onClick={() => navigate('/template-finder')}>
              Take Questionnaire
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <SEOHead
        title="Your Template Recommendations | Vision-Sync Forge"
        description="View your personalized app template recommendations based on your business requirements, budget, and timeline. Find the perfect match for your project."
        keywords="template recommendations, personalized templates, business app templates, custom recommendations"
        canonical="https://vision-sync-forge.lovable.app/template-recommendations"
        structuredData={[
          generateOrganizationSchema(),
          generateWebPageSchema({
            name: "Template Recommendations",
            description: "Personalized app template recommendations",
            url: "https://vision-sync-forge.lovable.app/template-recommendations"
          })
        ]}
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Your Perfect App Templates</h1>
            </div>
            <p className="text-lg text-muted-foreground mb-6">
              Based on your responses, we've found the perfect templates for your business
            </p>
            
            {/* Quick Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-card rounded-lg p-3 border">
                <div className="text-sm text-muted-foreground">Business Type</div>
                <div className="font-semibold capitalize">{questionnaireData.businessType}</div>
              </div>
              <div className="bg-card rounded-lg p-3 border">
                <div className="text-sm text-muted-foreground">Industry</div>
                <div className="font-semibold capitalize">{questionnaireData.industry.replace('-', ' ')}</div>
              </div>
              <div className="bg-card rounded-lg p-3 border">
                <div className="text-sm text-muted-foreground">Budget</div>
                <div className="font-semibold">${questionnaireData.budgetRange}</div>
              </div>
              <div className="bg-card rounded-lg p-3 border">
                <div className="text-sm text-muted-foreground">Timeline</div>
                <div className="font-semibold capitalize">{questionnaireData.timeline}</div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-6 mb-8">
            {recommendations.recommendations.map((rec, index) => {
              const template = getTemplateById(rec.templateId);
              return (
                <Card key={index} className="overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="secondary" className="bg-primary text-primary-foreground">
                            {index === 0 ? 'Best Match' : `#${index + 1} Match`}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-semibold">{rec.matchScore}% Match</span>
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{rec.templateName}</h3>
                        <Progress value={rec.matchScore} className="w-48 h-2 mb-4" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">${rec.estimatedPrice.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Estimated cost</div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Why This Template Fits
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">{rec.explanation}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          Recommended Customizations
                        </h4>
                        <ul className="space-y-2">
                          {rec.customizations.map((customization, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                              <span>{customization}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-6 border-t">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{rec.timeline}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>Fixed pricing</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => handleViewTemplate(rec.templateId)}
                        >
                          View Details
                        </Button>
                        <Button
                          onClick={() => handleRequestQuote(rec)}
                          className="flex items-center gap-2"
                        >
                          Request Quote
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional Suggestions */}
          {recommendations.additionalSuggestions && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Additional Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {recommendations.additionalSuggestions}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={handleRetakeQuestionnaire}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retake Questionnaire
              </Button>
              <Button
                onClick={() => navigate('/templates')}
                className="flex items-center gap-2"
              >
                Browse All Templates
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Not seeing what you need? <Button variant="link" className="p-0 h-auto text-sm" onClick={() => navigate('/custom-builds')}>
                Get a custom solution
              </Button>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TemplateRecommendations;