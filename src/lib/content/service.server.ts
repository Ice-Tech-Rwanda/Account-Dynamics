import "server-only";

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";
import { siteImages, type SiteImage } from "@/lib/siteImages";
import { serviceCategories as staticCategories, serviceHighlights as staticHighlights } from "@/lib/data/services";
import { founder as staticFounder, teamMembers as staticTeam } from "@/lib/data/team";
import { faqs as staticFaqs } from "@/lib/data/faq";
import { industries as staticIndustries } from "@/lib/data/industries";
import { whoWeServe as staticWhoWeServe } from "@/lib/data/who-we-serve";
import { technologyItems as staticTechnology } from "@/lib/data/technology";
import type {
  ServiceCategory,
  TeamMember,
  FaqItem,
  Industry,
  WhoWeServe,
  TechnologyItem,
  Testimonial,
  HomepageContent,
  HomepageSectionData,
  SiteSettings,
  SiteImageSetting,
} from "@/lib/content/types";

export const CONTENT_TAGS = {
  settings: ["settings"],
  services: ["services"],
  team: ["team"],
  industries: ["industries"],
  faqs: ["faqs"],
  homepage: ["homepage"],
  media: ["media"],
  membership: ["membership"],
  software: ["software"],
} as const;

function parseJsonArray<T>(raw: string | null | undefined, fallback: T[] = []): T[] {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function parseItems(raw: string | null | undefined): HomepageSectionData["items"] {
  return parseJsonArray<{ icon: string; title: string; description: string }>(raw).filter(
    (item) => item && typeof item.title === "string" && item.title.trim()
  );
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

async function loadServiceCategories(): Promise<ServiceCategory[]> {
  const rows = await prisma.serviceCategory.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { displayOrder: "asc" },
    include: {
      services: {
        where: { status: "PUBLISHED" },
        orderBy: { displayOrder: "asc" },
        include: { benefits: { orderBy: { displayOrder: "asc" } } },
      },
    },
  });
  if (!rows.length) return staticCategories;

  const categoryImages: Record<string, SiteImage> = {
    "small-business": siteImages.smallBusiness,
    "personal-taxes": siteImages.personalTaxes,
    outsourcing: siteImages.outsourcing,
    "allied-services": siteImages.alliedServices,
  };

  return rows.map((cat) => ({
    id: cat.id as unknown as string,
    slug: cat.slug,
    title: cat.title,
    description: cat.description,
    icon: cat.icon,
    cta: cat.cta,
    image: cat.image ?? null,
    seoTitle: cat.seoTitle ?? null,
    seoDescription: cat.seoDescription ?? null,
    services: cat.services.map((service) => ({
      id: service.id as unknown as string,
      name: service.name,
      description: service.description,
      benefits: service.benefits.map((b) => b.text),
      icon: service.icon,
      image: service.image ?? null,
    })),
  }));
}

export function getServiceCategories() {
  return cached("serviceCategories", loadServiceCategories, CONTENT_TAGS.services)();
}

export async function getServiceCategory(slug: string): Promise<ServiceCategory | null> {
  const categories = await getServiceCategories();
  // Prefer DB-backed categories; if DB is empty the static fallback is used.
  const dbCat = await prisma.serviceCategory.findUnique({
    where: { slug },
    include: {
      services: {
        where: { status: "PUBLISHED" },
        orderBy: { displayOrder: "asc" },
        include: { benefits: { orderBy: { displayOrder: "asc" } } },
      },
    },
  });
  if (dbCat) {
    return {
      slug: dbCat.slug,
      title: dbCat.title,
      description: dbCat.description,
      icon: dbCat.icon,
      cta: dbCat.cta,
      image: dbCat.image,
      seoTitle: dbCat.seoTitle,
      seoDescription: dbCat.seoDescription,
      services: dbCat.services.map((service) => ({
        name: service.name,
        description: service.description,
        benefits: service.benefits.map((b) => b.text),
        icon: service.icon,
      })),
    };
  }
  return categories.find((c) => c.slug === slug) ?? null;
}

