-- Phase 1: Add comprehensive business knowledge

-- Company Information
INSERT INTO ai_training_data (agent_id, training_type, content, is_active, metadata)
SELECT 
  (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1),
  'knowledge',
  'COMPANY OVERVIEW: Vision-Sync Forge is a cutting-edge software development company specializing in AI-powered business solutions. We transform businesses through intelligent automation, custom development, and ready-to-deploy templates. Our mission is to empower businesses with AI technology that drives efficiency, reduces costs, and accelerates growth.',
  true,
  '{"category": "company_info", "priority": "high"}'::jsonb;

-- Service Offerings - AI Solutions
INSERT INTO ai_training_data (agent_id, training_type, content, is_active, metadata)
SELECT 
  (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1),
  'knowledge',
  'SERVICE: AI AGENTS - We create custom AI agents for various business needs including customer support, sales assistance, appointment scheduling, and internal operations. Pricing starts at $5k for basic agents, $10k-$20k for advanced agents with integrations, and $20k+ for enterprise solutions. Development timeline is typically 2-4 weeks for basic agents, 4-8 weeks for advanced solutions.',
  true,
  '{"category": "services", "service_type": "ai_agents", "priority": "high"}'::jsonb;

-- Service Offerings - Custom Development
INSERT INTO ai_training_data (agent_id, training_type, content, is_active, metadata)
SELECT 
  (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1),
  'knowledge',
  'SERVICE: CUSTOM DEVELOPMENT - We build bespoke web applications tailored to your exact requirements. This includes full-stack development, database design, API integrations, and custom UI/UX. Pricing ranges from $10k-$50k+ depending on complexity. Timeline is 4-12 weeks based on scope. Technologies: React, TypeScript, Supabase, Node.js, AI integrations.',
  true,
  '{"category": "services", "service_type": "custom_development", "priority": "high"}'::jsonb;

-- Service Offerings - Templates
INSERT INTO ai_training_data (agent_id, training_type, content, is_active, metadata)
SELECT 
  (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1),
  'knowledge',
  'SERVICE: OFF-THE-SHELF TEMPLATES - Ready-to-deploy application templates that can be customized to your brand and needs. Much faster and more cost-effective than custom development. Pricing: $2k-$10k for template customization. Timeline: 1-3 weeks. We offer templates for e-commerce, healthcare, real estate, SaaS platforms, and more.',
  true,
  '{"category": "services", "service_type": "templates", "priority": "high"}'::jsonb;

-- Phase 2: FAQ - Pricing
INSERT INTO ai_training_data (agent_id, training_type, content, is_active, metadata)
SELECT 
  (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1),
  'faq',
  'Q: How much does it cost to build a custom solution? A: Our pricing varies based on complexity and requirements. Basic AI agents start at $5k, custom web applications range from $10k-$50k+, and template customization costs $2k-$10k. We provide detailed quotes after understanding your specific needs. Budget ranges: Under $5k (template customization), $5k-$10k (basic solutions), $10k-$20k (intermediate solutions), $20k-$50k (advanced solutions), $50k+ (enterprise solutions).',
  true,
  '{"category": "faq", "topic": "pricing", "priority": "high"}'::jsonb;

-- FAQ - Timeline
INSERT INTO ai_training_data (agent_id, training_type, content, is_active, metadata)
SELECT 
  (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1),
  'faq',
  'Q: How long does development take? A: Timeline depends on project scope. Template customization: 1-3 weeks. Basic AI agents: 2-4 weeks. Custom web applications: 4-12 weeks. Enterprise solutions: 3-6 months. We provide detailed timelines after initial consultation. Rush options available for urgent needs.',
  true,
  '{"category": "faq", "topic": "timeline", "priority": "high"}'::jsonb;

-- FAQ - Technical
INSERT INTO ai_training_data (agent_id, training_type, content, is_active, metadata)
SELECT 
  (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1),
  'faq',
  'Q: What technologies do you use? A: We use modern, scalable technologies: Frontend - React, TypeScript, Tailwind CSS. Backend - Supabase, Node.js, Edge Functions. AI - OpenAI GPT-5, Claude, Custom models. Deployment - Cloud-based with 99.9% uptime. All solutions include mobile-responsive design, security best practices, and scalability.',
  true,
  '{"category": "faq", "topic": "technical", "priority": "medium"}'::jsonb;

