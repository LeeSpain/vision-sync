# 🔎 SCHEMA_AUDIT.md — schema-drift + pricing-architecture audit

> **Report mode — no schema or code changes.** Deliverable of the owner-directed audit
> after live-DB inspection revealed the `plans` table is empty and the D20 UI reads it.
> Owner rules on the pricing architecture (§2) before any reconciliation (§3) executes.
> Drafted: July 2026. Companions: BLUEPRINT.md (D13/D20), PRICING_PACKAGES.md, MISSION_CONTROL_AUDIT.md.

Legend: ✅ verified · ⚠️ drift/mismatch · ❓ needs live-DB confirmation (SQL provided in §1.3).

---

## 0. TL;DR

- The **live site's pricing is canonical in `pricing_industries` + `pricing_packages`** (draft/publish), read by `usePricing` → `src/lib/pricing.ts`, with a static `src/data/industries.ts` fallback. The AI agent, `QuotePortal`, and `PricingManager` all use this system.
- The **`plans` table is vestigial**: read/written **only** by `PlansManager` (admin), used by nothing on the site, the agent, edge functions, or scripts — and it is **empty**.
- **D20 attached versioning to the wrong table.** `plan_versions` FKs to `plans`; `PlanVersionsManager`/`PlansManager` read `plans` (empty) → the D20 levers/versioning UI has nothing to show and the backfill found 0 rows.
- **Known drift:** `plans.currency` / `plans.max_conversations` existed in migration `20260312000001_extend_plans_for_admin` but were **absent live** until manually added to unblock the D20 backfill — proof the migration history and the live DB have diverged. §1 scopes how far.
- **Recommendation (owner rules):** keep `pricing_packages`/`pricing_industries` canonical for **prices**; repurpose `plans` as the **3-row tier catalogue** (base/growth/everything) that carries the **tier-level economic levers** + `plan_versions`. Prices stay in PricingManager; levers move to PlansManager. See §2.4.

---

## 1. Drift audit

### 1.1 Tables the code queries
From a sweep of `.from('…')` in `src/` (count = call sites). Grouped by role:

**Canonical / live-critical**
`pricing_industries` (5) · `pricing_packages` (5) · `plans` (5, admin-only, **empty**) · `industries` (7) · `modules` (7) · `solutions` (4) · `page_sections` (5) · `site_settings` (2) · `profiles` (5)

**Agent / CRM / ops (live)**
`leads` (30) · `quotes` (16) · `ai_agents` (12) · `ai_conversations` (11) · `agent_routing_rules` (8) · `human_escalations` (5) · `conversion_tracking` (5) · `page_analytics` (5) · `ai_training_data` (4) · `performance_metrics` (3) · `ai_agent_settings` (3) · `deals` (2) · `deal_activities` (1) · `sales_payments` (1) · `routing_rule_analytics` (1) · `ai_agent_templates` (1) · `agent_conversations` (1)

**Legacy (template/project era — slated for deletion, D1/D25)**
`app_templates` (14) · `projects` (17) · `demo_templates` (1) · `template_questionnaire_responses` (2) · `app_finance` (1) · `app_events` (1) · `app_daily_metrics` (1)

