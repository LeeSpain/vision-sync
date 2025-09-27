-- Migrate content_section from text to text array
-- First, create a backup of existing data and convert to array format
ALTER TABLE public.projects 
ADD COLUMN content_sections text[];

-- Copy existing content_section values to the new array column
UPDATE public.projects 
SET content_sections = ARRAY[content_section] 
WHERE content_section IS NOT NULL;

-- For projects without content_section, set empty array
UPDATE public.projects 
SET content_sections = ARRAY[]::text[] 
WHERE content_section IS NULL;

-- Drop the old column and rename the new one
ALTER TABLE public.projects DROP COLUMN content_section;
ALTER TABLE public.projects RENAME COLUMN content_sections TO content_section;