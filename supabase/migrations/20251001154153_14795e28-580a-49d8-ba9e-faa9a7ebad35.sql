-- Create industries table
CREATE TABLE IF NOT EXISTS public.industries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users"
  ON public.industries
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert access for all users"
  ON public.industries
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update access for all users"
  ON public.industries
  FOR UPDATE
  USING (true);

CREATE POLICY "Enable delete access for all users"
  ON public.industries
  FOR DELETE
  USING (true);

-- Create updated_at trigger
CREATE TRIGGER update_industries_updated_at
  BEFORE UPDATE ON public.industries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with comprehensive industry list
INSERT INTO public.industries (name, description) VALUES
  ('Healthcare', 'Medical services, hospitals, clinics, telemedicine'),
  ('Real Estate', 'Property management, real estate agencies, rentals'),
  ('E-commerce', 'Online retail, marketplace platforms, dropshipping'),
  ('Finance', 'Banking, fintech, insurance, investment services'),
  ('Education', 'Schools, e-learning platforms, tutoring services'),
  ('Food & Beverage', 'Restaurants, food delivery, catering, bars'),
  ('Hospitality', 'Hotels, vacation rentals, travel agencies'),
  ('Professional Services', 'Consulting, legal, accounting, marketing agencies'),
  ('Technology', 'Software development, IT services, SaaS platforms'),
  ('Manufacturing', 'Production, supply chain, industrial services'),
  ('Retail', 'Physical stores, boutiques, wholesale'),
  ('Transportation', 'Logistics, delivery services, ride-sharing'),
  ('Entertainment', 'Events, streaming, gaming, media production'),
  ('Fitness & Wellness', 'Gyms, yoga studios, wellness centers, spas'),
  ('Beauty & Personal Care', 'Salons, barbershops, cosmetics'),
  ('Construction', 'Building, renovation, architecture, engineering'),
  ('Agriculture', 'Farming, livestock, agricultural tech'),
  ('Automotive', 'Car dealerships, repair shops, auto services'),
  ('Non-Profit', 'Charities, foundations, community organizations'),
  ('Government', 'Public services, municipal operations')
ON CONFLICT (name) DO NOTHING;

-- Migrate existing template industries to the new system
-- This ensures existing templates reference valid industries
DO $$
DECLARE
  template_record RECORD;
  industry_id uuid;
BEGIN
  FOR template_record IN 
    SELECT DISTINCT industry FROM public.app_templates WHERE industry IS NOT NULL
  LOOP
    -- Insert industry if it doesn't exist
    INSERT INTO public.industries (name, description)
    VALUES (template_record.industry, 'Migrated from existing templates')
    ON CONFLICT (name) DO NOTHING;
  END LOOP;
END $$;