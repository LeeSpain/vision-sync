-- ============================================================================
-- P3.1 — The Tenant Factory schema · Part D: seed data
-- Seeds the node catalogue (from PRICING_PACKAGES §3/§4) and the 3 factory
-- pilot industry packs (D17: Hair & Beauty, Holiday Rentals, Trades).
--
-- Defaults only (D20 — "Claude ships sensible defaults; Lee tunes live").
-- ON CONFLICT DO NOTHING so re-runs / admin edits are never clobbered.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Nodes — the 9 sellable capabilities. Growth adds booking/qualifier/crm/
-- review; Everything adds whatsapp/social/email/voice; Payments is an add-on.
-- ---------------------------------------------------------------------------
INSERT INTO public.nodes (slug, name, description, category, min_tier, is_addon, addon_monthly_price, sort_order)
VALUES
  ('booking',          'Appointment Booking',   'Calendar sync, confirmations and reminders.',            'core',          'growth',     false, NULL,  10),
  ('lead-qualifier',   'Lead Qualifier',        'Scores and routes inbound leads.',                       'growth',        'growth',     false, NULL,  20),
  ('crm-sync',         'CRM Sync',              'Pushes leads and contacts to the client CRM.',           'growth',        'growth',     false, NULL,  30),
  ('review-manager',   'Review Manager',        'Requests, monitors and responds to reviews.',            'growth',        'growth',     false, NULL,  40),
  ('whatsapp-agent',   'WhatsApp Agent',        'Answers and captures leads over WhatsApp.',              'communication', 'everything', false, NULL,  50),
  ('social-responder', 'Social Media Responder','Responds to social DMs and comments.',                   'communication', 'everything', false, NULL,  60),
  ('email-follow-up',  'Email Follow-Up Agent', 'Automated, personalised email follow-up.',               'communication', 'everything', false, NULL,  70),
  ('voice',            'Voice Agent',           'Answers calls; minutes scale by tier.',                  'communication', 'everything', false, NULL,  80),
  ('payments',         'Take Payments & Deposits', 'Deposits and payments via the client own Stripe account. Add-on, Growth and Everything only.', 'commerce', 'growth', true, 49.00, 90)
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Pilot industry packs (D17). status='draft' — starter content; admin polishes
-- before publish. default_nodes are cumulative and consistent across tiers
-- (PRICING_PACKAGES §3). Copy carries merge fields ({{business_name}} etc.).
-- ---------------------------------------------------------------------------

-- Shared default node sets (kept identical across pilots per PRICING §3).
-- base: spine only (no nodes) · growth: +4 · everything: +4 comms/voice.

INSERT INTO public.industry_packs
  (slug, name, status, is_pilot, summary, section_layout, copy_templates,
   agent_prompt_template, interview_script, test_suite, default_nodes, sort_order)
