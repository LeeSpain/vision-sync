# 📐 PAGE_STANDARD.md — Vision-Sync Page Anatomy

> The canonical structure every public marketing page must follow. Derived from the homepage (`src/pages/Index.tsx`).
> Companion files: **DESIGN.md** (tokens) and **CLAUDE.md** (rules). When restyling a page, this file defines the *target*.
> Decision of record: **all heroes are LIGHT** (matching the homepage). No dark hero backgrounds anywhere, including the Pricing/quote wizard.

---

## 1. THE CANONICAL HERO (light — non-negotiable)

Every page's hero matches this anatomy. Copy may differ; structure and classes do not.

```tsx
<section className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
  {/* Floating brand orbs */}
  <div className="absolute top-20 left-10 w-96 h-96 bg-royal-purple/5 rounded-full blur-3xl animate-float"></div>
  <div className="absolute top-40 right-10 w-96 h-96 bg-emerald-green/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

  <div className="max-w-7xl mx-auto relative z-10 text-center">
    {/* Eyebrow badge — gradient pill + lucide icon */}
    <div className="inline-flex items-center justify-center gap-2 bg-gradient-primary px-4 py-1.5 rounded-full text-white text-sm font-medium mb-8 shadow-glow mx-auto">
      <Sparkles className="h-4 w-4" />
      {t('...')}  {/* page-appropriate eyebrow label */}
    </div>

    {/* Headline — gradient-clip a key phrase */}
    <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-midnight-navy mb-6 tracking-tight">
      Lead phrase<br />
      <span className="bg-gradient-primary bg-clip-text text-transparent">Highlighted phrase</span>
    </h1>

    {/* Subhead */}
    <p className="text-lg md:text-xl text-cool-gray mb-10 max-w-3xl mx-auto leading-relaxed">
      {t('...')}
    </p>

    {/* CTA pair */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Button variant="hero" size="lg" className="shadow-lg group">
        Primary CTA
        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
      <Button variant="outline" size="lg">Secondary CTA</Button>
    </div>
  </div>
</section>
```

**Hard rules**
- Background is ALWAYS `bg-gradient-to-b from-slate-50 to-white` + the two floating orbs. Never a dark or colored hero.
- Headline scale is ALWAYS `text-5xl md:text-6xl lg:text-7xl`. Not 4xl→6xl, not 4xl→5xl.
- Headline color `text-midnight-navy`; gradient-clip the emphasis phrase with `bg-gradient-primary bg-clip-text text-transparent`.
- Eyebrow is ALWAYS the gradient pill + lucide icon. Not a shadcn `Badge`, not a bare `<span>`. Pick a contextual icon (Sparkles, Target, Network, etc.).
- Primary CTA = `variant="hero"`; secondary = `variant="outline"`. No inline-styled buttons.

---

## 2. CANONICAL SECTION

Body sections alternate background and share heading structure.

```tsx
<section className="py-20 px-4 sm:px-6 lg:px-8 bg-white"> {/* or: bg-slate-50 border-b border-soft-lilac/20 */}
  <div className="max-w-7xl mx-auto">
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-sm font-bold text-electric-blue uppercase tracking-wider mb-3">Eyebrow</h2>
      <h3 className="text-3xl md:text-4xl font-heading font-bold text-midnight-navy mb-6">Section title</h3>
      <p className="text-cool-gray text-lg">Supporting copy</p>
    </div>
    {/* content — reuse grid2/grid3/grid4 from designSystem.ts */}
  </div>
</section>
```

- Alternate `bg-white` and `bg-slate-50 border-b border-soft-lilac/20` down the page for rhythm.
- Section titles: `text-3xl md:text-4xl font-heading font-bold text-midnight-navy`.
- Reuse layout constants from `src/styles/designSystem.ts` (`grid2/3/4`, `featureItem`, `badge`, `primaryButton`, etc.).

---

## 3. TOKEN MAP — replace every offender

No raw hex, no Tailwind default palette for brand surfaces. Replace as follows:

| Found in code | Replace with |
|---------------|--------------|
| `#0A1628`, `#0a0f1e`, `bg-[#0A1628]` | `midnight-navy` |
| `bg-cyan-500`, `text-cyan-400`, `border-cyan-*` | `electric-blue` (or `emerald-green` for success) |
| `bg-emerald-100` | `bg-emerald-green/10` |
| `text-emerald-600`, `text-emerald-500` | `text-emerald-green` |
| `text-slate-700` | `text-midnight-navy` |
| `text-slate-500`, `text-slate-400` | `text-cool-gray` |
| `border-slate-100`, `border-slate-200` | `border-soft-lilac/20` |
| `bg-blue-500` (strip colors) | map to nearest brand token |

All colors stay HSL-token-based per DESIGN.md.

---

## 4. CANONICAL URL — ONE domain

Every page's `<SEOHead canonical>` and `ogImage` must use **`https://www.vision-sync.co`**. Today the codebase mixes three:
- `vision-sync.com` (homepage)
- `vision-sync-forge.lovable.app` (most other pages)
- `vision-sync.co` (the actual live site)

Unify all of them to `https://www.vision-sync.co`. This is an SEO correctness fix, not cosmetic.

---

## 5. BUTTONS

- Use shadcn `Button` variants only: `hero` (primary), `outline` (secondary), `buy` (purchase/commerce).
- Remove all inline-styled buttons (e.g. `className="bg-white text-[#0A1628]"`).
- Primary CTAs that move forward include a trailing `ArrowRight` with the hover-translate animation.

---

## 6. DEDUPLICATION RULES

- **"What happens next?" block** is currently triplicated (Contact page, AI Agent Questionnaire, AI training script). Extract a single `<WhatHappensNext />` component driven by i18n keys (`contact.whatsNext`, `next1..3`) and reuse it. Align the AI training script wording to the same copy.
- **CTA copy** standardizes to **"Get Your Quote"** everywhere that routes to `/pricing`. Retire the "Get Your Custom Quote" / mixed variants.
- **Overlapping quote funnels** (Pricing wizard, ModulePicker, AI Agent Questionnaire, Template Finder, CustomQuoteModal) — DO NOT auto-merge. This is a product decision; flag for the owner before consolidating.

---

## 7. PAGE CHECKLIST (run per page during alignment)

```
[ ] Hero matches §1 exactly (light bg, orbs, 5xl→7xl, gradient pill eyebrow, hero+outline CTAs)
[ ] Sections match §2 (alternating bg, midnight-navy titles, designSystem.ts grids)
[ ] Zero raw hex / Tailwind-default brand colors (§3)
[ ] canonical + ogImage = https://www.vision-sync.co (§4)
[ ] Buttons use shadcn variants only (§5)
[ ] No duplicated blocks; shared components used (§6)
[ ] All copy via t(), keys in en.json AND es.json
[ ] tsc --noEmit clean; checked at 375px and 1440px
```

---

*Last updated: June 2026 | Owner: Lee Spain | Companions: DESIGN.md, CLAUDE.md*
