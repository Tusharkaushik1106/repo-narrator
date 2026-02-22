import * as React from "react";
import { SectionEnv } from "./_SectionEnv";
import { Reveal } from "@/components/motion/Reveal";
import type { SectionEnvProps } from "./_SectionEnv";
import type { SectionSpacing } from "@/components/sections/DarkSection";
import type { ProofStat, ProofLogo } from "@/data/landing";

// ─────────────────────────────────────────────────────────────────────────────
// ProofSection block
//
// Horizontal trust-signal strip: integration logos on the left,
// key stats on the right. Compact by default (spacing="sm").
//
// No hardcoded text — all content is passed as props.
// ─────────────────────────────────────────────────────────────────────────────

export interface ProofSectionProps {
  /** Label above the logos row — defaults to "Integrates with" */
  logosLabel?:  string;
  logos?:       ProofLogo[];
  stats?:       ProofStat[];
  environment?: SectionEnvProps["environment"];
  spacing?:     SectionSpacing;
  id?:          string;
}

export function ProofSection({
  logosLabel  = "Integrates with",
  logos       = [],
  stats       = [],
  environment = "neutral",
  spacing     = "sm",
  id,
}: ProofSectionProps) {
  const hasLogos = logos.length > 0;
  const hasStats = stats.length > 0;

  return (
    <SectionEnv environment={environment} spacing={spacing} id={id}>
      <Reveal variant="fade" className="flex flex-col items-center gap-8 md:flex-row md:justify-between md:gap-6">

        {/* Logos */}
        {hasLogos && (
          <div className="flex flex-col items-center gap-3 md:items-start">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-fg/35">
              {logosLabel}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {logos.map(({ name, abbr }) => (
                <div
                  key={name}
                  className="inline-flex items-center gap-2 rounded-xl border border-fg/10 bg-fg/5 px-3 py-1.5"
                  title={name}
                >
                  <span className="text-[10px] font-bold tracking-wider text-fg/40">{abbr}</span>
                  <span className="text-[11px] font-medium text-fg/60">{name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        {hasLogos && hasStats && (
          <div className="hidden h-12 w-px bg-fg/10 md:block" aria-hidden />
        )}

        {/* Stats */}
        {hasStats && (
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 md:justify-start">
            {stats.map(({ value, unit, label }) => (
              <div key={label} className="flex flex-col items-center gap-0.5 md:items-start">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-fg">{value}</span>
                  <span className="text-xs font-semibold text-tomato-jam/80">{unit}</span>
                </div>
                <span className="text-[11px] text-fg/45 text-center md:text-left">{label}</span>
              </div>
            ))}
          </div>
        )}

      </Reveal>
    </SectionEnv>
  );
}
