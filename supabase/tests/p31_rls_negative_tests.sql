-- ============================================================================
-- P3.1 — RLS negative tests (run AFTER the P3.1 migrations are applied)
--
-- Proves tenant isolation and catalogue exposure rules. Self-contained and
-- non-destructive: everything runs inside a transaction that ROLLBACKs, so it
-- leaves no rows behind (including the temp auth.users).
--
-- HOW TO RUN
--   Supabase SQL editor (runs as the postgres role), or:
--     psql "$SUPABASE_DB_URL" -f supabase/tests/p31_rls_negative_tests.sql
--
-- WHAT IT ASSERTS
--   1. anon can read active nodes (public catalogue)
--   2. anon CANNOT read industry_packs (admin-only; sensitive templates)
--   3. tenant owner A can read their own tenant
--   4. tenant owner A CANNOT read tenant B          <-- the core isolation test
--   5. tenant owner A CANNOT read tenant B's tenant_configs
--   6. a non-admin authenticated user CANNOT INSERT into nodes (admin write)
--
-- A failure RAISEs EXCEPTION (loud, aborts). All-pass prints NOTICEs then rolls
-- back. RLS is only enforced for non-owner roles, so each check switches to
-- anon/authenticated first (the postgres role owns the tables and bypasses RLS).
-- ============================================================================

BEGIN;

-- --- fixtures (created as postgres → RLS bypassed for setup) -----------------
-- Two throwaway auth users.
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password,
                        email_confirmed_at, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
   'authenticated', 'authenticated', 'owner-a@test.local', '', now(), now(), now()),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222',
   'authenticated', 'authenticated', 'owner-b@test.local', '', now(), now(), now());

-- One active node (public catalogue) and one admin-only pack.
INSERT INTO public.nodes (slug, name, is_active)
VALUES ('rls-test-node', 'RLS Test Node', true);

INSERT INTO public.industry_packs (slug, name, status, is_pilot)
VALUES ('rls-test-pack', 'RLS Test Pack', 'published', false);

-- Two tenants owned by the two users, + a config on tenant B.
INSERT INTO public.tenants (id, owner_id, name, subdomain, tier, status)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111',
   'Tenant A', 'rls-tenant-a', 'base', 'live'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222',
   'Tenant B', 'rls-tenant-b', 'base', 'live');

INSERT INTO public.tenant_configs (tenant_id, version, config, is_active)
VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 1, '{"secret":"B-only"}'::jsonb, true);

-- === Test 1 & 2: anon ========================================================
RESET ROLE;
SELECT set_config('request.jwt.claims', '{"role":"anon"}', true);
SET LOCAL ROLE anon;

DO $$
DECLARE
  n_nodes integer;
  n_packs integer;
BEGIN
  SELECT count(*) INTO n_nodes FROM public.nodes WHERE slug = 'rls-test-node';
  IF n_nodes <> 1 THEN
    RAISE EXCEPTION 'FAIL(1): anon should read active node, saw % rows', n_nodes;
  END IF;
  RAISE NOTICE 'PASS(1): anon can read active nodes';

  SELECT count(*) INTO n_packs FROM public.industry_packs;
  IF n_packs <> 0 THEN
    RAISE EXCEPTION 'FAIL(2): anon should NOT read industry_packs, saw % rows', n_packs;
  END IF;
  RAISE NOTICE 'PASS(2): anon cannot read industry_packs';
END $$;

-- === Test 3, 4, 5, 6: authenticated as owner A ===============================
RESET ROLE;
SELECT set_config('request.jwt.claims',
  '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}', true);
SET LOCAL ROLE authenticated;

DO $$
DECLARE
  n_own    integer;
  n_other  integer;
  n_cfg    integer;
BEGIN
  SELECT count(*) INTO n_own FROM public.tenants
    WHERE id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  IF n_own <> 1 THEN
    RAISE EXCEPTION 'FAIL(3): owner A should read own tenant, saw % rows', n_own;
  END IF;
  RAISE NOTICE 'PASS(3): owner A can read own tenant';

  SELECT count(*) INTO n_other FROM public.tenants
    WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
  IF n_other <> 0 THEN
    RAISE EXCEPTION 'FAIL(4): owner A must NOT read tenant B, saw % rows', n_other;
  END IF;
  RAISE NOTICE 'PASS(4): owner A cannot read tenant B (isolation holds)';

  SELECT count(*) INTO n_cfg FROM public.tenant_configs
    WHERE tenant_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
  IF n_cfg <> 0 THEN
    RAISE EXCEPTION 'FAIL(5): owner A must NOT read tenant B configs, saw % rows', n_cfg;
  END IF;
  RAISE NOTICE 'PASS(5): owner A cannot read tenant B configs';
END $$;

-- Test 6: non-admin write to the catalogue must be denied.
DO $$
BEGIN
  INSERT INTO public.nodes (slug, name) VALUES ('rls-test-illegal', 'nope');
  -- If we get here, RLS did NOT block the write.
  RAISE EXCEPTION 'FAIL(6): non-admin INSERT into nodes was allowed';
EXCEPTION
  WHEN insufficient_privilege THEN
    RAISE NOTICE 'PASS(6): non-admin INSERT into nodes denied (%).', SQLERRM;
END $$;

RESET ROLE;

DO $$ BEGIN RAISE NOTICE 'ALL P3.1 RLS NEGATIVE TESTS PASSED'; END $$;

ROLLBACK;
