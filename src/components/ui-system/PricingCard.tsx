import { ArrowRight, CheckCircle, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PricingCardProps {
  name: string;
  tagline?: string;
  /** Pre-formatted price, e.g. "€489" (currency lives with the consumer). */
  price: string;
  /** e.g. "/mo". */
  perMonthLabel?: string;
  /** e.g. "+21% IVA (€592 inc.)". */
  vatNote?: string;
  /** e.g. "1,500 voice min" — omit / empty to hide the voice row. */
  voiceNote?: string;
  /** Full cumulative feature list. */
  includes: string[];
  /** Marks the highlighted tier (gradient accent + "Most Popular"). */
  popular?: boolean;
  /** Defaults to "Most Popular". */
  popularLabel?: string;
  /** Static CTA button label (display mode). */
  ctaLabel?: string;
  onCtaClick?: () => void;
  /**
   * Selectable mode: when `onClick` is given the whole card becomes a button
   * (e.g. a wizard tier picker). `selected` drives the chosen-state accent and
   * swaps the CTA for a Select/Selected pill labelled by `selectLabel`/`selectedLabel`.
   */
  onClick?: () => void;
  selected?: boolean;
  selectLabel?: string;
  selectedLabel?: string;
  className?: string;
}

/**
 * Pricing tier card. The popular tier gets the brand gradient accent: a
 * royal-purple border, the gradient "Most Popular" pill, and a gradient CTA.
 * Non-popular tiers use the standard soft-lilac card + outline CTA.
 *
 * Pass `onClick` to use it as a selectable wizard card: the whole card becomes
 * a button and `selected` lights up the royal-purple accent + gradient pill.
 */
export const PricingCard: React.FC<PricingCardProps> = ({
  name,
  tagline,
  price,
  perMonthLabel,
  vatNote,
  voiceNote,
  includes,
  popular = false,
  popularLabel = 'Most Popular',
  ctaLabel,
  onCtaClick,
  onClick,
  selected = false,
  selectLabel,
  selectedLabel,
  className,
}) => {
  const selectable = !!onClick;

  const cardClass = cn(
    'relative flex flex-col rounded-3xl bg-slate-white p-7 shadow-card transition-smooth',
    selectable && 'text-left',
    selected
      ? 'border-2 border-royal-purple'
      : popular
        ? selectable
          ? 'border-2 border-royal-purple/40'
          : 'border-2 border-royal-purple shadow-hover'
        : 'border border-soft-lilac/30 hover:-translate-y-1 hover:shadow-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0',
    className,
  );

  const inner = (
    <>
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-white shadow-glow">
          {popularLabel}
        </span>
      )}

      <h3 className="mb-1 font-heading text-xl font-bold text-midnight-navy">{name}</h3>
      {tagline && <p className="mb-5 min-h-[40px] text-sm leading-relaxed text-cool-gray">{tagline}</p>}

      <div className="mb-1">
        <span className="font-heading text-4xl font-bold text-midnight-navy">{price}</span>
        {perMonthLabel && <span className="text-base text-cool-gray">{perMonthLabel}</span>}
      </div>
      {vatNote && <p className="mb-5 text-xs text-cool-gray">{vatNote}</p>}

      {voiceNote && (
        <div className="mb-5 flex items-center gap-2 text-sm font-medium text-electric-blue">
          <Mic className="h-4 w-4 shrink-0" />
          {voiceNote}
        </div>
      )}

      <ul className="mb-6 flex-grow space-y-2.5">
        {includes.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-green" />
            <span className="text-sm leading-snug text-midnight-navy/80">{item}</span>
          </li>
        ))}
      </ul>

      {selectable ? (
        <div
          className={cn(
            'mt-auto w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-colors',
            selected ? 'bg-gradient-primary text-white' : 'bg-soft-lilac/15 text-royal-purple',
          )}
        >
          {selected ? selectedLabel : selectLabel}
        </div>
      ) : (
        ctaLabel && (
          <Button
            variant={popular ? 'hero' : 'outline'}
            size="lg"
            className="group mt-auto w-full"
            onClick={onCtaClick}
          >
            {ctaLabel}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
          </Button>
        )
      )}
    </>
  );

  if (selectable) {
    return (
      <button type="button" onClick={onClick} className={cardClass}>
        {inner}
      </button>
    );
  }

  return <div className={cardClass}>{inner}</div>;
};
