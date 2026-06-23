import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light";
const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({ theme: "dark", toggle: () => {} });

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem("sb-theme") as Theme | null;
    if (saved && (saved === "dark" || saved === "light")) {
      return saved;
    }
    return getSystemTheme();
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    try { localStorage.setItem("sb-theme", theme); } catch {}
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem("sb-theme");
      if (!saved) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <ThemeCtx.Provider value={{ theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx);
