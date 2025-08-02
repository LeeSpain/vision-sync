-- Update all templates to match the required industries from the image
-- Standardize categories and ensure proper data structure

-- Update categories to match the image requirements
UPDATE app_templates 
SET category = 'Hairdressing & Beauty', industry = 'Hairdressing & Beauty'
WHERE title ILIKE '%hair%' OR title ILIKE '%beauty%' OR title ILIKE '%salon%';

UPDATE app_templates 
SET category = 'Restaurant & Food Service', industry = 'Restaurant & Food Service'
WHERE title ILIKE '%restaurant%' OR title ILIKE '%food%' OR title ILIKE '%cafe%' OR title ILIKE '%dining%';

UPDATE app_templates 
SET category = 'Fitness & Wellness', industry = 'Fitness & Wellness'
WHERE title ILIKE '%fitness%' OR title ILIKE '%gym%' OR title ILIKE '%wellness%' OR title ILIKE '%health%';

UPDATE app_templates 
SET category = 'Home Services', industry = 'Home Services'
WHERE title ILIKE '%home%' OR title ILIKE '%cleaning%' OR title ILIKE '%maintenance%' OR title ILIKE '%repair%';

UPDATE app_templates 
SET category = 'Retail & E-commerce', industry = 'Retail & E-commerce'
WHERE title ILIKE '%shop%' OR title ILIKE '%retail%' OR title ILIKE '%store%' OR title ILIKE '%ecommerce%' OR title ILIKE '%e-commerce%';

UPDATE app_templates 
SET category = 'Healthcare', industry = 'Healthcare'
WHERE title ILIKE '%medical%' OR title ILIKE '%clinic%' OR title ILIKE '%doctor%' OR title ILIKE '%healthcare%';

UPDATE app_templates 
SET category = 'Real Estate', industry = 'Real Estate'
WHERE title ILIKE '%real estate%' OR title ILIKE '%property%' OR title ILIKE '%realtor%';

-- Ensure all templates have proper pricing structure
UPDATE app_templates 
SET pricing = COALESCE(pricing, '{}')::jsonb || jsonb_build_object(
  'base', COALESCE((pricing->>'base')::numeric, sale_price, 2999),
  'customization', COALESCE((pricing->>'customization')::numeric, customization_price, 999),
  'subscription', jsonb_build_object(
    'monthly', COALESCE((pricing->'subscription'->>'monthly')::numeric, 299),
    'benefits', COALESCE(pricing->'subscription'->'benefits', '["Regular updates", "Premium support", "Monthly consultations"]'::jsonb)
  )
)
WHERE pricing IS NULL OR pricing = '{}'::jsonb;

-- Ensure all templates have foundation features
UPDATE app_templates 
SET foundation_features = COALESCE(foundation_features, '[]')::jsonb || jsonb_build_array(
  'Responsive Design',
  'SEO Optimization', 
  'Mobile-First Approach',
  'Fast Loading Speed',
  'Cross-Browser Compatibility',
  'Analytics Integration'
)
WHERE foundation_features IS NULL OR jsonb_array_length(foundation_features) = 0;

-- Set specific core industry features for each category
UPDATE app_templates 
SET core_industry_features = jsonb_build_array(
  'Online Booking System',
  'Client Management',
  'Service Catalog',
  'Payment Processing'
)
WHERE category = 'Hairdressing & Beauty';

UPDATE app_templates 
SET core_industry_features = jsonb_build_array(
  'Menu Management',
  'Order System',
  'Reservation Booking',
  'Delivery Integration'
)
WHERE category = 'Restaurant & Food Service';

UPDATE app_templates 
SET core_industry_features = jsonb_build_array(
  'Class Scheduling',
  'Membership Management',
  'Workout Tracking',
  'Trainer Profiles'
)
WHERE category = 'Fitness & Wellness';

UPDATE app_templates 
SET core_industry_features = jsonb_build_array(
  'Service Booking',
  'Quote Calculator',
  'Before/After Gallery',
  'Service Area Map'
)
WHERE category = 'Home Services';

UPDATE app_templates 
SET core_industry_features = jsonb_build_array(
  'Product Catalog',
  'Shopping Cart',
  'Inventory Management',
  'Customer Reviews'
)
WHERE category = 'Retail & E-commerce';

UPDATE app_templates 
SET core_industry_features = jsonb_build_array(
  'Appointment Scheduling',
  'Patient Records',
  'Insurance Integration',
  'Telemedicine Support'
)
WHERE category = 'Healthcare';

UPDATE app_templates 
SET core_industry_features = jsonb_build_array(
  'Property Listings',
  'Virtual Tours',
  'Market Analysis',
  'Lead Management'
)
WHERE category = 'Real Estate';