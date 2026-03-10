import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const allowedOrigin = Deno.env.get('ALLOWED_ORIGIN') || '*';
const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SelectedModule {
  id: string;
  name: string;
  exVatPrice: number;
  ivaAmount: number;
  totalIncVat: number;
}

interface QuoteEmailRequest {
  quoteReference: string;
  clientFirstName: string;
  clientLastName: string;
  businessName: string;
  email: string;
  phone?: string;
  industryName: string;
  industrySlug: string;
  basePackageName: string;
  baseIncludes: string[];
  baseExVat: number;
  baseIva: number;
  baseIncVat: number;
  selectedModules: SelectedModule[];
  modulesExVatTotal: number;
  modulesIvaTotal: number;
  modulesIncVatTotal: number;
  totalExVat: number;
  totalIva: number;
  totalIncVat: number;
  clientNotes?: string;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const quote: QuoteEmailRequest = await req.json();

    const modulesRows = quote.selectedModules.length > 0
      ? quote.selectedModules.map(mod => `
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${mod.name}</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #1e293b;">${formatCurrency(mod.exVatPrice)}</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #64748b;">${formatCurrency(mod.ivaAmount)}</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600; color: #0f172a;">${formatCurrency(mod.totalIncVat)}</td>
        </tr>
      `).join('')
      : `<tr><td colspan="4" style="padding: 12px 16px; color: #64748b; text-align: center;">No add-on modules selected</td></tr>`;

    const baseIncludesList = quote.baseIncludes.map(item =>
      `<li style="padding: 4px 0; color: #475569;">${item}</li>`
    ).join('');

