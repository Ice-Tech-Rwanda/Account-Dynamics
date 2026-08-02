import { prisma } from "@/lib/prisma";
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, w = 20 } = body;
    if (!id) return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    const item = await prisma.galleryItem.findUnique({ where: { id } });
    if (!item) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });

    const src = item.src;
    let buffer: Buffer;
    if (src.startsWith('/')) {
      const filePath = path.join(process.cwd(), 'public', src.replace(/^\//, ''));
      buffer = await fs.readFile(filePath);
    } else {
      const fetched = await fetch(src);
      if (!fetched.ok) return new Response(JSON.stringify({ error: 'Failed to fetch image' }), { status: 502, headers: { 'Content-Type': 'application/json' } });
      buffer = Buffer.from(await fetched.arrayBuffer());
    }

    const small = await sharp(buffer).resize(Number(w)).blur(1).jpeg({ quality: 60 }).toBuffer();
    const dataUrl = `data:image/jpeg;base64,${small.toString('base64')}`;

    await prisma.galleryItem.update({ where: { id }, data: { blurDataUrl: dataUrl } });
    return new Response(JSON.stringify({ blurDataUrl: dataUrl }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
