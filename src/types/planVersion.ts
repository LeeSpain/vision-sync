// D20 — versioned plan economic levers (mirrors public.plan_versions).
// Data-layer contract consumed by the PlansManager/PricingManager UI (D20 part 2).

export type CurrencyCode = 'EUR' | 'USD' | 'GBP';

/** Set price points per currency (D13) — never live FX math. */
export interface PricePoint {
  monthly: number | null;
  setup?: number | null;
  yearly?: number | null;
}

export type PricePoints = Partial<Record<CurrencyCode, PricePoint>>;

/** Per-unit overage rates charged past the included allowance. */
export interface OverageRates {
  ai_conversation?: number;
  voice_minute?: number;
  whatsapp_conversation?: number;
}

/** Per-tier capability flags, e.g. { booking: true, payments: false }. */
export type PlanFeatureFlags = Record<string, boolean>;

export interface PlanVersion {
  id: string;
  plan_id: string;
  version: number;
  is_current: boolean;
  price_points: PricePoints;
  included_ai_conversations: number | null;
  included_voice_minutes: number | null;
  whatsapp_conversation_cap: number | null;
  overage_rates: OverageRates;
  feature_flags: PlanFeatureFlags;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

/** Args for the public.create_plan_version() RPC (supersedes the current version). */
export interface CreatePlanVersionInput {
  plan_id: string;
  price_points?: PricePoints;
  included_ai_conversations?: number | null;
  included_voice_minutes?: number | null;
  whatsapp_conversation_cap?: number | null;
  overage_rates?: OverageRates;
  feature_flags?: PlanFeatureFlags;
  notes?: string | null;
}
