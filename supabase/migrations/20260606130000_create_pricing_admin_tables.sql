-- ─────────────────────────────────────────────────────────────────────────────
-- Editable pricing: move the source of truth from src/data/industries.ts into the
-- database so the admin can add/remove industries & tiers and draft/publish.
--
-- STEP 1 — schema only. No data migration, no frontend rewiring.
-- Mirrors the shape in PRICING_PACKAGES.md (§2–§4) and src/data/industries.ts:
--   pricing_industries 1──< pricing_packages (base / growth / everything)
-- ─────────────────────────────────────────────────────────────────────────────

-- Shared updated_at trigger function (idempotent; matches existing convention).
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── 1. pricing_industries ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pricing_industries (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              TEXT NOT NULL UNIQUE,
  name              TEXT NOT NULL,
  core_service_line TEXT,
  color             TEXT,
  voice_native      BOOLEAN NOT NULL DEFAULT false,
  sort_order        INTEGER NOT NULL DEFAULT 0,
  is_published      BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 2. pricing_packages ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pricing_packages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_id   UUID NOT NULL REFERENCES public.pricing_industries(id) ON DELETE CASCADE,
  tier          TEXT NOT NULL CHECK (tier IN ('base', 'growth', 'everything')),
  name          TEXT NOT NULL,
  ex_vat_price  NUMERIC(10,2) NOT NULL,
  inc_vat_price NUMERIC(10,2) NOT NULL,
  voice_minutes INTEGER NOT NULL DEFAULT 0,
  tagline       TEXT,
  includes      JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- one row per tier per industry (the 3-tier model)
  CONSTRAINT pricing_packages_industry_tier_unique UNIQUE (industry_id, tier)
);

-- Index the FK for fast per-industry package lookups.
CREATE INDEX IF NOT EXISTS pricing_packages_industry_id_idx
  ON public.pricing_packages (industry_id);

-- ── 3. updated_at triggers ───────────────────────────────────────────────────
DROP TRIGGER IF EXISTS set_updated_at ON public.pricing_industries;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.pricing_industries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS set_updated_at ON public.pricing_packages;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.pricing_packages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ── 4. Row Level Security ────────────────────────────────────────────────────
ALTER TABLE public.pricing_industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_packages   ENABLE ROW LEVEL SECURITY;

-- Public (incl. anon): read ONLY published industries.
CREATE POLICY "Public can read published pricing industries"
  ON public.pricing_industries
  FOR SELECT
  TO public
  USING (is_published = true);

-- Public (incl. anon): read packages ONLY for published industries.
CREATE POLICY "Public can read packages of published industries"
  ON public.pricing_packages
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.pricing_industries i
      WHERE i.id = pricing_packages.industry_id
        AND i.is_published = true
    )
  );

-- Admins only: full access (read drafts + insert/update/delete).
-- Matches the quotes-table pattern: auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin').
CREATE POLICY "Admins have full access to pricing industries"
  ON public.pricing_industries
  FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE POLICY "Admins have full access to pricing packages"
  ON public.pricing_packages
  FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));
