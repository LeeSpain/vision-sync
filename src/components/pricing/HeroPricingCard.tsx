import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Coins, Zap, TrendingUp, Crown, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/components/ui-system';

interface TierData {
  key: string;
  descKey: string;
  icon: LucideIcon;
  popular?: boolean;
  step: number;
}

const TIERS: TierData[] = [
  { key: 'base', descKey: 'baseDesc', icon: Zap, step: 1 },
  { key: 'growth', descKey: 'growthDesc', icon: TrendingUp, popular: true, step: 2 },
  { key: 'everything', descKey: 'everythingDesc', icon: Crown, step: 3 },
];
const TOTAL_STEPS = 4; // three tiers + the VAT line

export interface HeroPricingCardProps {
  className?: string;
}

/**
 * Pricing hero visual: three tier chips (Base / Growth / Everything) that reveal
 * in sequence, Growth carrying the brand gradient accent, with a "+21% IVA" note.
 * Same card treatment + motion feel as HeroChatCard / HeroInfraCard. Reduced
 * motion renders the final state instantly.
 */
export const HeroPricingCard: React.FC<HeroPricingCardProps> = ({ className }) => {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (reduced) {
      setRevealed(TOTAL_STEPS);
      return;
    }
    setRevealed(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let s = 1; s <= TOTAL_STEPS; s++) {
      timers.push(setTimeout(() => setRevealed(s), 300 + s * 260));
    }
    return () => timers.forEach(clearTimeout);
  }, [reduced]);

  const revealStyle = (shown: boolean) => ({
    opacity: shown ? 1 : 0,
    transform: shown ? 'translateY(0)' : 'translateY(8px)',
    transition: reduced ? 'none' : 'opacity 0.5s ease-out, transform 0.5s ease-out',
  });

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
          <Coins className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-semibold text-white">{t('pricing.heroVisual.title')}</p>
          <p className="flex items-center gap-1.5 text-xs text-white/60">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-green/70 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-green" />
            </span>
            {t('pricing.heroVisual.status')}
          </p>
        </div>
      </div>

      {/* Light body — stacked tier chips */}
      <div className="flex min-h-[280px] flex-col gap-3 bg-gradient-to-b from-slate-50 to-white p-5">
        {TIERS.map((tier) => {
          const Icon = tier.icon;
          const shown = revealed >= tier.step;
          return (
            <div
              key={tier.key}
              style={revealStyle(shown)}
              className={cn(
                'flex items-center justify-between rounded-2xl border p-4',
                tier.popular
                  ? 'border-royal-purple bg-royal-purple/5 shadow-card'
                  : 'border-soft-lilac/30 bg-slate-white',
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl',
                    tier.popular ? 'bg-gradient-primary shadow-glow' : 'bg-soft-lilac/20',
                  )}
                >
                  <Icon className={cn('h-5 w-5', tier.popular ? 'text-white' : 'text-royal-purple')} />
                </div>
                <div>
                  <p className="font-heading text-sm font-bold text-midnight-navy">{t(`pricing.heroVisual.${tier.key}`)}</p>
                  <p className="text-xs text-cool-gray">{t(`pricing.heroVisual.${tier.descKey}`)}</p>
                </div>
              </div>
              {tier.popular ? (
                <span className="whitespace-nowrap rounded-full bg-gradient-primary px-2.5 py-1 text-[10px] font-semibold text-white shadow-glow">
                  {t('pricing.heroVisual.popular')}
                </span>
              ) : (
                <Check className="h-4 w-4 shrink-0 text-emerald-green" />
              )}
            </div>
          );
        })}

        {/* VAT note */}
        <p style={revealStyle(revealed >= 4)} className="mt-auto text-center text-xs font-medium text-cool-gray">
          {t('pricing.heroVisual.vat')}
        </p>
      </div>
    </div>
  );
};