// ---------------------------------------------------------------------------
// Service highlights (static, editable through homepage "services" section)
// ---------------------------------------------------------------------------

export function getServiceHighlights() {
  return cached(
    "serviceHighlights",
    async () => staticHighlights,
    CONTENT_TAGS.homepage
  )();
}

// ---------------------------------------------------------------------------
// Team
// ---------------------------------------------------------------------------

async function loadTeam(): Promise<{ founder: TeamMember; members: TeamMember[] }> {
  const rows = await prisma.teamMember.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ isFounder: "desc" }, { displayOrder: "asc" }],
  });
  if (!rows.length) {
    return { founder: staticFounder, members: staticTeam };
  }
  const members = rows.map((m) => ({
    name: m.name,
    role: m.role,
    bio: m.bio ?? "",
    expertise: parseJsonArray<string>(m.expertise),
    image: m.photo ?? undefined,
    isFounder: m.isFounder,
    email: m.email ?? undefined,
    linkedin: m.linkedin ?? undefined,
  }));
  const founder =
    members.find((m) => m.isFounder) ??
    members.find((m) => m.name === "Joseph P. Mathews") ??
    members[0];
  return { founder, members };
}

export function getTeam() {
  return cached("team", loadTeam, CONTENT_TAGS.team)();
}

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------

async function loadFaqs(): Promise<FaqItem[]> {
  const rows = await prisma.faqItem.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ category: "asc" }, { displayOrder: "asc" }],
  });
  if (!rows.length) return staticFaqs;
  return rows.map((f) => ({
    question: f.question,
    answer: f.answer,
    category: f.category,
    displayOrder: f.displayOrder,
  }));
}

export function getFaqs() {
  return cached("faqs", loadFaqs, CONTENT_TAGS.faqs)();
}

// ---------------------------------------------------------------------------
// Industries
// ---------------------------------------------------------------------------

async function loadIndustries(): Promise<{ industries: Industry[]; whoWeServe: WhoWeServe[] }> {
  const rows = await prisma.industry.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { displayOrder: "asc" },
  });
  if (!rows.length) {
    return { industries: staticIndustries, whoWeServe: staticWhoWeServe };
  }
  const industries = rows.map((row) => ({
    name: row.name,
    description: row.description,
    icon: row.icon,
    image: row.image,
    slug: row.slug,
  }));
  const whoWeServe = rows.map((row) => ({
    name: row.name,
    description: row.description,
    icon: row.icon,
    services: parseJsonArray<string>(row.services),
  }));
  return { industries, whoWeServe };
}

export function getIndustries() {
  return cached("industries", loadIndustries, CONTENT_TAGS.industries)();
}

// ---------------------------------------------------------------------------
// Technology (homepage section items)
// ---------------------------------------------------------------------------

export function getTechnologyItems(): Promise<TechnologyItem[]> {
  return cached(
    "technology",
    async () => staticTechnology,
    CONTENT_TAGS.homepage
  )();
}

// ---------------------------------------------------------------------------
// Testimonials (only verified — admin adds manually)
// ---------------------------------------------------------------------------

async function loadTestimonials(): Promise<Testimonial[]> {
  const rows = await prisma.testimonial.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { displayOrder: "asc" },
  });
  return rows.map((t) => ({
    id: t.id,
    clientName: t.clientName,
    company: t.company,
    position: t.position,
    content: t.content,
    photo: t.photo,
    rating: t.rating,
  }));
}

export function getTestimonials() {
  return cached("testimonials", loadTestimonials, CONTENT_TAGS.homepage)();
}

// ---------------------------------------------------------------------------
// Membership
// ---------------------------------------------------------------------------

