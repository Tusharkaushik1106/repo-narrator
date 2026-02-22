"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// SectionTransition — barely-perceptible section-level entrance
//
// Replaced framer-motion with pure CSS @keyframes + IntersectionObserver.
// ─────────────────────────────────────────────────────────────────────────────

export interface SectionTransitionProps {
  children:   React.ReactNode;
  className?: string;
}

export function SectionTransition({ children, className }: SectionTransitionProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.setAttribute("data-visible", "1");
        observer.disconnect();
      },
      { threshold: 0.08 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal="sectionEnter" className={cn(className)}>
      {children}
    </div>
  );
}
