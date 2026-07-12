import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type {
  PlanVersion, CreatePlanVersionInput, PricePoints, OverageRates, PlanFeatureFlags,
} from '@/types/planVersion';

// D20: the generated Supabase types don't yet include plan_versions /
// create_plan_version (added by the D20 migrations, types not regenerated).
// We reach them through the untyped boundary — the same pattern the repo uses
// elsewhere (e.g. supabase.rpc('increment_project_leads' as any, ...)) — and map
// rows to our strongly-typed PlanVersion so callers stay fully typed.
const db = supabase as any; // eslint-disable-line @typescript-eslint/no-explicit-any

const mapRow = (row: Record<string, unknown>): PlanVersion => ({
  id: String(row.id),
  plan_id: String(row.plan_id),
  version: Number(row.version),
  is_current: Boolean(row.is_current),
  price_points: (row.price_points as PricePoints) ?? {},
  included_ai_conversations: (row.included_ai_conversations as number | null) ?? null,
  included_voice_minutes: (row.included_voice_minutes as number | null) ?? null,
  whatsapp_conversation_cap: (row.whatsapp_conversation_cap as number | null) ?? null,
  overage_rates: (row.overage_rates as OverageRates) ?? {},
  feature_flags: (row.feature_flags as PlanFeatureFlags) ?? {},
  notes: (row.notes as string | null) ?? null,
  created_by: (row.created_by as string | null) ?? null,
  created_at: String(row.created_at),
  updated_at: String(row.updated_at),
});

interface UsePlanVersionsResult {
  versions: PlanVersion[];
  current: PlanVersion | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  createVersion: (input: CreatePlanVersionInput) => Promise<void>;
}

export function usePlanVersions(planId: string | null): UsePlanVersionsResult {
  const [versions, setVersions] = useState<PlanVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!planId) {
      setVersions([]);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: qErr } = await db
      .from('plan_versions')
      .select('*')
      .eq('plan_id', planId)
      .order('version', { ascending: false });
    if (qErr) {
      setError(qErr.message);
      setVersions([]);
    } else {
      setVersions(((data ?? []) as Record<string, unknown>[]).map(mapRow));
    }
    setLoading(false);
  }, [planId]);

  useEffect(() => {
    void load();
  }, [load]);

  const createVersion = useCallback(async (input: CreatePlanVersionInput) => {
    const { error: rpcErr } = await db.rpc('create_plan_version', {
      p_plan_id: input.plan_id,
      p_price_points: input.price_points ?? {},
      p_included_ai_conversations: input.included_ai_conversations ?? null,
      p_included_voice_minutes: input.included_voice_minutes ?? null,
      p_whatsapp_conversation_cap: input.whatsapp_conversation_cap ?? null,
      p_overage_rates: input.overage_rates ?? {},
      p_feature_flags: input.feature_flags ?? {},
      p_notes: input.notes ?? null,
    });
    if (rpcErr) throw new Error(rpcErr.message);
    await load();
  }, [load]);

  const current = versions.find(v => v.is_current) ?? null;

  return { versions, current, loading, error, reload: load, createVersion };
}
