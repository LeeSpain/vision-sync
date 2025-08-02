-- Update app_templates table to support new pricing structure
-- Add new columns for the simplified pricing model
ALTER TABLE public.app_templates 
ADD COLUMN IF NOT EXISTS sale_price NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS customization_price NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS premium_features JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS foundation_features JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS core_industry_features JSONB DEFAULT '[]'::jsonb;

-- Update existing templates with foundation and core features based on industry
UPDATE public.app_templates 
SET 
  foundation_features = CASE 
    WHEN industry = 'Hairdressing & Beauty' THEN 
      '["User Authentication", "Dashboard", "Contact Management", "Basic Reporting", "Mobile Responsive Design", "Data Backup"]'::jsonb
    WHEN industry = 'Restaurant & Food Service' THEN 
      '["User Authentication", "Dashboard", "Order Management", "Basic Reporting", "Mobile Responsive Design", "Data Backup"]'::jsonb
    WHEN industry = 'Fitness & Wellness' THEN 
      '["User Authentication", "Dashboard", "Member Management", "Basic Reporting", "Mobile Responsive Design", "Data Backup"]'::jsonb
    WHEN industry = 'Home Services' THEN 
      '["User Authentication", "Dashboard", "Client Management", "Basic Reporting", "Mobile Responsive Design", "Data Backup"]'::jsonb
    WHEN industry = 'Retail & E-commerce' THEN 
      '["User Authentication", "Dashboard", "Product Management", "Basic Reporting", "Mobile Responsive Design", "Data Backup"]'::jsonb
    WHEN industry = 'Healthcare' THEN 
      '["User Authentication", "Dashboard", "Patient Management", "Basic Reporting", "Mobile Responsive Design", "Data Backup"]'::jsonb
    WHEN industry = 'Real Estate' THEN 
      '["User Authentication", "Dashboard", "Property Management", "Basic Reporting", "Mobile Responsive Design", "Data Backup"]'::jsonb
    ELSE '["User Authentication", "Dashboard", "Basic Reporting", "Mobile Responsive Design", "Data Backup"]'::jsonb
  END,
  core_industry_features = CASE 
    WHEN industry = 'Hairdressing & Beauty' THEN 
      '["Online Booking System", "Service Menu Management", "Client Gallery & Portfolio", "Loyalty Program & Rewards"]'::jsonb
    WHEN industry = 'Restaurant & Food Service' THEN 
      '["Digital Menu Management", "Online Ordering System", "Table Reservation System", "Delivery Tracking"]'::jsonb
    WHEN industry = 'Fitness & Wellness' THEN 
      '["Class Scheduling System", "Membership Management", "Workout Plans & Tracking", "Trainer Assignment"]'::jsonb
    WHEN industry = 'Home Services' THEN 
      '["Quote Builder & Estimator", "Job Tracking & Progress", "Before/After Photo Gallery", "Scheduling & Calendar"]'::jsonb
    WHEN industry = 'Retail & E-commerce' THEN 
      '["Product Catalog & Inventory", "Shopping Cart & Checkout", "Customer Account Portal", "Order Processing System"]'::jsonb
    WHEN industry = 'Healthcare' THEN 
      '["Appointment Booking System", "Patient Records Management", "Treatment Plan Tracking", "Insurance Integration"]'::jsonb
    WHEN industry = 'Real Estate' THEN 
      '["Property Listing Management", "Client Portal & Communication", "Document Management", "Virtual Tour Integration"]'::jsonb
    ELSE '[]'::jsonb
  END,
  premium_features = CASE 
    WHEN industry = 'Hairdressing & Beauty' THEN 
      '[{"name": "Advanced Analytics", "price": 299}, {"name": "Marketing Automation", "price": 399}, {"name": "Multi-location Support", "price": 599}, {"name": "Advanced Inventory", "price": 199}, {"name": "SMS Marketing", "price": 149}]'::jsonb
    WHEN industry = 'Restaurant & Food Service' THEN 
      '[{"name": "Kitchen Display System", "price": 399}, {"name": "Advanced POS Integration", "price": 499}, {"name": "Multi-restaurant Support", "price": 799}, {"name": "Advanced Analytics", "price": 299}, {"name": "Inventory Management", "price": 349}]'::jsonb
    WHEN industry = 'Fitness & Wellness' THEN 
      '[{"name": "Nutrition Tracking", "price": 249}, {"name": "Wearable Device Integration", "price": 399}, {"name": "Virtual Classes", "price": 599}, {"name": "Advanced Member Analytics", "price": 299}, {"name": "Multi-gym Support", "price": 699}]'::jsonb
    WHEN industry = 'Home Services' THEN 
      '[{"name": "GPS Tracking", "price": 199}, {"name": "Advanced Invoicing", "price": 149}, {"name": "Material Cost Calculator", "price": 249}, {"name": "Customer Feedback System", "price": 99}, {"name": "Multi-team Support", "price": 399}]'::jsonb
    WHEN industry = 'Retail & E-commerce' THEN 
      '[{"name": "Advanced SEO Tools", "price": 299}, {"name": "Multi-vendor Support", "price": 599}, {"name": "Advanced Analytics", "price": 399}, {"name": "Marketing Automation", "price": 499}, {"name": "Multi-currency Support", "price": 249}]'::jsonb
    WHEN industry = 'Healthcare' THEN 
      '[{"name": "Telemedicine Integration", "price": 699}, {"name": "Advanced Reporting", "price": 399}, {"name": "Multi-practitioner Support", "price": 599}, {"name": "Prescription Management", "price": 299}, {"name": "Lab Results Integration", "price": 449}]'::jsonb
    WHEN industry = 'Real Estate' THEN 
      '[{"name": "CRM Integration", "price": 399}, {"name": "Advanced Search Filters", "price": 199}, {"name": "Market Analytics", "price": 499}, {"name": "Lead Management", "price": 299}, {"name": "Multi-office Support", "price": 699}]'::jsonb
    ELSE '[]'::jsonb
  END;

-- Set example sale prices based on industry complexity
UPDATE public.app_templates 
SET 
  sale_price = CASE 
    WHEN industry = 'Hairdressing & Beauty' THEN 3500
    WHEN industry = 'Restaurant & Food Service' THEN 4500
    WHEN industry = 'Fitness & Wellness' THEN 4000
    WHEN industry = 'Home Services' THEN 3000
    WHEN industry = 'Retail & E-commerce' THEN 5000
    WHEN industry = 'Healthcare' THEN 6000
    WHEN industry = 'Real Estate' THEN 4500
    ELSE 3500
  END,
  customization_price = CASE 
    WHEN industry = 'Healthcare' THEN 1000
    WHEN industry = 'Retail & E-commerce' THEN 800
    WHEN industry = 'Restaurant & Food Service' THEN 750
    WHEN industry = 'Real Estate' THEN 750
    WHEN industry = 'Fitness & Wellness' THEN 600
    WHEN industry = 'Hairdressing & Beauty' THEN 500
    WHEN industry = 'Home Services' THEN 400
    ELSE 500
  END;