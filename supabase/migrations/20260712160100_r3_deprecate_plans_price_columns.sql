-- ============================================================================
-- R3 (SCHEMA_AUDIT reconciliation · Option A) — mark the price/limit columns on
-- `plans` DEPRECATED. Under Option A, prices are canonical in pricing_packages
-- and usage levers live in plan_versions; these `plans` columns must not be
-- read as a canonical source. Non-destructive: comments only (no drop).
--
-- SELF-VERIFYING (owner directive): COMMENT ON COLUMN errors on a missing
-- column, so each is guarded by an information_schema existence check. Drift
-- (a column that never made it live) is skipped, not fatal. Idempotent.
-- ============================================================================

DO $$
DECLARE
    col  TEXT;
    note CONSTANT TEXT :=
      'DEPRECATED (Option A / SCHEMA_AUDIT R3): prices are canonical in pricing_packages; '
      || 'usage levers live in plan_versions. Do not read this column as a pricing source.';
BEGIN
    FOREACH col IN ARRAY ARRAY[
        'monthly_price', 'yearly_price', 'setup_fee', 'custom_price_label',
        'currency', 'billing_cycle', 'max_agents', 'max_conversations', 'max_contacts'
    ] LOOP
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'plans' AND column_name = col
        ) THEN
            EXECUTE format('COMMENT ON COLUMN public.plans.%I IS %L', col, note);
            RAISE NOTICE 'R3: marked plans.% deprecated', col;
        ELSE
            RAISE NOTICE 'R3: plans.% absent (drift) — skipped', col;
        END IF;
    END LOOP;
END $$;
