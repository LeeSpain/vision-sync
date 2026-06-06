// Generates the Step-2 seed migration that backfills the editable pricing tables
// (pricing_industries / pricing_packages) from the current code source of truth,
// src/data/industries.ts. Reproducible — re-run to regenerate after price changes.
//
// Run:  npm run gen:pricing-db-seed
// Then: apply the emitted migration (supabase db push or Management API).
//
// All seeded rows are is_published = TRUE: these are our current live prices and
// must be publicly readable once the frontend readers switch over (later step).

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { INDUSTRIES } from '../src/data/industries.ts';

// Dollar-quote a value so we never have to escape quotes/newlines/unicode.
const dq = (s, tag = 'vs') => {
  if (String(s).includes(`$${tag}$`)) throw new Error(`dollar-quote tag $${tag}$ collides with value: ${s}`);
  return `$${tag}$${s}$${tag}$`;
};
const jsonLit = (arr) => `${dq(JSON.stringify(arr), 'vsj')}::jsonb`;
const isVoiceLine = (s) => /^Inbound Voice Agent \(/.test(s);

// Derive the universal spine = items present in EVERY industry's base.includes
// (the industry-specific "core" lines and the per-tier voice line are not common
// to all, so they fall out of the intersection).
const baseIncludesPerIndustry = INDUSTRIES.map((i) => i.packages.find((p) => p.tier === 'base').includes);
const SPINE = new Set(
  baseIncludesPerIndustry[0].filter((item) => baseIncludesPerIndustry.every((list) => list.includes(item))),
);

// core_service_line = base.includes minus the spine and minus the voice line.
const coreServiceLine = (industry) => {
  const base = industry.packages.find((p) => p.tier === 'base');
  return base.includes.filter((x) => !SPINE.has(x) && !isVoiceLine(x)).join('; ');
};

const TIER_ORDER = { base: 0, growth: 1, everything: 2 };

const blocks = INDUSTRIES.map((industry, idx) => {
  const voiceNative = industry.packages.find((p) => p.tier === 'base').voiceMinutes > 0;

  const pkgRows = [...industry.packages]
    .sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier])
    .map((p) => {
      const incVat = Math.round(p.exVatPrice * 1.21); // inc_vat = round(exVat * 1.21)
      return `    (${dq(p.tier)}, ${dq(p.name)}, ${p.exVatPrice}, ${incVat}, ${p.voiceMinutes}, ${dq(p.tagline)}, ${jsonLit(p.includes)}, ${TIER_ORDER[p.tier]})`;
    })
    .join(',\n');

  return `-- ${industry.name}
WITH ind AS (
  INSERT INTO public.pricing_industries
    (slug, name, core_service_line, color, voice_native, sort_order, is_published)
  VALUES (${dq(industry.slug)}, ${dq(industry.name)}, ${dq(coreServiceLine(industry))}, ${dq(industry.color)}, ${voiceNative}, ${idx}, true)
  RETURNING id
)
INSERT INTO public.pricing_packages
  (industry_id, tier, name, ex_vat_price, inc_vat_price, voice_minutes, tagline, includes, sort_order)
SELECT ind.id, p.tier, p.name, p.ex_vat_price, p.inc_vat_price, p.voice_minutes, p.tagline, p.includes::jsonb, p.sort_order
FROM ind, (VALUES
${pkgRows}
) AS p(tier, name, ex_vat_price, inc_vat_price, voice_minutes, tagline, includes, sort_order);`;
}).join('\n\n');

const slugList = INDUSTRIES.map((i) => dq(i.slug)).join(', ');

const sql = `-- GENERATED FILE — do not edit by hand.
-- Source of truth: src/data/industries.ts (INDUSTRIES[].packages)
-- Regenerate:  npm run gen:pricing-db-seed
--
-- Step 2: backfill the editable pricing tables from the current code prices.
-- All rows seeded is_published = TRUE (current live prices). Re-applying replaces
-- the seeded slugs only (cascade removes their packages); admin-added industries
-- with other slugs are left untouched.

DELETE FROM public.pricing_industries WHERE slug IN (${slugList});

${blocks}
`;

const outFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../supabase/migrations/20260606130100_seed_pricing_db.sql');
writeFileSync(outFile, sql);
console.log('Wrote', path.relative(process.cwd(), outFile));
console.log(`Industries: ${INDUSTRIES.length}, spine items: ${SPINE.size}`);
