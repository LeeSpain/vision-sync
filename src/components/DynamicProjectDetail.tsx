import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Project, projectManager } from '@/utils/projectManager';
import { ProjectPageTemplate, HeroBanner, OverviewSection, FeatureGrid } from '@/components/project-template';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { ArrowLeft, ExternalLink, Monitor, Globe, Users, Shield, Clock, Smartphone } from 'lucide-react';
import WebsitePreview from '@/components/WebsitePreview';

export default function DynamicProjectDetail() {
  const { projectRoute } = useParams<{ projectRoute: string }>();
  const location = useLocation();
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

  // Simple content extraction for clean display
  const getIntroText = (description: string) => {
    if (!description) return '';
    const paragraphs = description.split('\n\n');
    return paragraphs[0] || '';
  };

  const introText = getIntroText(project.description || '');

  const handleViewWebsite = () => {
    if (project.demo_url) {
      window.open(project.demo_url, '_blank');
    }
  };

  const handleLearnMore = () => {
    // Scroll to overview section
    document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContact = () => {
    // Navigate to contact or open contact modal
    window.location.href = '/contact';
  };

  return (
    <ProjectPageTemplate>
      {/* Clean Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-royal-purple via-electric-blue to-emerald-green">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 tracking-tight">
              {project.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              {introText}
            </p>
          </div>
        </div>
      </section>

      {/* Website Preview Section */}
      {project.demo_url && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-midnight-navy mb-4 font-heading">
                Live Platform Preview
              </h2>
              <p className="text-xl text-cool-gray max-w-2xl mx-auto">
                Experience the platform in action
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-elegant p-8">
              <WebsitePreview 
                url={project.demo_url} 
                title={project.title}
                className="rounded-xl overflow-hidden"
              />
            </div>
          </div>
        </section>
      )}

      {/* About This Project Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-white/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-midnight-navy mb-6 font-heading">
              About This Project
            </h2>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-card">
            <div className="space-y-6">
              {/* Full Description */}
              <div>
                <h3 className="text-2xl font-bold text-midnight-navy mb-4 font-heading">
                  Description
                </h3>
                <div className="text-cool-gray leading-relaxed text-lg whitespace-pre-line">
                  {project.description}
                </div>
              </div>

              {/* Project Details */}
              <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-white">
                {project.category && (
                  <div>
                    <h4 className="text-lg font-semibold text-midnight-navy mb-2">Category</h4>
                    <p className="text-cool-gray">{project.category}</p>
                  </div>
                )}
                
                {project.pricing && (
                  <div>
                    <h4 className="text-lg font-semibold text-midnight-navy mb-2">Pricing</h4>
                    <p className="text-cool-gray">
                      {typeof project.pricing === 'object' 
                        ? JSON.stringify(project.pricing, null, 2) 
                        : project.pricing}
                    </p>
                  </div>
                )}
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="md:col-span-2">
                    <h4 className="text-lg font-semibold text-midnight-navy mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="bg-emerald-green/10 text-emerald-green px-3 py-1 rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </ProjectPageTemplate>
  );
}

// Helper function to get appropriate icon for technology features
function getFeatureIcon(tech: string) {
  const techLower = tech.toLowerCase();
  if (techLower.includes('react') || techLower.includes('vue') || techLower.includes('angular')) {
    return Monitor;
  } else if (techLower.includes('mobile') || techLower.includes('ios') || techLower.includes('android')) {
    return Smartphone;
  } else if (techLower.includes('secure') || techLower.includes('auth')) {
    return Shield;
  } else if (techLower.includes('real') || techLower.includes('time')) {
    return Clock;
  } else {
    return Globe;
  }
}