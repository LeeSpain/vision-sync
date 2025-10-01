/**
 * Utility functions for generating JSON-LD structured data
 */

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Vision-Sync Forge",
  "description": "Professional AI-powered web development and custom software solutions",
  "url": "https://vision-sync-forge.lovable.app",
  "logo": "https://vision-sync-forge.lovable.app/favicon.png",
  "sameAs": [
    // Add social media links here when available
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "email": "contact@vision-sync-forge.com"
  }
});

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const generateServiceSchema = (service: {
  name: string;
  description: string;
  provider?: string;
  areaServed?: string;
  serviceType?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": service.name,
  "description": service.description,
  "provider": {
    "@type": "Organization",
    "name": service.provider || "Vision-Sync Forge"
  },
  "areaServed": service.areaServed || "Worldwide",
  "serviceType": service.serviceType || "Software Development"
});

export const generateProductSchema = (product: {
  name: string;
  description: string;
  image?: string;
  price?: string;
  currency?: string;
  availability?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "image": product.image,
  "offers": {
    "@type": "Offer",
    "price": product.price,
    "priceCurrency": product.currency || "USD",
    "availability": `https://schema.org/${product.availability || "InStock"}`
  }
});

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const generateSoftwareApplicationSchema = (app: {
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem?: string;
  offers?: {
    price: string;
    currency: string;
  };
}) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": app.name,
  "description": app.description,
  "applicationCategory": app.applicationCategory,
  "operatingSystem": app.operatingSystem || "Web Browser",
  "offers": app.offers ? {
    "@type": "Offer",
    "price": app.offers.price,
    "priceCurrency": app.offers.currency
  } : undefined
});

export const generateWebPageSchema = (page: {
  name: string;
  description: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": page.name,
  "description": page.description,
  "url": page.url,
  "publisher": {
    "@type": "Organization",
    "name": "Vision-Sync Forge"
  }
});
