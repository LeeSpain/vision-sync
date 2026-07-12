# 🛠 CLAUDE_CODE_PLAN.md — Vision-Sync Build Orders

> Execution plan for Claude Code sessions. **BLUEPRINT.md is law; this file is the work order.**
> Repo: github.com/LeeSpain/vision-sync · Stack: Vite + React + TS + Tailwind + shadcn + Supabase + Vercel
> Every session: read BLUEPRINT.md + this file first. Work top-down. Never skip a gate.

---

## SESSION PROTOCOL (every Claude Code session)

1. `git checkout -b <phase>/<task-id>-<slug>` — never commit to main.
2. Complete ONE task block per branch. Small PRs.
3. Before every commit: `npx tsc --noEmit` clean + `npm run build` succeeds.
4. Verify the task's acceptance criteria, then check the box in this file and commit the file change with the work.
5. Destructive changes (deletions, migrations): list what will be removed in the PR description BEFORE removing (D21).
6. Never edit old Supabase migrations; new numbered migrations only (CLAUDE.md rule).
7. All copy through i18n (en.json + es.json). No raw hex colors (DESIGN.md tokens only).

---

## PHASE 0 — AMPUTATION & HYGIENE

### P0.1 Delete the template-shop system (D1)
Remove components: `EnhancedTemplatesShowcase`, `TemplateCard`, `TemplateCardAdapter`, `TemplateCategoryFilter`, `TemplateCategoryFilterAdapter`, `TemplateCustomizationFlow`, `TemplateDetailModal`, `TemplateInquiryForm`, `ShopCard`, `FeaturedProjectsCarousel`. Remove `src/utils/appTemplates.ts`, `useTemplates.ts` if orphaned, template-only admin managers (`CurrencyAwareTemplateManager`, `EnhancedTemplateCreationModal`, `IndustryTemplateBuilder/Selector` IF template-shop-scoped — verify imports first), edge functions `ai-template-assistant`, `generate-template-image` if uncalled.
✅ Accept: `grep -ri "template" src/` returns only legitimate hits (industry packs later reuse the word); tsc clean; build ok.

