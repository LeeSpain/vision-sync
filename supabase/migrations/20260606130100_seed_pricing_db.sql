-- GENERATED FILE — do not edit by hand.
-- Source of truth: src/data/industries.ts (INDUSTRIES[].packages)
-- Regenerate:  npm run gen:pricing-db-seed
--
-- Step 2: backfill the editable pricing tables from the current code prices.
-- All rows seeded is_published = TRUE (current live prices). Re-applying replaces
-- the seeded slugs only (cascade removes their packages); admin-added industries
-- with other slugs are left untouched.

DELETE FROM public.pricing_industries WHERE slug IN ($vs$estate-agents$vs$, $vs$dental-clinics$vs$, $vs$legal-gestorias$vs$, $vs$holiday-rentals$vs$, $vs$gyms-fitness$vs$, $vs$building-renovation$vs$, $vs$restaurants-bars$vs$, $vs$beauty-hair$vs$);

-- Estate Agents
WITH ind AS (
  INSERT INTO public.pricing_industries
    (slug, name, core_service_line, color, voice_native, sort_order, is_published)
  VALUES ($vs$estate-agents$vs$, $vs$Estate Agents$vs$, $vs$Buyer/seller enquiry capture; Viewing-request handling$vs$, $vs$blue$vs$, false, 0, true)
  RETURNING id
)
INSERT INTO public.pricing_packages
  (industry_id, tier, name, ex_vat_price, inc_vat_price, voice_minutes, tagline, includes, sort_order)
SELECT ind.id, p.tier, p.name, p.ex_vat_price, p.inc_vat_price, p.voice_minutes, p.tagline, p.includes::jsonb, p.sort_order
FROM ind, (VALUES
    ($vs$base$vs$, $vs$Base$vs$, 349, 422, 0, $vs$Everything you need to capture and answer every enquiry, 24/7.$vs$, $vsj$["Branded landing page / microsite — built, hosted, on your domain","AI agent trained on your business — English + Spanish","Website chat widget (embedded, live)","Lead & enquiry capture","Instant owner notifications (email + WhatsApp alert)","Client dashboard — view leads & conversations (Data Intelligence Hub)","24/7 availability","Onboarding & setup","Buyer/seller enquiry capture","Viewing-request handling"]$vsj$::jsonb, 0),
    ($vs$growth$vs$, $vs$Growth$vs$, 549, 664, 0, $vs$Booking, qualifying, CRM and reviews — turn enquiries into booked business.$vs$, $vsj$["Branded landing page / microsite — built, hosted, on your domain","AI agent trained on your business — English + Spanish","Website chat widget (embedded, live)","Lead & enquiry capture","Instant owner notifications (email + WhatsApp alert)","Client dashboard — view leads & conversations (Data Intelligence Hub)","24/7 availability","Onboarding & setup","Buyer/seller enquiry capture","Viewing-request handling","Appointment Booking (calendar sync, confirmations, reminders)","Lead Qualifier (scoring & routing)","CRM Sync","Review Manager"]$vsj$::jsonb, 1),
    ($vs$everything$vs$, $vs$Everything$vs$, 849, 1027, 1000, $vs$Full omnichannel coverage — voice, WhatsApp, social and email.$vs$, $vsj$["Branded landing page / microsite — built, hosted, on your domain","AI agent trained on your business — English + Spanish","Website chat widget (embedded, live)","Lead & enquiry capture","Instant owner notifications (email + WhatsApp alert)","Client dashboard — view leads & conversations (Data Intelligence Hub)","24/7 availability","Onboarding & setup","Buyer/seller enquiry capture","Viewing-request handling","Appointment Booking (calendar sync, confirmations, reminders)","Lead Qualifier (scoring & routing)","CRM Sync","Review Manager","WhatsApp Agent","Social Media Responder","Email Follow-Up Agent","Inbound Voice Agent (1,000 mins/mo)"]$vsj$::jsonb, 2)
) AS p(tier, name, ex_vat_price, inc_vat_price, voice_minutes, tagline, includes, sort_order);

-- Dental & Health Clinics
WITH ind AS (
  INSERT INTO public.pricing_industries
    (slug, name, core_service_line, color, voice_native, sort_order, is_published)
  VALUES ($vs$dental-clinics$vs$, $vs$Dental & Health Clinics$vs$, $vs$AI receptionist; Appointment enquiries & emergency routing$vs$, $vs$green$vs$, true, 1, true)
  RETURNING id
)
INSERT INTO public.pricing_packages
  (industry_id, tier, name, ex_vat_price, inc_vat_price, voice_minutes, tagline, includes, sort_order)
