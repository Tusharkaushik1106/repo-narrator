"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type ButtonVariant =
  | "primary"    // tomato-jam fill — main CTA
  | "secondary"  // almond-cream ghost
  | "ghost"      // no border, subtle hover
  | "outline"    // almond-cream border, transparent bg
  | "danger"     // deep red — destructive actions
  | "gold";      // metallic-gold — secondary accent

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  /** Disables framer-motion micro-interactions (useful inside forms) */
  noMotion?: boolean;
  children?: React.ReactNode;
}

// ─────────────────────────────────────────────
// Variant maps
// ─────────────────────────────────────────────

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    "bg-tomato-jam text-white",
    "shadow-[0_0_15px_rgba(192,57,43,0.35)]",
    "hover:brightness-110 hover:shadow-[0_0_25px_rgba(192,57,43,0.55)]",
    "disabled:bg-tomato-jam/40 disabled:shadow-none",
    "focus-visible:ring-tomato-jam/60",
  ].join(" "),

  secondary: [
    "bg-fg/10 text-fg",
    "border border-fg/20",
    "hover:bg-fg/20 hover:border-fg/40",
    "disabled:bg-fg/5 disabled:text-fg/30",
    "focus-visible:ring-fg/40",
  ].join(" "),

  ghost: [
    "bg-transparent text-fg/70",
    "hover:bg-fg/8 hover:text-fg",
    "disabled:text-fg/30",
    "focus-visible:ring-fg/30",
  ].join(" "),

  outline: [
    "bg-transparent text-fg",
    "border border-fg/20",
    "hover:border-fg/50 hover:bg-fg/5",
    "disabled:border-fg/10 disabled:text-fg/30",
    "focus-visible:ring-fg/40",
  ].join(" "),

  danger: [
    "bg-tomato-jam/80 text-white",
    "border border-tomato-jam/40",
    "hover:bg-tomato-jam hover:border-tomato-jam/60",
    "disabled:bg-tomato-jam/20 disabled:text-white/30",
    "focus-visible:ring-tomato-jam/50",
  ].join(" "),

  gold: [
    "bg-metallic-gold/10 text-metallic-gold",
    "border border-metallic-gold/30",
    "hover:bg-metallic-gold/20 hover:border-metallic-gold/50",
    "disabled:bg-metallic-gold/5 disabled:text-metallic-gold/30",
    "focus-visible:ring-metallic-gold/40",
  ].join(" "),
};

const sizeClasses: Record<ButtonSize, string> = {
  xs:  "h-7  px-3   text-xs   gap-1.5 rounded-xl",
  sm:  "h-8  px-4   text-xs   gap-2   rounded-xl",
  md:  "h-10 px-5   text-sm   gap-2   rounded-full",
  lg:  "h-12 px-7   text-base gap-2.5 rounded-full",
  xl:  "h-14 px-9   text-lg   gap-3   rounded-full",
};

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      noMotion = false,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) {
    const isDisabled = disabled || loading;

    const baseClasses = cn(
      // layout
      "relative inline-flex items-center justify-center font-medium",
      "select-none cursor-pointer",
      // shared transition (200ms, ease-standard — scale handled by framer-motion)
      "gf-transition",
      // focus — ring-offset simulates the ink-black background separation
      "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
      // disabled
      "disabled:pointer-events-none disabled:opacity-60",
      // full width
      fullWidth && "w-full",
      // variant + size
      variantClasses[variant],
      sizeClasses[size],
      className,
    );

    const motionProps = noMotion
      ? {}
      : {
          // spec §6.5: hover:scale-105  active:scale-95
          whileHover: isDisabled ? {} : { scale: 1.05 },
          whileTap:   isDisabled ? {} : { scale: 0.95 },
          // spec §6.4: cubic-bezier(0.4, 0, 0.2, 1) — ease-standard
          transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
        };

    return (
      <motion.button
        ref={ref}
        disabled={isDisabled}
        className={baseClasses}
        {...motionProps}
        {...props}
      >
        {/* Noise texture on primary only */}
        {variant === "primary" && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[0.07]"
            style={{ backgroundImage: "url('/noise.svg')" }}
          />
        )}

        {loading ? (
          <>
            <Loader2 className="animate-spin" style={{ width: "1em", height: "1em" }} />
            {loadingText && <span>{loadingText}</span>}
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children && <span>{children}</span>}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  },
);

Button.displayName = "Button";

// ─────────────────────────────────────────────
// Icon-only button convenience wrapper
// ─────────────────────────────────────────────

export interface IconButtonProps extends Omit<ButtonProps, "leftIcon" | "rightIcon" | "children"> {
  icon: React.ReactNode;
  "aria-label": string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ icon, size = "md", className, ...props }, ref) {
    const squareSizes: Record<ButtonSize, string> = {
      xs:  "h-7  w-7  rounded-xl",
      sm:  "h-8  w-8  rounded-xl",
      md:  "h-10 w-10 rounded-full",
      lg:  "h-12 w-12 rounded-full",
      xl:  "h-14 w-14 rounded-full",
    };

    return (
      <Button
        ref={ref}
        size={size}
        className={cn("p-0", squareSizes[size], className)}
        {...props}
      >
        {icon}
      </Button>
    );
  },
);

IconButton.displayName = "IconButton";
