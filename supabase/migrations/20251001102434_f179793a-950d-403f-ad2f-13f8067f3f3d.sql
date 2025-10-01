-- Create first AI agent based on Customer Support template
INSERT INTO ai_agents (
  name,
  description,
  category,
  role,
  personality,
  voice_id,
  is_active,
  department
)
VALUES (
  'Vision-Sync Support Assistant',
  'Helpful assistant for customer inquiries and support requests',
  'Support',
  'Customer Service',
  'Professional and friendly',
  'voice-1',
  true,
  'Customer Support'
)
RETURNING id;

-- Insert default settings for the new agent
INSERT INTO ai_agent_settings (
  agent_id,
  setting_key,
  setting_value,
  description
)
SELECT 
  (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1),
  'max_response_length',
  '200'::jsonb,
  'Maximum length of agent responses'
UNION ALL
SELECT 
  (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1),
  'response_tone',
  '"helpful"'::jsonb,
  'Tone of agent responses';

-- Add initial training data
INSERT INTO ai_training_data (
  agent_id,
  training_type,
  content,
  is_active,
  metadata
)
SELECT 
  (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1),
  'knowledge',
  'Vision-Sync specializes in AI-powered business solutions including AI agents, custom web applications, and templates. We help businesses automate customer service, streamline operations, and scale efficiently.',
  true,
  '{"source": "initial_setup"}'::jsonb;