SELECT ind.id, p.tier, p.name, p.ex_vat_price, p.inc_vat_price, p.voice_minutes, p.tagline, p.includes::jsonb, p.sort_order
FROM ind, (VALUES
    ($vs$base$vs$, $vs$Base$vs$, 489, 592, 1500, $vs$Everything you need to capture and answer every enquiry, 24/7.$vs$, $vsj$["Branded landing page / microsite — built, hosted, on your domain","AI agent trained on your business — English + Spanish","Website chat widget (embedded, live)","Lead & enquiry capture","Instant owner notifications (email + WhatsApp alert)","Client dashboard — view leads & conversations (Data Intelligence Hub)","24/7 availability","Onboarding & setup","AI receptionist","Appointment enquiries & emergency routing","Inbound Voice Agent (1,500 mins/mo)"]$vsj$::jsonb, 0),
    ($vs$growth$vs$, $vs$Growth$vs$, 689, 834, 1500, $vs$Booking, qualifying, CRM and reviews — turn enquiries into booked business.$vs$, $vsj$["Branded landing page / microsite — built, hosted, on your domain","AI agent trained on your business — English + Spanish","Website chat widget (embedded, live)","Lead & enquiry capture","Instant owner notifications (email + WhatsApp alert)","Client dashboard — view leads & conversations (Data Intelligence Hub)","24/7 availability","Onboarding & setup","AI receptionist","Appointment enquiries & emergency routing","Appointment Booking (calendar sync, confirmations, reminders)","Lead Qualifier (scoring & routing)","CRM Sync","Review Manager","Inbound Voice Agent (1,500 mins/mo)"]$vsj$::jsonb, 1),
    ($vs$everything$vs$, $vs$Everything$vs$, 989, 1197, 3000, $vs$Full omnichannel coverage — voice, WhatsApp, social and email.$vs$, $vsj$["Branded landing page / microsite — built, hosted, on your domain","AI agent trained on your business — English + Spanish","Website chat widget (embedded, live)","Lead & enquiry capture","Instant owner notifications (email + WhatsApp alert)","Client dashboard — view leads & conversations (Data Intelligence Hub)","24/7 availability","Onboarding & setup","AI receptionist","Appointment enquiries & emergency routing","Appointment Booking (calendar sync, confirmations, reminders)","Lead Qualifier (scoring & routing)","CRM Sync","Review Manager","WhatsApp Agent","Social Media Responder","Email Follow-Up Agent","Inbound Voice Agent (3,000 mins/mo)"]$vsj$::jsonb, 2)
) AS p(tier, name, ex_vat_price, inc_vat_price, voice_minutes, tagline, includes, sort_order);

-- Legal Firms & Gestorias
WITH ind AS (
  INSERT INTO public.pricing_industries
    (slug, name, core_service_line, color, voice_native, sort_order, is_published)
  VALUES ($vs$legal-gestorias$vs$, $vs$Legal Firms & Gestorias$vs$, $vs$Client intake Q&A; Document FAQ & consultation enquiries$vs$, $vs$purple$vs$, false, 2, true)
  RETURNING id
)
INSERT INTO public.pricing_packages
  (industry_id, tier, name, ex_vat_price, inc_vat_price, voice_minutes, tagline, includes, sort_order)
