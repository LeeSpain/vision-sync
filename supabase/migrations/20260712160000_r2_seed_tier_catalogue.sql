-- ============================================================================
-- R2 (SCHEMA_AUDIT reconciliation · Option A) — repurpose `plans` as the
-- 3-row TIER CATALOGUE (base/growth/everything) carrying D20 usage levers via
-- plan_versions. Prices remain canonical in pricing_packages (NOT set here).
--
-- SELF-VERIFYING & DRIFT-SAFE (owner directive): the live DB has drifted from
-- migration history, so this migration assumes NOTHING. Every column it touches
-- is guarded with ADD COLUMN IF NOT EXISTS; the conflict target is ensured; all
-- inserts are idempotent (ON CONFLICT / NOT EXISTS). Re-running is a no-op.
-- ============================================================================

-- 1) Ensure `plans` has the columns the tier catalogue needs (drift-safe).
--    `plans` is empty, so adding columns is safe. Existing columns → no-op.
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS name       TEXT;
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS slug       TEXT;
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS is_active  BOOLEAN DEFAULT true;
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
-- Marker distinguishing the canonical tier rows from any legacy/other plan rows.
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS is_tier    BOOLEAN NOT NULL DEFAULT false;

-- 2) Ensure a unique conflict target on slug (core defines it, but drift-safe).
CREATE UNIQUE INDEX IF NOT EXISTS uniq_plans_slug ON public.plans(slug);

-- 3) Seed exactly the three canonical tiers (idempotent).
INSERT INTO public.plans (name, slug, is_active, sort_order, is_tier)
VALUES
  ('Base',       'base',       true, 10, true),
  ('Growth',     'growth',     true, 20, true),
  ('Everything', 'everything', true, 30, true)
ON CONFLICT (slug) DO UPDATE SET is_tier = true;   -- reclaim a pre-existing slug as a tier row

-- 4) Ensure plan_versions has ONLY the genuinely-homeless lever columns R2
--    writes (drift-safe). We deliberately do NOT write/seed:
--      • included_voice_minutes → already canonical in pricing_packages.voice_minutes
--        (per industry×tier). Duplicating it here would create a second source.
--      • price_points → prices are canonical in pricing_packages (ex/inc VAT).
--    Those D20 columns remain on the table but are left NULL/empty by R2; R5
--    (destructive, later) may drop them once the re-homed UI (R4) confirms no reader.
ALTER TABLE public.plan_versions ADD COLUMN IF NOT EXISTS included_ai_conversations INTEGER;
ALTER TABLE public.plan_versions ADD COLUMN IF NOT EXISTS whatsapp_conversation_cap INTEGER;
ALTER TABLE public.plan_versions ADD COLUMN IF NOT EXISTS overage_rates             JSONB NOT NULL DEFAULT '{}'::JSONB;
ALTER TABLE public.plan_versions ADD COLUMN IF NOT EXISTS feature_flags             JSONB NOT NULL DEFAULT '{}'::JSONB;
ALTER TABLE public.plan_versions ADD COLUMN IF NOT EXISTS notes                     TEXT;

-- 5) Seed v1 tier levers — HOMELESS levers only (D20 defaults). Idempotent: only
--    when the tier has no version yet. No voice minutes, no prices (pricing_packages
--    owns those). WhatsApp cap left NULL (not included by default).
INSERT INTO public.plan_versions (
    plan_id, version, is_current,
    included_ai_conversations, whatsapp_conversation_cap,
    overage_rates, feature_flags, notes)
SELECT p.id, 1, true, d.ai, NULL::int, '{}'::jsonb, d.flags,
       'R2: D20 default tier levers (homeless levers only; voice+price stay in pricing_packages)'
FROM public.plans p
JOIN (VALUES
    ('base',       1000, '{"booking":false}'::jsonb),
    ('growth',     3000, '{"booking":true}'::jsonb),
    ('everything', 8000, '{"booking":true,"whatsapp-agent":true,"social-responder":true,"email-follow-up":true,"voice":true}'::jsonb)
  ) AS d(slug, ai, flags) ON d.slug = p.slug
WHERE p.is_tier
  AND NOT EXISTS (SELECT 1 FROM public.plan_versions pv WHERE pv.plan_id = p.id);
