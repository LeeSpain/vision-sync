# 🎨 Vision-Sync — Design System

> **Source of truth:** [`tailwind.config.ts`](tailwind.config.ts) (token names) and [`src/index.css`](src/index.css) (token values).
> This document is generated from the **actual** tokens in those files. If you change a value, change it there — then update this file.
> All colours are defined in **HSL** (space-separated, no `hsl()` wrapper) and consumed via `hsl(var(--token))`. Hex equivalents below come from the inline comments in `index.css`.

---

## 🎨 Brand Colours

Custom brand tokens (defined in `:root` of `src/index.css`, exposed as Tailwind classes in `tailwind.config.ts`):

| Token / Tailwind class | CSS variable | HSL value | Hex |
|---|---|---|---|
| `royal-purple` | `--royal-purple` | `248 39% 58%` | `#6A5ACD` |
| `emerald-green` | `--emerald-green` | `158 64% 52%` | `#10B981` |
| `midnight-navy` | `--midnight-navy` | `220 39% 11%` | `#1E293B` |
| `soft-lilac` | `--soft-lilac` | `253 42% 89%` | `#C5B8F0` |
| `cool-gray` | `--cool-gray` | `214 20% 58%` | `#94A3B8` |
| `slate-white` | `--slate-white` | `220 13% 98%` | `#F8FAFC` |
| `coral-orange` | `--coral-orange` | `16 100% 66%` | `#FF7F50` |
| `electric-blue` | `--electric-blue` | `217 91% 60%` | `#3B82F6` |

Usage example: `text-royal-purple`, `bg-emerald-green`, `border-soft-lilac/30`.

---

## 🧩 Semantic Tokens (light mode `:root`)

These shadcn/ui-style tokens map onto the brand palette:

| Token | HSL value | Notes |
|---|---|---|
| `--background` | `220 13% 98%` | Slate White |
| `--foreground` | `220 39% 11%` | Midnight Navy (body text) |
| `--card` / `--card-foreground` | `220 13% 98%` / `220 39% 11%` | Slate White on Midnight Navy text |
| `--popover` / `--popover-foreground` | `220 13% 98%` / `220 39% 11%` | |
| `--primary` / `--primary-foreground` | `248 39% 58%` / `220 13% 98%` | **Royal Purple** primary brand colour |
| `--secondary` / `--secondary-foreground` | `253 42% 89%` / `220 39% 11%` | **Soft Lilac** |
| `--muted` / `--muted-foreground` | `214 32% 91%` / `214 20% 58%` | muted-foreground = Cool Gray |
| `--accent` / `--accent-foreground` | `158 64% 52%` / `220 13% 98%` | **Emerald Green** accent |
| `--destructive` / `--destructive-foreground` | `0 84% 60%` / `220 13% 98%` | |
| `--border` | `214 20% 90%` | |
| `--input` | `214 20% 90%` | |
| `--ring` | `248 39% 58%` | Royal Purple (focus ring) |

### Sidebar tokens (light)
| Token | HSL value |
|---|---|
| `--sidebar-background` | `0 0% 98%` |
| `--sidebar-foreground` | `240 5.3% 26.1%` |
| `--sidebar-primary` | `240 5.9% 10%` |
| `--sidebar-primary-foreground` | `0 0% 98%` |
| `--sidebar-accent` | `240 4.8% 95.9%` |
| `--sidebar-accent-foreground` | `240 5.9% 10%` |
| `--sidebar-border` | `220 13% 91%` |
| `--sidebar-ring` | `217.2 91.2% 59.8%` |

### Dark mode (`.dark` overrides)
The brand colour tokens (`--royal-purple`, etc.) are **not** overridden in dark mode; only the semantic tokens change:

| Token | HSL value |
|---|---|
| `--background` / `--foreground` | `222.2 84% 4.9%` / `210 40% 98%` |
| `--card` / `--card-foreground` | `222.2 84% 4.9%` / `210 40% 98%` |
| `--popover` / `--popover-foreground` | `222.2 84% 4.9%` / `210 40% 98%` |
| `--primary` / `--primary-foreground` | `210 40% 98%` / `222.2 47.4% 11.2%` |
| `--secondary` / `--secondary-foreground` | `217.2 32.6% 17.5%` / `210 40% 98%` |
| `--muted` / `--muted-foreground` | `217.2 32.6% 17.5%` / `215 20.2% 65.1%` |
| `--accent` / `--accent-foreground` | `217.2 32.6% 17.5%` / `210 40% 98%` |
| `--destructive` / `--destructive-foreground` | `0 62.8% 30.6%` / `210 40% 98%` |
| `--border` / `--input` / `--ring` | `217.2 32.6% 17.5%` / `217.2 32.6% 17.5%` / `212.7 26.8% 83.9%` |
| `--sidebar-background` | `240 5.9% 10%` |
| `--sidebar-foreground` | `240 4.8% 95.9%` |
| `--sidebar-primary` | `224.3 76.3% 48%` |
| `--sidebar-primary-foreground` | `0 0% 100%` |
| `--sidebar-accent` | `240 3.7% 15.9%` |
| `--sidebar-accent-foreground` | `240 4.8% 95.9%` |
| `--sidebar-border` | `240 3.7% 15.9%` |
| `--sidebar-ring` | `217.2 91.2% 59.8%` |

