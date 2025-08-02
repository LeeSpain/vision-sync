-- Insert 6 missing industry template cards
INSERT INTO public.app_templates (
  title, 
  industry, 
  description, 
  detailed_description,
  category,
  foundation_features,
  core_industry_features,
  premium_features,
  key_features,
  sale_price,
  customization_price,
  pricing,
  is_popular,
  is_active
) VALUES 
-- Restaurant & Food Service
(
  'RestaurantPro',
  'Restaurant & Food Service',
  'Complete restaurant management solution with ordering, reservations, and delivery tracking.',
  'Transform your restaurant operations with our comprehensive management platform. Handle online orders, table reservations, menu updates, and delivery coordination all in one place. Perfect for restaurants, cafes, food trucks, and catering services.',
  'Business Management',
  '["User Authentication & Profiles", "Admin Dashboard & Analytics", "Content Management System", "Automated Reporting & Insights", "Mobile-Responsive Design", "Data Backup & Security"]',
  '["Digital Menu Management", "Online Ordering System", "Table Reservation System", "Delivery Tracking"]',
  '[
    {"name": "Kitchen Display System", "price": 800},
    {"name": "Inventory Management", "price": 600},
    {"name": "Staff Scheduling", "price": 400},
    {"name": "Customer Loyalty Program", "price": 500},
    {"name": "Multi-Location Support", "price": 1000}
  ]',
  '["Digital Menu Management", "Online Ordering System", "Table Reservation System", "Delivery Tracking", "User Authentication & Profiles", "Admin Dashboard & Analytics"]',
  8000,
  3000,
  '{"base": 8000, "customization": 3000, "subscription": {"monthly": 150}}',
  true,
  true
),
-- Fitness & Wellness
(
  'FitnessPro',
  'Fitness & Wellness',
  'Comprehensive fitness management platform for gyms, studios, and personal trainers.',
  'Streamline your fitness business with our all-in-one platform. Manage memberships, schedule classes, track workouts, and assign trainers. Ideal for gyms, yoga studios, personal trainers, and wellness centers.',
  'Health & Fitness',
  '["User Authentication & Profiles", "Admin Dashboard & Analytics", "Content Management System", "Automated Reporting & Insights", "Mobile-Responsive Design", "Data Backup & Security"]',
  '["Class Scheduling System", "Membership Management", "Workout Plans & Tracking", "Trainer Assignment"]',
  '[
    {"name": "Nutrition Tracking", "price": 600},
    {"name": "Payment Processing", "price": 500},
    {"name": "Virtual Training Sessions", "price": 800},
    {"name": "Progress Analytics", "price": 400},
    {"name": "Equipment Booking", "price": 300}
  ]',
  '["Class Scheduling System", "Membership Management", "Workout Plans & Tracking", "Trainer Assignment", "User Authentication & Profiles", "Admin Dashboard & Analytics"]',
  7500,
  2800,
  '{"base": 7500, "customization": 2800, "subscription": {"monthly": 120}}',
  true,
  true
),
-- Home Services
(
  'ServicePro',
  'Home Services',
  'Professional home services management with quotes, scheduling, and project tracking.',
  'Grow your home services business with our powerful management tools. Create quotes, track jobs, manage schedules, and showcase your work. Perfect for contractors, cleaners, landscapers, and repair services.',
  'Business Management',
  '["User Authentication & Profiles", "Admin Dashboard & Analytics", "Content Management System", "Automated Reporting & Insights", "Mobile-Responsive Design", "Data Backup & Security"]',
  '["Quote Builder & Estimator", "Job Tracking & Progress", "Before/After Photo Gallery", "Scheduling & Calendar"]',
  '[
    {"name": "Invoice & Payment System", "price": 700},
    {"name": "GPS Tracking", "price": 400},
    {"name": "Customer Review Management", "price": 300},
    {"name": "Material Cost Calculator", "price": 500},
    {"name": "Team Management", "price": 600}
  ]',
  '["Quote Builder & Estimator", "Job Tracking & Progress", "Before/After Photo Gallery", "Scheduling & Calendar", "User Authentication & Profiles", "Admin Dashboard & Analytics"]',
  7000,
  2500,
  '{"base": 7000, "customization": 2500, "subscription": {"monthly": 100}}',
  false,
  true
),
-- Retail & E-commerce
(
  'RetailPro',
  'Retail & E-commerce',
  'Complete e-commerce solution with inventory, orders, and customer management.',
  'Launch and manage your online store with our comprehensive e-commerce platform. Handle products, process orders, manage inventory, and grow your customer base. Ideal for retailers, wholesalers, and online entrepreneurs.',
  'E-commerce',
  '["User Authentication & Profiles", "Admin Dashboard & Analytics", "Content Management System", "Automated Reporting & Insights", "Mobile-Responsive Design", "Data Backup & Security"]',
  '["Product Catalog & Inventory", "Shopping Cart & Checkout", "Customer Account Portal", "Order Processing System"]',
  '[
    {"name": "Multi-Currency Support", "price": 800},
    {"name": "Advanced Analytics", "price": 600},
    {"name": "Marketing Automation", "price": 900},
    {"name": "Third-Party Integrations", "price": 700},
    {"name": "SEO Optimization Tools", "price": 500}
  ]',
  '["Product Catalog & Inventory", "Shopping Cart & Checkout", "Customer Account Portal", "Order Processing System", "User Authentication & Profiles", "Admin Dashboard & Analytics"]',
  9000,
  3500,
  '{"base": 9000, "customization": 3500, "subscription": {"monthly": 180}}',
  true,
  true
),
-- Healthcare
(
  'HealthcarePro',
  'Healthcare',
  'HIPAA-compliant healthcare management with appointments, records, and patient tracking.',
  'Modernize your healthcare practice with our secure, compliant platform. Manage appointments, patient records, treatments, and insurance seamlessly. Perfect for clinics, private practices, and healthcare providers.',
  'Healthcare',
  '["User Authentication & Profiles", "Admin Dashboard & Analytics", "Content Management System", "Automated Reporting & Insights", "Mobile-Responsive Design", "Data Backup & Security"]',
  '["Appointment Booking System", "Patient Records Management", "Treatment Plan Tracking", "Insurance Integration"]',
  '[
    {"name": "Telemedicine Support", "price": 1200},
    {"name": "Prescription Management", "price": 800},
    {"name": "Lab Results Integration", "price": 900},
    {"name": "HIPAA Compliance Tools", "price": 1000},
    {"name": "Medical Billing", "price": 1100}
  ]',
  '["Appointment Booking System", "Patient Records Management", "Treatment Plan Tracking", "Insurance Integration", "User Authentication & Profiles", "Admin Dashboard & Analytics"]',
  12000,
  4000,
  '{"base": 12000, "customization": 4000, "subscription": {"monthly": 250}}',
  false,
  true
),
-- Real Estate
(
  'RealEstatePro',
  'Real Estate',
  'Complete real estate platform with listings, client management, and virtual tours.',
  'Elevate your real estate business with our comprehensive platform. Manage properties, communicate with clients, handle documents, and showcase listings with virtual tours. Perfect for agents, brokers, and property managers.',
  'Real Estate',
  '["User Authentication & Profiles", "Admin Dashboard & Analytics", "Content Management System", "Automated Reporting & Insights", "Mobile-Responsive Design", "Data Backup & Security"]',
  '["Property Listing Management", "Client Portal & Communication", "Document Management", "Virtual Tour Integration"]',
  '[
    {"name": "Market Analysis Tools", "price": 800},
    {"name": "CRM Integration", "price": 700},
    {"name": "Lead Generation Tools", "price": 900},
    {"name": "Commission Tracking", "price": 500},
    {"name": "Multi-MLS Integration", "price": 1200}
  ]',
  '["Property Listing Management", "Client Portal & Communication", "Document Management", "Virtual Tour Integration", "User Authentication & Profiles", "Admin Dashboard & Analytics"]',
  10000,
  3800,
  '{"base": 10000, "customization": 3800, "subscription": {"monthly": 200}}',
  false,
  true
);