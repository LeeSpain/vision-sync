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

  // Extract clean business content from description
  const cleanDescription = project.description?.split('.')[0] + '.' || '';
  
  // Create structured content sections from the description
  const getContentSections = (description: string) => {
    const sections = [];
    
    if (description.includes('Curated Property Listings')) {
      sections.push({
        title: "Curated Property Listings",
        content: "A selection of homes with detailed descriptions, high-quality photos, and key information on size, features, and location."
      });
    }
    
    if (description.includes('Personalized Guidance')) {
      sections.push({
        title: "Personalized Guidance", 
        content: "Support for buyers, renters, and investors to help you navigate the Spanish property market."
      });
    }
    
    if (description.includes('International Client Focus')) {
      sections.push({
        title: "International Client Focus",
        content: "Services tailored for both local and overseas clients who may be new to purchasing or renting in Spain."
      });
    }
    
    if (description.includes('End-to-End Support')) {
      sections.push({
        title: "End-to-End Support",
        content: "From your first search to finalizing the deal, we connect you with the right people, resources, and advice."
      });
    }
    
    return sections;
  };

  const contentSections = getContentSections(project.description || '');

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
              {cleanDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {project.demo_url && (
                <Button 
                  size="lg" 
                  className="bg-white text-royal-purple hover:bg-white/90 font-semibold px-8 py-4 text-lg"
                  onClick={handleViewWebsite}
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  View Platform
                </Button>
              )}
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-royal-purple font-semibold px-8 py-4 text-lg"
                onClick={handleContact}
              >
                <Users className="h-5 w-5 mr-2" />
                Contact Us
              </Button>
            </div>
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
                Experience our property search platform in action
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

      {/* Platform Information */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-white/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-midnight-navy mb-6 font-heading">
              How We Help You Find Your Perfect Home
            </h2>
            <p className="text-xl text-cool-gray max-w-3xl mx-auto leading-relaxed">
              Our comprehensive platform provides everything you need for your Spanish property journey
            </p>
          </div>
          
          {contentSections.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {contentSections.map((section, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-card hover:shadow-hover transition-all duration-300">
                  <h3 className="text-2xl font-bold text-midnight-navy mb-4 font-heading">
                    {section.title}
                  </h3>
                  <p className="text-cool-gray leading-relaxed text-lg">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          )}
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