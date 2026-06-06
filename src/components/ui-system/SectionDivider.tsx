import { cn } from '@/lib/utils';

export interface SectionDividerProps {
  /** "lilac" = soft solid hairline; "gradient" = brand gradient fade. */
  variant?: 'lilac' | 'gradient';
  className?: string;
}

/**
 * A hairline divider between sections. Tinted with brand tokens (never neutral
 * gray): a soft-lilac line or a centered purple→green gradient fade.
 */
export const SectionDivider: React.FC<SectionDividerProps> = ({ variant = 'lilac', className }) => (
  <div
    role="separator"
    className={cn(
      'h-px w-full',
      variant === 'gradient'
        ? 'bg-gradient-to-r from-transparent via-royal-purple/40 to-transparent'
        : 'bg-gradient-to-r from-transparent via-soft-lilac to-transparent',
      className,
    )}
  />
);
