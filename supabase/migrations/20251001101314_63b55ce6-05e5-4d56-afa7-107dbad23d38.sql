-- Add enhanced lead qualification fields
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS budget_range text,
ADD COLUMN IF NOT EXISTS timeline text,
ADD COLUMN IF NOT EXISTS technical_requirements text,
ADD COLUMN IF NOT EXISTS lead_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS pipeline_stage text DEFAULT 'new',
ADD COLUMN IF NOT EXISTS qualification_status text DEFAULT 'unqualified',
ADD COLUMN IF NOT EXISTS assigned_to text,
ADD COLUMN IF NOT EXISTS last_contact_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS next_follow_up timestamp with time zone,
ADD COLUMN IF NOT EXISTS project_type text,
ADD COLUMN IF NOT EXISTS industry text,
ADD COLUMN IF NOT EXISTS preferred_start_date timestamp with time zone;

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  quote_number text UNIQUE NOT NULL,
  project_name text NOT NULL,
  project_description text,
  line_items jsonb DEFAULT '[]'::jsonb,
  subtotal numeric(10,2) DEFAULT 0,
  tax numeric(10,2) DEFAULT 0,
  total numeric(10,2) DEFAULT 0,
  discount_amount numeric(10,2) DEFAULT 0,
  status text DEFAULT 'draft',
  valid_until timestamp with time zone,
  terms_and_conditions text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  sent_at timestamp with time zone,
  accepted_at timestamp with time zone
);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON quotes
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON quotes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON quotes
  FOR UPDATE USING (true);

-- Create customer interactions table
CREATE TABLE IF NOT EXISTS customer_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  interaction_type text NOT NULL,
  subject text,
  content text,
  interaction_date timestamp with time zone DEFAULT now(),
  created_by text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE customer_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON customer_interactions
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON customer_interactions
  FOR INSERT WITH CHECK (true);

-- Create trigger for updating quotes updated_at
CREATE OR REPLACE FUNCTION update_quotes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_quotes_updated_at();

-- Create function to calculate lead score
CREATE OR REPLACE FUNCTION calculate_lead_score(
  p_budget_range text,
  p_timeline text,
  p_inquiry_type text,
  p_company text
)
RETURNS integer AS $$
DECLARE
  score integer := 0;
BEGIN
  -- Budget scoring
  CASE p_budget_range
    WHEN '$50k+' THEN score := score + 40;
    WHEN '$20k-$50k' THEN score := score + 30;
    WHEN '$10k-$20k' THEN score := score + 20;
    WHEN '$5k-$10k' THEN score := score + 10;
    ELSE score := score + 5;
  END CASE;

  -- Timeline scoring
  CASE p_timeline
    WHEN 'immediate' THEN score := score + 30;
    WHEN '1-2 weeks' THEN score := score + 25;
    WHEN '2-4 weeks' THEN score := score + 20;
    WHEN '1-2 months' THEN score := score + 15;
    ELSE score := score + 10;
  END CASE;

  -- Inquiry type scoring
  CASE p_inquiry_type
    WHEN 'investment' THEN score := score + 20;
    WHEN 'purchase' THEN score := score + 15;
    WHEN 'partnership' THEN score := score + 10;
    ELSE score := score + 5;
  END CASE;

  -- Company presence scoring
  IF p_company IS NOT NULL AND p_company != '' THEN
    score := score + 10;
  END IF;

  RETURN score;
END;
$$ LANGUAGE plpgsql;