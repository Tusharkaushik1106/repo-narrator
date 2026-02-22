"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { MotionVariant } from "@/lib/motion";

// ─────────────────────────────────────────────────────────────────────────────
// Stagger + StaggerItem — viewport-triggered staggered entrance
//
// Replaced framer-motion with pure CSS @keyframes + IntersectionObserver +
// direct DOM manipulation (no React state updates during scroll).
//
// When Stagger enters the viewport:
//   1. IntersectionObserver fires once
//   2. Directly iterates [data-stagger-item] children via querySelectorAll
//   3. Sets CSS custom property --reveal-delay on each item (i * interval ms)
//   4. Adds data-visible attribute — CSS keyframe picks it up on compositor
// ─────────────────────────────────────────────────────────────────────────────

const STAGGER_MS = { xs: 30, sm: 50, md: 80 } as const;

export interface StaggerProps {
  children:   React.ReactNode;
  stagger?:   keyof typeof STAGGER_MS;
  className?: string;
}

export interface StaggerItemProps {
  children:   React.ReactNode;
  variant?:   MotionVariant;
  className?: string;
}

/** Container — owns viewport detection and stagger timing. */
export function Stagger({ children, stagger = "sm", className }: StaggerProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const intervalMs = STAGGER_MS[stagger];

    // Mark all items as ready for CSS reveal (hidden state)
    const items = el.querySelectorAll("[data-stagger-item]");
    if (!reduced) {
      items.forEach((item) => item.classList.add("reveal-ready"));
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        if (reduced) return;

        // Direct DOM mutation — no React re-render, no framer-motion, no JS animation loop
        items.forEach((item, i) => {
          const el = item as HTMLElement;
          el.style.setProperty("--reveal-delay", `${i * intervalMs}ms`);
          el.setAttribute("data-visible", "1");
        });
      },
      { threshold: 0.08 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Animated child inside a Stagger container. */
export function StaggerItem({ children, variant = "fadeUp", className }: StaggerItemProps) {
  return (
    <div data-stagger-item data-reveal={variant} className={cn(className)}>
      {children}
    </div>
  );
}
