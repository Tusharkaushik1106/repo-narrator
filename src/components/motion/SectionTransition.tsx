"use client";

import * as React from "react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useMotionPreference } from "@/hooks/useMotionPreference";
import { DURATION, EASE, THRESHOLD, variants } from "@/lib/motion";

// ─────────────────────────────────────────────────────────────────────────────
// SectionTransition — barely-perceptible section-level entrance
//
// Applied automatically by _SectionEnv so every block gets a consistent
// section-level entrance without per-block changes.
//
// Uses the "sectionEnter" variant (y: 10, opacity: 0 → 1) — more conservative
// than element-level Reveal (y: 16) so the two animation layers don't compete.
//
// Fires at THRESHOLD.section (4%) so it triggers as soon as a sliver of
// the section enters the viewport.
// ─────────────────────────────────────────────────────────────────────────────

export interface SectionTransitionProps {
  children:   React.ReactNode;
  className?: string;
}

export function SectionTransition({ children, className }: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isReduced } = useMotionPreference();
  const inView = useInView(ref, { once: true, amount: THRESHOLD.section });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isReduced ? "visible" : (inView ? "visible" : "hidden")}
      variants={variants.sectionEnter}
      transition={
        isReduced
          ? { duration: 0 }
          : { duration: DURATION.section, ease: EASE.enter }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
