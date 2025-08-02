-- Create app_templates table to store template configurations
CREATE TABLE public.app_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  detailed_description TEXT,
  key_features JSONB DEFAULT '[]'::jsonb,
  industry TEXT,
  pricing JSONB DEFAULT '{}'::jsonb,
  image_url TEXT,
  gallery_images TEXT[],
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  questionnaire_weight JSONB DEFAULT '{}'::jsonb,
  ai_generated_content JSONB DEFAULT '{}'::jsonb,
  template_config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.app_templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Templates are viewable by everyone" 
ON public.app_templates 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admin can manage all templates" 
ON public.app_templates 
FOR ALL 
USING (true);

-- Create function to update timestamps
CREATE TRIGGER update_app_templates_updated_at
BEFORE UPDATE ON public.app_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create template_questionnaire_responses table to track user responses
CREATE TABLE public.template_questionnaire_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  responses JSONB NOT NULL DEFAULT '{}'::jsonb,
  recommended_templates JSONB DEFAULT '[]'::jsonb,
  selected_template_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for questionnaire responses
ALTER TABLE public.template_questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- Create policies for questionnaire responses
CREATE POLICY "Anyone can create questionnaire responses" 
ON public.template_questionnaire_responses 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admin can view all questionnaire responses" 
ON public.template_questionnaire_responses 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage all questionnaire responses" 
ON public.template_questionnaire_responses 
FOR ALL 
USING (true);

-- Add trigger for questionnaire responses
CREATE TRIGGER update_template_questionnaire_responses_updated_at
BEFORE UPDATE ON public.template_questionnaire_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();