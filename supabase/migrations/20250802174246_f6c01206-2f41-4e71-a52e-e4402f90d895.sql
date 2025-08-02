-- Add investment_received field to projects table to track actual funds raised
ALTER TABLE public.projects 
ADD COLUMN investment_received NUMERIC DEFAULT 0;