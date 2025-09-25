-- Enable DELETE policy for projects table
CREATE POLICY "Enable delete access for all users" 
ON public.projects 
FOR DELETE 
USING (true);