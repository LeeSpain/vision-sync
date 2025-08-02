-- Add industry field to projects table
ALTER TABLE public.projects 
ADD COLUMN industry text;

-- Update existing projects with default industry based on category
UPDATE public.projects 
SET industry = CASE 
  WHEN category = 'Investment' THEN 'Healthcare'
  WHEN category = 'For Sale' AND name LIKE '%CustomBuilds%' THEN 'Retail'
  WHEN category = 'For Sale' AND name LIKE '%ForSale%' THEN 'E-commerce'
  WHEN category = 'For Sale' AND name LIKE '%ICE%' THEN 'Emergency Services'
  ELSE 'Technology'
END
WHERE industry IS NULL;