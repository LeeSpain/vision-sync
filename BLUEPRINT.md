# 🏭 BLUEPRINT.md — Vision-Sync: The Tenant Factory

> **The master execution document.** Supersedes ad-hoc planning. Companions: DESIGN.md, UI_SYSTEM.md, PAGE_STANDARD.md, PRICING_PACKAGES.md, CLAUDE.md.
> Rule of engagement: every build session executes against this document. Changes to strategy get written here first, then built.
> Owner: Lee Spain · Directed by: Claude (Fable) · Status: **v3.1 — 32 decisions · build-ready**
> Last updated: July 2026

---

## 0. THE ONE-PARAGRAPH VISION

Vision-Sync becomes a self-selling, self-provisioning AI platform. A visitor lands on the site and is met by the product itself: a live AI agent that interviews them, assembles their industry package with selectable nodes in front of their eyes, takes payment, and **provisions their entire working platform automatically** — branded microsite on their subdomain, trained AI agent, dashboard, notifications — gated only by a 15-minute owner approval from Lee's phone. Lee runs the company by talking to the Brain agent, not by building client sites.

---

## 1. DECISIONS OF RECORD (all confirmed by owner)

| # | Decision | Ruling |
|---|----------|--------|
| D1 | Dead template-shop code | **DELETE** (Phase 0) |
| D2 | Booking/calendar dashboard visibility | **Growth tier and above** (update PRICING_PACKAGES.md — assumption resolved) |
| D3 | Payments / deposits feature | **Priced add-on, €49/mo**, available on Growth + Everything only. Client uses own Stripe; Vision-Sync fee covers setup + support. Not bundled in Everything. (PRICING_PACKAGES.md assumption resolved) |
| D4 | Build model | **Option B: one multi-tenant platform, config per client.** Never per-client codebases. |
| D5 | Client domains at launch | **Subdomains** (`clientname.vision-sync.co`), auto-provisioned. Custom domain = later premium add-on. |
| D6 | Automation level at launch | **95% + owner approval gate.** Every provisioned tenant's agent passes a test conversation reviewed by Lee before go-live. Gate dials toward full-auto as industry packs prove themselves. |
| D7 | Display font | Replace Poppins with a characterful display face. Final pick presented visually during Phase 1 (2–3 candidates rendered on the real homepage, Lee picks in one look). Inter stays for body. |
| D8 | Sales dashboard | Split into its own lazy-loaded bundle in Phase 3 (public site must not carry 980K of admin code). Separate repo = future decision, not now. |
| D9 | Direction | **100% the live/real version.** No conventional-brochure fallback. |
| D10 | Market | **Worldwide from day one.** Costa Blanca positioning retired. Agent speaks any language (LLM-native); site UI ships EN/ES, more locales by demand. Wedge: "your business never sleeps, your customers are everywhere." |
| D11 | Front door | **"Inside the Machine"** — full-viewport cinematic canvas: dense purple dot-planet (~2,600 pts, emerald sparks, atmosphere halo, starfield, mouse parallax), live lead arcs, scroll-driven camera through 6 chapters (thesis → 02:47 Tokyo → kill switch → assembly → tiers → the ask). Persistent "skip → pricing" escape hatch; reduced-motion fallback. Production upgrades: real continent geometry with city-anchored arcs, agent genuinely answering in-scene, working mic input, full grading/polish pass (own workstream). |
| D12 | Two-register design | Dark cinematic register = landing + film moments. Light "quiet luxury" register (DESIGN.md / UI_SYSTEM.md, Bricolage Grotesque display + Inter body) = all working surfaces: builder, dashboards, industry pages, quote portal. One gradient signature + one type system binds both. |
| D13 | Currency | €/$/£ at launch, geo-detected, **set price points per currency** (not live FX math). Stripe Tax replaces the hardcoded ex-IVA/+21% assumption. |
| D14 | SEO architecture | Canvas landing is JS-heavy → SEO weight is carried by server-rendered light-register pages (industries, platform, pricing) + a structured content layer beneath the canvas. Build requirement, not afterthought. |
| D15 | Domains | Lee owns vision-sync.com AND .co. Ruling: **.co stays canonical** (live SEO equity, all docs unified on it); .com gets a permanent 301 redirect to .co. No further canonical churn. |
| D16 | Billing entity | Existing entity/setup continues for now; Stripe + Stripe Tax configured against it in P3 (entity details collected then). Formal review before scaling past ~50 tenants. |
| D17 | Launch industries (8) | Hair & Beauty · Dental & Clinics · Holiday Rentals & Property · Restaurants & Hospitality · Trades & Home Services · Fitness & Wellness · Real Estate Agencies · Legal & Professional Services. **Factory pilots: Hair & Beauty, Holiday Rentals, Trades** (highest missed-call cost, appointment-driven, worldwide-universal). |
| D18 | Go-live SLA | **"Live within 24 hours"** promised publicly. Gate mechanics to honor it: mobile one-tap approval; at T+20h unapproved, Brain runs the extended test-suite and pings Lee with a pass/fail summary; SLA clock shown on the client's thank-you screen. |
| D19 | Commercial model — LEASE, DON'T SELL | Platforms remain **Vision-Sync property, leased monthly**. Outright purchase **by application only** (reviewed case-by-case). Refunds: **14-day money-back** on the first payment if the client isn't satisfied; thereafter cancel anytime with 30 days' notice; no long contracts. This ownership language goes into Terms, checkout, and the agent's training. |
| D20 | Unit economics = admin-controlled | All levers editable by Lee in admin (extends existing PlansManager/PricingManager): prices per currency, included AI conversations, voice minutes, WhatsApp caps, overage rates, per-tier feature flags. Claude ships sensible defaults (e.g. Base 1,000 AI conversations/mo · Growth 3,000 + booking · Everything 8,000 + 200 voice min); Lee tunes live without deploys. Changing a lever versions the plan; existing tenants keep their version until notified. |
| D21 | Live-revenue safeguard | Any current clients/production traffic are protected structurally: staging-first deploys, feature-flagged cutovers, no destructive DB migration on live tables without a rollback script. Applies from Phase 0 onward regardless of what exists today. |
| D22 | Client Portal (full lifecycle) | Every tenant's dashboard is a full **working relationship surface**, not just stats: live assembly progress, sandbox review + client sign-off, change requests, invoices/billing, node store, status page. Spec in §9. |
| D23 | Change-request & sign-off workflow | Two-lane system. **Lane 1 — facts (self-serve, instant):** hours, prices, services, FAQs — client tells their own AI in the portal, TenantConfig updates, agent retrains, done, logged. **Lane 2 — structural (request → quote → sign-off):** design, new nodes, new pages — client requests (chat or form), AI drafts scope + price, Lee approves the quote, client signs off in-portal, work applies, client confirms completion. Both lanes fully audit-logged via the ai_drafts/ai_actions pattern. Sign-off is always in-portal with a timestamped record — no "but you said on WhatsApp" disputes. |
| D24 | Admin consolidation scope | The 55-component admin is audited in P3 into **Mission Control**: keep + extend (PlansManager, PricingManager, LeadsManager, AiAgentManager, BrainAgentDashboard, analytics, QuotesManager) · merge duplicates (Enhanced* vs base variants collapse to one each) · kill template-era managers with the P0 amputation · new panels (Tenants, Provisioning queue/gate, Change-request queue, Industry-pack editor). One sidebar, one design language, split bundle per D8. **Product/shop note (owner ruling):** the orphaned `ProductCatalogManager` is a fossil of the pre-pivot single-site shop — nothing is sold on the live site today. Do **NOT** wire it up; **log it for deletion in this D24 audit**. "Products/services" is **not** a central admin surface — it is **reborn as a per-tenant Node in P3**, managed by each client in their own portal via their **TenantConfig** and fed to their agent (see §2.2 Node concept). |
| D25 | Legacy project pages | **DELETED (owner ruling).** NurseSync / TetherBand / AiSpainHomes / GlobalHealthSync / ConneqtCentral / ForSale and the whole project-showcase system go: DynamicProjectPage/Detail, project-template components, ProjectCard variants, ProjectManager admin modals, projectManager.ts, generate-project-images edge function, related i18n keys and DB project rows. Old URLs get 301 redirects to / (or the matching industry page) so inbound links don't 404. Joins the Phase 0 amputation list. |

