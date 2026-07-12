# 💶 PRICING_PACKAGES.md — Vision-Sync Canonical Packages

> **Single source of truth.** The wizard, the public pages, and the AI agent must ALL read pricing from one data structure derived from this file. Never hard-code a price in more than one place.
> Prices are **ex-VAT (€/month)**; the client is invoiced **+21% IVA**. Companion: PAGE_STANDARD.md, DESIGN.md.

---

## 1. The model

Every industry is sold in **3 tiers** — Base, Growth, Everything — built on a shared spine. Higher tiers are cumulative (each includes everything below it). At signing the client pays **2 months** (1-month deposit + 1 month upfront); the deposit covers onboarding.

---

## 2. Universal base spine (every industry, every tier includes this)

- Branded landing page / microsite — built, hosted, on the client's domain
- AI agent trained on the client's business — **English + Spanish**
- Website chat widget (embedded, live)
- Lead & enquiry capture
- Instant owner notifications (email + WhatsApp alert)
- Client dashboard — view leads & conversations (Data Intelligence Hub)
- 24/7 availability
- Onboarding & setup

> "Accounts" = the client account/dashboard portal (view-only on leads & conversations). **Booking/calendar visibility is a Growth feature (D2)** — the Base dashboard shows leads & conversations only, view-only.

---

## 3. What each tier adds (consistent across all 8 industries)

**Base** = spine + the industry's core service line (below) + voice *only* where the industry is phone-first.

**Growth** = Base **＋**
- Appointment Booking (calendar sync, confirmations, reminders)
- Lead Qualifier (scoring & routing)
- CRM Sync
- Review Manager

**Everything** = Growth **＋**
- WhatsApp Agent
- Social Media Responder
- Email Follow-Up Agent
- Voice agent — *added* for chat-led industries; *increased minutes* for voice-native ones

> **Take Payments & Deposits is NOT part of Everything (D3).** It's a paid add-on (see §4). Everything = "everything for *automation*"; payments is commerce plumbing, priced separately, so the tier promise stays honest.

---

## 4. Add-ons (à la carte)

Priced separately from the tiers, on top of a tier subscription; billed monthly ex-VAT.

- **Take Payments & Deposits — €49/mo** · available on **Growth and Everything only (D3)**. Client uses their **own Stripe account**; the fee covers integration, setup, and support. Framed as *commerce plumbing*, not automation — which is why it sits outside the Everything tier.
- **Custom domain — from €15/mo** *(placeholder — D5)* · client's own domain in place of the default `clientname.vision-sync.co` subdomain. Priced properly when built (post-launch).

Anything else not listed in the tiers ("if the client needs it, we can do it") remains a **custom add-on** quoted separately.

---

## 5. Commercial terms — lease, guarantee, ownership (D19)

- **Lease, don't sell.** Platforms remain **Vision-Sync property, leased monthly**. Clients subscribe to a running platform; they don't buy the codebase.
- **14-day money-back guarantee** on the **first payment** if the client isn't satisfied.
- **Cancel anytime** thereafter with **30 days' notice** — no long contracts.
- **Outright purchase is by application only**, reviewed case-by-case.

This ownership language is canonical for Terms, checkout copy, and the agent's training.

---

## 6. Per-industry packages (prices €/mo)

Format: **ex-VAT** (client pays **inc-IVA**) · voice minutes included.

### Building & Renovation — core: AI quote-intake & job-qualification agent
- **Base** — €209 (€253) · no voice
- **Growth** — €409 (€495) · no voice
- **Everything** — €709 (€858) · voice 1,000 min

### Holiday Rentals & Property Management — core: multilingual guest concierge, check-in & maintenance routing
- **Base** — €249 (€301) · no voice
- **Growth** — €449 (€543) · no voice
- **Everything** — €749 (€906) · voice 1,000 min

### Beauty & Hair Salons — core: AI booking agent, services & hours info
- **Base** — €249 (€301) · voice 500 min
- **Growth** — €449 (€543) · voice 500 min
- **Everything** — €749 (€906) · voice 1,000 min

### Legal Firms & Gestorías — core: client intake Q&A, document FAQ, consultation enquiries
- **Base** — €279 (€338) · no voice
- **Growth** — €479 (€580) · no voice
- **Everything** — €779 (€943) · voice 1,000 min

### Gyms & Fitness Studios — core: membership & class enquiries, lead capture & follow-up
- **Base** — €319 (€386) · voice 500 min
- **Growth** — €519 (€628) · voice 500 min
- **Everything** — €819 (€991) · voice 1,000 min

### Estate Agents — core: buyer/seller enquiry capture, viewing-request handling
- **Base** — €349 (€422) · no voice
- **Growth** — €549 (€664) · no voice
- **Everything** — €849 (€1,027) · voice 1,000 min

### Restaurants & Bars — core: AI reservations agent, menu/hours FAQ, booking confirmations
- **Base** — €475 (€575) · voice 1,500 min
- **Growth** — €619 (€749) · voice 1,500 min
- **Everything** — €919 (€1,112) · voice 3,000 min

### Dental & Health Clinics — core: AI receptionist, appointment enquiries, emergency routing
- **Base** — €489 (€592) · voice 1,500 min
- **Growth** — €689 (€834) · voice 1,500 min
- **Everything** — €989 (€1,197) · voice 3,000 min

---

## 7. Suggested data shape (for implementation)

Extend the existing `Industry` type with a `packages` array; the wizard/site/AI all read this:

```ts
type Tier = 'base' | 'growth' | 'everything';
interface Package {
  tier: Tier;
  name: string;          // "Base" | "Growth" | "Everything"
  exVatPrice: number;    // monthly, €
  incVatPrice: number;   // exVatPrice * 1.21, rounded
  voiceMinutes: number;  // 0 if none
  tagline: string;
  includes: string[];    // full cumulative feature list shown to the customer
}
// Industry gains: packages: [base, growth, everything]
```

`includes` should be the **full cumulative list** (spine + core + tier adds) so each card can render a complete "what's included" without computing it at runtime.

---

## 8. For the AI agent (so it can quote)

The agent's knowledge must include this file's pricing so it can answer "how much is X?" accurately. Rules for the agent:

- Quote the tier that matches the client's stated need; if unsure, present all 3 for their industry.
- Always state prices **ex-VAT and note "+21% IVA"**, in euros.
- Never invent a price or discount — quote only from the canonical data.
- Quote the **Take Payments & Deposits** add-on at **€49/mo** only for **Growth or Everything** clients (§4); it's never bundled into a tier. Custom domain is a **from €15/mo** placeholder (§4) — don't commit to a firm price.
- On terms: platforms are **leased monthly, not sold**; there's a **14-day money-back guarantee** on the first payment, **cancel anytime with 30 days' notice**, and outright **purchase is by application only** (§5).
- For needs outside the tiers, say it's available as a **custom add-on** and offer to capture the enquiry for a tailored quote.
- Anchor on value when asked "why so much": 24/7 bilingual coverage replacing a €2,000–4,000/mo front desk.

---

*Last updated: July 2026 | Owner: Lee Spain | Source of truth for wizard, site & AI pricing*
