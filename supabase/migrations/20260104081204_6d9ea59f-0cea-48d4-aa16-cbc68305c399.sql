-- Add profile details columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS avatar_url text;

-- Create site_settings table for global configurations
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS on site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for site_settings - only admins can read/write
CREATE POLICY "Allow authenticated users to read site settings"
ON public.site_settings
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert site settings"
ON public.site_settings
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update site settings"
ON public.site_settings
FOR UPDATE
TO authenticated
USING (true);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_site_settings_updated_at();

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value)
VALUES 
  ('site_title', '"Vision-Sync"'),
  ('site_tagline', '"Build. Showcase. Sell. Invest. Sync your vision with the future."'),
  ('contact_email', '"contact@vision-sync.com"')
ON CONFLICT (setting_key) DO NOTHING;