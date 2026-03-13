-- Create sales_payments table

CREATE TABLE IF NOT EXISTS public.sales_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID REFERENCES public.deals(id) ON DELETE SET NULL,
  payment_type TEXT NOT NULL DEFAULT 'one_time',
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  status TEXT DEFAULT 'pending',
  reference TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.sales_payments ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Enable admin full access for sales_payments"
ON public.sales_payments FOR ALL
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Updated_at trigger
CREATE TRIGGER handle_updated_at_sales_payments
BEFORE UPDATE ON public.sales_payments
FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
