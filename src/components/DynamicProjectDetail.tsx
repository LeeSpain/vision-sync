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

  // Extract the opening paragraph from description
  const getIntroText = (description: string) => {
    const paragraphs = description.split('\n\n');
    return paragraphs[0] || '';
  };

  // Extract structured content sections from the description
  const getContentSections = (description: string) => {
    const sections = [];
    
    // Parse "We focus on offering:" section
    if (description.includes('We focus on offering:')) {
      const focusSection = description.split('We focus on offering:')[1];
      if (focusSection) {
        const howItWorksIndex = focusSection.indexOf('How It Works');
        const focusContent = howItWorksIndex > -1 
          ? focusSection.substring(0, howItWorksIndex) 
          : focusSection;
        
        // Extract each focus area with its full description
        const focusAreas = focusContent.split('\n\n').filter(item => item.trim());
        
        focusAreas.forEach(area => {
          const lines = area.split(':');
          if (lines.length >= 2) {
            const title = lines[0].trim();
            const content = lines.slice(1).join(':').trim();
            if (title && content) {
              sections.push({ title, content });
            }
          }
        });
      }
    }
    
    return sections;
  };

  // Extract How It Works section
  const getHowItWorks = (description: string) => {
    if (description.includes('How It Works')) {
      const howItWorksSection = description.split('How It Works')[1];
      if (howItWorksSection) {
        const missionIndex = howItWorksSection.indexOf('At AI Spain Homes, our mission');
        const content = missionIndex > -1 
          ? howItWorksSection.substring(0, missionIndex) 
          : howItWorksSection;
        
        const steps = content.split('\n\n').filter(step => step.trim() && step.includes('–'));
        return steps.map(step => {
          const parts = step.split('–');
          return {
            title: parts[0].trim(),
            content: parts.slice(1).join('–').trim()
          };
        });
      }
    }
    return [];
  };

  // Extract mission statement
  const getMissionStatement = (description: string) => {
    const missionMatch = description.match(/At AI Spain Homes, our mission is to[^.]*\./);
    return missionMatch ? missionMatch[0] : '';
  };

  const introText = getIntroText(project.description || '');
  const contentSections = getContentSections(project.description || '');
  const howItWorksSteps = getHowItWorks(project.description || '');
  const missionStatement = getMissionStatement(project.description || '');

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

      {/* What We Offer Section */}
      {contentSections.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-white/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-midnight-navy mb-6 font-heading">
                What We Offer
              </h2>
              <p className="text-xl text-cool-gray max-w-3xl mx-auto leading-relaxed">
                We focus on providing comprehensive support for your Spanish property journey
              </p>
            </div>
            
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
          </div>
        </section>
      )}

      {/* How It Works Section */}
      {howItWorksSteps.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-midnight-navy mb-6 font-heading">
                How It Works
              </h2>
              <p className="text-xl text-cool-gray max-w-3xl mx-auto leading-relaxed">
                Our simple 4-step process to find your perfect property in Spain
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorksSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-midnight-navy mb-4 font-heading">
                    {step.title}
                  </h3>
                  <p className="text-cool-gray leading-relaxed">
                    {step.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mission Statement Section */}
      {missionStatement && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-white/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-midnight-navy mb-8 font-heading">
              Our Mission
            </h2>
            <p className="text-2xl text-cool-gray leading-relaxed italic">
              {missionStatement}
            </p>
          </div>
        </section>
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