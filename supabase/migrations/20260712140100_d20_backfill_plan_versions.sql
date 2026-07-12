-- ============================================================================
-- D20 (part 1/2) — backfill: give every existing plan a version 1.
--
-- Data-driven from the live plans columns so no hard-coded plan slugs are
-- assumed. Idempotent: only inserts a v1 for plans that have no version yet,
-- so re-runs (and later admin edits) are never clobbered.
-- ============================================================================

INSERT INTO public.plan_versions (
    plan_id, version, is_current,
    price_points, included_ai_conversations, included_voice_minutes,
    whatsapp_conversation_cap, overage_rates, feature_flags, notes)
SELECT
    p.id,
    1,
    true,
    jsonb_build_object(
      COALESCE(p.currency, 'EUR'),
      jsonb_build_object('monthly', p.monthly_price, 'setup', p.setup_fee)
    ),
    COALESCE(p.max_conversations, 1000),   -- sensible D20 default when unset
    0,                                     -- voice minutes: admin tunes upward per tier
    NULL,                                  -- whatsapp cap: not included by default
    '{}'::jsonb,                           -- overage rates: admin sets
    '{}'::jsonb,                           -- feature flags: admin sets per tier
    'Auto-backfilled v1 from existing plan columns (D20 migration).'
FROM public.plans p
WHERE NOT EXISTS (
    SELECT 1 FROM public.plan_versions pv WHERE pv.plan_id = p.id
);
