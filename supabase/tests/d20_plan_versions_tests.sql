-- ============================================================================
-- D20 (part 1) — plan_versions tests. Run AFTER the D20 migrations.
-- Transactional + non-destructive (ROLLBACK). Fails loud on any assertion.
--   psql "$SUPABASE_DB_URL" -f supabase/tests/d20_plan_versions_tests.sql
--
-- Asserts:
--   1. create_plan_version() bumps version and keeps exactly one is_current
--   2. the one-current-per-plan unique index is enforced
--   3. a non-admin authenticated user CANNOT read plan_versions (admin-only)
--   4. an admin CAN read plan_versions
--   5. a non-admin CANNOT insert into plan_versions
-- ============================================================================

BEGIN;

-- fixtures (as table-owner → RLS bypassed for setup)
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password,
                        email_confirmed_at, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333',
   'authenticated', 'authenticated', 'admin@test.local', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444',
   'authenticated', 'authenticated', 'client@test.local', '', now(), now(), now());
INSERT INTO public.profiles (id, email, role) VALUES
  ('33333333-3333-3333-3333-333333333333', 'admin@test.local', 'admin'),
  ('44444444-4444-4444-4444-444444444444', 'client@test.local', 'client');

INSERT INTO public.plans (id, name, slug, monthly_price, setup_fee, currency, max_conversations)
VALUES ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'D20 Test Plan', 'd20-test-plan', 249, 0, 'EUR', 1000);

-- === Test 1: versioning via create_plan_version() ===========================
DO $$
DECLARE
  v_max int; v_current int; v_cur_version int;
BEGIN
  PERFORM public.create_plan_version('cccccccc-cccc-cccc-cccc-cccccccccccc',
    '{"EUR":{"monthly":249}}'::jsonb, 1000, 0, NULL, '{}'::jsonb, '{"booking":false}'::jsonb, 'v1');
  PERFORM public.create_plan_version('cccccccc-cccc-cccc-cccc-cccccccccccc',
    '{"EUR":{"monthly":449}}'::jsonb, 3000, 0, NULL, '{}'::jsonb, '{"booking":true}'::jsonb, 'v2 raise price');

  SELECT max(version), count(*) FILTER (WHERE is_current)
    INTO v_max, v_current
    FROM public.plan_versions WHERE plan_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
  IF v_max <> 2 THEN RAISE EXCEPTION 'FAIL(1a): expected max version 2, got %', v_max; END IF;
  IF v_current <> 1 THEN RAISE EXCEPTION 'FAIL(1b): expected exactly 1 current, got %', v_current; END IF;

  SELECT version INTO v_cur_version FROM public.plan_versions
   WHERE plan_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc' AND is_current;
  IF v_cur_version <> 2 THEN RAISE EXCEPTION 'FAIL(1c): current should be v2, got v%', v_cur_version; END IF;
  RAISE NOTICE 'PASS(1): create_plan_version bumps version, one current = v2';
END $$;

-- === Test 2: one-current unique index ========================================
DO $$
BEGIN
  UPDATE public.plan_versions SET is_current = true
   WHERE plan_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc' AND version = 1;
  RAISE EXCEPTION 'FAIL(2): two current versions were allowed';
EXCEPTION
  WHEN unique_violation THEN
    RAISE NOTICE 'PASS(2): one-current-per-plan enforced (%).', SQLERRM;
END $$;

-- === Test 3 & 5: non-admin authenticated =====================================
RESET ROLE;
SELECT set_config('request.jwt.claims',
  '{"sub":"44444444-4444-4444-4444-444444444444","role":"authenticated"}', true);
SET LOCAL ROLE authenticated;

DO $$
DECLARE n int;
BEGIN
  SELECT count(*) INTO n FROM public.plan_versions
   WHERE plan_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
  IF n <> 0 THEN RAISE EXCEPTION 'FAIL(3): non-admin read % plan_versions rows, expected 0', n; END IF;
  RAISE NOTICE 'PASS(3): non-admin cannot read plan_versions';
END $$;

DO $$
BEGIN
  INSERT INTO public.plan_versions (plan_id, version, price_points)
  VALUES ('cccccccc-cccc-cccc-cccc-cccccccccccc', 99, '{}'::jsonb);
  RAISE EXCEPTION 'FAIL(5): non-admin INSERT into plan_versions was allowed';
EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE NOTICE 'PASS(5): non-admin INSERT into plan_versions denied (%).', SQLERRM;
END $$;

-- === Test 4: admin authenticated =============================================
RESET ROLE;
SELECT set_config('request.jwt.claims',
  '{"sub":"33333333-3333-3333-3333-333333333333","role":"authenticated"}', true);
SET LOCAL ROLE authenticated;

DO $$
DECLARE n int;
BEGIN
  SELECT count(*) INTO n FROM public.plan_versions
   WHERE plan_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
  IF n <> 2 THEN RAISE EXCEPTION 'FAIL(4): admin should read 2 rows, got %', n; END IF;
  RAISE NOTICE 'PASS(4): admin can read plan_versions';
END $$;

RESET ROLE;
DO $$ BEGIN RAISE NOTICE 'ALL D20 plan_versions TESTS PASSED'; END $$;

ROLLBACK;
