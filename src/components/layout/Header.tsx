"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown, Calendar } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { mainNav, ctaNav } from "@/lib/navigation";

export function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90">
      <div className="it-container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo size="sm" />

        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {mainNav.map((item) => (
            item.children ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand dark:text-slate-300 dark:hover:text-accent rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {item.label}
                  <ChevronDown className={`size-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
                </Link>
                {servicesOpen && (
                  <div className="absolute top-full left-0 pt-1 z-50">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg py-2 min-w-[200px]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-slate-600 hover:text-brand hover:bg-slate-50 dark:text-slate-300 dark:hover:text-accent dark:hover:bg-slate-800 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand dark:text-slate-300 dark:hover:text-accent rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {item.label}
              </Link>
            )
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href={ctaNav.href} className="hidden sm:block" target="_blank" rel="noopener noreferrer">
            <Button
              variant="brand"
              className="h-9 rounded-lg text-xs font-bold px-4 gap-1.5"
            >
              <Calendar className="size-3.5" />
              {ctaNav.label}
            </Button>
          </Link>
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="lg:hidden flex items-center justify-center h-9 w-9 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950">
          <div className="px-4 py-4 space-y-1">
            {mainNav.map((item) => (
              item.children ? (
                <div key={item.href}>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-brand dark:text-slate-300 dark:hover:text-accent rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {item.label}
                    <ChevronDown className={`size-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
                  </button>
                  {servicesOpen && (
                    <div className="pl-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="block px-3 py-2 text-sm text-slate-500 hover:text-brand dark:text-slate-400 dark:hover:text-accent rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-brand dark:text-slate-300 dark:hover:text-accent rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {item.label}
                </Link>
              )
            ))}
            <Link href={ctaNav.href} onClick={() => setOpen(false)} className="block mt-2" target="_blank" rel="noopener noreferrer">
              <Button variant="brand" className="w-full h-10 rounded-lg text-xs font-bold gap-1.5">
                <Calendar className="size-3.5" />
                {ctaNav.label}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
