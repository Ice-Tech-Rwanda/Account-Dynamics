// Domain types shared between the CMS repositories and the public website.
// Shapes intentionally mirror the original static content modules so the
// public components keep working with either static defaults or DB data.

import type { ServiceCategory as StaticCategory, Service } from "@/lib/data/services";
import type { TeamMember as StaticTeamMember } from "@/lib/data/team";
import type { FaqItem as StaticFaq } from "@/lib/data/faq";
import type { Industry as StaticIndustry } from "@/lib/data/industries";
import type { WhoWeServe as StaticWhoWeServe } from "@/lib/data/who-we-serve";
import type { TechnologyItem as StaticTechnology } from "@/lib/data/technology";

export type {
  Service,
};
export type ServiceCategory = StaticCategory & { image?: string | null; seoTitle?: string | null; seoDescription?: string | null };
export type TeamMember = StaticTeamMember & { image?: string | null };
export type FaqItem = StaticFaq & { category?: string; displayOrder?: number };
export type Industry = StaticIndustry & { image?: string | null; slug?: string };
export type WhoWeServe = StaticWhoWeServe;
export type TechnologyItem = StaticTechnology;

export interface Testimonial {
  id: string;
  clientName: string;
  company?: string | null;
  position?: string | null;
  content: string;
  photo?: string | null;
  rating?: number | null;
}

export interface MembershipPlanData {
  id: string;
  name: string;
  price?: number | null;
  billingFrequency?: string | null;
  description?: string | null;
  features: string[];
  featured: boolean;
}

export interface HomepageSectionData {
  sectionKey: string;
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  items: Array<{ icon: string; title: string; description: string }>;
  image?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  plans?: MembershipPlanData[];
}

export interface HomepageContent {
  hero: HomepageSectionData;
  services: HomepageSectionData;
  advisory: HomepageSectionData;
  about: HomepageSectionData;
  whyChoose: HomepageSectionData;
  whoWeServe: HomepageSectionData;
  technology: HomepageSectionData;
  membership: HomepageSectionData;
  faq: HomepageSectionData;
  finalCta: HomepageSectionData;
}

export interface SiteSettings {
  companyName: string;
  shortName: string;
  tagline: string;
  description: string;
  logo?: string;
  favicon?: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
  phoneSecondary: string;
  email: string;
  businessHoursLine1: string;
  businessHoursLine2: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  youtube: string;
  bookingUrl: string;
  whatsappNumber: string;
  whatsappMessage: string;
  copyright: string;
  designerCredit: string;
  adminEmail: string;
}

export interface SiteImageSetting {
  key: string;
  url: string;
  alt?: string | null;
}