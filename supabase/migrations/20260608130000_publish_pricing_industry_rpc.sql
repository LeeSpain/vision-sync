-- ═══════════════════════════════════════════════════════════════════════════
-- P1 Stage 3 — Publish flow for pricing drafts.
--
-- publish_pricing_industry(p_industry_id) copies every staged draft in an
-- industry onto its LIVE columns in a SINGLE transaction, then clears the
-- drafts and the industry's pending-changes flag. Because it's one function
-- call = one transaction, a partial publish cannot happen: either the whole
-- industry's tier set goes live together, or nothing does (rollback on error).
--
-- SECURITY DEFINER so the copy runs with table-owner rights, but it is guarded
-- by the SAME admin check the pricing RLS policies use
-- (auth.uid() IN profiles WHERE role = 'admin'), so only admins can publish.
-- This DOES change live prices — the public site reads the live columns.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.publish_pricing_industry(p_industry_id uuid)
RETURNS integer            -- number of packages published
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
BEGIN
  -- Admin-only guard (mirrors the pricing RLS policies).
  IF auth.uid() NOT IN (SELECT id FROM public.profiles WHERE role = 'admin') THEN
    RAISE EXCEPTION 'Not authorized: admin role required to publish pricing.'
      USING ERRCODE = '42501';
  END IF;

  -- Copy each staged draft onto its live columns, then clear the draft.
  -- COALESCE protects the NOT NULL live columns; the nullable tagline is copied
  -- as-is so an intentionally-cleared draft tagline publishes as empty.
  WITH published AS (
    UPDATE public.pricing_packages
    SET
      name          = COALESCE(draft_name, name),
      ex_vat_price  = COALESCE(draft_ex_vat_price, ex_vat_price),
      inc_vat_price = COALESCE(draft_inc_vat_price, inc_vat_price),
      voice_minutes = COALESCE(draft_voice_minutes, voice_minutes),
      tagline       = COALESCE(draft_tagline, tagline),
      includes      = COALESCE(draft_includes, includes),
      draft_name          = NULL,
      draft_ex_vat_price  = NULL,
      draft_inc_vat_price = NULL,
      draft_voice_minutes = NULL,
      draft_tagline       = NULL,
      draft_includes      = NULL,
      has_draft           = false,
      updated_at          = now()
    WHERE industry_id = p_industry_id
      AND has_draft = true
    RETURNING 1
  )
  SELECT count(*) INTO v_count FROM published;

  -- Clear the industry's "has unpublished edits" flag.
  UPDATE public.pricing_industries
  SET has_draft_changes = false,
      updated_at = now()
  WHERE id = p_industry_id;

  RETURN v_count;
END;
$$;

-- Only authenticated users may call it; the internal guard restricts to admins.
REVOKE ALL ON FUNCTION public.publish_pricing_industry(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.publish_pricing_industry(uuid) TO authenticated;

COMMENT ON FUNCTION public.publish_pricing_industry(uuid) IS
  'Atomically publishes all staged drafts for one pricing industry: copies draft_* onto the live columns, clears drafts + has_draft, and clears the industry has_draft_changes flag. Admin-only. Returns the number of packages published.';
