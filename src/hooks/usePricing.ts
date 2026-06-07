import { useEffect, useState } from 'react';
import { INDUSTRIES } from '@/data/industries';
import type { Industry } from '@/types/industries';
import { getPricingWithFallback, type PricingSource } from '@/lib/pricing';

export interface UsePricingResult {
  /** Published DB pricing, or the static fallback. Never empty. */
  industries: Industry[];
  /** True until the first fetch resolves. */
  loading: boolean;
  /** Where `industries` came from on the latest resolve. */
  source: PricingSource;
  /** The DB error if the fetch failed (fallback is still served). */
  error: Error | null;
}

/**
 * Read-only pricing hook. Initialises with the static INDUSTRIES so consumers
 * always have data to render (no empty flash) while the DB query runs, then
 * swaps in published DB pricing when it resolves — or keeps the fallback if the
 * DB errors / is empty.
 */
export function usePricing(): UsePricingResult {
  const [industries, setIndustries] = useState<Industry[]>(INDUSTRIES);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<PricingSource>('fallback');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    getPricingWithFallback().then((result) => {
      if (cancelled) return;
      setIndustries(result.industries);
      setSource(result.source);
      setError(result.error);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { industries, loading, source, error };
}
