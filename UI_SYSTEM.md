# ✨ UI_SYSTEM.md — Vision-Sync Premium Design System

> The elevated, component-driven visual language. Builds on **DESIGN.md** (tokens) and supersedes the ad-hoc per-page styling.
> Goal: one bold, distinctive, best-in-class look — built as shared components so pages can never drift again.
> Rule: re-skin onto these components. Keep ALL existing content, data, and logic (pricing packages, wizard, AI, lead capture). Nothing functional is lost.

---

## 1. Design direction — "Quiet luxury tech"

Confident, spacious, atmospheric — premium by restraint, not noise. The opposite of generic SaaS:

- **Depth, not flatness.** Backgrounds carry atmosphere — layered gradient mesh, floating brand orbs, a faint precision grid, optional grain. Never a flat fill behind a hero.
- **One accent, used as a signature.** The purple→green `gradient-primary` is the brand's single expressive move — on the eyebrow pill, on one clipped keyword per headline, on one accent line per card. Everywhere it appears, it means "Vision-Sync." **No per-item rainbow colours.**
- **Dark as punctuation, not accident.** Light is the system. Dark appears *deliberately* — one dramatic "infrastructure" band per page (proof stats, or the final CTA) — never as stray panels.
- **Bilingual, enterprise, trustworthy.** Costa-Blanca expat market. Calm authority over hype.

The one thing people remember: **the gradient-clipped keyword + pill eyebrow signature**, on an atmospheric light field, with a single dark dramatic band.

---

## 2. Foundations (refine in DESIGN.md)

**Type scale — lock it, stop the drift.** One modular scale, used everywhere:
| Role | Class |
|------|-------|
| Display (hero h1) | `text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight` |
| Section title (h2) | `text-3xl md:text-4xl lg:text-5xl font-heading font-bold tracking-tight` |
| Card / sub-head (h3) | `text-xl md:text-2xl font-heading font-semibold` |
| Body | `text-base md:text-lg text-cool-gray leading-relaxed` |
| Eyebrow caps | `text-sm font-bold uppercase tracking-wider` |

**Display font — one brand decision to make (see §7).** Keep Inter for body; consider elevating the *display* face for more character.

**Spacing rhythm.** Sections `py-24 lg:py-32`; container `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`; constrain hero/section copy to `max-w-3xl mx-auto`.

**Elevation.** Use the brand-tinted shadows (`shadow-card`, `shadow-hover`, `shadow-glow`) consistently. Cards rest on `shadow-card`, lift to `shadow-hover`.

**Signature background.** A reusable atmospheric backdrop: `bg-gradient-to-b from-slate-50 to-white` + two floating orbs (`royal-purple/5`, `emerald-green/5`, `blur-3xl`, `animate-float`) + a faint grid/mesh overlay at low opacity. This is the canvas every hero sits on.

---

## 3. The component library (build ONCE, compose everywhere)

This is the heart of the fix. Every page composes from these — so consistency is structural, not remembered.

**`<Eyebrow icon label />`** — the gradient-primary pill + lucide icon. The single eyebrow treatment for the whole site. Retires "HOW IT WORKS" plain text, the bare icons, the missing ones.

**`<GradientText>`** — wraps the one keyword per headline in `bg-gradient-primary bg-clip-text text-transparent`. Used in every Hero/SectionHeading.

**`<Hero eyebrow title highlight subtitle primaryCta secondaryCta media? />`** — the canonical atmospheric light hero (§2 background). Title auto-clips `highlight`. Orchestrated staggered fade-in on load (eyebrow → title → subtitle → CTAs, `animation-delay` steps). One component, every page's hero.

**`<SectionHeading eyebrow title highlight subtitle align />`** — caps eyebrow + h2 (optional clip) + subtitle. Every section opens with this.

**`<FeatureCard icon title body items? badge? />`** — THE card. `bg-white`, `border border-soft-lilac/30`, `rounded-3xl`, `shadow-card → shadow-hover` on hover, a single `gradient-primary` accent (top hairline OR icon chip). **No per-card colour map.** This one component replaces the rainbow cards on Modules, Solutions, Platform, Pricing.

**`<PricingCard>`** — FeatureCard's sibling for the 3 packages; Growth variant carries the gradient accent + "Most Popular".

**`<CTAGroup primary secondary />`** — primary = `Button variant="hero"` (gradient, trailing `ArrowRight` w/ hover-translate); secondary = `variant="outline"`. The only CTA pattern.

**`<DarkBand>`** — the deliberate dark dramatic section (`from-midnight-navy to-royal-purple`), for proof stats or the closing CTA. Turns the accidental dark panels into an intentional signature device.

**`<SectionDivider>`** — a thin `gradient-primary` hairline between sections; the recurring motif that stitches pages together.

---

## 4. Motion (high-impact, not scattered)

- **One orchestrated page-load reveal** per page: hero elements stagger in (`animate-fade-in` + stepped `animation-delay`). This single moment delivers more polish than dozens of micro-interactions.
- **Hover**: cards lift (`shadow-card → shadow-hover`, subtle `-translate-y`); primary CTAs translate their arrow.
- **Orbs** drift via `animate-float`. Keep everything subtle — `transition-smooth` is the default easing. Respect `prefers-reduced-motion`.

---

## 5. The kill list (what makes it look unbranded today)

| Remove | Replace with |
|--------|--------------|
| Per-item rainbow card top-borders (blue/green/purple/orange) | `<FeatureCard>` single gradient accent |
| 4 different eyebrow styles | `<Eyebrow>` gradient pill, everywhere |
| Headlines clipped on some pages, not others | `<GradientText>` on the keyword, every headline |
| Flat dark "AI Guardian" panel on Contact, stray dark buttons | `<DarkBand>` (intentional) or bring into light |
| Flat solid hero backgrounds | the §2 atmospheric backdrop |
| Mismatched CTA buttons (flat navy vs gradient) | `<CTAGroup>` |

---

## 6. Implementation sequence

- **Phase B — Build the library.** Create the components in `src/components/ui-system/` (or similar), styled from DESIGN.md tokens. No page changes yet.
- **Phase C — Migrate page by page**, composing from the library, keeping all content/logic:
  Homepage (reference) → Platform → Solutions → Modules → Contact → Pricing wizard → project pages (DynamicProjectDetail → AiSpainHomes/NurseSync/TetherBand/GlobalHealthSync) → ForSale/ConneqtCentral/Templates. *(This absorbs the unfinished 3b/3c hero work entirely.)*
- **Phase D — Polish.** Page-load orchestration, the DarkBand placement, grid/grain overlays, reduced-motion, full QA at 375 & 1440.

Each page migration: hero via `<Hero>`, sections via `<SectionHeading>` + `<FeatureCard>`, CTAs via `<CTAGroup>`, one `<DarkBand>` as punctuation. Then it's on-system by construction.

---

## 7. The one brand decision — display font

DESIGN.md specifies **Poppins** (headings) + **Inter** (body). Inter for body/UI is the right call — keep it. But Poppins is a common choice; for "best-in-class," a more characterful **display** face on headings would lift the whole site without touching readability.

Recommendation: keep Inter for body; trial a distinctive display font for headings only (a refined geometric or editorial face with more personality than Poppins). This is the single change that ripples across the brand, so it needs your sign-off before the library is built — **confirm: keep Poppins, or elevate the display font?**

---

*Last updated: June 2026 | Owner: Lee Spain | Builds on DESIGN.md · PAGE_STANDARD.md*
