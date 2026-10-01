"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getResolvedTheme(theme: Theme): ResolvedTheme {
  if (theme === "system") {
    return typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
}

function getInitialTheme(): { theme: Theme; resolvedTheme: ResolvedTheme } {
  if (typeof window === "undefined") return { theme: "light", resolvedTheme: "light" };
  const stored = localStorage.getItem("theme") as Theme | null;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme: Theme = stored ?? (prefersDark ? "dark" : "light");
  return { theme, resolvedTheme: getResolvedTheme(theme) };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(getInitialTheme);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setState((prev) =>
        prev.theme === "system"
          ? { ...prev, resolvedTheme: mediaQuery.matches ? "dark" : "light" }
          : prev
      );
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    const next = state.theme === "light" ? "dark" : state.theme === "dark" ? "system" : "light";
    const resolved = getResolvedTheme(next);
    setState({ theme: next, resolvedTheme: resolved });
    document.documentElement.classList.toggle("dark", resolved === "dark");
    localStorage.setItem("theme", next);
  };

  const setTheme = (newTheme: Theme) => {
    const resolved = getResolvedTheme(newTheme);
    setState({ theme: newTheme, resolvedTheme: resolved });
    document.documentElement.classList.toggle("dark", resolved === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme: state.theme, resolvedTheme: state.resolvedTheme, toggleTheme, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
