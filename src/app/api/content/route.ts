import { NextResponse } from "next/server";
import { getServiceCategories } from "@/lib/content/service.server";
import { getTeam } from "@/lib/content/service.server";
import { getFaqs } from "@/lib/content/service.server";
import { getIndustries } from "@/lib/content/service.server";
import { getHomepageContent } from "@/lib/content/service.server";
import { getSiteSettings } from "@/lib/content/service.server";
import { getTestimonials } from "@/lib/content/service.server";
import { getMembershipSection } from "@/lib/content/service.server";

/** Settings keys that should NOT be exposed to the public API. */
const SENSITIVE_KEYS = new Set(["adminEmail"]);

export async function GET() {
  try {
    const [services, team, faqs, industries, homepage, allSettings, testimonials, membership] =
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

    // Filter sensitive settings from public response
    const settings: Record<string, string> = {};
    for (const [key, value] of Object.entries(allSettings)) {
      if (!SENSITIVE_KEYS.has(key)) {
        settings[key] = value;
      }
    }

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