async function loadMembershipSection(): Promise<HomepageSectionData> {
  const section = await prisma.homepageSection.findUnique({ where: { sectionKey: "membership" } });
  const membership = await prisma.membership.findFirst({ where: { status: "PUBLISHED" } });
  const plans = membership
    ? await prisma.membershipPlan.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { displayOrder: "asc" },
      })
    : [];

  const fallbackTitle = "Predictable Pricing, Exceptional Value";
  const fallbackDescription =
    "Account Dynamics offers membership plans designed to provide affordable, predictable services instead of relying entirely on hourly billing.";

  let items: HomepageSectionData["items"] = [];
  if (section) {
    items = parseItems(section.items);
  } else if (membership) {
    items = parseJsonArray<{ icon: string; title: string; description: string }>(membership.benefits).map((b, i) => ({
      icon: "Check",
      title: typeof b === "string" ? b : b.title,
      description: "",
    }));
  }

  const title = section?.title ?? membership?.title ?? fallbackTitle;
  const subtitle = section?.subtitle ?? null;
  const description = section?.description ?? membership?.description ?? fallbackDescription;
  const imageKey = section?.imageKey;
  const ctaLabel = section?.ctaLabel ?? membership?.ctaLabel ?? "Explore Membership Options";
  const ctaUrl = section?.ctaUrl ?? membership?.ctaUrl ?? siteConfig.bookOnlineUrl;

  return {
    sectionKey: "membership",
    eyebrow: section?.eyebrow ?? "Membership Plans",
    title,
    subtitle,
    description,
    items,
    image: imageKey ?? null,
    ctaLabel,
    ctaUrl,
    plans: plans.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      billingFrequency: p.billingFrequency,
      description: p.description,
      features: parseJsonArray<string>(p.features),
      featured: p.featured,
    })),
  };
}

export function getMembershipSection() {
  return cached("membership", loadMembershipSection, CONTENT_TAGS.membership)();
}

// ---------------------------------------------------------------------------
// Homepage sections
// ---------------------------------------------------------------------------

const HOMEPAGE_DEFAULTS: Record<string, Omit<HomepageSectionData, "sectionKey" | "items"> & { items?: HomepageSectionData["items"] }> = {
  hero: {
    eyebrow: "Helping You Reach Your Financial Goals",
    title: "Turn your numbers into smarter decisions.",
    subtitle:
      "Professional tax, cloud accounting, bookkeeping and advisory for individuals and small businesses across Canada.",
    ctaLabel: "Book a Free Consultation",
    ctaUrl: "/book",
  },
  services: {
    eyebrow: "Our Services",
    title: "Comprehensive Accounting Solutions",
    subtitle:
      "From day-to-day bookkeeping to strategic tax planning, we provide the full spectrum of accounting services your business needs.",
  },
  advisory: {
    eyebrow: "Business Advisory",
    title: "Turn Financial Data Into Better Business Decisions",
    subtitle:
      "We help business owners move beyond basic bookkeeping by using financial information to identify patterns, understand costs, plan ahead and make informed decisions.",
    ctaLabel: "Learn More",
    ctaUrl: "/why-choose-us",
  },
  about: {
    eyebrow: "About Account Dynamics",
    title: "Accounting Expertise You Can Rely On",
    subtitle:
      "Account Dynamics is a Canadian accounting, tax, advisory and business analytics firm in Toronto. We combine professional accounting expertise with modern cloud technology and a client-centered approach to help individuals and small businesses understand their numbers and make confident decisions.",
    ctaLabel: "Meet Our Team",
    ctaUrl: "/about",
  },
  whyChoose: {
    eyebrow: "Why Choose Us",
    title: "Why Clients Trust Account Dynamics",
    subtitle:
      "We combine professional expertise with personalized service and modern technology to deliver results that matter.",
    ctaLabel: "Learn Why",
    ctaUrl: "/why-choose-us",
  },
  whoWeServe: {
    eyebrow: "Who We Serve",
    title: "Accounting Support Built Around Your Needs",
    subtitle:
      "We tailor our accounting, tax and advisory services to the clients we serve — from individuals to groups of companies.",
    ctaLabel: "Explore Who We Serve",
    ctaUrl: "/industries",
  },
  technology: {
    eyebrow: "Technology",
    title: "Technology That Makes Accounting Simpler",
    subtitle:
      "We use modern accounting technology and cloud-based, paperless workflows so your financial information is organized, accessible and easy to understand.",
    ctaLabel: "Explore Our Approach",
    ctaUrl: "/why-choose-us",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently Asked Questions",
    subtitle:
      "Answers to the questions we hear most from individuals and small business owners.",
  },
  finalCta: {
    eyebrow: "Get Started Today",
    title: "Ready to Take Control of Your Finances?",
    subtitle:
      "Whether you need tax preparation, bookkeeping, or strategic business advisory, our team is here to help you succeed.",
    ctaLabel: "Book a Free Consultation",
    ctaUrl: "/book",
  },
};