-- FAQ - Process
INSERT INTO ai_training_data (agent_id, training_type, content, is_active, metadata)
SELECT 
  (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1),
  'faq',
  'Q: What is your development process? A: 1) Discovery Call - Understand your needs (30-60 min, free). 2) Proposal & Quote - Detailed scope and pricing (1-2 days). 3) Design Phase - UI/UX mockups for approval (1-2 weeks). 4) Development - Agile sprints with weekly updates (varies). 5) Testing & QA - Thorough testing and refinement (1 week). 6) Launch & Support - Deployment and ongoing support.',
  true,
  '{"category": "faq", "topic": "process", "priority": "high"}'::jsonb;

-- FAQ - Support
INSERT INTO ai_training_data (agent_id, training_type, content, is_active, metadata)
SELECT 
  (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1),
  'faq',
  'Q: Do you provide ongoing support? A: Yes! We offer multiple support tiers: Basic (email support, bug fixes), Standard (priority support, monthly updates), Premium (24/7 support, dedicated account manager, proactive monitoring). All projects include 30 days of free support after launch. Support contracts available from $500/month.',
  true,
  '{"category": "faq", "topic": "support", "priority": "medium"}'::jsonb;

-- FAQ - Industries
INSERT INTO ai_training_data (agent_id, training_type, content, is_active, metadata)
SELECT 
  (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1),
  'faq',
  'Q: What industries do you serve? A: We serve diverse industries including Healthcare (patient portals, telemedicine, health tracking), Real Estate (property management, listing platforms), E-commerce (online stores, inventory management), SaaS (subscription platforms, dashboards), Finance (investment platforms, analytics), Education (learning management systems), and more. Each solution is customized for industry-specific needs.',
  true,
  '{"category": "faq", "topic": "industries", "priority": "medium"}'::jsonb;

-- Lead Qualification Knowledge
INSERT INTO ai_training_data (agent_id, training_type, content, is_active, metadata)
SELECT 
  (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1),
  'qualification',
  'LEAD QUALIFICATION PROCESS: Always collect: 1) Name and contact info (email, phone), 2) Company name and industry, 3) Project type (AI agent, custom build, template), 4) Budget range (use provided tiers), 5) Timeline expectations, 6) Key requirements or pain points. HIGH-PRIORITY LEADS: Budget $20k+, timeline immediate/1-2 weeks, existing business with clear pain point. MEDIUM-PRIORITY: Budget $10k-$20k, timeline 2-4 weeks, growing business. Qualify leads by understanding their specific needs and matching to our service offerings.',
  true,
  '{"category": "qualification", "priority": "critical"}'::jsonb;

-- Conversation Best Practices
INSERT INTO ai_training_data (agent_id, training_type, content, is_active, metadata)
SELECT 
  (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1),
  'guidelines',
  'CONVERSATION GUIDELINES: 1) Be friendly, professional, and consultative. 2) Ask clarifying questions to understand needs. 3) Match solutions to problems - suggest AI agents for automation needs, custom dev for unique requirements, templates for quick deployment. 4) Always collect contact information early in conversation. 5) Set clear next steps (schedule consultation, send proposal). 6) Be transparent about pricing and timelines. 7) If unsure, offer to connect with a specialist. 8) Emphasize ROI and business value, not just features.',
  true,
  '{"category": "guidelines", "priority": "critical"}'::jsonb;

-- Project Showcase Knowledge
INSERT INTO ai_training_data (agent_id, training_type, content, is_active, metadata)
SELECT 
  (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1),
  'knowledge',
  'FEATURED PROJECTS: We have successfully delivered solutions across multiple domains. AI Spain Homes - Real estate platform with AI-powered property search and virtual tours. Global Health Sync - Healthcare coordination platform connecting patients and providers globally. NurseSync - Staff scheduling and management system for healthcare facilities. TetherBand - IoT wearable technology platform. Conneqt Central - Business networking and collaboration platform. Each project demonstrates our expertise in different industries and technologies.',
  true,
  '{"category": "projects", "priority": "medium"}'::jsonb;

