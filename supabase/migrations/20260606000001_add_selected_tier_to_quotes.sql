-- Add tier persistence to quotes.
-- Nullable: existing rows predate package-tier selection and have no tier.
ALTER TABLE public.quotes ADD COLUMN selected_tier text;
