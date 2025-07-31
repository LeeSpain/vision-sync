-- Create leads table for general contact forms
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Contact Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  
  -- Lead Details
  source TEXT NOT NULL CHECK (source IN ('contact', 'custom-build', 'investor', 'ai-agent')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Form-specific data (stored as JSONB for flexibility)
  form_data JSONB DEFAULT '{}',
  
  -- Admin fields
  notes TEXT,
  last_contact TIMESTAMP WITH TIME ZONE,
  next_follow_up TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations - in production you'd want user-specific policies)
CREATE POLICY "Allow all operations on leads" ON public.leads FOR ALL USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data from existing localStorage format
INSERT INTO public.leads (name, email, company, source, form_data, status, priority) VALUES
('John Smith', 'john@example.com', 'Tech Corp', 'contact', '{"message": "Interested in your services", "phone": "+1234567890"}', 'new', 'medium'),
('Sarah Johnson', 'sarah@startup.io', 'Startup Inc', 'custom-build', '{"projectType": "Web Application", "budget": "50k-100k", "timeline": "3-6 months", "description": "Need a custom e-commerce platform"}', 'contacted', 'high'),
('Mike Wilson', 'mike@investor.com', 'Investment Group', 'investor', '{"investmentRange": "1m-5m", "interests": "Health tech, AI applications"}', 'qualified', 'high');