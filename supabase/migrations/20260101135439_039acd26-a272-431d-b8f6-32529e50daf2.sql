-- Create table to track routing rule triggers
CREATE TABLE public.routing_rule_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_id UUID REFERENCES public.agent_routing_rules(id) ON DELETE CASCADE,
  triggered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT,
  message_preview TEXT,
  confidence_score NUMERIC DEFAULT 0,
  result_agent_id UUID REFERENCES public.ai_agents(id) ON DELETE SET NULL
);

-- Create index for faster queries
CREATE INDEX idx_routing_rule_analytics_rule_id ON public.routing_rule_analytics(rule_id);
CREATE INDEX idx_routing_rule_analytics_triggered_at ON public.routing_rule_analytics(triggered_at DESC);

-- Enable Row Level Security
ALTER TABLE public.routing_rule_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (admin-only in practice via UI)
CREATE POLICY "Enable read access for all users" 
ON public.routing_rule_analytics 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert access for all users" 
ON public.routing_rule_analytics 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable delete access for all users" 
ON public.routing_rule_analytics 
FOR DELETE 
USING (true);