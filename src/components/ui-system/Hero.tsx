import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Eyebrow } from './Eyebrow';
import { GradientText } from './GradientText';
import { CTAGroup, type CTAAction } from './CTAGroup';

export interface HeroEyebrow {
  /** Already-translated pill label. */
  label: string;
  /** Optional leading lucide icon. */
  icon?: LucideIcon;
}

export interface HeroProps {
  /** Gradient-pill eyebrow above the headline. */
  eyebrow?: HeroEyebrow;
  /** Headline text (the part rendered in solid Midnight Navy). */
  title: React.ReactNode;
  /** Optional keyword rendered on its own line in the brand gradient (`GradientText`). */
  highlight?: React.ReactNode;
  /** Supporting paragraph under the headline. */
  subtitle?: React.ReactNode;
  /** Optional primary action — gradient `hero` button with trailing arrow. Omit for a CTA-less hero. */
  primaryCta?: CTAAction;
  /** Optional secondary action — `outline` button. */
  secondaryCta?: CTAAction;
  /** Optional right-side visual (e.g. the homepage chat card + floating stat). */
  media?: React.ReactNode;
  /** Optional fine print under the CTAs (e.g. a trust line). */
  footnote?: React.ReactNode;
  /** Extra classes appended to the `<section>`. */
  className?: string;
}

/**
 * Stagger step for a left-column element. Returns the props for an
 * `animate-fade-in` reveal at the given delay. `animation-fill-mode: both`
 * holds the from-state during the delay (no flash) and the to-state after
 * (ends fully visible). `motion-reduce:animate-none` makes the element appear
 * instantly for users who prefer reduced motion.
 */
function reveal(delayMs: number) {
  return {
    className: 'animate-fade-in motion-reduce:animate-none',
    style: { animationDelay: `${delayMs}ms`, animationFillMode: 'both' as const },
  };
}

/**
 * The canonical atmospheric light hero (UI_SYSTEM §2 background): a
 * `slate-50 → white` field with floating brand orbs and a faint precision grid.
 * Composes the shared `Eyebrow`, `GradientText` and `CTAGroup`. The left copy
 * column reveals on load in an orchestrated stagger (eyebrow → title → subtitle
 * → CTAs → footnote), respecting `prefers-reduced-motion`. Pass a `media` node
 * for the optional right-side visual. One hero, every page — so heroes can't drift.
 */
export const Hero: React.FC<HeroProps> = ({
  eyebrow,
  title,
  highlight,
  subtitle,
  primaryCta,
  secondaryCta,
  media,
  footnote,
  className,
}) => (
  <section
    className={cn(
      'relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8',
      className,
    )}
  >
    {/* Light atmospheric background — floating brand orbs */}
    <div className="pointer-events-none absolute top-16 left-0 h-96 w-96 -translate-x-1/3 rounded-full bg-royal-purple/5 blur-3xl animate-float motion-reduce:animate-none" />
    <div
      className="pointer-events-none absolute bottom-0 right-0 h-[28rem] w-[28rem] translate-x-1/4 rounded-full bg-emerald-green/5 blur-3xl animate-float motion-reduce:animate-none"
      style={{ animationDelay: '1.2s' }}
    />
    <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-soft-lilac/20 blur-3xl" />
    {/* Faint precision grid overlay */}
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(to right, hsl(var(--midnight-navy) / 0.04) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--midnight-navy) / 0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }}
    />

    <div
      className={cn(
        'relative z-10 mx-auto grid max-w-7xl items-center gap-12',
        media ? 'lg:grid-cols-2 lg:gap-16' : 'max-w-3xl text-center',
      )}
    >
      {/* Left: copy + CTAs */}
      <div className="text-center lg:text-left">
        {eyebrow && (
          <div {...reveal(0)}>
            <Eyebrow icon={eyebrow.icon} label={eyebrow.label} className="mx-auto lg:mx-0" />
          </div>
        )}
        <h1
          {...reveal(120)}
          className={cn(
            reveal(120).className,
            'mt-6 font-heading text-4xl font-bold tracking-tight text-midnight-navy sm:text-5xl lg:text-6xl',
          )}
        >
          {title}
          {highlight != null && (
            <>
              <br />
              <GradientText>{highlight}</GradientText>
            </>
          )}
        </h1>
        {subtitle != null && (
          <p
            {...reveal(240)}
            className={cn(
              reveal(240).className,
              'mx-auto mt-6 max-w-xl text-lg leading-relaxed text-cool-gray md:text-xl lg:mx-0',
            )}
          >
            {subtitle}
          </p>
        )}
        {primaryCta && (
          <div {...reveal(360)}>
            <CTAGroup
              className="mt-10 justify-center lg:justify-start"
              primary={primaryCta}
              secondary={secondaryCta}
            />
          </div>
        )}
        {footnote != null && (
          <p
            {...reveal(480)}
            className={cn(reveal(480).className, 'mt-6 text-sm text-cool-gray')}
          >
            {footnote}
          </p>
        )}
      </div>

      {/* Right: optional media visual */}
      {media && (
        <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:ml-auto">{media}</div>
      )}
    </div>
  </section>
);
