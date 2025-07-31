import { useState } from 'react';
import { supabaseLeadManager } from '@/utils/supabaseLeadManager';

interface ProjectInquiryData {
  projectName: string;
  inquiryType: 'investment' | 'purchase' | 'demo' | 'partnership';
  name: string;
  email: string;
  company?: string;
  message?: string;
}

export const useProjectInquiry = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitInquiry = async (data: ProjectInquiryData) => {
    setIsSubmitting(true);
    
    try {
      // Save lead with project-specific data
      const lead = await supabaseLeadManager.saveProjectLead({
        project_id: data.projectName, // Using project name as ID for now
        name: data.name,
        email: data.email,
        company: data.company,
        message: data.message,
        inquiry_type: data.inquiryType
      });

      // Show success message based on inquiry type
      const messages = {
        investment: 'Thank you for your investment interest! We\'ll send you detailed financial information within 24 hours.',
        purchase: 'Thank you for your purchase inquiry! We\'ll provide pricing and licensing details soon.',
        demo: 'Thank you for requesting a demo! We\'ll schedule a personalized demonstration for you.',
        partnership: 'Thank you for your partnership interest! We\'ll discuss collaboration opportunities with you.'
      };

      alert(messages[data.inquiryType]);
      return { success: true, lead };
    } catch (error) {
      alert('Something went wrong. Please try again.');
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitInquiry,
    isSubmitting
  };
};