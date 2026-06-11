import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { EMAIL, adminInbox, escapeHtml } from "../_shared/email.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const allowedOrigin = Deno.env.get('ALLOWED_ORIGIN') || '*';
const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
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

    // Resolve the admin inbox up front so a missing ADMIN_EMAIL fails loudly
    // before we do any work (this function exists only to notify the admin).
    const admin = adminInbox();

    let subject = '';
    let emailContent = '';

    if (type === 'general_lead') {
      subject = `New ${lead.source} Lead: ${lead.name}`;
      emailContent = `
        <h2>New Lead Submission</h2>
        <p><strong>Source:</strong> ${escapeHtml(lead.source)}</p>
        <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
        ${lead.company ? `<p><strong>Company:</strong> ${escapeHtml(lead.company)}</p>` : ''}
        ${lead.phone ? `<p><strong>Phone:</strong> ${escapeHtml(lead.phone)}</p>` : ''}
        <p><strong>Priority:</strong> ${escapeHtml(lead.priority)}</p>
        <p><strong>Status:</strong> ${escapeHtml(lead.status)}</p>

        ${lead.form_data?.message ? `
          <h3>Message:</h3>
          <p>${escapeHtml(lead.form_data.message)}</p>
        ` : ''}

        ${lead.form_data ? `
          <h3>Additional Information:</h3>
          <pre>${escapeHtml(JSON.stringify(lead.form_data, null, 2))}</pre>
        ` : ''}

        <p><strong>Submitted:</strong> ${escapeHtml(new Date(lead.created_at).toLocaleString())}</p>
      `;
    } else if (type === 'project_lead') {
      subject = `New Project Inquiry: ${lead.name} - ${lead.inquiry_type}`;
      emailContent = `
        <h2>New Project Lead Submission</h2>
        <p><strong>Project:</strong> ${escapeHtml(lead.project_id)}</p>
        <p><strong>Inquiry Type:</strong> ${escapeHtml(lead.inquiry_type)}</p>
        <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
        ${lead.company ? `<p><strong>Company:</strong> ${escapeHtml(lead.company)}</p>` : ''}
        ${lead.phone ? `<p><strong>Phone:</strong> ${escapeHtml(lead.phone)}</p>` : ''}
        <p><strong>Priority:</strong> ${escapeHtml(lead.priority)}</p>
        <p><strong>Status:</strong> ${escapeHtml(lead.status)}</p>

        ${lead.investment_amount ? `<p><strong>Investment Amount:</strong> €${escapeHtml(lead.investment_amount.toLocaleString())}</p>` : ''}

        ${lead.message ? `
          <h3>Message:</h3>
          <p>${escapeHtml(lead.message)}</p>
        ` : ''}

        ${lead.form_data ? `
          <h3>Additional Information:</h3>
          <pre>${escapeHtml(JSON.stringify(lead.form_data, null, 2))}</pre>
        ` : ''}

        <p><strong>Submitted:</strong> ${escapeHtml(new Date(lead.created_at).toLocaleString())}</p>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: EMAIL.from.leads,
      to: [admin],
      subject: subject,
      html: emailContent,
      replyTo: lead.email,
    });

    console.log("Lead notification sent:", { type, subject, lead: lead.name, id: emailResponse.data?.id });

    return new Response(JSON.stringify({
      success: true,
      message: "Lead notification sent successfully",
      subject,
      type,
      emailId: emailResponse.data?.id
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    // Log the full error server-side; return a clean failure to the caller.
    console.error("Error in send-lead-notification function:", error);
    return new Response(
      JSON.stringify({ success: false }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
