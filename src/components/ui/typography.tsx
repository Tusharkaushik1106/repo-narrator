import * as React from "react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────

type PolymorphicRef<C extends React.ElementType> = React.ComponentPropsWithRef<C>["ref"];

type PolymorphicProps<C extends React.ElementType, P = object> = P &
  Omit<React.ComponentPropsWithoutRef<C>, keyof P> & { as?: C };

// ─────────────────────────────────────────────
// Heading — H1 through H4
// ─────────────────────────────────────────────

type HeadingLevel = "h1" | "h2" | "h3" | "h4";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Which HTML heading tag to render */
  as?: HeadingLevel;
  /** Visual size override (defaults to match `as`) */
  size?: HeadingLevel;
  /** Use Shrikhand display font (default: true for h1/h2, false for h3/h4) */
  display?: boolean;
  /** Gradient text — applies tomato-jam → almond-cream */
  gradient?: boolean;
  /** Gold gradient variant */
  gradientGold?: boolean;
  /** Muted / secondary colour */
  muted?: boolean;
}

const headingSizes: Record<HeadingLevel, string> = {
  h1: "text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-tight",
  h2: "text-3xl sm:text-4xl leading-tight tracking-tight",
  h3: "text-xl sm:text-2xl leading-snug",
  h4: "text-base sm:text-lg leading-snug font-semibold",
};

export function Heading({
  as: Tag = "h2",
  size,
  display,
  gradient     = false,
  gradientGold = false,
  muted        = false,
  className,
  children,
  ...props
}: HeadingProps) {
  // Default to display font for h1/h2
  const useDisplay = display ?? (Tag === "h1" || Tag === "h2" || size === "h1" || size === "h2");
  const sizeKey = size ?? Tag;

  return (
    <Tag
      className={cn(
        headingSizes[sizeKey],
        // Font
        useDisplay ? "font-shrikhand font-normal" : "font-sans font-semibold",
        // Colour
        gradient
          ? "bg-gradient-to-r from-tomato-jam via-[#e84832] to-fg bg-clip-text text-transparent"
          : gradientGold
          ? "bg-gradient-to-r from-metallic-gold via-[#e8c84a] to-fg bg-clip-text text-transparent"
          : muted
          ? "text-fg/60"
          : "text-fg",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

// ─────────────────────────────────────────────
// Paragraph / Body
// ─────────────────────────────────────────────

export type BodySize = "xs" | "sm" | "base" | "lg" | "xl";

const bodySizes: Record<BodySize, string> = {
  xs:   "text-xs  leading-relaxed",
  sm:   "text-sm  leading-relaxed",
  base: "text-base leading-relaxed",
  lg:   "text-lg  leading-relaxed",
  xl:   "text-xl  leading-relaxed",
};

export interface BodyProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?:  BodySize;
  muted?: boolean;
  /** Full opacity primary text */
  strong?: boolean;
}

export function Body({ size = "base", muted = false, strong = false, className, ...props }: BodyProps) {
  return (
    <p
      className={cn(
        bodySizes[size],
        "font-sans",
        strong ? "text-fg font-medium" : muted ? "text-fg/40" : "text-fg/70",
        className,
      )}
      {...props}
    />
  );
}

// ─────────────────────────────────────────────
// Lead — large intro paragraph
// ─────────────────────────────────────────────

export function Lead({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-lg sm:text-xl leading-relaxed text-fg/65 font-sans", className)}
      {...props}
    />
  );
}

// ─────────────────────────────────────────────
// Label — form labels, eyebrow text
// ─────────────────────────────────────────────

export type LabelVariant = "default" | "accent" | "gold" | "muted";

const labelVariants: Record<LabelVariant, string> = {
  default: "text-fg/50",
  accent:  "text-tomato-jam",
  gold:    "text-metallic-gold",
  muted:   "text-fg/30",
};

export interface LabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:  LabelVariant;
  /** Render as a <label> HTML element */
  htmlFor?:  string;
}

export function Label({ variant = "default", htmlFor, className, children, ...props }: LabelProps) {
  const Tag = htmlFor ? "label" : "span";

  return (
    <Tag
      {...(htmlFor ? { htmlFor } : {})}
      className={cn(
        "block text-xs font-medium uppercase tracking-[0.15em]",
        labelVariants[variant],
        "select-none",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

// ─────────────────────────────────────────────
// Eyebrow — section intro chip above headings
// ─────────────────────────────────────────────

export function Eyebrow({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full",
        "border border-tomato-jam/25 bg-tomato-jam/8",
        "px-3.5 py-1",
        "text-[11px] font-semibold uppercase tracking-[0.18em] text-tomato-jam/90",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────
// Code / Mono
// ─────────────────────────────────────────────

export function InlineCode({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        "rounded-md border border-fg/10 bg-canvas/70",
        "px-1.5 py-0.5",
        "font-mono text-[0.85em] text-tomato-jam/90",
        className,
      )}
      {...props}
    />
  );
}

export function CodeBlock({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-2xl border border-fg/10 bg-canvas",
        "p-4 text-sm font-mono text-fg/80",
        "scrollbar-thin",
        className,
      )}
      {...props}
    />
  );
}

// ─────────────────────────────────────────────
// Divider — with optional label
// ─────────────────────────────────────────────

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
}

export function Divider({ label, className, ...props }: DividerProps) {
  if (!label) {
    return (
      <div
        className={cn("my-6 flex items-center gap-3", className)}
        {...props}
      >
        <div className="h-px flex-1 bg-fg/10" />
        <div className="h-1.5 w-1.5 rounded-full bg-fg/10" />
        <div className="h-1.5 w-1.5 rounded-full bg-fg/15" />
        <div className="h-1.5 w-1.5 rounded-full bg-fg/10" />
        <div className="h-px flex-1 bg-fg/10" />
      </div>
    );
  }

  return (
    <div className={cn("my-6 flex items-center gap-4", className)} {...props}>
      <div className="h-px flex-1 bg-fg/10" />
      <span className="shrink-0 text-xs font-medium uppercase tracking-widest text-fg/30">
        {label}
      </span>
      <div className="h-px flex-1 bg-fg/10" />
    </div>
  );
}

// ─────────────────────────────────────────────
// Blockquote
// ─────────────────────────────────────────────

export function Blockquote({ className, ...props }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={cn(
        "my-6 rounded-r-2xl border-l-4 border-tomato-jam/60",
        "bg-tomato-jam/6 px-5 py-4",
        "italic text-fg/70 text-sm leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}
