import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();

    switch (action) {
      case 'match-templates':
        return await matchTemplates(data);
      case 'generate-content':
        return await generateContent(data);
      case 'create-template':
        return await createTemplate(data);
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error in ai-template-assistant:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function matchTemplates(questionnaire: any) {
  const prompt = `
    Based on this business questionnaire, recommend the best templates and explain why:
    
    Business Type: ${questionnaire.businessType}
    Industry: ${questionnaire.industry}
    Requirements: ${questionnaire.requirements?.join(', ')}
    Business Size: ${questionnaire.businessSize}
    Tech Comfort: ${questionnaire.techComfort}
    Budget Range: ${questionnaire.budgetRange}
    Timeline: ${questionnaire.timeline}
    
    Available templates:
    1. Salon Booking App - Beauty industry booking system
    2. Home Services App - Trades and home services
    3. Restaurant POS - Food and beverage management
    4. Fitness Tracker - Health and wellness tracking
    5. E-commerce Store - Product sales platform
    6. Educational Platform - Learning management system
    7. Event Planning - Event organization and booking
    8. Healthcare Portal - Patient management system
    9. Real Estate CRM - Property management and sales
    
    Provide:
    1. Top 3 template recommendations with match scores (0-100)
    2. Detailed explanation for each recommendation
    3. Suggested customizations for their specific needs
    4. Estimated timeline and pricing adjustments
    
    Return as JSON with this structure:
    {
      "recommendations": [
        {
          "templateId": "string",
          "templateName": "string",
          "matchScore": number,
          "explanation": "string",
          "customizations": ["string"],
          "estimatedPrice": number,
          "timeline": "string"
        }
      ],
      "additionalSuggestions": "string"
    }
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert business consultant who matches businesses to optimal app templates. Always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  try {
    const recommendations = JSON.parse(content);
    return new Response(JSON.stringify(recommendations), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Failed to parse OpenAI response:', content);
    return new Response(JSON.stringify({ error: 'Failed to generate recommendations' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function generateContent(contentRequest: any) {
  const { type, context, industry } = contentRequest;
  
  let prompt = '';
  
  switch (type) {
    case 'template-description':
      prompt = `Generate a compelling app template description for a ${industry} business app. Include:
      - Overview paragraph (2-3 sentences)
      - Key features list (5-7 items)
      - Ideal customer description
      - Unique value propositions
      Context: ${context}`;
      break;
      
    case 'industry-copy':
      prompt = `Generate industry-specific copy for a ${industry} app template. Include:
      - Professional terminology
      - Common pain points this app solves
      - Industry-specific features and benefits
      Context: ${context}`;
      break;
      
    case 'customization-suggestions':
      prompt = `Suggest customizations for a ${industry} app template based on:
      ${context}
      Provide specific, actionable customization options.`;
      break;
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a professional copywriter specializing in app descriptions and marketing content.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
    }),
  });

  const data = await response.json();
  const generatedContent = data.choices[0].message.content;

  return new Response(JSON.stringify({ content: generatedContent }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function createTemplate(templateData: any) {
  const { industry, businessType, features, targetAudience } = templateData;
  
  const prompt = `Create a complete app template for the ${industry} industry:
  
  Business Type: ${businessType}
  Required Features: ${features?.join(', ')}
  Target Audience: ${targetAudience}
  
  Generate:
  1. Template title and tagline
  2. Detailed description (2-3 paragraphs)
  3. Complete feature list with descriptions
  4. Pricing structure (base price, customization options)
  5. Timeline estimate
  6. Ideal customer profile
  7. Key selling points
  8. Technical requirements
  
  Format as JSON with this structure:
  {
    "title": "string",
    "tagline": "string", 
    "description": "string",
    "features": [{"name": "string", "description": "string"}],
    "pricing": {"base": number, "customizations": [{"name": "string", "price": number}]},
    "timeline": "string",
    "idealCustomer": "string",
    "sellingPoints": ["string"],
    "techRequirements": ["string"]
  }`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert app consultant who creates comprehensive app templates. Always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  try {
    const template = JSON.parse(content);
    return new Response(JSON.stringify(template), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Failed to parse template creation response:', content);
    return new Response(JSON.stringify({ error: 'Failed to create template' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}