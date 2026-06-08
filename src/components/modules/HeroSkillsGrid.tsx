import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { LayoutGrid, Mail, Mic, RefreshCw, Calendar, Star, MessageSquare, MessageCircle, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/components/ui-system';

interface SkillData {
  icon: LucideIcon;
  labelKey: string;
}

const SKILLS: SkillData[] = [
  { icon: Mail, labelKey: 'email' },
  { icon: Mic, labelKey: 'voice' },
  { icon: RefreshCw, labelKey: 'crm' },
  { icon: Calendar, labelKey: 'bookings' },
  { icon: Star, labelKey: 'reviews' },
  { icon: MessageSquare, labelKey: 'whatsapp' },
  { icon: MessageCircle, labelKey: 'social' },
  { icon: BarChart3, labelKey: 'analytics' },
];

export interface HeroSkillsGridProps {
  className?: string;
}

/**
 * Modules hero visual: an app-style grid of AI skills that light up in sequence —
 * echoing "add skills like installing apps." Same card treatment + motion feel as
 * HeroChatCard / HeroInfraCard. Reduced motion shows every tile lit instantly.
 */
export const HeroSkillsGrid: React.FC<HeroSkillsGridProps> = ({ className }) => {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const [lit, setLit] = useState(0);

  useEffect(() => {
    if (reduced) {
      setLit(SKILLS.length);
      return;
    }
    setLit(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= SKILLS.length; i++) {
      timers.push(setTimeout(() => setLit(i), 300 + i * 200));
    }
    return () => timers.forEach(clearTimeout);
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
          <LayoutGrid className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-semibold text-white">{t('modules.heroVisual.title')}</p>
          <p className="flex items-center gap-1.5 text-xs text-white/60">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-green/70 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-green" />
            </span>
            {t('modules.heroVisual.status')}
          </p>
        </div>
      </div>

      {/* Light body — app grid lighting up in sequence */}
      <div className="grid min-h-[280px] grid-cols-4 content-center gap-3 bg-gradient-to-b from-slate-50 to-white p-5">
        {SKILLS.map((skill, i) => {
          const Icon = skill.icon;
          const on = lit > i;
          return (
            <div
              key={skill.labelKey}
              className={cn(
                'flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-2.5 duration-300',
                on ? 'border-royal-purple/30 bg-royal-purple/10' : 'border-soft-lilac/20 bg-slate-50',
              )}
              style={{
                transform: on ? 'scale(1)' : 'scale(0.92)',
                transition: reduced ? 'none' : 'transform 0.3s ease-out, background-color 0.3s, border-color 0.3s',
              }}
            >
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-300',
                  on ? 'bg-gradient-primary text-white shadow-glow' : 'bg-white text-cool-gray',
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className={cn('text-[10px] font-medium transition-colors', on ? 'text-royal-purple' : 'text-cool-gray')}>
                {t(`modules.heroVisual.${skill.labelKey}`)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