---

## 2. TARGET ARCHITECTURE

### 2.1 The shape

```
                    ┌─────────────────────────────────────────┐
                    │   PUBLIC SITE (vision-sync.co)          │
                    │   Living homepage = Conversational      │
                    │   Builder = intake front-end            │
                    └───────────────┬─────────────────────────┘
                                    │ outputs TenantConfig (JSON)
                                    ▼
                    ┌─────────────────────────────────────────┐
                    │   PROVISIONING PIPELINE (edge functions)│
                    │   payment ✓ → assemble → test → GATE →  │
                    │   go live                               │
                    └───────────────┬─────────────────────────┘
                                    ▼
   ┌────────────────────────────────────────────────────────────────┐
   │  MULTI-TENANT RUNTIME (one codebase, one deploy)               │
   │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
   │  │ maria-salon. │ │ costa-mech.  │ │ villa-clean. │  ...      │
   │  │ vision-sync. │ │ vision-sync. │ │ vision-sync. │           │
   │  │ co           │ │ co           │ │ co           │           │
   │  └──────────────┘ └──────────────┘ └──────────────┘           │
   │  Each = TenantConfig + IndustryPack + selected Nodes           │
   └────────────────────────────────┬───────────────────────────────┘
                                    ▼
                    ┌─────────────────────────────────────────┐
                    │   AI OPS LAYER (Brain agent = COO)      │
                    │   digests · flags · renewals · churn    │
                    │   Lee's chat window = mission control   │
                    └─────────────────────────────────────────┘
```

