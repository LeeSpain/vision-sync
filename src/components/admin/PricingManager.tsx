import { useEffect, useState } from 'react';
import { CheckCircle, Mic, Loader2, AlertTriangle, Coins } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SectionHeading } from '@/components/ui-system';

// ─────────────────────────────────────────────────────────────────────────────
// Pricing admin — P1 stage 1: READ-ONLY view of pricing_industries +
// pricing_packages. Admins see EVERY row, including unpublished drafts (RLS
// grants admins full read). No create/edit/delete yet — display only.
// ─────────────────────────────────────────────────────────────────────────────

const TIER_ORDER: Record<string, number> = { base: 0, growth: 1, everything: 2 };

interface AdminPackage {
  id: string;
  tier: string;
  name: string;
  exVatPrice: number;
  incVatPrice: number;
  voiceMinutes: number;
  tagline: string;
  includes: string[];
  sortOrder: number;
}

interface AdminIndustry {
  id: string;
  slug: string;
  name: string;
  coreServiceLine: string | null;
  voiceNative: boolean;
  sortOrder: number;
  isPublished: boolean;
  packages: AdminPackage[];
}

function PublishedBadge({ published }: { published: boolean }) {
  return published ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-green/10 px-2.5 py-1 text-xs font-semibold text-emerald-green">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-green" />
      Published
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-orange/10 px-2.5 py-1 text-xs font-semibold text-coral-orange">
      <span className="h-1.5 w-1.5 rounded-full bg-coral-orange" />
      Draft
    </span>
  );
}

function TierCard({ pkg }: { pkg: AdminPackage }) {
  return (
    <div className="flex flex-col rounded-2xl border border-soft-lilac/30 bg-gradient-to-b from-slate-50 to-white p-5">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-royal-purple/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-royal-purple">
          {pkg.tier}
        </span>
        {pkg.voiceMinutes > 0 && (
          <span className="flex items-center gap-1 text-xs font-medium text-electric-blue">
            <Mic className="h-3.5 w-3.5" />
            {pkg.voiceMinutes.toLocaleString()} min
          </span>
        )}
      </div>

      <h4 className="mt-3 font-heading text-base font-bold text-midnight-navy">{pkg.name}</h4>
      {pkg.tagline && <p className="mt-1 text-sm leading-snug text-cool-gray">{pkg.tagline}</p>}

      <div className="mt-3">
        <span className="font-heading text-2xl font-bold text-midnight-navy">€{pkg.exVatPrice}</span>
        <span className="text-sm text-cool-gray"> ex-VAT</span>
        <p className="text-xs text-cool-gray">€{pkg.incVatPrice} inc-VAT (21%)</p>
      </div>

      {pkg.includes.length > 0 && (
        <ul className="mt-4 space-y-1.5 border-t border-soft-lilac/20 pt-4">
          {pkg.includes.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-midnight-navy/80">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-green" />
              <span className="leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function PricingManager() {
  const [industries, setIndustries] = useState<AdminIndustry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);

      // Admins read EVERYTHING — no is_published filter.
      const [indRes, pkgRes] = await Promise.all([
        supabase
          .from('pricing_industries')
          .select('id, slug, name, core_service_line, voice_native, sort_order, is_published')
          .order('sort_order', { ascending: true }),
        supabase
          .from('pricing_packages')
          .select('id, industry_id, tier, name, ex_vat_price, inc_vat_price, voice_minutes, tagline, includes, sort_order')
          .order('sort_order', { ascending: true }),
      ]);

      if (!active) return;

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
          tier: row.tier,
          name: row.name,
          exVatPrice: Number(row.ex_vat_price),
          incVatPrice: Number(row.inc_vat_price),
          voiceMinutes: Number(row.voice_minutes),
          tagline: row.tagline ?? '',
          includes: Array.isArray(row.includes) ? (row.includes as string[]) : [],
          sortOrder: row.sort_order,
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
        packages: (byIndustry.get(row.id) ?? []).sort(
          (a, b) => a.sortOrder - b.sortOrder || (TIER_ORDER[a.tier] ?? 99) - (TIER_ORDER[b.tier] ?? 99),
        ),
      }));

      setIndustries(mapped);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  const publishedCount = industries.filter((i) => i.isPublished).length;
  const draftCount = industries.length - publishedCount;
  const packageCount = industries.reduce((n, i) => n + i.packages.length, 0);

  return (
    <div className="space-y-8">
      <SectionHeading
        align="left"
        eyebrow="P1 · Read-only"
        eyebrowIcon={Coins}
        title="Pricing"
        subtitle="Live view of every industry and tier in the pricing database — including unpublished drafts. This is what the public site reads from. Editing lands in the next stage."
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
          {/* Summary */}
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-soft-lilac/30 bg-slate-white px-3 py-1.5 font-medium text-midnight-navy">
              {industries.length} industries
            </span>
            <span className="rounded-full border border-soft-lilac/30 bg-slate-white px-3 py-1.5 font-medium text-emerald-green">
              {publishedCount} published
            </span>
            <span className="rounded-full border border-soft-lilac/30 bg-slate-white px-3 py-1.5 font-medium text-coral-orange">
              {draftCount} draft{draftCount === 1 ? '' : 's'}
            </span>
            <span className="rounded-full border border-soft-lilac/30 bg-slate-white px-3 py-1.5 font-medium text-cool-gray">
              {packageCount} packages
            </span>
          </div>

          {/* Industries */}
          <div className="space-y-6">
            {industries.map((ind) => (
              <section key={ind.id} className="rounded-3xl border border-soft-lilac/30 bg-slate-white p-6 shadow-card">
                <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h3 className="font-heading text-xl font-bold text-midnight-navy">{ind.name}</h3>
                  <PublishedBadge published={ind.isPublished} />
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
                      <TierCard key={pkg.id} pkg={pkg} />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