-- Update agent settings for sales optimization
UPDATE ai_agent_settings 
SET setting_value = '300'::jsonb
WHERE agent_id = (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1)
AND setting_key = 'max_response_length';

UPDATE ai_agent_settings 
SET setting_value = '"consultative"'::jsonb
WHERE agent_id = (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1)
AND setting_key = 'response_tone';

-- Add new settings for contact collection
INSERT INTO ai_agent_settings (agent_id, setting_key, setting_value, description)
SELECT 
  (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1),
  'collect_contact_info',
  'true'::jsonb,
  'Prioritize collecting contact information'
UNION ALL
SELECT 
  (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1),
  'qualification_enabled',
  'true'::jsonb,
  'Enable lead qualification'
UNION ALL
SELECT 
  (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1),
  'suggest_consultation',
  'true'::jsonb,
  'Suggest booking a consultation call';

-- Add industry-specific knowledge
INSERT INTO ai_training_data (agent_id, training_type, content, is_active, metadata)
SELECT 
  (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1),
  'knowledge',
  'HEALTHCARE SOLUTIONS: We specialize in HIPAA-compliant healthcare solutions including patient portals, telemedicine platforms, appointment scheduling systems, health record management, and AI-powered symptom checkers. Experience with nurse scheduling (NurseSync), global health coordination (Global Health Sync), and patient engagement platforms. Pricing typically $15k-$50k+ depending on compliance requirements and integrations needed.',
  true,
  '{"category": "industry_specific", "industry": "healthcare", "priority": "high"}'::jsonb;

INSERT INTO ai_training_data (agent_id, training_type, content, is_active, metadata)
SELECT 
  (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1),
  'knowledge',
  'REAL ESTATE SOLUTIONS: Expertise in property listing platforms, virtual tour integration, lead management systems, and AI-powered property matching. Successful delivery of AI Spain Homes platform featuring advanced search, property analytics, and client relationship management. Ideal for real estate agencies, property developers, and vacation rental businesses. Pricing $10k-$30k based on features.',
  true,
  '{"category": "industry_specific", "industry": "real_estate", "priority": "high"}'::jsonb;

-- Add response templates for common scenarios
INSERT INTO ai_training_data (agent_id, training_type, content, is_active, metadata)
SELECT 
  (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1),
  'template',
  'SCENARIO: Initial greeting. RESPONSE: Welcome to Vision-Sync Forge! I''m here to help you explore how AI and custom development can transform your business. Whether you need an AI agent to automate tasks, a custom web application, or want to explore our ready-to-deploy templates, I can guide you. What brings you here today?',
  true,
  '{"category": "response_template", "scenario": "greeting", "priority": "high"}'::jsonb;

INSERT INTO ai_training_data (agent_id, training_type, content, is_active, metadata)
SELECT 
  (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1),
  'template',
  'SCENARIO: Pricing inquiry without details. RESPONSE: I''d be happy to discuss pricing! To provide an accurate estimate, I need to understand your needs better. Could you share: 1) What type of solution are you interested in? (AI agent, custom development, or template customization), 2) What problem are you trying to solve?, 3) What''s your target timeline? This will help me provide relevant pricing information.',
  true,
  '{"category": "response_template", "scenario": "pricing_inquiry", "priority": "high"}'::jsonb;

INSERT INTO ai_training_data (agent_id, training_type, content, is_active, metadata)
SELECT 
  (SELECT id FROM ai_agents WHERE name = 'Vision-Sync Support Assistant' LIMIT 1),
  'template',
  'SCENARIO: Ready to move forward. RESPONSE: Excellent! I''m excited to help bring your vision to life. Here''s what happens next: 1) I''ll create a lead with your information for our team, 2) A specialist will reach out within 24 hours to schedule a discovery call, 3) We''ll provide a detailed proposal and quote within 48 hours after our call. Could you provide your email and phone number so we can get started?',
  true,
  '{"category": "response_template", "scenario": "move_forward", "priority": "high"}'::jsonb;