### 2.2 Core concepts

**TenantConfig** — the single JSON artifact that IS a client. Branding tokens (name, logo, colors mapped onto the DESIGN.md HSL system), industry pack ID, selected node IDs, business facts (hours, services, prices, service area, languages), tier, add-ons, subdomain, status. The conversational builder produces it; the runtime renders from it; the agent is instantiated from it. **One artifact, three consumers — never duplicated.**

**IndustryPack** — one per industry (8 at launch, per PRICING_PACKAGES.md). Contains: default microsite section layout, EN+ES copy templates with merge fields, agent system-prompt template, default node set per tier, onboarding interview script (the questions the builder AI asks), and the agent test-suite (the questions the approval gate runs). Packs live in the DB, editable from admin — **new industries become content work, not code work.**

**Node** — a sellable capability unit: Booking, Lead Qualifier, CRM Sync, Review Manager, WhatsApp Agent, Social Responder, Email Follow-Up, Voice, **Payments (add-on, €49/mo, Growth+)**. Each node = feature flag + config schema + agent capability + dashboard panel. The existing ModulePicker concept graduates into this. Tier pricing per PRICING_PACKAGES.md stays canonical; nodes map onto tiers exactly as §3 of that file defines.

### 2.3 What exists vs. what's new (from the audit)

