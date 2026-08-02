import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, GraduationCap, Users, Target } from "lucide-react";
import { contentService, type SuccessStoryItem } from "@/domains/content/service.server";
import { siteConfig } from "@/lib/site";

export const revalidate = 60;

export const metadata = {
  title: "Women & Youth",
  description: "Stories of women and young people empowered by our programs.",
  openGraph: {
    title: "Women & Youth",
    description: "Stories of women and young people empowered by our programs.",
    url: "/womens-youth",
  },
};

type SuccessStory = SuccessStoryItem

import RetryButton from "@/components/shared/RetryButton";

export default async function WomensYouthPage(props: { searchParams?: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const page = Math.max(1, parseInt((searchParams?.page as string) || "1", 10));
  const perPage = 9;
  let stories: SuccessStory[] = [];
  let fetchError: string | null = null;
  let total = 0;

  try {
    const result = await contentService.getSuccessStories({ page, limit: perPage });
    stories = result.data;
    total = result.total;
  } catch {
    fetchError = "Unable to load success stories.";
  }

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Success Stories — Women & Youth",
    numberOfItems: stories.length,
    itemListElement: stories.map((s, i) => ({
      "@type": "ListItem",
      position: (page - 1) * perPage + i + 1,
      name: s.name,
      description: s.story.slice(0, 200),
    })),
  };

  return (
    <div>
      <section className="it-section bg-gradient-to-br from-brand-bg-dark via-brand-bg-dark-mid to-brand">
        <div className="it-container text-center">
          <span className="it-kicker-dark">Women & Youth</span>
          <h1 className="it-title-dark">
            Empowering Women &{" "}
            <span className="text-accent">Youth</span>
          </h1>
          <p className="it-copy-dark mx-auto max-w-2xl">
            {siteConfig.name} is committed to creating opportunities for women and young
            people through Scrabble.
          </p>
        </div>
      </section>

      {/* Programs */}
      <section className="it-section">
        <div className="it-container">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Heart,
                title: "Women's Scrabble Network",
                desc: "A supportive community for female Scrabble players. Regular meetups, mentorship, and tournaments.",
                color: "text-pink-500 bg-pink-50 dark:bg-pink-500/10",
              },
              {
                icon: GraduationCap,
                title: "Youth Development Program",
                desc: "Teaching Scrabble in schools to develop vocabulary, critical thinking, and confidence in young learners.",
                color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
              },
              {
                icon: Users,
                title: "School Outreach",
                desc: "Bringing Scrabble to secondary schools across Kigali. We provide boards, training, and competition pathways.",
                color: "text-brand bg-brand/10",
              },
              {
                icon: Target,
                title: "Leadership Training",
                desc: "Developing young leaders through club management, event organization, and community engagement opportunities.",
                color: "text-accent bg-accent/10",
              },
            ].map((program) => (
              <div key={program.title} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${program.color}`}>
                  <program.icon className="size-6" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">{program.title}</h3>
                <p className="mt-2 text-xs leading-6 text-slate-500 dark:text-slate-400">{program.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="it-section bg-brand-bg dark:bg-slate-900/50">
        <div className="it-container">
          <div className="text-center">
            <span className="it-kicker">Success Stories</span>
            <h2 className="it-title">Making an Impact</h2>
            <p className="it-copy max-w-2xl mx-auto">
              Real stories of how Scrabble is changing lives in Rwanda.
            </p>
          </div>

          {fetchError ? (
            <div className="mt-10 text-center" role="status" aria-live="polite">
              <p className="text-sm text-red-600">{fetchError}</p>
              <div className="mt-4 flex justify-center">
                <RetryButton />
              </div>
            </div>
          ) : stories.length === 0 ? (
            <div className="mt-10 text-center" role="status" aria-live="polite">
              <p className="text-sm text-slate-600">No success stories available yet. Check back soon.</p>
            </div>
          ) : (
            <div>
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {stories.map((story) => (
                  <article
                    key={story.id}
                    className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-soft text-lg font-black text-white" aria-hidden>
                      {story.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">{story.name}</h3>
                    <p className="text-xs text-slate-500">{story.school || story.university || story.role}</p>
                    {story.achievement ? <Badge variant="accent" className="mt-2 text-[9px]">{story.achievement}</Badge> : null}
                    <p className="mt-3 text-xs leading-6 text-slate-500 dark:text-slate-400">{story.story}</p>
                  </article>
                ))}
              </div>

              {/* Pagination controls */}
              <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-3">
                <a
                  href={`/womens-youth?page=${Math.max(1, page - 1)}`}
                  className={`px-3 py-2 rounded-md border ${page === 1 ? "opacity-50 pointer-events-none" : "hover:bg-slate-100"}`}
                  aria-disabled={page === 1}
                >
                  Previous
                </a>

                <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>

                <a
                  href={`/womens-youth?page=${Math.min(totalPages, page + 1)}`}
                  className={`px-3 py-2 rounded-md border ${page === totalPages ? "opacity-50 pointer-events-none" : "hover:bg-slate-100"}`}
                  aria-disabled={page === totalPages}
                >
                  Next
                </a>
              </nav>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="it-section">
        <div className="it-container text-center">
          <h2 className="it-title">Get Involved</h2>
          <p className="it-copy max-w-xl mx-auto">
            Want to participate in our women&apos;s or youth programs? Reach out and
            join the movement.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="brand" size="xl" className="rounded-xl">
              Join Women&apos;s Program
            </Button>
            <Button variant="outline" size="xl" className="rounded-xl">
              Youth Registration
            </Button>
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
