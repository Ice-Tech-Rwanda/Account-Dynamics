import type { MetadataRoute } from "next";
import { getServiceCategories, getDestinations, getTourPackages, getBlogPosts } from "@/lib/content/service.server";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes = [
    { route: "", priority: 1 },
    { route: "/about", priority: 0.8 },
    { route: "/services", priority: 0.8 },
    { route: "/industries", priority: 0.5 },
    { route: "/why-choose-us", priority: 0.6 },
    { route: "/contact", priority: 0.7 },
    { route: "/privacy-policy", priority: 0.3 },
    { route: "/terms", priority: 0.3 },
    { route: "/destinations", priority: 0.9 },
    { route: "/tour-packages", priority: 0.9 },
    { route: "/gallery", priority: 0.5 },
    { route: "/blog", priority: 0.7 },
    { route: "/plan-your-trip", priority: 0.8 },
    { route: "/mission-and-values", priority: 0.5 },
  ].map(({ route, priority }) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority,
  }));

  const [categories, destinations, packages, posts] = await Promise.all([
    getServiceCategories(),
    getDestinations(),
    getTourPackages(),
    getBlogPosts(),
  ]);

  const serviceRoutes = categories.map((category) => ({
    url: `${base}/services/${category.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const destinationRoutes = destinations.map((d) => ({
    url: `${base}/destinations/${d.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const packageRoutes = packages.map((p) => ({
    url: `${base}/tour-packages/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogRoutes = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.createdAt ? new Date(post.createdAt) : now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...destinationRoutes, ...packageRoutes, ...blogRoutes];
}