import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const items = await prisma.galleryItem.findMany({ orderBy: { date: 'desc' }, take: 500 });
  const serialized = items.map(i => ({ id: i.id, title: i.title, description: i.description, src: i.src, category: i.category, date: i.date.toISOString(), type: i.videoUrl ? 'video' : 'image', blurDataUrl: i.blurDataUrl || undefined }));
  return NextResponse.json(serialized);
}