    const clientEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Vision-Sync Quote</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 680px; margin: 0 auto; padding: 40px 20px;">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0A1628 0%, #1E3A8A 100%); border-radius: 16px 16px 0 0; padding: 40px 48px; text-align: center;">
      <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.15); border-radius: 12px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
        <span style="color: white; font-size: 28px; font-weight: 900;">V</span>
      </div>
      <h1 style="color: white; margin: 0 0 8px; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Vision-Sync Forge</h1>
      <p style="color: rgba(255,255,255,0.7); margin: 0; font-size: 14px;">AI Agents, Chatbots & Intelligent Automation</p>
    </div>

    <!-- Quote Reference Banner -->
    <div style="background: #1E3A8A; padding: 20px 48px; text-align: center;">
      <p style="color: rgba(255,255,255,0.7); margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Your Quote Reference</p>
      <p style="color: white; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 2px; font-family: monospace;">${quote.quoteReference}</p>
    </div>

    <!-- Main Content -->
    <div style="background: white; padding: 48px; border-radius: 0 0 16px 16px;">

      <!-- Greeting -->
      <h2 style="color: #0A1628; font-size: 22px; font-weight: 700; margin: 0 0 8px;">Hi ${quote.clientFirstName},</h2>
      <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 32px;">
        Thank you for building your package with Vision-Sync. Here is your personalised quote for
        <strong style="color: #1E3A8A;">${quote.businessName}</strong>.
        A member of our team will be in touch within 24 hours.
      </p>

      <!-- Industry & Package -->
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
        <p style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px;">Industry</p>
        <p style="color: #0A1628; font-size: 18px; font-weight: 700; margin: 0 0 16px;">${quote.industryName}</p>

        <p style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px;">Base Package: ${quote.basePackageName}</p>
        <ul style="margin: 0; padding-left: 20px;">
          ${baseIncludesList}
        </ul>
      </div>

      <!-- Pricing Table -->
      <h3 style="color: #0A1628; font-size: 16px; font-weight: 700; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.5px;">Monthly Package Breakdown</h3>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="background: #f8fafc;">
            <th style="padding: 12px 16px; text-align: left; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0;">Item</th>
            <th style="padding: 12px 16px; text-align: right; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0;">Ex IVA</th>
            <th style="padding: 12px 16px; text-align: right; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0;">IVA 21%</th>
            <th style="padding: 12px 16px; text-align: right; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0;">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-weight: 600;">Base Package</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #1e293b;">${formatCurrency(quote.baseExVat)}</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #64748b;">${formatCurrency(quote.baseIva)}</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600; color: #0f172a;">${formatCurrency(quote.baseIncVat)}</td>
          </tr>
          ${modulesRows}
        </tbody>
        <tfoot>
          <tr style="background: #0A1628;">
            <td style="padding: 16px; color: white; font-weight: 700; font-size: 15px; border-radius: 0 0 0 8px;">Monthly Investment</td>
            <td style="padding: 16px; color: rgba(255,255,255,0.8); text-align: right;">${formatCurrency(quote.totalExVat)}</td>
            <td style="padding: 16px; color: rgba(255,255,255,0.6); text-align: right; font-size: 12px;">IVA: ${formatCurrency(quote.totalIva)}</td>
            <td style="padding: 16px; color: white; font-weight: 800; font-size: 20px; text-align: right; border-radius: 0 0 8px 0;">${formatCurrency(quote.totalIncVat)}</td>
          </tr>
        </tfoot>
      </table>

      <p style="color: #94a3b8; font-size: 12px; margin: 0 0 32px;">All prices include 21% IVA (Spanish VAT) as shown.</p>

      ${quote.clientNotes ? `
      <div style="background: #f0f9ff; border-left: 4px solid #1E3A8A; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 32px;">
        <p style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px;">Your Notes</p>
        <p style="color: #1e293b; margin: 0; font-size: 14px;">${quote.clientNotes}</p>
      </div>
      ` : ''}

      <!-- CTA -->
      <div style="text-align: center; margin-bottom: 40px;">
        <a href="https://www.vision-sync.co/quote/${quote.quoteReference}"
           style="display: inline-block; background: linear-gradient(135deg, #0A1628 0%, #1E3A8A 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 700; font-size: 16px; letter-spacing: 0.3px;">
          View Your Quote Online →
        </a>
        <p style="color: #94a3b8; font-size: 13px; margin: 16px 0 0;">Or copy this link: https://www.vision-sync.co/quote/${quote.quoteReference}</p>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; text-align: center;">
        <p style="color: #475569; font-size: 14px; margin: 0 0 8px;">
          <strong>A member of our team will be in touch within 24 hours.</strong>
        </p>
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          Vision-Sync Forge | vision-sync.co | Alicante & Almeria
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Quote Alert</title></head>
<body style="margin: 0; padding: 20px; background: #f1f5f9; font-family: sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden;">

    <div style="background: #dc2626; padding: 24px 32px;">
      <p style="color: white; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 4px;">Vision-Sync Forge</p>
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 800;">NEW QUOTE RECEIVED</h1>
    </div>

    <div style="padding: 32px;">
      <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h2 style="color: #0A1628; font-size: 16px; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.5px;">Client Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #64748b; font-size: 13px; width: 120px;">Name</td><td style="padding: 6px 0; color: #1e293b; font-weight: 600;">${quote.clientFirstName} ${quote.clientLastName}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b; font-size: 13px;">Business</td><td style="padding: 6px 0; color: #1e293b; font-weight: 600;">${quote.businessName}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b; font-size: 13px;">Email</td><td style="padding: 6px 0; color: #1E3A8A;">${quote.email}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b; font-size: 13px;">Phone</td><td style="padding: 6px 0; color: #1e293b;">${quote.phone || '—'}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b; font-size: 13px;">Industry</td><td style="padding: 6px 0; color: #1e293b;">${quote.industryName}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b; font-size: 13px;">Quote Ref</td><td style="padding: 6px 0; color: #1e293b; font-family: monospace; font-weight: 700;">${quote.quoteReference}</td></tr>
        </table>
      </div>

      <div style="background: #0A1628; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;">
        <p style="color: rgba(255,255,255,0.6); margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Monthly Value</p>
        <p style="color: white; margin: 0; font-size: 32px; font-weight: 800;">${formatCurrency(quote.totalIncVat)}</p>
        <p style="color: rgba(255,255,255,0.5); margin: 4px 0 0; font-size: 12px;">inc. IVA | ${formatCurrency(quote.totalExVat)} ex. IVA</p>
      </div>

      <div style="margin-bottom: 24px;">
        <h3 style="color: #0A1628; font-size: 14px; margin: 0 0 12px; text-transform: uppercase;">Modules Selected</h3>
        ${quote.selectedModules.length > 0
        ? quote.selectedModules.map(m => `<div style="padding: 8px 12px; background: #f8fafc; border-radius: 6px; margin-bottom: 8px; display: flex; justify-content: space-between;"><span style="color: #1e293b;">${m.name}</span><span style="color: #1E3A8A; font-weight: 600;">${formatCurrency(m.totalIncVat)}/mo</span></div>`).join('')
        : '<p style="color: #94a3b8; font-size: 13px;">No add-on modules selected</p>'
      }
      </div>

      ${quote.clientNotes ? `
      <div style="background: #fef9c3; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="color: #854d0e; font-size: 12px; text-transform: uppercase; margin: 0 0 4px;">Client Notes</p>
        <p style="color: #1e293b; margin: 0;">${quote.clientNotes}</p>
      </div>
      ` : ''}

      <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e2e8f0;">
        <a href="https://www.vision-sync.co/admin#quotes" style="display: inline-block; background: #1E3A8A; color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600;">
          View in Admin Dashboard →
        </a>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    // Send client email
    const clientEmailResponse = await resend.emails.send({
      from: "Vision-Sync Forge <quotes@vision-sync.co>",
      to: [quote.email],
      subject: `Your Vision-Sync Quote — ${quote.quoteReference}`,
      html: clientEmailHtml,
    });

    // Send admin notification
    const adminEmailResponse = await resend.emails.send({
      from: "Vision-Sync Lead System <quotes@vision-sync.co>",
      to: ["lee@vision-sync.com"],
      subject: `NEW QUOTE: ${quote.businessName} — ${quote.industryName} — ${formatCurrency(quote.totalIncVat)}/mo`,
      html: adminEmailHtml,
      replyTo: quote.email,
    });

    console.log("Quote emails sent:", {
      ref: quote.quoteReference,
      client: clientEmailResponse.data?.id,
      admin: adminEmailResponse.data?.id
    });

    return new Response(JSON.stringify({
      success: true,
      quoteReference: quote.quoteReference,
      clientEmailId: clientEmailResponse.data?.id,
      adminEmailId: adminEmailResponse.data?.id
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error in send-quote-email function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