async function loadHomepageContent(): Promise<HomepageContent> {
  const rows = await prisma.homepageSection.findMany();
  const sections = new Map(rows.map((r) => [r.sectionKey, r]));

  const build = (key: keyof HomepageContent): HomepageSectionData => {
    const defaults = HOMEPAGE_DEFAULTS[key] ?? {};
    const row = sections.get(key);
    return {
      sectionKey: key,
      eyebrow: row?.eyebrow ?? defaults.eyebrow ?? null,
      title: row?.title ?? defaults.title ?? null,
      subtitle: row?.subtitle ?? defaults.subtitle ?? null,
      description: row?.description ?? defaults.description ?? null,
      items: row ? parseItems(row.items) : (defaults.items ?? []),
      image: row?.imageKey ?? defaults.image ?? null,
      ctaLabel: row?.ctaLabel ?? defaults.ctaLabel ?? null,
      ctaUrl: row?.ctaUrl ?? defaults.ctaUrl ?? null,
    };
  };

  return {
    hero: build("hero"),
    services: build("services"),
    advisory: build("advisory"),
    about: build("about"),
    whyChoose: build("whyChoose"),
    whoWeServe: build("whoWeServe"),
    technology: build("technology"),
    membership: await getMembershipSection(),
    faq: build("faq"),
    finalCta: build("finalCta"),
  };
}

export function getHomepageContent() {
  return cached("homepage", loadHomepageContent, CONTENT_TAGS.homepage)();
}

// ---------------------------------------------------------------------------
// Site images (editable via admin)
// ---------------------------------------------------------------------------

function cachedImage(key: string, fallback: SiteImage): SiteImageSetting {
  return { key, url: fallback.src, alt: fallback.alt };
}

async function loadSiteImages(): Promise<{
  heroSlides: SiteImageSetting[];
  about: SiteImageSetting;
  advisory: SiteImageSetting;
  servicesHero: SiteImageSetting;
  contact: SiteImageSetting;
  categories: Record<string, SiteImageSetting>;
}> {
  const rows = await prisma.siteImage.findMany();
  const byKey = new Map(rows.map((r) => [r.key, r as SiteImageSetting]));

  const heroKeys = ["hero.1", "hero.2", "hero.3"];
  const heroSlides = heroKeys
    .map((key) => byKey.get(key))
    .filter((s): s is SiteImageSetting => Boolean(s));
  if (!heroSlides.length) {
    heroSlides.push(...siteImages.heroSlides.map((s, i) => cachedImage(`hero.${i + 1}`, s)));
  }

  const resolve = (key: string, fallback: SiteImage): SiteImageSetting =>
    byKey.get(key) ?? cachedImage(key, fallback);

  return {
    heroSlides,
    about: resolve("about", siteImages.about),
    advisory: resolve("advisory", siteImages.advisory),
    servicesHero: resolve("servicesHero", siteImages.servicesHero),
    contact: resolve("contact", siteImages.contact),
    categories: {
      "small-business": resolve("category.small-business", siteImages.smallBusiness),
      "personal-taxes": resolve("category.personal-taxes", siteImages.personalTaxes),
      outsourcing: resolve("category.outsourcing", siteImages.outsourcing),
      "allied-services": resolve("category.allied-services", siteImages.alliedServices),
    },
  };
}

