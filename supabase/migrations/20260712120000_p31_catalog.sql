-- ============================================================================
-- P3.1 — The Tenant Factory schema · Part A: catalog tables
-- BLUEPRINT §2.2/§2.3, D4 (multi-tenant), D17 (industries), D20 (levers)
--
-- Purely additive. Creates: industry_packs, nodes (+ is_admin() helper).
-- Follows CLAUDE.md: uuid PK, created_at/updated_at, RLS on every table,
-- explicit ON DELETE, new numbered migration only.
-- Idempotent (IF NOT EXISTS / OR REPLACE / DROP..IF EXISTS) so the runbook
-- can be re-run safely.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Shared helpers
-- ---------------------------------------------------------------------------

-- updated_at trigger fn already exists in an earlier migration; re-assert for
-- replay safety (identical body — CREATE OR REPLACE is a no-op if present).
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- is_admin(): SECURITY DEFINER so RLS policies don't recurse through profiles'
-- own RLS. Mirrors the repo's proven pattern
-- (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
-- but as a reusable, search_path-pinned function.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- industry_packs — one per industry (8 at launch, D17). Holds microsite
-- layout, EN/ES copy templates, agent prompt template, interview script,
-- gate test-suite, and default node set per tier. Editable from admin.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.industry_packs (
    id                   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug                 TEXT NOT NULL UNIQUE,
    name                 TEXT NOT NULL,
    status               TEXT NOT NULL DEFAULT 'draft'
                           CHECK (status IN ('draft', 'published', 'archived')),
    is_pilot             BOOLEAN NOT NULL DEFAULT false,   -- D17 factory pilots
    summary              TEXT,
    section_layout       JSONB NOT NULL DEFAULT '[]'::JSONB,  -- microsite section order
    copy_templates       JSONB NOT NULL DEFAULT '{}'::JSONB,  -- { en: {...}, es: {...} } merge-field copy
    agent_prompt_template TEXT,                                -- system-prompt template w/ merge fields (sensitive)
    interview_script     JSONB NOT NULL DEFAULT '[]'::JSONB,  -- builder interview questions
    test_suite           JSONB NOT NULL DEFAULT '[]'::JSONB,  -- approval-gate test questions (sensitive)
    default_nodes        JSONB NOT NULL DEFAULT '{}'::JSONB,  -- { base:[slug], growth:[slug], everything:[slug] }
    sort_order           INTEGER NOT NULL DEFAULT 0,
    created_at           TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at           TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.industry_packs ENABLE ROW LEVEL SECURITY;

-- Admin-only: packs carry sensitive agent prompt templates + gate test-suites.
-- A public presentation-only projection (view / edge function exposing just
-- layout + copy + pricing defaults) is deferred to the builder (P2.5). No
-- anon/authenticated read policy here on purpose — non-admins get zero rows.
DROP POLICY IF EXISTS "industry_packs admin full access" ON public.industry_packs;
CREATE POLICY "industry_packs admin full access"
ON public.industry_packs FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS trg_industry_packs_updated_at ON public.industry_packs;
CREATE TRIGGER trg_industry_packs_updated_at
BEFORE UPDATE ON public.industry_packs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- nodes — the sellable capability catalogue (Booking, Lead Qualifier, ...,
-- Payments add-on). Each = feature flag + config schema + tier availability.
-- The old ModulePicker concept graduates into this. Public-readable catalogue.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.nodes (
    id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug                TEXT NOT NULL UNIQUE,
    name                TEXT NOT NULL,
    description         TEXT,
    category            TEXT,                              -- 'core' | 'growth' | 'communication' | 'commerce'
    min_tier            TEXT CHECK (min_tier IN ('base', 'growth', 'everything')),
    is_addon            BOOLEAN NOT NULL DEFAULT false,    -- Payments = true (D3)
    addon_monthly_price NUMERIC(10, 2),                    -- €49 for Payments; null if bundled
    config_schema       JSONB NOT NULL DEFAULT '{}'::JSONB, -- per-tenant config JSON schema
    is_active           BOOLEAN NOT NULL DEFAULT true,
    sort_order          INTEGER NOT NULL DEFAULT 0,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at          TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.nodes ENABLE ROW LEVEL SECURITY;

-- Catalogue is safe to expose: anyone may read active nodes (feeds the builder).
DROP POLICY IF EXISTS "nodes public read active" ON public.nodes;
CREATE POLICY "nodes public read active"
ON public.nodes FOR SELECT
USING (is_active = true);

-- Admin manages the catalogue.
DROP POLICY IF EXISTS "nodes admin full access" ON public.nodes;
CREATE POLICY "nodes admin full access"
ON public.nodes FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS trg_nodes_updated_at ON public.nodes;
CREATE TRIGGER trg_nodes_updated_at
BEFORE UPDATE ON public.nodes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
