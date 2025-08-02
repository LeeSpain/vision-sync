-- Add investment tracking fields to projects table
ALTER TABLE public.projects 
ADD COLUMN funding_progress DECIMAL(5,2) DEFAULT 0 CHECK (funding_progress >= 0 AND funding_progress <= 100),
ADD COLUMN expected_roi DECIMAL(5,2) DEFAULT NULL,
ADD COLUMN investment_deadline DATE DEFAULT NULL,
ADD COLUMN investor_count INTEGER DEFAULT 0,
ADD COLUMN social_proof TEXT DEFAULT NULL;

-- Add comments for clarity
COMMENT ON COLUMN public.projects.funding_progress IS 'Funding progress percentage (0-100)';
COMMENT ON COLUMN public.projects.expected_roi IS 'Expected return on investment percentage';
COMMENT ON COLUMN public.projects.investment_deadline IS 'Investment deadline date';
COMMENT ON COLUMN public.projects.investor_count IS 'Number of current investors or interested parties';
COMMENT ON COLUMN public.projects.social_proof IS 'Social proof text like "127 investors viewing"';