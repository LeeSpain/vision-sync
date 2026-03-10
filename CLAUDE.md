# 🧠 CLAUDE.md — Vision-Sync Master Command File
> Drop this file in the root of your repo. Claude Code reads it automatically on every session.

---

## 🏢 PROJECT IDENTITY

**Product:** Vision-Sync Forge  
**Tagline:** AI Agents, Chatbots & Intelligent Automation  
**Mission:** Transform businesses with custom AI agents, conversational AI, and 24/7 intelligent automation — built enterprise-grade from day one.  
**Repo:** https://github.com/LeeSpain/vision-sync  
**Live Site:** https://www.vision-sync.co  

---

## 🧬 WHO I AM (The Builder's DNA)

I am Lee Spain. I build serious, production-grade software. I don't cut corners. I think in systems, not features. Every component I write is meant to last, scale, and impress. My building style:

- I **rip things apart** before rebuilding them better
- I think in **phases and execution order** — never random
- I want **deep features**, not surface-level demos
- I expect Claude to **anticipate the next problem** before I ask
- I value **clear architecture documentation** alongside the code
- I move fast but I build right — "ship quickly" means no tech debt traps
- When something is wrong, I want it called out **directly and honestly**

---

## 🛠 TECH STACK

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS (utility-first, no custom CSS unless unavoidable) |
| Backend | Supabase (PostgreSQL + Edge Functions + Realtime) |
| AI Layer | Anthropic Claude API (claude-sonnet-4-20250514) |
| Auth | Supabase Auth (JWT-based) |
| Deployment | Vercel (frontend) + Supabase Cloud (backend) |
| State | React Context + hooks (no Redux) |
| Language | TypeScript everywhere — no `any`, no escape hatches |

---

## 🏗 PROJECT ARCHITECTURE

```
vision-sync/
├── src/
│   ├── components/
│   │   ├── admin/          # Dashboard, Agent Manager, Brain, Analytics
│   │   ├── chat/           # AiChatWidget, public-facing chat
│   │   ├── ui/             # Shared UI components
│   │   └── layout/         # Sidebar, Header, Nav
│   ├── lib/
│   │   ├── supabase.ts     # DB client
│   │   ├── anthropic.ts    # AI client wrapper
│   │   └── utils.ts        # Shared utilities
│   ├── hooks/              # Custom React hooks
│   ├── types/              # Global TypeScript interfaces
│   └── pages/              # Route-level components
├── supabase/
│   ├── functions/          # Edge Functions (Deno runtime)
│   │   └── ai-chat/        # Main AI chat handler
│   └── migrations/         # SQL migrations (numbered, sequential)
├── CLAUDE.md               # This file
└── README.md
```

---

## 🤖 CORE SYSTEM: AI AGENT ARCHITECTURE

Vision-Sync's heart is its multi-agent system. Always treat agents as first-class citizens.

### Agent Types
- **Sales Agent** — Lead capture, product info, conversion optimisation
- **Support Agent** — Customer service, issue resolution, FAQ handling
- **Brain Agent** — Admin intelligence layer, answers questions about live data
- **Custom Agents** — Client-configurable agents via the Agent Manager UI

### Agent Routing Rules
```
User message → Intent classifier → Route to correct agent
                                  ↓
                            Handoff triggers:
                            - "I want a human" → Escalation
                            - Sales keyword → Sales Agent
                            - Support keyword → Support Agent
                            - Data question → Brain Agent
```

### Supabase Edge Function Pattern (ai-chat)
- Every agent has its own system prompt stored in the DB
- Context window management: last 10 messages always included
- Agent performance is logged to `ai_actions` table on every response
- Confidence scoring: if score < 0.7, flag for human review

---

## 🗄 DATABASE SCHEMA PRINCIPLES

- **12+ migrations** — always add a new numbered migration, never edit old ones
- Migrations are sequential and descriptive: `001_initial_schema.sql`, `002_add_agents.sql`
- Every table has: `id uuid DEFAULT gen_random_uuid()`, `created_at`, `updated_at`
- Use Row Level Security (RLS) on every user-facing table — no exceptions
- Foreign keys must have explicit `ON DELETE` behaviour defined

### Core Tables Reference
| Table | Purpose |
|-------|---------|
| `user_profiles` | User info, preferences, onboarding status |
| `ai_agents` | Agent definitions, system prompts, config |
| `conversations` | Chat threads |
| `messages` | Individual messages with agent attribution |
| `ai_actions` | Full audit log of every AI action taken |
| `ai_memories` | Learned facts per user/business |
| `ai_drafts` | Pending approval queue |
| `connectors` | External integrations registry |
| `user_autonomy_settings` | Per-user automation permission levels |
| `onboarding_progress` | Step-by-step onboarding tracking |

---

## 🎨 UI / UX STANDARDS

- **Design language:** Clean, modern, professional — enterprise SaaS aesthetic
- **Color system:** Consistent with Tailwind palette — use design tokens, not arbitrary hex values
- **Component pattern:** Functional components only, no class components
- **No inline styles** — Tailwind classes only
- **Responsive by default** — mobile-first, test at 375px and 1440px
- **Loading states:** Every async action must show a loading indicator
- **Error states:** Every async action must handle errors gracefully with user-visible feedback
- **Empty states:** Every list/table must have a meaningful empty state — never a blank screen

