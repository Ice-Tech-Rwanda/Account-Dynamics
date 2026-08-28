import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
  size?: "sm" | "md";
  showWordmark?: boolean;
}

const sizeStyles = {
  sm: { box: "h-9 w-9 rounded-lg text-sm", title: "text-sm", subtitle: "text-[10px]" },
  md: { box: "h-10 w-10 rounded-lg text-base", title: "text-base", subtitle: "text-[11px]" },
} as const;

export function Logo({
  className,
  href = "/",
  size = "md",
  showWordmark = true,
}: LogoProps) {
  const styles = sizeStyles[size];

  return (
    <Link
      href={href}
      aria-label={`${siteConfig.name} — Home`}
      className={cn("flex items-center gap-2.5", className)}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center bg-gradient-to-br from-brand to-brand-strong font-bold text-white shadow-md",
          styles.box
        )}
      >
        {siteConfig.initials}
      </span>
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-bold tracking-tight text-slate-900 dark:text-white",
              styles.title
            )}
          >
            {siteConfig.shortName}
          </span>
          <span
            className={cn(
              "mt-0.5 font-medium tracking-wide text-slate-500 dark:text-slate-400",
              styles.subtitle
            )}
          >
            {siteConfig.tagline}
          </span>
        </span>
      )}
    </Link>
  );
}
