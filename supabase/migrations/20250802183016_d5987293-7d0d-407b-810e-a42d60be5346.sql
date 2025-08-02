-- Insert 6 missing industry template cards

-- Restaurant & Food Service Template
INSERT INTO app_templates (
  title, 
  description, 
  detailed_description,
  category, 
  industry,
  foundation_features,
  core_industry_features,
  premium_features,
  key_features,
  sale_price,
  customization_price,
  pricing,
  is_popular,
  is_active
) VALUES (
  'FoodieConnect Pro',
  'Complete restaurant management solution with ordering and delivery integration',
  'Transform your restaurant operations with our comprehensive management platform featuring digital menus, online ordering, table reservations, and delivery tracking. Perfect for restaurants, cafes, and food service businesses looking to modernize their operations and increase revenue.',
  'Business Management',
  'Restaurant & Food Service',
  '["User Authentication & Profiles", "Admin Dashboard & Analytics", "Business Management Tools", "Reporting & Analytics", "Mobile-Responsive Design", "Data Backup & Security"]'::jsonb,
  '["Digital Menu Management", "Online Ordering System", "Table Reservation System", "Delivery Tracking"]'::jsonb,
  '[
    {"name": "Kitchen Display System", "price": 500},
    {"name": "POS Integration", "price": 800},
    {"name": "Multi-Location Management", "price": 1200},
    {"name": "Advanced Analytics Dashboard", "price": 600},
    {"name": "Customer Loyalty Program", "price": 700}
  ]'::jsonb,
  '["Digital Menu Management", "Online Ordering System", "Table Reservation System", "Delivery Tracking", "User Authentication", "Admin Dashboard"]'::jsonb,
  8000,
  3000,
  '{"base": 8000, "customization": 3000}'::jsonb,
  true,
  true
);

-- Fitness & Wellness Template
INSERT INTO app_templates (
  title, 
  description, 
  detailed_description,
  category, 
  industry,
  foundation_features,
  core_industry_features,
  premium_features,
  key_features,
  sale_price,
  customization_price,
  pricing,
  is_popular,
  is_active
) VALUES (
  'FitFlow Studio',
  'Comprehensive fitness studio management with class scheduling and member tracking',
  'Streamline your fitness business with our all-in-one platform featuring class scheduling, membership management, workout tracking, and trainer assignment. Ideal for gyms, yoga studios, personal trainers, and wellness centers.',
  'Business Management',
  'Fitness & Wellness',
  '["User Authentication & Profiles", "Admin Dashboard & Analytics", "Business Management Tools", "Reporting & Analytics", "Mobile-Responsive Design", "Data Backup & Security"]'::jsonb,
  '["Class Scheduling System", "Membership Management", "Workout Plans & Tracking", "Trainer Assignment"]'::jsonb,
  '[
    {"name": "Nutrition Tracking", "price": 600},
    {"name": "Payment Processing", "price": 500},
    {"name": "Wearable Device Integration", "price": 800},
    {"name": "Video Streaming for Classes", "price": 1000},
    {"name": "Member Mobile App", "price": 1200}
  ]'::jsonb,
  '["Class Scheduling System", "Membership Management", "Workout Plans & Tracking", "Trainer Assignment", "User Authentication", "Admin Dashboard"]'::jsonb,
  7500,
  2500,
  '{"base": 7500, "customization": 2500}'::jsonb,
  true,
  true
);

-- Home Services Template
INSERT INTO app_templates (
  title, 
  description, 
  detailed_description,
  category, 
  industry,
  foundation_features,
  core_industry_features,
  premium_features,
  key_features,
  sale_price,
  customization_price,
  pricing,
  is_popular,
  is_active
) VALUES (
  'ServicePro Manager',
  'Professional home services management with job tracking and customer communication',
  'Optimize your home services business with our comprehensive platform featuring quote building, job tracking, photo galleries, and scheduling tools. Perfect for contractors, cleaning services, landscapers, and maintenance professionals.',
  'Business Management',
  'Home Services',
  '["User Authentication & Profiles", "Admin Dashboard & Analytics", "Business Management Tools", "Reporting & Analytics", "Mobile-Responsive Design", "Data Backup & Security"]'::jsonb,
  '["Quote Builder & Estimator", "Job Tracking & Progress", "Before/After Photo Gallery", "Scheduling & Calendar"]'::jsonb,
  '[
    {"name": "GPS Route Optimization", "price": 700},
    {"name": "Inventory Management", "price": 600},
    {"name": "Customer Review System", "price": 400},
    {"name": "Team Communication Tools", "price": 500},
    {"name": "Invoice & Payment Processing", "price": 800}
  ]'::jsonb,
  '["Quote Builder & Estimator", "Job Tracking & Progress", "Before/After Photo Gallery", "Scheduling & Calendar", "User Authentication", "Admin Dashboard"]'::jsonb,
  9000,
  3500,
  '{"base": 9000, "customization": 3500}'::jsonb,
  false,
  true
);

