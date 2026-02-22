"use client";

import * as React from "react";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useMotionPreference } from "@/hooks/useMotionPreference";
import { DURATION, EASE, STAGGER, THRESHOLD, variants } from "@/lib/motion";
import type { MotionVariant } from "@/lib/motion";

// ─────────────────────────────────────────────────────────────────────────────
// Stagger + StaggerItem — viewport-triggered staggered entrance
//
// Stagger is the container: it owns the viewport trigger and stagger timing.
// StaggerItem wraps each animated child individually.
//
// Separate parent/child components allow non-animated siblings (e.g. the
// connecting gradient line in FeatureGrid) to live in the same container
// without being pulled into the stagger sequence.
//
// @example
//   <Stagger className="grid grid-cols-3 gap-5" stagger="sm">
//     {/* non-animated sibling — not a StaggerItem */}
//     <div aria-hidden className="absolute ..." />
//
//     {items.map(item => (
//       <StaggerItem key={item.title}>
//         <Card item={item} />
//       </StaggerItem>
//     ))}
//   </Stagger>
// ─────────────────────────────────────────────────────────────────────────────

export interface StaggerProps {
  children:   React.ReactNode;
  /** Interval between each child entrance — "xs" | "sm" | "md" */
  stagger?:   keyof typeof STAGGER;
  className?: string;
}

export interface StaggerItemProps {
  children:   React.ReactNode;
  /** Animation variant — defaults to "fadeUp" */
  variant?:   MotionVariant;
  className?: string;
}

const containerVariants = (interval: number) => ({
  hidden:  {},
  visible: {
    transition: { staggerChildren: interval },
  },
} as const);

/** Container — owns viewport detection and provides stagger timing. */
export function Stagger({ children, stagger = "sm", className }: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isReduced } = useMotionPreference();
  const inView = useInView(ref, { once: true, amount: THRESHOLD.stagger });

  return (
    <motion.div
      ref={ref}
      variants={containerVariants(isReduced ? 0 : STAGGER[stagger])}
      initial="hidden"
      animate={isReduced ? "visible" : (inView ? "visible" : "hidden")}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Animated child inside a Stagger container. */
export function StaggerItem({ children, variant = "fadeUp", className }: StaggerItemProps) {
  const { isReduced } = useMotionPreference();

  return (
    <motion.div
      variants={variants[variant]}
      transition={
        isReduced
          ? { duration: 0 }
          : { duration: DURATION.reveal, ease: EASE.enter }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
