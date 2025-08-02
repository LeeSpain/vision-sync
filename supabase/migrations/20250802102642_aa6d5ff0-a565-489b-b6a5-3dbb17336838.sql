-- Create AI Agents table
CREATE TABLE public.ai_agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  personality TEXT DEFAULT 'friendly and helpful',
  voice_id TEXT DEFAULT 'alloy',
  avatar_config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  business_knowledge JSONB DEFAULT '{}',
  conversation_rules JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI Conversations table
CREATE TABLE public.ai_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.ai_agents(id),
  session_id TEXT NOT NULL,
  visitor_id TEXT,
  lead_id UUID REFERENCES public.leads(id),
  conversation_data JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active',
  lead_qualified BOOLEAN DEFAULT false,
  conversion_score INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI Agent Settings table
CREATE TABLE public.ai_agent_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI Training Data table
CREATE TABLE public.ai_training_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  context JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agent_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_training_data ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_agents
CREATE POLICY "AI agents are viewable by everyone" 
ON public.ai_agents 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admin can manage all ai_agents" 
ON public.ai_agents 
FOR ALL 
USING (true);

-- Create policies for ai_conversations
CREATE POLICY "Admin can view all conversations" 
ON public.ai_conversations 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create conversations" 
ON public.ai_conversations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin can manage all conversations" 
ON public.ai_conversations 
FOR ALL 
USING (true);

-- Create policies for ai_agent_settings
CREATE POLICY "Admin can manage all settings" 
ON public.ai_agent_settings 
FOR ALL 
USING (true);

CREATE POLICY "Settings are viewable by everyone" 
ON public.ai_agent_settings 
FOR SELECT 
USING (true);

-- Create policies for ai_training_data
CREATE POLICY "Admin can manage all training data" 
ON public.ai_training_data 
FOR ALL 
USING (true);

CREATE POLICY "Active training data is viewable by everyone" 
ON public.ai_training_data 
FOR SELECT 
USING (is_active = true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_ai_agents_updated_at
BEFORE UPDATE ON public.ai_agents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_conversations_updated_at
BEFORE UPDATE ON public.ai_conversations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_agent_settings_updated_at
BEFORE UPDATE ON public.ai_agent_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_training_data_updated_at
BEFORE UPDATE ON public.ai_training_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default AI agent
INSERT INTO public.ai_agents (name, description, personality, voice_id, business_knowledge, conversation_rules) VALUES (
  'Customer Support AI',
  'Intelligent AI agent for customer support and sales conversion',
  'friendly, knowledgeable, and sales-focused',
  'alloy',
  '{"company_name": "Your Company", "services": ["Custom Builds", "Investment Opportunities", "Templates"], "specialties": ["AI Development", "Web Applications", "Business Solutions"]}',
  '{"lead_qualification": true, "max_conversation_length": 50, "escalation_triggers": ["complex_technical_question", "pricing_negotiation", "enterprise_inquiry"]}'
);

-- Insert default settings
INSERT INTO public.ai_agent_settings (setting_key, setting_value, description) VALUES 
('openai_api_key', '""', 'OpenAI API Key for AI conversations'),
('elevenlabs_api_key', '""', 'ElevenLabs API Key for voice synthesis'),
('chat_widget_enabled', 'true', 'Enable/disable chat widget on frontend'),
('lead_qualification_enabled', 'true', 'Enable automatic lead qualification'),
('voice_chat_enabled', 'true', 'Enable voice chat functionality');

-- Insert default training data
INSERT INTO public.ai_training_data (category, question, answer, context, priority) VALUES 
('company_info', 'What services do you offer?', 'We offer custom web development, AI agent solutions, investment opportunities, and ready-to-use templates for businesses looking to scale digitally.', '{"type": "general"}', 1),
('pricing', 'How much do your services cost?', 'Our pricing varies based on your specific needs. We offer custom builds starting from competitive rates, investment opportunities with different tiers, and template solutions. I can help you find the perfect solution for your budget.', '{"type": "sales"}', 1),
('contact', 'How can I get in touch?', 'You can speak with me right now for immediate assistance, or I can connect you with our sales team for more detailed discussions. What would you prefer?', '{"type": "general"}', 1);