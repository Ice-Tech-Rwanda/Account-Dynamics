import { getBlogPosts } from "@/lib/content/service.server";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getBlogPosts();
  const base = siteConfig.siteUrl.replace(/\/$/, "");

  const items = posts
    .map((post) => {
      const pubDate = post.createdAt ? new Date(post.createdAt).toUTCString() : new Date().toUTCString();
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${base}/blog/${post.slug}</link>
      <guid isPermaLink="true">${base}/blog/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      ${post.category ? `<category>${escapeXml(post.category)}</category>` : ""}
      <description>${escapeXml(post.excerpt ?? post.title)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} — Travel Journal</title>
    <link>${base}/blog</link>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Travel guides, safari stories and destination inspiration from the Global Line Safaris team.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=600",
    },
  });
}