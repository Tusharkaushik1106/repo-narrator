"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// FormField — wraps a label + control + error/hint
// ─────────────────────────────────────────────

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Field label text */
  label?:     string;
  /** htmlFor wires the label to the input */
  htmlFor?:   string;
  /** Short helper text shown below the field */
  hint?:      string;
  /** Error string — replaces hint and turns text red */
  error?:     string;
  /** Mark label with a red asterisk */
  required?:  boolean;
  /** Optional right-side label slot (e.g. "Optional", char count) */
  labelRight?: React.ReactNode;
}

export function FormField({
  label,
  htmlFor,
  hint,
  error,
  required   = false,
  labelRight,
  className,
  children,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      {(label || labelRight) && (
        <div className="flex items-center justify-between">
          {label && (
            <FormLabel htmlFor={htmlFor} required={required}>
              {label}
            </FormLabel>
          )}
          {labelRight && (
            <span className="text-[11px] text-fg/35">{labelRight}</span>
          )}
        </div>
      )}

      {children}

      {(error || hint) && (
        <FormMessage variant={error ? "error" : "hint"}>
          {error ?? hint}
        </FormMessage>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// FormLabel
// ─────────────────────────────────────────────

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function FormLabel({ required, className, children, ...props }: FormLabelProps) {
  return (
    <label
      className={cn(
        "text-xs font-medium uppercase tracking-[0.15em] text-fg/50 select-none",
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-1 text-tomato-jam" aria-hidden>
          *
        </span>
      )}
    </label>
  );
}

// ─────────────────────────────────────────────
// FormMessage — hint / error text
// ─────────────────────────────────────────────

export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "hint" | "error" | "success";
}

const messageColors: Record<NonNullable<FormMessageProps["variant"]>, string> = {
  hint:    "text-fg/40",
  error:   "text-tomato-jam",
  success: "text-emerald-400/80",
};

export function FormMessage({ variant = "hint", className, children, ...props }: FormMessageProps) {
  return (
    <p
      className={cn("text-[11px] leading-relaxed", messageColors[variant], className)}
      role={variant === "error" ? "alert" : undefined}
      {...props}
    >
      {children}
    </p>
  );
}

// ─────────────────────────────────────────────
// FormSection — groups related fields with a title
// ─────────────────────────────────────────────

export interface FormSectionProps extends React.HTMLAttributes<HTMLFieldSetElement> {
  legend?:    string;
  subtitle?:  string;
}

export function FormSection({ legend, subtitle, className, children, ...props }: FormSectionProps) {
  return (
    <fieldset
      className={cn("space-y-5 rounded-2xl border border-fg/8 p-5", className)}
      {...props}
    >
      {legend && (
        <legend className="px-2 text-sm font-semibold text-fg/80">
          {legend}
          {subtitle && (
            <span className="ml-2 text-xs font-normal text-fg/40">{subtitle}</span>
          )}
        </legend>
      )}
      {children}
    </fieldset>
  );
}

// ─────────────────────────────────────────────
// CheckboxField — styled checkbox with label
// ─────────────────────────────────────────────

export interface CheckboxFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label:    string;
  hint?:    string;
  error?:   string;
}

export function CheckboxField({ label, hint, error, id, className, ...props }: CheckboxFieldProps) {
  const checkId = id ?? React.useId();

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2.5">
        <div className="relative shrink-0">
          <input
            id={checkId}
            type="checkbox"
            className={cn(
              "peer h-4 w-4 appearance-none rounded-md cursor-pointer",
              "border border-fg/20 bg-canvas/60",
              "checked:border-tomato-jam checked:bg-tomato-jam",
              "transition-all duration-150",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-tomato-jam/40 focus-visible:ring-offset-1 focus-visible:ring-offset-canvas",
              className,
            )}
            {...props}
          />
          {/* Checkmark SVG shown when checked */}
          <svg
            className="pointer-events-none absolute inset-0 m-auto h-2.5 w-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden
          >
            <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <label htmlFor={checkId} className="text-sm text-fg/70 cursor-pointer leading-tight select-none">
          {label}
        </label>
      </div>
      {(error || hint) && (
        <FormMessage variant={error ? "error" : "hint"} className="ml-6">
          {error ?? hint}
        </FormMessage>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// RadioField — styled radio with label
// ─────────────────────────────────────────────

export interface RadioFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  hint?: string;
}

export function RadioField({ label, hint, id, className, ...props }: RadioFieldProps) {
  const radioId = id ?? React.useId();

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2.5">
        <div className="relative shrink-0">
          <input
            id={radioId}
            type="radio"
            className={cn(
              "peer h-4 w-4 appearance-none rounded-full cursor-pointer",
              "border border-fg/20 bg-canvas/60",
              "checked:border-tomato-jam",
              "transition-all duration-150",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-tomato-jam/40 focus-visible:ring-offset-1 focus-visible:ring-offset-canvas",
              className,
            )}
            {...props}
          />
          {/* Inner dot */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 m-auto h-1.5 w-1.5 rounded-full bg-tomato-jam opacity-0 peer-checked:opacity-100 transition-opacity"
          />
        </div>
        <label htmlFor={radioId} className="text-sm text-fg/70 cursor-pointer leading-tight select-none">
          {label}
        </label>
      </div>
      {hint && <FormMessage className="ml-6">{hint}</FormMessage>}
    </div>
  );
}

// ─────────────────────────────────────────────
// Form — wrapper with submit handler
// ─────────────────────────────────────────────

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  gap?: "sm" | "md" | "lg";
}

const formGaps = { sm: "gap-3", md: "gap-5", lg: "gap-7" };

export function Form({ gap = "md", className, children, ...props }: FormProps) {
  return (
    <form
      className={cn("flex flex-col", formGaps[gap], className)}
      {...props}
    >
      {children}
    </form>
  );
}
