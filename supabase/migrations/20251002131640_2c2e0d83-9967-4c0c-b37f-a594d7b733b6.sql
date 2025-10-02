-- Add maintenance_fee column to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS maintenance_fee NUMERIC;