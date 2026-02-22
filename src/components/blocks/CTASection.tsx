import * as React from "react";
import Link from "next/link";
import { SectionEnv } from "./_SectionEnv";
import { Reveal } from "@/components/motion/Reveal";
import type { SectionEnvProps } from "./_SectionEnv";
import type { SectionSpacing } from "@/components/sections/DarkSection";

// ─────────────────────────────────────────────────────────────────────────────
// CTASection block
//
// Centred conversion section with optional form slot or fallback CTA button.
// Use `form` prop for the primary form (e.g. RepoAnalyzeForm).
// Use `primaryCTA` as a simple href button when no form is provided.
//
// No hardcoded text — all content is passed as props.
// ─────────────────────────────────────────────────────────────────────────────

export interface CTASectionProps {
  /** Small eyebrow badge above the headline — accepts ReactNode for icons */
  eyebrow?:     React.ReactNode;
  /** Icon rendered inside the eyebrow badge */
  eyebrowIcon?: React.ComponentType<{ className?: string }>;
  /** Primary headline — accepts ReactNode for gradient spans */
  headline:     React.ReactNode;
  subheadline?: string;
  /** Primary conversion slot — RepoAnalyzeForm or any form */
  form?:        React.ReactNode;
  /** Fallback CTA button shown when `form` is not provided */
  primaryCTA?:  { label: string; href: string };
  environment?: SectionEnvProps["environment"];
  spacing?:     SectionSpacing;
  id?:          string;
}

export function CTASection({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  headline,
  subheadline,
  form,
  primaryCTA,
  environment = "dark",
  spacing     = "lg",
  id,
}: CTASectionProps) {
  return (
    <SectionEnv environment={environment} spacing={spacing} id={id}>
      <Reveal className="mx-auto max-w-2xl text-center">

        {/* Eyebrow badge */}
        {(eyebrow || EyebrowIcon) && (
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-tomato-jam/25 bg-tomato-jam/8 px-4 py-1.5">
            {EyebrowIcon && <EyebrowIcon className="h-3.5 w-3.5 text-tomato-jam/80" />}
            {eyebrow && (
              <span className="text-xs font-semibold text-tomato-jam/80">{eyebrow}</span>
            )}
          </div>
        )}

        {/* Headline */}
        <div className="mb-4 text-3xl font-semibold tracking-tight text-fg sm:text-4xl lg:text-5xl">
          {headline}
        </div>

        {/* Subheadline */}
        {subheadline && (
          <p className="mb-10 text-sm text-fg/50 leading-relaxed">
            {subheadline}
          </p>
        )}

        {/* Form slot */}
        {form && (
          <div className={subheadline ? "" : "mt-10"}>{form}</div>
        )}

        {/* Fallback CTA button */}
        {!form && primaryCTA && (
          <Link
            href={primaryCTA.href}
            className="inline-flex items-center gap-2 rounded-xl bg-tomato-jam px-6 py-3 text-sm font-semibold text-white shadow-md shadow-tomato-jam/25 gf-transition hover:bg-tomato-jam/85 hover:shadow-lg hover:shadow-tomato-jam/35"
          >
            {primaryCTA.label}
          </Link>
        )}

      </Reveal>
    </SectionEnv>
  );
}
