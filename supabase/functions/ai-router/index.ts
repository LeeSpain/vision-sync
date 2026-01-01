import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface Agent {
  id: string;
  name: string;
  agent_type: string;
  access_level: string;
  personality: string;
  specializations: string[];
  knowledge_scope: string[];
  max_tokens: number;
  temperature: number;
  is_master: boolean;
  is_active: boolean;
}

interface RoutingRule {
  id: string;
  source_agent_id: string | null;
  target_agent_id: string;
  trigger_type: string;
  trigger_value: string;
  priority: number;
  is_active: boolean;
}

interface Analysis {
  intent: string;
  sentiment: number;
  topics: string[];
  hasContactInfo: boolean;
  contactInfo: { email?: string; phone?: string; name?: string };
  escalationRequested: boolean;
  escalationReason?: string;
  confidence: number;
}

interface RouterResponse {
  response: string;
  agent: { id: string; name: string; type: string };
  handoff: { occurred: boolean; from?: string; to?: string; reason?: string };
  analysis: Analysis;
  lead?: { id: string; score: number };
  sessionId: string;
  conversationId?: string;
}

// Intent patterns for analysis
const INTENT_PATTERNS = {
  pricing_inquiry: /\b(price|pricing|cost|how much|rates?|fees?|affordable|budget|expensive|cheap)\b/i,
  purchase_intent: /\b(buy|purchase|order|subscribe|sign up|get started|ready to|want to get)\b/i,
  demo_request: /\b(demo|demonstration|show me|see it|trial|try|test drive|walkthrough)\b/i,
  technical_support: /\b(help|support|issue|error|bug|broken|not working|crash|fail|problem with)\b/i,
  complaint: /\b(complaint|unhappy|dissatisfied|angry|frustrated|terrible|awful|worst|refund)\b/i,
  general_inquiry: /\b(what is|how does|tell me about|explain|information|learn|curious)\b/i,
  greeting: /^(hi|hello|hey|good morning|good afternoon|good evening|howdy)\b/i,
};

// Keyword patterns for routing
const KEYWORD_PATTERNS = {
  sales: /\b(price|cost|buy|quote|invest|pricing|purchase|order|demo|trial)\b/i,
  support: /\b(help|issue|problem|broken|not working|bug|error|support|fix)\b/i,
};

// Escalation triggers
const ESCALATION_TRIGGERS = /\b(human|real person|manager|supervisor|speak to someone|actual person|not a bot|stop bot)\b/i;

