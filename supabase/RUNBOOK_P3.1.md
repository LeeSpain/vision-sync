# Runbook — P3.1 Tenant Factory schema

**Task:** P3.1 (BLUEPRINT §2.3). Adds the 9 factory tables + RLS + seed data.
**Nature:** Purely additive — no existing table is altered. Safe under the visual freeze (no UI/site change).
**Who runs this:** Lee, via `supabase db push` (or the SQL editor), staging/dev first per D21.

---

## What lands

Four new numbered migrations (apply in this order — timestamps already enforce it):

| File | Creates |
|------|---------|
| `20260712120000_p31_catalog.sql`   | `is_admin()` helper · `industry_packs` · `nodes` (+RLS, triggers) |
| `20260712120100_p31_tenants.sql`   | `tenants` · `owns_tenant()` helper · `tenant_configs` (versioned) · `tenant_nodes` (+RLS) |
| `20260712120200_p31_workflow.sql`  | `provisioning_jobs` · `agent_test_runs` · `change_requests` · `signoffs` (+RLS) |
| `20260712120300_p31_seed.sql`      | Seeds 9 nodes + 3 pilot industry packs (D17) |

All migrations are idempotent (`IF NOT EXISTS` / `OR REPLACE` / `DROP POLICY IF EXISTS`), so a re-run is safe.

**RLS model**
- **Admin (`profiles.role = 'admin'`)** — full access to every table.
- **Tenant owner** — read their own `tenants` row and all child rows scoped by `owns_tenant()`; may open `change_requests` and add `signoffs` (append-only); may update their own tenant row. Cannot see or touch another tenant.
- **`nodes`** — public read of active rows (catalogue feeds the builder); admin write.
- **`industry_packs`** — **admin-only** (they carry the agent prompt template + gate test-suite). A public presentation-only projection is deferred to the builder (P2.5).

---

## 1. Apply the migrations

```sh
git fetch origin
git checkout p3/p3.1-tenant-factory-schema

# Point the CLI at STAGING/DEV first (D21 — staging-first).
supabase db push
```

Expect four new migrations applied and no errors. (Or paste each file into the SQL editor in the order above.)

## 2. Sanity-check the objects

```sql
-- 9 tables present
select table_name from information_schema.tables
where table_schema = 'public'
  and table_name in ('tenants','tenant_configs','industry_packs','nodes',
                     'tenant_nodes','provisioning_jobs','agent_test_runs',
                     'change_requests','signoffs')
order by table_name;                     -- expect 9 rows

-- RLS enabled on all 9
select relname, relrowsecurity from pg_class
where relname in ('tenants','tenant_configs','industry_packs','nodes',
                  'tenant_nodes','provisioning_jobs','agent_test_runs',
                  'change_requests','signoffs');   -- relrowsecurity = t for all

-- Seeds
select count(*) from public.nodes;               -- expect 9
select slug, is_pilot from public.industry_packs order by sort_order;  -- 3 pilots
```

## 3. Run the RLS negative tests

```sh
psql "$SUPABASE_DB_URL" -f supabase/tests/p31_rls_negative_tests.sql
```
(or paste `supabase/tests/p31_rls_negative_tests.sql` into the SQL editor.)

**Expected output** — six `PASS(n)` notices then `ALL P3.1 RLS NEGATIVE TESTS PASSED`, and the transaction rolls back (no rows left behind). Any RLS hole raises a `FAIL(n)` exception and aborts. The critical assertion is **PASS(4): owner A cannot read tenant B**.

> Note: the script switches to the `anon` / `authenticated` roles internally — RLS is not enforced for the table-owner `postgres` role, so running the raw `SELECT`s as postgres would (correctly) see everything.

## 4. Promote to production

Only after staging passes: repeat step 1 against the production project (still additive, still safe). PITR/backups remain deferred to the P3.0 dedicated-Pro-org migration (D32).

---

## Rollback note (D21)

Purely additive, so rollback = drop the new objects (FK-safe order). Run only if you need to fully revert:

```sql
BEGIN;
DROP TABLE IF EXISTS public.signoffs           CASCADE;
DROP TABLE IF EXISTS public.change_requests    CASCADE;
DROP TABLE IF EXISTS public.agent_test_runs    CASCADE;
DROP TABLE IF EXISTS public.provisioning_jobs  CASCADE;
DROP TABLE IF EXISTS public.tenant_nodes       CASCADE;
DROP TABLE IF EXISTS public.tenant_configs     CASCADE;
DROP TABLE IF EXISTS public.tenants            CASCADE;
DROP TABLE IF EXISTS public.nodes              CASCADE;
DROP TABLE IF EXISTS public.industry_packs     CASCADE;
DROP FUNCTION IF EXISTS public.owns_tenant(uuid);
DROP FUNCTION IF EXISTS public.is_admin();
-- NB: update_updated_at_column() is shared with pre-existing tables — do NOT drop it.
COMMIT;
```

No existing table, row, or policy is touched by this task, so there is nothing else to undo.
