import { useEffect } from 'react';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

/**
 * Hook for managing page-specific SEO meta tags
 * @param config - SEO configuration object
 */
export const useSEO = (config: SEOConfig) => {
  useEffect(() => {
    // Update title
    document.title = config.title;

    // Helper function to update or create meta tag
    const updateMetaTag = (selector: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        const attributeName = selector.includes('property=') ? 'property' : 'name';
        const attributeValue = selector.match(/["']([^"']+)["']/)?.[1];
        if (attributeValue) {
          element.setAttribute(attributeName, attributeValue);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update description
    updateMetaTag('meta[name="description"]', config.description);

    // Update keywords if provided
    if (config.keywords) {
      updateMetaTag('meta[name="keywords"]', config.keywords);
    }

    // Update robots meta
    if (config.noindex || config.nofollow) {
      const robotsContent = [
        config.noindex ? 'noindex' : 'index',
        config.nofollow ? 'nofollow' : 'follow'
      ].join(', ');
      updateMetaTag('meta[name="robots"]', robotsContent);
    }

    // Update Open Graph tags
    updateMetaTag('meta[property="og:title"]', config.ogTitle || config.title);
    updateMetaTag('meta[property="og:description"]', config.ogDescription || config.description);
    updateMetaTag('meta[property="og:type"]', config.ogType || 'website');
    
    if (config.ogImage) {
      updateMetaTag('meta[property="og:image"]', config.ogImage);
    }

    // Update Twitter Card tags
    updateMetaTag('meta[name="twitter:card"]', config.twitterCard || 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', config.twitterTitle || config.title);
    updateMetaTag('meta[name="twitter:description"]', config.twitterDescription || config.description);
    
    if (config.twitterImage || config.ogImage) {
      updateMetaTag('meta[name="twitter:image"]', config.twitterImage || config.ogImage || '');
    }

    // Update canonical URL
    if (config.canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', config.canonical);
    }

    // Cleanup function to prevent memory leaks
    return () => {
      // Meta tags persist across navigation, which is what we want
    };
  }, [config]);
};
