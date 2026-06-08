-- ═══════════════════════════════════════════════════════════════════════════
-- P1 Stage 2a — draft support for pricing (schema only, no UI).
--
-- Model: "edit as draft, live price unchanged until publish."
--   • The LIVE columns (ex_vat_price, inc_vat_price, voice_minutes, tagline,
--     includes, name) remain the single source of truth the PUBLIC site reads —
--     untouched by this migration.
--   • The draft_* columns are admin-only working copies. An admin edits the
--     draft, the public still sees the live values, and on "publish" the draft_*
--     values are copied onto the live columns (publish logic lands in a later
--     stage — this migration only adds the storage).
--
-- RLS is intentionally NOT changed: admins already have full access; the public
-- continues to read only published live rows. Frontend readers are untouched —
-- they keep reading the live columns.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── pricing_packages: per-tier draft working copies ──────────────────────────
ALTER TABLE public.pricing_packages
  ADD COLUMN IF NOT EXISTS draft_name          TEXT,
  ADD COLUMN IF NOT EXISTS draft_ex_vat_price  NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS draft_inc_vat_price NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS draft_voice_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS draft_tagline       TEXT,
  ADD COLUMN IF NOT EXISTS draft_includes      JSONB,
  ADD COLUMN IF NOT EXISTS has_draft           BOOLEAN NOT NULL DEFAULT false;

-- ── pricing_industries: "has unpublished edits" flag ─────────────────────────
ALTER TABLE public.pricing_industries
  ADD COLUMN IF NOT EXISTS has_draft_changes   BOOLEAN NOT NULL DEFAULT false;

-- ── Documentation (intent lives with the schema) ─────────────────────────────
COMMENT ON COLUMN public.pricing_packages.draft_name          IS 'Draft working copy of name; NULL when no draft for this field. Copied onto the live name on publish.';
COMMENT ON COLUMN public.pricing_packages.draft_ex_vat_price  IS 'Draft working copy of ex_vat_price; NULL when no draft. The public reads the live ex_vat_price until publish.';
COMMENT ON COLUMN public.pricing_packages.draft_inc_vat_price IS 'Draft working copy of inc_vat_price; NULL when no draft.';
COMMENT ON COLUMN public.pricing_packages.draft_voice_minutes IS 'Draft working copy of voice_minutes; NULL when no draft.';
COMMENT ON COLUMN public.pricing_packages.draft_tagline       IS 'Draft working copy of tagline; NULL when no draft.';
COMMENT ON COLUMN public.pricing_packages.draft_includes      IS 'Draft working copy of the includes JSONB array; NULL when no draft.';
COMMENT ON COLUMN public.pricing_packages.has_draft           IS 'TRUE when this package has unpublished edits staged in its draft_* columns.';
COMMENT ON COLUMN public.pricing_industries.has_draft_changes IS 'TRUE when this industry (or any of its packages) has unpublished draft edits awaiting publish.';