// Contact info patterns
const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
const PHONE_PATTERN = /\b(\+?[\d\s\-().]{10,})\b/;
const NAME_PATTERN = /\b(my name is|i'm|i am|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i;

function analyzeMessage(message: string, conversationHistory: Message[]): Analysis {
  const lowerMessage = message.toLowerCase();
  
  // Detect intent
  let intent = 'general_inquiry';
  let confidence = 0.5;
  
  for (const [intentName, pattern] of Object.entries(INTENT_PATTERNS)) {
    if (pattern.test(message)) {
      intent = intentName;
      confidence = 0.8;
      break;
    }
  }
  
  // Analyze sentiment (-1 to 1)
  let sentiment = 0;
  const positiveWords = /\b(great|love|amazing|awesome|excellent|wonderful|fantastic|happy|pleased|thank)\b/gi;
  const negativeWords = /\b(bad|hate|terrible|awful|horrible|disappointed|angry|frustrated|annoyed|upset)\b/gi;
  
  const positiveCount = (message.match(positiveWords) || []).length;
  const negativeCount = (message.match(negativeWords) || []).length;
  sentiment = Math.max(-1, Math.min(1, (positiveCount - negativeCount) * 0.3));
  
  // Extract topics
  const topics: string[] = [];
  if (/\b(template|templates)\b/i.test(message)) topics.push('templates');
  if (/\b(project|projects)\b/i.test(message)) topics.push('projects');
  if (/\b(pricing|price|cost)\b/i.test(message)) topics.push('pricing');
  if (/\b(custom|customize|customization)\b/i.test(message)) topics.push('customization');
  if (/\b(ai|artificial intelligence|agent)\b/i.test(message)) topics.push('ai');
  if (/\b(support|help)\b/i.test(message)) topics.push('support');
  
  // Extract contact info
  const contactInfo: { email?: string; phone?: string; name?: string } = {};
  const emailMatch = message.match(EMAIL_PATTERN);
  if (emailMatch) contactInfo.email = emailMatch[0];
  
  const phoneMatch = message.match(PHONE_PATTERN);
  if (phoneMatch) contactInfo.phone = phoneMatch[1].replace(/\s+/g, '');
  
  const nameMatch = message.match(NAME_PATTERN);
  if (nameMatch) contactInfo.name = nameMatch[2];
  
  const hasContactInfo = Object.keys(contactInfo).length > 0;
  
  // Check for escalation
  const escalationRequested = ESCALATION_TRIGGERS.test(message);
  const escalationReason = escalationRequested ? 'User requested human assistance' : undefined;
  
  return {
    intent,
    sentiment,
    topics,
    hasContactInfo,
    contactInfo,
    escalationRequested,
    escalationReason,
    confidence,
  };
}

function calculateLeadScore(analysis: Analysis, conversationLength: number): number {
  let score = 0;
  
  // Intent scoring
  if (analysis.intent === 'purchase_intent') score += 40;
  else if (analysis.intent === 'demo_request') score += 35;
  else if (analysis.intent === 'pricing_inquiry') score += 30;
  else if (analysis.intent === 'general_inquiry') score += 10;
  
  // Contact info scoring
  if (analysis.contactInfo.email) score += 25;
  if (analysis.contactInfo.phone) score += 15;
  if (analysis.contactInfo.name) score += 5;
  
  // Engagement scoring
  if (conversationLength > 5) score += 10;
  else if (conversationLength > 3) score += 5;
  
  // Sentiment scoring
  if (analysis.sentiment > 0.3) score += 5;
  
  return Math.min(100, score);
}

async function selectAgent(
  supabase: any,
  analysis: Analysis,
  currentAgentId: string | null,
  isAdmin: boolean,
  forceBrain: boolean,
  pageContext: string,
  conversationLength: number
): Promise<{ agent: Agent; handoffReason?: string }> {
  
  // Fetch all active agents
  const { data: agents, error: agentsError } = await supabase
    .from('ai_agents')
    .select('*')
    .eq('is_active', true);
  
  if (agentsError || !agents?.length) {
    throw new Error('No active agents available');
  }
  
  // If admin with forceBrain, use Brain agent
  if (isAdmin && forceBrain) {
    const brainAgent = agents.find((a: Agent) => a.agent_type === 'brain');
    if (brainAgent) {
      return { agent: brainAgent, handoffReason: 'Admin requested Brain agent' };
    }
  }
  
  // If escalation requested, escalate to Brain
  if (analysis.escalationRequested) {
    const brainAgent = agents.find((a: Agent) => a.agent_type === 'brain');
    if (brainAgent) {
      return { agent: brainAgent, handoffReason: 'User requested human/escalation' };
    }
  }
  
  // Fetch routing rules
  const { data: rules } = await supabase
    .from('agent_routing_rules')
    .select('*')
    .eq('is_active', true)
    .order('priority', { ascending: false });
  
  // Check intent-based routing rules
  if (rules?.length) {
    for (const rule of rules as RoutingRule[]) {
      if (rule.trigger_type === 'intent' && rule.trigger_value === analysis.intent) {
        const targetAgent = agents.find((a: Agent) => a.id === rule.target_agent_id);
        if (targetAgent) {
          // Don't switch if already with this agent type (sticky routing)
          if (currentAgentId && currentAgentId === targetAgent.id) {
            return { agent: targetAgent };
          }
          // Only switch if clear signal (confidence > 0.7 or conversation < 3 messages)
          if (analysis.confidence > 0.7 || conversationLength < 3) {
            return { agent: targetAgent, handoffReason: `Intent: ${analysis.intent}` };
          }
        }
      }
    }
    
    // Check keyword-based routing rules
    for (const rule of rules as RoutingRule[]) {
      if (rule.trigger_type === 'keyword') {
        const keywords = rule.trigger_value.split(',').map(k => k.trim().toLowerCase());
        const messageWords = analysis.topics.map(t => t.toLowerCase());
        
        if (keywords.some(k => messageWords.includes(k))) {
          const targetAgent = agents.find((a: Agent) => a.id === rule.target_agent_id);
          if (targetAgent && (!currentAgentId || currentAgentId !== targetAgent.id)) {
            if (conversationLength < 3) {
              return { agent: targetAgent, handoffReason: `Keyword match` };
            }
          }
        }
      }
    }
  }
  
  // Keyword pattern routing (fallback)
  if (KEYWORD_PATTERNS.sales.test(analysis.topics.join(' '))) {
    const salesAgent = agents.find((a: Agent) => a.agent_type === 'sales');
    if (salesAgent && (!currentAgentId || conversationLength < 2)) {
      return { agent: salesAgent, handoffReason: 'Sales-related inquiry' };
    }
  }
  
  if (KEYWORD_PATTERNS.support.test(analysis.topics.join(' '))) {
    const supportAgent = agents.find((a: Agent) => a.agent_type === 'support');
    if (supportAgent && (!currentAgentId || conversationLength < 2)) {
      return { agent: supportAgent, handoffReason: 'Support-related inquiry' };
    }
  }
  
  // Page context routing
  if (pageContext) {
    if (pageContext.includes('pricing') || pageContext.includes('investor')) {
      const salesAgent = agents.find((a: Agent) => a.agent_type === 'sales');
      if (salesAgent) return { agent: salesAgent, handoffReason: 'Page context: pricing/investor' };
    }
    if (pageContext.includes('contact') || pageContext.includes('support')) {
      const supportAgent = agents.find((a: Agent) => a.agent_type === 'support');
      if (supportAgent) return { agent: supportAgent, handoffReason: 'Page context: contact/support' };
    }
  }
  
  // Keep current agent if assigned (sticky routing)
  if (currentAgentId) {
    const currentAgent = agents.find((a: Agent) => a.id === currentAgentId);
    if (currentAgent) return { agent: currentAgent };
  }
  
  // Default to sales agent for new conversations (or general if no sales)
  const defaultAgent = agents.find((a: Agent) => a.agent_type === 'sales') 
    || agents.find((a: Agent) => a.agent_type === 'general')
    || agents[0];
  
  return { agent: defaultAgent };
}

function buildSystemPrompt(agent: Agent, pageContext: string, isAdmin: boolean): string {
  let systemPrompt = agent.personality || `You are ${agent.name}, a helpful AI assistant.`;
  
  systemPrompt += `\n\nIMPORTANT GUIDELINES:
- Never use markdown formatting (no **, ##, -, or bullet points)
- Keep responses conversational and concise (2-3 sentences max)
- Be helpful and friendly
- If you don't know something, say so honestly`;

  if (agent.agent_type === 'sales') {
    systemPrompt += `\n\nSALES GUIDELINES:
- Focus on understanding customer needs first
- Don't ask for contact information in the first 3 messages
- Only ask for contact info after establishing genuine interest
- Be consultative, not pushy`;
  }
  
  if (agent.agent_type === 'support') {
    systemPrompt += `\n\nSUPPORT GUIDELINES:
- Be patient and empathetic
- Focus on solving problems
- If you can't help, offer to escalate
- Never get frustrated`;
  }
  
  if (agent.agent_type === 'brain' && isAdmin) {
    systemPrompt += `\n\nBRAIN/ADMIN GUIDELINES:
- You have access to all business data and metrics
- Provide strategic insights and analytics
- Be proactive about identifying opportunities
- Report on lead quality and conversion patterns`;
  }
  
  if (pageContext) {
    systemPrompt += `\n\nThe user is currently on the ${pageContext} page.`;
  }
  
  return systemPrompt;
}

function generateHandoffMessage(fromAgent: string, toAgent: string, reason: string): string {
  const handoffMessages: { [key: string]: string } = {
    'sales': `I'm connecting you with ${toAgent}, who can better help with your inquiry.`,
    'support': `Let me bring in ${toAgent} from our support team to help you with this.`,
    'brain': `I'm escalating this to ${toAgent} who has more context to assist you.`,
  };
  
  return handoffMessages[fromAgent] || `I'm connecting you with ${toAgent} to continue helping you.`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      message, 
      sessionId, 
      conversationHistory = [], 
      isAdmin = false, 
      adminToken,
      forceBrain = false,
      pageContext = '',
      currentAgentId = null
    } = await req.json();

    console.log('AI Router received:', { message: message?.substring(0, 50), sessionId, isAdmin, forceBrain, pageContext });

    if (!message) {
      throw new Error('Message is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Analyze the message
    const analysis = analyzeMessage(message, conversationHistory);
    console.log('Message analysis:', analysis);

    // Select appropriate agent
    const { agent, handoffReason } = await selectAgent(
      supabase,
      analysis,
      currentAgentId,
      isAdmin,
      forceBrain,
      pageContext,
      conversationHistory.length
    );
    console.log('Selected agent:', agent.name, 'Reason:', handoffReason);

    // Track handoff
    const handoffOccurred = currentAgentId !== null && currentAgentId !== agent.id;
    let previousAgentName: string | undefined;
    
    if (handoffOccurred && currentAgentId) {
      const { data: prevAgent } = await supabase
        .from('ai_agents')
        .select('name')
        .eq('id', currentAgentId)
        .single();
      previousAgentName = prevAgent?.name;
    }

    // Build conversation for AI
    const systemPrompt = buildSystemPrompt(agent, pageContext, isAdmin);
    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // Last 10 messages for context
      { role: 'user', content: message }
    ];

    // Generate response using Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        max_tokens: agent.max_tokens || 500,
        temperature: agent.temperature || 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'AI service requires payment. Please contact support.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    let responseText = aiData.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    // Add handoff message if switching agents
    if (handoffOccurred && previousAgentName) {
      const handoffMsg = generateHandoffMessage(previousAgentName, agent.name, handoffReason || '');
      responseText = `${handoffMsg}\n\n${responseText}`;
    }

    // Create or update conversation tracking
    let conversationId: string | undefined;
    const finalSessionId = sessionId || crypto.randomUUID();

    // Check for existing conversation
    const { data: existingConv } = await supabase
      .from('ai_conversations')
      .select('id')
      .eq('session_id', finalSessionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingConv) {
      conversationId = existingConv.id;
      // Update conversation with new analysis
      await supabase
        .from('ai_conversations')
        .update({
          current_agent_id: agent.id,
          intent: analysis.intent,
          sentiment: analysis.sentiment,
          topics: analysis.topics,
          is_escalated: analysis.escalationRequested,
          agent_history: supabase.rpc ? undefined : JSON.stringify([
            ...(conversationHistory.length > 0 ? [{ agent_id: currentAgentId, timestamp: new Date().toISOString() }] : []),
            { agent_id: agent.id, timestamp: new Date().toISOString() }
          ])
        })
        .eq('id', conversationId);
    } else {
      // Create new conversation
      const { data: newConv } = await supabase
        .from('ai_conversations')
        .insert({
          session_id: finalSessionId,
          current_agent_id: agent.id,
          user_message: message,
          ai_response: responseText,
          intent: analysis.intent,
          sentiment: analysis.sentiment,
          topics: analysis.topics,
          is_escalated: analysis.escalationRequested,
          agent_history: [{ agent_id: agent.id, timestamp: new Date().toISOString() }],
          status: 'active'
        })
        .select('id')
        .single();
      
      conversationId = newConv?.id;
    }

    // Track agent conversation segment
    if (conversationId) {
      await supabase
        .from('agent_conversations')
        .insert({
          conversation_id: conversationId,
          agent_id: agent.id,
          handoff_reason: handoffReason,
          handoff_from: handoffOccurred ? currentAgentId : null,
          messages_handled: 1
        });
    }

    // Create lead if contact info provided and score is good
    let leadInfo: { id: string; score: number } | undefined;
    const leadScore = calculateLeadScore(analysis, conversationHistory.length);
    
    if (analysis.hasContactInfo && leadScore >= 30) {
      const { data: newLead, error: leadError } = await supabase
        .from('leads')
        .insert({
          name: analysis.contactInfo.name || 'Chat Lead',
          email: analysis.contactInfo.email || '',
          phone: analysis.contactInfo.phone,
          source: 'ai_chat',
          status: 'new',
          pipeline_stage: 'new',
          lead_score: leadScore,
          notes: `Intent: ${analysis.intent}\nTopics: ${analysis.topics.join(', ')}\nSentiment: ${analysis.sentiment}`,
          form_data: {
            session_id: finalSessionId,
            conversation_id: conversationId,
            agent: agent.name,
            analysis
          }
        })
        .select('id')
        .single();

      if (!leadError && newLead) {
        leadInfo = { id: newLead.id, score: leadScore };
        console.log('Lead created:', leadInfo);
      }
    }

    // Handle escalation tracking
    if (analysis.escalationRequested && conversationId) {
      await supabase
        .from('human_escalations')
        .insert({
          conversation_id: conversationId,
          escalated_by_agent: agent.id,
          reason: analysis.escalationReason || 'User requested human assistance',
          priority: analysis.sentiment < -0.3 ? 'high' : 'normal',
          status: 'pending'
        });
    }

    const response: RouterResponse = {
      response: responseText,
      agent: {
        id: agent.id,
        name: agent.name,
        type: agent.agent_type
      },
      handoff: {
        occurred: handoffOccurred,
        from: previousAgentName,
        to: handoffOccurred ? agent.name : undefined,
        reason: handoffReason
      },
      analysis,
      lead: leadInfo,
      sessionId: finalSessionId,
      conversationId
    };

    console.log('Router response prepared:', { agent: response.agent.name, handoff: response.handoff.occurred });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI Router error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      response: "I apologize, but I'm having trouble processing your request. Please try again in a moment."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
