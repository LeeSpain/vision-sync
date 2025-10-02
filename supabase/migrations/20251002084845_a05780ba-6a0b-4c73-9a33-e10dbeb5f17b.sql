-- Phase 1: Database Cleanup - Remove duplicate and incomplete templates
-- This will clean up the database to have exactly 10 unique, complete templates

-- First, let's identify and delete duplicates (keeping the newest version with images)
-- We'll use a CTE to find the best version of each template by title

WITH ranked_templates AS (
  SELECT 
    id,
    title,
    image_url,
    created_at,
    ROW_NUMBER() OVER (
      PARTITION BY title 
      ORDER BY 
        CASE WHEN image_url IS NOT NULL AND image_url != '' AND image_url NOT LIKE '%placeholder%' THEN 0 ELSE 1 END,
        created_at DESC
    ) as rn
  FROM app_templates
)
DELETE FROM app_templates
WHERE id IN (
  SELECT id 
  FROM ranked_templates 
  WHERE rn > 1
);

-- Delete old placeholder templates that don't fit the new structure
DELETE FROM app_templates 
WHERE title IN ('Real Estate Platform', 'Healthcare Portal', 'E-commerce Store')
  AND (image_url LIKE '%placeholder%' OR image_url IS NULL OR image_url = '');

-- Ensure we have proper pricing structure for all remaining templates
UPDATE app_templates
SET pricing = jsonb_build_object(
  'base', COALESCE((pricing->>'base')::numeric, (pricing->>'oneTime')::numeric, 2500),
  'customization', COALESCE((pricing->>'customization')::numeric, (pricing->>'setup')::numeric, 500),
  'subscription', jsonb_build_object(
    'monthly', COALESCE((pricing->'subscription'->>'monthly')::numeric, (pricing->>'monthly')::numeric, 199),
    'benefits', COALESCE(pricing->'subscription'->'benefits', '["Monthly updates", "Priority support", "Feature requests", "Backup & maintenance"]'::jsonb)
  ),
  'deposit', jsonb_build_object(
    'amount', COALESCE((pricing->'deposit'->>'amount')::numeric, 750),
    'serviceMonthly', COALESCE((pricing->'deposit'->>'serviceMonthly')::numeric, 149),
    'description', 'Pay deposit + monthly service fee for ongoing management'
  ),
  'installments', jsonb_build_object(
    'available', true,
    'plans', jsonb_build_array(
      jsonb_build_object(
        'months', 6,
        'monthlyAmount', FLOOR((COALESCE((pricing->>'base')::numeric, 2500) / 6) * 1.08),
        'totalAmount', FLOOR(COALESCE((pricing->>'base')::numeric, 2500) * 1.08)
      ),
      jsonb_build_object(
        'months', 12,
        'monthlyAmount', FLOOR((COALESCE((pricing->>'base')::numeric, 2500) / 12) * 1.15),
        'totalAmount', FLOOR(COALESCE((pricing->>'base')::numeric, 2500) * 1.15)
      )
    )
  ),
  'ownership', jsonb_build_object(
    'buyOutright', COALESCE((pricing->>'base')::numeric, 2500),
    'serviceContract', jsonb_build_object(
      'deposit', COALESCE((pricing->'deposit'->>'amount')::numeric, 750),
      'monthly', COALESCE((pricing->'deposit'->>'serviceMonthly')::numeric, 149),
      'benefits', '["App hosting", "Updates & maintenance", "Technical support", "Feature additions"]'::jsonb
    )
  )
)
WHERE pricing IS NOT NULL;