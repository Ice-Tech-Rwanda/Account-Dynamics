import { BookOpen, FileText, Video, Download, ArrowRight } from "lucide-react";
import { ResourcesHero } from "@/domains/resources/components/ResourcesHero";
import { ResourceFilters } from "@/domains/resources/components/ResourceFilters";
import { ResourceCard } from "@/domains/resources/components/ResourceCard";
import { FeaturedGuides } from "@/domains/resources/components/FeaturedGuides";
import { PopularResources } from "@/domains/resources/components/PopularResources";
import { RecentlyAdded } from "@/domains/resources/components/RecentlyAdded";
import { resourcesService } from "@/domains/resources/service.server";

const categorySections = [
  { id: "guide", label: "Beginner Guides", icon: BookOpen, desc: "Step-by-step guides to get you started", color: "from-blue-500/10 to-transparent border-blue-500/20" },
  { id: "article", label: "Strategy Tips", icon: FileText, desc: "Advanced strategies from champion players", color: "from-purple-500/10 to-transparent border-purple-500/20" },
  { id: "tutorial", label: "Tutorials & Videos", icon: Video, desc: "Visual walkthroughs and deep dives", color: "from-emerald-500/10 to-transparent border-emerald-500/20" },
  { id: "download", label: "Downloads & Templates", icon: Download, desc: "Printable resources and reference sheets", color: "from-orange-500/10 to-transparent border-orange-500/20" },
];

export const metadata = {
  title: "Resources",
  description: "Browse guides, tutorials, articles, and downloadable resources.",
  openGraph: { title: "Resources", description: "Guides, tutorials, and downloads for players and coaches", images: ["/og/resources.jpg"] },
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/resources` },
};

export default async function ResourcesPage(props: { searchParams?: Promise<{ [key: string]: string | string[] }> }) {
  const searchParams = await props.searchParams;
  const page = parseInt((searchParams?.page as string) || "1", 10) || 1;
  const limit = parseInt((searchParams?.limit as string) || "18", 10) || 18;

  const result = await resourcesService.list({ page, limit });
  const { data: resources, total } = result;

  const counts = {
    all: total,
    guide: resources.filter((r) => r.category === "guide").length,
    article: resources.filter((r) => r.category === "article").length,
    tutorial: resources.filter((r) => r.category === "tutorial").length,
    download: resources.filter((r) => r.category === "download").length,
  };

  return (
    <div className="overflow-x-hidden">
      <ResourcesHero />

      {/* Featured */}
      <FeaturedGuides resources={resources} />

      {/* All Resources */}
      <section className="py-20 sm:py-28 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Library</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
                All Resources
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Browse our complete collection of learning materials.</p>
            </div>
          </div>

          <div className="mb-8">
            <ResourceFilters
              resources={resources}
              counts={counts}
            />
          </div>

          {resources.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource, i) => (
                <ResourceCard key={resource.id} resource={resource} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="size-10 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="mt-3 text-sm text-slate-500">No resources available yet.</p>
            </div>
          )}

          {/* Simple pagination controls for server-side pages */}
          {total > limit && (
            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm text-slate-500">Page {page} of {Math.ceil(total / limit)}</p>
              <div className="flex gap-2">
                {page > 1 && (
                  <a href={`/resources?page=${page - 1}&limit=${limit}`} className="text-xs text-brand">Previous</a>
                )}
                {page * limit < total && (
                  <a href={`/resources?page=${page + 1}&limit=${limit}`} className="text-xs text-brand">Next</a>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Category Sections */}
      <section className="py-20 sm:py-28 px-4 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">Categories</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-1">
              Browse by Category
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Find exactly what you need organized by topic and format.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {categorySections.map((section) => {
              const sectionResources = resources.filter((r) => r.category === section.id);
              const Icon = section.icon;
              const isOpen = false;
              return (
                <div
                  key={section.id}
                  className={`rounded-2xl border bg-gradient-to-br ${section.color} bg-white dark:bg-slate-900 overflow-hidden transition-all duration-300`}
                >
                  <div className="w-full flex items-center justify-between p-4 sm:p-5 text-left">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${sectionResources.length > 0 ? "bg-brand/10 text-brand" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{section.label}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{section.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="font-bold text-brand">{counts[section.id as keyof typeof counts]}</span>
                      <span className={`transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}>
                        <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </div>

                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                    {sectionResources.length > 0 ? (
                      sectionResources.map((resource, i) => (
                        <ResourceCard key={resource.id} resource={resource} index={i} compact />
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-4">No resources in this category yet.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular + Recently Added */}
      <section className="py-20 sm:py-28 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-2">
            <PopularResources resources={resources} />
            <RecentlyAdded resources={resources} />
          </div>
        </div>
      </section>
    </div>
  );
}