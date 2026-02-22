"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useMotionPreference } from "@/hooks/useMotionPreference";
import { DURATION, EASE } from "@/lib/motion";
import { SectionEnv } from "./_SectionEnv";
import type { SectionEnvProps } from "./_SectionEnv";
import type { SectionSpacing, SectionTag } from "@/components/sections/DarkSection";

// ─────────────────────────────────────────────────────────────────────────────
// HeroSection block
//
// Full-viewport hero layout with optional two-column split.
// Left: eyebrow + headline + subheadline + form slot.
// Right: optional rightPanel slot (preview card, screenshot, etc.)
//
// No hardcoded text — all content is passed as props.
// ─────────────────────────────────────────────────────────────────────────────

export interface HeroSectionProps {
  /** Small eyebrow label above the headline */
  eyebrow?:       React.ReactNode;
  /** Primary headline — accepts ReactNode for gradient spans */
  headline:       React.ReactNode;
  /** Subtitle paragraph below the headline */
  subheadline:    React.ReactNode;
  /** Form slot — RepoAnalyzeForm or any custom form */
  form?:          React.ReactNode;
  /** Right-column slot — preview card, product screenshot, etc. */
  rightPanel?:    React.ReactNode;
  /**
   * Background slot — rendered as absolute inset-0 behind the section content.
   * When provided, the section's own CSS background is made transparent so the
   * slot renders through unobstructed.
   */
  backgroundSlot?: React.ReactNode;
  /** Section environment — controls color palette */
  environment?:   SectionEnvProps["environment"];
  spacing?:       SectionSpacing;
  as?:            SectionTag;
}

export function HeroSection({
  eyebrow,
  headline,
  subheadline,
  form,
  rightPanel,
  backgroundSlot,
  environment = "dark",
  spacing,
  as = "main",
}: HeroSectionProps) {
  const hasRightPanel = Boolean(rightPanel);
  const { isReduced } = useMotionPreference();

  return (
    <SectionEnv
      environment={environment}
      spacing={spacing ?? "none"}
      as={as}
      fullBleed
      // When a background slot is provided, override the section's inline
      // `background: var(--bg-radial)` via the {...props} spread on the
      // underlying section tag — revealing the slot behind it.
      style={backgroundSlot ? { background: "transparent" } : undefined}
    >
      {/* Background slot — sits at z-0, below the z-10 content layer */}
      {backgroundSlot && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
          {backgroundSlot}
        </div>
      )}

      <div className="relative z-10 flex min-h-dvh items-center px-4 pt-16 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div
            className={[
              "grid gap-12 items-center",
              hasRightPanel
                ? "lg:grid-cols-[1fr_420px] lg:gap-16"
                : "max-w-2xl",
            ].join(" ")}
          >
            {/* ── Left: copy + form ──────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={isReduced ? { duration: 0 } : { duration: DURATION.reveal, ease: EASE.enter }}
            >
              {eyebrow && (
                <div className="mb-5">{eyebrow}</div>
              )}

              <div className="text-balance text-4xl font-semibold tracking-tight text-fg sm:text-5xl lg:text-[3.5rem] lg:leading-[1.2]">
                {headline}
              </div>

              <div className="mt-5 max-w-xl text-balance text-sm leading-relaxed text-fg/60 sm:text-base">
                {subheadline}
              </div>

              {form && (
                <div className="mt-8 max-w-xl">{form}</div>
              )}
            </motion.div>

            {/* ── Right: panel slot ──────────────────────────────── */}
            {hasRightPanel && (
              <motion.div
                initial={{ opacity: 0, x: 28, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={isReduced ? { duration: 0 } : { delay: 0.18, duration: DURATION.reveal, ease: EASE.enter }}
                className="hidden lg:block"
              >
                {rightPanel}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </SectionEnv>
  );
}
