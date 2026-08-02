import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

function toICal(events: any[]) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${siteConfig.name}//Events//EN`,
  ];
  for (const e of events) {
    const uid = e.id;
    const dtStart = new Date(e.startDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const dtEnd = e.endDate ? new Date(e.endDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z' : dtStart;
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
    lines.push(`DTSTART:${dtStart}`);
    lines.push(`DTEND:${dtEnd}`);
    lines.push(`SUMMARY:${e.title.replace(/\n/g, ' ')}`);
    lines.push(`DESCRIPTION:${(e.description || '').replace(/\n/g, ' ')}`);
    lines.push(`LOCATION:${(e.location || '').replace(/\n/g, ' ')}`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const upcomingOnly = url.searchParams.get('upcoming') !== 'false';
  const events = await prisma.event.findMany({ where: upcomingOnly ? { status: 'upcoming' } : {}, orderBy: { startDate: 'asc' }, take: 500 });
  const body = toICal(events.map(e => ({ ...e, startDate: e.startDate.toISOString(), endDate: e.endDate?.toISOString() })));
  return new Response(body, { status: 200, headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
}
