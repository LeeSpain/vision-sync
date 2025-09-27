import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Project, projectManager } from '@/utils/projectManager';
import { ProjectPageTemplate } from '@/components/project-template';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { ArrowLeft, ExternalLink, Github, DollarSign, Users, TrendingUp, Calendar, Monitor } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import WebsitePreview from '@/components/WebsitePreview';

export default function DynamicProjectDetail() {
  const { projectRoute } = useParams<{ projectRoute: string }>();
  const location = useLocation();
  const { formatPrice } = useCurrency();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProject();
  }, [projectRoute, location.pathname]);

  const loadProject = async () => {
    const routeFromParam = projectRoute;
    const routeFromPath = location.pathname.replace(/^\//, '');
    const effectiveRoute = routeFromParam || routeFromPath;

    try {
      setLoading(true);
      setError(null);

      // Try to find project by route first, then by generated route from title
      const allProjects = await projectManager.getAllProjects();
      const foundProject = allProjects.find(p =>
        p.route === `/${effectiveRoute}` ||
        p.route === effectiveRoute ||
        p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === effectiveRoute
      );

      if (foundProject) {
        setProject(foundProject);
      } else {
        setError('Project not found');
      }
    } catch (err) {
      console.error('Error loading project:', err);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-royal-purple via-electric-blue to-emerald-green">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-royal-purple via-electric-blue to-emerald-green">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-destructive">
                {error || 'Project Not Found'}
              </CardTitle>
              <CardDescription>
                The project you're looking for doesn't exist or has been moved.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Link to="/">
                  <Button variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Return Home
                  </Button>
                </Link>
                <Link to="/admin">
                  <Button>
                    Go to Admin
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Convert project to template format
  const templateData = {
    id: project.id,
    name: project.title,
    description: project.description || '',
    image_url: project.image_url,
    hero_image_url: project.image_url,
    status: project.status?.charAt(0).toUpperCase() + project.status?.slice(1) || 'Active',
    category: project.category || '',
    route: project.route || '',
    billing_type: project.billing_type || undefined,
    investment_amount: project.investment_amount || undefined,
    price: project.price || undefined,
    subscription_price: project.subscription_price || undefined,
    subscription_period: project.subscription_period || undefined,
    funding_progress: project.funding_progress || undefined,
    expected_roi: project.expected_roi || undefined,
    investment_deadline: project.investment_deadline || undefined,
    investor_count: project.investor_count || undefined,
    social_proof: project.social_proof || undefined,
    demo_url: project.demo_url,
    github_url: project.github_url,
    technologies: project.technologies || [],
    features: [], // Could be derived from project data
    use_cases: [] // Could be derived from project data
  };

  return (
    <ProjectPageTemplate>
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-royal-purple via-electric-blue to-emerald-green">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
              {project.title}
            </h1>
            {project.description && (
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
                {project.description}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {project.status?.charAt(0).toUpperCase() + project.status?.slice(1)}
              </Badge>
              {project.category && (
                <Badge variant="outline" className="text-lg px-4 py-2 text-white border-white/30">
                  {project.category}
                </Badge>
              )}
              {project.is_featured && (
                <Badge variant="default" className="text-lg px-4 py-2 bg-yellow-500 text-yellow-900">
                  ⭐ Featured
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Website Preview */}
      {project.demo_url && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <WebsitePreview 
              url={project.demo_url} 
              title={project.title}
              className="mb-8"
            />
          </div>
        </section>
      )}

      {/* Project Image */}
      {project.image_url && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <img 
              src={project.image_url} 
              alt={project.title}
              className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-elegant"
            />
          </div>
        </section>
      )}
      
      {/* Additional Project Details */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Project Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {project.description && (
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground">{project.description}</p>
                    </div>
                  )}
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Technologies</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <Badge key={index} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-4">
                    {project.demo_url && (
                      <Link to={project.demo_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Demo
                        </Button>
                      </Link>
                    )}
                    
                    {project.github_url && (
                      <Link to={project.github_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                          <Github className="h-4 w-4 mr-2" />
                          View Source
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Pricing Info */}
              {project.billing_type && project.billing_type !== 'free' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Pricing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {project.billing_type === 'one-time' && project.price && (
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">
                          {formatPrice(project.price)}
                        </div>
                        <div className="text-sm text-muted-foreground">One-time purchase</div>
                        {project.deposit_amount && (
                          <div className="text-sm text-muted-foreground mt-1">
                            Deposit: {formatPrice(project.deposit_amount)}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {project.billing_type === 'subscription' && project.subscription_price && (
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">
                          {formatPrice(project.subscription_price)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          per {project.subscription_period}
                        </div>
                      </div>
                    )}
                    
                    {project.billing_type === 'investment' && project.investment_amount && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary">
                            {formatPrice(project.investment_amount)}
                          </div>
                          <div className="text-sm text-muted-foreground">Investment Required</div>
                        </div>
                        
                        {project.funding_progress !== undefined && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Funding Progress</span>
                              <span>{project.funding_progress}%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${project.funding_progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        {project.expected_roi && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Expected ROI</span>
                            <span className="font-semibold">{project.expected_roi}%</span>
                          </div>
                        )}
                        
                        {project.investor_count !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Investors</span>
                            <span className="font-semibold">{project.investor_count}</span>
                          </div>
                        )}
                        
                        {project.investment_deadline && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Deadline: {new Date(project.investment_deadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Project Meta */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status?.charAt(0).toUpperCase() + project.status?.slice(1)}
                    </Badge>
                  </div>
                  
                  {project.category && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Category</span>
                      <span className="font-medium">{project.category}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Visibility</span>
                    <Badge variant={project.is_public ? 'default' : 'secondary'}>
                      {project.is_public ? 'Public' : 'Private'}
                    </Badge>
                  </div>
                  
                  {project.is_featured && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Featured</span>
                      <Badge variant="default">⭐ Featured</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
              
            </div>
          </div>
        </div>
      </section>
    </ProjectPageTemplate>
  );
}