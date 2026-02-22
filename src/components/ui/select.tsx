"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options:    SelectOption[];
  label?:     string;
  hint?:      string;
  error?:     string;
  placeholder?: string;
  selectSize?: "sm" | "md" | "lg";
  wrapperClassName?: string;
}

const sizeMap = {
  sm: "h-8  px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-4 text-base",
};

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      options,
      label,
      hint,
      error,
      placeholder,
      selectSize   = "md",
      id,
      className,
      wrapperClassName,
      disabled,
      ...props
    },
    ref,
  ) {
    const selectId = id ?? React.useId();

    return (
      <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-medium uppercase tracking-[0.15em] text-fg/50 select-none"
          >
            {label}
          </label>
        )}

        {/* Wrapper for custom chevron */}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              "w-full appearance-none rounded-xl pr-10",
              "border bg-canvas/60 backdrop-blur-sm",
              "ring-2 ring-transparent transition-all duration-200",
              "text-fg",
              "focus:outline-none",
              error
                ? "border-tomato-jam/60 focus:border-tomato-jam focus:ring-tomato-jam/30"
                : "border-fg/15 focus:border-tomato-jam/50 focus:ring-tomato-jam/20",
              disabled && "opacity-50 pointer-events-none",
              sizeMap[selectSize],
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-canvas text-fg/50">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="bg-canvas text-fg"
              >
                {opt.label}
              </option>
            ))}
          </select>

          {/* Custom chevron */}
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg/40"
            aria-hidden
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

Select.displayName = "Select";
