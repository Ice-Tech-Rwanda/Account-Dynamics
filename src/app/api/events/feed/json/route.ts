import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q') || '';
  const category = url.searchParams.get('category') || undefined;
  const upcomingOnly = url.searchParams.get('upcoming') !== 'false';

  const where: any = {};
  if (upcomingOnly) where.status = 'upcoming';
  const and: any[] = [];
  if (q) and.push({ OR: [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] });
  if (category) and.push({ category });
  if (and.length) where.AND = and;

  const events = await prisma.event.findMany({ where, orderBy: { startDate: 'asc' }, take: 500 });
  const serialized = events.map(e => ({ ...e, startDate: e.startDate.toISOString(), endDate: e.endDate?.toISOString() }));
  return NextResponse.json(serialized);
}
