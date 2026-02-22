"use client";

import * as React from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type Theme         = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  /** The stored preference: "light" | "dark" | "system" */
  theme:         Theme;
  /** What is actually displayed — never "system" */
  resolvedTheme: ResolvedTheme;
  setTheme:      (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "gitlore-theme";

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Start with "system" — the blocking <script> in <head> has already
  // applied the correct class to <html> before JS hydrates, so there
  // is no flash regardless of what we default to here.
  const [theme, setThemeState] = React.useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>("dark");

  // ── Initialise from localStorage on first client render ──────────
  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored && (stored === "light" || stored === "dark" || stored === "system")) {
      setThemeState(stored);
    }
  }, []);

  // ── Apply class to <html> + track resolvedTheme ──────────────────
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => {
      let isDark: boolean;
      if (theme === "dark") {
        isDark = true;
      } else if (theme === "light") {
        isDark = false;
      } else {
        // "system" — follow the OS
        isDark = mediaQuery.matches;
      }

      const root = document.documentElement;
      root.classList.toggle("dark",  isDark);
      root.classList.toggle("light", !isDark);
      setResolvedTheme(isDark ? "dark" : "light");
    };

    apply();

    // Re-apply if the OS preference changes while "system" is selected
    const listener = () => { if (theme === "system") apply(); };
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [theme]);

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* SSR/private */ }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}

// ─────────────────────────────────────────────
// Anti-flash inline script (inject into <head>)
// ─────────────────────────────────────────────
// This string is rendered as a blocking <script> tag before any
// CSS or React hydration runs, so the correct class is always set
// on <html> from the very first paint.

export const themeScript = `(function(){try{var t=localStorage.getItem('gitlore-theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.classList.toggle('light',!d);}catch(e){document.documentElement.classList.add('dark');}})();`;
