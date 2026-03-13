-- Create demo_templates table

CREATE TABLE IF NOT EXISTS public.demo_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  thumbnail_class TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.demo_templates ENABLE ROW LEVEL SECURITY;

-- Public can read active templates
CREATE POLICY "Enable public read access for active demo_templates"
ON public.demo_templates FOR SELECT
USING (is_active = true);

-- Admin can read all templates
CREATE POLICY "Enable admin read access for all demo_templates"
ON public.demo_templates FOR SELECT
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Admin full CRUD
CREATE POLICY "Enable admin write access for demo_templates"
ON public.demo_templates FOR ALL
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Updated_at trigger
CREATE TRIGGER handle_updated_at_demo_templates
BEFORE UPDATE ON public.demo_templates
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
