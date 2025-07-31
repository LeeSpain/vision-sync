-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Concept',
  category TEXT NOT NULL DEFAULT 'Investment',
  visibility TEXT NOT NULL DEFAULT 'Public',
  route TEXT,
  image_url TEXT,
  leads_count INTEGER NOT NULL DEFAULT 0,
  investment_amount DECIMAL(12,2),
  price DECIMAL(12,2),
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Projects are viewable by everyone" 
ON public.projects 
FOR SELECT 
USING (visibility = 'Public' OR true);

-- Create policy for admin management (for now, allow all operations)
CREATE POLICY "Admin can manage all projects" 
ON public.projects 
FOR ALL 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial project data
INSERT INTO public.projects (name, description, status, category, visibility, route, leads_count, investment_amount, price) VALUES
('Global Health-Sync', 'Revolutionary healthcare synchronization platform connecting patients, providers, and data globally.', 'MVP', 'Investment', 'Public', '/global-health-sync', 12, 500000, NULL),
('Nurse-Sync', 'Advanced nursing workflow management and patient care coordination system.', 'Live', 'Investment', 'Public', '/nurse-sync', 8, 750000, NULL),
('ICE-SOS Lite', 'Emergency contact and medical information system for immediate crisis response.', 'For Sale', 'For Sale', 'Public', '/ice-sos-lite', 15, NULL, 25000),
('Tether-Band', 'Innovative connectivity solution for secure device-to-device communication.', 'Beta', 'For Sale', 'Public', '/tether-band', 9, NULL, 50000),
('AI Spain Homes', 'AI-powered Spanish real estate platform with intelligent property matching.', 'Concept', 'Investment', 'Public', '/ai-spain-homes', 6, 300000, NULL),
('Conneqt-Central', 'Internal project management and team collaboration platform.', 'Private', 'Internal', 'Private', '/conneqt-central', 0, NULL, NULL),
('CustomBuilds Platform', 'White-label e-commerce solution with advanced customization capabilities.', 'Live', 'For Sale', 'Public', '/custom-builds', 11, NULL, 75000),
('ForSale Portal', 'Ready-to-deploy marketplace platform with built-in payment processing.', 'Live', 'For Sale', 'Public', '/for-sale', 7, NULL, 40000),
('ForInvestors Platform', 'Comprehensive investor relations and portfolio management system.', 'MVP', 'Investment', 'Public', '/for-investors', 4, 400000, NULL);