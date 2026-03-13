-- Seed initial product data into plans, modules, and demo_templates
-- This replaces the hardcoded makeSeed* functions in the UI components

-- 1. Seed Plans
INSERT INTO public.plans (name, slug, monthly_price, yearly_price, description, features, billing_cycle, currency, color, badge, max_agents, max_conversations, max_contacts, is_popular, is_active, sort_order)
VALUES
(
  'Starter', 'starter', 49, 490,
  'Perfect for small businesses getting started with AI automation',
  '[{"id":"s1","text":"2 AI Agents"},{"id":"s2","text":"500 conversations/mo"},{"id":"s3","text":"1,000 contacts"},{"id":"s4","text":"Email support"},{"id":"s5","text":"Basic analytics"}]'::JSONB,
  'monthly', 'EUR', 'emerald', 'Entry', 2, 500, 1000, false, true, 1
),
(
  'Growth', 'growth', 149, 1490,
  'For growing businesses that need more power and flexibility',
  '[{"id":"g1","text":"10 AI Agents"},{"id":"g2","text":"5,000 conversations/mo"},{"id":"g3","text":"25,000 contacts"},{"id":"g4","text":"Priority support"},{"id":"g5","text":"Advanced analytics"},{"id":"g6","text":"Custom branding"},{"id":"g7","text":"API access"}]'::JSONB,
  'monthly', 'EUR', 'blue', 'Popular', 10, 5000, 25000, true, true, 2
),
(
  'Enterprise', 'enterprise', 499, 4990,
  'Full-scale AI infrastructure for large organisations',
  '[{"id":"e1","text":"Unlimited AI Agents"},{"id":"e2","text":"50,000 conversations/mo"},{"id":"e3","text":"500,000 contacts"},{"id":"e4","text":"Dedicated account manager"},{"id":"e5","text":"Custom integrations"},{"id":"e6","text":"SLA guarantee"},{"id":"e7","text":"White-label option"},{"id":"e8","text":"Advanced security"},{"id":"e9","text":"On-premise option"}]'::JSONB,
  'monthly', 'EUR', 'violet', 'Premium', 100, 50000, 500000, false, true, 3
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Seed Modules
INSERT INTO public.modules (name, slug, short_description, monthly_addon_price, category, status, pricing_model, color, icon, tags, compatible_plans, install_count, rating, is_active, sort_order)
VALUES
(
  'Email Follow-Up Agent', 'email-follow-up-agent',
  'Automated email sequences triggered by AI conversations',
  199, 'communication', 'active', 'addon', 'blue', '📧',
  '["email","automation","follow-up"]'::JSONB,
  '["Starter","Growth","Enterprise"]'::JSONB,
  0, 0, true, 1
),
(
  'Voice Assistant', 'voice-assistant',
  'Natural language voice interactions for phone and web',
  349, 'communication', 'active', 'addon', 'violet', '🎙️',
  '["voice","phone","ivr"]'::JSONB,
  '["Growth","Enterprise"]'::JSONB,
  0, 0, true, 2
),
(
  'Data Intelligence Hub', 'data-intelligence-hub',
  'Centralised analytics and business intelligence dashboard',
  0, 'analytics', 'active', 'included', 'emerald', '📊',
  '["analytics","data","reporting"]'::JSONB,
  '["Starter","Growth","Enterprise"]'::JSONB,
  0, 0, true, 3
),
(
  'CRM Sync', 'crm-sync',
  'Two-way sync with popular CRM platforms',
  149, 'integrations', 'active', 'addon', 'amber', '🔄',
  '["crm","sync","integrations"]'::JSONB,
  '["Growth","Enterprise"]'::JSONB,
  0, 0, true, 4
),
(
  'Appointment Booking', 'appointment-booking',
  'AI-powered scheduling and calendar management',
  199, 'sales', 'active', 'addon', 'cyan', '📅',
  '["booking","calendar","scheduling"]'::JSONB,
  '["Starter","Growth","Enterprise"]'::JSONB,
  0, 0, true, 5
),
(
  'Lead Qualifier', 'lead-qualifier',
  'Intelligent lead scoring and qualification engine',
  249, 'sales', 'active', 'addon', 'rose', '🎯',
  '["leads","scoring","qualification"]'::JSONB,
  '["Growth","Enterprise"]'::JSONB,
  0, 0, true, 6
),
(
  'Review Manager', 'review-manager',
  'Monitor and respond to online reviews automatically',
  129, 'support', 'active', 'addon', 'orange', '⭐',
  '["reviews","reputation","monitoring"]'::JSONB,
  '["Starter","Growth","Enterprise"]'::JSONB,
  0, 0, true, 7
),
(
  'Social Media Responder', 'social-media-responder',
  'AI-driven social media engagement and response management',
  179, 'communication', 'active', 'addon', 'pink', '💬',
  '["social","media","engagement"]'::JSONB,
  '["Growth","Enterprise"]'::JSONB,
  0, 0, true, 8
),
(
  'WhatsApp Agent', 'whatsapp-agent',
  'Full WhatsApp Business integration with AI responses',
  299, 'communication', 'active', 'addon', 'green', '📱',
  '["whatsapp","messaging","chat"]'::JSONB,
  '["Growth","Enterprise"]'::JSONB,
  0, 0, true, 9
),
(
  'AI Chatbot Widget', 'ai-chatbot-widget',
  'Embeddable AI chatbot for any website',
  0, 'support', 'active', 'included', 'indigo', '🤖',
  '["chatbot","widget","website"]'::JSONB,
  '["Starter","Growth","Enterprise"]'::JSONB,
  0, 0, true, 10
)
ON CONFLICT (slug) DO NOTHING;

-- 3. Seed Demo Templates
INSERT INTO public.demo_templates (name, category, thumbnail_class, description, is_active, sort_order)
VALUES
('Modern Real Estate', 'Real Estate', 'bg-gradient-to-br from-blue-500 to-indigo-600', 'Professional real estate landing page with property search and virtual tours', true, 1),
('Local Service Pro', 'Services', 'bg-gradient-to-br from-emerald-500 to-teal-600', 'Service-based business template with booking and reviews', true, 2),
('Healthcare Clinic', 'Healthcare', 'bg-gradient-to-br from-cyan-500 to-blue-600', 'Medical practice template with appointment booking and patient portal', true, 3),
('Restaurant Delivery', 'Hospitality', 'bg-gradient-to-br from-orange-500 to-red-600', 'Restaurant template with online ordering and delivery tracking', true, 4)
ON CONFLICT DO NOTHING;
