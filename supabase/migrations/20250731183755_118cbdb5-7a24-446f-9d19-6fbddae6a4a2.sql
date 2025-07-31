-- Add rich content fields to projects table for CMS functionality
ALTER TABLE public.projects 
ADD COLUMN content jsonb DEFAULT '{}'::jsonb,
ADD COLUMN hero_image_url TEXT,
ADD COLUMN gallery_images TEXT[],
ADD COLUMN key_features jsonb DEFAULT '[]'::jsonb,
ADD COLUMN stats jsonb DEFAULT '[]'::jsonb,
ADD COLUMN use_cases jsonb DEFAULT '[]'::jsonb,
ADD COLUMN purchase_info jsonb DEFAULT '{}'::jsonb;

-- Add comments to explain the new fields
COMMENT ON COLUMN public.projects.content IS 'Rich content including overview, detailed description, highlights, etc.';
COMMENT ON COLUMN public.projects.hero_image_url IS 'Main hero image for the project page';
COMMENT ON COLUMN public.projects.gallery_images IS 'Array of additional images for the project';
COMMENT ON COLUMN public.projects.key_features IS 'Array of key features with icons, titles, and descriptions';
COMMENT ON COLUMN public.projects.stats IS 'Array of statistics/metrics to showcase';
COMMENT ON COLUMN public.projects.use_cases IS 'Array of use cases with descriptions';
COMMENT ON COLUMN public.projects.purchase_info IS 'Purchase/investment information including pricing, timelines, etc.';