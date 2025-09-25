-- Insert sample data for testing
INSERT INTO public.projects (title, description, category, image_url, demo_url, technologies, is_featured, is_public) VALUES 
('AI Spain Homes', 'Intelligent real estate platform for finding homes in Spain', 'Real Estate', '/lovable-uploads/afb9cb1e-a617-48d7-b0bf-062beac34324.png', '/ai-spain-homes', ARRAY['React', 'AI', 'Maps'], true, true),
('ConnectQt Central', 'Unified communication and project management platform', 'Business', '/placeholder.svg', '/conneqt-central', ARRAY['React', 'WebRTC', 'Real-time'], false, true),
('Nurse Sync', 'Healthcare staff scheduling and management system', 'Healthcare', '/placeholder.svg', '/nurse-sync', ARRAY['React', 'Calendar', 'Notifications'], true, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.app_templates (title, description, category, industry, image_url, features, pricing, is_active, is_popular) VALUES 
('E-commerce Store', 'Complete online store with payment processing', 'E-commerce', 'Retail', '/placeholder.svg', ARRAY['Shopping Cart', 'Payment Gateway', 'Inventory Management'], '{"basic": 299, "premium": 599}', true, true),
('Healthcare Portal', 'Patient management and telemedicine platform', 'Healthcare', 'Medical', '/placeholder.svg', ARRAY['Patient Records', 'Video Calls', 'Appointment Booking'], '{"basic": 499, "premium": 999}', true, false),
('Real Estate Platform', 'Property listing and management system', 'Real Estate', 'Property', '/placeholder.svg', ARRAY['Property Listings', 'Virtual Tours', 'Lead Management'], '{"basic": 399, "premium": 799}', true, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.ai_agent_templates (name, category, role, description, personality, voice_id, default_settings) VALUES 
('Customer Support Agent', 'Support', 'Customer Service', 'Helpful assistant for customer inquiries', 'Professional and friendly', 'voice-1', '{"response_tone": "helpful", "max_response_length": 200}'),
('Sales Assistant', 'Sales', 'Sales Representative', 'Engaging sales assistant for lead qualification', 'Enthusiastic and persuasive', 'voice-2', '{"response_tone": "persuasive", "max_response_length": 150}'),
('Technical Specialist', 'Technical', 'Technical Support', 'Expert technical support for complex issues', 'Knowledgeable and patient', 'voice-3', '{"response_tone": "technical", "max_response_length": 300}')
ON CONFLICT (id) DO NOTHING;