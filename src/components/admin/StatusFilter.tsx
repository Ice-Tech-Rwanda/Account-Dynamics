"use client";

const OPTIONS = [
  { label: "All", value: "" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Draft", value: "DRAFT" },
  { label: "Archived", value: "ARCHIVED" },
];

interface StatusFilterProps {
  value?: string;
  onChange: (status: string) => void;
}

/** Status filter chips for CMS content lists. */
export function StatusFilter({ value = "", onChange }: StatusFilterProps) {
  return (
    <div className="flex gap-1.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value || "all"}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`h-7 px-2.5 rounded-lg text-[11px] font-bold transition-colors ${
            value === opt.value
              ? "bg-brand text-white"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}