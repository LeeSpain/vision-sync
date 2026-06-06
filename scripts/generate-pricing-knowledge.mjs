// Generates the canonical pricing-knowledge seed migration for the AI agent.
//
// Why this exists: Supabase Deno edge functions (ai-chat) cannot import from src/,
// so the agent reads pricing from the `ai_training_data` table at runtime. To keep
// the AI and the site from ever diverging, we DERIVE that DB seed from the single
// source of truth (src/data/industries.ts) instead of hand-typing prices.
//
// Run:  npm run gen:pricing-knowledge
// Then: apply the emitted migration (supabase db push) and redeploy is NOT needed —
// the ai-chat function already injects ai_training_data into its system prompt.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { INDUSTRIES } from '../src/data/industries.ts';

const sqlEscape = (s) => s.replace(/'/g, "''");
const eur = (n) => `€${n}`;
const voiceNote = (p) => (p.voiceMinutes > 0 ? `, voice ${p.voiceMinutes.toLocaleString('en-US')} min` : ', no voice');

function buildKnowledge() {
  const out = [];
  out.push('VISION-SYNC PRICING — canonical. All figures are per month, ex-VAT (euros).');
  out.push('Clients are invoiced +21% IVA; the "inc." figure is the VAT-inclusive monthly price.');
  out.push('Tiers are cumulative: Growth includes everything in Base; Everything includes everything in Growth.');
  out.push('Everything always adds WhatsApp Agent, Social Media Responder and Email Follow-Up Agent, plus a voice agent (added for chat-led industries, increased minutes for voice-native ones).');
  out.push('Anything not listed is a custom add-on, quoted separately.');
  out.push('');

  for (const ind of INDUSTRIES) {
    const base = ind.packages.find((p) => p.tier === 'base');
    const growth = ind.packages.find((p) => p.tier === 'growth');
    const everything = ind.packages.find((p) => p.tier === 'everything');

    const baseSet = new Set(base.includes);
    const growthSet = new Set(growth.includes);
    const growthAdds = growth.includes.filter((i) => !baseSet.has(i));
    const everythingAdds = everything.includes.filter((i) => !growthSet.has(i));

    out.push(`== ${ind.name} ==`);
    out.push(`Base — ${eur(base.exVatPrice)}/mo (+21% IVA = ${eur(base.incVatPrice)} inc.)${voiceNote(base)}.`);
    out.push(`  Includes: ${base.includes.join('; ')}.`);
    out.push(`Growth — ${eur(growth.exVatPrice)}/mo (+21% IVA = ${eur(growth.incVatPrice)} inc.)${voiceNote(growth)}.`);
    out.push(`  Adds on top of Base: ${growthAdds.join('; ')}.`);
    out.push(`Everything — ${eur(everything.exVatPrice)}/mo (+21% IVA = ${eur(everything.incVatPrice)} inc.)${voiceNote(everything)}.`);
    out.push(`  Adds on top of Growth: ${everythingAdds.join('; ')}.`);
    out.push('');
  }
  return out.join('\n').trim();
}

const knowledge = buildKnowledge();
const question =
  'How much does Vision-Sync cost? Full pricing for every industry and tier (Base, Growth, Everything), ex-VAT with +21% IVA and voice minutes.';

const d = new Date();
const pad = (n) => String(n).padStart(2, '0');
const ts = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;

const sql = `-- GENERATED FILE — do not edit by hand.
-- Source of truth: src/data/industries.ts (INDUSTRIES[].packages)
-- Regenerate after any price change:  npm run gen:pricing-knowledge
--
-- Seeds the canonical pricing knowledge the ai-chat agent injects into its system
-- prompt (active ai_training_data rows are concatenated into the prompt at runtime).
-- Re-applying reconciles the row via delete-then-insert (keyed on training_type).
-- Live schema: public.ai_training_data(training_type, content, metadata, is_active).
-- Content is dollar-quoted ($vsknowledge$) so no escaping is needed.

DELETE FROM public.ai_training_data WHERE training_type = 'pricing_canonical';

INSERT INTO public.ai_training_data (training_type, content, metadata, is_active)
VALUES (
  'pricing_canonical',
  $vsknowledge$${knowledge}$vsknowledge$,
  '{"type":"pricing","generated_from":"src/data/industries.ts"}'::jsonb,
  true
);
`;

const outDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../supabase/migrations');
const outFile = path.join(outDir, `${ts}_seed_pricing_knowledge.sql`);
writeFileSync(outFile, sql);

console.log('Wrote', path.relative(process.cwd(), outFile));
console.log('\n----- knowledge preview -----\n');
console.log(knowledge);
