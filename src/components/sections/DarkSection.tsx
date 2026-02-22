import * as React from "react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Shared types
// ─────────────────────────────────────────────────────────────────────────────

export type SectionSpacing = "none" | "sm" | "md" | "lg" | "xl";
export type SectionTag     = "section" | "div" | "article" | "main" | "aside";

const spacings: Record<SectionSpacing, string> = {
  none: "",
  sm:   "py-12 md:py-16",
  md:   "py-16 md:py-24",
  lg:   "py-20 md:py-32",
  xl:   "py-24 md:py-40",
};

// ─────────────────────────────────────────────────────────────────────────────
// DarkSection
//
// Sets data-section="dark" which triggers all CSS variable overrides in
// globals.css — canvas → near-black warm, fg → almond cream.
// Every child component using text-fg, bg-canvas, bg-[var(--surface-gradient)]
// etc. automatically renders in the dark cinematic palette.
//
// Includes:
//   • Deep radial gradient background (--bg-radial)
//   • Edge vignette (--vignette)
//   • Film grain noise tile (--noise-opacity)
//   • Optional ambient atmosphere blobs (atmosphere prop, default: true)
// ─────────────────────────────────────────────────────────────────────────────

export interface DarkSectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?:       SectionSpacing;
  as?:            SectionTag;
  /** Show soft brand-coloured atmosphere blobs (default: true) */
  atmosphere?:    boolean;
  /** Remove max-width container — children go full-bleed */
  fullBleed?:     boolean;
}

export function DarkSection({
  spacing     = "md",
  as: Tag     = "section",
  atmosphere  = true,
  fullBleed   = false,
  className,
  children,
  ...props
}: DarkSectionProps) {
  return (
    <Tag
      data-section="dark"
      className={cn(
        "relative overflow-hidden",
        spacings[spacing],
        className,
      )}
      style={{ background: "var(--bg-radial)" }}
      {...props}
    >
      {/* Vignette — edge darkening */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--vignette)" }}
      />

      {/* Film grain noise */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/noise.svg')] bg-repeat"
        style={{ opacity: "var(--noise-opacity)" }}
      />

      {/* Atmosphere blobs — brand tints at very low opacity */}
      {atmosphere && (
        <>
          {/* Top-right — tomato-jam warm */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -right-32 h-[28rem] w-[28rem] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(192,57,43,0.18) 0%, transparent 70%)",
              opacity: "var(--blob-opacity-1)",
              transform: "translateZ(0)",
            }}
          />
          {/* Bottom-left — metallic-gold counter */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-32 h-[24rem] w-[24rem] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(212,175,55,0.14) 0%, transparent 70%)",
              opacity: "var(--blob-opacity-2)",
              transform: "translateZ(0)",
            }}
          />
        </>
      )}

      {/* Content */}
      <div
        className={cn(
          "relative z-10",
          !fullBleed && "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
        )}
      >
        {children}
      </div>
    </Tag>
  );
}
