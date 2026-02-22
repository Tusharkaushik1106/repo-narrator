"use client";

import { MeshGradient } from "@paper-design/shaders-react";

// ─────────────────────────────────────────────────────────────────────────────
// GlobalBackground
//
// Full-page WebGL mesh-gradient at z-[1] (the base cinematic layer).
// Fixed-positioned — scrolls with the page structure, visible through all
// dark sections whose --bg-radial is set to transparent.
//
// Colors match the gitlore dark cinematic palette:
//   ink-black (#101011) → warm-dark-red (#2a0d09) → dark-gold (#1a1204)
//   → seppia-black (#040f0f)
//
// Loaded client-only (ssr: false in layout.tsx) — WebGL unavailable on server.
// The outer div's bg-[#101011] acts as SSR fallback until the canvas hydrates.
// ─────────────────────────────────────────────────────────────────────────────

export function GlobalBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] bg-[#101011]"
    >
      <MeshGradient
        className="w-full h-full"
        colors={["#101011", "#2a0d09", "#1a1204", "#040f0f"]}
        speed={0.15}
        distortion={0.18}
        swirl={0.06}
      />
    </div>
  );
}
