"use client";

import { MeshGradient } from "@paper-design/shaders-react";

// ─────────────────────────────────────────────────────────────────────────────
// HeroBackground
//
// WebGL mesh-gradient background for the hero section.
// Uses @paper-design/shaders-react — runs only on client (no SSR).
//
// Colors are tuned to the gitlore dark cinematic palette:
//   ink-black (#101011) → warm-dark-red (#2a0d09) → dark-gold (#1a1204)
//   → seppia-black (#040f0f)
//
// The parent (landing/HeroSection) overrides --bg-radial to transparent so
// DarkSection's CSS background reveals this WebGL layer underneath, while
// DarkSection's vignette + noise overlays still render above it for depth.
// ─────────────────────────────────────────────────────────────────────────────

export function HeroBackground() {
  return (
    // bg-[#101011] = ink-black fallback shown until the WebGL canvas initialises
    // (or if WebGL is unavailable on the device).
    <div className="w-full h-full bg-[#101011]">
      <MeshGradient
        className="w-full h-full"
        colors={["#101011", "#2a0d09", "#1a1204", "#040f0f"]}
        speed={0.35}
        distortion={0.25}
        swirl={0.1}
      />
    </div>
  );
}
