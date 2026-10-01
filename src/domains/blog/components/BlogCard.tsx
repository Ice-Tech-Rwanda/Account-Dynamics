import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/content/types";
import { formatDate } from "@/lib/utils";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="safari-package"
      aria-label={post.title}
    >
      <div className="package-image">
        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw"
          />
        )}
        {post.category && (
          <span className="package-duration">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            {post.category}
          </span>
        )}
      </div>
      <div className="package-copy">
        <div className="safari-eyebrow">
          <span className="safari-eyebrow-line" />
          <span>{post.createdAt ? formatDate(post.createdAt) : ""}</span>
        </div>
        <h3>{post.title}</h3>
        {post.excerpt && <p className="package-overview">{post.excerpt}</p>}
        <div className="package-bottom">
          <span className="inline-flex items-center gap-2">
            <CalendarDays width={12} height={12} />
            {post.author ?? "Global Line Safaris"}
          </span>
          <span className="inline-flex items-center gap-2">
            {post.readTime ? (
              <>
                <Clock width={12} height={12} />
                {post.readTime} min read
              </>
            ) : (
              "Read Article"
            )}
            <ArrowUpRight width={14} height={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
