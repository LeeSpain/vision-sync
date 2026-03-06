-- Vision-Sync Core Migration
-- Creates Plans, Modules, Solutions, Page Sections, and Site Settings tables

-- 1. Plans Table
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    monthly_price NUMERIC(10, 2),
    yearly_price NUMERIC(10, 2),
    setup_fee NUMERIC(10, 2),
    custom_price_label TEXT,
    description TEXT,
    features JSONB DEFAULT '[]'::JSONB,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Modules Table
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT,
    long_description TEXT,
    monthly_addon_price NUMERIC(10, 2),
    setup_fee NUMERIC(10, 2),
    features JSONB DEFAULT '[]'::JSONB,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Solutions Table
CREATE TABLE IF NOT EXISTS public.solutions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT,
    description TEXT,
    industries JSONB DEFAULT '[]'::JSONB,
    cta_label TEXT,
    cta_link TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Page Sections Table
CREATE TABLE IF NOT EXISTS public.page_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_key TEXT NOT NULL,
    section_key TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    content TEXT,
    cta_label TEXT,
    cta_link TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(page_key, section_key)
);

-- 5. Row Level Security Setup
-- Enable RLS for all newly created tables
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

-- 6. Public Read Policies
-- Allow anyone to read active plans
CREATE POLICY "Enable read access for all users on active plans" 
ON public.plans FOR SELECT 
USING (is_active = true);

-- Allow admins to read all plans (regardless of is_active)
CREATE POLICY "Enable admin read access for all plans" 
ON public.plans FOR SELECT 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Allow anyone to read active modules
CREATE POLICY "Enable read access for all users on active modules" 
ON public.modules FOR SELECT 
USING (is_active = true);

-- Allow admins to read all modules
CREATE POLICY "Enable admin read access for all modules" 
ON public.modules FOR SELECT 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Allow anyone to read active solutions
CREATE POLICY "Enable read access for all users on active solutions" 
ON public.solutions FOR SELECT 
USING (is_active = true);

-- Allow admins to read all solutions
CREATE POLICY "Enable admin read access for all solutions" 
ON public.solutions FOR SELECT 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Allow anyone to read active page_sections
CREATE POLICY "Enable read access for all users on active page sections" 
ON public.page_sections FOR SELECT 
USING (is_active = true);

-- Allow admins to read all page sections
CREATE POLICY "Enable admin read access for all page sections" 
ON public.page_sections FOR SELECT 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- 7. Admin Write Policies (Insert, Update, Delete)
-- Plans
CREATE POLICY "Enable admin write access for plans" 
ON public.plans FOR ALL 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Modules
CREATE POLICY "Enable admin write access for modules" 
ON public.modules FOR ALL 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Solutions
CREATE POLICY "Enable admin write access for solutions" 
ON public.solutions FOR ALL 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Page Sections
CREATE POLICY "Enable admin write access for page sections" 
ON public.page_sections FOR ALL 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER handle_updated_at_plans BEFORE UPDATE ON public.plans FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_updated_at_modules BEFORE UPDATE ON public.modules FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_updated_at_solutions BEFORE UPDATE ON public.solutions FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER handle_updated_at_page_sections BEFORE UPDATE ON public.page_sections FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