export function getSiteImages() {
  return cached("siteImages", loadSiteImages, CONTENT_TAGS.media)();
}

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------

function normalizeSocial(raw: string): string {
  return raw.trim() || "#";
}

async function loadSiteSettings(): Promise<SiteSettings> {
  const rows = await prisma.setting.findMany();
  const s = new Map(rows.map((r) => [r.key, r.value]));

  const defaults: SiteSettings = {
    companyName: siteConfig.name,
    shortName: siteConfig.shortName,
    tagline: siteConfig.tagline,
    description: siteConfig.description,
    addressLine1: "55 Baywood Road, 2nd Floor",
    addressLine2: "Toronto, Ontario M9V 3Y8",
    city: "Toronto",
    province: "Ontario",
    postalCode: "M9V 3Y8",
    country: "Canada",
    phone: siteConfig.phone,
    phoneSecondary: siteConfig.phoneSecondary ?? "",
    email: siteConfig.email,
    businessHoursLine1: "Monday – Friday",
    businessHoursLine2: "9:00 AM – 4:00 PM",
    linkedin: "#",
    facebook: "#",
    instagram: "#",
    youtube: "#",
    bookingUrl: siteConfig.bookOnlineUrl,
    whatsappNumber: siteConfig.whatsappNumber,
    whatsappMessage: siteConfig.whatsappMessage,
    copyright: "",
    designerCredit: "Ice Tech Rwanda",
    adminEmail: siteConfig.email,
  };

  const get = (key: string, fallback: string) => (s.has(key) ? (s.get(key) || "") : fallback);

  return {
    companyName: get("companyName", defaults.companyName),
    shortName: get("shortName", defaults.shortName),
    tagline: get("tagline", defaults.tagline),
    description: get("description", defaults.description),
    logo: get("logo", ""),
    favicon: get("favicon", ""),
    addressLine1: get("addressLine1", defaults.addressLine1),
    addressLine2: get("addressLine2", defaults.addressLine2),
    city: get("city", defaults.city),
    province: get("province", defaults.province),
    postalCode: get("postalCode", defaults.postalCode),
    country: get("country", defaults.country),
    phone: get("phone", defaults.phone),
    phoneSecondary: get("phoneSecondary", defaults.phoneSecondary),
    email: get("email", defaults.email),
    businessHoursLine1: get("businessHoursLine1", defaults.businessHoursLine1),
    businessHoursLine2: get("businessHoursLine2", defaults.businessHoursLine2),
    linkedin: normalizeSocial(get("linkedin", defaults.linkedin)),
    facebook: normalizeSocial(get("facebook", defaults.facebook)),
    instagram: normalizeSocial(get("instagram", defaults.instagram)),
    youtube: normalizeSocial(get("youtube", defaults.youtube)),
    bookingUrl: get("bookingUrl", defaults.bookingUrl),
    whatsappNumber: get("whatsappNumber", defaults.whatsappNumber),
    whatsappMessage: get("whatsappMessage", defaults.whatsappMessage),
    copyright: get("copyright", `© ${new Date().getFullYear()} ${defaults.companyName}. All rights reserved.`),
    designerCredit: get("designerCredit", defaults.designerCredit),
    adminEmail: get("adminEmail", defaults.adminEmail),
  };
}

export function getSiteSettings() {
  return cached("siteSettings", loadSiteSettings, CONTENT_TAGS.settings)();
}

// ---------------------------------------------------------------------------
// Small helper so every content getter is cached with shared tags
// ---------------------------------------------------------------------------

type CachedFn<T> = () => Promise<T>;

function cached<T>(key: string, loader: () => Promise<T>, tags: readonly string[]): CachedFn<T> {
  return unstable_cache(loader, [key], { revalidate: 60, tags: [...tags] });
}