**New (P3.1 / D20 — live per owner, verified)** — not queried on `main` yet (the consuming code, D20 PR #10, is unmerged): `tenants`, `tenant_configs`, `industry_packs`, `nodes`, `tenant_nodes`, `provisioning_jobs`, `agent_test_runs`, `change_requests`, `signoffs`, `plan_versions`.

**RPCs the code calls:** `increment_project_leads` (legacy), `publish_pricing_industry` (pricing), and `create_plan_version` (D20, on the unmerged #10 branch).

### 1.2 Expected columns (from code) for the pricing-critical tables
The columns the code will break without. Diff these against live (§1.3).

**`plans`** — expected by `PlansManager` (`DbPlanRow`):
`id, name, slug, monthly_price, yearly_price, setup_fee, custom_price_label, description, features(jsonb), is_active, sort_order, billing_cycle, currency⚠️, color, badge, max_agents, max_conversations⚠️, max_contacts, is_popular`
(⚠️ `currency`, `max_conversations` = the columns confirmed to have drifted / been manually added.)

**`plan_versions`** (D20) — expected by `usePlanVersions`:
`id, plan_id→plans.id, version, is_current, price_points(jsonb), included_ai_conversations, included_voice_minutes, whatsapp_conversation_cap, overage_rates(jsonb), feature_flags(jsonb), notes, created_by, created_at, updated_at`

**`pricing_industries`** — read `id, slug, name, core_service_line, color, sort_order, is_published`; PricingManager also reads `voice_native, has_draft_changes`.

**`pricing_packages`** — read `id, industry_id, tier, name, ex_vat_price, inc_vat_price, voice_minutes, tagline, includes(jsonb), sort_order`; PricingManager also reads/writes `has_draft, draft_name, draft_ex_vat_price, draft_inc_vat_price, draft_voice_minutes, draft_tagline, draft_includes`.

### 1.3 Inspection SQL (please run read-only; paste results)

**Query A — existence + row counts of every table (spot missing/empty):**
```sql
select relname as table_name, n_live_tup as est_rows
from pg_stat_user_tables
where schemaname = 'public'
order by relname;
```

**Query B — full column list for every code-referenced table:**
```sql
select table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
  and table_name in (
    'plans','plan_versions','pricing_industries','pricing_packages',
    'industries','modules','solutions','page_sections','site_settings','profiles',
    'leads','quotes','ai_agents','ai_conversations','agent_routing_rules',
    'human_escalations','conversion_tracking','page_analytics','ai_training_data',
    'performance_metrics','ai_agent_settings','deals','deal_activities','sales_payments',
    'routing_rule_analytics','ai_agent_templates','agent_conversations',
    'app_templates','projects','demo_templates','template_questionnaire_responses',
    'app_finance','app_events','app_daily_metrics',
    'tenants','tenant_configs','industry_packs','nodes','tenant_nodes',
    'provisioning_jobs','agent_test_runs','change_requests','signoffs'
  )
order by table_name, ordinal_position;
```

**Query C — exact counts for the pricing-critical four:**
```sql
select 'plans' t, count(*) n from public.plans
union all select 'plan_versions', count(*) from public.plan_versions
union all select 'pricing_industries', count(*) from public.pricing_industries
union all select 'pricing_industries (published)', count(*) from public.pricing_industries where is_published
union all select 'pricing_packages', count(*) from public.pricing_packages;
```

**How we read the results:** any table in §1.1 **absent** from Query A = missing (code will 400/`relation does not exist`). Any column in §1.2 absent from Query B for that table = drift (code will read `undefined`/error). Query C confirms the empty-`plans` / populated-`pricing_*` split.

### 1.4 Drift already known (no SQL needed)
| # | Finding | Impact |
|---|---------|--------|
| ⚠️1 | `plans` is empty | PlansManager + D20 UI show nothing; D20 backfill inserted 0 rows |
| ⚠️2 | `plans.currency`, `plans.max_conversations` were missing live until manually added | Migration `20260312000001` ≠ live → migration history is not a reliable mirror of the live DB; §1.3 Query B measures the full gap |
| ⚠️3 | `plan_versions.plan_id` FKs to an empty `plans` | Versioning cannot attach to real pricing until §2 is resolved |
| ❓4 | types.ts (`src/integrations/supabase/types.ts`) is a generated snapshot; may itself lag live | Treat as secondary; Query B (live) is ground truth |

---

## 2. Pricing-architecture map

### 2.1 The two systems
| | `plans` | `pricing_industries` + `pricing_packages` |
|---|---|---|
| **Holds** | Generic SaaS plan rows (name, monthly_price, currency, max_* limits, features) | Per-industry pricing: 8 industries × 3 tiers, ex/inc-VAT, voice minutes, includes, draft/publish |
| **Shape** | Flat, tier-agnostic, single-currency per row | Industry × tier matrix, published + draft columns |
| **Written by** | `PlansManager` (admin) only | `PricingManager` (admin) — edits `draft_*`, publishes via `publish_pricing_industry` RPC |
| **Read by** | `PlansManager` only | `usePricing`→`lib/pricing.ts` (public: Index, Pricing, Solutions, SolutionsIndex), `QuotePortal`, agent pricing knowledge |
| **Live site uses it?** | **No** | **Yes — this is what visitors, quotes, and the agent see** |
| **Populated?** | **Empty** | Populated (confirm counts via §1.3 Query C) |

### 2.2 What the live site actually uses
`usePricing()` → `getPricingWithFallback()` → `fetchPublishedPricing()` reads `pricing_industries (is_published=true)` + `pricing_packages`, mapping to `Industry[]`; if the DB errors or is empty it serves the static `src/data/industries.ts` fallback. **`plans` is never on this path.** PRICING_PACKAGES.md (the canonical doc) is modelled on the industry×tier matrix, matching `pricing_packages` — not `plans`.

### 2.3 Where D20's levers belong
D20's levers are of two kinds:
- **Prices per currency (D13)** — already canonical in `pricing_packages` (per industry×tier). Duplicating them onto `plans`/`plan_versions` would create a second source of truth. ⚠️
- **Tier-level usage levers** (included AI conversations, voice minutes, WhatsApp cap, overage rates, per-tier feature flags) — these are **per-tier and industry-agnostic** (PRICING_PACKAGES §3: "consistent across all 8 industries"). They have **no home today** — `pricing_packages` is per-industry, and `plans` is empty.

So the levers legitimately need a **tier-level** home; prices must stay in `pricing_packages`.

### 2.4 Recommendation (owner rules)
**Option A (recommended): `pricing_packages` canonical for prices; `plans` becomes the 3-row tier catalogue for levers.**
- Populate `plans` with exactly 3 rows: `base`, `growth`, `everything` (tier catalogue; **not** per-industry, **not** a price source).
- Keep `plan_versions` FK'd to `plans`; it versions the **tier-level levers** only. Remove price duplication concerns by treating `pricing_packages` as the sole price source; `plan_versions.price_points` becomes optional/advisory or is dropped in reconciliation.
- PlansManager (D20 UI) edits **tier levers + versioning**; PricingManager keeps editing **per-industry prices**. Two managers, two clear jobs.
- **Pros:** least churn (plan_versions already built on plans; D20 UI mostly stands once plans has 3 rows + is mounted per the D24 audit). Clean separation of concerns.
- **Cons:** `plans`' price/limit columns (monthly_price, max_conversations, etc.) become partly redundant — reconciliation should mark them deprecated to avoid a second price source.

**Option B: make `pricing_packages` fully canonical; retire `plans`; move levers onto a new `pricing_tiers` table (or tier columns).**
- **Pros:** single pricing system; no vestigial `plans`.
- **Cons:** more work — new table + re-point `plan_versions` + rewrite D20 UI. Higher churn for the same end state as A.

**Option C: adopt `plans` as the full canonical pricing source; migrate the site off `pricing_packages`.**
- **Not recommended:** contradicts the live site, agent, and quote portal, which all read `pricing_packages`; highest risk, no upside.

**My call: Option A.** It matches what's already live, gives the tier-level levers a correct home, and keeps the D20 work mostly intact (once `plans` has its 3 tier rows and PlansManager is mounted — see MISSION_CONTROL_AUDIT §1A).

---

## 3. Reconciliation plan (proposed — nothing runs until owner rules §2)

Ordered; each step is one PR/SQL with a rollback. Assumes **Option A**. Staging-first (D21).

**R0 — Measure (this report).** Run §1.3 A/B/C, paste results; finalize the drift table. *Rollback: n/a (read-only).*

**R1 — Decide (owner).** Rule on §2 (A/B/C). Blocks R2+. *Rollback: n/a.*

**R2 — Seed the tier catalogue (if Option A).** Migration inserting 3 `plans` rows (base/growth/everything) with sensible D20 lever defaults; then `create_plan_version` v1 per tier. SQL migration + idempotent `ON CONFLICT (slug) DO NOTHING`. *Rollback: `delete from plan_versions where plan_id in (select id from plans where slug in (...)); delete from plans where slug in ('base','growth','everything');`*

**R3 — Deprecate the price/limit columns on `plans`.** No drop (additive-safe); add `COMMENT ON COLUMN` marking `monthly_price`/`currency`/`max_*` as deprecated-in-favour-of `pricing_packages` + `plan_versions`. Optionally hide them in PlansManager. *Rollback: revert the comments/UI PR.*

**R4 — Re-home the D20 UI (PR).** After MISSION_CONTROL_AUDIT's "re-wire PlansManager" step: PlansManager shows the 3 tiers; PlanVersionsManager edits levers only (prices read-only, sourced from `pricing_packages`). *Rollback: revert the PR (admin-only, no data change).*

**R5 — Optional: retire the `plan_versions.price_points` column** if prices stay solely in `pricing_packages`. New migration `ALTER TABLE ... DROP COLUMN price_points` **only after** confirming no reader depends on it. *Rollback: re-add the column (jsonb, default '{}').* ⚠️ destructive — do last, with a backup.

**R6 — Close the wider drift.** Using §1.3 Query B results, file one migration per remaining live-vs-migration mismatch on **kept** tables (ignore legacy tables headed for deletion). Regenerate `src/integrations/supabase/types.ts` from live so code, types, and DB agree. *Rollback: per-migration notes.*

> Legacy tables (`app_templates`, `projects`, `demo_templates`, …) are intentionally excluded from drift-fixing — they are slated for deletion under D1/D25 (P0.2 freeze-deferred). Don't invest in reconciling tables we plan to drop.

---

## 4. What I need from you
1. Run §1.3 (A, B, C) and paste results — I'll complete the exact drift table and finalize R6's migration list.
2. Rule on §2 (recommend **Option A**).
3. Confirm the D20 build should be **re-homed per R4**.

---

## 5. UPDATE (post live inspection) — precise lever→home column map

**Live ground truth (owner-confirmed):** `pricing_packages` = **24 rows** (8×3), healthy, columns incl. `ex_vat_price, inc_vat_price, voice_minutes, tagline, includes`. `pricing_industries` = **8 rows** healthy. `plans` = **0**, `plan_versions` = **0** (the D20 bug). `nodes` = 9, `industry_packs` = 3.
**Ruling: Option A APPROVED.** **#10 authoritative status: MERGED** (merged_at 2026-07-12 17:12) — the buggy D20 UI is **already on `main`** reading empty `plans`; R4 fixes merged code (not a pending PR).

### 5.1 Column map — which D20 levers already have a home
| D20 lever | Already in `pricing_packages`? | Granularity | Homeless? | Canonical home (Option A) |
|-----------|-------------------------------|-------------|-----------|---------------------------|
| Price ex/inc VAT (EUR) | **Yes** (`ex_vat_price`,`inc_vat_price`) | per industry×tier | No | **`pricing_packages`** — do not duplicate |
| Multi-currency prices (USD/GBP, D13) | No (EUR only) | — | Future | Deferred to D13/P3.3 — **not** in tier catalogue now |
| Voice minutes | **Yes** (`voice_minutes`) | per industry×tier | No | **`pricing_packages`** — do not duplicate |
| Included AI conversations | No | tier-level | **Yes** | **`plans`+`plan_versions`** |
| WhatsApp cap | No | tier-level | **Yes** | **`plans`+`plan_versions`** |
| Overage rates | No | tier-level | **Yes** | **`plans`+`plan_versions`** |
| Feature flags (structured booleans) | Partial — `includes` (jsonb) is a per-package *display* list | per industry×tier | Overlap → owner call | `includes` stays for display; `plan_versions.feature_flags` only if tier-level *capability gating* is wanted. See 5.3 |
| Versioning history | No (pricing has draft/publish, not history) | — | **Yes** | **`plan_versions`** |

### 5.2 Consequence — redundant D20 columns
`plan_versions.included_voice_minutes` and `plan_versions.price_points` (from the original D20 migration) **duplicate** `pricing_packages` and must **not** be populated. R2 leaves them NULL/empty; **R5** drops them after R4 confirms no reader.

### 5.3 RULING (owner) — KEEP tier-level `feature_flags`
`plan_versions.feature_flags` is **retained as capability gating** — it enforces which nodes/behaviors a tier may access and connects to the `nodes`/`tenant_nodes` system. It is **distinct** from `pricing_packages.includes` (customer-facing "what's included" display list) and from per-tenant `tenant_nodes` (a tenant's actual enabled set). **R5 must NOT drop `feature_flags`.** R2's seeded flags are the starting capability matrix per tier.

---

## 6. REVISED reconciliation plan (supersedes §3 for R2/R4/R5)

Report/plan only. Owner runs each R-step and confirms before the next. All migrations idempotent + `IF NOT EXISTS`-guarded — **verified on a deliberately drifted local PG14** (`plans` missing `currency`/`max_conversations`/`is_active`/`sort_order`; a `plan_versions` column dropped → R2 re-added missing columns, seeded 3 tiers + 3 v1 versions with **voice NULL**; R3 skipped drifted columns without error; re-run idempotent; rollback clean).

| R | Step | Artifact | Rollback |
|---|------|----------|----------|
| R0 | Measure | §1.3 A done (counts); **B (full column dump) still needed for R6** | n/a |
| R1 | Decide | Option A approved | n/a |
| **R2** | Seed `plans` 3-tier catalogue + `plan_versions` v1 **homeless levers only** (AI conversations, overage, feature_flags; WhatsApp cap NULL; **no voice, no price**) | `20260712160000_r2_seed_tier_catalogue.sql` (this PR) | `DELETE FROM plan_versions WHERE plan_id IN (SELECT id FROM plans WHERE slug IN ('base','growth','everything')); DELETE FROM plans WHERE slug IN ('base','growth','everything');` |
| **R3** | Mark `plans` price/limit columns DEPRECATED (guarded COMMENTs) | `20260712160100_r3_deprecate_plans_price_columns.sql` (this PR) | re-run with `IS NULL` comments, or revert PR |
| **R4** | **Fix the merged D20 UI (#10):** `PlanVersionsManager` drops voice-minutes + price inputs (those live in PricingManager/`pricing_packages`); keeps AI conversations, WhatsApp cap, overage, feature flags, versioning. `PlansManager` reads the 3-row tier catalogue **and is wired into the admin shell** (it is orphaned — MISSION_CONTROL_AUDIT §1A). | code PR (after R2 live) | revert PR (admin-only) |
| **R5** | Drop **only** the redundant `plan_versions.included_voice_minutes` + `price_points` once R4 confirms no reader. **KEEP `feature_flags`** (§5.3 ruling). | migration (destructive — backup first) | re-add the 2 columns (`integer` / `jsonb default '{}'`) |
| **R6** | **FINALIZED against Query B (owner-run): no drift found in the pricing tables** (`pricing_packages`/`pricing_industries` match code + draft/publish mirror intact; `plan_versions` matches). So R6 carries **no pricing-table migration**. Remaining R6 scope: (a) one guarded no-op reconciliation migration that formalizes the earlier out-of-band `plans.currency`/`max_conversations` additions into migration history (`ADD COLUMN IF NOT EXISTS`, so history ↔ live agree); (b) regenerate `src/integrations/supabase/types.ts` from live so code/types/DB agree. | migration + types regen | per-migration; types = revert file |

**Standing task (added):** *migration-history ↔ live-schema reconciliation.* The live DB has drifted from `supabase/migrations/*` (proven: `plans.currency`/`max_conversations`). Establish a checked-in live-schema baseline + a CI drift check so future migrations don't assume a schema the live DB lacks. Tracked in CLAUDE_CODE_PLAN.md STANDING GUARDRAILS.

### Status of the asks (all resolved)
1. ✅ **Query B run** — no drift in pricing tables; R6 finalized above (no pricing migration).
2. ✅ **R2 approved** — owner runs it from `RUNBOOK_R2_R3.md`, pastes results; R3 handed over only after R2 is confirmed.
3. ✅ **§5.3 ruled** — `feature_flags` KEPT as capability gating (see 5.3); R5 does not drop it.
