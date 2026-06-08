-- ═══════════════════════════════════════════════════════════════════════════
-- P1 Stage 3b — regenerate the AI pricing knowledge FROM THE LIVE DB.
--
-- Background: scripts/generate-pricing-knowledge.mjs builds the canonical
-- pricing text from the STATIC src/data/industries.ts and emits a seed SQL.
-- After P1 the editable source of truth is the DB (pricing_industries /
-- pricing_packages), so the AI must be regenerated from the LIVE tables or it
-- will quote stale prices the public site no longer charges.
--
-- regenerate_pricing_knowledge() reproduces the exact format of the generator's
-- 'pricing_canonical' content — header block, then per published industry the
-- Base / Growth / Everything tiers with ex-VAT, "+21% IVA = € inc.", voice note,
-- and the cumulative "Adds on top of …" lines — but sourced from the LIVE
-- columns (ex_vat_price etc.), never the draft_* columns.
--
-- Then it atomically replaces the single ai_training_data row keyed on
-- training_type='pricing_canonical' (delete-then-insert), matching exactly what
-- the ai-chat edge function reads (active rows → t.content into the prompt).
--
-- Admin-guarded with the same check as publish_pricing_industry. SECURITY
-- DEFINER so it can write ai_training_data. Returns the length of the generated
-- content so it can be sanity-checked as non-empty.
--
-- NOT wired into publish yet — run it standalone to verify before automating.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.regenerate_pricing_knowledge()
RETURNS integer            -- length of the generated canonical content
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_header  text;
  v_body    text;
  v_content text;
BEGIN
  -- Admin-only guard (mirrors publish_pricing_industry / the pricing RLS).
  IF auth.uid() NOT IN (SELECT id FROM public.profiles WHERE role = 'admin') THEN
    RAISE EXCEPTION 'Not authorized: admin role required to regenerate pricing knowledge.'
      USING ERRCODE = '42501';
  END IF;

  -- Fixed header — verbatim from the generator.
  v_header :=
    'VISION-SYNC PRICING — canonical. All figures are per month, ex-VAT (euros).' || E'\n' ||
    'Clients are invoiced +21% IVA; the "inc." figure is the VAT-inclusive monthly price.' || E'\n' ||
    'Tiers are cumulative: Growth includes everything in Base; Everything includes everything in Growth.' || E'\n' ||
    'Everything always adds WhatsApp Agent, Social Media Responder and Email Follow-Up Agent, plus a voice agent (added for chat-led industries, increased minutes for voice-native ones).' || E'\n' ||
    'Anything not listed is a custom add-on, quoted separately.';

  -- Per-industry blocks from the LIVE pricing tables (published only).
  WITH ind AS (
    SELECT i.id, i.name, i.sort_order
    FROM public.pricing_industries i
    WHERE i.is_published = true
  ),
  block AS (
    SELECT
      ind.sort_order,
      '== ' || ind.name || ' ==' || E'\n' ||
      'Base — €' || rtrim(to_char(b.ex_vat_price, 'FM999999990.99'), '.')
        || '/mo (+21% IVA = €' || rtrim(to_char(b.inc_vat_price, 'FM999999990.99'), '.') || ' inc.)'
        || (CASE WHEN b.voice_minutes > 0
                 THEN ', voice ' || to_char(b.voice_minutes, 'FM999,999,999') || ' min'
                 ELSE ', no voice' END) || '.' || E'\n' ||
      '  Includes: '
        || COALESCE((SELECT string_agg(t.v, '; ' ORDER BY t.o)
                     FROM jsonb_array_elements_text(b.includes) WITH ORDINALITY AS t(v, o)), '')
        || '.' || E'\n' ||
      'Growth — €' || rtrim(to_char(g.ex_vat_price, 'FM999999990.99'), '.')
        || '/mo (+21% IVA = €' || rtrim(to_char(g.inc_vat_price, 'FM999999990.99'), '.') || ' inc.)'
        || (CASE WHEN g.voice_minutes > 0
                 THEN ', voice ' || to_char(g.voice_minutes, 'FM999,999,999') || ' min'
                 ELSE ', no voice' END) || '.' || E'\n' ||
      '  Adds on top of Base: '
        || COALESCE((SELECT string_agg(t.v, '; ' ORDER BY t.o)
                     FROM jsonb_array_elements_text(g.includes) WITH ORDINALITY AS t(v, o)
                     WHERE t.v NOT IN (SELECT jsonb_array_elements_text(b.includes))), '')
        || '.' || E'\n' ||
      'Everything — €' || rtrim(to_char(e.ex_vat_price, 'FM999999990.99'), '.')
        || '/mo (+21% IVA = €' || rtrim(to_char(e.inc_vat_price, 'FM999999990.99'), '.') || ' inc.)'
        || (CASE WHEN e.voice_minutes > 0
                 THEN ', voice ' || to_char(e.voice_minutes, 'FM999,999,999') || ' min'
                 ELSE ', no voice' END) || '.' || E'\n' ||
      '  Adds on top of Growth: '
        || COALESCE((SELECT string_agg(t.v, '; ' ORDER BY t.o)
                     FROM jsonb_array_elements_text(e.includes) WITH ORDINALITY AS t(v, o)
                     WHERE t.v NOT IN (SELECT jsonb_array_elements_text(g.includes))), '')
        || '.' AS txt
    FROM ind
    JOIN public.pricing_packages b ON b.industry_id = ind.id AND b.tier = 'base'
    JOIN public.pricing_packages g ON g.industry_id = ind.id AND g.tier = 'growth'
    JOIN public.pricing_packages e ON e.industry_id = ind.id AND e.tier = 'everything'
  )
  SELECT string_agg(block.txt, E'\n\n' ORDER BY block.sort_order)
  INTO v_body
  FROM block;

  -- Header, a blank line, then the blocks; trimmed like the generator's .trim().
  v_content := btrim(v_header || E'\n\n' || COALESCE(v_body, ''), E' \n\r\t');

  -- Atomically replace the canonical row (matches the generator's keying).
  DELETE FROM public.ai_training_data WHERE training_type = 'pricing_canonical';
  INSERT INTO public.ai_training_data (training_type, content, metadata, is_active)
  VALUES (
    'pricing_canonical',
    v_content,
    '{"type":"pricing","source":"live_db"}'::jsonb,
    true
  );

  RETURN length(v_content);
END;
$$;

-- Only authenticated users may call it; the internal guard restricts to admins.
REVOKE ALL ON FUNCTION public.regenerate_pricing_knowledge() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.regenerate_pricing_knowledge() TO authenticated;

COMMENT ON FUNCTION public.regenerate_pricing_knowledge() IS
  'Rebuilds the ai_training_data pricing_canonical row from the LIVE pricing_industries/pricing_packages (published, live columns), matching the format of scripts/generate-pricing-knowledge.mjs. Admin-only. Returns the generated content length.';
