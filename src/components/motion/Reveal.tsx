"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { MotionVariant } from "@/lib/motion";

// ─────────────────────────────────────────────────────────────────────────────
// Reveal — scroll-triggered entrance for a single element
//
// Replaced framer-motion with pure CSS @keyframes + IntersectionObserver.
// CSS animations run on the GPU compositor thread — zero JS on the main
// thread during scroll, eliminating the biggest source of long tasks.
// ─────────────────────────────────────────────────────────────────────────────

export interface RevealProps {
  children:   React.ReactNode;
  variant?:   MotionVariant;
  delay?:     number;
  className?: string;
}

export function Reveal({
  children,
  variant   = "fadeUp",
  delay     = 0,
  className,
}: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // "reveal-ready" triggers the CSS hidden state (avoids SSR flash)
    el.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.setAttribute("data-visible", "1");
        observer.disconnect();
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={variant}
      className={cn(className)}
      style={delay > 0 ? ({ "--reveal-delay": `${delay}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
