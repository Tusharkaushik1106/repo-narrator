/**
 * Motion system — global animation configuration
 *
 * All animation values live here. Import constants into motion
 * components and hooks — never hardcode durations or easings inline.
 *
 * Design principles:
 *   • Subtle: transforms are small (y ≤ 16px, scale ≥ 0.96)
 *   • Slow:   entry durations 0.65 – 0.9 s
 *   • Purposeful: every animation has a named intent (reveal, stagger, section)
 */

// ─────────────────────────────────────────────────────────────────────────────
// Durations (seconds)
// ─────────────────────────────────────────────────────────────────────────────

export const DURATION = {
  /** UI micro-interactions: button hover, icon spin */
  fast:    0.2,
  /** Component-level transitions: tabs, dropdowns */
  base:    0.4,
  /** Element-level scroll reveals */
  reveal:  0.65,
  /** Section-level viewport entrance */
  section: 0.85,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Easing curves
// ─────────────────────────────────────────────────────────────────────────────

export const EASE = {
  /** Exponential ease-out — smooth, snappy entrance */
  enter:  [0.16, 1, 0.3, 1]  as const,
  /** Smooth symmetrical — for transitions that feel balanced */
  smooth: [0.4, 0, 0.2, 1]   as const,
  /** Ease-in — for exits and dismissals */
  exit:   [0.4, 0, 1, 1]     as const,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Stagger delays (seconds between each child)
// ─────────────────────────────────────────────────────────────────────────────

export const STAGGER = {
  /** Dense grids: icon rows, tag clouds */
  xs: 0.04,
  /** Standard grids: feature cards, steps */
  sm: 0.08,
  /** Spaced grids: testimonials, large cards */
  md: 0.12,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Viewport thresholds (fraction of element visible before trigger)
// ─────────────────────────────────────────────────────────────────────────────

export const THRESHOLD = {
  /** Section-level — fires as soon as a sliver enters viewport */
  section: 0.04,
  /** Element-level reveals — fire when ~12% is visible */
  reveal:  0.12,
  /** Stagger containers — fire when ~8% is visible */
  stagger: 0.08,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Named animation variants (framer-motion hidden / visible states)
//
// All transforms are intentionally small — the motion should feel like
// "content settling in", not a dramatic entrance.
// ─────────────────────────────────────────────────────────────────────────────

export const variants = {
  /** Default: fade + gentle upward slide */
  fadeUp: {
    hidden:  { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0  },
  },
  /** Opacity only — for content where positional shift would feel wrong */
  fade: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1 },
  },
  /** Fade + very subtle scale — for cards and modals */
  fadeScale: {
    hidden:  { opacity: 0, scale: 0.97 },
    visible: { opacity: 1, scale: 1    },
  },
  /** Slide from left — for left-column content in splits */
  slideLeft: {
    hidden:  { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0   },
  },
  /** Slide from right — for right-column content in splits */
  slideRight: {
    hidden:  { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0  },
  },
  /**
   * Section-level entrance — barely-there translate + fade.
   * More subtle than element-level reveals so the two layers
   * don't compete visually.
   */
  sectionEnter: {
    hidden:  { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0  },
  },
} as const;

export type MotionVariant = keyof typeof variants;