SELECT ind.id, p.tier, p.name, p.ex_vat_price, p.inc_vat_price, p.voice_minutes, p.tagline, p.includes::jsonb, p.sort_order
FROM ind, (VALUES
    ($vs$base$vs$, $vs$Base$vs$, 279, 338, 0, $vs$Everything you need to capture and answer every enquiry, 24/7.$vs$, $vsj$["Branded landing page / microsite — built, hosted, on your domain","AI agent trained on your business — English + Spanish","Website chat widget (embedded, live)","Lead & enquiry capture","Instant owner notifications (email + WhatsApp alert)","Client dashboard — view leads & conversations (Data Intelligence Hub)","24/7 availability","Onboarding & setup","Client intake Q&A","Document FAQ & consultation enquiries"]$vsj$::jsonb, 0),
    ($vs$growth$vs$, $vs$Growth$vs$, 479, 580, 0, $vs$Booking, qualifying, CRM and reviews — turn enquiries into booked business.$vs$, $vsj$["Branded landing page / microsite — built, hosted, on your domain","AI agent trained on your business — English + Spanish","Website chat widget (embedded, live)","Lead & enquiry capture","Instant owner notifications (email + WhatsApp alert)","Client dashboard — view leads & conversations (Data Intelligence Hub)","24/7 availability","Onboarding & setup","Client intake Q&A","Document FAQ & consultation enquiries","Appointment Booking (calendar sync, confirmations, reminders)","Lead Qualifier (scoring & routing)","CRM Sync","Review Manager"]$vsj$::jsonb, 1),
    ($vs$everything$vs$, $vs$Everything$vs$, 779, 943, 1000, $vs$Full omnichannel coverage — voice, WhatsApp, social and email.$vs$, $vsj$["Branded landing page / microsite — built, hosted, on your domain","AI agent trained on your business — English + Spanish","Website chat widget (embedded, live)","Lead & enquiry capture","Instant owner notifications (email + WhatsApp alert)","Client dashboard — view leads & conversations (Data Intelligence Hub)","24/7 availability","Onboarding & setup","Client intake Q&A","Document FAQ & consultation enquiries","Appointment Booking (calendar sync, confirmations, reminders)","Lead Qualifier (scoring & routing)","CRM Sync","Review Manager","WhatsApp Agent","Social Media Responder","Email Follow-Up Agent","Inbound Voice Agent (1,000 mins/mo)"]$vsj$::jsonb, 2)
) AS p(tier, name, ex_vat_price, inc_vat_price, voice_minutes, tagline, includes, sort_order);

-- Holiday Rentals & Property Management
WITH ind AS (
  INSERT INTO public.pricing_industries
    (slug, name, core_service_line, color, voice_native, sort_order, is_published)
  VALUES ($vs$holiday-rentals$vs$, $vs$Holiday Rentals & Property Management$vs$, $vs$Multilingual guest concierge; Check-in & maintenance routing$vs$, $vs$orange$vs$, false, 3, true)
  RETURNING id
)
INSERT INTO public.pricing_packages
  (industry_id, tier, name, ex_vat_price, inc_vat_price, voice_minutes, tagline, includes, sort_order)
SELECT ind.id, p.tier, p.name, p.ex_vat_price, p.inc_vat_price, p.voice_minutes, p.tagline, p.includes::jsonb, p.sort_order
FROM ind, (VALUES
    ($vs$base$vs$, $vs$Base$vs$, 249, 301, 0, $vs$Everything you need to capture and answer every enquiry, 24/7.$vs$, $vsj$["Branded landing page / microsite — built, hosted, on your domain","AI agent trained on your business — English + Spanish","Website chat widget (embedded, live)","Lead & enquiry capture","Instant owner notifications (email + WhatsApp alert)","Client dashboard — view leads & conversations (Data Intelligence Hub)","24/7 availability","Onboarding & setup","Multilingual guest concierge","Check-in & maintenance routing"]$vsj$::jsonb, 0),
    ($vs$growth$vs$, $vs$Growth$vs$, 449, 543, 0, $vs$Booking, qualifying, CRM and reviews — turn enquiries into booked business.$vs$, $vsj$["Branded landing page / microsite — built, hosted, on your domain","AI agent trained on your business — English + Spanish","Website chat widget (embedded, live)","Lead & enquiry capture","Instant owner notifications (email + WhatsApp alert)","Client dashboard — view leads & conversations (Data Intelligence Hub)","24/7 availability","Onboarding & setup","Multilingual guest concierge","Check-in & maintenance routing","Appointment Booking (calendar sync, confirmations, reminders)","Lead Qualifier (scoring & routing)","CRM Sync","Review Manager"]$vsj$::jsonb, 1),
    ($vs$everything$vs$, $vs$Everything$vs$, 749, 906, 1000, $vs$Full omnichannel coverage — voice, WhatsApp, social and email.$vs$, $vsj$["Branded landing page / microsite — built, hosted, on your domain","AI agent trained on your business — English + Spanish","Website chat widget (embedded, live)","Lead & enquiry capture","Instant owner notifications (email + WhatsApp alert)","Client dashboard — view leads & conversations (Data Intelligence Hub)","24/7 availability","Onboarding & setup","Multilingual guest concierge","Check-in & maintenance routing","Appointment Booking (calendar sync, confirmations, reminders)","Lead Qualifier (scoring & routing)","CRM Sync","Review Manager","WhatsApp Agent","Social Media Responder","Email Follow-Up Agent","Inbound Voice Agent (1,000 mins/mo)"]$vsj$::jsonb, 2)
) AS p(tier, name, ex_vat_price, inc_vat_price, voice_minutes, tagline, includes, sort_order);

