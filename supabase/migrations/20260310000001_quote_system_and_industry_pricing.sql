-- Quote System and Industry Pricing Migration
-- Adds pricing columns to modules and solutions, creates quotes table

-- 1a. Alter existing modules table
ALTER TABLE public.modules
  ADD COLUMN IF NOT EXISTS internal_cost NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS ex_vat_price NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS iva_amount NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS total_inc_vat NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS is_voice_module BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS voice_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS industry_slugs JSONB DEFAULT '[]'::JSONB;

-- 1b. Alter existing solutions table
ALTER TABLE public.solutions
  ADD COLUMN IF NOT EXISTS industry_slug TEXT,
  ADD COLUMN IF NOT EXISTS internal_cost NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS ex_vat_price NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS iva_amount NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS total_inc_vat NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS voice_included BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS voice_minutes_included INTEGER,
  ADD COLUMN IF NOT EXISTS pain_statement TEXT,
  ADD COLUMN IF NOT EXISTS base_includes JSONB DEFAULT '[]'::JSONB,
  ADD COLUMN IF NOT EXISTS icon_name TEXT;

-- 1c. Create quotes table
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_reference TEXT NOT NULL UNIQUE,
  client_first_name TEXT NOT NULL,
  client_last_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  industry_slug TEXT NOT NULL,
  industry_name TEXT NOT NULL,
  base_package_name TEXT NOT NULL,
  base_ex_vat NUMERIC(10,2) NOT NULL,
  base_iva NUMERIC(10,2) NOT NULL,
  base_inc_vat NUMERIC(10,2) NOT NULL,
  modules_selected JSONB DEFAULT '[]'::JSONB,
  modules_ex_vat_total NUMERIC(10,2) DEFAULT 0,
  modules_iva_total NUMERIC(10,2) DEFAULT 0,
  modules_inc_vat_total NUMERIC(10,2) DEFAULT 0,
  total_ex_vat NUMERIC(10,2) NOT NULL,
  total_iva NUMERIC(10,2) NOT NULL,
  total_inc_vat NUMERIC(10,2) NOT NULL,
  client_notes TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','viewed','contacted','accepted','declined')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  viewed_at TIMESTAMP WITH TIME ZONE,
  contacted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 1d. RLS on quotes
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a quote (public form submission)
CREATE POLICY "Anyone can create a quote"
ON public.quotes FOR INSERT
WITH CHECK (true);

-- Only admins can read all quotes
CREATE POLICY "Admins can read all quotes"
ON public.quotes FOR SELECT
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Only admins can update quotes
CREATE POLICY "Admins can update quotes"
ON public.quotes FOR UPDATE
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Public can read their own quote by reference (for quote portal)
CREATE POLICY "Public can read own quote by reference"
ON public.quotes FOR SELECT
USING (true);

-- 1e. Function to generate quote reference
CREATE OR REPLACE FUNCTION generate_quote_reference()
RETURNS TEXT AS $$
DECLARE
  ref TEXT;
BEGIN
  ref := 'VS-' || TO_CHAR(NOW(), 'YYYYMM') || '-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT, 1, 6));
  RETURN ref;
END;
$$ LANGUAGE plpgsql;

-- 1f. Trigger to auto-generate quote reference
CREATE OR REPLACE FUNCTION set_quote_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quote_reference IS NULL OR NEW.quote_reference = '' THEN
    NEW.quote_reference := generate_quote_reference();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_quote_reference
BEFORE INSERT ON public.quotes
FOR EACH ROW EXECUTE FUNCTION set_quote_reference();

-- 1g. Updated_at trigger for quotes
CREATE TRIGGER handle_updated_at_quotes
BEFORE UPDATE ON public.quotes
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
