import { cn } from '@/lib/utils';

export interface DarkBandProps {
  children?: React.ReactNode;
  /** Render element. Defaults to `section`. */
  as?: 'section' | 'div';
  /** Soft brand glow orbs in the corners. Defaults to true. */
  glow?: boolean;
  className?: string;
}

/**
 * Full-width dark brand band (midnight-navy → royal-purple), the one approved
 * dark surface from DESIGN.md. White text by default; optional atmospheric glow.
 */
export const DarkBand: React.FC<DarkBandProps> = ({
  children,
  as: Tag = 'section',
  glow = true,
  className,
}) => (
  <Tag
    className={cn(
      'relative overflow-hidden bg-gradient-to-br from-midnight-navy to-royal-purple text-white',
      className,
    )}
  >
    {glow && (
      <>
        <div className="pointer-events-none absolute -right-16 -top-24 h-96 w-96 rounded-full bg-emerald-green/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-96 w-96 rounded-full bg-royal-purple/20 blur-3xl" />
      </>
    )}
    <div className="relative z-10">{children}</div>
  </Tag>
);