-- Gyms & Fitness Studios
WITH ind AS (
  INSERT INTO public.pricing_industries
    (slug, name, core_service_line, color, voice_native, sort_order, is_published)
  VALUES ($vs$gyms-fitness$vs$, $vs$Gyms & Fitness Studios$vs$, $vs$Membership & class enquiries; Lead capture & follow-up$vs$, $vs$green$vs$, true, 4, true)
  RETURNING id
)
INSERT INTO public.pricing_packages
  (industry_id, tier, name, ex_vat_price, inc_vat_price, voice_minutes, tagline, includes, sort_order)
SELECT ind.id, p.tier, p.name, p.ex_vat_price, p.inc_vat_price, p.voice_minutes, p.tagline, p.includes::jsonb, p.sort_order
FROM ind, (VALUES
    ($vs$base$vs$, $vs$Base$vs$, 319, 386, 500, $vs$Everything you need to capture and answer every enquiry, 24/7.$vs$, $vsj$["Branded landing page / microsite — built, hosted, on your domain","AI agent trained on your business — English + Spanish","Website chat widget (embedded, live)","Lead & enquiry capture","Instant owner notifications (email + WhatsApp alert)","Client dashboard — view leads & conversations (Data Intelligence Hub)","24/7 availability","Onboarding & setup","Membership & class enquiries","Lead capture & follow-up","Inbound Voice Agent (500 mins/mo)"]$vsj$::jsonb, 0),
    ($vs$growth$vs$, $vs$Growth$vs$, 519, 628, 500, $vs$Booking, qualifying, CRM and reviews — turn enquiries into booked business.$vs$, $vsj$["Branded landing page / microsite — built, hosted, on your domain","AI agent trained on your business — English + Spanish","Website chat widget (embedded, live)","Lead & enquiry capture","Instant owner notifications (email + WhatsApp alert)","Client dashboard — view leads & conversations (Data Intelligence Hub)","24/7 availability","Onboarding & setup","Membership & class enquiries","Lead capture & follow-up","Appointment Booking (calendar sync, confirmations, reminders)","Lead Qualifier (scoring & routing)","CRM Sync","Review Manager","Inbound Voice Agent (500 mins/mo)"]$vsj$::jsonb, 1),
    ($vs$everything$vs$, $vs$Everything$vs$, 819, 991, 1000, $vs$Full omnichannel coverage — voice, WhatsApp, social and email.$vs$, $vsj$["Branded landing page / microsite — built, hosted, on your domain","AI agent trained on your business — English + Spanish","Website chat widget (embedded, live)","Lead & enquiry capture","Instant owner notifications (email + WhatsApp alert)","Client dashboard — view leads & conversations (Data Intelligence Hub)","24/7 availability","Onboarding & setup","Membership & class enquiries","Lead capture & follow-up","Appointment Booking (calendar sync, confirmations, reminders)","Lead Qualifier (scoring & routing)","CRM Sync","Review Manager","WhatsApp Agent","Social Media Responder","Email Follow-Up Agent","Inbound Voice Agent (1,000 mins/mo)"]$vsj$::jsonb, 2)
) AS p(tier, name, ex_vat_price, inc_vat_price, voice_minutes, tagline, includes, sort_order);

-- Building & Renovation
WITH ind AS (
  INSERT INTO public.pricing_industries
    (slug, name, core_service_line, color, voice_native, sort_order, is_published)
  VALUES ($vs$building-renovation$vs$, $vs$Building & Renovation$vs$, $vs$AI quote-intake & job-qualification agent$vs$, $vs$amber$vs$, false, 5, true)
  RETURNING id
)
INSERT INTO public.pricing_packages
  (industry_id, tier, name, ex_vat_price, inc_vat_price, voice_minutes, tagline, includes, sort_order)
