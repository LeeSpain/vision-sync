-- ============================================================================
-- D20 (part 1/2) — Unit economics = admin-controlled, versioned.
-- BLUEPRINT D20 (+ D13 per-currency price points).
--
-- Purely additive. Creates public.plan_versions: an immutable, versioned
-- snapshot of a plan's economic levers. "Changing a lever versions the plan"
-- = insert a new row (version+1, is_current=true); prior versions are kept so
-- existing tenants can stay pinned to the version they were provisioned on
-- (the tenant→version link lands with P3.1's tenant_configs in a follow-up).
--
-- Admin-only (internal economics — invisible to the public site; the public
-- pricing page keeps reading the existing live plans/pricing_packages columns).
-- Idempotent. No existing table is altered.
--
-- Self-contained: defensively (re)defines the shared helpers via CREATE OR
-- REPLACE with the SAME bodies used elsewhere, so this migration applies
-- regardless of whether P3.1 has run yet (order-independent; a no-op if present).
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

CREATE TABLE IF NOT EXISTS public.plan_versions (
    id                        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plan_id                   UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
    version                   INTEGER NOT NULL,
    is_current                BOOLEAN NOT NULL DEFAULT false,

    -- Levers (D20). Prices are SET points per currency (D13), never live FX.
    price_points              JSONB NOT NULL DEFAULT '{}'::JSONB,
      -- { "EUR": { "monthly": 249, "setup": 0 }, "USD": {...}, "GBP": {...} }
    included_ai_conversations INTEGER,                       -- e.g. Base 1000 / Growth 3000 / Everything 8000
    included_voice_minutes    INTEGER,                       -- e.g. Everything 200
    whatsapp_conversation_cap INTEGER,                       -- monthly cap; NULL = not included
    overage_rates             JSONB NOT NULL DEFAULT '{}'::JSONB,
      -- { "ai_conversation": 0.05, "voice_minute": 0.10, "whatsapp_conversation": 0.08 }
    feature_flags             JSONB NOT NULL DEFAULT '{}'::JSONB,
      -- per-tier flags, e.g. { "booking": true, "payments": false, "voice": true }

    notes                     TEXT,                          -- why this version exists (change log)
    created_by                UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at                TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at                TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (plan_id, version)
);

CREATE INDEX IF NOT EXISTS idx_plan_versions_plan_id ON public.plan_versions(plan_id);

-- Exactly one current version per plan.
CREATE UNIQUE INDEX IF NOT EXISTS uniq_plan_versions_one_current
ON public.plan_versions(plan_id) WHERE is_current;

ALTER TABLE public.plan_versions ENABLE ROW LEVEL SECURITY;

-- Admin-only: plan economics (overage rates, caps) are internal, not public.
DROP POLICY IF EXISTS "plan_versions admin full access" ON public.plan_versions;
CREATE POLICY "plan_versions admin full access"
ON public.plan_versions FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP TRIGGER IF EXISTS trg_plan_versions_updated_at ON public.plan_versions;
CREATE TRIGGER trg_plan_versions_updated_at
BEFORE UPDATE ON public.plan_versions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- create_plan_version(): atomically supersede the current version with a new
-- one. Admin-gated at the RLS layer (SECURITY INVOKER — runs as the caller, so
-- a non-admin cannot use it to bypass the admin-only policy). Returns new id.
CREATE OR REPLACE FUNCTION public.create_plan_version(
    p_plan_id                   UUID,
    p_price_points              JSONB DEFAULT '{}'::JSONB,
    p_included_ai_conversations INTEGER DEFAULT NULL,
    p_included_voice_minutes    INTEGER DEFAULT NULL,
    p_whatsapp_conversation_cap INTEGER DEFAULT NULL,
    p_overage_rates             JSONB DEFAULT '{}'::JSONB,
    p_feature_flags             JSONB DEFAULT '{}'::JSONB,
    p_notes                     TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
    v_next   INTEGER;
    v_new_id UUID;
BEGIN
    -- Demote the existing current version (if any).
    UPDATE public.plan_versions
       SET is_current = false
     WHERE plan_id = p_plan_id AND is_current;

    SELECT COALESCE(MAX(version), 0) + 1 INTO v_next
      FROM public.plan_versions WHERE plan_id = p_plan_id;

    INSERT INTO public.plan_versions (
        plan_id, version, is_current, price_points, included_ai_conversations,
        included_voice_minutes, whatsapp_conversation_cap, overage_rates,
        feature_flags, notes, created_by)
    VALUES (
        p_plan_id, v_next, true, p_price_points, p_included_ai_conversations,
        p_included_voice_minutes, p_whatsapp_conversation_cap, p_overage_rates,
        p_feature_flags, p_notes, auth.uid())
    RETURNING id INTO v_new_id;

    RETURN v_new_id;
END;
$$;

COMMENT ON TABLE public.plan_versions IS
  'D20: versioned economic levers per plan. Immutable history; is_current marks the live version. Existing tenants pin to the version they were provisioned on.';
