import * as React from "react";
import { Quote } from "lucide-react";
import { SectionEnv } from "./_SectionEnv";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { SectionEnvProps } from "./_SectionEnv";
import type { SectionSpacing } from "@/components/sections/DarkSection";
import type { TestimonialItem } from "@/data/landing";

// ─────────────────────────────────────────────────────────────────────────────
// TestimonialSection block
//
// Grid of testimonial quotes with author attribution.
// Renders 1–4 items in a responsive grid.
//
// No hardcoded text — all content is passed as props.
// ─────────────────────────────────────────────────────────────────────────────

export interface TestimonialSectionProps {
  eyebrow?:     string;
  headline:     React.ReactNode;
  subheadline?: string;
  items:        TestimonialItem[];
  environment?: SectionEnvProps["environment"];
  spacing?:     SectionSpacing;
  id?:          string;
}

export function TestimonialSection({
  eyebrow,
  headline,
  subheadline,
  items,
  environment = "dark",
  spacing     = "lg",
  id,
}: TestimonialSectionProps) {
  return (
    <SectionEnv environment={environment} spacing={spacing} id={id}>
      {/* Header */}
      <Reveal className="mb-12 text-center">
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-tomato-jam/80">
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          {headline}
        </h2>
        {subheadline && (
          <p className="mx-auto mt-4 max-w-lg text-sm text-fg/55 leading-relaxed">
            {subheadline}
          </p>
        )}
      </Reveal>

      {/* Testimonial grid */}
      <Stagger
        className={[
          "grid gap-5",
          items.length === 1 ? "max-w-xl mx-auto" : "",
          items.length === 2 ? "sm:grid-cols-2"   : "",
          items.length >= 3  ? "sm:grid-cols-3"   : "",
        ].join(" ")}
        stagger="md"
      >
        {items.map(({ quote, author, role, company }) => (
          <StaggerItem key={author} variant="fadeScale">
            <div className="gf-card flex flex-col gap-4 rounded-2xl border border-fg/8 p-6">
              <Quote className="h-5 w-5 text-tomato-jam/40 shrink-0" />
              <p className="flex-1 text-sm text-fg/70 leading-relaxed italic">
                &ldquo;{quote}&rdquo;
              </p>
              <div className="border-t border-fg/8 pt-4">
                <p className="text-sm font-semibold text-fg">{author}</p>
                <p className="text-xs text-fg/45">
                  {role}{company ? ` · ${company}` : ""}
                </p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </SectionEnv>
  );
}
