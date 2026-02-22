import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SectionEnv } from "./_SectionEnv";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import type { SectionEnvProps } from "./_SectionEnv";
import type { SectionSpacing } from "@/components/sections/DarkSection";
import type { FeatureItem } from "@/data/landing";

// ─────────────────────────────────────────────────────────────────────────────
// FeatureGrid block
//
// Generic grid of feature / pain-point / persona / step cards.
// Supports three visual variants detected from item shape:
//
//   "card"   — default: icon + title + body + optional CTA link
//   "persona"— when item.eyebrow is present: adds sub-label above title
//   "step"   — when item.step is present: numbered bubble + mono detail tag
//
// No hardcoded text — all content is passed as props.
// ─────────────────────────────────────────────────────────────────────────────

export interface FeatureGridProps {
  eyebrow?:     string;
  headline:     React.ReactNode;
  subheadline?: string;
  /** Array of feature/step/persona items */
  items:        FeatureItem[];
  /** Grid column count — default: 3 */
  columns?:     2 | 3 | 4;
  /** Italic footnote rendered below the grid */
  footnote?:    string;
  environment?: SectionEnvProps["environment"];
  spacing?:     SectionSpacing;
  id?:          string;
}

const COLUMN_CLASSES: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function FeatureGrid({
  eyebrow,
  headline,
  subheadline,
  items,
  columns = 3,
  footnote,
  environment = "dark",
  spacing = "lg",
  id,
}: FeatureGridProps) {
  const isStepVariant    = items.some((i) => i.step !== undefined);
  const isPersonaVariant = items.some((i) => i.eyebrow !== undefined);

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

      {/* Grid */}
      <Stagger
        className={cn(
          "relative grid gap-5",
          COLUMN_CLASSES[columns] ?? COLUMN_CLASSES[3],
        )}
        stagger="sm"
      >
        {/* Connecting line for step variant (desktop) — not animated */}
        {isStepVariant && (
          <div
            aria-hidden
            className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-tomato-jam/20 via-metallic-gold/20 to-tomato-jam/20 md:block"
          />
        )}

        {items.map((item, idx) => (
          <StaggerItem key={item.title}>
            <FeatureCard
              item={item}
              isStep={isStepVariant}
              isPersona={isPersonaVariant}
              idx={idx}
            />
          </StaggerItem>
        ))}
      </Stagger>

      {/* Footnote */}
      {footnote && (
        <div className="mt-12 text-center">
          <p className="text-sm text-fg/35 italic">{footnote}</p>
        </div>
      )}
    </SectionEnv>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal card renderers
// ─────────────────────────────────────────────────────────────────────────────

function FeatureCard({
  item,
  isStep,
  isPersona,
  idx,
}: {
  item:      FeatureItem;
  isStep:    boolean;
  isPersona: boolean;
  idx:       number;
}) {
  const { icon: Icon, title, body, iconBg, iconColor, borderClass, eyebrow, cta, step, detail } = item;

  if (isStep) {
    return (
      <div className="relative flex flex-col items-center text-center">
        {/* Numbered icon bubble */}
        <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-full border-2 border-tomato-jam/30 bg-canvas shadow-md shadow-tomato-jam/10">
          <Icon className={cn("h-5 w-5", iconColor ?? "text-tomato-jam/80")} />
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-tomato-jam text-[9px] font-bold text-white">
            {idx + 1}
          </span>
        </div>
        <h3 className="mb-2.5 text-base font-semibold text-fg">{title}</h3>
        <p className="mb-4 text-sm text-fg/55 leading-relaxed">{body}</p>
        {detail && (
          <div className="rounded-lg bg-fg/5 border border-fg/10 px-3 py-1.5">
            <span className="text-[10px] font-mono text-fg/40">{detail}</span>
          </div>
        )}
      </div>
    );
  }

  if (isPersona) {
    return (
      <div
        className={cn(
          "gf-card group flex flex-col rounded-2xl border p-6 gf-transition",
          borderClass ?? "border-fg/10 hover:border-fg/25",
        )}
      >
        <div className={cn("mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl", iconBg ?? "bg-fg/8")}>
          <Icon className={cn("h-5 w-5", iconColor ?? "text-fg/60")} />
        </div>
        {eyebrow && (
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-fg/40">
            {eyebrow}
          </p>
        )}
        <h3 className="mb-3 text-base font-semibold text-fg leading-snug">{title}</h3>
        <p className="flex-1 text-sm text-fg/55 leading-relaxed">{body}</p>
        {cta && (
          <Link
            href={cta.href}
            className="mt-6 text-xs font-semibold text-tomato-jam/80 gf-transition hover:text-tomato-jam group-hover:underline underline-offset-2"
          >
            {cta.label}
          </Link>
        )}
      </div>
    );
  }

  // Default card variant
  return (
    <div
      className={cn(
        "gf-card rounded-2xl p-6 border",
        borderClass ?? "border-fg/10",
      )}
    >
      <div className={cn("mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl", iconBg ?? "bg-fg/8")}>
        <Icon className={cn("h-5 w-5", iconColor ?? "text-fg/60")} />
      </div>
      <h3 className="mb-2 text-sm font-semibold text-fg">{title}</h3>
      <p className="text-sm text-fg/50 leading-relaxed">{body}</p>
      {cta && (
        <Link
          href={cta.href}
          className="mt-4 inline-block text-xs font-semibold text-tomato-jam/80 gf-transition hover:text-tomato-jam"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
