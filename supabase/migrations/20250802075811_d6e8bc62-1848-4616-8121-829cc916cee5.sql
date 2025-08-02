-- Add featured column to projects table
ALTER TABLE public.projects 
ADD COLUMN featured boolean NOT NULL DEFAULT false;

-- Create index for better performance when querying featured projects
CREATE INDEX idx_projects_featured ON public.projects(featured) WHERE featured = true;