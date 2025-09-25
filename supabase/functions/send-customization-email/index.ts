import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Note: To use Resend, please install the RESEND_API_KEY secret

// const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

    // TODO: Uncomment when RESEND_API_KEY is configured
    // const clientEmailResponse = await resend.emails.send({
    //   from: "Vision-Sync Team <customizations@vision-sync.com>",
    //   to: [clientInfo.email],
    //   subject: `Your Custom ${customizationData.template.title} App Proposal`,
    //   html: `[EMAIL HTML CONTENT]`
    // });

    // const teamEmailResponse = await resend.emails.send({
    //   from: "Vision-Sync Customizations <customizations@vision-sync.com>",
    //   to: ["lee@vision-sync.com"],
    //   subject: `New App Customization Request - ${customizationData.template.title}`,
    //   html: `[TEAM EMAIL HTML CONTENT]`,
    //   replyTo: clientInfo.email,
    // });

    console.log("Customization email logged:", { 
      client: clientInfo.name, 
      template: customizationData.template.title,
      estimatedPrice: customizationData.estimatedPrice 
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Customization request logged successfully",
      client: clientInfo.name,
      template: customizationData.template.title
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