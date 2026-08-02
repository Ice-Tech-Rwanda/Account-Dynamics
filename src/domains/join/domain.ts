export type MembershipType = "individual" | "student" | "family" | "corporate"

export interface MembershipPlan {
  id: string
  name: string
  type: MembershipType
  price: number
  benefits: string[]
  featured?: boolean
}

export interface VolunteerRole {
  id: string
  title: string
  description: string
  commitment: string
}

export interface ClubFeature {
  id: string
  title: string
  description: string
  icon: string
}
