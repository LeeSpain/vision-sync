import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EyebrowProps {
  /** Optional leading lucide icon. */
  icon?: LucideIcon;
  /** Pill label (pass already-translated copy). */
  label: string;
  className?: string;
}

/**
 * The canonical gradient-primary pill eyebrow: purple→green gradient,
 * white text, Inter, glow shadow. The one true eyebrow across the site.
 */
export const Eyebrow: React.FC<EyebrowProps> = ({ icon: Icon, label, className }) => (
  <div
    className={cn(
      'inline-flex w-fit items-center gap-2 rounded-full bg-gradient-primary px-4 py-1.5 text-sm font-medium text-white shadow-glow',
      className,
    )}
  >
    {Icon && <Icon className="h-4 w-4" />}
    {label}
  </div>
);
