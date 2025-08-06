import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { projectManager, type Project } from '@/utils/projectManager';
import { supabaseLeadManager } from '@/utils/supabaseLeadManager';
import { 
  ProjectPageTemplate,
  HeroBanner,
  OverviewSection,
  FeatureGrid,
  InvestmentSection,
  PurchaseSection,
  StatsShowcase,
  UseCaseGrid
} from '@/components/project-template';
import { 
  Play, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  ExternalLink,
  Mail,
  Phone
} from 'lucide-react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const DynamicProjectPage = () => {
  const { projectRoute } = useParams<{ projectRoute: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadProject();
  }, [projectRoute]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const projects = await projectManager.getAllProjects();
      
      // Find project by route or generate route from name
      const foundProject = projects.find(p => {
        const projectRouteMatch = p.route === `/${projectRoute}`;
        const generatedRoute = `/${p.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        return projectRouteMatch || generatedRoute === `/${projectRoute}`;
      });

      if (foundProject) {
        setProject(foundProject);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error loading project:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoRequest = async () => {
    if (!project) return;
    
    try {
      await supabaseLeadManager.saveProjectLead({
        project_id: project.id,
        name: 'Demo Request',
        email: 'demo@placeholder.com',
        inquiry_type: 'demo',
        message: 'Requested demo from project page'
      });
      
      // Increment lead count
      await projectManager.incrementLeadCount(project.name);
      alert('Demo request captured! In a real implementation, this would show a form to collect contact details.');
    } catch (error) {
      console.error('Error handling demo request:', error);
      alert('Error processing request. Please try again.');
    }
  };

  const handleInvestmentInfo = async () => {
    if (!project) return;
    
    try {
      await supabaseLeadManager.saveProjectLead({
        project_id: project.id,
        name: 'Investment Inquiry',
        email: 'investment@placeholder.com',
        inquiry_type: 'investment',
        message: 'Requested investment information from project page'
      });
      
      await projectManager.incrementLeadCount(project.name);
      alert('Investment inquiry captured! In a real implementation, this would show a form to collect investor details.');
    } catch (error) {
      console.error('Error handling investment request:', error);
      alert('Error processing request. Please try again.');
    }
  };

  const handlePurchaseInquiry = async () => {
    if (!project) return;
    
    try {
      await supabaseLeadManager.saveProjectLead({
        project_id: project.id,
        name: 'Purchase Inquiry',
        email: 'purchase@placeholder.com',
        inquiry_type: 'purchase',
        message: 'Requested purchase information from project page'
      });
      
      await projectManager.incrementLeadCount(project.name);
      alert('Purchase inquiry captured! In a real implementation, this would show a form to collect purchase details.');
    } catch (error) {
      console.error('Error handling purchase request:', error);
      alert('Error processing request. Please try again.');
    }
  };

  const handleContactUs = async () => {
    if (!project) return;
    
    try {
      await supabaseLeadManager.saveProjectLead({
        project_id: project.id,
        name: 'General Inquiry',
        email: 'contact@placeholder.com',
        inquiry_type: 'partnership',
        message: 'General contact request from project page'
      });
      
      await projectManager.incrementLeadCount(project.name);
      alert('Contact request captured! In a real implementation, this would show a contact form.');
    } catch (error) {
      console.error('Error handling contact request:', error);
      alert('Error processing request. Please try again.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse space-y-8 w-full max-w-4xl mx-auto px-4">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Not found - redirect to 404
  if (notFound || !project) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-midnight-navy mb-4">Project Not Found</h1>
            <p className="text-cool-gray mb-8">The project you're looking for doesn't exist or is not publicly available.</p>
            <Button variant="hero" onClick={() => window.location.href = '/'}>
              Return Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Parse content with fallbacks
  const content = project.content as any || {};
  const keyFeatures = project.key_features as any[] || [];
  const stats = project.stats as any[] || [];
  const useCases = project.use_cases as any[] || [];
  const purchaseInfo = project.purchase_info as any || {};

  // Determine primary and secondary CTAs based on category and status
  const getPrimaryCTA = () => {
    if (project.category === 'For Sale' || project.status === 'For Sale') {
      return {
        text: 'Purchase License',
        action: handlePurchaseInquiry,
        icon: DollarSign,
      };
    }
    if (project.category === 'Investment') {
      return {
        text: 'View Demo',
        action: handleDemoRequest,
        icon: Play,
      };
    }
    return {
      text: 'Learn More',
      action: handleContactUs,
      icon: Eye,
    };
  };

  const getSecondaryCTA = () => {
    if (project.category === 'Investment') {
      return {
        text: 'Investment Info',
        action: handleInvestmentInfo,
        icon: TrendingUp,
      };
    }
    if (project.category === 'For Sale') {
      return {
        text: 'Request Demo',
        action: handleDemoRequest,
        icon: Play,
      };
    }
    return {
      text: 'Contact Us',
      action: handleContactUs,
      icon: Mail,
    };
  };

  // If project has rich content, use template system
  if (keyFeatures.length > 0 || content.overview) {
    return (
      <ProjectPageTemplate>
        <HeroBanner
          title={project.name}
          description={project.description || 'No description available'}
          status={project.status as any}
          category={project.category as any}
          heroImage={project.hero_image_url}
          primaryCTA={getPrimaryCTA()}
          secondaryCTA={getSecondaryCTA()}
        />

        {content.overview && (
          <OverviewSection
            title={content.title || 'Overview'}
            content={content.overview}
            highlights={content.highlights || []}
            stats={stats}
          />
        )}

        {keyFeatures.length > 0 && (
          <FeatureGrid
            title="Key Features"
            description="Core capabilities and features"
            features={keyFeatures}
          />
        )}

        {useCases.length > 0 && (
          <UseCaseGrid
            title="Use Cases"
            description="Real-world applications and scenarios"
            useCases={useCases}
          />
        )}

        {project.category === 'Investment' && (
          <InvestmentSection
            title="Investment Opportunity"
            description="Join us in bringing this vision to market"
            metrics={{
              seeking: purchaseInfo.investment_amount || project.investment_amount?.toString() || 'Contact for details',
              stage: project.status,
              market: purchaseInfo.market_size || 'Growing market',
              timeline: purchaseInfo.timeline || 'Contact for timeline',
              roi: purchaseInfo.projected_roi || 'Significant potential',
              investmentReceived: (project as any).investment_received || 0,
              investmentAmount: project.investment_amount || 0,
            }}
            onRequestDetails={handleInvestmentInfo}
          />
        )}

        {(project.category === 'For Sale' || project.status === 'For Sale') && project.price && (
          <PurchaseSection
            title="Available for Purchase"
            description="Get immediate access to this solution"
            pricing={{
              amount: project.price,
              period: purchaseInfo.license_type || 'Full License',
            }}
            includes={purchaseInfo.includes || ['Source code', 'Documentation', 'Support']}
            onPurchase={handlePurchaseInquiry}
          />
        )}

        {stats.length > 0 && (
          <StatsShowcase
            title="Performance Metrics"
            stats={stats}
          />
        )}
      </ProjectPageTemplate>
    );
  }

  // Fallback simple page for projects without rich content
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4">{project.status}</Badge>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-midnight-navy mb-6">
            {project.name}
          </h1>
          <p className="text-xl text-cool-gray mb-8 max-w-2xl mx-auto">
            {project.description || 'No description available'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" onClick={getPrimaryCTA().action}>
              {React.createElement(getPrimaryCTA().icon, { className: "h-5 w-5" })}
              {getPrimaryCTA().text}
            </Button>
            <Button variant="view" size="lg" onClick={getSecondaryCTA().action}>
              {React.createElement(getSecondaryCTA().icon, { className: "h-5 w-5" })}
              {getSecondaryCTA().text}
            </Button>
          </div>
        </div>
      </section>

      {/* Simple Content Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Project Details</CardTitle>
              <CardDescription>
                Learn more about this {project.category.toLowerCase()} project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-midnight-navy mb-2">Category</h3>
                  <p className="text-cool-gray">{project.category}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-midnight-navy mb-2">Status</h3>
                  <Badge>{project.status}</Badge>
                </div>
                {project.investment_amount && (
                  <div>
                    <h3 className="font-semibold text-midnight-navy mb-2">Investment Amount</h3>
                    <p className="text-cool-gray">${project.investment_amount.toLocaleString()}</p>
                  </div>
                )}
                {project.price && (
                  <div>
                    <h3 className="font-semibold text-midnight-navy mb-2">Price</h3>
                    <p className="text-cool-gray">${project.price.toLocaleString()}</p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button onClick={handleContactUs} className="flex-1">
                  <Mail className="h-4 w-4" />
                  Contact Us
                </Button>
                <Button variant="outline" onClick={handleDemoRequest} className="flex-1">
                  <Eye className="h-4 w-4" />
                  Request Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DynamicProjectPage;