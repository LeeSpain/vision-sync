import { supabase } from "@/integrations/supabase/client";

export async function seedMultiAgentSystem() {
  // Check if agents already exist
  const { data: existingAgents } = await supabase
    .from("ai_agents")
    .select("name")
    .in("name", ["Nexus", "Alex", "Morgan"]);

  if (existingAgents && existingAgents.length > 0) {
    throw new Error("Multi-agent system already initialized. Agents exist: " + existingAgents.map(a => a.name).join(", "));
  }

  // 1. Create BRAIN AGENT (Nexus)
  const { data: nexus, error: nexusError } = await supabase
    .from("ai_agents")
    .insert({
      name: "Nexus",
      agent_type: "brain",
      access_level: "admin",
      is_master: true,
      is_active: true,
      description: "Master AI orchestrator with full admin access",
      personality: "You are Nexus, the master AI orchestrator for Vision Sync. You have complete visibility into all business operations, conversations, leads, and metrics. You report directly to the business owner and provide strategic insights. You are analytical, proactive, and focused on business growth.",
      specializations: ["analytics", "reporting", "oversight", "strategy"],
      knowledge_scope: ["projects", "templates", "leads", "quotes", "conversations", "analytics"],
      max_tokens: 1000,
      temperature: 0.5
    })
    .select()
    .single();

  if (nexusError) throw nexusError;

  // 2. Create SUPPORT AGENT (Alex)
  const { data: alex, error: alexError } = await supabase
    .from("ai_agents")
    .insert({
      name: "Alex",
      agent_type: "support",
      access_level: "public",
      is_master: false,
      is_active: true,
      description: "Customer support specialist",
      personality: "You are Alex, the friendly customer support specialist at Vision Sync. You're patient, empathetic, and focused on solving problems. You never get frustrated and always aim to help. If you can't solve something, you smoothly escalate. You're knowledgeable but focus on helping, not selling.",
      specializations: ["support", "troubleshooting", "faq", "complaints"],
      knowledge_scope: ["projects", "templates", "faq"],
      max_tokens: 400,
      temperature: 0.7
    })
    .select()
    .single();

  if (alexError) throw alexError;

  // 3. Create SALES AGENT (Morgan)
  const { data: morgan, error: morganError } = await supabase
    .from("ai_agents")
    .insert({
      name: "Morgan",
      agent_type: "sales",
      access_level: "public",
      is_master: false,
      is_active: true,
      description: "Consultative sales advisor",
      personality: "You are Morgan, a consultative sales advisor at Vision Sync. You focus on understanding customer needs before recommending solutions. You're enthusiastic but not pushy. You build trust through value, not pressure. You qualify leads naturally. You only ask for contact info after establishing genuine interest.",
      specializations: ["sales", "qualification", "recommendations", "pricing", "demos"],
      knowledge_scope: ["projects", "templates", "pricing", "leads"],
      max_tokens: 500,
      temperature: 0.7
    })
    .select()
    .single();

  if (morganError) throw morganError;

  // Create routing rules
  const routingRules = [
    // Intent-based rules to Sales
    { source_agent_id: null, target_agent_id: morgan.id, trigger_type: "intent", trigger_value: "pricing_inquiry", priority: 10 },
    { source_agent_id: null, target_agent_id: morgan.id, trigger_type: "intent", trigger_value: "purchase_intent", priority: 10 },
    { source_agent_id: null, target_agent_id: morgan.id, trigger_type: "intent", trigger_value: "demo_request", priority: 10 },
    // Intent-based rules to Support
    { source_agent_id: null, target_agent_id: alex.id, trigger_type: "intent", trigger_value: "technical_support", priority: 10 },
    { source_agent_id: null, target_agent_id: alex.id, trigger_type: "intent", trigger_value: "complaint", priority: 10 },
    // Keyword-based rules to Sales
    { source_agent_id: null, target_agent_id: morgan.id, trigger_type: "keyword", trigger_value: "price,cost,buy,quote,invest", priority: 5 },
    // Keyword-based rules to Support
    { source_agent_id: null, target_agent_id: alex.id, trigger_type: "keyword", trigger_value: "help,issue,problem,broken,not working,bug", priority: 5 },
  ];

  const { error: routingError } = await supabase
    .from("agent_routing_rules")
    .insert(routingRules);

  if (routingError) throw routingError;

  return {
    agents: { nexus, alex, morgan },
    routingRulesCount: routingRules.length
  };
}
