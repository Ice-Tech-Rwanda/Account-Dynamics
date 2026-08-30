import { NextResponse } from "next/server";
import { getServiceCategories } from "@/lib/content/service.server";
import { getTeam } from "@/lib/content/service.server";
import { getFaqs } from "@/lib/content/service.server";
import { getIndustries } from "@/lib/content/service.server";
import { getHomepageContent } from "@/lib/content/service.server";
import { getSiteSettings } from "@/lib/content/service.server";
import { getTestimonials } from "@/lib/content/service.server";
import { getMembershipSection } from "@/lib/content/service.server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [services, team, faqs, industries, homepage, settings, testimonials, membership] =
      await Promise.all([
        getServiceCategories(),
        getTeam(),
        getFaqs(),
        getIndustries(),
        getHomepageContent(),
        getSiteSettings(),
        getTestimonials(),
        getMembershipSection(),
      ]);

    const response = NextResponse.json({
      services,
      team,
      faqs,
      industries,
      homepage,
      settings,
      testimonials,
      membership,
    });

    // Cache for 60 seconds, allow stale-while-revalidate
    response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");

    return response;
  } catch (error) {
    console.error("[content] Failed to load content", error);
    return NextResponse.json({ error: "Failed to load content" }, { status: 500 });
  }
}
