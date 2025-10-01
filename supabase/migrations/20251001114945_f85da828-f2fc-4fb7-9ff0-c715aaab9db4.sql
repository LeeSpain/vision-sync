-- Enable DELETE access for leads table
CREATE POLICY "Enable delete access for all users" 
ON public.leads 
FOR DELETE 
USING (true);