Dark mode is class-based (`darkMode: ["class"]`).

---

## 🌈 Gradients

Defined in `src/index.css`, exposed as `bg-gradient-*` utilities via `backgroundImage` in the config:

| Tailwind class | CSS variable | Definition |
|---|---|---|
| `bg-gradient-primary` | `--gradient-primary` | `linear-gradient(135deg, hsl(var(--royal-purple)), hsl(var(--emerald-green)))` |
| `bg-gradient-hero` | `--gradient-hero` | `linear-gradient(180deg, hsl(var(--slate-white)), hsl(var(--soft-lilac)))` |
| `bg-gradient-card` | `--gradient-card` | `linear-gradient(145deg, hsl(var(--slate-white)), hsl(var(--soft-lilac) / 0.3))` |

`gradient-primary` (Royal Purple → Emerald Green, 135°) is the signature brand gradient — used for primary CTAs and `bg-clip-text` headings.
The `<body>` background is `bg-gradient-hero` (set in the `@layer base` body rule).

---

## ✍️ Typography

Font families (from `theme.extend.fontFamily` in `tailwind.config.ts`):

| Tailwind class | Stack | Role |
|---|---|---|
| `font-heading` | `['Poppins', 'system-ui', 'sans-serif']` | Headings (`h1`–`h6` apply this automatically) |
| `font-body` | `['Inter', 'system-ui', 'sans-serif']` | Body text (applied to `<body>`) |

Self-hosted via `@fontsource` (imported at the top of `src/index.css`):

- **Poppins** — weights `400`, `500`, `600`, `700`
- **Inter** — weights `400`, `500`, `600`

Base rules (in `@layer base`): `body` uses `font-body`; all `h1–h6` use `font-heading`.

---

## 🌑 Shadow Tokens

Defined in `src/index.css`, exposed as `shadow-*` utilities via `boxShadow` in the config:

| Tailwind class | CSS variable | Value |
|---|---|---|
| `shadow-card` | `--shadow-card` | `0 4px 20px -2px hsl(var(--royal-purple) / 0.1)` |
| `shadow-hover` | `--shadow-hover` | `0 8px 30px -4px hsl(var(--royal-purple) / 0.2)` |
| `shadow-glow` | `--shadow-glow` | `0 0 40px hsl(var(--emerald-green) / 0.3)` |

Card shadows tint with Royal Purple; the glow uses Emerald Green.

---

## 📐 Border Radius

Base token `--radius: 0.75rem` (in `src/index.css`). Tailwind radius scale (from `theme.extend.borderRadius`):

| Tailwind class | Value |
|---|---|
| `rounded-lg` | `var(--radius)` → `0.75rem` |
| `rounded-md` | `calc(var(--radius) - 2px)` → `~0.625rem` |
| `rounded-sm` | `calc(var(--radius) - 4px)` → `~0.5rem` |

---

## 🎬 Transitions & Animations

### Transition tokens (`transitionProperty` in config → vars in CSS)
| Tailwind class | CSS variable | Value |
|---|---|---|
| `transition-smooth` | `--transition-smooth` | `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` |
| `transition-bounce` | `--transition-bounce` | `all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)` |

### Animations (`theme.extend.animation`)
| Tailwind class | Value |
|---|---|
| `animate-accordion-down` | `accordion-down 0.2s ease-out` |
| `animate-accordion-up` | `accordion-up 0.2s ease-out` |
| `animate-float` | `float 3s ease-in-out infinite` |
| `animate-fade-in` | `fade-in 0.6s ease-out` |
| `animate-slide-up` | `slide-up 0.5s ease-out` |

### Keyframes (defined in `tailwind.config.ts` and/or `src/index.css`)
| Name | Definition |
|---|---|
| `float` | `0%,100% { translateY(0) }` → `50% { translateY(-10px) }` |
| `fade-in` | `0% { opacity:0; translateY(20px) }` → `100% { opacity:1; translateY(0) }` |
| `slide-up` | `0% { opacity:0; translateY(50px) }` → `100% { opacity:1; translateY(0) }` |
| `accordion-down` | `from { height:0 }` → `to { height: var(--radix-accordion-content-height) }` |
| `accordion-up` | `from { height: var(--radix-accordion-content-height) }` → `to { height:0 }` |

> Note: `index.css` also re-declares `.animate-float` / `.animate-fade-in` / `.animate-slide-up` as utility classes (with `forwards` fill on the latter two).

---

## 📦 Container

From `theme.container` in `tailwind.config.ts`:

- `center: true`
- `padding: '2rem'`
- `screens: { '2xl': '1400px' }`

---

## 🧰 Misc

- **Tailwind plugin:** `tailwindcss-animate`
- **Prefix:** none (`prefix: ""`)
- **Content globs:** `./pages`, `./components`, `./app`, `./src` (`.{ts,tsx}`)
- **Utility helpers** in `src/index.css`: `.line-clamp-2`, `.line-clamp-3`

---

*Generated from live design tokens — `tailwind.config.ts` + `src/index.css`. Vision-Sync Forge.*
