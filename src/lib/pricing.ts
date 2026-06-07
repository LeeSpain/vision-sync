import { supabase } from '@/integrations/supabase/client';
import { INDUSTRIES } from '@/data/industries';
import type { Industry, Package, Tier } from '@/types/industries';

// ─────────────────────────────────────────────────────────────────────────────
// Pricing read layer (Step 3a). Reads published pricing from the DB
// (pricing_industries + pricing_packages) and maps it into the SAME Industry +
// Package shape the app already uses. Falls back, automatically and silently, to
// the static INDUSTRIES if the DB errors or returns zero rows — the site must
// never show empty pricing.
//
// NOTE: the pricing_* tables intentionally hold pricing only — they have no
// `icon` / `painStatement`. Those presentation fields are borrowed from the
// static entry by slug (with safe defaults for any DB-only industry).
// ─────────────────────────────────────────────────────────────────────────────

export type PricingSource = 'db' | 'fallback';

export interface PricingResult {
  industries: Industry[];
  source: PricingSource;
  error: Error | null;
}

const TIER_ORDER: Record<Tier, number> = { base: 0, growth: 1, everything: 2 };
const STATIC_BY_SLUG = new Map(INDUSTRIES.map((i) => [i.slug, i]));

type IndustryRow = {
  id: string;
  slug: string;
  name: string;
  core_service_line: string | null;
  color: string | null;
  sort_order: number;
};

type PackageRow = {
  industry_id: string;
  tier: string;
  name: string;
  ex_vat_price: number;
  inc_vat_price: number;
  voice_minutes: number;
  tagline: string | null;
  includes: unknown;
  sort_order: number;
};

function mapPackage(row: PackageRow): Package {
  return {
    tier: row.tier as Tier,
    name: row.name,
    exVatPrice: Number(row.ex_vat_price),
    incVatPrice: Number(row.inc_vat_price),
    voiceMinutes: Number(row.voice_minutes),
    tagline: row.tagline ?? '',
    includes: Array.isArray(row.includes) ? (row.includes as string[]) : [],
  };
}

function mapIndustry(row: IndustryRow, packages: PackageRow[]): Industry {
  const staticMatch = STATIC_BY_SLUG.get(row.slug);
  return {
    slug: row.slug,
    name: row.name,
    // icon + painStatement are not stored in pricing_* — borrow from static by slug.
    icon: staticMatch?.icon ?? 'Briefcase',
    painStatement: staticMatch?.painStatement ?? row.core_service_line ?? '',
    color: row.color ?? 'blue',
    packages: packages
      .slice()
      .sort((a, b) => (a.sort_order - b.sort_order) || (TIER_ORDER[a.tier as Tier] - TIER_ORDER[b.tier as Tier]))
      .map(mapPackage),
  };
}

/**
 * Fetches published pricing from the DB and maps it to Industry[].
 * Throws on a DB error; returns [] if there are no published industries.
 */
export async function fetchPublishedPricing(): Promise<Industry[]> {
  const { data: industryRows, error: indErr } = await supabase
    .from('pricing_industries')
    .select('id, slug, name, core_service_line, color, sort_order')
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  if (indErr) throw new Error(`pricing_industries query failed: ${indErr.message}`);
  if (!industryRows || industryRows.length === 0) return [];

  const ids = industryRows.map((r) => r.id);
  const { data: packageRows, error: pkgErr } = await supabase
    .from('pricing_packages')
    .select('industry_id, tier, name, ex_vat_price, inc_vat_price, voice_minutes, tagline, includes, sort_order')
    .in('industry_id', ids)
    .order('sort_order', { ascending: true });

  if (pkgErr) throw new Error(`pricing_packages query failed: ${pkgErr.message}`);

  const byIndustry = new Map<string, PackageRow[]>();
  for (const pkg of (packageRows ?? []) as PackageRow[]) {
    const list = byIndustry.get(pkg.industry_id) ?? [];
    list.push(pkg);
    byIndustry.set(pkg.industry_id, list);
  }

  return (industryRows as IndustryRow[]).map((row) => mapIndustry(row, byIndustry.get(row.id) ?? []));
}

/**
 * Returns published DB pricing, or the static fallback if the DB errors or is
 * empty. Never throws and never returns empty. `opts.forceFail` is for the
 * dev-only test harness to exercise the fallback path.
 */
export async function getPricingWithFallback(opts?: { forceFail?: boolean }): Promise<PricingResult> {
  try {
    if (opts?.forceFail) throw new Error('forced failure (dev test)');
    const industries = await fetchPublishedPricing();
    if (industries.length === 0) {
      return { industries: INDUSTRIES, source: 'fallback', error: null };
    }
    return { industries, source: 'db', error: null };
  } catch (err) {
    if (import.meta.env.DEV) {
      // Silent in production; a dev-only breadcrumb so the fallback is observable.
      console.warn('[pricing] DB read failed — using static fallback.', err);
    }
    return { industries: INDUSTRIES, source: 'fallback', error: err as Error };
  }
}
