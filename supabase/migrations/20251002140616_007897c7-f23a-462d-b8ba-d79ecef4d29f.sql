-- Add investment percentage field to projects table
ALTER TABLE public.projects 
ADD COLUMN investment_percentage numeric CHECK (investment_percentage >= 0 AND investment_percentage <= 100);