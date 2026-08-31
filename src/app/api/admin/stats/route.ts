import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/admin/api-registry";

export const dynamic = "force-dynamic";

export async function GET() {
  const { session, error } = await requireRole("EDITOR");
  if (error) return error;

  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [
      totalInquiries,
      newInquiries,
      unreadInquiries,
      totalQuotes,
      newQuotes,
      unreadQuotes,
      totalConsultations,
      newConsultations,
      unreadConsultations,
      totalSubscribers,
      recentSubscribers,
      unreadNotifications,
      publishedServices,
      publishedTeamMembers,
      publishedFaqs,
      publishedIndustries,
      publishedSoftware,
      publishedTestimonials,
      recentInquiriesList,
      recentQuotesList,
      recentConsultationsList,
      recentAuditLogs,
      sixMonthInquiries,
      sixMonthQuotes,
      sixMonthConsultations,
    ] = await Promise.all([
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.inquiry.count({ where: { read: false, archived: false } }),
      prisma.quoteRequest.count(),
      prisma.quoteRequest.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.quoteRequest.count({ where: { read: false, archived: false } }),
      prisma.consultationRequest.count(),
      prisma.consultationRequest.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.consultationRequest.count({ where: { read: false, archived: false } }),
      prisma.newsletterSubscriber.count({ where: { active: true } }),
      prisma.newsletterSubscriber.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.notification.count({ where: { read: false } }),
      prisma.service.count({ where: { status: "PUBLISHED" } }),
      prisma.teamMember.count({ where: { status: "PUBLISHED" } }),
      prisma.faqItem.count({ where: { status: "PUBLISHED" } }),
      prisma.industry.count({ where: { status: "PUBLISHED" } }),
      prisma.softwareTool.count({ where: { status: "PUBLISHED" } }),
      prisma.testimonial.count({ where: { status: "PUBLISHED" } }),
      prisma.inquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, service: true, status: true, read: true, createdAt: true },
      }),
      prisma.quoteRequest.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, service: true, status: true, read: true, createdAt: true },
      }),
      prisma.consultationRequest.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, service: true, preferredDate: true, status: true, read: true, createdAt: true },
      }),
      prisma.auditLog.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
      }),
      prisma.inquiry.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
      }),
      prisma.quoteRequest.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
      }),
      prisma.consultationRequest.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
      }),
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyTrends = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mIdx = d.getMonth();
      const yr = d.getFullYear();
      const mName = `${monthNames[mIdx]} ${String(yr).slice(-2)}`;

      const inqCount = sixMonthInquiries.filter((r) => {
        const rd = new Date(r.createdAt);
        return rd.getMonth() === mIdx && rd.getFullYear() === yr;
      }).length;

      const quoteCount = sixMonthQuotes.filter((r) => {
        const rd = new Date(r.createdAt);
        return rd.getMonth() === mIdx && rd.getFullYear() === yr;
      }).length;

      const consultCount = sixMonthConsultations.filter((r) => {
        const rd = new Date(r.createdAt);
        return rd.getMonth() === mIdx && rd.getFullYear() === yr;
      }).length;

      monthlyTrends.push({
        month: mName,
        inquiries: inqCount,
        quotes: quoteCount,
        consultations: consultCount,
        totalLeads: inqCount + quoteCount + consultCount,
      });
    }

    return NextResponse.json({
      adminUser: {
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      },
      stats: {
        inquiries: { total: totalInquiries, recent: newInquiries, unread: unreadInquiries },
        quotes: { total: totalQuotes, recent: newQuotes, unread: unreadQuotes },
        consultations: { total: totalConsultations, recent: newConsultations, unread: unreadConsultations },
        subscribers: { total: totalSubscribers, recent: recentSubscribers },
        unreadNotifications,
        content: {
          services: publishedServices,
          teamMembers: publishedTeamMembers,
          faqs: publishedFaqs,
          industries: publishedIndustries,
          software: publishedSoftware,
          testimonials: publishedTestimonials,
        },
      },
      monthlyTrends,
      recentInquiries: recentInquiriesList,
      recentQuotes: recentQuotesList,
      recentConsultations: recentConsultationsList,
      recentActivity: recentAuditLogs.map((log) => ({
        id: log.id,
        action: log.action,
        entity: log.entity,
        entityId: log.entityId,
        details: log.details,
        user: log.user ? log.user.name || log.user.email : "System",
        createdAt: log.createdAt,
      })),
    });
  } catch (error) {
    console.error("[admin:stats] error", error);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
