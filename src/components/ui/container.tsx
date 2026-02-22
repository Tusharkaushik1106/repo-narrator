import * as React from "react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Container
// ─────────────────────────────────────────────

export type ContainerSize =
  | "xs"    // max-w-xl  — narrow content, forms
  | "sm"    // max-w-2xl — article body
  | "md"    // max-w-4xl — standard content
  | "lg"    // max-w-6xl — medium layout
  | "xl"    // max-w-7xl — wide layout (dashboards)
  | "full"; // no max-w  — full bleed

const containerSizes: Record<ContainerSize, string> = {
  xs:   "max-w-xl",
  sm:   "max-w-2xl",
  md:   "max-w-4xl",
  lg:   "max-w-6xl",
  xl:   "max-w-7xl",
  full: "max-w-none",
};

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  /** Remove horizontal padding */
  noPadding?: boolean;
  /** Center content */
  centered?: boolean;
}

export function Container({
  size      = "xl",
  noPadding = false,
  centered  = true,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full",
        centered && "mx-auto",
        containerSizes[size],
        !noPadding && "px-4 sm:px-6 lg:px-8",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// Section — full-width section with vertical spacing
// ─────────────────────────────────────────────

export type SectionSpacing = "sm" | "md" | "lg" | "xl";

const sectionSpacings: Record<SectionSpacing, string> = {
  sm: "py-12 md:py-16",
  md: "py-16 md:py-24",
  lg: "py-20 md:py-32",
  xl: "py-24 md:py-40",
};

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?:  SectionSpacing;
  /** Adds decorative ambient gradient blobs in the background */
  withBlobs?: boolean;
  as?: React.ElementType;
}

export function Section({
  spacing   = "md",
  withBlobs = false,
  as: Tag   = "section",
  className,
  children,
  ...props
}: SectionProps) {
  const TagEl = Tag as React.ComponentType<React.PropsWithChildren<{ className?: string; id?: string }>>;
  return (
    <TagEl
      className={cn(
        "relative",
        sectionSpacings[spacing],
        className,
      )}
      {...props}
    >
      {withBlobs && (
        <>
          {/* Blob 1 — top right */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full blur-3xl opacity-60"
            style={{ background: "radial-gradient(circle, rgba(192,57,43,0.18), transparent 70%)" }}
          />
          {/* Blob 2 — bottom left, pulsing */}
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full blur-3xl opacity-50 animate-pulse"
            style={{ background: "radial-gradient(circle, rgba(212,175,55,0.12), transparent 70%)" }}
          />
        </>
      )}
      {children}
    </TagEl>
  );
}

// ─────────────────────────────────────────────
// Stack — vertical flex container with gap
// ─────────────────────────────────────────────

export type StackGap = "xs" | "sm" | "md" | "lg" | "xl";

const stackGaps: Record<StackGap, string> = {
  xs: "gap-2",
  sm: "gap-4",
  md: "gap-6",
  lg: "gap-8",
  xl: "gap-12",
};

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?:    StackGap;
  /** horizontal instead of vertical */
  row?:    boolean;
  /** align-items */
  align?:  "start" | "center" | "end" | "stretch";
  /** justify-content */
  justify?: "start" | "center" | "end" | "between" | "around";
}

const alignMap = {
  start: "items-start", center: "items-center", end: "items-end", stretch: "items-stretch",
};
const justifyMap = {
  start: "justify-start", center: "justify-center", end: "justify-end",
  between: "justify-between", around: "justify-around",
};

export function Stack({
  gap     = "md",
  row     = false,
  align   = "start",
  justify = "start",
  className,
  children,
  ...props
}: StackProps) {
  return (
    <div
      className={cn(
        "flex",
        row ? "flex-row flex-wrap" : "flex-col",
        stackGaps[gap],
        alignMap[align],
        justifyMap[justify],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// Grid — responsive auto-column grid
// ─────────────────────────────────────────────

export type GridCols = 1 | 2 | 3 | 4 | 12;

const gridColsMap: Record<GridCols, string> = {
  1:  "grid-cols-1",
  2:  "grid-cols-1 md:grid-cols-2",
  3:  "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4:  "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  12: "grid-cols-12",
};

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: GridCols;
  gap?:  StackGap;
}

export function Grid({ cols = 2, gap = "md", className, children, ...props }: GridProps) {
  return (
    <div
      className={cn("grid", gridColsMap[cols], stackGaps[gap], className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// PageHeader — full-width hero-style page header
// ─────────────────────────────────────────────

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  eyebrow?:  React.ReactNode;
  title?:    React.ReactNode;
  subtitle?: React.ReactNode;
  actions?:  React.ReactNode;
}

export function PageHeader({ eyebrow, title, subtitle, actions, className, ...props }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)} {...props}>
      <div className="space-y-2">
        {eyebrow && (
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-tomato-jam/80">
            {eyebrow}
          </p>
        )}
        {title && (
          <h1 className="font-shrikhand text-3xl text-fg sm:text-4xl">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="text-sm text-fg/55 max-w-xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="shrink-0 flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
