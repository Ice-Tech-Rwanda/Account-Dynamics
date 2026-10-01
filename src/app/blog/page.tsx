import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { CTASection } from "@/domains/home/components/CTASection";
import { BlogCard } from "@/domains/blog/components/BlogCard";
import { buildPageMetadata, getBlogPosts } from "@/lib/content/service.server";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

interface BlogListPageProps {
  searchParams?: Promise<{ category?: string; q?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata('blog', {
    title: 'Travel Blog & Safari Stories',
    description: 'Practical travel guides, gorilla trekking tips, safari stories and destination inspiration from the Global Line Safaris team.',
    path: '/blog',
  });
}

export default async function BlogListPage({ searchParams }: BlogListPageProps) {
  const params = await searchParams;
  const raw = (params?.category ?? "").trim();
  const searchTerm = (params?.q ?? "").trim();
  const query = searchTerm.toLowerCase();
  const posts = await getBlogPosts();

  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean) as string[])).sort();
  const activeCategory = categories.includes(raw) ? raw : "";
  let visible = activeCategory ? posts.filter((p) => p.category === activeCategory) : posts;

  if (query) {
    visible = visible.filter((p) =>
      [p.title, p.excerpt, p.category, p.author]
        .filter(Boolean)
        .some((field) => (field as string).toLowerCase().includes(query))
    );
  }
  const showingAll = !activeCategory && !query;

  return (
    <div className="overflow-x-hidden">
      <PageHero
        eyebrow="Travel Journal"
        title="Safari Stories & Travel Guides"
        description="Guides, tips and inspiration from the Global Line Safaris team — gorilla trekking, wildlife safaris, cultural journeys and Rwanda travel essentials."
        image="/images/rwanda-hills.jpg"
        breadcrumb={[{ label: "Blog", href: "/blog" }]}
      />

      <section className="safari-section">
        <div className="safari-container">
          <div className="editorial-heading">
            <div>
              <div className="safari-eyebrow">
                <span className="safari-eyebrow-line" />
                <span>Latest from the journal</span>
              </div>
              <h2>Stories to plan your journey</h2>
            </div>
            <p>
              Read what to expect on the trails, when to travel, how to pack and how to plan an
              itinerary that fits the way you like to travel.
            </p>
          </div>

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <form action="/blog" method="get" className="relative">
              {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
              <input
                type="search"
                name="q"
                defaultValue={searchTerm}
                placeholder="Search stories..."
                aria-label="Search blog posts"
                className="w-56 rounded-full border border-slate-200 bg-white py-2 pl-4 pr-9 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-brand dark:border-slate-700 dark:bg-slate-900"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-0 top-0 flex h-full w-9 items-center justify-center text-slate-400 transition-colors hover:text-brand"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
            {!showingAll && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {visible.length} result{visible.length === 1 ? "" : "s"}
                {searchTerm ? ` for "${searchTerm}"` : ""}
              </p>
            )}
          </div>

          {categories.length > 0 && (
            <div className="mb-10 flex flex-wrap items-center gap-2">
              <Link
                href={searchTerm ? `/blog?q=${encodeURIComponent(searchTerm)}` : "/blog"}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
                  !activeCategory
                    ? "border-brand bg-brand text-white"
                    : "border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
                )}
              >
                All
              </Link>
              {categories.map((category) => {
                const count = posts.filter((p) => p.category === category).length;
                const active = activeCategory === category;
                const qs = searchTerm ? `&q=${encodeURIComponent(searchTerm)}` : "";
                return (
                  <Link
                    key={category}
                    href={`/blog?category=${encodeURIComponent(category)}${qs}`}
                    className={cn(
                      "rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
                      active
                        ? "border-brand bg-brand text-white"
                        : "border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
                    )}
                  >
                    {category}
                    <span className={cn("ml-1.5", active ? "text-white/70" : "text-slate-400")}>{count}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {visible.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              {query
                ? `No stories match "${searchTerm}". Try a different search term or browse all posts.`
                : "Stories in this category are being prepared. Check back soon for travel guides and safari inspiration."}
            </p>
          )}
        </div>
      </section>

      <CTASection />
    </div>
  );
}
