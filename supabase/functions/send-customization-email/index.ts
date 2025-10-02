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
  templateTitle: string;
  customizationData: {
    template: {
      id: string;
      title: string;
      category: string;
    };
    questionnaire: {
      businessType: string;
      industry: string;
      requirements: string[];
      businessSize: string;
      techComfort: string;
      budgetRange: string;
      timeline: string;
      contactInfo: {
        name: string;
        email: string;
        phone: string;
      };
    };
    submittedAt: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { clientInfo, templateTitle, customizationData }: CustomizationEmailRequest = await req.json();

    console.log("Processing customization request:", { 
      client: clientInfo.name, 
      template: templateTitle 
    });

    // Validate required fields
    if (!clientInfo.email || !clientInfo.name || !templateTitle) {
      throw new Error("Missing required fields");
    }

    // Format requirements for email display
    const formatRequirements = (requirements: string[]) => {
      return requirements.length > 0 
        ? requirements.map(r => `<li>${r}</li>`).join('') 
        : '<li>None specified</li>';
    };

    // Send confirmation email to client
    const clientEmailResponse = await resend.emails.send({
      from: "Vision-Sync Forge <onboarding@resend.dev>",
      to: [clientInfo.email],
      subject: `Your ${templateTitle} Customization Request Received`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1e293b;">Thank You, ${clientInfo.name}!</h1>
          
          <p style="font-size: 16px; color: #475569;">
            We've received your customization request for <strong>${templateTitle}</strong>.
          </p>

          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1e293b; font-size: 18px; margin-top: 0;">What happens next?</h2>
            <ul style="color: #475569; line-height: 1.8;">
              <li>Our team will review your requirements</li>
              <li>You'll receive a detailed quote within 24 hours</li>
              <li>We'll reach out to discuss next steps</li>
            </ul>
          </div>

          <h3 style="color: #1e293b;">Your Requirements Summary:</h3>
          <ul style="color: #475569; line-height: 1.6;">
            <li><strong>Business Type:</strong> ${customizationData.questionnaire.businessType}</li>
            <li><strong>Industry:</strong> ${customizationData.questionnaire.industry}</li>
            <li><strong>Business Size:</strong> ${customizationData.questionnaire.businessSize}</li>
            <li><strong>Tech Comfort:</strong> ${customizationData.questionnaire.techComfort}</li>
            <li><strong>Budget Range:</strong> ${customizationData.questionnaire.budgetRange}</li>
            <li><strong>Timeline:</strong> ${customizationData.questionnaire.timeline}</li>
          </ul>

          <h3 style="color: #1e293b;">Features Needed:</h3>
          <ul style="color: #475569; line-height: 1.6;">
            ${formatRequirements(customizationData.questionnaire.requirements)}
          </ul>

          <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
            If you have any questions, feel free to reply to this email or call us at ${clientInfo.phone}.
          </p>

          <p style="font-size: 14px; color: #64748b;">
            Best regards,<br>
            The Vision-Sync Forge Team
          </p>
        </div>
      `,
    });

    // Send notification email to team
    const teamEmailResponse = await resend.emails.send({
      from: "Vision-Sync Customizations <onboarding@resend.dev>",
      to: ["leewakeman@hotmail.co.uk"],
      subject: `New Customization Request - ${templateTitle}`,
      replyTo: clientInfo.email,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1e293b;">New Customization Request</h1>
          
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1e293b; font-size: 18px; margin-top: 0;">Client Information</h2>
            <ul style="color: #475569; line-height: 1.6;">
              <li><strong>Name:</strong> ${clientInfo.name}</li>
              <li><strong>Email:</strong> ${clientInfo.email}</li>
              <li><strong>Phone:</strong> ${clientInfo.phone}</li>
            </ul>
          </div>

          <h3 style="color: #1e293b;">Template: ${templateTitle}</h3>
          
          <h3 style="color: #1e293b;">Requirements:</h3>
          <ul style="color: #475569; line-height: 1.6;">
            <li><strong>Business Type:</strong> ${customizationData.questionnaire.businessType}</li>
            <li><strong>Industry:</strong> ${customizationData.questionnaire.industry}</li>
            <li><strong>Business Size:</strong> ${customizationData.questionnaire.businessSize}</li>
            <li><strong>Tech Comfort:</strong> ${customizationData.questionnaire.techComfort}</li>
            <li><strong>Budget Range:</strong> ${customizationData.questionnaire.budgetRange}</li>
            <li><strong>Timeline:</strong> ${customizationData.questionnaire.timeline}</li>
          </ul>

          <h3 style="color: #1e293b;">Features Needed:</h3>
          <ul style="color: #475569; line-height: 1.6;">
            ${formatRequirements(customizationData.questionnaire.requirements)}
          </ul>

          <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
            Submitted at: ${new Date(customizationData.submittedAt).toLocaleString()}
          </p>
        </div>
      `,
    });

    console.log("Emails sent successfully:", { 
      clientEmail: clientEmailResponse,
      teamEmail: teamEmailResponse
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Customization request sent successfully",
      client: clientInfo.name,
      template: templateTitle
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
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);