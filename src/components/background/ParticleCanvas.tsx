"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;        // "R, G, B"
  opacity: number;
  speed: number;        // px/frame upward
  swaySpeed: number;
  swayOffset: number;
  depth: number;        // 0 = farthest, 1 = nearest
  blurPx: number;       // pre-computed depth blur (quantized to 3 tiers)
  parallaxFactor: number;
}

const BRAND_COLORS = [
  "192, 57, 43",   // tomato-jam
  "212, 175, 55",  // metallic-gold
  "231, 215, 193", // almond-cream
];

/** Quantize blur into 3 tiers to minimise ctx.filter state changes per frame */
function depthToBlur(depth: number): number {
  if (depth > 0.66) return 0;     // near  — sharp
  if (depth > 0.33) return 0.35;  // mid   — barely perceptible
  return 0.8;                      // far   — soft
}

function createParticle(width: number, height: number, randomY = true): Particle {
  const depth = Math.random();
  return {
    x: Math.random() * width,
    y: randomY ? Math.random() * height : height + Math.random() * 20,
    size: 0.35 + depth * 1.9,                         // 0.35–2.25 px (depth-driven)
    color: BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)],
    opacity: 0.008 + depth * 0.048,                   // far=dim, near=brighter
    speed: 0.035 + depth * 0.12,                      // far=0.035, near=0.155 px/frame
    swaySpeed: 0.0015 + Math.random() * 0.005,        // very gentle angular freq
    swayOffset: Math.random() * Math.PI * 2,
    depth,
    blurPx: depthToBlur(depth),
    parallaxFactor: depth,                             // near particles move most
  };
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const maybeCanvas = canvasRef.current;
    if (!maybeCanvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Re-assign as a definitely-non-null const so TypeScript can track the
    // type correctly through all nested closures (narrowing doesn't propagate
    // through function declarations in the same scope).
    const canvas: HTMLCanvasElement = maybeCanvas;
    const maybeCtx = canvas.getContext("2d");
    if (!maybeCtx) return;
    const ctx: CanvasRenderingContext2D = maybeCtx;

    const COUNT = 40;
    let particles: Particle[] = [];
    let rafId: number;
    let tick = 0;

    /*
     * Smoothed mouse position — normalised to –0.5…+0.5 relative to centre.
     * LERP factor 0.04 ≈ 90 % of target reached in ~55 frames (~0.9 s) — feels
     * luxuriously inertial without being unresponsive.
     */
    const mouse = { tx: 0, ty: 0, cx: 0, cy: 0 };
    const PARALLAX_MAX  = 16; // px — max horizontal offset for nearest particle
    const MOUSE_LERP    = 0.04;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function init() {
      resize();
      particles = Array.from({ length: COUNT }, () =>
        createParticle(canvas.width, canvas.height, true),
      );
      // Pre-sort descending by blurPx so filter state changes are batched
      particles.sort((a, b) => b.blurPx - a.blurPx);
    }

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tick++;

      // Exponential ease toward mouse target
      mouse.cx += (mouse.tx - mouse.cx) * MOUSE_LERP;
      mouse.cy += (mouse.ty - mouse.cy) * MOUSE_LERP;

      let lastBlur = -1; // sentinel — force first filter write

      for (const p of particles) {
        // Drift upward + gentle sine sway
        p.y -= p.speed;
        p.x += Math.sin(tick * p.swaySpeed + p.swayOffset) * 0.18;

        // Wrap: exit top → respawn at bottom
        if (p.y < -p.size * 2) {
          Object.assign(p, createParticle(canvas.width, canvas.height, false));
          continue;
        }
        // Wrap horizontal edges
        if (p.x < -p.size)               p.x = canvas.width  + p.size;
        if (p.x > canvas.width  + p.size) p.x = -p.size;

        // Parallax offset — near particles are displaced more by cursor
        const px = p.x + mouse.cx * p.parallaxFactor * PARALLAX_MAX;
        const py = p.y + mouse.cy * p.parallaxFactor * PARALLAX_MAX * 0.45;

        // Batch filter state changes per blur tier
        if (p.blurPx !== lastBlur) {
          ctx.filter = p.blurPx > 0 ? `blur(${p.blurPx}px)` : "none";
          lastBlur = p.blurPx;
        }

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.fill();
      }

      // Ensure filter doesn't leak into other canvas operations
      if (lastBlur !== 0) ctx.filter = "none";

      rafId = requestAnimationFrame(frame);
    }

    function onMouseMove(e: MouseEvent) {
      // Normalise to –0.5 … +0.5 relative to viewport centre
      mouse.tx = e.clientX / window.innerWidth  - 0.5;
      mouse.ty = e.clientY / window.innerHeight - 0.5;
    }

    function onResize() {
      resize();
      for (const p of particles) {
        if (p.x > canvas.width)  p.x = Math.random() * canvas.width;
        if (p.y > canvas.height) p.y = Math.random() * canvas.height;
      }
    }

    init();
    frame();

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize",    onResize,    { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize",    onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[5]"
    />
  );
}
