// ─────────────────────────────────────────────────────────────────────────────
// LogoMark — inline SVG brand mark
//
// Uses stroked paths (no filled rects) so letterforms read as lowercase "gl".
// All colors use direct rgba() — no <defs> gradient IDs that can conflict
// when the component is rendered more than once on the same page.
// ─────────────────────────────────────────────────────────────────────────────

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Background — warm dark, no gradient IDs needed */}
      <rect width="36" height="36" rx="9" fill="#180c0a" />

      {/* Top accent line — direct rgba, never conflicts */}
      <rect x="5" y="0.75" width="26" height="0.75" rx="0.5" fill="rgba(192,57,43,0.65)" />

      {/*
       * "g" — single-story lowercase
       *   bowl  : full circle, center (13,16) r=5
       *   link  : from right of circle (18,16) down to (18,25)
       *   tail  : quadratic curve left to (12,27)
       */}
      <circle
        cx="13"
        cy="16"
        r="5"
        stroke="rgba(255,248,240,0.92)"
        strokeWidth="1.9"
      />
      <path
        d="M 18 16 L 18 25 Q 18 27 12 27"
        stroke="rgba(255,248,240,0.92)"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/*
       * "l" — vertical stem + short foot
       *   stem : (24,10) → (24,25)
       *   foot : (24,25) → (27,25)
       */}
      <path
        d="M 24 10 L 24 25 L 27 25"
        stroke="rgba(255,248,240,0.92)"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Brand-red terminal dot at base of descender */}
      <circle cx="12" cy="27" r="1.4" fill="rgba(192,57,43,0.85)" />
    </svg>
  );
}
