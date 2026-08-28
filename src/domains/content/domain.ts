export interface ContactInfo {
  email: string
  phone: string
  address: string
  whatsapp: string
  socialLinks: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
    tiktok?: string
  }
}

export interface StatCounter {
  label: string
  value: number
  suffix?: string
  icon: string
}

export interface HistoryMilestone {
  year: string
  title: string
  description: string
}

export interface CoreValue {
  id: string
  title: string
  description: string
  icon: string
}

export interface Benefit {
  id: string
  title: string
  description: string
  icon: string
  stats: { label: string; value: string }[]
}

export interface JourneyMilestone {
  year: string
  title: string
  description: string
  icon: string
}

export interface SiteContent {
  section: string
  content: unknown
  updatedAt?: string
}
