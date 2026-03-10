import { Industry } from '@/types/industries'

export const INDUSTRIES: Industry[] = [
  {
    slug: 'estate-agents',
    name: 'Estate Agents',
    icon: 'Home',
    painStatement: 'Stop losing property leads overnight. Your AI agent answers enquiries at 2am, qualifies buyers, and books viewings automatically — in English and Spanish.',
    baseIncludes: ['AI Chat Agent (English + Spanish)', 'Website Chat Widget', 'Lead Capture & Qualification', 'Instant Owner Notifications', '24/7 Availability'],
    voiceIncluded: false,
    exVatPrice: 349,
    ivaAmount: 73.29,
    totalIncVat: 422.29,
    color: 'blue'
  },
  {
    slug: 'dental-clinics',
    name: 'Dental & Health Clinics',
    icon: 'HeartPulse',
    painStatement: 'Never miss a patient call again. Your AI receptionist answers in English and Spanish, handles appointment enquiries, and routes emergencies — 24 hours a day.',
    baseIncludes: ['AI Receptionist (English + Spanish)', 'Inbound Voice Agent (1,500 mins/mo)', 'Appointment Enquiries & FAQ Bot', 'Emergency Call Routing', 'Patient Notifications'],
    voiceIncluded: true,
    voiceMinutes: 1500,
    exVatPrice: 489,
    ivaAmount: 102.69,
    totalIncVat: 591.69,
    color: 'green'
  },
  {
    slug: 'legal-gestorias',
    name: 'Legal Firms & Gestorias',
    icon: 'Scale',
    painStatement: 'Handle the flood of expat enquiries automatically. Your AI intake agent qualifies leads, answers FAQs, and books consultations — in perfect English and Spanish.',
    baseIncludes: ['AI Intake Agent (English + Spanish)', 'FAQ Bot & Enquiry Handling', 'Appointment Scheduling', 'Lead Capture & Qualification', 'Owner Notifications'],
    voiceIncluded: false,
    exVatPrice: 279,
    ivaAmount: 58.59,
    totalIncVat: 337.59,
    color: 'purple'
  },
  {
    slug: 'holiday-rentals',
    name: 'Holiday Rentals & Property Management',
    icon: 'Umbrella',
    painStatement: 'Your guests have questions at midnight. Your AI concierge answers in any language, handles check-in queries, and manages maintenance requests automatically.',
    baseIncludes: ['Multilingual Guest AI Agent', 'Pre-arrival FAQ & Check-in Automation', 'Maintenance Request Routing', 'Booking Enquiry Handling', 'Owner Notifications'],
    voiceIncluded: false,
    exVatPrice: 249,
    ivaAmount: 52.29,
    totalIncVat: 301.29,
    color: 'orange'
  },
  {
    slug: 'gyms-fitness',
    name: 'Gyms & Fitness Studios',
    icon: 'Dumbbell',
    painStatement: 'Turn every missed call into a new member. Your AI sales agent answers the phone, handles class enquiries, captures leads, and follows up automatically.',
    baseIncludes: ['AI Sales Agent (English + Spanish)', 'Inbound Voice Agent (500 mins/mo)', 'Membership & Class Enquiries', 'Lead Capture & Qualification', 'Owner Notifications'],
    voiceIncluded: true,
    voiceMinutes: 500,
    exVatPrice: 319,
    ivaAmount: 66.99,
    totalIncVat: 385.99,
    color: 'green'
  },
  {
    slug: 'building-renovation',
    name: 'Building & Renovation',
    icon: 'HardHat',
    painStatement: 'Stop losing jobs because nobody answered the enquiry. Your AI agent captures quote requests, qualifies the job, and notifies you instantly — day or night.',
    baseIncludes: ['AI Quote Intake Agent', 'FAQ Bot & Lead Capture', 'Job Qualification Questions', 'Instant Owner Notifications', '24/7 Availability'],
    voiceIncluded: false,
    exVatPrice: 209,
    ivaAmount: 43.89,
    totalIncVat: 252.89,
    color: 'amber'
  },
  {
    slug: 'restaurants-bars',
    name: 'Restaurants & Bars',
    icon: 'UtensilsCrossed',
    painStatement: 'Full tables every night. Your AI agent answers the phone, takes reservations in English and Spanish, handles menu questions, and sends booking confirmations automatically.',
    baseIncludes: ['AI Reservations Agent (English + Spanish)', 'Inbound Voice Agent (1,500 mins/mo)', 'Menu FAQ & Opening Hours Bot', 'Reservation Capture & Confirmation', 'Owner Notifications'],
    voiceIncluded: true,
    voiceMinutes: 1500,
    exVatPrice: 419,
    ivaAmount: 87.99,
    totalIncVat: 506.99,
    color: 'red'
  },
  {
    slug: 'beauty-hair',
    name: 'Beauty & Hair Salons',
    icon: 'Scissors',
    painStatement: 'Every missed call is a missed appointment. Your AI booking agent answers the phone, handles bookings in English and Spanish, and chases cancellations automatically.',
    baseIncludes: ['AI Booking Agent (English + Spanish)', 'Inbound Voice Agent (500 mins/mo)', 'Appointment Enquiries & FAQ Bot', 'Opening Hours & Services Info', 'Owner Notifications'],
    voiceIncluded: true,
    voiceMinutes: 500,
    exVatPrice: 249,
    ivaAmount: 52.29,
    totalIncVat: 301.29,
    color: 'pink'
  }
]
