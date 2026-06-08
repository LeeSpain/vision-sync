import { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle, Mic, Loader2, AlertTriangle, Coins, Pencil, Trash2, Plus, X, ArrowRight, Sparkles,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SectionHeading } from '@/components/ui-system';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// ─────────────────────────────────────────────────────────────────────────────
// Pricing admin — P1 stage 2b: DRAFT editing.
// Edits write ONLY to the draft_* columns (+ has_draft / has_draft_changes flags).
// The LIVE columns and the public site are never touched here. Publish is Stage 3.
// ─────────────────────────────────────────────────────────────────────────────

const TIER_ORDER: Record<string, number> = { base: 0, growth: 1, everything: 2 };
const VAT_RATE = 1.21;
const suggestIncVat = (ex: number) => Math.round(ex * VAT_RATE);

interface AdminPackage {
  id: string;
  industryId: string;
  tier: string;
  // live values (public reads these)
  name: string;
  exVatPrice: number;
  incVatPrice: number;
  voiceMinutes: number;
  tagline: string;
  includes: string[];
  sortOrder: number;
  // draft working copy
  hasDraft: boolean;
  draftName: string | null;
  draftExVatPrice: number | null;
  draftIncVatPrice: number | null;
  draftVoiceMinutes: number | null;
  draftTagline: string | null;
  draftIncludes: string[] | null;
}

interface AdminIndustry {
  id: string;
  slug: string;
  name: string;
  coreServiceLine: string | null;
  voiceNative: boolean;
  sortOrder: number;
  isPublished: boolean;
  hasDraftChanges: boolean;
  packages: AdminPackage[];
}

interface EditForm {
  name: string;
  exVatPrice: string;
  incVatPrice: string;
  voiceMinutes: string;
  tagline: string;
  includes: string[];
}

const asStringArray = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []);

