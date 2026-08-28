import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unauthorized, serverError } from "@/lib/api-helpers";

function parseCsv(text: string) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length <= 1) return [];
  const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim());
  const rows = lines.slice(1).map((line) => {
    const cols = line.split(",");
    const obj: any = {};
    headers.forEach((h, i) => { obj[h] = (cols[i] || "").replace(/"/g, "").trim(); });
    return obj;
  });
  return rows;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") return unauthorized();

    const text = await request.text();
    const rows = parseCsv(text);
    const created: string[] = [];
    for (const r of rows) {
      const email = r.email;
      if (!email) continue;
      // upsert by email
      await prisma.member.upsert({ where: { email }, update: { name: r.name, phone: r.phone ?? null, category: r.category ?? "individual" }, create: { name: r.name || email, email, phone: r.phone || null, category: r.category || "individual" } });
      created.push(email);
    }

    return new Response(JSON.stringify({ imported: created.length, emails: created }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch {
    return serverError();
  }
}
