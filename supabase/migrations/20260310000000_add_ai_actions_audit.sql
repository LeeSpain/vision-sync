-- Migration: Add ai_actions audit table
-- Every AI agent response is logged here for auditability, debugging, and analytics

CREATE TABLE public.ai_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

  -- Agent context
  agent_id TEXT,
  agent_type TEXT,
  session_id TEXT,

  -- User context
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_identifier TEXT, -- anonymous session identifier if not authenticated

  -- Interaction payload
  input TEXT NOT NULL,
  output TEXT NOT NULL,
  intent TEXT,

  -- Quality signals
  confidence NUMERIC(4,3) CHECK (confidence >= 0 AND confidence <= 1),
  sentiment NUMERIC(4,3) CHECK (sentiment >= -1 AND sentiment <= 1),
  flagged_for_review BOOLEAN NOT NULL DEFAULT false,

  -- Outcome tracking
  lead_created BOOLEAN NOT NULL DEFAULT false,
  escalated BOOLEAN NOT NULL DEFAULT false,
  handoff_triggered BOOLEAN NOT NULL DEFAULT false,

  -- Source metadata
  source TEXT DEFAULT 'ai-router', -- which edge function handled this
  model TEXT DEFAULT 'claude-sonnet-4-20250514',
  tokens_used INTEGER,

  -- Processing time
  response_time_ms INTEGER
);

-- Enable RLS
ALTER TABLE public.ai_actions ENABLE ROW LEVEL SECURITY;

-- Admins can read all ai_actions
CREATE POLICY "Admins can read ai_actions"
  ON public.ai_actions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Edge functions (service role) can insert
CREATE POLICY "Service role can insert ai_actions"
  ON public.ai_actions
  FOR INSERT
  WITH CHECK (true);

-- Indexes for common query patterns
CREATE INDEX idx_ai_actions_created_at ON public.ai_actions (created_at DESC);
CREATE INDEX idx_ai_actions_agent_id ON public.ai_actions (agent_id);
CREATE INDEX idx_ai_actions_session_id ON public.ai_actions (session_id);
CREATE INDEX idx_ai_actions_flagged ON public.ai_actions (flagged_for_review) WHERE flagged_for_review = true;
CREATE INDEX idx_ai_actions_lead_created ON public.ai_actions (lead_created) WHERE lead_created = true;
