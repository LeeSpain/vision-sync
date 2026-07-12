import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, History, Save, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { usePlanVersions } from '@/hooks/usePlanVersions';
import type {
  CurrencyCode, PlanVersion, PricePoints, OverageRates, PlanFeatureFlags,
} from '@/types/planVersion';

// D20: admin-editable economic levers, versioned. Reads the current plan_version,
// lets an admin edit levers, and "Save as new version" supersedes it via the
// create_plan_version RPC (immutable history). Admin-only surface (RLS-gated).

const CURRENCIES: CurrencyCode[] = ['EUR', 'USD', 'GBP'];

// Feature-flag keys mirror the seeded node slugs (PRICING_PACKAGES §3/§4).
const FEATURE_FLAG_KEYS = [
  'booking', 'lead-qualifier', 'crm-sync', 'review-manager',
  'whatsapp-agent', 'social-responder', 'email-follow-up', 'voice', 'payments',
] as const;

interface Props {
  planId: string;
  planName: string;
  defaultCurrency?: string;
}

interface LeverForm {
  pricePoints: Record<CurrencyCode, { monthly: string; setup: string }>;
  aiConversations: string;
  voiceMinutes: string;
  whatsappCap: string;
  overage: { ai_conversation: string; voice_minute: string; whatsapp_conversation: string };
  flags: Record<string, boolean>;
  notes: string;
}

const numToStr = (n: number | null | undefined): string =>
  n === null || n === undefined ? '' : String(n);

const parseNum = (s: string): number | null => {
  const t = s.trim();
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
};

const buildForm = (v: PlanVersion | null): LeverForm => {
  const pp = v?.price_points ?? {};
  const price = (c: CurrencyCode) => ({
    monthly: numToStr(pp[c]?.monthly ?? null),
    setup: numToStr(pp[c]?.setup ?? null),
  });
  const flags: Record<string, boolean> = {};
  FEATURE_FLAG_KEYS.forEach(k => { flags[k] = Boolean(v?.feature_flags?.[k]); });
  return {
    pricePoints: { EUR: price('EUR'), USD: price('USD'), GBP: price('GBP') },
    aiConversations: numToStr(v?.included_ai_conversations),
    voiceMinutes: numToStr(v?.included_voice_minutes),
    whatsappCap: numToStr(v?.whatsapp_conversation_cap),
    overage: {
      ai_conversation: numToStr(v?.overage_rates?.ai_conversation ?? null),
      voice_minute: numToStr(v?.overage_rates?.voice_minute ?? null),
      whatsapp_conversation: numToStr(v?.overage_rates?.whatsapp_conversation ?? null),
    },
    flags,
    notes: '',
  };
};

