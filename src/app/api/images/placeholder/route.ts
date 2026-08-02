import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const src = url.searchParams.get('src');
    const w = Number(url.searchParams.get('w') || '20');
    if (!src) return new Response('Missing src', { status: 400 });

    let buffer: Buffer;
    if (src.startsWith('/')) {
      const filePath = path.join(process.cwd(), 'public', src.replace(/^\//, ''));
      buffer = await fs.readFile(filePath);
    } else {
      const fetched = await fetch(src);
      if (!fetched.ok) return new Response('Failed to fetch image', { status: 502 });
      buffer = Buffer.from(await fetched.arrayBuffer());
    }

    const small = await sharp(buffer).resize(w).blur(1).toBuffer();
    const base64 = small.toString('base64');
    const mime = 'image/jpeg';
    const dataUrl = `data:${mime};base64,${base64}`;
    return new Response(JSON.stringify({ dataUrl }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
