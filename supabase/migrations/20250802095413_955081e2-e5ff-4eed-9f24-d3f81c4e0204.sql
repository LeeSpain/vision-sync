-- Add new pricing fields to support all payment methods
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC,
ADD COLUMN IF NOT EXISTS service_monthly NUMERIC,
ADD COLUMN IF NOT EXISTS installment_plans JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS ownership_options JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS payment_methods JSONB DEFAULT '["one-time"]'::jsonb;