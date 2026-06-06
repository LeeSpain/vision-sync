import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface CTAAction {
  label: string;
  /** Internal route ("/pricing") or absolute URL ("https://…"). */
  href?: string;
  /** Click handler (e.g. open a modal). Used when no href is given. */
  onClick?: () => void;
  /** Optional leading icon (secondary CTA only). */
  icon?: LucideIcon;
}

export interface CTAGroupProps {
  /** Primary action — gradient `hero` button with trailing arrow. */
  primary: CTAAction;
  /** Optional secondary action — `outline` button. */
  secondary?: CTAAction;
  align?: 'left' | 'center';
  className?: string;
}

function ActionButton({
  action,
  variant,
  isPrimary,
}: {
  action: CTAAction;
  variant: 'hero' | 'outline';
  isPrimary: boolean;
}) {
  const { label, href, onClick, icon: Icon } = action;

  const content = (
    <>
      {!isPrimary && Icon && <Icon className="mr-2 h-5 w-5" />}
      {label}
      {isPrimary && (
        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
      )}
    </>
  );

  const className = cn('group', isPrimary && 'shadow-lg');

  if (href) {
    const isExternal = /^https?:\/\//.test(href);
    return (
      <Button asChild variant={variant} size="lg" className={className}>
        {isExternal ? (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {content}
          </a>
        ) : (
          <Link to={href}>{content}</Link>
        )}
      </Button>
    );
  }

  return (
    <Button variant={variant} size="lg" className={className} onClick={onClick}>
      {content}
    </Button>
  );
}

/**
 * Canonical CTA pair: a gradient `hero` primary (with hover-translating trailing
 * arrow) and an optional `outline` secondary. Each action links (internal/external)
 * or fires an onClick — never a bespoke button style.
 */
export const CTAGroup: React.FC<CTAGroupProps> = ({ primary, secondary, align = 'left', className }) => (
  <div
    className={cn(
      'flex flex-col gap-4 sm:flex-row sm:items-center',
      align === 'center' && 'justify-center',
      className,
    )}
  >
    <ActionButton action={primary} variant="hero" isPrimary />
    {secondary && <ActionButton action={secondary} variant="outline" isPrimary={false} />}
  </div>
);
