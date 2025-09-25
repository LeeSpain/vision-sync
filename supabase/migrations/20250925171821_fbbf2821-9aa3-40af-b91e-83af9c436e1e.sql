-- Add enhanced fields to projects table for complete project management
ALTER TABLE public.projects 
ADD COLUMN content_section TEXT,
ADD COLUMN pricing JSONB,
ADD COLUMN billing_type TEXT CHECK (billing_type IN ('subscription', 'one-time', 'investment', 'free')),
ADD COLUMN investment_amount DECIMAL(15,2),
ADD COLUMN funding_progress DECIMAL(5,2) DEFAULT 0,
ADD COLUMN subscription_price DECIMAL(10,2),
ADD COLUMN subscription_period TEXT CHECK (subscription_period IN ('monthly', 'yearly', 'weekly')),
ADD COLUMN price DECIMAL(10,2),
ADD COLUMN deposit_amount DECIMAL(10,2),
ADD COLUMN priority_order INTEGER DEFAULT 0,
ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'development', 'sold', 'funded', 'archived', 'paused')),
ADD COLUMN route TEXT,
ADD COLUMN expected_roi DECIMAL(5,2),
ADD COLUMN investment_deadline TIMESTAMP WITH TIME ZONE,
ADD COLUMN investor_count INTEGER DEFAULT 0,
ADD COLUMN social_proof JSONB;

-- Add indexes for better performance
CREATE INDEX idx_projects_content_section ON public.projects(content_section);
CREATE INDEX idx_projects_billing_type ON public.projects(billing_type);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_priority_order ON public.projects(priority_order);