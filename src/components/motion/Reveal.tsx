"use client";

import * as React from "react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useMotionPreference } from "@/hooks/useMotionPreference";
import { DURATION, EASE, THRESHOLD, variants } from "@/lib/motion";
import type { MotionVariant } from "@/lib/motion";

// ─────────────────────────────────────────────────────────────────────────────
// Reveal — scroll-triggered entrance for a single element
//
// Wraps children in a motion.div that animates when the element enters
// the viewport. Respects prefers-reduced-motion.
//
// @example
//   <Reveal>
//     <h2>Section headline</h2>
//   </Reveal>
//
//   <Reveal variant="slideLeft" delay={0.1}>
//     <p>Left column copy</p>
//   </Reveal>
// ─────────────────────────────────────────────────────────────────────────────

export interface RevealProps {
  children:   React.ReactNode;
  /** Animation variant — defaults to "fadeUp" */
  variant?:   MotionVariant;
  /** Extra delay in seconds before the animation starts */
  delay?:     number;
  className?: string;
}

export function Reveal({
  children,
  variant   = "fadeUp",
  delay     = 0,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isReduced } = useMotionPreference();
  const inView = useInView(ref, { once: true, amount: THRESHOLD.reveal });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isReduced ? "visible" : (inView ? "visible" : "hidden")}
      variants={variants[variant]}
      transition={
        isReduced
          ? { duration: 0 }
          : { duration: DURATION.reveal, ease: EASE.enter, delay }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
