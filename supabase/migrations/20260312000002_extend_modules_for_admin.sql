-- Extend modules table for ModulesManager admin CRUD
-- Adds category, status, display, and metrics columns

ALTER TABLE public.modules
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'sales',
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS pricing_model TEXT DEFAULT 'addon',
  ADD COLUMN IF NOT EXISTS color TEXT DEFAULT 'indigo',
  ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '🤖',
  ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::JSONB,
  ADD COLUMN IF NOT EXISTS compatible_plans JSONB DEFAULT '[]'::JSONB,
  ADD COLUMN IF NOT EXISTS install_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0.0';
