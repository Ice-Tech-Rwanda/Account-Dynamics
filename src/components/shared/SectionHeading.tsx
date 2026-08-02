import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  description?: string;
  dark?: boolean;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  kicker,
  title,
  description,
  dark,
  className,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {kicker && (
        <span className={dark ? "it-kicker-dark" : "it-kicker"}>
          {kicker}
        </span>
      )}
      <h2 className={dark ? "it-title-dark" : "it-title"}>{title}</h2>
      {description && (
        <p
          className={cn(
            dark ? "it-copy-dark" : "it-copy",
            "mx-auto max-w-2xl"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
