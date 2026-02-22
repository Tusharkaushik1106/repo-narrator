"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  isOpen:    boolean;
  onClose:   () => void;
  title?:    React.ReactNode;
  /** Small text shown beneath the title */
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  footer?:   React.ReactNode;
  size?:     ModalSize;
  /** Prevent closing when clicking the backdrop */
  preventClose?: boolean;
  /** Override the panel className */
  className?: string;
  /** Alignment — centered (default) or top */
  position?: "center" | "top";
}

// ─────────────────────────────────────────────
// Size map
// ─────────────────────────────────────────────

const sizeClasses: Record<ModalSize, string> = {
  sm:   "max-w-sm",
  md:   "max-w-md",
  lg:   "max-w-lg",
  xl:   "max-w-2xl",
  full: "max-w-[90vw] h-[85vh]",
};

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size          = "md",
  preventClose  = false,
  className,
  position      = "center",
}: ModalProps) {
  // Close on Escape
  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !preventClose) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose, preventClose]);

  // Lock body scroll
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={preventClose ? undefined : onClose}
            className="fixed inset-0 z-[9000] bg-canvas/75 backdrop-blur-sm"
            aria-hidden
          />

          {/* ── Panel ── */}
          <div
            className={cn(
              "fixed inset-0 z-[9001] flex px-4",
              position === "center" ? "items-center justify-center" : "items-start justify-center pt-16",
            )}
          >
            <motion.div
              key="modal-panel"
              role="dialog"
              aria-modal
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              // spec §6.4: reveal/enter uses ease-out cubic-bezier(0, 0, 0.2, 1)
              transition={{ duration: 0.28, ease: [0, 0, 0.2, 1] }}
              className={cn(
                "relative w-full overflow-hidden rounded-3xl",
                "border border-fg/10",
                "bg-[var(--elevated-gradient)]",
                "backdrop-blur-xl",
                "shadow-[0_24px_64px_rgba(0,0,0,0.7)]",
                sizeClasses[size],
                size === "full" && "flex flex-col",
                className,
              )}
            >
              {/* Corner gradient decoration */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  background:
                    "radial-gradient(circle at 0% 0%, rgba(192,57,43,0.08), transparent 50%), radial-gradient(circle at 100% 100%, rgba(212,175,55,0.06), transparent 50%)",
                }}
              />

              {/* ── Header ── */}
              {(title || !preventClose) && (
                <div className="relative z-10 flex items-start justify-between gap-4 border-b border-fg/10 px-6 py-5">
                  <div>
                    {title && (
                      <h2 className="text-base font-semibold text-fg leading-tight">
                        {title}
                      </h2>
                    )}
                    {subtitle && (
                      <p className="mt-0.5 text-xs text-fg/45 leading-relaxed">
                        {subtitle}
                      </p>
                    )}
                  </div>
                  {!preventClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      className={cn(
                        "shrink-0 rounded-xl p-1.5",
                        "text-fg/40",
                        "gf-transition-fast",
                        "hover:bg-fg/8 hover:text-fg",
                        // spec §8.1 focus ring — ring-offset-canvas separates it from dark bg
                        "gf-focus-ring focus-visible:ring-2 focus-visible:ring-tomato-jam/50 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
                      )}
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}

              {/* ── Body ── */}
              <div
                className={cn(
                  "relative z-10 px-6 py-5",
                  size === "full" && "flex-1 overflow-y-auto scrollbar-thin",
                )}
              >
                {children}
              </div>

              {/* ── Footer ── */}
              {footer && (
                <div className="relative z-10 border-t border-fg/10 px-6 py-4">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────
// Confirm dialog — convenience wrapper
// ─────────────────────────────────────────────

export interface ConfirmModalProps {
  isOpen:        boolean;
  onClose:       () => void;
  onConfirm:     () => void;
  title?:        string;
  description?:  string;
  confirmLabel?: string;
  cancelLabel?:  string;
  danger?:       boolean;
  loading?:      boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title       = "Are you sure?",
  description,
  confirmLabel = "Confirm",
  cancelLabel  = "Cancel",
  danger       = false,
  loading      = false,
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={danger ? "danger" : "primary"}
            size="sm"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      {description && (
        <p className="text-sm text-fg/60 leading-relaxed">{description}</p>
      )}
    </Modal>
  );
}
