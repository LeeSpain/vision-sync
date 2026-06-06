import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Eyebrow } from './Eyebrow';
import { GradientText } from './GradientText';

export interface SectionHeadingProps {
  /** Optional eyebrow pill label. */
  eyebrow?: string;
  /** Optional eyebrow icon (only used when `eyebrow` is set). */
  eyebrowIcon?: LucideIcon;
  /** Main heading copy. */
  title: string;
  /** Optional phrase appended to the title and gradient-clipped for emphasis. */
  highlight?: string;
  /** Optional supporting line under the title. */
  subtitle?: string;
  /** Text alignment. Defaults to center. */
  align?: 'left' | 'center';
  className?: string;
}

/**
 * Section header: eyebrow pill + Poppins title (with one optional
 * gradient-clipped phrase) + cool-gray subtitle. Center or left aligned.
 */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  eyebrowIcon,
  title,
  highlight,
  subtitle,
  align = 'center',
  className,
}) => {
  const center = align === 'center';
  return (
    <div className={cn('max-w-3xl', center ? 'mx-auto text-center' : 'text-left', className)}>
      {eyebrow && (
        <Eyebrow icon={eyebrowIcon} label={eyebrow} className={cn('mb-4', center && 'mx-auto')} />
      )}
      <h2 className="font-heading text-3xl font-bold tracking-tight text-midnight-navy md:text-4xl">
        {title}
        {highlight && (
          <>
            {' '}
            <GradientText>{highlight}</GradientText>
          </>
        )}
      </h2>
      {subtitle && <p className="mt-4 text-lg leading-relaxed text-cool-gray">{subtitle}</p>}
    </div>
  );
};
