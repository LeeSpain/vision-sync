# Runbook — D20 (part 1/2) plan versioning + lever data layer

**Task:** D20 (BLUEPRINT) — unit economics admin-controlled + plan versioning. **This PR is the data layer only** (part 1). The PlansManager/PricingManager UI to edit the levers is **part 2**, and depends on these migrations being live first (the managers read from Supabase).
**Nature:** Purely additive — no existing table altered. Admin-only, invisible to the public site (freeze holds).
**Order-independent:** does not require P3.1 to be applied first (it defensively re-defines the shared `is_admin()` / `update_updated_at_column()` helpers with identical bodies).

## What lands

| File | Effect |
|------|--------|
| `20260712140000_d20_plan_versions.sql` | `plan_versions` table (versioned levers) + RLS (admin-only) + trigger + `create_plan_version()` RPC |
| `20260712140100_d20_backfill_plan_versions.sql` | Gives every existing plan a `version 1` derived from its live columns |

**Levers captured per version:** `price_points` (per-currency set points, D13), `included_ai_conversations`, `included_voice_minutes`, `whatsapp_conversation_cap`, `overage_rates`, `feature_flags`, plus `notes` and `is_current`.

**Versioning:** call `select public.create_plan_version(plan_id, price_points, ai_convs, voice_min, wa_cap, overage, flags, notes)` — it demotes the current version and inserts the next (`version+1`, `is_current=true`). History is immutable, so tenants provisioned on an older version can stay pinned to it (the tenant→version link lands with P3.1's `tenant_configs`).

## 1. Apply (staging first, D21)

```sh
git fetch origin && git checkout p3/d20-plan-versioning-data-layer
supabase db push          # applies the two migrations
```

## 2. Verify

```sql
-- every plan has exactly one current version
select p.slug, count(pv.*) versions, count(*) filter (where pv.is_current) current
from public.plans p join public.plan_versions pv on pv.plan_id = p.id
group by p.slug;                              -- current = 1 for each

select relrowsecurity from pg_class where relname='plan_versions';   -- t
```

## 3. Tests

```sh
psql "$SUPABASE_DB_URL" -f supabase/tests/d20_plan_versions_tests.sql
```
Expect `PASS(1)`…`PASS(5)` then `ALL D20 plan_versions TESTS PASSED`, transaction rolls back. (Verified locally on PG14.)

## 4. Production

After staging passes, repeat step 1 against prod. Additive and safe.

---

## Rollback note (D21)

```sql
BEGIN;
DROP FUNCTION IF EXISTS public.create_plan_version(uuid, jsonb, integer, integer, integer, jsonb, jsonb, text);
DROP TABLE IF EXISTS public.plan_versions CASCADE;
-- Do NOT drop is_admin()/update_updated_at_column(): shared with other tables.
COMMIT;
```

No existing table, row, or policy is touched, so nothing else needs undoing.

## Next — D20 part 2 (UI)

Once these migrations are live: extend `PlansManager` (per-tier levers + "save = new version" + version history) and surface the caps/overages/flags in `PricingManager`, reading the `plan_versions` current row. Types are ready in `src/types/planVersion.ts`.