SELECT ind.id, p.tier, p.name, p.ex_vat_price, p.inc_vat_price, p.voice_minutes, p.tagline, p.includes::jsonb, p.sort_order
FROM ind, (VALUES
    ($vs$base$vs$, $vs$Base$vs$, 209, 253, 0, $vs$Everything you need to capture and answer every enquiry, 24/7.$vs$, $vsj$["Branded landing page / microsite — built, hosted, on your domain","AI agent trained on your business — English + Spanish","Website chat widget (embedded, live)","Lead & enquiry capture","Instant owner notifications (email + WhatsApp alert)","Client dashboard — view leads & conversations (Data Intelligence Hub)","24/7 availability","Onboarding & setup","AI quote-intake & job-qualification agent"]$vsj$::jsonb, 0),
    ($vs$growth$vs$, $vs$Growth$vs$, 409, 495, 0, $vs$Booking, qualifying, CRM and reviews — turn enquiries into booked business.$vs$, $vsj$["Branded landing page / microsite — built, hosted, on your domain","AI agent trained on your business — English + Spanish","Website chat widget (embedded, live)","Lead & enquiry capture","Instant owner notifications (email + WhatsApp alert)","Client dashboard — view leads & conversations (Data Intelligence Hub)","24/7 availability","Onboarding & setup","AI quote-intake & job-qualification agent","Appointment Booking (calendar sync, confirmations, reminders)","Lead Qualifier (scoring & routing)","CRM Sync","Review Manager"]$vsj$::jsonb, 1),
    ($vs$everything$vs$, $vs$Everything$vs$, 709, 858, 1000, $vs$Full omnichannel coverage — voice, WhatsApp, social and email.$vs$, $vsj$["Branded landing page / microsite — built, hosted, on your domain","AI agent trained on your business — English + Spanish","Website chat widget (embedded, live)","Lead & enquiry capture","Instant owner notifications (email + WhatsApp alert)","Client dashboard — view leads & conversations (Data Intelligence Hub)","24/7 availability","Onboarding & setup","AI quote-intake & job-qualification agent","Appointment Booking (calendar sync, confirmations, reminders)","Lead Qualifier (scoring & routing)","CRM Sync","Review Manager","WhatsApp Agent","Social Media Responder","Email Follow-Up Agent","Inbound Voice Agent (1,000 mins/mo)"]$vsj$::jsonb, 2)
) AS p(tier, name, ex_vat_price, inc_vat_price, voice_minutes, tagline, includes, sort_order);

-- Restaurants & Bars
WITH ind AS (
  INSERT INTO public.pricing_industries
    (slug, name, core_service_line, color, voice_native, sort_order, is_published)
  VALUES ($vs$restaurants-bars$vs$, $vs$Restaurants & Bars$vs$, $vs$AI reservations agent; Menu/hours FAQ & booking confirmations$vs$, $vs$red$vs$, true, 6, true)
  RETURNING id
)
INSERT INTO public.pricing_packages
  (industry_id, tier, name, ex_vat_price, inc_vat_price, voice_minutes, tagline, includes, sort_order)
SELECT ind.id, p.tier, p.name, p.ex_vat_price, p.inc_vat_price, p.voice_minutes, p.tagline, p.includes::jsonb, p.sort_order
FROM ind, (VALUES
    ($vs$base$vs$, $vs$Base$vs$, 475, 575, 1500, $vs$Everything you need to capture and answer every enquiry, 24/7.$vs$, $vsj$["Branded landing page / microsite — built, hosted, on your domain","AI agent trained on your business — English + Spanish","Website chat widget (embedded, live)","Lead & enquiry capture","Instant owner notifications (email + WhatsApp alert)","Client dashboard — view leads & conversations (Data Intelligence Hub)","24/7 availability","Onboarding & setup","AI reservations agent","Menu/hours FAQ & booking confirmations","Inbound Voice Agent (1,500 mins/mo)"]$vsj$::jsonb, 0),
    ($vs$growth$vs$, $vs$Growth$vs$, 619, 749, 1500, $vs$Booking, qualifying, CRM and reviews — turn enquiries into booked business.$vs$, $vsj$["Branded landing page / microsite — built, hosted, on your domain","AI agent trained on your business — English + Spanish","Website chat widget (embedded, live)","Lead & enquiry capture","Instant owner notifications (email + WhatsApp alert)","Client dashboard — view leads & conversations (Data Intelligence Hub)","24/7 availability","Onboarding & setup","AI reservations agent","Menu/hours FAQ & booking confirmations","Appointment Booking (calendar sync, confirmations, reminders)","Lead Qualifier (scoring & routing)","CRM Sync","Review Manager","Inbound Voice Agent (1,500 mins/mo)"]$vsj$::jsonb, 1),
    ($vs$everything$vs$, $vs$Everything$vs$, 919, 1112, 3000, $vs$Full omnichannel coverage — voice, WhatsApp, social and email.$vs$, $vsj$["Branded landing page / microsite — built, hosted, on your domain","AI agent trained on your business — English + Spanish","Website chat widget (embedded, live)","Lead & enquiry capture","Instant owner notifications (email + WhatsApp alert)","Client dashboard — view leads & conversations (Data Intelligence Hub)","24/7 availability","Onboarding & setup","AI reservations agent","Menu/hours FAQ & booking confirmations","Appointment Booking (calendar sync, confirmations, reminders)","Lead Qualifier (scoring & routing)","CRM Sync","Review Manager","WhatsApp Agent","Social Media Responder","Email Follow-Up Agent","Inbound Voice Agent (3,000 mins/mo)"]$vsj$::jsonb, 2)
) AS p(tier, name, ex_vat_price, inc_vat_price, voice_minutes, tagline, includes, sort_order);

