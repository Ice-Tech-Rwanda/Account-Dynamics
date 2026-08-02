export interface SponsorshipPackage {
  id: string
  name: string
  price: number
  description: string
  benefits: string[]
  popular: boolean
  order: number
}

export interface Donor {
  id: string
  donorName: string
  amount: number
  anonymous: boolean
}

export interface DonationSummary {
  totalRaised: number
  donorCount: number
  recentDonors: { donorName: string; amount: number; createdAt: string }[]
}
