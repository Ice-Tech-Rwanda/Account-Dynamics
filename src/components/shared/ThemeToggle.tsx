"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    // Hydration guard: only render theme-dependent UI after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  function toggle() {
    setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" : "light");
  }

  return (
    <button
      onClick={toggle}
      className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:text-brand hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      title={mounted ? (theme === "light" ? "Switch to dark mode" : theme === "dark" ? "Use system theme" : "Switch to light mode") : "Toggle theme"}
    >
      {mounted ? (
        resolvedTheme === "dark" ? (
          <Sun className="size-4" />
        ) : (
          <Moon className="size-4" />
        )
      ) : (
        <span className="size-4" />
      )}
    </button>
  );
}
