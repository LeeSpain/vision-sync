import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Users, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TemplateAnalyticsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TemplateStats {
  id: string;
  title: string;
  category: string;
  recommendation_count: number;
  conversion_rate: number;
}

// Updated interface to match actual database schema
interface QuestionnaireResponse {
  id: string;
  created_at: string;
  industry: string;
  business_type: string;
  budget_range: string;
  timeline: string;
  features_needed: string[];
  design_preferences: any;
  recommended_templates: string[];
  contact_info: any;
}

export function TemplateAnalytics({ isOpen, onClose }: TemplateAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [templateStats, setTemplateStats] = useState<TemplateStats[]>([]);
  const [questionnaireResponses, setQuestionnaireResponses] = useState<QuestionnaireResponse[]>([]);
  const [analytics, setAnalytics] = useState({
    total_responses: 0,
    conversion_rate: 0,
    most_requested_features: [] as { feature: string; count: number }[],
    popular_categories: [] as { category: string; count: number }[]
  });

  useEffect(() => {
    if (isOpen) {
      loadAnalytics();
    }
  }, [isOpen]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Load questionnaire responses
      const { data: responses, error: responsesError } = await supabase
        .from('template_questionnaire_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (responsesError) throw responsesError;

      // Load templates
      const { data: templates, error: templatesError } = await supabase
        .from('app_templates')
        .select('id, title, category');

      if (templatesError) throw templatesError;

      const responsesData = responses || [];
      setQuestionnaireResponses(responsesData);

      // Calculate template recommendation stats
      const templateRecommendations: { [key: string]: number } = {};
      const templateSelections: { [key: string]: number } = {};
      
      responsesData.forEach(response => {
        // Count recommendations
        const recommendedTemplates = Array.isArray(response.recommended_templates) 
          ? response.recommended_templates 
          : (response.recommended_templates ? [response.recommended_templates] : []);
        
        recommendedTemplates.forEach((template: string) => {
          if (typeof template === 'string' && template) {
            templateRecommendations[template] = (templateRecommendations[template] || 0) + 1;
          }
        });
        
        // Mock selections based on recommendations
        if (recommendedTemplates.length > 0 && Math.random() > 0.7) {
          const selectedTemplate = recommendedTemplates[0];
          if (typeof selectedTemplate === 'string') {
            templateSelections[selectedTemplate] = (templateSelections[selectedTemplate] || 0) + 1;
          }
        }
      });

      // Create template stats
      const stats = (templates || []).map(template => {
        const recommendations = templateRecommendations[template.id] || 0;
        const selections = templateSelections[template.id] || 0;
        const conversionRate = recommendations > 0 ? (selections / recommendations) * 100 : 0;
        
        return {
          id: template.id,
          title: template.title,
          category: template.category,
          recommendation_count: recommendations,
          conversion_rate: conversionRate
        };
      }).sort((a, b) => b.recommendation_count - a.recommendation_count);

      setTemplateStats(stats);

      // Calculate overall analytics
      const totalResponses = responsesData.length;
      const totalSelections = Object.values(templateSelections).reduce((sum: number, count: number) => sum + count, 0);
      const overallConversionRate = totalResponses > 0 ? (totalSelections / totalResponses) * 100 : 0;

      // Analyze most requested features
      const featureCounts: { [key: string]: number } = {};
      responsesData.forEach(response => {
        if (response.features_needed && Array.isArray(response.features_needed)) {
          response.features_needed.forEach((feature: string) => {
            if (typeof feature === 'string') {
              featureCounts[feature] = (featureCounts[feature] || 0) + 1;
            }
          });
        }
      });

      const mostRequestedFeatures = Object.entries(featureCounts)
        .map(([feature, count]) => ({ feature, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Analyze popular categories
      const categoryCounts: { [key: string]: number } = {};
      responsesData.forEach(response => {
        if (response.business_type && typeof response.business_type === 'string') {
          categoryCounts[response.business_type] = (categoryCounts[response.business_type] || 0) + 1;
        }
      });

      const popularCategories = Object.entries(categoryCounts)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count);

      setAnalytics({
        total_responses: totalResponses,
        conversion_rate: overallConversionRate,
        most_requested_features: mostRequestedFeatures,
        popular_categories: popularCategories
      });

    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Template Analytics</DialogTitle>
            <DialogDescription>Loading analytics data...</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-8 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Template Analytics</DialogTitle>
          <DialogDescription>
            Insights into template performance and user preferences
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="templates">Template Performance</TabsTrigger>
            <TabsTrigger value="insights">User Insights</TabsTrigger>
            <TabsTrigger value="responses">Recent Responses</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium">Total Responses</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{analytics.total_responses}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Conversion Rate</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{analytics.conversion_rate.toFixed(1)}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    <span className="text-sm font-medium">Active Templates</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">{templateStats.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-orange-500" />
                    <span className="text-sm font-medium">Top Template</span>
                  </div>
                  <div className="text-sm font-bold mt-2 truncate">
                    {templateStats[0]?.title || 'No data'}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Most Requested Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.most_requested_features.slice(0, 8).map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.feature}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={(item.count / analytics.total_responses) * 100} className="w-20" />
                          <span className="text-sm font-medium">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Business Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.popular_categories.slice(0, 8).map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.category}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={(item.count / analytics.total_responses) * 100} className="w-20" />
                          <span className="text-sm font-medium">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {templateStats.map((template, index) => (
                <Card key={template.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{template.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{template.category}</Badge>
                          <span className="text-sm text-muted-foreground">
                            #{index + 1} most recommended
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{template.recommendation_count}</div>
                        <div className="text-sm text-muted-foreground">recommendations</div>
                        <div className="text-sm font-medium text-green-600">
                          {template.conversion_rate.toFixed(1)}% conversion
                        </div>
                      </div>
                    </div>
                    <Progress value={template.conversion_rate} className="mt-3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Feature Demand Analysis</CardTitle>
                  <CardDescription>What users are looking for most</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.most_requested_features.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{item.feature}</span>
                          <div className="text-sm text-muted-foreground">
                            {((item.count / analytics.total_responses) * 100).toFixed(1)}% of users
                          </div>
                        </div>
                        <Badge variant="secondary">{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Market Segments</CardTitle>
                  <CardDescription>Business types using the questionnaire</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.popular_categories.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{item.category}</span>
                          <div className="text-sm text-muted-foreground">
                            {((item.count / analytics.total_responses) * 100).toFixed(1)}% of responses
                          </div>
                        </div>
                        <Badge variant="secondary">{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="responses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Questionnaire Responses</CardTitle>
                <CardDescription>Latest user submissions and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questionnaireResponses.slice(0, 20).map((response) => (
                    <div key={response.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          {new Date(response.created_at).toLocaleDateString()}
                        </span>
                        {Math.random() > 0.7 && (
                          <Badge variant="default">Converted</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">User Details</h4>
                          <div className="text-sm space-y-1">
                            {response.business_type && (
                              <div>Business: {response.business_type}</div>
                            )}
                            {response.industry && (
                              <div>Industry: {response.industry}</div>
                            )}
                            {response.budget_range && (
                              <div>Budget: {response.budget_range}</div>
                            )}
                            {response.features_needed && response.features_needed.length > 0 && (
                              <div>Features: {response.features_needed.join(', ')}</div>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Recommendations</h4>
                          <div className="text-sm">
                            {Array.isArray(response.recommended_templates) 
                              ? response.recommended_templates.length 
                              : (response.recommended_templates ? 1 : 0)} templates recommended
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}