import { useEffect } from 'react';
import { useSEO, SEOConfig } from '@/hooks/useSEO';

interface SEOHeadProps extends SEOConfig {
  structuredData?: object[];
}

/**
 * Component for managing page SEO including meta tags and structured data
 */
const SEOHead = ({ structuredData, ...seoConfig }: SEOHeadProps) => {
  // Apply SEO meta tags
  useSEO(seoConfig);

  // Inject structured data
  useEffect(() => {
    if (!structuredData || structuredData.length === 0) return;

    // Create script elements for each structured data object
    const scripts = structuredData.map((data, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = `structured-data-${index}`;
      script.text = JSON.stringify(data);
      document.head.appendChild(script);
      return script;
    });

    // Cleanup function to remove scripts when component unmounts
    return () => {
      scripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, [structuredData]);

  return null;
};

export default SEOHead;
