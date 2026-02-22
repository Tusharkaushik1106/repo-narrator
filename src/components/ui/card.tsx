import * as React from "react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type CardVariant =
  | "default"   // dark glass — primary card
  | "muted"     // darker, less prominent
  | "accent"    // tomato-jam tinted border + bg
  | "gold"      // metallic-gold tinted
  | "cta"       // full tomato-jam fill
  | "flat";     // no border, no glass — plain surface

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:  CardVariant;
  /** Add animated noise texture overlay */
  noise?:    boolean;
  /** Add left-border accent bar */
  accentBar?: boolean;
  /** Remove inner padding (use when nesting CardBody manually) */
  noPadding?: boolean;
}

// ─────────────────────────────────────────────
// Variant map
// ─────────────────────────────────────────────

const variantClasses: Record<CardVariant, string> = {
  default: [
    "bg-[var(--surface-gradient)]",
    "border border-fg/10",
    "backdrop-blur-md",
    "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
    // spec §6.5: hover:-translate-y-2, shadow-[0_20px_50px_rgba(0,0,0,0.3)]
    // hover:border handled by gf-transition; lift handled by gf-hover-lift
    "hover:border-fg/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
    "gf-transition gf-hover-lift",
  ].join(" "),

  muted: [
    "bg-canvas/60",
    "border border-fg/8",
    "backdrop-blur-sm",
  ].join(" "),

  accent: [
    "bg-tomato-jam/5",
    "border border-tomato-jam/20",
    "backdrop-blur-sm",
    "hover:bg-tomato-jam/8 hover:border-tomato-jam/30",
    "gf-transition gf-hover-lift",
  ].join(" "),

  gold: [
    "bg-metallic-gold/5",
    "border border-metallic-gold/20",
    "backdrop-blur-sm",
    "hover:bg-metallic-gold/8 hover:border-metallic-gold/30",
    "gf-transition gf-hover-lift",
  ].join(" "),

  cta: [
    "bg-tomato-jam",
    "shadow-[0_0_40px_rgba(192,57,43,0.35)]",
  ].join(" "),

  flat: [
    "bg-canvas/40",
  ].join(" "),
};

// ─────────────────────────────────────────────
// Card (root)
// ─────────────────────────────────────────────

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  function Card(
    { variant = "default", noise = false, accentBar = false, noPadding = false, className, children, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-3xl",
          variantClasses[variant],
          !noPadding && "p-6",
          className,
        )}
        {...props}
      >
        {/* Noise overlay */}
        {noise && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              backgroundImage: "url('/noise.svg')",
              opacity: variant === "cta" ? 0.15 : 0.04,
            }}
          />
        )}

        {/* Left accent bar */}
        {accentBar && (
          <span
            aria-hidden
            className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-tomato-jam/70"
          />
        )}

        {/* Decorative corner gradients on default variant */}
        {variant === "default" && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 0% 0%, rgba(192,57,43,0.06), transparent 55%), radial-gradient(circle at 100% 100%, rgba(212,175,55,0.06), transparent 55%)",
            }}
          />
        )}

        <div className="relative z-10">{children}</div>
      </div>
    );
  },
);

Card.displayName = "Card";

// ─────────────────────────────────────────────
// Card sub-components
// ─────────────────────────────────────────────

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?:    React.ReactNode;
  subtitle?: React.ReactNode;
  icon?:     React.ReactNode;
  actions?:  React.ReactNode;
}

export function CardHeader({ title, subtitle, icon, actions, className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn("mb-4 flex items-start justify-between gap-3", className)} {...props}>
      <div className="flex items-center gap-2.5 min-w-0">
        {icon && (
          <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-xl bg-tomato-jam/10 ring-1 ring-tomato-jam/20 text-tomato-jam">
            {icon}
          </div>
        )}
        {(title || subtitle) && (
          <div className="min-w-0">
            {title && (
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-fg/40 mb-0.5">
                {title}
              </p>
            )}
            {subtitle && (
              <p className="text-sm font-semibold text-fg leading-tight">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
      {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function CardBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("relative z-10", className)} {...props}>
      {children}
    </div>
  );
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Adds a top-border separator */
  bordered?: boolean;
}

export function CardFooter({ bordered = false, className, children, ...props }: CardFooterProps) {
  return (
    <div
      className={cn(
        "mt-4 flex items-center justify-between gap-3",
        bordered && "border-t border-fg/10 pt-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// Badge / Pill (lives here because it's card-adjacent)
// ─────────────────────────────────────────────

export type BadgeVariant = "default" | "accent" | "gold" | "neutral" | "success" | "danger";

const badgeVariants: Record<BadgeVariant, string> = {
  default:  "bg-tomato-jam/10 border-tomato-jam/30 text-tomato-jam",
  accent:   "bg-tomato-jam/15 border-tomato-jam/40 text-tomato-jam",
  gold:     "bg-metallic-gold/10 border-metallic-gold/30 text-metallic-gold",
  neutral:  "bg-fg/8 border-fg/20 text-fg/70",
  success:  "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  danger:   "bg-tomato-jam/15 border-tomato-jam/50 text-tomato-jam",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?:     boolean;
}

export function Badge({ variant = "default", dot = false, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5",
        "text-[11px] font-medium tracking-wide uppercase",
        badgeVariants[variant],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className="h-1.5 w-1.5 rounded-full bg-current animate-pulse shrink-0"
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}
