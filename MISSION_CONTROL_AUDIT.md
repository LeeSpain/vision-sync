# 🛠 MISSION_CONTROL_AUDIT.md — D24 admin consolidation (scoping)

> **D24 scoping deliverable — drafting mode.** This is a *plan*, not a refactor: no admin
> component is moved, merged, or deleted by this document. Admin-only surface; the public
> site is untouched (visual freeze holds). Execution happens in P3.6, gated per phase.
> Companions: BLUEPRINT.md (D24, D8, D25, D1), CLAUDE_CODE_PLAN.md (P3.6).
> Owner: Lee · Drafted: July 2026

---

## 0. Snapshot

- **54** components in `src/components/admin/`.
- **25** are rendered directly by `src/pages/Admin.tsx` (the current admin shell); the rest are child modals/widgets or orphans.
- Target (BLUEPRINT D24): one **Mission Control** — one sidebar, one design language, split bundle (D8) — that **keeps + extends** the real managers, **merges** Enhanced*/base duplicates, **kills** template/project-era managers, and adds **new factory panels**.

### ⚠️ Headline findings

1. **`PlansManager` is orphaned.** Nothing renders it (no import anywhere except a doc comment). It is a *keeper* (D20 lives here) but is currently disconnected from the admin shell — **it must be re-wired into the sidebar**. Consequence: the **D20 part-2 levers/versioning UI (PR #10) is not reachable in the running admin until PlansManager is mounted.** This is the first D24 wiring task.
2. **Duplicate managers are both live.** `Admin.tsx` renders **both** `LeadsManager` *and* `EnhancedLeadsManager` (lines 453 & 459) on different views — a classic Enhanced/base duplication to collapse to one.
3. **`ProductCatalogManager` is a confirmed orphan** (zero references anywhere) → delete (owner ruling; "products/services" reborn as a per-tenant Node in P3, per D24 note in BLUEPRINT).

---

## 1. Classification

### 1A · KEEP + EXTEND (the real managers)
Wired and part of the target admin. Extend, don't rebuild.

| Component | Note |
|-----------|------|
| `PricingManager` | Keep. Per-industry pricing (draft/publish). |
| `PlansManager` | Keep + **re-wire (orphaned today)**. Hosts D20 levers/versioning (#10). |
| `LeadsManager` **or** `EnhancedLeadsManager` | Keep **one** (see §2). |
| `AiAgentManager`, `BrainAgentDashboard`, `AgentTestingPanel` | Keep (agent system). |
| `QuotesManager`, `QuoteGenerator` | Keep (quote → config handoff, P2/P3). |
| `ConversationsManager`, `MessagesManager` | Keep. |
| `IndustryManager`, `SolutionsManager`, `PageSectionsManager` | Keep (content). |
| `SettingsManager`, `RoutingRulesManager`, `SkillsManager`, `SalesTeamManager` | Keep. |
| Dashboard widgets: `DashboardStats`, `RealTimeAnalytics`, `RecentActivity`, `TodaySummary`, `WelcomeSection`, `ActionQueue`, `LeadSourceChart`, analytics charts | Keep; regroup under one dashboard. |

### 1B · MERGE (Enhanced* vs base duplicates → one each)
| Enhanced | Base | Both live? | Ruling |
|----------|------|-----------|--------|
| `EnhancedLeadsManager` | `LeadsManager` | **Yes — both rendered** | Pick the superset, delete the other; single "Leads" view. |
| `EnhancedProjectCreationModal` | `ProjectCreationModal` | project-era | Both **die** with the project-showcase kill (see 1C). |
| `EnhancedProjectEditModal` | `ProjectEditModal` | project-era | Both die. |
| `EnhancedTemplateCreationModal` | `TemplateCreationModal` | template-era | Both die. |
| `EnhancedLeadForm` | *(no base)* | — | Fold into the merged Leads view or keep as its form. |

### 1C · KILL (dead-era managers)
**Template-era (D1 / D24 — the P0.1 admin remainder):** `CurrencyAwareTemplateManager` (wired), `TemplateManager`, `TemplateCreationModal`, `TemplateEditModal`, `EnhancedTemplateCreationModal`, `TemplateAnalytics`, `TemplatePreviewModal`, `IndustryTemplateSelector`, `BulkImageGenerator` — plus the `ai-template-assistant` / `generate-template-image` edge functions and `utils/appTemplates.ts` once these callers are gone (kept in P0.1 precisely because these still import them).

**Project-showcase-era (D25):** `ProjectManager` (wired), `ProjectCreationModal`, `ProjectEditModal`, `EnhancedProjectCreationModal`, `EnhancedProjectEditModal`. **Coordinate with P0.2** (project-showcase deletion is currently freeze-deferred) so the admin and public removals land together.

**Product/shop fossil (owner ruling):** `ProductCatalogManager` — orphan, delete.

**Other orphans (zero references — safe deletes, verify at execution):** `ModulesManager`, `PaginatedTable`, `QuickActions`. (`QuickActionsEditor` is separate — verify before touching.)

### 1D · NEW panels (factory era — build on P3.1 tables)
| Panel | Backed by |
|-------|-----------|
| **Tenants** | `tenants` / `tenant_configs` / `tenant_nodes` |
| **Provisioning gate queue** | `provisioning_jobs` / `agent_test_runs` (D6/D18) |
| **Change-request queue** | `change_requests` / `signoffs` (D23) |
| **Industry-pack editor** | `industry_packs` (D17) |
| **Cost-per-tenant dashboard** | usage vs `plan_versions` levers (D29) |

---

## 2. Duplicate-merge decisions needed (owner/lead)
- **Leads:** which of `LeadsManager` / `EnhancedLeadsManager` is the superset to keep? (Default recommendation: keep `EnhancedLeadsManager`, retire `LeadsManager`, after confirming feature parity — the two are on different admin views today.)

## 3. Sidebar / information architecture (proposed, one shell)
```
Mission Control
├── Dashboard            (stats, activity, today)
├── Tenants              [new]  → Provisioning gate · Change requests
├── Leads & Conversations (merged Leads + Conversations + Messages)
├── Agents               (AiAgentManager · Brain · Testing · Routing · Skills)
├── Catalogue            (Plans+levers/versions · Pricing · Industry packs [new] · Nodes)
├── Content              (Industries · Solutions · Page sections)
├── Quotes
├── Analytics
└── Settings
```

## 4. Bundle split (D8)
Admin + sales-dashboard lazy-loaded as separate chunks; **public-site JS must contain zero admin code** (verify with a bundle analyzer at execution — P3.6 acceptance).

## 5. Sequencing & freeze notes
1. **Re-wire `PlansManager`** into the shell (unblocks D20 #10) — smallest, highest-value first.
2. Merge the Leads duplicate.
3. Add factory panels (Tenants → gate/change-request queues → pack editor) on the P3.1 tables.
4. Kill template-era managers (self-contained, admin-only).
5. Kill project-era managers **with P0.2** (freeze-deferred; land admin + public together).
6. Delete `ProductCatalogManager` + remaining orphans.
7. Bundle split + verify zero admin code in public bundle.

All steps are admin-only and invisible to the public site — safe under the freeze. Each is its own PR under P3.6.

## 6. Open questions
- Leads: confirm which manager is canonical (§2).
- Do any "kept" managers have hidden cross-imports that make a "kill" non-trivial? (Re-run the orphan/import sweep at execution time — this audit's reference counts are a July-2026 snapshot.)
- Sidebar labels/order — owner sign-off before build.
