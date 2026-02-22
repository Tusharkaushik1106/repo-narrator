"use client";

// ─────────────────────────────────────────────────────────────────────────────
// GlobalBackground — cinematic base layer (z-[1])
//
// Replaced WebGL MeshGradient shader with pure CSS radial-gradient + transform
// animation. CSS transform runs on the GPU compositor thread — zero JS main
// thread involvement, eliminating the 3000+ ms TBT contribution of the shader.
// ─────────────────────────────────────────────────────────────────────────────

export function GlobalBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden bg-[#101011]"
    >
      {/* Warm focal blob — slow drift via CSS transform (compositor thread only) */}
      <div
        style={{
          position: "absolute",
          inset: "-25%",
          background:
            "radial-gradient(ellipse 65% 55% at 28% 28%, #2a0d09 0%, transparent 65%)",
          animation: "gfBgWarm 28s ease-in-out infinite alternate",
          willChange: "transform",
        }}
      />
      {/* Cool deep accent — counter-drift */}
      <div
        style={{
          position: "absolute",
          inset: "-25%",
          background:
            "radial-gradient(ellipse 55% 65% at 78% 75%, #1a1204 0%, #040f0f 35%, transparent 65%)",
          animation: "gfBgCool 35s ease-in-out infinite alternate-reverse",
          willChange: "transform",
        }}
      />
    </div>
  );
}