-- Retail & E-commerce Template
INSERT INTO app_templates (
  title, 
  description, 
  detailed_description,
  category, 
  industry,
  foundation_features,
  core_industry_features,
  premium_features,
  key_features,
  sale_price,
  customization_price,
  pricing,
  is_popular,
  is_active
) VALUES (
  'ShopSphere Pro',
  'Full-featured e-commerce platform with inventory and order management',
  'Launch your online store with our powerful e-commerce solution featuring product catalogs, shopping cart, customer accounts, and order processing. Ideal for retail businesses, online stores, and product-based companies.',
  'E-commerce',
  'Retail & E-commerce',
  '["User Authentication & Profiles", "Admin Dashboard & Analytics", "Business Management Tools", "Reporting & Analytics", "Mobile-Responsive Design", "Data Backup & Security"]'::jsonb,
  '["Product Catalog & Inventory", "Shopping Cart & Checkout", "Customer Account Portal", "Order Processing System"]'::jsonb,
  '[
    {"name": "Multi-Currency Support", "price": 600},
    {"name": "Advanced SEO Tools", "price": 500},
    {"name": "Email Marketing Integration", "price": 700},
    {"name": "Abandoned Cart Recovery", "price": 400},
    {"name": "Multi-Vendor Marketplace", "price": 1500}
  ]'::jsonb,
  '["Product Catalog & Inventory", "Shopping Cart & Checkout", "Customer Account Portal", "Order Processing System", "User Authentication", "Admin Dashboard"]'::jsonb,
  12000,
  4000,
  '{"base": 12000, "customization": 4000}'::jsonb,
  true,
  true
);

-- Healthcare Template
INSERT INTO app_templates (
  title, 
  description, 
  detailed_description,
  category, 
  industry,
  foundation_features,
  core_industry_features,
  premium_features,
  key_features,
  sale_price,
  customization_price,
  pricing,
  is_popular,
  is_active
) VALUES (
  'MedConnect Pro',
  'Healthcare practice management with appointments and patient records',
  'Modernize your healthcare practice with our HIPAA-compliant platform featuring appointment booking, patient records, treatment tracking, and insurance integration. Perfect for clinics, private practices, and healthcare professionals.',
  'Healthcare',
  'Healthcare',
  '["User Authentication & Profiles", "Admin Dashboard & Analytics", "Business Management Tools", "Reporting & Analytics", "Mobile-Responsive Design", "Data Backup & Security"]'::jsonb,
  '["Appointment Booking System", "Patient Records Management", "Treatment Plan Tracking", "Insurance Integration"]'::jsonb,
  '[
    {"name": "Telemedicine Integration", "price": 1200},
    {"name": "Prescription Management", "price": 800},
    {"name": "Lab Results Portal", "price": 600},
    {"name": "Billing & Claims Processing", "price": 1000},
    {"name": "HIPAA Compliance Suite", "price": 900}
  ]'::jsonb,
  '["Appointment Booking System", "Patient Records Management", "Treatment Plan Tracking", "Insurance Integration", "User Authentication", "Admin Dashboard"]'::jsonb,
  15000,
  5000,
  '{"base": 15000, "customization": 5000}'::jsonb,
  false,
  true
);

-- Real Estate Template
INSERT INTO app_templates (
  title, 
  description, 
  detailed_description,
  category, 
  industry,
  foundation_features,
  core_industry_features,
  premium_features,
  key_features,
  sale_price,
  customization_price,
  pricing,
  is_popular,
  is_active
) VALUES (
  'RealtyFlow Pro',
  'Complete real estate management with property listings and client portals',
  'Streamline your real estate business with our comprehensive platform featuring property listings, client communication, document management, and virtual tours. Perfect for real estate agents, brokers, and property management companies.',
  'Business Management',
  'Real Estate',
  '["User Authentication & Profiles", "Admin Dashboard & Analytics", "Business Management Tools", "Reporting & Analytics", "Mobile-Responsive Design", "Data Backup & Security"]'::jsonb,
  '["Property Listing Management", "Client Portal & Communication", "Document Management", "Virtual Tour Integration"]'::jsonb,
  '[
    {"name": "MLS Integration", "price": 1000},
    {"name": "CRM & Lead Management", "price": 800},
    {"name": "E-Signature Integration", "price": 600},
    {"name": "Market Analysis Tools", "price": 700},
    {"name": "Commission Tracking", "price": 500}
  ]'::jsonb,
  '["Property Listing Management", "Client Portal & Communication", "Document Management", "Virtual Tour Integration", "User Authentication", "Admin Dashboard"]'::jsonb,
  11000,
  4000,
  '{"base": 11000, "customization": 4000}'::jsonb,
  false,
  true
);