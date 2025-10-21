-- Add missing columns to leads table
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent'));

-- Add missing columns to ai_conversations table
ALTER TABLE ai_conversations 
ADD COLUMN IF NOT EXISTS conversation_data JSONB,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
ADD COLUMN IF NOT EXISTS lead_qualified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS conversion_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS visitor_id TEXT,
ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES leads(id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_ai_conversations_session_id ON ai_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_lead_id ON ai_conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);