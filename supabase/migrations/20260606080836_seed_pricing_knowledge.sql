-- GENERATED FILE — do not edit by hand.
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
  $vsknowledge$VISION-SYNC PRICING — canonical. All figures are per month, ex-VAT (euros).
Clients are invoiced +21% IVA; the "inc." figure is the VAT-inclusive monthly price.
Tiers are cumulative: Growth includes everything in Base; Everything includes everything in Growth.
Everything always adds WhatsApp Agent, Social Media Responder and Email Follow-Up Agent, plus a voice agent (added for chat-led industries, increased minutes for voice-native ones).
Anything not listed is a custom add-on, quoted separately.

== Estate Agents ==
Base — €349/mo (+21% IVA = €422 inc.), no voice.
  Includes: Branded landing page / microsite — built, hosted, on your domain; AI agent trained on your business — English + Spanish; Website chat widget (embedded, live); Lead & enquiry capture; Instant owner notifications (email + WhatsApp alert); Client dashboard — view leads & conversations (Data Intelligence Hub); 24/7 availability; Onboarding & setup; Buyer/seller enquiry capture; Viewing-request handling.
Growth — €549/mo (+21% IVA = €664 inc.), no voice.
  Adds on top of Base: Appointment Booking (calendar sync, confirmations, reminders); Lead Qualifier (scoring & routing); CRM Sync; Review Manager.
Everything — €849/mo (+21% IVA = €1027 inc.), voice 1,000 min.
  Adds on top of Growth: WhatsApp Agent; Social Media Responder; Email Follow-Up Agent; Inbound Voice Agent (1,000 mins/mo).

== Dental & Health Clinics ==
Base — €489/mo (+21% IVA = €592 inc.), voice 1,500 min.
  Includes: Branded landing page / microsite — built, hosted, on your domain; AI agent trained on your business — English + Spanish; Website chat widget (embedded, live); Lead & enquiry capture; Instant owner notifications (email + WhatsApp alert); Client dashboard — view leads & conversations (Data Intelligence Hub); 24/7 availability; Onboarding & setup; AI receptionist; Appointment enquiries & emergency routing; Inbound Voice Agent (1,500 mins/mo).
Growth — €689/mo (+21% IVA = €834 inc.), voice 1,500 min.
  Adds on top of Base: Appointment Booking (calendar sync, confirmations, reminders); Lead Qualifier (scoring & routing); CRM Sync; Review Manager.
Everything — €989/mo (+21% IVA = €1197 inc.), voice 3,000 min.
  Adds on top of Growth: WhatsApp Agent; Social Media Responder; Email Follow-Up Agent; Inbound Voice Agent (3,000 mins/mo).

== Legal Firms & Gestorias ==
Base — €279/mo (+21% IVA = €338 inc.), no voice.
  Includes: Branded landing page / microsite — built, hosted, on your domain; AI agent trained on your business — English + Spanish; Website chat widget (embedded, live); Lead & enquiry capture; Instant owner notifications (email + WhatsApp alert); Client dashboard — view leads & conversations (Data Intelligence Hub); 24/7 availability; Onboarding & setup; Client intake Q&A; Document FAQ & consultation enquiries.
Growth — €479/mo (+21% IVA = €580 inc.), no voice.
  Adds on top of Base: Appointment Booking (calendar sync, confirmations, reminders); Lead Qualifier (scoring & routing); CRM Sync; Review Manager.
Everything — €779/mo (+21% IVA = €943 inc.), voice 1,000 min.
  Adds on top of Growth: WhatsApp Agent; Social Media Responder; Email Follow-Up Agent; Inbound Voice Agent (1,000 mins/mo).

== Holiday Rentals & Property Management ==
Base — €249/mo (+21% IVA = €301 inc.), no voice.
  Includes: Branded landing page / microsite — built, hosted, on your domain; AI agent trained on your business — English + Spanish; Website chat widget (embedded, live); Lead & enquiry capture; Instant owner notifications (email + WhatsApp alert); Client dashboard — view leads & conversations (Data Intelligence Hub); 24/7 availability; Onboarding & setup; Multilingual guest concierge; Check-in & maintenance routing.
Growth — €449/mo (+21% IVA = €543 inc.), no voice.
  Adds on top of Base: Appointment Booking (calendar sync, confirmations, reminders); Lead Qualifier (scoring & routing); CRM Sync; Review Manager.
