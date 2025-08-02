-- Add agent_id column to ai_agent_settings to make settings agent-specific
ALTER TABLE ai_agent_settings ADD COLUMN agent_id UUID REFERENCES ai_agents(id);

-- Add agent_id column to ai_training_data to make training data agent-specific  
ALTER TABLE ai_training_data ADD COLUMN agent_id UUID REFERENCES ai_agents(id);

-- Add category column to ai_agents for agent categorization
ALTER TABLE ai_agents ADD COLUMN category TEXT DEFAULT 'customer_support';

-- Add role and department columns for better organization
ALTER TABLE ai_agents ADD COLUMN role TEXT DEFAULT 'support';
ALTER TABLE ai_agents ADD COLUMN department TEXT DEFAULT 'customer_service';

-- Create agent templates for quick setup
CREATE TABLE ai_agent_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  description TEXT,
  personality TEXT NOT NULL,
  voice_id TEXT DEFAULT 'alloy',
  business_knowledge JSONB DEFAULT '{}',
  conversation_rules JSONB DEFAULT '{}',
  default_settings JSONB DEFAULT '{}',
  training_data JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for agent templates
ALTER TABLE ai_agent_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for agent templates
CREATE POLICY "Templates are viewable by everyone" 
ON ai_agent_templates 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage all templates" 
ON ai_agent_templates 
FOR ALL 
USING (true);

-- Insert default agent templates
INSERT INTO ai_agent_templates (name, category, role, department, description, personality, default_settings, training_data) VALUES
('Customer Support AI', 'customer_support', 'support', 'customer_service', 
 'Handles customer inquiries, support tickets, and general assistance',
 'Professional, empathetic, and solution-oriented. Always aim to resolve customer issues quickly and effectively.',
 '{"response_tone": "friendly_professional", "response_format": "conversational", "greeting_delay": 2000, "max_response_length": 500}',
 '[{"category": "Support", "question": "How do I contact support?", "answer": "You can contact our support team through this chat, email, or phone. We are here to help!", "priority": 5}]'),

('Sales AI', 'sales', 'sales_rep', 'sales', 
 'Qualifies leads, presents products/services, and guides prospects through the sales process',
 'Persuasive, knowledgeable, and results-driven. Focus on understanding customer needs and presenting relevant solutions.',
 '{"response_tone": "professional", "response_format": "bullet_points", "greeting_delay": 1500, "max_response_length": 600}',
 '[{"category": "Sales", "question": "What services do you offer?", "answer": "We offer a range of innovative solutions designed to help your business grow. Let me understand your specific needs to recommend the best fit.", "priority": 5}]'),

('Marketing AI', 'marketing', 'marketing_specialist', 'marketing', 
 'Engages website visitors, promotes products/services, and captures marketing qualified leads',
 'Creative, engaging, and brand-focused. Generate interest and excitement about our offerings.',
 '{"response_tone": "friendly", "response_format": "conversational", "greeting_delay": 2500, "max_response_length": 400}',
 '[{"category": "Marketing", "question": "Tell me about your latest offerings", "answer": "We have some exciting new solutions that could transform your business! Let me share what makes us unique in the market.", "priority": 5}]'),

('Technical Support AI', 'technical_support', 'tech_support', 'technical', 
 'Provides technical assistance, troubleshooting, and product guidance',
 'Technical, precise, and methodical. Break down complex issues into clear, actionable steps.',
 '{"response_tone": "professional", "response_format": "bullet_points", "greeting_delay": 1000, "max_response_length": 700}',
 '[{"category": "Technical", "question": "I am having technical issues", "answer": "I will help you resolve this technical issue step by step. Can you describe what specific problem you are experiencing?", "priority": 5}]'),

('HR Assistant AI', 'hr', 'hr_representative', 'human_resources', 
 'Assists with HR inquiries, policies, and employee support',
 'Supportive, confidential, and policy-aware. Help employees with HR-related questions and concerns.',
 '{"response_tone": "friendly_professional", "response_format": "paragraphs", "greeting_delay": 2000, "max_response_length": 500}',
 '[{"category": "HR", "question": "What are the company policies?", "answer": "I can help you understand our company policies and procedures. What specific policy information are you looking for?", "priority": 5}]');

-- Add trigger for agent templates
CREATE TRIGGER update_agent_templates_updated_at
BEFORE UPDATE ON ai_agent_templates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Update existing data to link to the default Customer Support agent (if exists)
DO $$
DECLARE
    default_agent_id UUID;
BEGIN
    -- Get the first agent ID (assuming it's the Customer Support agent)
    SELECT id INTO default_agent_id FROM ai_agents LIMIT 1;
    
    IF default_agent_id IS NOT NULL THEN
        -- Update existing settings to be linked to this agent
        UPDATE ai_agent_settings SET agent_id = default_agent_id WHERE agent_id IS NULL;
        
        -- Update existing training data to be linked to this agent  
        UPDATE ai_training_data SET agent_id = default_agent_id WHERE agent_id IS NULL;
    END IF;
END $$;