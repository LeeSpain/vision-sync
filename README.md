# Vision-Sync Forge

**AI Agents, Chatbots & Intelligent Automation** — the self-selling, self-provisioning AI platform.

- **Live site:** https://www.vision-sync.co
- **Repo:** https://github.com/LeeSpain/vision-sync

Vision-Sync is being built into a multi-tenant "tenant factory": a visitor lands on the
site, is met by a live AI agent that interviews them, assembles their industry package,
takes payment, and provisions their entire working platform automatically — branded
microsite on their own subdomain, trained AI agent, dashboard, and notifications — gated
only by a short owner approval. The company is run by talking to the Brain agent, not by
hand-building client sites.

---

## 📐 Read this first

This repo is governed by two documents at the root. Read them before making changes:

- **[BLUEPRINT.md](./BLUEPRINT.md)** — the constitution. Vision, decisions of record
  (D1–D32), target architecture, phases (P0→P4), and the definition of done. **Strategy is
  written here before it is built.**
- **[CLAUDE_CODE_PLAN.md](./CLAUDE_CODE_PLAN.md)** — the work order. The session protocol
  and the ordered, checkable task list that executes the blueprint.

Companion specs: `CLAUDE.md` (engineering standards), `DESIGN.md`, `UI_SYSTEM.md`,
`PAGE_STANDARD.md`, `PRICING_PACKAGES.md`.

---

## 🛠 Tech stack

| Layer      | Technology                                                        |
|------------|-------------------------------------------------------------------|
| Frontend   | React 18 + TypeScript + Vite                                      |
| Styling    | Tailwind CSS + shadcn/ui                                          |
| Backend    | Supabase (PostgreSQL + Edge Functions + Realtime + Auth)          |
| AI layer   | Anthropic Claude API (via Supabase Edge Functions — no keys in the client) |
| i18n       | i18next (EN/ES at launch, more locales by demand)                 |
| Deployment | Vercel (frontend) + Supabase Cloud (backend)                      |

---

## 🚀 Local development

Requires Node.js and npm ([install via nvm](https://github.com/nvm-sh/nvm#installing-and-updating)).

```sh
# 1. Clone
git clone https://github.com/LeeSpain/vision-sync
cd vision-sync

# 2. Install
npm i

# 3. Configure environment
#    Create a .env from the Supabase project settings (URL + anon key).
#    Secrets (ANTHROPIC_API_KEY, RESEND_API_KEY, ADMIN_EMAIL, ...) live in
#    Supabase Edge Function secrets — never in client code or Git.

# 4. Run the dev server
npm run dev
```

### Scripts

| Command                     | What it does                                        |
|-----------------------------|-----------------------------------------------------|
| `npm run dev`               | Start the Vite dev server                           |
| `npm run build`             | Production build                                    |
| `npm run preview`           | Preview the production build locally                |
| `npm run lint`              | ESLint over the project                             |
| `npx tsc --noEmit`          | Type-check (must be clean before every commit)      |
| `npm run gen:pricing-knowledge` | Regenerate the pricing knowledge base           |
| `npm run gen:pricing-db-seed`   | Regenerate the pricing DB seed                  |

---

## 🗂 Project structure

```
vision-sync/
├── src/
│   ├── components/      # admin, chat, ui-system, layout
│   ├── pages/           # route-level components (incl. SalesDashboard)
│   ├── hooks/           # data-fetching hooks
│   ├── i18n/locales/    # en.json / es.json (kept at key-tree parity)
│   ├── lib/ · utils/    # Supabase client, AI wrapper, shared utils
│   └── types/           # shared TypeScript interfaces
├── supabase/
│   ├── functions/       # Deno edge functions (ai-chat, ai-router, ...)
│   └── migrations/      # numbered, sequential SQL migrations (never edited)
├── scripts/             # build-time generators
├── BLUEPRINT.md         # the constitution
└── CLAUDE_CODE_PLAN.md  # the work order
```

---

## 🔁 Environments, CI & deployment

**Continuous integration (D31).** GitHub Actions (`.github/workflows/ci.yml`) runs on every
pull request into `main` and on push to `main`. It installs with `npm ci`, then runs
`npx tsc --noEmit` and `npm run build`. `main` is branch-protected: the **`typecheck + build`**
check must pass before a PR can merge — a failing typecheck or build blocks merge.

**Environments (D21 — staging-first, no destructive live changes).**

| Environment | Trigger | Surface |
|-------------|---------|---------|
| **Production** | Merge to `main` | Vercel production → https://www.vision-sync.co. Only CI-passing, reviewed code reaches prod. |
| **Preview / staging** | Every PR | Vercel Preview Deployment (unique per-PR URL) — the staging surface for review before merge. |
| **Backend** | Supabase Cloud | One project for build/dev today; **D32** moves Vision-Sync to a dedicated Supabase **Pro** org at **P3.0**, before the first paying tenant. |

**Secrets & config.** The client `.env` carries only the Supabase URL + anon key. All server
secrets (`ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `ADMIN_EMAIL`, `ALLOWED_ORIGIN`, `FRONTEND_URL`)
live in Supabase Edge Function secrets — never in client code or Git.

**Backups / PITR — deferred.** Point-in-time recovery is **not** enabled: the current Supabase
project is on the **Free tier**, where PITR is unavailable. PITR is turned on as part of the
**D32** migration to a dedicated **Pro** org at **P3.0** (which replays migrations, migrates data,
and keeps the old project read-only for 30 days as rollback). No paying-tenant data lives on the
current project before that cutover.

---

## 🤝 Contributing

Every change follows the **session protocol** in `CLAUDE_CODE_PLAN.md`:

1. Branch per task (`<phase>/<task-id>-<slug>`) — never commit to `main`.
2. `npx tsc --noEmit` clean and `npm run build` green before every commit.
3. All user-facing copy goes through i18n (EN **and** ES). No raw hex — use DESIGN.md tokens.
4. New numbered Supabase migrations only; never edit old ones.
5. Cite the relevant BLUEPRINT decision (D-number) in the PR description.
