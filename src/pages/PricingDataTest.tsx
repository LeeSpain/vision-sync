import { useEffect, useState } from 'react';
import { INDUSTRIES } from '@/data/industries';
import { usePricing } from '@/hooks/usePricing';
import { getPricingWithFallback, type PricingResult } from '@/lib/pricing';
import type { Industry } from '@/types/industries';

/**
 * TEMPORARY dev-only scratch route (/pricing-data-test) to prove the Step-3a
 * read layer:
 *   (a) usePricing() returns DB data when present (source: "db").
 *   (b) getPricingWithFallback({ forceFail: true }) returns the static fallback
 *       (source: "fallback") so the site never shows empty pricing.
 * Not linked in nav. Delete once the pricing readers are rewired.
 */

const basePrice = (ind: Industry) => ind.packages.find((p) => p.tier === 'base')?.exVatPrice ?? '—';
const find = (list: Industry[], slug: string) => list.find((i) => i.slug === slug);

function ResultBlock({ title, result, loading }: { title: string; result: PricingResult | null; loading?: boolean }) {
  const industries = result?.industries ?? [];
  const restaurants = find(industries, 'restaurants-bars');
  const dental = find(industries, 'dental-clinics');
  return (
    <div className="rounded-xl border border-soft-lilac/30 bg-slate-white p-5 shadow-card">
      <div className="mb-3 flex items-center gap-3">
        <h2 className="font-heading text-lg font-bold text-midnight-navy">{title}</h2>
        {loading ? (
          <span className="rounded-full bg-soft-lilac/30 px-2 py-0.5 text-xs font-semibold text-midnight-navy">loading…</span>
        ) : (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold text-white ${
              result?.source === 'db' ? 'bg-emerald-green' : 'bg-coral-orange'
            }`}
          >
            source: {result?.source}
          </span>
        )}
      </div>
      <p className="text-sm text-cool-gray">
        industries: <strong className="text-midnight-navy">{industries.length}</strong>
        {result?.error && <span className="text-coral-orange"> · error: {result.error.message}</span>}
      </p>
      <p className="mt-1 text-sm text-cool-gray">
        Restaurants base: <strong className="text-midnight-navy">€{restaurants ? basePrice(restaurants) : '—'}</strong>{' '}
        (expect <code>475</code> from DB, <code>419</code> if static) · Dental tiers:{' '}
        <strong className="text-midnight-navy">
          {dental ? dental.packages.map((p) => p.exVatPrice).join(' / ') : '—'}
        </strong>
      </p>
    </div>
  );
}

export default function PricingDataTest() {
  const live = usePricing();
  const [forced, setForced] = useState<PricingResult | null>(null);

  useEffect(() => {
    getPricingWithFallback({ forceFail: true }).then(setForced);
  }, []);

  const liveResult: PricingResult = { industries: live.industries, source: live.source, error: live.error };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-8 font-body">
      <div className="mx-auto max-w-2xl space-y-6">
        <header>
          <h1 className="font-heading text-2xl font-bold text-midnight-navy">Pricing read-layer test</h1>
          <p className="text-sm text-cool-gray">Dev-only. Proves DB read + automatic static fallback. (Static file has {INDUSTRIES.length} industries.)</p>
        </header>

        <ResultBlock title="(a) usePricing() — live" result={liveResult} loading={live.loading} />
        <ResultBlock title="(b) getPricingWithFallback({ forceFail: true })" result={forced} loading={forced === null} />

        <p className="text-xs text-cool-gray">
          Expected: (a) <strong>source: db</strong>, 8 industries, Restaurants base €475, Dental 489/689/989 ·
          (b) <strong>source: fallback</strong>, {INDUSTRIES.length} industries from the static file.
        </p>
      </div>
    </div>
  );
}
