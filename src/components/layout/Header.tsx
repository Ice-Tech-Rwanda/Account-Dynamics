"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { mainNav } from "@/lib/navigation";
import { useCartCount } from "@/lib/cart";

export function Header() {
  const [open, setOpen] = useState(false);
  const cartCount = useCartCount();
  const joinItem = mainNav.find((item) => item.href === "/join");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90">
      <div className="it-container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo size="sm" />

        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand dark:text-slate-300 dark:hover:text-accent rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/shop"
            className="hidden sm:flex items-center justify-center h-9 w-9 rounded-xl text-slate-500 hover:text-brand hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            aria-label={`Shopping cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
          >
            <ShoppingCart className="size-4" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[8px] font-bold text-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>
          <ThemeToggle />
          {joinItem && (
            <Link href={joinItem.href} className="hidden sm:block">
              <Button
                variant="brand"
                className="h-9 rounded-xl text-xs font-bold px-4"
              >
                {joinItem.label}
              </Button>
            </Link>
          )}
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
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-brand dark:text-slate-300 dark:hover:text-accent rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {joinItem && (
              <Link href={joinItem.href} onClick={() => setOpen(false)} className="block mt-2">
                <Button variant="brand" className="w-full h-10 rounded-xl text-xs font-bold">
                  {joinItem.label}
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
