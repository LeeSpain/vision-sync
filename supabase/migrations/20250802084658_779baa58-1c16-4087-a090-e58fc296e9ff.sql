-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);

-- Create storage policies for project images
CREATE POLICY "Project images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'project-images');

CREATE POLICY "Anyone can upload project images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Anyone can update project images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'project-images');

CREATE POLICY "Anyone can delete project images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'project-images');

-- Add domain_url field to projects table
ALTER TABLE public.projects 
ADD COLUMN domain_url text;