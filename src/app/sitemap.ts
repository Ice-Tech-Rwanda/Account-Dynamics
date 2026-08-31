import type { MetadataRoute } from "next";
import { getServiceCategories } from "@/lib/content/service.server";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/industries",
    "/why-choose-us",
    "/book",
    "/contact",
    "/privacy-policy",
    "/terms",
  ].map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const categories = await getServiceCategories();
  const serviceRoutes = categories.map((category) => ({
    url: `${base}/services/${category.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes];
}
