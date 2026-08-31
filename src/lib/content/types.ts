// Domain types shared between the CMS repositories and the public website.

export interface Service {
  name: string;
  description: string;
  benefits: string[];
  icon: string;
  image?: string | null;
}

export interface ServiceCategory {
  id?: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  cta: string;
  image?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  services: Service[];
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  image?: string | null;
  isFounder?: boolean;
  email?: string;
  linkedin?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
  displayOrder?: number;
}

export interface Industry {
  name: string;
  description: string;
  icon: string;
  image?: string | null;
  slug?: string;
}

export interface WhoWeServe {
  name: string;
  description: string;
  icon: string;
  services: string[];
}

export interface TechnologyItem {
  title: string;
  description?: string;
  icon: string;
  logo?: string;
  websiteUrl?: string;
}

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
