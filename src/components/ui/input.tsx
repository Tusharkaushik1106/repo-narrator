"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type InputVariant = "default" | "error" | "success";
export type InputSize    = "sm" | "md" | "lg";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?:     InputVariant;
  inputSize?:   InputSize;
  label?:       string;
  hint?:        string;
  error?:       string;
  /** Node rendered inside the input on the left (icon, prefix symbol) */
  leftElement?: React.ReactNode;
  /** Node rendered inside the input on the right (icon, unit label) */
  rightElement?: React.ReactNode;
  /** Short text prefix outside the input box, e.g. "https://" */
  prefix?:      string;
  wrapperClassName?: string;
}

// ─────────────────────────────────────────────
// Variant / size maps
// ─────────────────────────────────────────────

const variantRing: Record<InputVariant, string> = {
  default: "border-fg/15 focus-within:border-tomato-jam/50 focus-within:ring-tomato-jam/20",
  error:   "border-tomato-jam/60  focus-within:border-tomato-jam     focus-within:ring-tomato-jam/30",
  success: "border-fg/40 focus-within:border-fg/60 focus-within:ring-fg/20",
};

const sizeMap: Record<InputSize, { wrapper: string; input: string; icon: string }> = {
  sm: { wrapper: "h-8",   input: "text-xs  px-3 py-1.5", icon: "h-3.5 w-3.5" },
  md: { wrapper: "h-10",  input: "text-sm  px-4 py-2",   icon: "h-4   w-4"   },
  lg: { wrapper: "h-12",  input: "text-base px-4 py-2.5",icon: "h-5   w-5"   },
};

// ─────────────────────────────────────────────
// Input component
// ─────────────────────────────────────────────

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      variant      = "default",
      inputSize    = "md",
      label,
      hint,
      error,
      leftElement,
      rightElement,
      prefix,
      id,
      className,
      wrapperClassName,
      disabled,
      ...props
    },
    ref,
  ) {
    const inputId = id ?? React.useId();
    const activeVariant: InputVariant = error ? "error" : variant;
    const sz = sizeMap[inputSize];

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium uppercase tracking-[0.15em] text-fg/50 select-none"
          >
            {label}
          </label>
        )}

        {/* Input row */}
        <div
          className={cn(
            "flex items-center rounded-xl",
            "border bg-canvas/60 backdrop-blur-sm",
            // ring-2 always present (avoids layout shift), transparent until focused
            "ring-2 ring-transparent ring-offset-2 ring-offset-canvas",
            "gf-transition-fast",
            variantRing[activeVariant],
            sz.wrapper,
            disabled && "opacity-50 pointer-events-none",
          )}
        >
          {/* Prefix label (outside box visually but inside border) */}
          {prefix && (
            <span className="shrink-0 border-r border-fg/10 px-3 text-xs text-fg/40 font-mono select-none">
              {prefix}
            </span>
          )}

          {/* Left icon/element */}
          {leftElement && (
            <span className={cn("shrink-0 pl-3 text-fg/40", sz.icon)}>
              {leftElement}
            </span>
          )}

          {/* Actual input */}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              "flex-1 bg-transparent outline-none",
              "text-fg placeholder:text-fg/25",
              "caret-tomato-jam",
              sz.input,
              leftElement  && "pl-2",
              rightElement && "pr-2",
              className,
            )}
            {...props}
          />

          {/* Right icon/element */}
          {rightElement && (
            <span className={cn("shrink-0 pr-3 text-fg/40", sz.icon)}>
              {rightElement}
            </span>
          )}
        </div>

        {/* Hint / Error */}
        {(error || hint) && (
          <p
            className={cn(
              "text-[11px] leading-relaxed",
              error ? "text-tomato-jam" : "text-fg/40",
            )}
          >
            {error ?? hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

// ─────────────────────────────────────────────
// Textarea
// ─────────────────────────────────────────────

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?:   InputVariant;
  label?:     string;
  hint?:      string;
  error?:     string;
  wrapperClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      variant = "default",
      label,
      hint,
      error,
      id,
      className,
      wrapperClassName,
      disabled,
      rows = 4,
      ...props
    },
    ref,
  ) {
    const textareaId = id ?? React.useId();
    const activeVariant: InputVariant = error ? "error" : variant;

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-medium uppercase tracking-[0.15em] text-fg/50 select-none"
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            "rounded-xl border bg-canvas/60 backdrop-blur-sm",
            "ring-2 ring-transparent ring-offset-2 ring-offset-canvas",
            "gf-transition-fast",
            variantRing[activeVariant],
            disabled && "opacity-50 pointer-events-none",
          )}
        >
          <textarea
            ref={ref}
            id={textareaId}
            rows={rows}
            disabled={disabled}
            className={cn(
              "w-full bg-transparent outline-none resize-none",
              "px-4 py-3 text-sm",
              "text-fg placeholder:text-fg/25",
              "caret-tomato-jam",
              className,
            )}
            {...props}
          />
        </div>

        {(error || hint) && (
          <p className={cn("text-[11px] leading-relaxed", error ? "text-tomato-jam" : "text-fg/40")}>
            {error ?? hint}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
