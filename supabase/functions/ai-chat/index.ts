import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId, agentId } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get agent configuration and training data
    const [agentRes, settingsRes, trainingRes, projectsRes, leadsRes] = await Promise.all([
      supabase.from('ai_agents').select('*').eq('id', agentId).single(),
      supabase.from('ai_agent_settings').select('*'),
      supabase.from('ai_training_data').select('*').eq('is_active', true).order('priority', { ascending: false }),
      supabase.from('projects').select('name, description, category, price, investment_amount, features').eq('visibility', 'Public'),
      supabase.from('leads').select('count').eq('status', 'new').limit(1)
    ]);

    const agent = agentRes.data;
    const settings = settingsRes.data || [];
    const trainingData = trainingRes.data || [];
    const projects = projectsRes.data || [];
    const leadCount = leadsRes.data?.length || 0;

    // Get OpenAI API key from settings
    const openaiSetting = settings.find(s => s.setting_key === 'openai_api_key');
    const openaiApiKey = openaiSetting?.setting_value || Deno.env.get('OPENAI_API_KEY');

    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Build context for the AI
    const businessContext = {
      company_info: agent?.business_knowledge || {},
      services: projects.map(p => ({ name: p.name, description: p.description, category: p.category, price: p.price })),
      training_data: trainingData,
      current_leads: leadCount,
      agent_personality: agent?.personality || 'helpful and professional'
    };

    // Create system prompt
    const systemPrompt = `You are ${agent?.name || 'an AI assistant'} for a business platform. Your personality is: ${agent?.personality}.

BUSINESS CONTEXT:
- Services: ${businessContext.services.map(s => `${s.name} (${s.category}) - ${s.description}`).join(', ')}
- Current leads in pipeline: ${leadCount}

TRAINING DATA:
${trainingData.map(t => `Q: ${t.question}\nA: ${t.answer}`).join('\n\n')}

CONVERSATION RULES:
1. Be ${agent?.personality}
2. Focus on lead qualification and conversion
3. Offer relevant services based on customer needs
4. Always try to capture contact information
5. If asked complex technical questions, offer to connect with a specialist
6. Keep responses concise but informative

Your goal is to help customers, qualify leads, and convert prospects into sales.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get AI response');
    }

    const aiResponse = await response.json();
    const aiMessage = aiResponse.choices[0]?.message?.content || 'I apologize, but I\'m having trouble responding right now.';

    // Check if this looks like a qualified lead
    const isQualified = message.toLowerCase().includes('price') || 
                       message.toLowerCase().includes('cost') ||
                       message.toLowerCase().includes('buy') ||
                       message.toLowerCase().includes('interested') ||
                       message.toLowerCase().includes('contact');

    // Update conversation in database
    if (sessionId) {
      const { error: convError } = await supabase
        .from('ai_conversations')
        .upsert({
          session_id: sessionId,
          agent_id: agentId,
          conversation_data: JSON.stringify([{ type: 'user', message }, { type: 'ai', message: aiMessage }]),
          status: 'active',
          lead_qualified: isQualified,
          conversion_score: isQualified ? 75 : 25
        }, { onConflict: 'session_id' });

      if (convError) {
        console.error('Error saving conversation:', convError);
      }
    }

    return new Response(JSON.stringify({ 
      response: aiMessage,
      qualified: isQualified,
      sessionId 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});