function Badge({ tone, children }: { tone: 'emerald' | 'coral' | 'purple'; children: React.ReactNode }) {
  const tones = {
    emerald: 'bg-emerald-green/10 text-emerald-green',
    coral: 'bg-coral-orange/10 text-coral-orange',
    purple: 'bg-royal-purple/10 text-royal-purple',
  } as const;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${tone === 'emerald' ? 'bg-emerald-green' : tone === 'coral' ? 'bg-coral-orange' : 'bg-royal-purple'}`} />
      {children}
    </span>
  );
}

/** Renders a scalar field, showing "live → draft" when the draft differs. */
function ScalarDiff({ live, draft, hasDraft, prefix = '', suffix = '' }: { live: string; draft: string | null; hasDraft: boolean; prefix?: string; suffix?: string }) {
  const changed = hasDraft && draft !== null && draft !== live;
  if (!changed) {
    return <span>{prefix}{live}{suffix}</span>;
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-cool-gray line-through">{prefix}{live}{suffix}</span>
      <ArrowRight className="h-3.5 w-3.5 text-royal-purple" />
      <span className="font-semibold text-royal-purple">{prefix}{draft}{suffix}</span>
    </span>
  );
}

function TierCard({ pkg, onEdit, onDiscard, discarding }: {
  pkg: AdminPackage;
  onEdit: (pkg: AdminPackage) => void;
  onDiscard: (pkg: AdminPackage) => void;
  discarding: boolean;
}) {
  const d = pkg.hasDraft;
  const draftIncludes = pkg.draftIncludes ?? [];
  const includesChanged = d && JSON.stringify(draftIncludes) !== JSON.stringify(pkg.includes);

  return (
    <div className={`flex flex-col rounded-2xl border bg-gradient-to-b from-slate-50 to-white p-5 ${d ? 'border-royal-purple/40' : 'border-soft-lilac/30'}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-royal-purple/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-royal-purple">
          {pkg.tier}
        </span>
        {d && <Badge tone="purple">Unpublished changes</Badge>}
      </div>

      {/* Name */}
      <h4 className="mt-3 font-heading text-base font-bold text-midnight-navy">
        <ScalarDiff live={pkg.name} draft={pkg.draftName} hasDraft={d} />
      </h4>

      {/* Tagline */}
      <p className="mt-1 text-sm leading-snug text-cool-gray">
        <ScalarDiff live={pkg.tagline || '—'} draft={d ? (pkg.draftTagline || '—') : null} hasDraft={d} />
      </p>

      {/* Prices */}
      <div className="mt-3 text-sm">
        <p className="font-heading text-lg font-bold text-midnight-navy">
          <ScalarDiff live={String(pkg.exVatPrice)} draft={pkg.draftExVatPrice === null ? null : String(pkg.draftExVatPrice)} hasDraft={d} prefix="€" suffix=" ex-VAT" />
        </p>
        <p className="text-xs text-cool-gray">
          <ScalarDiff live={String(pkg.incVatPrice)} draft={pkg.draftIncVatPrice === null ? null : String(pkg.draftIncVatPrice)} hasDraft={d} prefix="€" suffix=" inc-VAT" />
        </p>
      </div>

      {/* Voice */}
      <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-electric-blue">
        <Mic className="h-3.5 w-3.5" />
        <ScalarDiff live={`${pkg.voiceMinutes} min`} draft={pkg.draftVoiceMinutes === null ? null : `${pkg.draftVoiceMinutes} min`} hasDraft={d} />
      </div>

      {/* Includes */}
      {(d ? draftIncludes.length > 0 : pkg.includes.length > 0) && (
        <div className="mt-4 border-t border-soft-lilac/20 pt-4">
          {d && <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-royal-purple">Draft includes{includesChanged ? ` (live: ${pkg.includes.length})` : ''}</p>}
          <ul className="space-y-1.5">
            {(d ? draftIncludes : pkg.includes).map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-midnight-navy/80">
                <CheckCircle className={`mt-0.5 h-4 w-4 shrink-0 ${d ? 'text-royal-purple' : 'text-emerald-green'}`} />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
          {d && includesChanged && (
            <div className="mt-3 border-t border-soft-lilac/10 pt-3">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-cool-gray">Live includes</p>
              <ul className="space-y-1">
                {pkg.includes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-cool-gray">
                    <CheckCircle className="mt-0.5 h-3 w-3 shrink-0 text-cool-gray/60" />
                    <span className="leading-snug line-through">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2 border-t border-soft-lilac/20 pt-4">
        <Button variant="outline" size="sm" onClick={() => onEdit(pkg)} className="gap-1.5">
          <Pencil className="h-3.5 w-3.5" />
          {d ? 'Edit draft' : 'Edit'}
        </Button>
        {d && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDiscard(pkg)}
            disabled={discarding}
            className="gap-1.5 text-coral-orange hover:bg-coral-orange/10 hover:text-coral-orange"
          >
            {discarding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            Discard draft
          </Button>
        )}
      </div>
    </div>
  );
}

export function PricingManager() {
  const { toast } = useToast();
  const [industries, setIndustries] = useState<AdminIndustry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingPkg, setEditingPkg] = useState<AdminPackage | null>(null);
  const [form, setForm] = useState<EditForm | null>(null);
  const [incTouched, setIncTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [discardingId, setDiscardingId] = useState<string | null>(null);

  const loadPricing = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [indRes, pkgRes] = await Promise.all([
      supabase
        .from('pricing_industries')
        .select('id, slug, name, core_service_line, voice_native, sort_order, is_published, has_draft_changes')
        .order('sort_order', { ascending: true }),
      supabase
        .from('pricing_packages')
        .select('id, industry_id, tier, name, ex_vat_price, inc_vat_price, voice_minutes, tagline, includes, sort_order, has_draft, draft_name, draft_ex_vat_price, draft_inc_vat_price, draft_voice_minutes, draft_tagline, draft_includes')
        .order('sort_order', { ascending: true }),
    ]);

    if (indRes.error || pkgRes.error) {
      setError(indRes.error?.message || pkgRes.error?.message || 'Failed to load pricing.');
      setLoading(false);
      return;
    }

    const byIndustry = new Map<string, AdminPackage[]>();
    for (const row of pkgRes.data ?? []) {
      const list = byIndustry.get(row.industry_id) ?? [];
      list.push({
        id: row.id,
        industryId: row.industry_id,
        tier: row.tier,
        name: row.name,
        exVatPrice: Number(row.ex_vat_price),
        incVatPrice: Number(row.inc_vat_price),
        voiceMinutes: Number(row.voice_minutes),
        tagline: row.tagline ?? '',
        includes: asStringArray(row.includes),
        sortOrder: row.sort_order,
        hasDraft: row.has_draft,
        draftName: row.draft_name,
        draftExVatPrice: row.draft_ex_vat_price === null ? null : Number(row.draft_ex_vat_price),
        draftIncVatPrice: row.draft_inc_vat_price === null ? null : Number(row.draft_inc_vat_price),
        draftVoiceMinutes: row.draft_voice_minutes === null ? null : Number(row.draft_voice_minutes),
        draftTagline: row.draft_tagline,
        draftIncludes: row.draft_includes === null ? null : asStringArray(row.draft_includes),
      });
      byIndustry.set(row.industry_id, list);
    }

    const mapped: AdminIndustry[] = (indRes.data ?? []).map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      coreServiceLine: row.core_service_line,
      voiceNative: row.voice_native,
      sortOrder: row.sort_order,
      isPublished: row.is_published,
      hasDraftChanges: row.has_draft_changes,
      packages: (byIndustry.get(row.id) ?? []).sort(
        (a, b) => a.sortOrder - b.sortOrder || (TIER_ORDER[a.tier] ?? 99) - (TIER_ORDER[b.tier] ?? 99),
      ),
    }));

    setIndustries(mapped);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPricing();
  }, [loadPricing]);

  // ── Editing ──────────────────────────────────────────────────────────────
  const openEdit = (pkg: AdminPackage) => {
    // Seed from the existing draft if present, else from the live values.
    const seed = pkg.hasDraft;
    setForm({
      name: seed && pkg.draftName !== null ? pkg.draftName : pkg.name,
      exVatPrice: String(seed && pkg.draftExVatPrice !== null ? pkg.draftExVatPrice : pkg.exVatPrice),
      incVatPrice: String(seed && pkg.draftIncVatPrice !== null ? pkg.draftIncVatPrice : pkg.incVatPrice),
      voiceMinutes: String(seed && pkg.draftVoiceMinutes !== null ? pkg.draftVoiceMinutes : pkg.voiceMinutes),
      tagline: seed && pkg.draftTagline !== null ? pkg.draftTagline : pkg.tagline,
      includes: [...(seed && pkg.draftIncludes !== null ? pkg.draftIncludes : pkg.includes)],
    });
    setIncTouched(false);
    setEditingPkg(pkg);
  };

  const closeEdit = () => {
    setEditingPkg(null);
    setForm(null);
  };

  const updateForm = (patch: Partial<EditForm>) => setForm((f) => (f ? { ...f, ...patch } : f));

  const onExChange = (value: string) => {
    if (!form) return;
    const ex = Number(value);
    // Auto-suggest inc-VAT from ex-VAT unless the admin has manually overridden it.
    if (!incTouched && value !== '' && Number.isFinite(ex)) {
      updateForm({ exVatPrice: value, incVatPrice: String(suggestIncVat(ex)) });
    } else {
      updateForm({ exVatPrice: value });
    }
  };

  const saveDraft = async () => {
    if (!editingPkg || !form) return;

    const ex = Number(form.exVatPrice);
    const inc = Number(form.incVatPrice);
    const voice = Number(form.voiceMinutes);
    if (!form.name.trim()) {
      toast({ title: 'Name required', description: 'Package name cannot be empty.', variant: 'destructive' });
      return;
    }
    if (![ex, inc, voice].every((n) => Number.isFinite(n) && n >= 0)) {
      toast({ title: 'Invalid numbers', description: 'Prices and voice minutes must be non-negative numbers.', variant: 'destructive' });
      return;
    }

    setSaving(true);
    const cleanedIncludes = form.includes.map((s) => s.trim()).filter(Boolean);

    // WRITE TO DRAFT COLUMNS ONLY — never the live columns.
    const { error: pkgErr } = await supabase
      .from('pricing_packages')
      .update({
        draft_name: form.name.trim(),
        draft_ex_vat_price: ex,
        draft_inc_vat_price: inc,
        draft_voice_minutes: Math.round(voice),
        draft_tagline: form.tagline.trim() || null,
        draft_includes: cleanedIncludes,
        has_draft: true,
      })
      .eq('id', editingPkg.id);

    if (pkgErr) {
      setSaving(false);
      toast({ title: 'Save failed', description: pkgErr.message, variant: 'destructive' });
      return;
    }

    // Flag the parent industry as having unpublished changes.
    const { error: indErr } = await supabase
      .from('pricing_industries')
      .update({ has_draft_changes: true })
      .eq('id', editingPkg.industryId);

    setSaving(false);
    if (indErr) {
      toast({ title: 'Partly saved', description: `Draft saved, but flagging the industry failed: ${indErr.message}`, variant: 'destructive' });
    } else {
      toast({ title: 'Draft saved', description: 'Staged as an unpublished change — the live price is unchanged.' });
    }
    closeEdit();
    await loadPricing();
  };

  const discardDraft = async (pkg: AdminPackage) => {
    setDiscardingId(pkg.id);

    const { error: pkgErr } = await supabase
      .from('pricing_packages')
      .update({
        draft_name: null,
        draft_ex_vat_price: null,
        draft_inc_vat_price: null,
        draft_voice_minutes: null,
        draft_tagline: null,
        draft_includes: null,
        has_draft: false,
      })
      .eq('id', pkg.id);

    if (pkgErr) {
      setDiscardingId(null);
      toast({ title: 'Discard failed', description: pkgErr.message, variant: 'destructive' });
      return;
    }

    // Recompute the industry flag: still true only if another package keeps a draft.
    const industry = industries.find((i) => i.id === pkg.industryId);
    const stillHasDraft = (industry?.packages ?? []).some((p) => p.id !== pkg.id && p.hasDraft);
    if (!stillHasDraft) {
      await supabase.from('pricing_industries').update({ has_draft_changes: false }).eq('id', pkg.industryId);
    }

    setDiscardingId(null);
    toast({ title: 'Draft discarded', description: 'Reverted to the live values.' });
    await loadPricing();
  };

  // ── Render ───────────────────────────────────────────────────────────────
  const publishedCount = industries.filter((i) => i.isPublished).length;
  const draftCount = industries.length - publishedCount;
  const packageCount = industries.reduce((n, i) => n + i.packages.length, 0);
  const pendingPackages = industries.reduce((n, i) => n + i.packages.filter((p) => p.hasDraft).length, 0);

  return (
    <div className="space-y-8">
      <SectionHeading
        align="left"
        eyebrow="P1 · Draft editing"
        eyebrowIcon={Coins}
        title="Pricing"
        subtitle="Edit tiers as drafts — staged in the draft columns, with the live price and the public site untouched until publish (next stage). You always see what's live vs what's staged."
      />

      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-royal-purple" />
        </div>
      )}

      {!loading && error && (
        <div className="flex items-start gap-3 rounded-2xl border border-coral-orange/30 bg-coral-orange/5 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-coral-orange" />
          <div>
            <p className="font-semibold text-midnight-navy">Couldn't load pricing</p>
            <p className="mt-1 text-sm text-cool-gray">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && industries.length === 0 && (
        <div className="rounded-2xl border border-soft-lilac/30 bg-slate-white p-8 text-center">
          <p className="font-semibold text-midnight-navy">No pricing industries found</p>
          <p className="mt-1 text-sm text-cool-gray">
            The <code className="rounded bg-soft-lilac/20 px-1">pricing_industries</code> table is empty.
          </p>
        </div>
      )}

      {!loading && !error && industries.length > 0 && (
        <>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-soft-lilac/30 bg-slate-white px-3 py-1.5 font-medium text-midnight-navy">{industries.length} industries</span>
            <span className="rounded-full border border-soft-lilac/30 bg-slate-white px-3 py-1.5 font-medium text-emerald-green">{publishedCount} published</span>
            <span className="rounded-full border border-soft-lilac/30 bg-slate-white px-3 py-1.5 font-medium text-coral-orange">{draftCount} draft{draftCount === 1 ? '' : 's'}</span>
            <span className="rounded-full border border-soft-lilac/30 bg-slate-white px-3 py-1.5 font-medium text-cool-gray">{packageCount} packages</span>
            {pendingPackages > 0 && (
              <span className="rounded-full border border-royal-purple/30 bg-royal-purple/5 px-3 py-1.5 font-semibold text-royal-purple">{pendingPackages} unpublished edit{pendingPackages === 1 ? '' : 's'}</span>
            )}
          </div>

          <div className="space-y-6">
            {industries.map((ind) => (
              <section key={ind.id} className="rounded-3xl border border-soft-lilac/30 bg-slate-white p-6 shadow-card">
                <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h3 className="font-heading text-xl font-bold text-midnight-navy">{ind.name}</h3>
                  {ind.isPublished ? <Badge tone="emerald">Published</Badge> : <Badge tone="coral">Draft</Badge>}
                  {ind.hasDraftChanges && <Badge tone="purple">Unpublished changes</Badge>}
                  <span className="text-sm text-cool-gray">
                    /{ind.slug}
                    {' · '}sort {ind.sortOrder}
                    {ind.voiceNative ? ' · voice-native' : ''}
                    {ind.coreServiceLine ? ` · ${ind.coreServiceLine}` : ''}
                  </span>
                </div>

                {ind.packages.length === 0 ? (
                  <p className="text-sm text-cool-gray">No packages defined for this industry.</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-3">
                    {ind.packages.map((pkg) => (
                      <TierCard key={pkg.id} pkg={pkg} onEdit={openEdit} onDiscard={discardDraft} discarding={discardingId === pkg.id} />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </>
      )}

      {/* Edit draft modal */}
      <Dialog open={!!editingPkg} onOpenChange={(o) => !o && closeEdit()}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="font-heading text-midnight-navy">
              Edit draft — {editingPkg?.tier} tier
            </DialogTitle>
            <DialogDescription className="text-cool-gray">
              Changes are staged as a draft. The live price and the public site stay exactly as they are until you publish.
            </DialogDescription>
          </DialogHeader>

          {form && (
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-midnight-navy">Name</label>
                <Input value={form.name} onChange={(e) => updateForm({ name: e.target.value })} placeholder="Package name" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-midnight-navy">Ex-VAT price (€)</label>
                  <Input type="number" min="0" step="1" value={form.exVatPrice} onChange={(e) => onExChange(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-midnight-navy">Inc-VAT price (€)</label>
                    <button
                      type="button"
                      onClick={() => { const ex = Number(form.exVatPrice); if (Number.isFinite(ex)) { setIncTouched(false); updateForm({ incVatPrice: String(suggestIncVat(ex)) }); } }}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-royal-purple hover:underline"
                    >
                      <Sparkles className="h-3 w-3" /> suggest +21%
                    </button>
                  </div>
                  <Input type="number" min="0" step="1" value={form.incVatPrice} onChange={(e) => { setIncTouched(true); updateForm({ incVatPrice: e.target.value }); }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-midnight-navy">Voice minutes / month</label>
                <Input type="number" min="0" step="1" value={form.voiceMinutes} onChange={(e) => updateForm({ voiceMinutes: e.target.value })} />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-midnight-navy">Tagline</label>
                <Textarea rows={2} value={form.tagline} onChange={(e) => updateForm({ tagline: e.target.value })} placeholder="Short tier description" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-midnight-navy">Includes</label>
                {form.includes.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateForm({ includes: form.includes.map((x, j) => (j === i ? e.target.value : x)) })}
                      placeholder={`Feature ${i + 1}`}
                    />
                    <Button variant="ghost" size="icon" onClick={() => updateForm({ includes: form.includes.filter((_, j) => j !== i) })} className="shrink-0 text-cool-gray hover:text-coral-orange">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => updateForm({ includes: [...form.includes, ''] })} className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Add feature
                </Button>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={closeEdit} disabled={saving}>Cancel</Button>
            <Button variant="hero" onClick={saveDraft} disabled={saving} className="gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save draft
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
