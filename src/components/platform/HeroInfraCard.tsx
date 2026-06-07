import { useEffect, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Cpu, Phone, MessageCircle, MessageSquare, Database, Calendar, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/components/ui-system';

interface DiagramNodeData {
  icon: LucideIcon;
  labelKey: string;
  /** Position within the diagram body, as a percentage (viewBox-aligned). */
  x: number;
  y: number;
  /** Reveal threshold — the node (and its connection) appears once revealed >= step. */
  step: number;
}

const CORE = { x: 50, y: 50 };

// Input channels feed the AI core; the core fans out to the action outputs.
const INPUTS: DiagramNodeData[] = [
  { icon: Phone, labelKey: 'platform.infra.calls', x: 16, y: 22, step: 2 },
  { icon: MessageCircle, labelKey: 'platform.infra.chat', x: 14, y: 50, step: 3 },
  { icon: MessageSquare, labelKey: 'platform.infra.whatsapp', x: 16, y: 78, step: 4 },
];
const OUTPUTS: DiagramNodeData[] = [
  { icon: Database, labelKey: 'platform.infra.crm', x: 84, y: 22, step: 5 },
  { icon: Calendar, labelKey: 'platform.infra.bookings', x: 86, y: 50, step: 6 },
  { icon: Mail, labelKey: 'platform.infra.followUp', x: 84, y: 78, step: 7 },
];
const TOTAL_STEPS = 7;

function DiagramNode({ node, shown, reduced }: { node: DiagramNodeData; shown: boolean; reduced: boolean }) {
  const { t } = useTranslation();
  const Icon = node.icon;
  return (
    <div
      className="absolute flex flex-col items-center gap-1"
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
        opacity: shown ? 1 : 0,
        transform: shown ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.8)',
        transition: reduced ? 'none' : 'opacity 0.5s ease-out, transform 0.5s ease-out',
      }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-soft-lilac/30 bg-slate-white shadow-card">
        <Icon className="h-5 w-5 text-royal-purple" />
      </div>
      <span className="whitespace-nowrap text-[10px] font-medium text-cool-gray">{t(node.labelKey)}</span>
    </div>
  );
}

export interface HeroInfraCardProps {
  className?: string;
}

/**
 * Product-proof for the Platform hero: an animated "AI infrastructure" diagram.
 * A Vision-Sync AI core fans in from input channels (calls / chat / WhatsApp) and
 * fans out to actions (CRM / bookings / follow-up). On load the core, then each
 * channel + its connecting line, then each action draws in sequence. With reduced
 * motion the whole diagram renders in its final state instantly. Same card
 * treatment and motion feel as the homepage HeroChatCard.
 */
export const HeroInfraCard: React.FC<HeroInfraCardProps> = ({ className }) => {
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
      timers.push(setTimeout(() => setRevealed(s), 300 + s * 220));
    }
    return () => timers.forEach(clearTimeout);
  }, [reduced]);

  const lineStyle = (shown: boolean) => ({
    strokeDashoffset: shown ? 0 : 1,
    opacity: shown ? 1 : 0,
    transition: reduced ? 'none' : 'stroke-dashoffset 0.6s ease-out, opacity 0.4s ease-out',
  });

  return (
    <div
      className={cn(
        'w-full max-w-md overflow-hidden rounded-3xl border border-soft-lilac/30 bg-slate-white shadow-hover',
        className,
      )}
    >
      {/* Dark header — the AI core identity */}
      <div className="flex items-center gap-3 bg-midnight-navy px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
          <Cpu className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-semibold text-white">
            {t('platform.infra.coreName')}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-white/60">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-green/70 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-green" />
            </span>
            {t('platform.infra.coreStatus')}
          </p>
        </div>
      </div>

      {/* Light diagram body */}
      <div className="relative min-h-[320px] bg-gradient-to-b from-slate-50 to-white p-5">
        {/* Connection lines (drawn behind the nodes) */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="infra-line-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(var(--royal-purple))" />
              <stop offset="100%" stopColor="hsl(var(--emerald-green))" />
            </linearGradient>
          </defs>
          {INPUTS.map((node) => (
            <line
              key={node.labelKey}
              x1={node.x}
              y1={node.y}
              x2={CORE.x}
              y2={CORE.y}
              stroke="url(#infra-line-gradient)"
              strokeWidth={1.5}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              pathLength={1}
              strokeDasharray={1}
              style={lineStyle(revealed >= node.step)}
            />
          ))}
          {OUTPUTS.map((node) => (
            <line
              key={node.labelKey}
              x1={CORE.x}
              y1={CORE.y}
              x2={node.x}
              y2={node.y}
              stroke="url(#infra-line-gradient)"
              strokeWidth={1.5}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              pathLength={1}
              strokeDasharray={1}
              style={lineStyle(revealed >= node.step)}
            />
          ))}
        </svg>

        {/* Nodes */}
        {INPUTS.map((node) => (
          <DiagramNode key={node.labelKey} node={node} shown={revealed >= node.step} reduced={reduced} />
        ))}
        {OUTPUTS.map((node) => (
          <DiagramNode key={node.labelKey} node={node} shown={revealed >= node.step} reduced={reduced} />
        ))}

        {/* AI core (centre) */}
        <div
          className="absolute flex flex-col items-center gap-1.5"
          style={{
            left: `${CORE.x}%`,
            top: `${CORE.y}%`,
            opacity: revealed >= 1 ? 1 : 0,
            transform: revealed >= 1 ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.8)',
            transition: reduced ? 'none' : 'opacity 0.5s ease-out, transform 0.5s ease-out',
          }}
        >
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
            <span className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-20 animate-ping motion-reduce:animate-none" />
            <Cpu className="relative h-7 w-7 text-white" />
          </div>
          <span className="whitespace-nowrap text-[10px] font-semibold text-midnight-navy">
            {t('platform.infra.core')}
          </span>
        </div>
      </div>
    </div>
  );
};
