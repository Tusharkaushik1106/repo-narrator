/**
 * _SectionEnv — internal utility, NOT exported from blocks/index.ts
 *
 * Picks the correct section environment wrapper (Dark / Light / Neutral)
 * based on the `environment` prop. This avoids repeating the conditional
 * in every block component.
 */

import * as React from "react";
import { DarkSection }       from "@/components/sections/DarkSection";
import { LightSection }      from "@/components/sections/LightSection";
import { NeutralSection }    from "@/components/sections/NeutralSection";
import { SectionTransition } from "@/components/motion/SectionTransition";
import type { SectionSpacing, SectionTag } from "@/components/sections/DarkSection";

export type BlockEnvironment = "dark" | "light" | "neutral";

export interface SectionEnvProps {
  environment?: BlockEnvironment;
  spacing?:     SectionSpacing;
  as?:          SectionTag;
  atmosphere?:  boolean;
  fullBleed?:   boolean;
  id?:          string;
  className?:   string;
  /** Passed through to the section tag via {...props} — use to override inline styles */
  style?:       React.CSSProperties;
  children:     React.ReactNode;
}

export function SectionEnv({
  environment = "dark",
  spacing,
  as,
  atmosphere,
  fullBleed,
  id,
  className,
  style,
  children,
}: SectionEnvProps) {
  const shared = { spacing, as, atmosphere, fullBleed, id, className, style };

  const inner = <SectionTransition>{children}</SectionTransition>;

  if (environment === "light") {
    return <LightSection {...shared}>{inner}</LightSection>;
  }
  if (environment === "neutral") {
    return <NeutralSection {...shared}>{inner}</NeutralSection>;
  }
  return <DarkSection {...shared}>{inner}</DarkSection>;
}
