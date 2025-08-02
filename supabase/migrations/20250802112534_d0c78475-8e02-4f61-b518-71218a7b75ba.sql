-- Add welcome message and interaction control settings
INSERT INTO ai_agent_settings (setting_key, setting_value, description) VALUES
('welcome_message', '"Hello! I''m here to help you discover amazing digital solutions. What kind of project are you looking for today?"', 'Customizable welcome message displayed when chat opens'),
('quick_actions', '["Tell me about AI solutions", "I need a custom app", "Show me investment opportunities", "I want to discuss pricing"]', 'Quick action buttons shown below welcome message'),
('greeting_delay', '1000', 'Delay in milliseconds before showing welcome message'),
('initial_prompts', '["What type of business are you in?", "What''s your budget range?", "Do you have a timeline in mind?"]', 'Follow-up prompts to guide conversation'),
('contact_collection_timing', '"after_3_messages"', 'When to start collecting contact information (immediate, after_N_messages, on_trigger)'),
('max_response_length', '250', 'Maximum number of tokens in AI responses'),
('response_tone', '"friendly_professional"', 'Tone of AI responses (professional, friendly, casual, friendly_professional)'),
('response_format', '"conversational"', 'Format of responses (bullet_points, paragraphs, conversational)'),
('emoji_usage', '"minimal"', 'How much to use emojis (disabled, minimal, moderate, frequent)'),
('escalation_triggers', '["speak to human", "talk to someone", "human agent", "real person", "customer service"]', 'Keywords that trigger human handoff requests')
ON CONFLICT (setting_key) DO UPDATE SET 
setting_value = EXCLUDED.setting_value,
description = EXCLUDED.description;