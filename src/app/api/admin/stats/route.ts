import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user.role as string) === "EDITOR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalInquiries,
      newInquiries,
      totalQuotes,
      newQuotes,
      totalConsultations,
      newConsultations,
      totalSubscribers,
      recentSubscribers,
      unreadNotifications,
      publishedServices,
      publishedTeamMembers,
      publishedTestimonials,
    ] = await Promise.all([
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.quoteRequest.count(),
      prisma.quoteRequest.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.consultationRequest.count(),
      prisma.consultationRequest.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.newsletterSubscriber.count({ where: { active: true } }),
      prisma.newsletterSubscriber.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.notification.count({ where: { read: false } }),
      prisma.service.count({ where: { status: "PUBLISHED" } }),
      prisma.teamMember.count({ where: { status: "PUBLISHED" } }),
      prisma.testimonial.count({ where: { status: "PUBLISHED" } }),
    ]);

    return NextResponse.json({
      inquiries: { total: totalInquiries, recent: newInquiries },
      quotes: { total: totalQuotes, recent: newQuotes },
      consultations: { total: totalConsultations, recent: newConsultations },
      subscribers: { total: totalSubscribers, recent: recentSubscribers },
      unreadNotifications,
      content: {
        services: publishedServices,
        teamMembers: publishedTeamMembers,
        testimonials: publishedTestimonials,
      },
    });
  } catch (error) {
    console.error("[admin:stats] error", error);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
