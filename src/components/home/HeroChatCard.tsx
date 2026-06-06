import { useEffect, useState } from 'react';
import { Bot, Check, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/components/ui-system';

type Sender = 'customer' | 'ai' | 'system';
interface ScriptLine {
  from: Sender;
  key: string;
}

// The booking demo: customer asks → AI offers times → customer picks →
// AI confirms → "appointment booked" chip.
const SCRIPT: ScriptLine[] = [
  { from: 'customer', key: 'index.heroChat.msg1' },
  { from: 'ai', key: 'index.heroChat.msg2' },
  { from: 'customer', key: 'index.heroChat.msg3' },
  { from: 'ai', key: 'index.heroChat.msg4' },
  { from: 'system', key: 'index.heroChat.booked' },
];

export interface HeroChatCardProps {
  className?: string;
}

/**
 * Product-proof: a live-looking AI chat card. Dark header + light thread whose
 * messages reveal in sequence (AI lines preceded by a typing indicator). When
 * the user prefers reduced motion, the whole thread renders instantly.
 */
export const HeroChatCard: React.FC<HeroChatCardProps> = ({ className }) => {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (reduced) {
      setRevealed(SCRIPT.length);
      setTyping(false);
      return;
    }
    setRevealed(0);
    setTyping(false);
    const timers: ReturnType<typeof setTimeout>[] = [];
    let at = 450;
    SCRIPT.forEach((line, i) => {
      if (line.from === 'ai') {
        timers.push(setTimeout(() => setTyping(true), at));
        at += 850;
        timers.push(
          setTimeout(() => {
            setTyping(false);
            setRevealed(i + 1);
          }, at),
        );
        at += 650;
      } else {
        timers.push(setTimeout(() => setRevealed(i + 1), at));
        at += 750;
      }
    });
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
          <p className="truncate font-heading text-sm font-semibold text-white">
            {t('index.heroChat.agentName')}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-white/60">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-green/70 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-green" />
            </span>
            {t('index.heroChat.status')}
          </p>
        </div>
      </div>

      {/* Light thread */}
      <div className="flex min-h-[280px] flex-col gap-3 bg-gradient-to-b from-slate-50 to-white p-5">
        {SCRIPT.slice(0, revealed).map((line, i) => {
          if (line.from === 'system') {
            return (
              <div key={i} className="flex justify-center pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-green/10 px-3 py-1.5 text-xs font-semibold text-emerald-green animate-fade-in motion-reduce:animate-none">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {t(line.key)}
                </span>
              </div>
            );
          }
          const isCustomer = line.from === 'customer';
          return (
            <div
              key={i}
              className={cn(
                'flex items-end gap-2 animate-slide-up motion-reduce:animate-none',
                isCustomer ? 'justify-end' : 'justify-start',
              )}
            >
              {!isCustomer && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-primary">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[78%] rounded-2xl px-3.5 py-2 text-sm leading-snug',
                  isCustomer
                    ? 'rounded-br-md bg-royal-purple/10 text-midnight-navy'
                    : 'rounded-bl-md border border-soft-lilac/30 bg-slate-white text-midnight-navy',
                )}
              >
                {t(line.key)}
              </div>
              {isCustomer && (
                <Check className="mb-1 h-3.5 w-3.5 shrink-0 text-emerald-green" />
              )}
            </div>
          );
        })}

        {/* Typing indicator before an AI reply */}
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
      </div>
    </div>
  );
};
