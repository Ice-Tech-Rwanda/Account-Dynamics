"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "light",
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("it-theme") as Theme) || "system";
    }
    return "system";
  });
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function resolve() {
      const isDark =
        theme === "dark" || (theme === "system" && mediaQuery.matches);
      setResolvedTheme(isDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", isDark);
    }

    resolve();
    mediaQuery.addEventListener("change", resolve);
    return () => mediaQuery.removeEventListener("change", resolve);
  }, [theme]);

  function setTheme(newTheme: Theme) {
    setThemeState(newTheme);
    localStorage.setItem("it-theme", newTheme);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