| Capability | Status in repo today | Blueprint action |
|---|---|---|
| Agent system (ai-chat, ai-router, agent manager, prompts in DB) | ✅ Built | Reuse; add per-tenant instantiation |
| Quote portal (`/quote/:ref`) | ✅ Built, underused | Becomes the config handoff + payment step |
| Approval queue (`ai_drafts`), autonomy (`user_autonomy_settings`) | ✅ Schema exists | Becomes the provisioning gate |
| Onboarding tracking (`onboarding_progress`) | ✅ Schema exists | Drives builder interview state |
| Pricing wizard / ModulePicker | ✅ Built (form-style) | Rebuilt as the conversational builder; wizard logic reused as the config engine underneath |
| Lead capture + notifications (send-lead-notification fn) | ✅ Built | Reuse per-tenant |
| Admin (55 components) + Sales Dashboard | ✅ Built, heavy | Keep; split bundle (D8); Brain agent gets ops powers |
| Multi-tenant routing (subdomain → TenantConfig) | ❌ New | Phase 3 |
| TenantConfig schema + IndustryPack tables | ❌ New | Phase 3 |
| Provisioning pipeline edge function | ❌ New | Phase 3 |
| Conversational builder UI | ❌ New | Phase 2 |
| Agent test-suite runner (gate) | ❌ New | Phase 3 |
| Stripe payments (client-facing) | ❌ New | Phase 3 (Vision-Sync's own billing) / Payments node later |
| AI Ops daily digest | ❌ New (Brain agent exists) | Phase 4 |

New DB tables required: `tenants`, `tenant_configs` (versioned), `industry_packs`, `nodes`, `tenant_nodes`, `provisioning_jobs`, `agent_test_runs`. All follow CLAUDE.md rules (uuid/created_at/updated_at, RLS everywhere, new numbered migrations only).

---

## 3. PRICING RESOLUTION (write back into PRICING_PACKAGES.md in Phase 0)

1. §2 note: **"Booking/calendar visibility is a Growth feature"** — confirmed, remove ASSUMPTION flag. Base dashboard = leads + conversations, view-only.
2. §3 note: **Payments/deposits** — remove from Everything's implied scope. New section: **Add-ons** → "Take Payments & Deposits — €49/mo ex-VAT, available on Growth and Everything. Client's own Stripe account; fee covers integration, setup, and support." 
3. Everything tier copy stays "everything for automation" — the add-on is framed as *commerce plumbing*, not automation, so the tier promise stays honest.
4. Custom domain — add to Add-ons as "from €15/mo" placeholder, priced properly when built (post-launch).

---

## 4. THE PHASES

### PHASE 0 — Amputation & hygiene *(1 sprint · zero risk · do first)*

1. **Delete dead template-shop code AND the legacy project-showcase system (per D25)** (confirmed zero live imports): `EnhancedTemplatesShowcase`, `TemplateCard`, `TemplateCardAdapter`, `TemplateCategoryFilter(+Adapter)`, `TemplateCustomizationFlow`, `TemplateDetailModal`, `TemplateInquiryForm`, `ShopCard`, `FeaturedProjectsCarousel`, plus orphaned utils (`appTemplates.ts` if unreferenced after sweep), related admin managers if template-only, and the `ai-template-assistant` / `generate-template-image` edge functions if nothing calls them. Sweep imports after each deletion; `tsc --noEmit` must stay clean.
2. Fix the last `vision-sync.com` canonical straggler → `https://www.vision-sync.co`.
3. Close the 4-key EN/ES i18n gap (815 vs 811).
4. Rewrite README.md: kill Lovable boilerplate; describe the real project, stack, and this blueprint.
5. Apply §3 pricing edits to PRICING_PACKAGES.md.
6. Delete `PricingDataTest` route or gate it behind admin.

**Exit gate:** build green, bundle smaller, docs truthful. Lee review: 10 minutes.

### PHASE 1 — Finish the design system *(1–2 sprints)*

1. Display font decision (D7): render homepage hero with Poppins vs 2–3 candidates, Lee picks visually. Wire the winner through `font-heading` — one change, whole site.
2. Complete UI_SYSTEM migration on remaining pages (currently ~13 files on-system). Order per UI_SYSTEM §6: Platform → Solutions → Modules → Contact → Pricing → project pages → remainder.
3. Execute the kill list (rainbow borders, mixed eyebrows, stray dark panels) and the token map (no raw hex).
4. Page checklist from PAGE_STANDARD §7 run on every page; QA at 375px and 1440px.

**Exit gate:** every public page passes the checklist. The site is *consistent*. Lee review: visual walkthrough.

### PHASE 2 — The Conversational Builder *(2–3 sprints · the wow + the intake)*

The living homepage. One system, two jobs: impress visitors, produce TenantConfigs.

1. **Live agent hero.** Real agent (existing ai-chat/ai-router) replaces the faked hero-chat strings. Language auto-detect (i18next detector already installed). Opening move: identify industry in ≤2 questions.
2. **Live personalization.** On industry selection, the page reassembles: that industry's pack preview, tier pricing (from the canonical pricing data), a simulated booking flow *with the visitor's business name*, a mock WhatsApp lead-alert bearing their name. This is the "never seen" moment — their platform materializing while they talk.
3. **Builder conversation → TenantConfig.** The interview script comes from the IndustryPack. Node picking is visual (the ModulePicker reborn as tappable node cards inside the conversation). Output: a draft TenantConfig + a quote at `/quote/:ref` (existing portal, now carrying the config).
4. **Honest fallback:** a "just show me pricing" escape hatch to a classic tier view at every step — never trap a visitor in a chat.
5. Analytics on every builder step (existing analytics utils) so we learn where people drop.

**Exit gate:** a stranger can go from landing → configured quote link without human help. Lee review: full run-through as a fake client in EN and ES.

### PHASE 3 — The Factory *(3–4 sprints · the business transformation)*

1. **Schema:** the seven new tables (§2.3). Migrate the 8 industries' content into `industry_packs`.
2. **Multi-tenant runtime:** wildcard subdomain routing (`*.vision-sync.co` → Vercel wildcard + tenant resolver), microsite renderer that composes DESIGN.md-token sections from TenantConfig. Client branding = token overrides, never custom CSS.
3. **Vision-Sync billing:** Stripe for the 2-months-upfront + monthly model (this is *our* billing; the client-facing Payments node is a separate, later build).
4. **Provisioning pipeline** (edge function, idempotent, resumable): payment webhook → create tenant → render microsite → instantiate agent (pack prompt + business facts) → issue chat widget embed → wire owner notifications → run agent test-suite → **queue for Lee's approval** (ai_drafts pattern; approve/reject/fix from phone) → flip live → send client welcome + dashboard credentials.
5. **Client dashboard:** tenant-scoped view — leads + conversations (Base), + booking calendar (Growth per D2), + node panels per their config. Reuses admin components, tenant-scoped by RLS.
6. **Bundle split (D8):** admin + sales-dashboard lazy-loaded; public site ships lean.

**Exit gate:** one real pilot client per 2–3 industries provisioned end-to-end, live on subdomains, paying. Lee review: approve real tenants through the gate.

### PHASE 4 — AI Ops Layer *(2 sprints · Lee stops working IN the business)*

1. **Brain agent = COO.** Daily digest (new clients, provisioning queue, conversation volumes, flagged issues, renewals due). Query anything: "how is Maria's salon agent performing this week?"
2. **Quality watch:** low-confidence conversations (existing <0.7 flagging) surfaced per tenant; Brain drafts corrections to the tenant's agent facts → Lee approves → agent updated. **The gate dial:** per-industry auto-approve thresholds — when a pack's test-suite pass rate holds, that industry graduates to spot-check-only (D6 dial-down, driven by data, not vibes).
3. **Revenue ops:** renewal reminders, failed-payment chase drafts, churn-risk flags (usage drop), upsell prompts (Base client whose conversations keep hitting booking questions → Growth pitch, drafted for approval).

**Exit gate:** Lee runs a normal week touching only: approval gate, Brain chat, and sales conversations the AI booked.

---

## 5. BUILD ORDER & DEPENDENCIES

```
P0 ──► P1 ──► P2 ──────────► P3 ──► P4
              (builder UI)   (factory)
              needs P1's     needs P2's
              components     TenantConfig
```
No parallelization tricks at the start — P0 and P1 are fast and de-risk everything after. First real revenue impact lands at P2 (better conversion) ; the business model transforms at P3.

## 6. RISKS — NAMED, NOT BURIED

1. **Agent wrongness** is the existential risk (small market, word travels). Mitigations: approval gate (D6), per-pack test suites, low-confidence flagging, facts-only prompting (agent answers from TenantConfig facts; refuses/escalates beyond them).
2. **Scope creep in P2.** The builder must ship with 8 packs *as they exist in pricing*, not 8 perfect packs. Content polish is post-launch iteration in admin.
3. **Subdomain SEO:** client microsites should carry canonical + light structure so clients see value, but vision-sync.co remains the SEO asset. Custom domains later solve this properly for clients who care.
4. **The 69-migration schema** has legacy weight; new tables go in clean, old template-era tables get a deprecation audit in P3 (never edit old migrations, per CLAUDE.md).
5. **Lee as bottleneck at the gate:** acceptable at launch volume by design; P4's dial-down is the planned exit.

## 7. DEFINITION OF DONE (the whole program)

A Spanish-speaking salon owner in Almería lands on vision-sync.co at 22:00 on a Sunday. The agent greets her in Spanish, builds her package live, she picks her nodes, pays. By 22:20 Lee approves her agent from the sofa. At 22:25 her microsite is live at her subdomain, her AI answers her WhatsApp leads, and her welcome email is in her inbox. On Monday morning the Brain agent tells Lee it happened. **Nobody built anything.**

---

## 8. THE OPEN REGISTER — what we still need to know

> Direction is locked; these are the unknowns that decide whether the locked direction ships cleanly. Split by who answers. "Phase" = when it blocks.

### 8A — Only Lee can answer — ✅ ANSWERED, rulings promoted to D15–D21

| # | Question | Why it matters | Blocks |
|---|----------|----------------|--------|
| Q1 | **Name & domain worldwide.** Do you own vision-sync.com? Any trademark check done on "Vision-Sync" in US/UK/EU? Going global on .co without owning .com leaks traffic and invites squatters. | Brand risk | P1 |
| Q2 | **Billing entity & tax setup.** What legal entity invoices (Spanish SL? other)? Registered for Stripe worldwide payouts? Stripe Tax needs an entity + registrations decision. | Revenue can't flow without it | P3 |
| Q3 | **The 8 launch industries — final list.** PRICING_PACKAGES implies 8; confirm exactly which, and which 2–3 pilot the factory first. | Pack content work starts here | P2 |
| Q4 | **Existing clients/leads.** Are there current Costa Blanca clients or an active pipeline to migrate/protect during the revamp? | Don't break live revenue | P0 |
| Q5 | **Your availability window for the approval gate** (hours/days you'll realistically review new tenants) → sets the public "live within X hours" SLA. | Worldwide signups vs. one approver | P3 |
| Q6 | **Guarantee/refund posture.** Money-back window? Cancel-anytime? Deposit refundable? One paragraph from you becomes the Terms. | Checkout copy + Terms | P3 |
| Q7 | **Target margin per tenant.** What monthly cost per client are you comfortable with (LLM + voice + WhatsApp + infra) against €199 Base? Sets usage caps per tier. | Unit economics | P3 |

### 8B — My recommendations, need your yes/no

| # | Item | My call |
|---|------|---------|
| Q8 | LLM provider for tenant agents | Anthropic API, one mid-tier model for chat agents, with per-tenant monthly token budgets per tier; degrade gracefully to "leave a message" past cap. |
| Q9 | Voice stack | Buy, don't build: Twilio (numbers/telephony) + a realtime voice AI layer. Per-minute cost is why voice is tier-gated; include N minutes/tier, overage billed. |
| Q10 | WhatsApp node | Official Meta WhatsApp Business API via a BSP (e.g. Twilio). Requires per-client Meta business verification → onboarding step in provisioning, and per-conversation fees → passed through or capped per tier. This is the highest-friction node; flag in sales copy as "activates within days, not minutes." |
| Q11 | Machine-room feed honesty | Until real volume exists, the landing's live feed runs on demo tenants and is labelled "simulation" in the mono caption. We never fake real-client activity. Swaps to real (anonymized) events at ~10 live tenants. |
| Q12 | Trial mechanics | No free tier. Instead: the simulator + a full sandbox preview of *their* assembled platform pre-payment (they see it built, pay to switch it on). Loss aversion beats free trials here. |
| Q13 | Support model | AI-first support agent per tenant → escalation queue to Lee via Brain digest; public promise "human review within 1 business day." Revisit at 50 tenants. |
| Q14 | Uptime/SLA language | "99.9% target" phrasing without contractual SLA until infra is proven; contractual SLAs only on Everything tier later. |
| Q15 | Analytics | Keep in-house analytics tables + add one privacy-friendly product analytics tool for funnel drop-off on the film chapters (each chapter = a funnel step). |

### 8C — Known build unknowns (I resolve during phases, listed for transparency)

Continent point-geometry dataset for the planet (P2 grading pass) · SSR/prerender approach for D14 given the current Vite SPA (likely prerender + light-register static pages first, framework migration only if forced) · wildcard subdomain SSL + tenant resolver on Vercel (P3) · per-tenant RLS pattern for shared tables (P3) · agent test-suite format per industry pack (P3) · sound design on the film: my default is **no audio** (autoplay audio is hostile); revisit only if you disagree · legal pages (Terms, Privacy, DPA, AI-disclosure line per EU AI Act — chatbots must identify as AI; we do this proudly since the AI *is* the product) drafted in P3, reviewed by a human lawyer before first worldwide sale — that lawyer is a real cost line, budget for it.

---

---

## 9. THE CLIENT LIFECYCLE — end to end, both sides of the glass

> The complete process a client experiences, and what Lee sees at each step. This is the operating manual for D22/D23.

**1 · Discover** — lands on the film (D11). Watches their world call. Talks or types to the agent.
**2 · Build** — conversational builder produces their TenantConfig: industry pack + nodes + branding + business facts. Sees live price as nodes toggle.
**3 · Sandbox review** — their platform is assembled in preview (D12 light register): real microsite, real agent trained on their answers, test conversation they can have with it. Nothing is live; nothing is paid.
**4 · Client sign-off #1** — "This is my business, build it." In-portal approval, timestamped. Then payment (deposit + first month, D19 lease terms, 14-day guarantee shown plainly).
**5 · Assembly (watched live)** — provisioning page shows each node locking in (same theatre as the film's Chapter IV, now real). 24h SLA clock visible (D18).
**6 · Lee's gate** — agent test-suite runs; Lee approves from phone (T+20h Brain backstop). Client sees "final quality review by a human."
**7 · Live** — subdomain live, welcome email, portal credentials, agent answering.
**8 · Operate** — portal daily use: leads, conversations, bookings (Growth+), notifications. The client's own AI assistant lives in the portal and answers "how is my agent doing?"
**9 · Change** — Lane 1 facts: instant self-serve via their AI. Lane 2 structural: request → AI-drafted scope+price → Lee approves quote → client signs off → applied → client confirms. Every step visible in a "Requests" timeline (open / quoted / awaiting your sign-off / in progress / done).
**10 · Grow** — node store in-portal: add WhatsApp, Voice, Payments (+€49) with one click → prorated billing → auto-provisioned through the same gate.
**11 · Renew / leave / own** — monthly auto-renew; cancel anytime, 30-day notice, data export provided; "purchase your platform" = application form → Lee reviews (D19).

**Lee's mirror in Mission Control (D24):** provisioning gate queue · change-request queue (approve quotes, see sign-offs) · tenant health board · Brain daily digest covering all of the above. Lee's day = two queues and one conversation.

*This document is the constitution. Build sessions cite the phase and step they execute. Deviations get written here first.*
| D32 | Dedicated Supabase | Vision-Sync moves to its **own new Supabase organization on the Pro plan** — clean billing, no shared-org invoice risk, no free-tier pausing. Migration executed as **task P3.0** (before any paying tenant): new project → replay all migrations → migrate data → recreate secrets (ADMIN_EMAIL, ANTHROPIC_API_KEY, RESEND_API_KEY, ALLOWED_ORIGIN, FRONTEND_URL) → redeploy edge functions → repoint env vars in Vercel → verify → cut over in a low-traffic window with the old project kept read-only for 30 days as rollback. Until then, current project continues for build/dev. |
