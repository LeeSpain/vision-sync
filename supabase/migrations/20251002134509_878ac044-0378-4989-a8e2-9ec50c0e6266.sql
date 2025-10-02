-- Add project_id column to leads table for better project tracking
ALTER TABLE public.leads 
ADD COLUMN project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX idx_leads_project_id ON public.leads(project_id);

-- Update existing project leads from form_data to new column
UPDATE public.leads 
SET project_id = CAST(form_data->>'project_id' AS uuid)
WHERE form_data->>'type' = 'project_inquiry'
  AND form_data->>'project_id' IS NOT NULL
  AND form_data->>'project_id' ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';