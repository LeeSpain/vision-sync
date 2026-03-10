-- Create vision_family_apps table
CREATE TABLE IF NOT EXISTS public.vision_family_apps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    url TEXT,
    logo_url TEXT,
    logo_emoji TEXT DEFAULT '🔗'::text,
    accent_color TEXT DEFAULT '#06b6d4'::text,
    category TEXT DEFAULT 'App'::text,
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    powered_by TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vision_family_apps_updated_at
    BEFORE UPDATE ON public.vision_family_apps
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.vision_family_apps ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view published vision family apps"
    ON public.vision_family_apps
    FOR SELECT
    USING (is_published = true);

CREATE POLICY "Admins have full access to vision_family_apps"
    ON public.vision_family_apps
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );

-- Seed draft entry for LifeLink
INSERT INTO public.vision_family_apps (
    id,
    name,
    tagline,
    description,
    logo_emoji,
    accent_color,
    category,
    is_published,
    is_featured,
    display_order,
    powered_by
) VALUES (
    '88888888-8888-8888-8888-888888888888',
    'LifeLink',
    'AI-powered emergency response and coordination.',
    'LifeLink connects individuals, first responders, and medical professionals with real-time AI assistance during critical situations.',
    '💙',
    '#3b82f6',
    'Platform',
    false,
    true,
    1,
    ARRAY['Vision AI', 'Supabase', 'React']
) ON CONFLICT (id) DO NOTHING;
