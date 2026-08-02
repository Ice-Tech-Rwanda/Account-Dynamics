import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export async function GET() {
  const items = await prisma.galleryItem.findMany({ orderBy: { date: 'desc' }, take: 100 });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.siteUrl;

  const itemsXml = items.map(i => `
    <item>
      <title>${escapeXml(i.title)}</title>
      <link>${siteUrl}${i.src}</link>
      <description>${escapeXml(i.description || '')}</description>
      <pubDate>${new Date(i.date).toUTCString()}</pubDate>
      <guid isPermaLink="false">${i.id}</guid>
    </item>
  `).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>${siteConfig.name} Gallery</title>
      <link>${siteUrl}/gallery</link>
      <description>Recent media from ${siteConfig.name}</description>
      ${itemsXml}
    </channel>
  </rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
