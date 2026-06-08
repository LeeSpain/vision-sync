import { useEffect, useState } from 'react';
import { Bot, Check, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/components/ui-system';

export interface HeroMessageCardProps {
  className?: string;
}

/**
 * Contact hero visual: a focused message → typing → reply exchange, closing on a
 * "replies in English & Spanish" stat. Same card treatment + motion feel as the
 * homepage HeroChatCard. Reduced motion renders the whole exchange instantly.
 */
export const HeroMessageCard: React.FC<HeroMessageCardProps> = ({ className }) => {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(0); // 1 = sent, 2 = reply, 3 = stat
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (reduced) {
      setRevealed(3);
      setTyping(false);
      return;
    }
    setRevealed(0);
    setTyping(false);
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setRevealed(1), 450));
    timers.push(setTimeout(() => setTyping(true), 1100));
    timers.push(
      setTimeout(() => {
        setTyping(false);
        setRevealed(2);
      }, 2100),
    );
    timers.push(setTimeout(() => setRevealed(3), 2700));
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
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-semibold text-white">{t('contact.heroVisual.agentName')}</p>
          <p className="flex items-center gap-1.5 text-xs text-white/60">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-green/70 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-green" />
            </span>
            {t('contact.heroVisual.status')}
          </p>
        </div>
      </div>

      {/* Light body */}
      <div className="flex min-h-[280px] flex-col gap-3 bg-gradient-to-b from-slate-50 to-white p-5">
        {/* Sent message */}
        {revealed >= 1 && (
          <div className="flex items-end justify-end gap-2 animate-slide-up motion-reduce:animate-none">
            <div className="max-w-[78%] rounded-2xl rounded-br-md bg-royal-purple/10 px-3.5 py-2 text-sm leading-snug text-midnight-navy">
              {t('contact.heroVisual.sent')}
            </div>
            <Check className="mb-1 h-3.5 w-3.5 shrink-0 text-emerald-green" />
          </div>
        )}

        {/* Typing indicator */}
        {typing && (
          <div className="flex items-end gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-primary">
              <Bot className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-soft-lilac/30 bg-slate-white px-3.5 py-2.5">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-cool-gray"
                  style={{ animationDelay: `${d * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Reply */}
        {revealed >= 2 && (
          <div className="flex items-end gap-2 animate-slide-up motion-reduce:animate-none">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-primary">
              <Bot className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="max-w-[78%] rounded-2xl rounded-bl-md border border-soft-lilac/30 bg-slate-white px-3.5 py-2 text-sm leading-snug text-midnight-navy">
              {t('contact.heroVisual.reply')}
            </div>
          </div>
        )}

        {/* Bilingual stat */}
        {revealed >= 3 && (
          <div className="mt-auto flex justify-center pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-green/10 px-3 py-1.5 text-xs font-semibold text-emerald-green animate-fade-in motion-reduce:animate-none">
              <Languages className="h-3.5 w-3.5" />
              {t('contact.heroVisual.stat')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
