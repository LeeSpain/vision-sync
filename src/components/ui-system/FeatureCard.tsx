import type { LucideIcon } from 'lucide-react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface FeatureCardProps {
  /** Optional lucide icon shown in the single gradient accent tile. */
  icon?: LucideIcon;
  title: string;
  body?: string;
  /** Optional checklist items (all use the same emerald check — no per-item colours). */
  items?: string[];
  /** Optional corner badge label. */
  badge?: string;
  /** Optional muted status/footnote line pinned to the card bottom — smaller,
   *  cool-gray, separated by a hairline; never a checklist item (no checkmark). */
  meta?: string;
  /** Optional destination. When set, the whole card becomes a link (internal route or absolute URL). */
  href?: string;
  /** Optional CTA affordance label shown bottom-left with a trailing arrow (needs `href`). */
  ctaLabel?: string;
  className?: string;
}

/**
 * White feature card — soft-lilac border, rounded-3xl, resting card shadow that
 * lifts to hover. One brand accent only: the gradient icon tile. Checklist items
 * all share the emerald-green check; never a rainbow of per-item colours.
 *
 * Provide `href` (+ optional `ctaLabel`) to make the whole card a link with a
 * bottom CTA affordance. Without `href` it renders as a plain static card.
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  body,
  items,
  badge,
  meta,
  href,
  ctaLabel,
  className,
}) => {
  const cardClass = cn(
    'group relative flex flex-col rounded-3xl border border-soft-lilac/30 bg-slate-white p-7 shadow-card transition-smooth hover:-translate-y-1 hover:shadow-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0',
    className,
  );

  const inner = (
    <>
      {badge && (
        <span className="absolute right-5 top-5 inline-flex items-center rounded-full bg-emerald-green/10 px-2.5 py-1 text-xs font-semibold text-emerald-green">
          {badge}
        </span>
      )}

      {Icon && (
        <div className="mb-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
          <Icon className="h-6 w-6 text-white" />
        </div>
      )}

      <h3 className="mb-2 font-heading text-xl font-bold text-midnight-navy">{title}</h3>
      {body && <p className="leading-relaxed text-cool-gray">{body}</p>}

      {items && items.length > 0 && (
        <ul className="mt-5 space-y-2.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-midnight-navy/80">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-green" />
              <span className="leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      )}

      {meta && (
        <p className="mt-auto border-t border-soft-lilac/20 pt-4 text-xs leading-snug text-cool-gray">
          {meta}
        </p>
      )}

      {href && ctaLabel && (
        <div
          className={cn(
            'flex items-center gap-1.5 pt-5 text-sm font-semibold text-royal-purple',
            !meta && 'mt-auto',
          )}
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
        </div>
      )}
    </>
  );

  if (href) {
    if (/^https?:\/\//.test(href)) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cardClass}>
          {inner}
        </a>
      );
    }
    return (
      <Link to={href} className={cardClass}>
        {inner}
      </Link>
    );
  }

  return <div className={cardClass}>{inner}</div>;
};
