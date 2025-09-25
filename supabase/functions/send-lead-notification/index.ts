import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Note: To use Resend, add the RESEND_API_KEY secret and uncomment the Resend import
// import { Resend } from "npm:resend@2.0.0";
// const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'general_lead' | 'project_lead';
  lead: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, lead }: EmailRequest = await req.json();

    let subject = '';
    let emailContent = '';

    if (type === 'general_lead') {
      subject = `New ${lead.source} Lead: ${lead.name}`;
      emailContent = `
        <h2>New Lead Submission</h2>
        <p><strong>Source:</strong> ${lead.source}</p>
        <p><strong>Name:</strong> ${lead.name}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        ${lead.company ? `<p><strong>Company:</strong> ${lead.company}</p>` : ''}
        ${lead.phone ? `<p><strong>Phone:</strong> ${lead.phone}</p>` : ''}
        <p><strong>Priority:</strong> ${lead.priority}</p>
        <p><strong>Status:</strong> ${lead.status}</p>
        
        ${lead.form_data?.message ? `
          <h3>Message:</h3>
          <p>${lead.form_data.message}</p>
        ` : ''}
        
        ${lead.form_data ? `
          <h3>Additional Information:</h3>
          <pre>${JSON.stringify(lead.form_data, null, 2)}</pre>
        ` : ''}
        
        <p><strong>Submitted:</strong> ${new Date(lead.created_at).toLocaleString()}</p>
      `;
    } else if (type === 'project_lead') {
      subject = `New Project Inquiry: ${lead.name} - ${lead.inquiry_type}`;
      emailContent = `
        <h2>New Project Lead Submission</h2>
        <p><strong>Project:</strong> ${lead.project_id}</p>
        <p><strong>Inquiry Type:</strong> ${lead.inquiry_type}</p>
        <p><strong>Name:</strong> ${lead.name}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        ${lead.company ? `<p><strong>Company:</strong> ${lead.company}</p>` : ''}
        ${lead.phone ? `<p><strong>Phone:</strong> ${lead.phone}</p>` : ''}
        <p><strong>Priority:</strong> ${lead.priority}</p>
        <p><strong>Status:</strong> ${lead.status}</p>
        
        ${lead.investment_amount ? `<p><strong>Investment Amount:</strong> €${lead.investment_amount.toLocaleString()}</p>` : ''}
        
        ${lead.message ? `
          <h3>Message:</h3>
          <p>${lead.message}</p>
        ` : ''}
        
        ${lead.form_data ? `
          <h3>Additional Information:</h3>
          <pre>${JSON.stringify(lead.form_data, null, 2)}</pre>
        ` : ''}
        
        <p><strong>Submitted:</strong> ${new Date(lead.created_at).toLocaleString()}</p>
      `;
    }

    // TODO: Uncomment when RESEND_API_KEY is configured
    // const emailResponse = await resend.emails.send({
    //   from: "Vision-Sync Lead Manager <leads@vision-sync.com>",
    //   to: ["lee@vision-sync.com"],
    //   subject: subject,
    //   html: emailContent,
    //   replyTo: lead.email, // Allow direct replies to the lead
    // });

    console.log("Lead notification logged:", { type, subject, lead: lead.name });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Lead notification logged successfully",
      subject,
      type 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-lead-notification function:", error);
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