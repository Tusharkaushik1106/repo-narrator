"use client";

import { useReducedMotion } from "framer-motion";

/**
 * Returns the user's motion preference.
 * When `isReduced` is true, all animations should be instant or skipped.
 *
 * Wraps framer-motion's useReducedMotion so callers don't need a direct
 * dependency on framer in their own files.
 */
export function useMotionPreference() {
  const isReduced = useReducedMotion() ?? false;
  return { isReduced };
}
