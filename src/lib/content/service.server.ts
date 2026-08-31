import "server-only";

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";
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

/**
 * Dedupes an array by a key, keeping the first occurrence (which is the
 * founder-first ordering). Guards against React duplicate-key collisions
 * when the database contains rows with identical names.
 */
function dedupeByName<T extends { name: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    if (!seen.has(item.name)) {
      seen.add(item.name);
      out.push(item);
    }
  }
  return out;
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
  if (!dbCat) return null;

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

// ---------------------------------------------------------------------------
// Service highlights — from homepage "services" section items or empty
// ---------------------------------------------------------------------------

export async function getServiceHighlights(): Promise<Array<{ title: string; description: string; icon: string }>> {
  const section = await prisma.homepageSection.findUnique({ where: { sectionKey: "services" } });
  if (section?.items) {
    return parseJsonArray<{ icon: string; title: string; description: string }>(section.items);
  }
  return [];
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
    return {
      founder: { name: "", role: "", bio: "", expertise: [] },
      members: [],
    };
  }

  const members = dedupeByName(
    rows.map((m) => ({
      name: m.name,
      role: m.role,
      bio: m.bio ?? "",
      expertise: parseJsonArray<string>(m.expertise),
      image: m.photo ?? undefined,
      isFounder: m.isFounder,
      email: m.email ?? undefined,
      linkedin: m.linkedin ?? undefined,
    }))
  );

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
// Technology / Software Tools
// ---------------------------------------------------------------------------

async function loadTechnologyItems(): Promise<TechnologyItem[]> {
  const rows = await prisma.softwareTool.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { displayOrder: "asc" },
  });
  return rows.map((r) => ({
    title: r.name,
    description: r.description ?? undefined,
    icon: "Cloud",
    logo: r.logo ?? undefined,
    websiteUrl: r.websiteUrl ?? undefined,
  }));
}

export function getTechnologyItems(): Promise<TechnologyItem[]> {
  return cached("technology", loadTechnologyItems, CONTENT_TAGS.software)();
}

// ---------------------------------------------------------------------------
// Testimonials
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

  let items: HomepageSectionData["items"] = [];
  if (section) {
    items = parseItems(section.items);
  } else if (membership) {
    items = parseJsonArray<{ icon: string; title: string; description: string }>(membership.benefits).map((b) => ({
      icon: "Check",
      title: typeof b === "string" ? b : b.title,
      description: "",
    }));
  }

  const title = section?.title ?? membership?.title ?? "";
  const subtitle = section?.subtitle ?? null;
  const description = section?.description ?? membership?.description ?? "";
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

async function loadHomepageContent(): Promise<HomepageContent> {
  const rows = await prisma.homepageSection.findMany();
  const sections = new Map(rows.map((r) => [r.sectionKey, r]));

  const build = (key: keyof HomepageContent): HomepageSectionData => {
    const row = sections.get(key);
    return {
      sectionKey: key,
      eyebrow: row?.eyebrow ?? null,
      title: row?.title ?? null,
      subtitle: row?.subtitle ?? null,
      description: row?.description ?? null,
      items: row ? parseItems(row.items) : [],
      image: row?.imageKey ?? null,
      ctaLabel: row?.ctaLabel ?? null,
      ctaUrl: row?.ctaUrl ?? null,
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

  const resolve = (key: string): SiteImageSetting =>
    byKey.get(key) ?? { key, url: "", alt: "" };

  return {
    heroSlides,
    about: resolve("about"),
    advisory: resolve("advisory"),
    servicesHero: resolve("servicesHero"),
    contact: resolve("contact"),
    categories: {
      "small-business": resolve("category.small-business"),
      "personal-taxes": resolve("category.personal-taxes"),
      outsourcing: resolve("category.outsourcing"),
      "allied-services": resolve("category.allied-services"),
    },
  };
}

export function getSiteImages() {
  return cached("siteImages", loadSiteImages, CONTENT_TAGS.media)();
}

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------

async function loadSiteSettings(): Promise<SiteSettings> {
  const rows = await prisma.setting.findMany();
  const s = new Map(rows.map((r) => [r.key, r.value]));

  const get = (key: string, fallback: string = "") => (s.has(key) ? (s.get(key) || "") : fallback);

  return {
    companyName: get("companyName", siteConfig.name),
    shortName: get("shortName", siteConfig.shortName),
    tagline: get("tagline", siteConfig.tagline),
    description: get("description", siteConfig.description),
    logo: get("logo", ""),
    favicon: get("favicon", ""),
    addressLine1: get("addressLine1", ""),
    addressLine2: get("addressLine2", ""),
    city: get("city", ""),
    province: get("province", ""),
    postalCode: get("postalCode", ""),
    country: get("country", "Canada"),
    phone: get("phone", siteConfig.phone),
    phoneSecondary: get("phoneSecondary", ""),
    email: get("email", siteConfig.email),
    businessHoursLine1: get("businessHoursLine1", ""),
    businessHoursLine2: get("businessHoursLine2", ""),
    linkedin: get("linkedin", "#"),
    facebook: get("facebook", "#"),
    instagram: get("instagram", "#"),
    youtube: get("youtube", "#"),
    bookingUrl: get("bookingUrl", siteConfig.bookOnlineUrl),
    whatsappNumber: get("whatsappNumber", siteConfig.whatsappNumber),
    whatsappMessage: get("whatsappMessage", siteConfig.whatsappMessage),
    copyright: get("copyright", `© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.`),
    designerCredit: get("designerCredit", ""),
    adminEmail: get("adminEmail", siteConfig.email),
  };
}

export function getSiteSettings() {
  return cached("siteSettings", loadSiteSettings, CONTENT_TAGS.settings)();
}

// ---------------------------------------------------------------------------
// Cached helper
// ---------------------------------------------------------------------------

type CachedFn<T> = () => Promise<T>;

function cached<T>(key: string, loader: () => Promise<T>, tags: readonly string[]): CachedFn<T> {
  return unstable_cache(loader, [key], { revalidate: 60, tags: [...tags] });
}
