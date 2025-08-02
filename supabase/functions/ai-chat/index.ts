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
    const { message, sessionId, agentId, conversationHistory } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get existing conversation if available
    let existingConversation = null;
    if (sessionId) {
      const { data } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('session_id', sessionId)
        .single();
      existingConversation = data;
    }

    // Get agent configuration and training data
    const [agentRes, settingsRes, trainingRes, projectsRes, leadsRes] = await Promise.all([
      supabase.from('ai_agents').select('*').eq('id', agentId).single(),
      supabase.from('ai_agent_settings').select('*'),
      supabase.from('ai_training_data').select('*').eq('is_active', true).order('priority', { ascending: false }),
      supabase.from('projects').select('name, description, category, industry, route, domain_url, price, investment_amount, subscription_price, leads_count, key_features, billing_type').eq('visibility', 'Public'),
      supabase.from('leads').select('count').eq('status', 'new').limit(1)
    ]);

    const agent = agentRes.data;
    const settings = settingsRes.data || [];
    const trainingData = trainingRes.data || [];
    const projects = projectsRes.data || [];
    const leadCount = leadsRes.data?.length || 0;

    // Convert settings to map for easy access
    const settingsMap = settings.reduce((acc: any, setting) => {
      acc[setting.setting_key] = setting.setting_value;
      return acc;
    }, {});

    // Get configuration from settings
    const openaiApiKey = settingsMap.openai_api_key || Deno.env.get('OPENAI_API_KEY');
    const maxResponseLength = parseInt(settingsMap.max_response_length || '250');
    const responseTone = JSON.parse(settingsMap.response_tone || '"friendly_professional"');
    const responseFormat = JSON.parse(settingsMap.response_format || '"conversational"');
    const emojiUsage = JSON.parse(settingsMap.emoji_usage || '"minimal"');
    const contactCollectionTiming = JSON.parse(settingsMap.contact_collection_timing || '"after_3_messages"');
    const escalationTriggers = JSON.parse(settingsMap.escalation_triggers || '[]');

    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Extract contact information from conversation history
    const extractContactInfo = (messages: any[]) => {
      const allText = messages.map(m => m.content || m.message || '').join(' ').toLowerCase();
      
      // Extract email
      const emailMatch = allText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
      
      // Extract phone (various formats)
      const phoneMatch = allText.match(/\b(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/);
      
      // Extract name (look for "my name is", "I'm", "I am", etc.)
      const nameMatch = allText.match(/(?:my name is|i'm|i am|call me|this is)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)?)/i);
      
      return {
        email: emailMatch ? emailMatch[0] : null,
        phone: phoneMatch ? phoneMatch[0].replace(/[^\d+]/g, '') : null,
        name: nameMatch ? nameMatch[1].trim() : null
      };
    };

    // Build conversation context
    const fullHistory = conversationHistory || [];
    const contactInfo = extractContactInfo(fullHistory);
    const hasContactInfo = contactInfo.email || contactInfo.phone || contactInfo.name;
    
    // Determine conversation stage based on settings
    const messageCount = fullHistory.length;
    const contactThreshold = contactCollectionTiming === 'immediate' ? 0 :
                           contactCollectionTiming === 'after_2_messages' ? 2 :
                           contactCollectionTiming === 'after_5_messages' ? 5 : 3;
    const needsContactInfo = messageCount >= contactThreshold && !hasContactInfo;

    // Check for escalation triggers
    const hasEscalationTrigger = escalationTriggers.some((trigger: string) => 
      message.toLowerCase().includes(trigger.toLowerCase())
    );

    // Build context for the AI
    const businessContext = {
      company_info: agent?.business_knowledge || {},
      services: projects.map(p => ({ name: p.name, description: p.description, category: p.category, price: p.price })),
      training_data: trainingData,
      current_leads: leadCount,
      agent_personality: agent?.personality || 'helpful and professional',
      contact_info: contactInfo,
      needs_contact_info: needsContactInfo
    };

    // Build comprehensive system prompt with project recommendations
    const projectRecommendations = projects?.map(project => {
      const features = project.key_features ? project.key_features.map((f: any) => f.title || f).join(', ') : '';
      const pricing = project.price ? `$${project.price}` : 
                     project.investment_amount ? `Investment: $${project.investment_amount}` : 
                     project.subscription_price ? `$${project.subscription_price}/month` : 'Contact for pricing';
      
      return `- ${project.name} (${project.category} - ${project.industry || 'Technology'}): ${project.description}
      Key Features: ${features}
      Pricing: ${pricing}
      Page Link: https://yoursite.com${project.route}
      ${project.domain_url ? `Live Demo: ${project.domain_url}` : ''}
      Lead Interest: ${project.leads_count || 0} inquiries`;
    }).join('\n\n') || 'No projects available';

    // Dynamic tone and emoji settings
    const toneInstructions = {
      professional: 'Maintain a professional, business-focused tone.',
      friendly: 'Be warm, approachable, and personable.',
      casual: 'Use casual, relaxed language.',
      friendly_professional: 'Balance professionalism with warmth and approachability.'
    };

    const emojiInstructions = {
      disabled: 'Do not use any emojis.',
      minimal: 'Use emojis sparingly (1-2 per conversation).',
      moderate: 'Use emojis naturally to enhance communication.',
      frequent: 'Use emojis regularly to create an engaging, expressive tone.'
    };

    const formatInstructions = {
      bullet_points: 'Structure responses using bullet points when listing information.',
      paragraphs: 'Use full paragraphs for explanations.',
      conversational: 'Write in a natural, conversational style.'
    };

    const systemPrompt = `You are ${agent?.name || 'an AI assistant'} for Vision-Sync, a business platform helping customers find digital solutions.

PERSONALITY & TONE: ${agent?.personality || 'helpful and professional'}
COMMUNICATION STYLE:
- Tone: ${toneInstructions[responseTone] || toneInstructions.friendly_professional}
- Format: ${formatInstructions[responseFormat] || formatInstructions.conversational}
- Emoji Usage: ${emojiInstructions[emojiUsage] || emojiInstructions.minimal}

${hasEscalationTrigger ? `
🚨 ESCALATION DETECTED: The user is asking to speak with a human. Acknowledge their request politely and let them know someone will contact them soon. Collect their contact information if not already provided.
` : ''}

BUSINESS CONTEXT:
We offer custom-built applications, investment opportunities, and ready-to-deploy solutions across various industries including Healthcare, Retail, E-commerce, Real Estate, Emergency Services, Technology, Finance, Education, Food & Beverage, Beauty & Wellness, Entertainment, and Professional Services.

CURRENT PROJECTS AND SERVICES:
${projectRecommendations}

TRAINING DATA:
${trainingData.map(t => `Q: ${t.question}\nA: ${t.answer}`).join('\n\n')}

CONTACT INFORMATION COLLECTED:
- Name: ${contactInfo.name || 'Not provided'}
- Email: ${contactInfo.email || 'Not provided'}  
- Phone: ${contactInfo.phone || 'Not provided'}

CONVERSATION RULES:
1. Response Length: Keep responses under ${Math.floor(maxResponseLength / 4)} words (${maxResponseLength} tokens max)
2. Contact Collection: ${needsContactInfo ? 'Naturally ask for contact information (name, email, phone)' : 'Focus on qualifying their needs and budget'}
3. Project Recommendations: Match projects to user's industry and needs
4. Always include project links when suggesting solutions
5. Industry-specific recommendations:
   - Beauty/Salon/Wellness → CustomBuilds Platform + Beauty & Wellness templates
   - Healthcare/Medical → Global Health-Sync, Nurse-Sync
   - Real Estate → AI Spain Homes
   - Emergency Services → ICE-SOS Lite
   - E-commerce/Marketplace → ForSale Portal, CustomBuilds Platform
   - Investment/Finance → ForInvestors Platform
6. Link format: "Check out [Project Name](https://yoursite.com/project-route)"
7. Qualify leads by understanding budget, timeline, and specific needs

${needsContactInfo ? `
CONTACT COLLECTION STRATEGY:
- After answering their question, naturally mention following up
- Ask: "I'd love to follow up with more details. Could I get your name and email?"
- If hesitant: "It helps me provide personalized recommendations for your business"
- Stay conversational, not pushy
` : 'LEAD QUALIFICATION: Focus on understanding business needs, budget, timeline, and decision-making process.'}

RESPONSE LENGTH: Maximum ${maxResponseLength} tokens. Be helpful but concise.`;

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
          ...fullHistory.slice(-10), // Keep last 10 messages for context
          { role: 'user', content: message }
        ],
        max_tokens: maxResponseLength,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get AI response');
    }

    const aiResponse = await response.json();
    const aiMessage = aiResponse.choices[0]?.message?.content || 'I apologize, but I\'m having trouble responding right now.';

    // Update conversation history
    const updatedHistory = [
      ...fullHistory,
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'assistant', content: aiMessage, timestamp: new Date().toISOString() }
    ];

    // Re-extract contact info from updated conversation
    const updatedContactInfo = extractContactInfo(updatedHistory);
    const hasCompleteContact = updatedContactInfo.email && updatedContactInfo.name;

    // Check if this looks like a qualified lead
    const isQualified = message.toLowerCase().includes('price') || 
                       message.toLowerCase().includes('cost') ||
                       message.toLowerCase().includes('buy') ||
                       message.toLowerCase().includes('interested') ||
                       message.toLowerCase().includes('contact') ||
                       hasCompleteContact;

    // Calculate conversion score
    let conversionScore = 25;
    if (updatedContactInfo.email) conversionScore += 30;
    if (updatedContactInfo.phone) conversionScore += 25;
    if (updatedContactInfo.name) conversionScore += 20;
    if (isQualified) conversionScore += 20;

    // Save contact as lead if we have email
    let leadId = null;
    if (updatedContactInfo.email && !existingConversation?.lead_id) {
      try {
        const leadData = {
          name: updatedContactInfo.name || 'Anonymous User',
          email: updatedContactInfo.email,
          phone: updatedContactInfo.phone,
          source: 'ai-agent',
          status: 'new',
          priority: hasCompleteContact ? 'high' : 'medium',
          form_data: {
            conversation_summary: `AI chat conversation. Contact provided: ${updatedContactInfo.name || 'name not provided'}, ${updatedContactInfo.email}, ${updatedContactInfo.phone || 'phone not provided'}`,
            session_id: sessionId,
            agent_id: agentId,
            qualification_score: conversionScore
          },
          notes: `Contact collected via AI chat widget. Conversation score: ${conversionScore}/100`
        };

        const { data: leadResult, error: leadError } = await supabase
          .from('leads')
          .insert(leadData)
          .select('id')
          .single();

        if (!leadError && leadResult) {
          leadId = leadResult.id;
          console.log('Lead created successfully:', leadId);
        } else {
          console.error('Error creating lead:', leadError);
        }
      } catch (leadErr) {
        console.error('Error in lead creation:', leadErr);
      }
    }

    // Update conversation in database
    if (sessionId) {
      const conversationData = {
        session_id: sessionId,
        agent_id: agentId,
        lead_id: leadId || existingConversation?.lead_id,
        conversation_data: updatedHistory,
        status: 'active',
        lead_qualified: isQualified,
        conversion_score: conversionScore,
        visitor_id: `visitor_${sessionId.slice(0, 8)}`
      };

      const { error: convError } = await supabase
        .from('ai_conversations')
        .upsert(conversationData, { onConflict: 'session_id' });

      if (convError) {
        console.error('Error saving conversation:', convError);
      } else {
        console.log('Conversation saved successfully');
      }
    }

    return new Response(JSON.stringify({ 
      response: aiMessage,
      qualified: isQualified,
      sessionId,
      conversionScore,
      contactInfo: updatedContactInfo,
      leadCreated: !!leadId
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