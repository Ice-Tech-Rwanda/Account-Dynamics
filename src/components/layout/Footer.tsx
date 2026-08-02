import Link from "next/link";
import {
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowUpRight,
} from "lucide-react";
import { siteConfig } from "@/lib/site";
import { footerGroups } from "@/lib/navigation";
import { Logo } from "@/components/brand/Logo";

const socialIcons = {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn: Linkedin,
  YouTube: Youtube,
} as const;

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 dark:border-slate-800/80">
      <div className="it-container px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400 max-w-sm">
              {siteConfig.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-brand/10 px-4 py-2 text-xs font-bold text-brand hover:bg-brand/20 transition-colors"
              >
                <MessageCircle className="size-3.5" />
                WhatsApp Group
              </a>
              <div className="flex gap-2">
                {siteConfig.socialLinks.map(({ label, href }) => {
                  const Icon = socialIcons[label as keyof typeof socialIcons];
                  if (!Icon) return null;
                  return (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-brand hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-brand transition-all"
                    >
                      <Icon className="size-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

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

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-8 dark:border-slate-800/80 sm:flex-row">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-500">
            <span>{siteConfig.location}</span>
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
