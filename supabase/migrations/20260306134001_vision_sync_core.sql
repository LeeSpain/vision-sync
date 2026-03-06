-- Migration: Vision-sync core tables
-- Creates the newly required tables for Plans, Modules, Solutions, Page Sections, and Site Settings
-- Safe: Uses IF NOT EXISTS and does not drop any existing tables.

-- 1. plans
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    monthly_price DECIMAL(10,2),
    yearly_price DECIMAL(10,2),
    setup_fee DECIMAL(10,2),
    custom_price_label TEXT,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    cta_label TEXT,
    cta_link TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS and add basic policies for plans
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users on plans" ON public.plans FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated admins on plans" ON public.plans FOR ALL USING (auth.role() = 'authenticated');

-- 2. modules
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT,
    long_description TEXT,
    monthly_addon_price DECIMAL(10,2),
    setup_fee DECIMAL(10,2),
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS and add basic policies for modules
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users on modules" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated admins on modules" ON public.modules FOR ALL USING (auth.role() = 'authenticated');

-- 3. solutions
CREATE TABLE IF NOT EXISTS public.solutions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT,
    description TEXT,
    industries JSONB DEFAULT '[]'::jsonb,
    included_modules JSONB DEFAULT '[]'::jsonb,
    cta_label TEXT,
    cta_link TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS and add basic policies for solutions
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users on solutions" ON public.solutions FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated admins on solutions" ON public.solutions FOR ALL USING (auth.role() = 'authenticated');

-- 4. page_sections
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(page_key, section_key)
);

-- Enable RLS and add basic policies for page_sections
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users on page_sections" ON public.page_sections FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated admins on page_sections" ON public.page_sections FOR ALL USING (auth.role() = 'authenticated');

-- 5. site_settings
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name TEXT DEFAULT 'Vision-Sync' NOT NULL,
    site_title TEXT DEFAULT 'Vision-Sync | AI Automation Platform',
    meta_title TEXT DEFAULT 'Vision-Sync | AI Automation Platform for Businesses',
    meta_description TEXT DEFAULT 'Vision-Sync provides modular AI systems, automation infrastructure, business workflows, and CRM solutions.',
    contact_email TEXT,
    phone TEXT,
    address TEXT,
    footer_text TEXT,
    primary_cta_label TEXT DEFAULT 'Request a Demo',
    primary_cta_link TEXT DEFAULT '/contact',
    secondary_cta_label TEXT DEFAULT 'Explore Platform',
    secondary_cta_link TEXT DEFAULT '/platform',
    social_links JSONB DEFAULT '{"twitter": "", "linkedin": "", "github": ""}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS and add basic policies for site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users on site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated admins on site_settings" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Insert one default row into site_settings so it exists
INSERT INTO public.site_settings (company_name)
SELECT 'Vision-Sync'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);
