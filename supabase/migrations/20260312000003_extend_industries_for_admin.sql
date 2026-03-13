-- Extend industries table for IndustryManager admin CRUD
-- Adds slug, display, metrics, and package columns

ALTER TABLE public.industries
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '🏢',
  ADD COLUMN IF NOT EXISTS color TEXT DEFAULT 'indigo',
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS region TEXT DEFAULT 'Global',
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS client_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS avg_mrr NUMERIC(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS conversion_rate NUMERIC(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS use_cases JSONB DEFAULT '[]'::JSONB,
  ADD COLUMN IF NOT EXISTS seo_keywords JSONB DEFAULT '[]'::JSONB,
  ADD COLUMN IF NOT EXISTS base_package JSONB DEFAULT '{}'::JSONB;

-- Backfill slug from name for existing rows
UPDATE public.industries
SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;

-- Add unique constraint on slug after backfill
CREATE UNIQUE INDEX IF NOT EXISTS industries_slug_unique ON public.industries (slug);
