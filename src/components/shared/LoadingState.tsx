import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  label?: string;
  className?: string;
}

export function LoadingState({ label = "Loading...", className }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-slate-400",
        className
      )}
    >
      <Loader2 className="size-7 animate-spin text-brand" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}
