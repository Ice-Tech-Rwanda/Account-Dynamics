import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, CalendarDays, Clock, User } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { CTASection } from "@/domains/home/components/CTASection";
import { BlogCard } from "@/domains/blog/components/BlogCard";
import { getBlogPost, getBlogPosts } from "@/lib/content/service.server";
import { siteConfig } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Article Not Found" };
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription ?? post.excerpt ?? `Read "${post.title}" on the Global Line Safaris journal.`,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription ?? post.excerpt ?? undefined,
      type: "article",
      images: post.image ? [{ url: post.image }] : undefined,
      publishedTime: post.createdAt,
    },
  };
}

function toParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([getBlogPost(slug), getBlogPosts()]);

  if (!post) notFound();

  const related = allPosts
    .filter((p) => p.slug !== post.slug)
    .filter((p) => (post.category && p.category === post.category) || p.featured)
    .slice(0, 3);
  const suggestions = related.length ? related : allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const paragraphs = toParagraphs(post.content ?? "");
  const coverImage = post.image || "/images/rwanda-hills.jpg";
  const author = post.author ?? "Global Line Safaris";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seoTitle || post.title,
    description: post.seoDescription ?? post.excerpt ?? undefined,
    image: post.image || undefined,
    datePublished: post.createdAt,
    author: { "@type": "Person", name: author },
    publisher: {
      "@type": "TravelAgency",
      name: siteConfig.name,
      url: siteConfig.siteUrl,
      logo: { "@type": "ImageObject", url: `${siteConfig.siteUrl.replace(/\/$/, "")}/gls/logo.png` },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.siteUrl.replace(/\/$/, "")}/blog/${post.slug}`,
    },
  };

  const baseUrl = siteConfig.siteUrl.replace(/\/$/, "");
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${baseUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${baseUrl}/blog/${post.slug}` },
    ],
  };

  return (
    <div className="overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <PageHero
        eyebrow={post.category || "Travel Journal"}
        title={post.title}
        description={post.excerpt ?? undefined}
        image={coverImage}
        breadcrumb={[
          { label: "Blog", href: "/blog" },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
      />

      <section className="bg-white py-20 dark:bg-slate-950 sm:py-28">
        <div className="safari-container">
          <article className="mx-auto max-w-3xl">
            <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-slate-200 pb-7 text-sm text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-2">
                <User className="size-4" /> {author}
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4" />
                {post.createdAt ? formatDate(post.createdAt) : ""}
              </span>
              {post.readTime ? (
                <span className="inline-flex items-center gap-2">
                  <Clock className="size-4" /> {post.readTime} min read
                </span>
              ) : null}
              <span className="inline-flex items-center gap-2">
                <BookOpen className="size-4" /> {post.category ?? "Travel"}
              </span>
            </div>

            {post.image && (
              <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
              </div>
            )}

            {paragraphs.length > 0 ? (
              <div className="space-y-5">
                {paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg"
                  >
                    {p}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-base leading-relaxed text-slate-500 dark:text-slate-400">
                This article is being prepared. Contact our team for a personalised overview.
              </p>
            )}

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition-all hover:gap-3 dark:text-accent"
              >
                <ArrowLeft className="size-4" /> All Journal Posts
              </Link>
              <Link
                className="safari-button"
                href={`/plan-your-trip?destination=${encodeURIComponent(post.category ?? "Rwanda")}`}
              >
                Plan This Trip <ArrowRight className="size-4" />
              </Link>
            </div>
          </article>
        </div>
      </section>

      {suggestions.length > 0 && (
        <section className="bg-brand-bg-light py-20 dark:bg-slate-900 sm:py-28">
          <div className="safari-container">
            <div className="editorial-heading">
              <div>
                <div className="safari-eyebrow">
                  <span className="safari-eyebrow-line" />
                  <span>Keep reading</span>
                </div>
                <h2>More From the Journal</h2>
              </div>
              <Link className="safari-text-link" href="/blog">
                All Posts <ArrowUpRight className="size-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </div>
  );
}
