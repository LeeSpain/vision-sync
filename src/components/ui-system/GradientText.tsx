import { cn } from '@/lib/utils';

export interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Clips the brand purple→green gradient to its text. Use to emphasise a
 * single word/phrase inside a heading. Inherits font size/weight from parent.
 */
export const GradientText: React.FC<GradientTextProps> = ({ children, className }) => (
  <span className={cn('bg-gradient-primary bg-clip-text text-transparent', className)}>
    {children}
  </span>
);
