-- Add subscription fields to projects table
ALTER TABLE public.projects 
ADD COLUMN subscription_price NUMERIC,
ADD COLUMN subscription_period TEXT DEFAULT 'monthly',
ADD COLUMN billing_type TEXT DEFAULT 'one-time' CHECK (billing_type IN ('one-time', 'subscription', 'investment'));