-- Add avatar_url column to ai_agents table
ALTER TABLE public.ai_agents 
ADD COLUMN avatar_url text;