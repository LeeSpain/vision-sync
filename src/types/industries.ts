export interface Industry {
  slug: string
  name: string
  icon: string
  painStatement: string
  baseIncludes: string[]
  voiceIncluded: boolean
  voiceMinutes?: number
  exVatPrice: number
  ivaAmount: number
  totalIncVat: number
  color: string
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
  selectedModuleIds: string[]
  clientFirstName: string
  clientLastName: string
  businessName: string
  email: string
  phone: string
  clientNotes?: string
}
