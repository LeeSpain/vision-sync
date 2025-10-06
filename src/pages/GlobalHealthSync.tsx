import { useEffect } from 'react';
import { 
  ProjectPageTemplate,
  HeroBanner,
  OverviewSection,
  FeatureGrid,
  InvestmentSection,
  StatsShowcase
} from '@/components/project-template';
import SEOHead from '@/components/SEOHead';
import { generateOrganizationSchema, generateWebPageSchema, generateSoftwareApplicationSchema } from '@/utils/structuredData';
import { supabaseLeadManager } from '@/utils/supabaseLeadManager';
import { useCurrency } from '@/contexts/CurrencyContext';
import { analytics } from '@/utils/analytics';
import { 
  Globe2, 
  Shield, 
  Users, 
  Zap, 
  HeartPulse, 
  Database, 
  Network, 
  TrendingUp,
  Play,
  Mail,
  Activity,
  Languages,
  Lock,
  Eye,
  ExternalLink
} from 'lucide-react';

const GlobalHealthSync = () => {
  const { formatPrice } = useCurrency();
  
  useEffect(() => {
    analytics.trackPageView('/global-health-sync');
  }, []);
  
  const handleViewDemo = async () => {
    await supabaseLeadManager.saveProjectLead({
      project_id: 'global-health-sync',
      name: 'Demo Request',
      email: 'demo@placeholder.com', // Would normally be from a form
      inquiry_type: 'demo',
      message: 'Requested demo from project page'
    });
    alert('Demo request captured! In a real implementation, this would show a form to collect contact details.');
  };

  const handleInvestmentInfo = async () => {
    await supabaseLeadManager.saveProjectLead({
      project_id: 'global-health-sync',
      name: 'Investment Inquiry',
      email: 'investment@placeholder.com', // Would normally be from a form
      inquiry_type: 'investment',
      message: 'Requested investment information from project page'
    });
    alert('Investment inquiry captured! In a real implementation, this would show a form to collect investor details.');
  };

  const handleContactUs = async () => {
    await supabaseLeadManager.saveProjectLead({
      project_id: 'global-health-sync',
      name: 'General Inquiry',
      email: 'contact@placeholder.com', // Would normally be from a form
      inquiry_type: 'partnership',
      message: 'General contact request from project page'
    });
    alert('Contact request captured! In a real implementation, this would show a contact form.');
  };

  const platformHighlights = [
    { icon: Languages, title: 'Multi-language Support', value: '25+ Languages' },
    { icon: Shield, title: 'Compliance', value: 'HIPAA, GDPR, HL7' },
    { icon: Zap, title: 'Real-time Sync', value: '<50ms latency' },
    { icon: Network, title: 'Global Network', value: '150+ Countries' },
  ];

  const platformStats = [
    { icon: Users, label: 'Healthcare Partners', value: '2,500+' },
    { icon: Globe2, label: 'Countries', value: '150+' },
    { icon: Activity, label: 'Daily Syncs', value: '1M+' },
    { icon: Lock, label: 'Security Score', value: '99.9%' },
  ];

  const features = [
    {
      icon: Users,
      title: 'Patient Management',
      description: 'Unified patient records with cross-border accessibility and real-time updates for comprehensive care coordination.'
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'Enterprise-grade security with multi-region compliance, end-to-end encryption, and audit trails.'
    },
    {
      icon: Network,
      title: 'Global Network',
      description: 'Connect with healthcare professionals and institutions worldwide through standardized protocols.'
    },
  ];

  const investmentMetrics = {
    seeking: formatPrice(2500000),
    stage: 'MVP Stage',
    market: `${formatPrice(50000000000)} Market`,
    timeline: '18 months',
    roi: '300% projected',
  };

  return (
    <>
      <SEOHead
        title="Global Health-Sync | Healthcare Collaboration Platform"
        description="Revolutionary healthcare synchronization platform connecting medical professionals worldwide. Real-time patient data sync, cross-border consultations, HIPAA & GDPR compliant. Join 2,500+ healthcare partners."
        keywords="healthcare collaboration platform, medical data synchronization, global health tech, telemedicine platform, HIPAA compliant, patient data management, healthcare interoperability"
        canonical="https://vision-sync-forge.lovable.app/global-health-sync"
        ogImage="https://vision-sync-forge.lovable.app/favicon.png"
        structuredData={[
          generateOrganizationSchema(),
          generateWebPageSchema({
            name: "Global Health-Sync - Healthcare Collaboration Platform",
            description: "Secure, real-time healthcare collaboration and patient data management platform connecting 150+ countries",
            url: "https://vision-sync-forge.lovable.app/global-health-sync"
          }),
          generateSoftwareApplicationSchema({
            name: "Global Health-Sync",
            description: "Healthcare synchronization platform for secure patient data management and medical collaboration",
            applicationCategory: "HealthApplication"
          })
        ]}
      />
      <ProjectPageTemplate>
        <HeroBanner
        title="Global Health-Sync"
        description="Revolutionary healthcare synchronization platform connecting medical professionals worldwide through secure, real-time collaboration tools and unified patient data management."
        status="MVP"
        category="Investment"
        primaryCTA={{
          text: 'View Live Demo',
          action: handleViewDemo,
          icon: Play,
        }}
        secondaryCTA={{
          text: 'Investment Info',
          action: handleInvestmentInfo,
          icon: TrendingUp,
        }}
      />

      <OverviewSection
        title="Transforming Global Healthcare Unity"
        content="Global Health-Sync bridges the gap between healthcare systems worldwide, enabling seamless communication and collaboration between medical professionals regardless of geographic location or institutional barriers. Our platform facilitates real-time patient data synchronization, cross-border medical consultations, and global health trend analysis, all while maintaining the highest standards of security and regulatory compliance. With advanced AI-powered insights and multi-language support, we're creating a truly unified healthcare ecosystem."
        highlights={platformHighlights}
        stats={platformStats}
      />

      <FeatureGrid
        title="Core Platform Features"
        description="Comprehensive suite of tools designed for modern healthcare collaboration and patient care coordination"
        features={features}
      />

      <InvestmentSection
        title="Strategic Investment Opportunity"
        description="Join us in revolutionizing global healthcare connectivity and creating the future of medical collaboration"
        metrics={investmentMetrics}
        onRequestDetails={handleInvestmentInfo}
      />
      </ProjectPageTemplate>
    </>
  );
};

export default GlobalHealthSync;