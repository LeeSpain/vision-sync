-- Fix remaining categories that didn't get updated properly
UPDATE app_templates 
SET category = CASE 
  WHEN category = 'Business Management' AND industry = 'Home Services' THEN 'Home Services'
  WHEN category = 'Business Management' AND industry = 'Fitness & Wellness' THEN 'Fitness & Wellness'  
  WHEN category = 'Business Management' AND industry = 'Real Estate' THEN 'Real Estate'
  WHEN category = 'Business Management' AND industry = 'Healthcare' THEN 'Healthcare'
  WHEN category = 'Business Management' AND industry = 'Restaurant & Food Service' THEN 'Restaurant & Food Service'
  WHEN category = 'Business Management' AND industry = 'Retail & E-commerce' THEN 'Retail & E-commerce'
  ELSE category
END
WHERE category = 'Business Management';

-- Ensure all templates have the correct industry field that matches their category
UPDATE app_templates 
SET industry = category 
WHERE industry != category OR industry IS NULL;