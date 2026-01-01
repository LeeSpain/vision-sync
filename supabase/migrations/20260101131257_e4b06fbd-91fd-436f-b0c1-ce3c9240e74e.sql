-- 1. ADD columns to ai_agents table
ALTER TABLE public.ai_agents
ADD COLUMN agent_type text NOT NULL DEFAULT 'general',
ADD COLUMN access_level text DEFAULT 'public',
ADD COLUMN specializations text[] DEFAULT '{}',
ADD COLUMN knowledge_scope text[] DEFAULT '{}',
ADD COLUMN max_tokens integer DEFAULT 500,
ADD COLUMN temperature numeric DEFAULT 0.7,
ADD COLUMN is_master boolean DEFAULT false,
ADD COLUMN parent_agent_id uuid REFERENCES public.ai_agents(id);

-- 2. ADD columns to ai_conversations table
ALTER TABLE public.ai_conversations
ADD COLUMN current_agent_id uuid REFERENCES public.ai_agents(id),
ADD COLUMN intent text,
ADD COLUMN sentiment numeric DEFAULT 0,
ADD COLUMN topics text[] DEFAULT '{}',
ADD COLUMN is_escalated boolean DEFAULT false,
ADD COLUMN resolution_status text,
ADD COLUMN agent_history jsonb DEFAULT '[]';

-- 3. CREATE TABLE agent_routing_rules
CREATE TABLE public.agent_routing_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_agent_id uuid REFERENCES public.ai_agents(id),
  target_agent_id uuid REFERENCES public.ai_agents(id),
  trigger_type text NOT NULL,
  trigger_value text NOT NULL,
  priority integer DEFAULT 5,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.agent_routing_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.agent_routing_rules
FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.agent_routing_rules
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.agent_routing_rules
FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.agent_routing_rules
FOR DELETE USING (true);

-- 4. CREATE TABLE agent_conversations
CREATE TABLE public.agent_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.ai_conversations(id),
  agent_id uuid REFERENCES public.ai_agents(id),
  started_at timestamp with time zone DEFAULT now(),
  ended_at timestamp with time zone,
  handoff_reason text,
  handoff_from uuid REFERENCES public.ai_agents(id),
  messages_handled integer DEFAULT 0,
  outcome text
);

ALTER TABLE public.agent_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.agent_conversations
FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.agent_conversations
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.agent_conversations
FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.agent_conversations
FOR DELETE USING (true);

-- 5. CREATE TABLE human_escalations
CREATE TABLE public.human_escalations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.ai_conversations(id),
  escalated_by_agent uuid REFERENCES public.ai_agents(id),
  reason text NOT NULL,
  priority text DEFAULT 'normal',
  status text DEFAULT 'pending',
  assigned_to text,
  created_at timestamp with time zone DEFAULT now(),
  resolved_at timestamp with time zone
);

ALTER TABLE public.human_escalations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.human_escalations
FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.human_escalations
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.human_escalations
FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.human_escalations
FOR DELETE USING (true);

-- 6. CREATE TABLE brain_reports
CREATE TABLE public.brain_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type text NOT NULL,
  report_data jsonb NOT NULL,
  generated_at timestamp with time zone DEFAULT now(),
  priority text DEFAULT 'normal'
);

ALTER TABLE public.brain_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.brain_reports
FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.brain_reports
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.brain_reports
FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON public.brain_reports
FOR DELETE USING (true);