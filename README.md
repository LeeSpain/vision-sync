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

## 🤝 Contributing

Every change follows the **session protocol** in `CLAUDE_CODE_PLAN.md`:

1. Branch per task (`<phase>/<task-id>-<slug>`) — never commit to `main`.
2. `npx tsc --noEmit` clean and `npm run build` green before every commit.
3. All user-facing copy goes through i18n (EN **and** ES). No raw hex — use DESIGN.md tokens.
4. New numbered Supabase migrations only; never edit old ones.
5. Cite the relevant BLUEPRINT decision (D-number) in the PR description.
