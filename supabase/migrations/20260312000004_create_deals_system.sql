-- Create deals and deal_activities tables for Sales Pipeline

-- 1. Deals table
CREATE TABLE IF NOT EXISTS public.deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID,
  business_name TEXT NOT NULL,
  industry TEXT,
  location TEXT,
  website TEXT,
  current_stage TEXT NOT NULL DEFAULT 'New Lead',
  estimated_value NUMERIC(10,2) DEFAULT 0,
  priority TEXT DEFAULT 'Medium',
  next_action TEXT,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  contact_name TEXT,
  contact_title TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  ai_summary TEXT,
  quote_status TEXT,
  contract_status TEXT,
  payment_status TEXT,
  demo_id TEXT,
  assigned_to UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Deal activities table
CREATE TABLE IF NOT EXISTS public.deal_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  message TEXT NOT NULL,
  actor TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. RLS
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_activities ENABLE ROW LEVEL SECURITY;

-- Admin full access on deals
CREATE POLICY "Enable admin full access for deals"
ON public.deals FOR ALL
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Admin full access on deal_activities
CREATE POLICY "Enable admin full access for deal_activities"
ON public.deal_activities FOR ALL
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Assigned user can read their own deals
CREATE POLICY "Assigned users can read own deals"
ON public.deals FOR SELECT
USING (auth.uid() = assigned_to);

-- 4. Updated_at trigger
CREATE TRIGGER handle_updated_at_deals
BEFORE UPDATE ON public.deals
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
