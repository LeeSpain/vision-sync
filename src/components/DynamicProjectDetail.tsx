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

  // Transform technologies into business features
  const features = project.technologies?.map(tech => ({
    icon: getFeatureIcon(tech),
    title: tech,
    description: `Powered by ${tech} for optimal performance and reliability`
  })) || [];

  // Create business highlights from project data
  const highlights = [
    ...(project.demo_url ? [{ icon: Globe, title: "Live Platform", value: "Available" }] : []),
    ...(project.technologies?.length ? [{ icon: Monitor, title: "Technologies", value: `${project.technologies.length}+` }] : []),
    { icon: Shield, title: "Professional", value: "Grade" }
  ];

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
      {/* Professional Hero Banner */}
      <HeroBanner
        title={project.title}
        description={project.description || ''}
        status="Live"
        category="Featured"
        heroImage={project.image_url}
        primaryCTA={{
          text: project.demo_url ? "View Website" : "Learn More",
          action: project.demo_url ? handleViewWebsite : handleLearnMore,
          icon: project.demo_url ? ExternalLink : Monitor
        }}
        secondaryCTA={{
          text: "Contact Us",
          action: handleContact,
          icon: Users
        }}
      />

      {/* Website Preview */}
      {project.demo_url && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-white/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-midnight-navy mb-4 font-heading">
                Live Platform Preview
              </h2>
              <p className="text-lg text-cool-gray">
                Experience the platform in action
              </p>
            </div>
            <WebsitePreview 
              url={project.demo_url} 
              title={project.title}
              className="mb-8"
            />
          </div>
        </section>
      )}

      {/* Overview Section */}
      <OverviewSection
        title="Platform Overview"
        content={project.description || ''}
        highlights={highlights}
      />

      {/* Features Grid */}
      {features.length > 0 && (
        <FeatureGrid
          title="Platform Features"
          description="Built with cutting-edge technology for optimal performance"
          features={features}
        />
      )}
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