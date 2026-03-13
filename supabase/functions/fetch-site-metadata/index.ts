import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RawMetadata {
  title: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  og_site_name: string | null;
  meta_description: string | null;
  favicon: string | null;
}

interface AIAnalysis {
  name: string;
  tagline: string;
  description: string;
  category: string;
  powered_by: string[];
  logo_emoji: string;
  accent_color: string;
}

// --- HTML parsing helpers (no DOM in Deno Edge Functions) ---

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'");
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title[^>]*>(.*?)<\/title>/is);
  return match ? decodeEntities(match[1].trim()) : null;
}

function extractMeta(html: string, name: string): string | null {
  const patterns = [
    new RegExp(
      `<meta[^>]*(?:property|name)=["']${name}["'][^>]*content=["']([^"']*)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']${name}["']`,
      "i"
    ),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return decodeEntities(match[1].trim());
  }
  return null;
}

function extractFavicon(html: string, origin: string): string | null {
  const match =
    html.match(
      /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']*)["']/i
    ) ||
    html.match(
      /<link[^>]*href=["']([^"']*)["'][^>]*rel=["'](?:shortcut )?icon["']/i
    );
  if (match) {
    const href = match[1];
    return href.startsWith("http") ? href : new URL(href, origin).toString();
  }
  return `${origin}/favicon.ico`;
}

function resolveUrl(url: string | null, origin: string): string | null {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  try {
    return new URL(url, origin).toString();
  } catch {
    return null;
  }
}

function stripHtmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      throw new Error("URL is required");
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      throw new Error("Invalid URL format");
    }

    // Step 1: Fetch the page HTML (15s timeout)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    let html: string;
    try {
      const pageResponse = await fetch(parsedUrl.toString(), {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; VisionSync/1.0; +https://www.vision-sync.co)",
          Accept: "text/html",
        },
        redirect: "follow",
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!pageResponse.ok) {
        throw new Error(`Site returned HTTP ${pageResponse.status}`);
      }

      html = await pageResponse.text();
    } catch (err) {
      clearTimeout(timeout);
      if (err instanceof Error && err.name === "AbortError") {
        throw new Error("Site took too long to respond (15s timeout)");
      }
      throw err;
    }

    // Step 2: Extract raw metadata from HTML
    const raw: RawMetadata = {
      title: extractTitle(html),
      og_title: extractMeta(html, "og:title"),
      og_description: extractMeta(html, "og:description"),
      og_image: resolveUrl(extractMeta(html, "og:image"), parsedUrl.origin),
      og_site_name: extractMeta(html, "og:site_name"),
      meta_description: extractMeta(html, "description"),
      favicon: extractFavicon(html, parsedUrl.origin),
    };

    // Step 3: Use Claude to generate structured app data
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!anthropicKey) {
      throw new Error("ANTHROPIC_API_KEY not configured");
    }

    const bodyText = stripHtmlToText(html).substring(0, 3000);

    const claudeResponse = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          temperature: 0.2,
          messages: [
            {
              role: "user",
              content: `Analyze this website and extract structured information for a product showcase card.

URL: ${url}
Page Title: ${raw.title || "Unknown"}
OG Title: ${raw.og_title || "N/A"}
OG Description: ${raw.og_description || "N/A"}
Meta Description: ${raw.meta_description || "N/A"}
OG Site Name: ${raw.og_site_name || "N/A"}

Page content excerpt:
${bodyText}

Return ONLY a JSON object (no markdown, no code blocks) with these exact fields:
{
  "name": "Short product/company name (1-3 words)",
  "tagline": "Catchy one-line tagline (under 80 chars)",
  "description": "2-3 sentence description of what this product/service does",
  "category": "One of: App, Platform, Tool, Service, API, Other",
  "powered_by": ["Array of technologies/frameworks detected or likely used"],
  "logo_emoji": "A single emoji that best represents this product",
  "accent_color": "A hex color that matches the brand identity (e.g. #3b82f6)"
}`,
            },
          ],
        }),
      }
    );

    let analysis: AIAnalysis;

    if (!claudeResponse.ok) {
      console.error("Claude API error:", claudeResponse.status);
      // Fallback to raw metadata
      analysis = {
        name:
          raw.og_site_name || raw.og_title || raw.title || "Unknown App",
        tagline: raw.og_description || raw.meta_description || "",
        description: raw.meta_description || raw.og_description || "",
        category: "App",
        powered_by: [],
        logo_emoji: "\u{1F517}",
        accent_color: "#06b6d4",
      };
    } else {
      const claudeData = await claudeResponse.json();
      const aiText = claudeData.content?.[0]?.text || "{}";

      try {
        const cleaned = aiText
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        analysis = JSON.parse(cleaned);
      } catch {
        console.error("Failed to parse AI response:", aiText);
        analysis = {
          name:
            raw.og_site_name || raw.og_title || raw.title || "Unknown App",
          tagline: raw.og_description || raw.meta_description || "",
          description: raw.meta_description || raw.og_description || "",
          category: "App",
          powered_by: [],
          logo_emoji: "\u{1F517}",
          accent_color: "#06b6d4",
        };
      }
    }

    // Step 4: Determine best logo URL: og:image > favicon > null
    const logo_url = raw.og_image || raw.favicon || null;

    return new Response(
      JSON.stringify({
        success: true,
        metadata: {
          name: analysis.name,
          tagline: analysis.tagline,
          description: analysis.description,
          logo_url,
          logo_emoji: analysis.logo_emoji || "\u{1F517}",
          accent_color: analysis.accent_color || "#06b6d4",
          category: analysis.category || "App",
          powered_by: analysis.powered_by || [],
          url,
        },
        raw,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in fetch-site-metadata:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        metadata: null,
        raw: null,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