export function PlanVersionsManager({ planId, planName, defaultCurrency }: Props) {
  const { versions, current, loading, error, createVersion } = usePlanVersions(planId);
  const [form, setForm] = useState<LeverForm>(buildForm(null));
  const [saving, setSaving] = useState(false);

  // Re-seed the form whenever the current version loads/changes.
  useEffect(() => {
    setForm(buildForm(current));
  }, [current]);

  const setPrice = (c: CurrencyCode, field: 'monthly' | 'setup', value: string) =>
    setForm(f => ({ ...f, pricePoints: { ...f.pricePoints, [c]: { ...f.pricePoints[c], [field]: value } } }));

  const handleSave = async () => {
    if (form.notes.trim() === '') {
      toast.error('Add a short note describing this version change.');
      return;
    }
    // Only include currencies that have at least a monthly price set.
    const price_points: PricePoints = {};
    CURRENCIES.forEach(c => {
      const monthly = parseNum(form.pricePoints[c].monthly);
      const setup = parseNum(form.pricePoints[c].setup);
      if (monthly !== null || setup !== null) price_points[c] = { monthly, setup };
    });
    const overage_rates: OverageRates = {};
    const ai = parseNum(form.overage.ai_conversation);
    const vm = parseNum(form.overage.voice_minute);
    const wa = parseNum(form.overage.whatsapp_conversation);
    if (ai !== null) overage_rates.ai_conversation = ai;
    if (vm !== null) overage_rates.voice_minute = vm;
    if (wa !== null) overage_rates.whatsapp_conversation = wa;
    const feature_flags: PlanFeatureFlags = { ...form.flags };

    setSaving(true);
    try {
      await createVersion({
        plan_id: planId,
        price_points,
        included_ai_conversations: parseNum(form.aiConversations),
        included_voice_minutes: parseNum(form.voiceMinutes),
        whatsapp_conversation_cap: parseNum(form.whatsappCap),
        overage_rates,
        feature_flags,
        notes: form.notes.trim(),
      });
      toast.success(`Saved v${(current?.version ?? 0) + 1} of ${planName}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save version');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-cool-gray">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading versions…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
        Couldn’t load plan versions: {error}
      </div>
    );
  }

  const inputCls = 'bg-white border-slate-200 text-midnight-navy';

  return (
    <div className="space-y-6">
      {/* Current version header */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-cool-gray">
          {current
            ? <>Editing from current <span className="font-semibold text-midnight-navy">v{current.version}</span>. Saving creates <span className="font-semibold text-midnight-navy">v{current.version + 1}</span>.</>
            : <>No version yet — saving creates <span className="font-semibold text-midnight-navy">v1</span>.</>}
        </div>
        {current && <Badge variant="outline" className="border-emerald-500/30 text-emerald-500">current v{current.version}</Badge>}
      </div>

      {/* Price points per currency (D13 set points) */}
      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-midnight-navy">Price points (per currency, set — not FX)</h4>
        <div className="grid gap-3 sm:grid-cols-3">
          {CURRENCIES.map(c => (
            <div key={c} className="rounded-lg border border-soft-lilac/30 p-3 space-y-2">
              <div className="text-xs font-semibold text-midnight-navy">{c}</div>
              <div className="space-y-1">
                <Label className="text-xs text-cool-gray">Monthly</Label>
                <Input type="number" inputMode="decimal" className={inputCls}
                  value={form.pricePoints[c].monthly}
                  onChange={e => setPrice(c, 'monthly', e.target.value)} placeholder="—" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-cool-gray">Setup</Label>
                <Input type="number" inputMode="decimal" className={inputCls}
                  value={form.pricePoints[c].setup}
                  onChange={e => setPrice(c, 'setup', e.target.value)} placeholder="—" />
              </div>
            </div>
          ))}
        </div>
        {defaultCurrency && (
          <p className="text-xs text-cool-gray">Plan’s default currency: {defaultCurrency}.</p>
        )}
      </section>

      {/* Included allowances */}
      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-midnight-navy">Included allowances</h4>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <Label className="text-xs text-cool-gray">AI conversations / mo</Label>
            <Input type="number" className={inputCls} value={form.aiConversations}
              onChange={e => setForm(f => ({ ...f, aiConversations: e.target.value }))} placeholder="e.g. 1000" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-cool-gray">Voice minutes / mo</Label>
            <Input type="number" className={inputCls} value={form.voiceMinutes}
              onChange={e => setForm(f => ({ ...f, voiceMinutes: e.target.value }))} placeholder="e.g. 200" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-cool-gray">WhatsApp conversations / mo</Label>
            <Input type="number" className={inputCls} value={form.whatsappCap}
              onChange={e => setForm(f => ({ ...f, whatsappCap: e.target.value }))} placeholder="cap (blank = none)" />
          </div>
        </div>
      </section>

      {/* Overage rates */}
      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-midnight-navy">Overage rates (per unit past the allowance)</h4>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <Label className="text-xs text-cool-gray">Per AI conversation</Label>
            <Input type="number" inputMode="decimal" className={inputCls} value={form.overage.ai_conversation}
              onChange={e => setForm(f => ({ ...f, overage: { ...f.overage, ai_conversation: e.target.value } }))} placeholder="0.00" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-cool-gray">Per voice minute</Label>
            <Input type="number" inputMode="decimal" className={inputCls} value={form.overage.voice_minute}
              onChange={e => setForm(f => ({ ...f, overage: { ...f.overage, voice_minute: e.target.value } }))} placeholder="0.00" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-cool-gray">Per WhatsApp conversation</Label>
            <Input type="number" inputMode="decimal" className={inputCls} value={form.overage.whatsapp_conversation}
              onChange={e => setForm(f => ({ ...f, overage: { ...f.overage, whatsapp_conversation: e.target.value } }))} placeholder="0.00" />
          </div>
        </div>
      </section>

      {/* Feature flags */}
      <section className="space-y-3">
        <h4 className="text-sm font-semibold text-midnight-navy">Per-tier feature flags</h4>
        <div className="grid gap-2 sm:grid-cols-3">
          {FEATURE_FLAG_KEYS.map(k => (
            <label key={k} className="flex items-center justify-between rounded-lg border border-soft-lilac/30 px-3 py-2">
              <span className="text-sm text-midnight-navy">{k}</span>
              <Switch checked={form.flags[k]}
                onCheckedChange={val => setForm(f => ({ ...f, flags: { ...f.flags, [k]: val } }))} />
            </label>
          ))}
        </div>
      </section>

      {/* Version note + save */}
      <section className="space-y-2">
        <Label className="text-xs text-cool-gray">Version note (required — what changed & why)</Label>
        <Textarea className={inputCls} rows={2} value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          placeholder="e.g. Raised Growth to €449, added booking flag" />
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="bg-indigo-500 hover:bg-indigo-600 text-white">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save as new version
          </Button>
        </div>
      </section>

      {/* History */}
      <section className="space-y-2 border-t border-soft-lilac/20 pt-4">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-midnight-navy">
          <History className="h-4 w-4" /> Version history
        </h4>
        {versions.length === 0 ? (
          <p className="text-sm text-cool-gray">No versions yet.</p>
        ) : (
          <ul className="space-y-1">
            {versions.map(v => (
              <li key={v.id} className="flex items-center justify-between rounded-lg border border-soft-lilac/20 px-3 py-2 text-sm">
                <span className="flex items-center gap-2">
                  <span className="font-semibold text-midnight-navy">v{v.version}</span>
                  {v.is_current && <Check className="h-3.5 w-3.5 text-emerald-500" />}
                  <span className="text-cool-gray">{v.notes || '—'}</span>
                </span>
                <span className="text-xs text-cool-gray">{new Date(v.created_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
