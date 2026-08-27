import Link from "next/link";
import { Phone, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { footerGroups } from "@/lib/navigation";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 dark:border-slate-800/80">
      <div className="it-container px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400 max-w-sm">
              {siteConfig.description}
            </p>

            {/* Contact info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                <MapPin className="size-4 mt-0.5 shrink-0 text-brand" />
                <span>{siteConfig.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Phone className="size-4 shrink-0 text-brand" />
                <div>
                  <a href={`tel:${siteConfig.phone.replace(/-/g, "")}`} className="hover:text-brand transition-colors">
                    {siteConfig.phone}
                  </a>
                  <span className="mx-1.5 text-slate-300 dark:text-slate-600">|</span>
                  <a href={`tel:${siteConfig.phoneSecondary?.replace(/-/g, "")}`} className="hover:text-brand transition-colors">
                    {siteConfig.phoneSecondary}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <Clock className="size-4 shrink-0 text-brand" />
                <span>{siteConfig.hours}</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-slate-600 hover:text-brand dark:text-slate-400 dark:hover:text-accent transition-colors"
                    >
                      {link.label}
                      <ArrowUpRight className="size-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-8 dark:border-slate-800/80 sm:flex-row">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-500">
            <span>{siteConfig.location.split(",")[1]?.trim()}</span>
            <span>|</span>
            <a
              href={`mailto:${siteConfig.email}`}
              className="hover:text-brand transition-colors"
            >
              {siteConfig.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
