/**
 * Vision-Sync Design System
 * Single source of truth for Tailwind class strings.
 * Based on the Pricing page design language — all other pages must match.
 */

export const ds = {
  // ─── Page shell ───────────────────────────────────────────────────────────
  pageWrapper: 'min-h-screen flex flex-col bg-slate-50 font-sans',
  main: 'flex-grow pt-32 pb-24',
  container: 'container mx-auto px-4 sm:px-6 lg:px-8',

  // ─── Hero / heading block ─────────────────────────────────────────────────
  heroWrapper: 'text-center max-w-3xl mx-auto mb-16',
  h1: 'text-4xl md:text-5xl font-bold tracking-tight text-midnight-navy mb-6',
  heroSubtitle: 'text-lg text-cool-gray',

  // ─── Section labels & headings ────────────────────────────────────────────
  sectionLabel: 'text-sm font-bold text-electric-blue uppercase tracking-wider mb-3',
  sectionLabelPurple: 'text-sm font-bold text-royal-purple uppercase tracking-wider mb-3',
  sectionWrapper: 'py-24 px-4 sm:px-6 lg:px-8',
  sectionH2: 'text-3xl md:text-4xl font-bold tracking-tight text-midnight-navy mb-4',
  sectionSubtitle: 'text-lg text-cool-gray max-w-2xl mx-auto',

  // ─── Cards ────────────────────────────────────────────────────────────────
  cardBase: 'bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden',
  cardContent: 'p-6 flex flex-col flex-grow',
  cardTitle: 'font-bold text-midnight-navy text-lg mb-3 leading-snug',
  cardSubtitle: 'text-sm text-emerald-600 font-medium mb-2 leading-snug',
  cardBody: 'text-sm text-cool-gray mb-4 leading-relaxed flex-grow',
  cardAccentStrip: 'h-1.5 w-full',

  // ─── Icon containers ──────────────────────────────────────────────────────
  iconContainer: 'h-12 w-12 rounded-xl flex items-center justify-center mb-5 shrink-0',

  // ─── Buttons ──────────────────────────────────────────────────────────────
  primaryButton: 'w-full bg-midnight-navy hover:bg-midnight-navy/90 text-white text-sm font-semibold',
  secondaryButton: 'border-midnight-navy text-midnight-navy hover:bg-midnight-navy hover:text-white',
  ctaArrow: 'h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform',

  // ─── Badges ───────────────────────────────────────────────────────────────
  badge: 'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border w-fit',

  // ─── Grid layouts ─────────────────────────────────────────────────────────
  grid4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto',
  grid3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto',
  grid2: 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto',

  // ─── Feature check list item ──────────────────────────────────────────────
  featureItem: 'flex items-start gap-3 text-sm text-slate-700',

  // ─── Info / note strip ────────────────────────────────────────────────────
  infoStrip: 'inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-5 py-2.5',

  // ─── Dark gradient banner ─────────────────────────────────────────────────
  darkBanner: 'bg-gradient-to-br from-midnight-navy to-royal-purple rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden',
} as const;

/** Colour accent sets used for card top strips and icon backgrounds */
export const ACCENT_COLORS = {
  blue:   { strip: 'bg-blue-600',    icon: 'bg-blue-100 text-blue-700',    badge: 'bg-blue-100 text-blue-700 border-blue-200' },
  green:  { strip: 'bg-emerald-600', icon: 'bg-emerald-100 text-emerald-700', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  purple: { strip: 'bg-purple-600',  icon: 'bg-purple-100 text-purple-700', badge: 'bg-purple-100 text-purple-700 border-purple-200' },
  orange: { strip: 'bg-orange-500',  icon: 'bg-orange-100 text-orange-700', badge: 'bg-orange-100 text-orange-700 border-orange-200' },
  amber:  { strip: 'bg-amber-500',   icon: 'bg-amber-100 text-amber-700',  badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  red:    { strip: 'bg-red-600',     icon: 'bg-red-100 text-red-700',      badge: 'bg-red-100 text-red-700 border-red-200' },
  pink:   { strip: 'bg-pink-500',    icon: 'bg-pink-100 text-pink-700',    badge: 'bg-pink-100 text-pink-700 border-pink-200' },
  indigo: { strip: 'bg-indigo-600',  icon: 'bg-indigo-100 text-indigo-700', badge: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  teal:   { strip: 'bg-teal-600',    icon: 'bg-teal-100 text-teal-700',    badge: 'bg-teal-100 text-teal-700 border-teal-200' },
  rose:   { strip: 'bg-rose-500',    icon: 'bg-rose-100 text-rose-700',    badge: 'bg-rose-100 text-rose-700 border-rose-200' },
} as const;

export type AccentColor = keyof typeof ACCENT_COLORS;
