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
      totalTripInquiries,
      newTripInquiries,
      unreadTripInquiries,
      totalInternshipInquiries,
      newInternshipInquiries,
      unreadInternshipInquiries,
      totalSubscribers,
      recentSubscribers,
      unreadNotifications,
      publishedServices,
      publishedTeamMembers,
      publishedFaqs,
      publishedIndustries,
      publishedDestinations,
      publishedTourPackages,
      publishedBlogPosts,
      homepageSectionCount,
      recentInquiriesList,
      recentTripInquiriesList,
      recentInternshipList,
      recentAuditLogs,
      sixMonthInquiries,
      sixMonthTripInquiries,
      sixMonthInternships,
    ] = await Promise.all([
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.inquiry.count({ where: { read: false, archived: false } }),
      prisma.tripInquiry.count(),
      prisma.tripInquiry.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.tripInquiry.count({ where: { read: false, archived: false } }),
      prisma.internshipInquiry.count(),
      prisma.internshipInquiry.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.internshipInquiry.count({ where: { read: false, archived: false } }),
      prisma.newsletterSubscriber.count({ where: { active: true } }),
      prisma.newsletterSubscriber.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.notification.count({ where: { read: false } }),
      prisma.service.count({ where: { status: "PUBLISHED" } }),
      prisma.teamMember.count({ where: { status: "PUBLISHED" } }),
      prisma.faqItem.count({ where: { status: "PUBLISHED" } }),
      prisma.industry.count({ where: { status: "PUBLISHED" } }),
      prisma.destination.count({ where: { status: "PUBLISHED" } }),
      prisma.tourPackage.count({ where: { status: "PUBLISHED" } }),
      prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
      prisma.homepageSection.count(),
      prisma.inquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, service: true, status: true, read: true, createdAt: true },
      }),
      prisma.tripInquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, destination: true, preferredPackage: true, status: true, read: true, createdAt: true },
      }),
      prisma.internshipInquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, university: true, programType: true, status: true, read: true, createdAt: true },
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
      prisma.tripInquiry.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
      }),
      prisma.internshipInquiry.findMany({
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

      const tripCount = sixMonthTripInquiries.filter((r) => {
        const rd = new Date(r.createdAt);
        return rd.getMonth() === mIdx && rd.getFullYear() === yr;
      }).length;

      const internshipCount = sixMonthInternships.filter((r) => {
        const rd = new Date(r.createdAt);
        return rd.getMonth() === mIdx && rd.getFullYear() === yr;
      }).length;

      monthlyTrends.push({
        month: mName,
        inquiries: inqCount,
        tripInquiries: tripCount,
        internshipInquiries: internshipCount,
        totalLeads: inqCount + tripCount + internshipCount,
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
        tripInquiries: { total: totalTripInquiries, recent: newTripInquiries, unread: unreadTripInquiries },
        internshipInquiries: {
          total: totalInternshipInquiries,
          recent: newInternshipInquiries,
          unread: unreadInternshipInquiries,
        },
        subscribers: { total: totalSubscribers, recent: recentSubscribers },
        unreadNotifications,
        content: {
          services: publishedServices,
          teamMembers: publishedTeamMembers,
          faqs: publishedFaqs,
          industries: publishedIndustries,
          destinations: publishedDestinations,
          tourPackages: publishedTourPackages,
          blogPosts: publishedBlogPosts,
          homepageSections: homepageSectionCount,
        },
      },
      monthlyTrends,
      recentInquiries: recentInquiriesList,
      recentTripInquiries: recentTripInquiriesList,
      recentInternshipInquiries: recentInternshipList,
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