### Sidebar Navigation Pattern
```
Dashboard
├── AI Section (collapsible)
│   ├── Brain Dashboard
│   ├── Agent Manager
│   ├── Agent Testing
│   └── Routing Rules
├── Conversations
├── Contacts
├── Analytics
└── Settings
```
Active route must be visually highlighted. Subroutes must show active state on parent + child.

---

## ✅ CODING STANDARDS

### TypeScript Rules
- **No `any`** — if you can't type it, create an interface
- All API responses must be typed — create interfaces in `src/types/`
- Use `type` for unions/primitives, `interface` for objects/components
- Enums for status fields: `AgentStatus`, `ConversationStatus`, etc.

### Component Rules
```typescript
// ✅ Always do this
interface Props {
  agentId: string;
  onSuccess: (agent: Agent) => void;
}

export const AgentCard: React.FC<Props> = ({ agentId, onSuccess }) => {
  // ...
};

// ❌ Never do this
export const AgentCard = ({ agentId, onSuccess }: any) => { ... };
```

### Supabase Query Pattern
```typescript
// ✅ Always handle errors explicitly
const { data, error } = await supabase
  .from('ai_agents')
  .select('*')
  .eq('user_id', userId);

if (error) throw new Error(`Failed to fetch agents: ${error.message}`);
return data;
```

### Edge Function Pattern (Deno)
```typescript
// ✅ Always set CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle OPTIONS preflight
if (req.method === 'OPTIONS') {
  return new Response('ok', { headers: corsHeaders });
}
```

---

## 🧠 AI INTEGRATION RULES

- **Model:** Always use `claude-sonnet-4-20250514` — never use older models
- **Max tokens:** 1000 for chat responses, 4000 for complex agent tasks
- **System prompts:** Stored in DB, fetched per agent — never hardcoded in functions
- **Temperature:** 0.7 for conversational, 0.2 for structured/data responses
- **Never expose API keys** in frontend code — all AI calls go through Supabase Edge Functions
- **Confidence scoring:** Every AI response should include a confidence score where applicable
- **Audit trail:** Log every AI action to `ai_actions` with: agent_id, user_id, input, output, confidence, timestamp

---

## 🔐 SECURITY NON-NEGOTIABLES

- RLS enabled on every Supabase table — always
- API keys in `.env` only — never committed to Git
- No sensitive data in frontend state — IDs only, fetch details server-side
- Auth checks at the Edge Function level, not just the UI
- External communications (email, webhooks) require approval flag before sending

---

## 🚀 FEATURE DEVELOPMENT WORKFLOW

When building a new feature, always follow this order:

```
1. SCHEMA FIRST
   → Write the migration SQL
   → Define TypeScript interfaces

2. EDGE FUNCTION / API
   → Build the backend logic
   → Test with curl before wiring UI

3. HOOKS
   → Create a custom hook to encapsulate data fetching
   → Handle loading, error, and success states

4. COMPONENT
   → Build the UI against the hook
   → Handle all states: loading, empty, error, data

5. INTEGRATION
   → Wire into the sidebar/router
   → Test the full flow end-to-end

6. DOCUMENTATION
   → Update relevant .md files if architecture changed
```

---

## 🧪 TESTING CHECKLIST (Run Before Calling Any Feature Done)

```
[ ] Component renders without errors
[ ] Loading state displays correctly
[ ] Error state handles API failures gracefully
[ ] Empty state shown when no data
[ ] TypeScript compiles with zero errors (tsc --noEmit)
[ ] RLS policies tested: users can only see their own data
[ ] Mobile layout checked at 375px
[ ] Agent routing tested: correct agent responds to correct intent
[ ] Audit log entry created for AI actions
[ ] Supabase edge function returns proper CORS headers
```

---

## 📋 EXECUTION STYLE

When I give you a task, I expect:

1. **Study first** — Read the relevant files before touching anything
2. **State the plan** — Tell me what you're going to do and in what order
3. **Execute step by step** — Don't skip ahead or batch unrelated changes
4. **Call out problems** — If you spot something broken or wrong, say so immediately
5. **Test as you go** — Don't write 500 lines then discover a type error
6. **Show the result** — After each step, confirm what was done

If a task needs more than 5 files changed, break it into labelled prompts:
```
PROMPT 1: [What it does]
PROMPT 2: [What it does]
...
```

---

## 🔧 COMMON COMMANDS

```bash
# Dev server
npm run dev

# Type check (run this before every commit)
npx tsc --noEmit

# Deploy Supabase edge function
supabase functions deploy ai-chat

# Run new migration
supabase db push

# Build for production
npm run build
```

---

## 🚫 NEVER DO THESE

- Never use `any` in TypeScript
- Never hardcode API keys or secrets
- Never skip RLS on a new table
- Never build UI before the data layer exists
- Never use class components
- Never break the sidebar navigation structure without mapping the new structure first
- Never merge two unrelated features in a single change
- Never assume — if unclear, ask one precise question

---

## 💡 VISION-SYNC PHILOSOPHY

> **"We don't build chatbots. We build intelligent business infrastructure."**

Every feature should feel like it belongs in an enterprise product that a Fortune 500 would trust. Clean, fast, secure, and smart. When in doubt, build it like it needs to scale to 10,000 businesses.

---

*Last updated: March 2026 | Owner: Lee Spain | vision-sync.co*
