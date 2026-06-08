import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Lightbulb, Building2, Stethoscope, Scale, Palmtree, Dumbbell, UtensilsCrossed, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/components/ui-system';

interface IndustryData {
  icon: LucideIcon;
  labelKey: string;
}

const INDUSTRIES: IndustryData[] = [
  { icon: Building2, labelKey: 'estate' },
  { icon: Stethoscope, labelKey: 'dental' },
  { icon: Scale, labelKey: 'legal' },
  { icon: Palmtree, labelKey: 'rentals' },
  { icon: Dumbbell, labelKey: 'gyms' },
  { icon: UtensilsCrossed, labelKey: 'restaurants' },
];

export interface HeroBlueprintCardProps {
  className?: string;
}

/**
 * Solutions hero visual: a stack of industry blueprints where the active one
 * cycles, highlighting each industry's ready-made AI blueprint in turn. Same card
 * treatment + motion feel as HeroChatCard / HeroInfraCard. Reduced motion holds a
 * single static highlight (no cycling).
 */
export const HeroBlueprintCard: React.FC<HeroBlueprintCardProps> = ({ className }) => {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced) {
      setActive(0);
      return;
    }
    const id = setInterval(() => setActive((a) => (a + 1) % INDUSTRIES.length), 1600);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div
      className={cn(
        'w-full max-w-md overflow-hidden rounded-3xl border border-soft-lilac/30 bg-slate-white shadow-hover',
        className,
      )}
    >
      {/* Dark header */}
      <div className="flex items-center gap-3 bg-midnight-navy px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
          <Lightbulb className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-semibold text-white">{t('solutionsIndex.heroVisual.title')}</p>
          <p className="flex items-center gap-1.5 text-xs text-white/60">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-green/70 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-green" />
            </span>
            {t('solutionsIndex.heroVisual.status')}
          </p>
        </div>
      </div>

      {/* Light body — cycling industry blueprints */}
      <div className="flex min-h-[280px] flex-col justify-center gap-2.5 bg-gradient-to-b from-slate-50 to-white p-5">
        {INDUSTRIES.map((ind, i) => {
          const Icon = ind.icon;
          const isActive = active === i;
          return (
            <div
              key={ind.labelKey}
              className={cn(
                'flex items-center gap-3 rounded-2xl border p-3 transition-all duration-300',
                isActive ? 'border-royal-purple bg-royal-purple/5 shadow-card' : 'border-soft-lilac/20 bg-slate-white',
              )}
            >
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-300',
                  isActive ? 'bg-gradient-primary text-white shadow-glow' : 'bg-soft-lilac/20 text-royal-purple',
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className={cn('flex-1 text-sm font-medium transition-colors', isActive ? 'text-midnight-navy' : 'text-cool-gray')}>
                {t(`solutionsIndex.heroVisual.${ind.labelKey}`)}
              </span>
              {isActive && <ArrowRight className="h-4 w-4 shrink-0 text-royal-purple animate-fade-in motion-reduce:animate-none" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
