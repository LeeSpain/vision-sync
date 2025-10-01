-- Fix security warnings by setting search_path for functions

-- Update the update_quotes_updated_at function with search_path
CREATE OR REPLACE FUNCTION update_quotes_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update the calculate_lead_score function with search_path
CREATE OR REPLACE FUNCTION calculate_lead_score(
  p_budget_range text,
  p_timeline text,
  p_inquiry_type text,
  p_company text
)
RETURNS integer 
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;