-- Create core tables for the application

-- Leads table for contact form submissions
CREATE TABLE public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT,
  source TEXT DEFAULT 'website',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'archived')),
  form_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Projects table for project showcases
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  image_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  technologies TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- App templates for the template showcase
CREATE TABLE public.app_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  industry TEXT,
  image_url TEXT,
  demo_url TEXT,
  features TEXT[],
  pricing JSONB,
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  complexity_level TEXT DEFAULT 'medium' CHECK (complexity_level IN ('beginner', 'medium', 'advanced')),
  estimated_hours INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Template questionnaire responses
CREATE TABLE public.template_questionnaire_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_type TEXT,
  industry TEXT,
  budget_range TEXT,
  timeline TEXT,
  features_needed TEXT[],
  design_preferences JSONB,
  contact_info JSONB,
  recommended_templates UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI Agents table
CREATE TABLE public.ai_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  personality TEXT,
  voice_id TEXT,
  category TEXT,
  role TEXT,
  department TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI Agent Templates
CREATE TABLE public.ai_agent_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  role TEXT,
  description TEXT,
  personality TEXT,
  voice_id TEXT,
  default_settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI Agent Settings
CREATE TABLE public.ai_agent_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.ai_agents(id) ON DELETE CASCADE,
  setting_key TEXT NOT NULL,
  setting_value JSONB,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(agent_id, setting_key)
);

-- AI Training Data
CREATE TABLE public.ai_training_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.ai_agents(id) ON DELETE CASCADE,
  training_type TEXT NOT NULL,
  content TEXT,
  metadata JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- AI Conversations
CREATE TABLE public.ai_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.ai_agents(id) ON DELETE CASCADE,
  user_message TEXT NOT NULL,
  ai_response TEXT,
  context JSONB,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agent_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_training_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

-- Create public access policies (since no auth is implemented yet)
CREATE POLICY "Enable read access for all users" ON public.leads FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.leads FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.projects FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.app_templates FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.app_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.app_templates FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.template_questionnaire_responses FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.template_questionnaire_responses FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON public.ai_agents FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.ai_agents FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.ai_agents FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.ai_agent_templates FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.ai_agent_templates FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON public.ai_agent_settings FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.ai_agent_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.ai_agent_settings FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.ai_training_data FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.ai_training_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.ai_training_data FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON public.ai_conversations FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.ai_conversations FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_source ON public.leads(source);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);

CREATE INDEX idx_projects_category ON public.projects(category);
CREATE INDEX idx_projects_is_featured ON public.projects(is_featured);
CREATE INDEX idx_projects_is_public ON public.projects(is_public);

CREATE INDEX idx_app_templates_category ON public.app_templates(category);
CREATE INDEX idx_app_templates_industry ON public.app_templates(industry);
CREATE INDEX idx_app_templates_is_active ON public.app_templates(is_active);
CREATE INDEX idx_app_templates_is_popular ON public.app_templates(is_popular);

CREATE INDEX idx_ai_agents_category ON public.ai_agents(category);
CREATE INDEX idx_ai_agents_is_active ON public.ai_agents(is_active);

CREATE INDEX idx_ai_conversations_agent_id ON public.ai_conversations(agent_id);
CREATE INDEX idx_ai_conversations_session_id ON public.ai_conversations(session_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_app_templates_updated_at
  BEFORE UPDATE ON public.app_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_agents_updated_at
  BEFORE UPDATE ON public.ai_agents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();