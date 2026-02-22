"use client";

import * as React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme, type Theme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// ThemeToggle — cycles light → dark → system
// ─────────────────────────────────────────────

export interface ThemeToggleProps {
  /** Show a label next to the icon */
  showLabel?: boolean;
  className?: string;
}

const themeOrder: Theme[] = ["dark", "light", "system"];

const icons: Record<Theme, React.ElementType> = {
  dark:   Moon,
  light:  Sun,
  system: Monitor,
};

const labels: Record<Theme, string> = {
  dark:   "Dark",
  light:  "Light",
  system: "System",
};

export function ThemeToggle({ showLabel = false, className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const cycle = () => {
    const idx  = themeOrder.indexOf(theme);
    const next = themeOrder[(idx + 1) % themeOrder.length];
    setTheme(next);
  };

  const Icon = icons[theme] as React.FC<{ className?: string }>;

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Switch theme (current: ${labels[theme]})`}
      className={cn(
        "inline-flex items-center gap-1.5",
        "h-9 rounded-xl px-2.5",
        "text-fg/50 gf-transition-fast",
        "hover:bg-fg/8 hover:text-fg",
        "gf-focus-ring focus-visible:ring-2 focus-visible:ring-tomato-jam/50",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
          animate={{ opacity: 1, rotate: 0,   scale: 1   }}
          exit={{    opacity: 0, rotate:  30,  scale: 0.7 }}
          transition={{ duration: 0.18, ease: [0, 0, 0.2, 1] }}
          className="flex items-center justify-center"
        >
          <Icon className="h-4 w-4" />
        </motion.span>
      </AnimatePresence>

      {showLabel && (
        <span className="text-xs font-medium select-none">{labels[theme]}</span>
      )}
    </button>
  );
}