VALUES
(
  'hair-beauty',
  'Hair & Beauty Salons',
  'draft', true,
  'AI booking agent, services and hours info for salons and beauty studios.',
  $json$["hero","services","booking","about","reviews","contact"]$json$::jsonb,
  $json${
    "en": {
      "hero_title": "{{business_name}} — book your appointment any time",
      "hero_subtitle": "Our AI answers questions and books you in, 24/7, in your language.",
      "about": "{{business_name}} serves {{service_area}}. Hours: {{hours}}."
    },
    "es": {
      "hero_title": "{{business_name}} — reserva tu cita a cualquier hora",
      "hero_subtitle": "Nuestra IA responde tus preguntas y te reserva, 24/7, en tu idioma.",
      "about": "{{business_name}} atiende en {{service_area}}. Horario: {{hours}}."
    }
  }$json$::jsonb,
  $prompt$You are the AI assistant for {{business_name}}, a hair & beauty business serving {{service_area}}. Languages: {{languages}}. Opening hours: {{hours}}. Services and prices: {{services}}.
Answer ONLY from these facts. If a question falls outside them, say you will pass it to the team and capture the customer's contact details. Be warm, concise, and offer to book an appointment. Never invent prices, availability, or policies.$prompt$,
  $json$[
    {"key":"business_name","q":"What is your salon called?"},
    {"key":"service_area","q":"Which town or area do you serve?"},
    {"key":"hours","q":"What are your opening hours?"},
    {"key":"services","q":"List your main services and prices."},
    {"key":"languages","q":"Which languages should the agent speak?"}
  ]$json$::jsonb,
  $json$[
    {"ask":"What time do you open on Saturday?","expect":"states Saturday hours from facts"},
    {"ask":"How much is a cut and colour?","expect":"quotes only listed prices, no invention"},
    {"ask":"Can I book for tomorrow at 3pm?","expect":"offers to book / capture details"},
    {"ask":"Do you do tattoos?","expect":"declines politely, captures enquiry if unlisted"}
  ]$json$::jsonb,
  $json${"base":[],"growth":["booking","lead-qualifier","crm-sync","review-manager"],"everything":["booking","lead-qualifier","crm-sync","review-manager","whatsapp-agent","social-responder","email-follow-up","voice"]}$json$::jsonb,
  10
),
(
  'holiday-rentals',
  'Holiday Rentals & Property Management',
  'draft', true,
  'Multilingual guest concierge, check-in and maintenance routing for rentals.',
  $json$["hero","properties","booking","guest_info","reviews","contact"]$json$::jsonb,
  $json${
    "en": {
      "hero_title": "{{business_name}} — your stay, sorted around the clock",
      "hero_subtitle": "A multilingual concierge that answers guests and handles check-in, 24/7.",
      "about": "{{business_name}} manages properties in {{service_area}}."
    },
    "es": {
      "hero_title": "{{business_name}} — tu estancia, resuelta a cualquier hora",
      "hero_subtitle": "Un conserje multilingue que atiende a huespedes y gestiona el check-in, 24/7.",
      "about": "{{business_name}} gestiona propiedades en {{service_area}}."
    }
  }$json$::jsonb,
  $prompt$You are the multilingual guest concierge for {{business_name}}, managing holiday properties in {{service_area}}. Languages: {{languages}}. Check-in/out and house rules: {{hours}}. Properties and rates: {{services}}.
Answer ONLY from these facts. For maintenance issues, gather details and route to the manager. For anything outside the facts, capture the guest's contact and escalate. Never invent availability, rates, or access instructions.$prompt$,
  $json$[
    {"key":"business_name","q":"What is your rental business called?"},
    {"key":"service_area","q":"Where are your properties located?"},
    {"key":"hours","q":"What are your check-in/out times and house rules?"},
    {"key":"services","q":"List your properties and nightly rates."},
    {"key":"languages","q":"Which languages should the agent speak?"}
  ]$json$::jsonb,
  $json$[
    {"ask":"What time is check-in?","expect":"states check-in time from facts"},
    {"ask":"Is the villa available next weekend?","expect":"does not invent availability; offers to check/capture"},
    {"ask":"The air-con is broken.","expect":"gathers details, routes to maintenance"},
    {"ask":"Can I get a late checkout?","expect":"answers from rules or escalates"}
  ]$json$::jsonb,
  $json${"base":[],"growth":["booking","lead-qualifier","crm-sync","review-manager"],"everything":["booking","lead-qualifier","crm-sync","review-manager","whatsapp-agent","social-responder","email-follow-up","voice"]}$json$::jsonb,
  20
),
(
  'trades',
  'Trades & Home Services',
  'draft', true,
  'AI quote-intake and job-qualification agent for trades and home services.',
  $json$["hero","services","quote_request","about","reviews","contact"]$json$::jsonb,
  $json${
    "en": {
      "hero_title": "{{business_name}} — get a quote without the phone tag",
      "hero_subtitle": "Our AI captures your job details and books a visit, day or night.",
      "about": "{{business_name}} covers {{service_area}}. Available: {{hours}}."
    },
    "es": {
      "hero_title": "{{business_name}} — pide presupuesto sin llamadas perdidas",
      "hero_subtitle": "Nuestra IA recoge los detalles de tu trabajo y agenda una visita, de dia o de noche.",
      "about": "{{business_name}} cubre {{service_area}}. Disponible: {{hours}}."
    }
  }$json$::jsonb,
  $prompt$You are the quote-intake assistant for {{business_name}}, a trades/home-services business covering {{service_area}}. Languages: {{languages}}. Availability: {{hours}}. Services: {{services}}.
Answer ONLY from these facts. Your job is to qualify the enquiry: capture the job type, location, urgency and contact details, then offer to book a site visit. Do NOT quote a firm price unless it is in the facts — say a visit or detailed quote is needed. Escalate anything outside scope.$prompt$,
  $json$[
    {"key":"business_name","q":"What is your business called?"},
    {"key":"service_area","q":"Which areas do you cover?"},
    {"key":"hours","q":"When are you available (and emergency hours)?"},
    {"key":"services","q":"List the services / trades you offer."},
    {"key":"languages","q":"Which languages should the agent speak?"}
  ]$json$::jsonb,
  $json$[
    {"ask":"Do you cover my area?","expect":"answers from service_area facts"},
    {"ask":"How much to fix a leaking tap?","expect":"does not invent a firm price; offers visit/quote"},
    {"ask":"It is an emergency, my pipe burst.","expect":"captures urgency + details, escalates"},
    {"ask":"Can someone come Tuesday?","expect":"captures details, offers to book a visit"}
  ]$json$::jsonb,
  $json${"base":[],"growth":["booking","lead-qualifier","crm-sync","review-manager"],"everything":["booking","lead-qualifier","crm-sync","review-manager","whatsapp-agent","social-responder","email-follow-up","voice"]}$json$::jsonb,
  30
)
ON CONFLICT (slug) DO NOTHING;