**Status (done — owner's visual-freeze scope: "zero live imports, invisible"):**
- [x] Deleted 12 zero-live-import dead-island files (public appearance unchanged; tsc + build green):
  `EnhancedTemplatesShowcase`, `TemplateCard`, `TemplateCardAdapter`, `TemplateCategoryFilter`, `TemplateCategoryFilterAdapter`, `TemplateCustomizationFlow`, `TemplateDetailModal`, `TemplateInquiryForm`, `ShopCard`, `FeaturedProjectsCarousel`, `admin/IndustryTemplateBuilder`, and orphaned hook `hooks/useTemplates.ts`.
- **KEPT (live imports → deferred to D24 Mission Control consolidation, build-order step 7):** `CurrencyAwareTemplateManager` (← Admin.tsx), `EnhancedTemplateCreationModal` + `IndustryTemplateSelector` (← admin TemplateManager chain), `TemplateManager`, `TemplateCreationModal`, `TemplateEditModal`, `TemplateAnalytics`, `TemplatePreviewModal`, `BulkImageGenerator`.
- **KEPT `src/utils/appTemplates.ts`** — still referenced by the live admin modals above ("delete if unreferenced after sweep" — it isn't).
- **KEPT edge fns `ai-template-assistant`, `generate-template-image`** — still invoked by live admin modals ("delete if uncalled" — they are called).

### P0.2 Delete the legacy project-showcase system (D25)
Remove: `DynamicProjectPage`, `DynamicProjectDetail`, `src/components/project-template/`, `ProjectCard`, `ProfessionalProjectCard`, `FeaturedProjectCard`, `ProjectInquiryForm`, `ProjectCreationModal`, `ProjectEditModal`, `EnhancedProjectCreationModal/EditModal`, `ProjectManager` admin, `src/utils/projectManager.ts`, edge fn `generate-project-images`, `/:projectRoute` route in App.tsx, related i18n keys. Add `vercel.json` 301 redirects: each old project slug → `/` (or matching industry page).
✅ Accept: no dead imports; redirects tested; tsc clean.

### P0.3 Canonical + i18n + README
Fix last `vision-sync.com` canonical → `https://www.vision-sync.co`. Close the 4-key en/es gap (compare key trees programmatically). Rewrite README.md: real project description, stack, link to BLUEPRINT.md; remove Lovable boilerplate. Delete or admin-gate `/pricing-data-test` and `/ui-system` routes.
✅ Accept: one canonical domain repo-wide; key counts equal; README truthful.

**Status (partial — done under owner's standing order, visual freeze in force):**
- [x] Canonical straggler fixed: `ai-chat` `FRONTEND_URL` fallback `.com` → `.co`. (All site canonicals/OG/structured-data already on `.co`.)
- [x] EN/ES i18n gap closed — exact key-tree parity (787/787): added 7 live ES `salesDashboard.overview` pipeline keys; removed 15 dead orphan `salesDashboard.quotes.*` keys (6 EN-only + 9 ES-only, zero code refs).
- [x] README.md rewritten — Lovable boilerplate removed; real project/stack/blueprint links.
- [x] Extra: `.claude/` added to `.gitignore`.
- [ ] `/pricing-data-test` + `/ui-system` route gating — **DEFERRED** (visual freeze; touches visible routes).
- Not touched (visible copy, freeze): `DemoGenerator.tsx` mock chrome string `preview.vision-sync.com/demo/temp-xyz`.

### P0.4 Pricing doc edits (D2, D3, D19)
Update PRICING_PACKAGES.md: booking visibility = Growth (remove ASSUMPTION); Payments = add-on €49/mo Growth+ (remove from Everything scope); add Add-ons section (Payments, custom domain placeholder); add D19 lease/own-by-application + 14-day guarantee language.
✅ Accept: zero ASSUMPTION flags remain.

**Status (done — docs-only, no visible-site impact):**
- [x] §2 booking/calendar visibility confirmed **Growth (D2)**, ASSUMPTION flag removed; Base dashboard = leads + conversations, view-only.
- [x] §3 Payments/deposits removed from Everything scope, ASSUMPTION flag removed; note keeps "everything for *automation*" promise honest.
- [x] New **§4 Add-ons**: Take Payments & Deposits €49/mo Growth+ (own Stripe, D3); Custom domain from €15/mo placeholder (D5).
- [x] New **§5 Commercial terms (D19)**: lease-don't-sell, 14-day money-back on first payment, cancel anytime 30-day notice, purchase-by-application.
- [x] §8 agent quoting rules extended to cover the add-on pricing + lease/guarantee terms; sections renumbered (per-industry→§6, data-shape→§7, agent→§8).
- Verify: `grep -ni assumption` → 0; tsc clean (docs-only, build unaffected).

### P0.5 CI + environments (D31, D21)
GitHub Actions: on PR → `tsc --noEmit`, `npm run build`. Protect main. Confirm Vercel preview deploys. Document staging strategy in README. Enable Supabase PITR (manual dashboard step — write instruction for Lee).
✅ Accept: a failing typecheck blocks merge.

**Status (done):**
- [x] GitHub Actions CI `.github/workflows/ci.yml`: on PR→main + push→main runs `npm ci` → `npx tsc --noEmit` → `npm run build` (Node 22, npm cache, concurrency-cancel). Green on the real runner (PR #6, ~31s) and locally (all three steps exit 0).
- [x] README "Environments, CI & deployment" section: prod (`main`→Vercel prod), per-PR Vercel Preview = staging (D21), Supabase backend note, secrets location.
- [x] Vercel preview deploys confirmed (per-PR preview passed on PR #6).
- [x] **Branch protection on `main`** requires the `typecheck + build` status check (`strict: false`, `enforce_admins: false`). Owner elected to **make the repo public** to unlock protection on GitHub Free. Acceptance met — a failing typecheck blocks merge.
- **PITR — formally deferred to P3.0 (D32)** per owner amendment: current project is Free tier (PITR unavailable); enabled during the dedicated Pro-org migration at P3.0. Documented in README.

**PHASE 0 GATE:** Lee 10-min review — site works, corpse gone, bundle smaller.

---

## PHASE 1 — DESIGN SYSTEM COMPLETION (light register)

### P1.1 Display font swap (D7)
Add `@fontsource/bricolage-grotesque` (weights 500/600/700); replace Poppins in tailwind.config `font-heading`; remove Poppins dep; verify all heading weights render; update DESIGN.md.
✅ Accept: no Poppins anywhere; headings render Bricolage at 375px + 1440px.

### P1.2 UI-system migration (UI_SYSTEM.md §6 order)
Migrate remaining pages onto `src/components/ui-system/` components: Platform → SolutionsIndex → Solutions → Modules → Contact → Pricing → QuotePortal. Per page: hero via canonical PAGE_STANDARD §1, sections via §2, run PAGE_STANDARD §7 checklist, execute kill list (rainbow borders, mixed eyebrows, stray dark panels), token map (§3) — zero raw hex.
✅ Accept: every public page passes the §7 checklist; screenshots at 375/1440 in PR.

### P1.3 Worldwide copy pass (D10)
Remove Costa Blanca/expat positioning from all i18n strings; new wedge copy ("your business never sleeps..."); keep EN/ES parity.
✅ Accept: `grep -ri "costa\|expat" src/` clean.

**PHASE 1 GATE:** Lee visual walkthrough. Consistent, worldwide, new type live.

---

## PHASE 2 — THE FILM + THE BUILDER (front door)

### P2.1 Film foundation (D11)
New route `/` replaces Index: full-viewport canvas engine (raw canvas 2D as prototyped — no three.js unless perf demands). Port the approved v2 prototype (`vision-sync-inside-the-machine-v2.html`): dot-planet (~2,600 pts, emerald sparks, atmosphere, starfield, parallax), arcs, scroll-camera, 6 chapters, dot-rail nav, escape hatch, reduced-motion static fallback, device-tier fallback (low-end mobile → lighter scene, poster if needed). Performance budget: 60fps desktop / 30fps mid mobile; LCP < 2.5s.
✅ Accept: prototype parity + budgets met (Lighthouse in PR).

### P2.2 Continent geometry + grading pass (D11)
Bake a coastline/city point dataset (public GeoJSON → point grid script in `scripts/`); arcs anchor to real cities; color-grade pass (contrast, glow discipline, type sizes) against Lee review.
✅ Accept: Earth recognizable; Tokyo arc lands on Tokyo.

### P2.3 SEO/content layer (D14)
Server-renderable content under the canvas: semantic HTML of all chapter copy + structured data; prerender light-register pages (industries, platform, pricing) — evaluate `vite-plugin-ssr`/prerender vs static generation, choose simplest that ships.
✅ Accept: view-source shows full copy; Search Console-valid structured data.

### P2.4 Live agent in Chapter I/VI (D26)
Wire existing `ai-chat`/`ai-router` into the film's input; language auto-detect; rate limits per D26 (IP + session caps, email capture after ~6 messages → lead record via `supabaseLeadManager`); daily spend ceiling env var with fallback copy.
✅ Accept: real agent replies in-scene; limits proven by test script.

### P2.5 Conversational builder (Act II → TenantConfig)
Builder flow in light register: industry select → pack interview questions → node toggles with live price (reads canonical pricing data / usePricing) → outputs draft `TenantConfig` JSON → stored → quote at `/quote/:ref` (existing QuotePortal extended to render config summary). Escape hatch to classic pricing at every step. Chapter-level analytics events (D15/Q15) on every step.
✅ Accept: stranger test — landing → configured quote link, EN and ES, no help.

### P2.6 Mic input
Web Speech API (or provider) for the film inputs; graceful hide when unsupported.
✅ Accept: speak "hair salon" → builder starts.

**PHASE 2 GATE:** Lee runs full journey as fake client on phone + desktop.

---

## PHASE 3 — THE FACTORY

### P3.1 Schema (new migrations)
Tables: `tenants`, `tenant_configs` (versioned), `industry_packs`, `nodes`, `tenant_nodes`, `provisioning_jobs`, `agent_test_runs`, `change_requests`, `signoffs`. RLS on all; tenant-scoped policies; seed `nodes` from PRICING_PACKAGES; seed 8 `industry_packs` (D17) — pilots first: Hair & Beauty, Holiday Rentals, Trades.
✅ Accept: RLS proven by negative tests (tenant A cannot read tenant B).

**Status (done — drafting mode; purely additive, verified on a local PG14 cluster; awaits owner `supabase db push`):**
- [x] 4 numbered migrations (all 9 tables + RLS + triggers): `20260712120000_p31_catalog` (is_admin() · industry_packs · nodes), `..0100_p31_tenants` (tenants · owns_tenant() · tenant_configs versioned · tenant_nodes), `..0200_p31_workflow` (provisioning_jobs · agent_test_runs · change_requests · signoffs), `..0300_p31_seed`.
- [x] RLS on all 9 (9/9 verified): admin full; tenant-owner scoped via `owns_tenant()`; nodes public-read active; industry_packs admin-only (sensitive prompt/test-suite — public projection deferred to P2.5).
- [x] Seeds: 9 nodes (PRICING §3/§4) + 3 pilot packs (D17: hair-beauty, holiday-rentals, trades) with EN/ES copy, interview scripts, test-suites, per-tier default_nodes. (Full 8 packs = content work, post-P3.1.)
- [x] RLS negative tests `supabase/tests/p31_rls_negative_tests.sql` — **all 6 PASS incl. tenant-A-cannot-read-tenant-B**; ran end-to-end on a throwaway PG14 cluster (Supabase-shimmed). Idempotent re-run + rollback snippet also verified.
- [x] Runbook `supabase/RUNBOOK_P3.1.md` (apply → verify → negative tests → rollback note, D21).
- **Note:** Supabase MCP not authorized this session → owner runs `supabase db push` on staging-first (D21), then prod. Purely additive: zero existing tables/rows/policies touched.

### P3.2 Multi-tenant runtime
Vercel wildcard `*.vision-sync.co` + tenant resolver; microsite renderer composing light-register sections from TenantConfig (branding = token overrides only); tenant chat widget embed issuing.
✅ Accept: two seeded tenants render distinctly on their subdomains.

### P3.3 Vision-Sync billing (D13, D16, D19)
Stripe: products per tier per currency (set price points), deposit + first month at checkout, subscriptions, Stripe Tax, Radar (D27), webhooks → provisioning trigger; dunning emails (D30); 14-day guarantee refund path; cancellation (30-day) flow; "purchase by application" form → Lee queue.
✅ Accept: test-mode end-to-end payment → provisioning fires; tax calculated for 3 test countries.

### P3.4 Provisioning pipeline + gate (D6, D18, D27)
Idempotent edge function state machine: payment ✓ → create tenant → render site → instantiate agent (pack prompt + facts) → widget + notifications → run pack test-suite → queue approval (ai_drafts pattern; abuse checklist D27) → Lee one-tap approve/reject/fix (mobile) → live → welcome email + magic-link credentials (D28, D30). T+20h Brain backstop; SLA clock surfaced to client (24h, D18).
✅ Accept: kill the function mid-run → resumes; full run < 10 min excluding gate.

### P3.5 Client Portal (D22, D23, §9)
Tenant dashboard: assembly progress (live), sandbox review + sign-off #1, leads/conversations (Base), bookings (Growth+), Requests timeline (Lane 1 facts via portal AI → TenantConfig update + agent retrain, logged; Lane 2 structural → AI-drafted scope+price → Lee quote approval → client in-portal sign-off → applied → confirm), node store (one-click add → prorated billing → gate), invoices, data export, cancel flow.
✅ Accept: full §9 lifecycle walked by a test tenant; every sign-off timestamped in `signoffs`.

### P3.6 Mission Control consolidation (D24) + bundle split (D8)
Admin audit: merge Enhanced*/base duplicates; new panels (Tenants, Gate queue, Change-request queue, Pack editor, cost-per-tenant dashboard D29); plans/pricing levers editable + plan versioning (D20); lazy-load admin + sales-dashboard chunks.
✅ Accept: public-site JS bundle contains zero admin code (verify with bundle analyzer).

### P3.7 Hardening (D26–D31 residue)
Sentry front+edge; tenant health checks + alerts; LLM fallback copy; Resend/Postmark integration + template set (D30); provisioning integration tests in CI; retention job (24-mo conversations); legal pages (Terms w/ lease+AUP+guarantee, Privacy, DPA, AI-disclosure) drafted → LEE: human lawyer review before first sale.
✅ Accept: forced agent failure alerts Lee; test email suite renders EN/ES.

**PHASE 3 GATE:** 1 real pilot client per pilot industry — paid, gated, live on subdomain within 24h.

---

## PHASE 4 — AI OPS (Brain = COO)

### P4.1 Daily digest + query
Brain agent: morning digest (new tenants, gate queue, request queue, flagged convos, renewals, cost anomalies); natural-language queries over tenant data.
### P4.2 Quality loop + gate dial
Low-confidence (<0.7) conversations surfaced per tenant; Brain drafts fact corrections → Lee approves → agent updated. Per-industry auto-approve thresholds from test-suite pass rates (D6 dial-down).
### P4.3 Revenue ops
Renewal reminders, dunning escalation drafts, churn-risk flags (usage drop), upsell drafts (Base hitting booking questions → Growth pitch) — all approval-first.
✅ Accept (phase): Lee runs a normal week touching only two queues + Brain chat.

---

## STANDING GUARDRAILS
- BLUEPRINT.md D-numbers are cited in every PR description.
- No feature ships without EN + ES strings.
- No new page without PAGE_STANDARD §7 checklist.
- No migration without rollback note.
- When in doubt: smaller PR, ask Lee at the phase gate, never mid-sprint scope creep.

*v1 · July 2026 · derived from BLUEPRINT.md v3 (31 decisions). Update this file as tasks complete.*
