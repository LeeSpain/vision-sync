import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CustomizationEmailRequest {
  clientInfo: {
    name: string;
    email: string;
    phone: string;
  };
  customizationData: {
    template: any;
    questionnaire: any;
    customization: any;
    estimatedPrice: number;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clientInfo, customizationData }: CustomizationEmailRequest = await req.json();

    // Format features and integrations for display
    const formatFeatures = (features: string[]) => {
      return features.length > 0 ? features.join(', ') : 'None selected';
    };

    const formatIntegrations = (integrations: string[]) => {
      return integrations.length > 0 ? integrations.join(', ') : 'None selected';
    };

    // Format requirements from questionnaire
    const formatRequirements = (requirements: string[]) => {
      return requirements.length > 0 ? requirements.join(', ') : 'None specified';
    };

    // Send email to client
    const clientEmailResponse = await resend.emails.send({
      from: "Vision-Sync Team <customizations@vision-sync.com>",
      to: [clientInfo.email],
      subject: `Your Custom ${customizationData.template.title} App Proposal`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">Thank you for your interest!</h1>
            <p style="color: #666; font-size: 16px;">Here's your personalized app customization proposal</p>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #333; margin-bottom: 15px;">${customizationData.template.title} - Custom Proposal</h2>
            
            <div style="margin-bottom: 20px;">
              <h3 style="color: #555; margin-bottom: 10px;">Your Business Information:</h3>
              <p><strong>Business Type:</strong> ${customizationData.questionnaire.businessType}</p>
              <p><strong>Industry:</strong> ${customizationData.questionnaire.industry}</p>
              <p><strong>Business Size:</strong> ${customizationData.questionnaire.businessSize}</p>
              <p><strong>Tech Comfort Level:</strong> ${customizationData.questionnaire.techComfort}</p>
              <p><strong>Budget Range:</strong> ${customizationData.questionnaire.budgetRange}</p>
              <p><strong>Timeline:</strong> ${customizationData.questionnaire.timeline}</p>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #555; margin-bottom: 10px;">Requested Features:</h3>
              <p>${formatRequirements(customizationData.questionnaire.requirements)}</p>
            </div>

            <div style="margin-bottom: 20px;">
              <h3 style="color: #555; margin-bottom: 10px;">Customization Details:</h3>
              <p><strong>Business Name:</strong> ${customizationData.customization.branding.businessName || 'Not specified'}</p>
              <p><strong>Tagline:</strong> ${customizationData.customization.branding.tagline || 'Not specified'}</p>
              <p><strong>Additional Features:</strong> ${formatFeatures(customizationData.customization.features)}</p>
              <p><strong>Layout Style:</strong> ${customizationData.customization.layout}</p>
              <p><strong>Integrations:</strong> ${formatIntegrations(customizationData.customization.integrations)}</p>
            </div>

            <div style="text-align: center; padding: 20px; background: #fff; border-radius: 8px; border: 2px solid #e9ecef;">
              <h3 style="color: #333; margin-bottom: 10px;">Estimated Investment</h3>
              <p style="font-size: 24px; font-weight: bold; color: #0066cc; margin: 0;">$${customizationData.estimatedPrice.toLocaleString()}</p>
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="color: #333; margin-bottom: 15px;">What's Next?</h3>
            <ul style="color: #666; line-height: 1.6;">
              <li>Our team will review your requirements within 24 hours</li>
              <li>We'll contact you at ${clientInfo.phone} to discuss your project in detail</li>
              <li>We'll provide a detailed timeline and technical specification</li>
              <li>Once approved, we'll begin development immediately</li>
            </ul>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
            <p style="color: #666; margin-bottom: 10px;">Questions? We're here to help!</p>
            <p style="color: #666; margin: 0;">
              Email: <a href="mailto:support@vision-sync.com" style="color: #0066cc;">support@vision-sync.com</a><br>
              Phone: <a href="tel:+1-555-0123" style="color: #0066cc;">+1 (555) 012-3456</a>
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Best regards,<br>
              The Vision-Sync Team
            </p>
          </div>
        </div>
      `,
    });

    // Send notification email to the team
    const teamEmailResponse = await resend.emails.send({
      from: "Vision-Sync Customizations <customizations@vision-sync.com>",
      to: ["lee@vision-sync.com"],
      subject: `New App Customization Request - ${customizationData.template.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">New Customization Request</h1>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-bottom: 15px;">Client Information</h2>
            <p><strong>Name:</strong> ${clientInfo.name}</p>
            <p><strong>Email:</strong> ${clientInfo.email}</p>
            <p><strong>Phone:</strong> ${clientInfo.phone}</p>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-bottom: 15px;">Template & Requirements</h2>
            <p><strong>Template:</strong> ${customizationData.template.title}</p>
            <p><strong>Business Type:</strong> ${customizationData.questionnaire.businessType}</p>
            <p><strong>Industry:</strong> ${customizationData.questionnaire.industry}</p>
            <p><strong>Business Size:</strong> ${customizationData.questionnaire.businessSize}</p>
            <p><strong>Budget Range:</strong> ${customizationData.questionnaire.budgetRange}</p>
            <p><strong>Timeline:</strong> ${customizationData.questionnaire.timeline}</p>
            <p><strong>Estimated Price:</strong> $${customizationData.estimatedPrice.toLocaleString()}</p>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-bottom: 15px;">Requested Features</h2>
            <p>${formatRequirements(customizationData.questionnaire.requirements)}</p>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-bottom: 15px;">Customization Details</h2>
            <p><strong>Business Name:</strong> ${customizationData.customization.branding.businessName || 'Not specified'}</p>
            <p><strong>Tagline:</strong> ${customizationData.customization.branding.tagline || 'Not specified'}</p>
            <p><strong>Additional Features:</strong> ${formatFeatures(customizationData.customization.features)}</p>
            <p><strong>Layout Style:</strong> ${customizationData.customization.layout}</p>
            <p><strong>Integrations:</strong> ${formatIntegrations(customizationData.customization.integrations)}</p>
          </div>

          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #1976d2;">
            <h3 style="color: #1976d2; margin-bottom: 10px;">Action Required</h3>
            <p style="margin: 0;">Contact ${clientInfo.name} at ${clientInfo.phone} or ${clientInfo.email} within 24 hours to discuss this customization request.</p>
          </div>
        </div>
      `,
      replyTo: clientInfo.email,
    });

    console.log("Customization emails sent successfully:", { clientEmailResponse, teamEmailResponse });

    return new Response(JSON.stringify({ 
      success: true, 
      clientEmailResponse, 
      teamEmailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-customization-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);