import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BlogCard } from "@/domains/blog/components/BlogCard";
import { getBlogPosts } from "@/lib/content/service.server";

export async function JournalSection() {
  const posts = await getBlogPosts();
  const featured = posts.slice(0, 3);
  if (!featured.length) return null;

  return (
    <section className="safari-section">
      <div className="safari-container">
        <div className="editorial-heading">
          <div>
            <div className="safari-eyebrow">
              <span className="safari-eyebrow-line" />
              <span>From the journal</span>
            </div>
            <h2>Travel stories & planning guides</h2>
          </div>
          <div>
            <p>
              Practical guides from the Global Line Safaris team — what to
              expect, when to go and how to plan the journey.
            </p>
            <Link className="safari-text-link" href="/blog">
              All Journal Posts
              <ArrowUpRight width={14} height={14} />
            </Link>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
