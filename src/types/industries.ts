export type Tier = 'base' | 'growth' | 'everything'

export interface Package {
  tier: Tier
  name: string          // "Base" | "Growth" | "Everything"
  exVatPrice: number    // monthly, €
  incVatPrice: number   // exVatPrice * 1.21, rounded
  voiceMinutes: number  // 0 if none
  tagline: string
  includes: string[]    // full cumulative feature list shown to the customer
}

export interface Industry {
  slug: string
  name: string
  icon: string
  painStatement: string
  color: string
  packages: Package[]
}

export interface QuoteModule {
  id: string
  name: string
  slug: string
  shortDescription: string
  exVatPrice: number
  ivaAmount: number
  totalIncVat: number
  isVoice: boolean
  voiceMinutes?: number
}

export interface QuoteSubmission {
  industrySlug: string
  industryName: string
  selectedTier: Tier
  selectedModuleIds: string[]
  clientFirstName: string
  clientLastName: string
  businessName: string
  email: string
  phone: string
  clientNotes?: string
}