-- Beauty & Hair Salons
WITH ind AS (
  INSERT INTO public.pricing_industries
    (slug, name, core_service_line, color, voice_native, sort_order, is_published)
  VALUES ($vs$beauty-hair$vs$, $vs$Beauty & Hair Salons$vs$, $vs$AI booking agent; Services & opening hours info$vs$, $vs$pink$vs$, true, 7, true)
  RETURNING id
)
INSERT INTO public.pricing_packages
  (industry_id, tier, name, ex_vat_price, inc_vat_price, voice_minutes, tagline, includes, sort_order)
SELECT ind.id, p.tier, p.name, p.ex_vat_price, p.inc_vat_price, p.voice_minutes, p.tagline, p.includes::jsonb, p.sort_order
FROM ind, (VALUES
    ($vs$base$vs$, $vs$Base$vs$, 249, 301, 500, $vs$Everything you need to capture and answer every enquiry, 24/7.$vs$, $vsj$["Branded landing page / microsite — built, hosted, on your domain","AI agent trained on your business — English + Spanish","Website chat widget (embedded, live)","Lead & enquiry capture","Instant owner notifications (email + WhatsApp alert)","Client dashboard — view leads & conversations (Data Intelligence Hub)","24/7 availability","Onboarding & setup","AI booking agent","Services & opening hours info","Inbound Voice Agent (500 mins/mo)"]$vsj$::jsonb, 0),
    ($vs$growth$vs$, $vs$Growth$vs$, 449, 543, 500, $vs$Booking, qualifying, CRM and reviews — turn enquiries into booked business.$vs$, $vsj$["Branded landing page / microsite — built, hosted, on your domain","AI agent trained on your business — English + Spanish","Website chat widget (embedded, live)","Lead & enquiry capture","Instant owner notifications (email + WhatsApp alert)","Client dashboard — view leads & conversations (Data Intelligence Hub)","24/7 availability","Onboarding & setup","AI booking agent","Services & opening hours info","Appointment Booking (calendar sync, confirmations, reminders)","Lead Qualifier (scoring & routing)","CRM Sync","Review Manager","Inbound Voice Agent (500 mins/mo)"]$vsj$::jsonb, 1),
    ($vs$everything$vs$, $vs$Everything$vs$, 749, 906, 1000, $vs$Full omnichannel coverage — voice, WhatsApp, social and email.$vs$, $vsj$["Branded landing page / microsite — built, hosted, on your domain","AI agent trained on your business — English + Spanish","Website chat widget (embedded, live)","Lead & enquiry capture","Instant owner notifications (email + WhatsApp alert)","Client dashboard — view leads & conversations (Data Intelligence Hub)","24/7 availability","Onboarding & setup","AI booking agent","Services & opening hours info","Appointment Booking (calendar sync, confirmations, reminders)","Lead Qualifier (scoring & routing)","CRM Sync","Review Manager","WhatsApp Agent","Social Media Responder","Email Follow-Up Agent","Inbound Voice Agent (1,000 mins/mo)"]$vsj$::jsonb, 2)
) AS p(tier, name, ex_vat_price, inc_vat_price, voice_minutes, tagline, includes, sort_order);