Everything — €749/mo (+21% IVA = €906 inc.), voice 1,000 min.
  Adds on top of Growth: WhatsApp Agent; Social Media Responder; Email Follow-Up Agent; Inbound Voice Agent (1,000 mins/mo).

== Gyms & Fitness Studios ==
Base — €319/mo (+21% IVA = €386 inc.), voice 500 min.
  Includes: Branded landing page / microsite — built, hosted, on your domain; AI agent trained on your business — English + Spanish; Website chat widget (embedded, live); Lead & enquiry capture; Instant owner notifications (email + WhatsApp alert); Client dashboard — view leads & conversations (Data Intelligence Hub); 24/7 availability; Onboarding & setup; Membership & class enquiries; Lead capture & follow-up; Inbound Voice Agent (500 mins/mo).
Growth — €519/mo (+21% IVA = €628 inc.), voice 500 min.
  Adds on top of Base: Appointment Booking (calendar sync, confirmations, reminders); Lead Qualifier (scoring & routing); CRM Sync; Review Manager.
Everything — €819/mo (+21% IVA = €991 inc.), voice 1,000 min.
  Adds on top of Growth: WhatsApp Agent; Social Media Responder; Email Follow-Up Agent; Inbound Voice Agent (1,000 mins/mo).

== Building & Renovation ==
Base — €209/mo (+21% IVA = €253 inc.), no voice.
  Includes: Branded landing page / microsite — built, hosted, on your domain; AI agent trained on your business — English + Spanish; Website chat widget (embedded, live); Lead & enquiry capture; Instant owner notifications (email + WhatsApp alert); Client dashboard — view leads & conversations (Data Intelligence Hub); 24/7 availability; Onboarding & setup; AI quote-intake & job-qualification agent.
Growth — €409/mo (+21% IVA = €495 inc.), no voice.
  Adds on top of Base: Appointment Booking (calendar sync, confirmations, reminders); Lead Qualifier (scoring & routing); CRM Sync; Review Manager.
Everything — €709/mo (+21% IVA = €858 inc.), voice 1,000 min.
  Adds on top of Growth: WhatsApp Agent; Social Media Responder; Email Follow-Up Agent; Inbound Voice Agent (1,000 mins/mo).

== Restaurants & Bars ==
Base — €475/mo (+21% IVA = €575 inc.), voice 1,500 min.
  Includes: Branded landing page / microsite — built, hosted, on your domain; AI agent trained on your business — English + Spanish; Website chat widget (embedded, live); Lead & enquiry capture; Instant owner notifications (email + WhatsApp alert); Client dashboard — view leads & conversations (Data Intelligence Hub); 24/7 availability; Onboarding & setup; AI reservations agent; Menu/hours FAQ & booking confirmations; Inbound Voice Agent (1,500 mins/mo).
Growth — €619/mo (+21% IVA = €749 inc.), voice 1,500 min.
  Adds on top of Base: Appointment Booking (calendar sync, confirmations, reminders); Lead Qualifier (scoring & routing); CRM Sync; Review Manager.
Everything — €919/mo (+21% IVA = €1112 inc.), voice 3,000 min.
  Adds on top of Growth: WhatsApp Agent; Social Media Responder; Email Follow-Up Agent; Inbound Voice Agent (3,000 mins/mo).

== Beauty & Hair Salons ==
Base — €249/mo (+21% IVA = €301 inc.), voice 500 min.
  Includes: Branded landing page / microsite — built, hosted, on your domain; AI agent trained on your business — English + Spanish; Website chat widget (embedded, live); Lead & enquiry capture; Instant owner notifications (email + WhatsApp alert); Client dashboard — view leads & conversations (Data Intelligence Hub); 24/7 availability; Onboarding & setup; AI booking agent; Services & opening hours info; Inbound Voice Agent (500 mins/mo).
Growth — €449/mo (+21% IVA = €543 inc.), voice 500 min.
  Adds on top of Base: Appointment Booking (calendar sync, confirmations, reminders); Lead Qualifier (scoring & routing); CRM Sync; Review Manager.
Everything — €749/mo (+21% IVA = €906 inc.), voice 1,000 min.
  Adds on top of Growth: WhatsApp Agent; Social Media Responder; Email Follow-Up Agent; Inbound Voice Agent (1,000 mins/mo).$vsknowledge$,
  '{"type":"pricing","generated_from":"src/data/industries.ts"}'::jsonb,
  true
);
