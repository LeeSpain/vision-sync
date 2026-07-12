# Runbook — reconciliation R2 & R3 (Option A)

**Report/plan only.** Run **R2 first, confirm, then R3.** Staging-first (D21). Both are
idempotent + self-verifying (guarded for live drift) — verified on a deliberately drifted
local PG14. Nothing here is executed by Claude.

Prereq state (owner-confirmed live): `plans` = 0 rows, `plan_versions` = 0 rows,
`pricing_packages` = 24 (holds prices + voice_minutes — **not** touched here).

---

## R2 — seed the 3-tier catalogue + homeless tier levers
File: `supabase/migrations/20260712160000_r2_seed_tier_catalogue.sql`

What it does: adds any missing `plans` columns (`is_active`, `sort_order`, `is_tier`) + a
`slug` unique index; inserts **base / growth / everything**; adds any missing
`plan_versions` lever columns; seeds **v1** per tier with **AI conversations** (1000 / 3000 /
8000), empty overage, starter feature_flags, **notes**. **Does not set voice minutes or
prices** (those stay canonical in `pricing_packages`).

Run:
```sh
supabase db push        # applies R2 (and, once you proceed, R3)
# or paste the R2 file into the SQL editor
```

Verify:
```sql
select slug, is_tier from public.plans order by sort_order;            -- base, growth, everything
select p.slug, pv.version, pv.is_current,
       pv.included_ai_conversations, pv.included_voice_minutes          -- voice must be NULL
from public.plan_versions pv join public.plans p on p.id = pv.plan_id
order by p.sort_order;                                                  -- 3 rows, each v1/current, voice NULL
```

Rollback:
```sql
DELETE FROM public.plan_versions
 WHERE plan_id IN (SELECT id FROM public.plans WHERE slug IN ('base','growth','everything'));
DELETE FROM public.plans WHERE slug IN ('base','growth','everything');
-- optional: DROP INDEX IF EXISTS public.uniq_plans_slug;  ALTER TABLE public.plans DROP COLUMN IF EXISTS is_tier;
```

**→ Confirm R2 results before running R3.**

---

## R3 — mark `plans` price/limit columns DEPRECATED
File: `supabase/migrations/20260712160100_r3_deprecate_plans_price_columns.sql`

What it does: sets a DEPRECATED comment on each price/limit column **that exists** (guarded —
drifted/missing columns are skipped with a NOTICE, never an error). Non-destructive.

Verify:
```sql
select column_name, col_description(('public.plans')::regclass, ordinal_position) as comment
from information_schema.columns
where table_schema='public' and table_name='plans'
  and column_name in ('monthly_price','setup_fee','currency','max_conversations','max_contacts','max_agents')
order by column_name;   -- existing ones show the DEPRECATED note; missing ones simply won't appear
```

Rollback:
```sql
DO $$
DECLARE col text;
BEGIN
  FOREACH col IN ARRAY ARRAY['monthly_price','yearly_price','setup_fee','custom_price_label',
                             'currency','billing_cycle','max_agents','max_conversations','max_contacts'] LOOP
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_schema='public' AND table_name='plans' AND column_name=col) THEN
      EXECUTE format('COMMENT ON COLUMN public.plans.%I IS NULL', col);
    END IF;
  END LOOP;
END $$;
```

---

## After R2/R3
- **R4** (separate code PR): fix the merged D20 UI (#10) — `PlanVersionsManager` drops voice/price inputs, `PlansManager` reads the tier catalogue and is wired into the admin shell.
- **R5** (later, destructive): drop redundant `plan_versions.included_voice_minutes` / `price_points`.
- **R6**: after you paste §1.3 Query B, close wider drift + regenerate types.
