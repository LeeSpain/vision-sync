-- Extend plans table for PlansManager admin CRUD
-- Adds billing, limits, and display columns

ALTER TABLE public.plans
  ADD COLUMN IF NOT EXISTS billing_cycle TEXT DEFAULT 'monthly',
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'EUR',
  ADD COLUMN IF NOT EXISTS color TEXT DEFAULT 'indigo',
  ADD COLUMN IF NOT EXISTS badge TEXT,
  ADD COLUMN IF NOT EXISTS max_agents INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS max_conversations INTEGER DEFAULT 100,
  ADD COLUMN IF NOT EXISTS max_contacts INTEGER DEFAULT 500,
  ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT false;
