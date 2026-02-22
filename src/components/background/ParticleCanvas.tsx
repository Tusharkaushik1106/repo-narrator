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
  parallaxFactor: number;
}

const BRAND_COLORS = [
  "192, 57, 43",   // tomato-jam
  "212, 175, 55",  // metallic-gold
  "231, 215, 193", // almond-cream
];

function createParticle(width: number, height: number, randomY = true): Particle {
  const depth = Math.random();
  return {
    x: Math.random() * width,
    y: randomY ? Math.random() * height : height + Math.random() * 20,
    size: 0.4 + depth * 1.6,
    color: BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)],
    opacity: 0.01 + depth * 0.045,
    speed: 0.04 + depth * 0.1,
    swaySpeed: 0.0015 + Math.random() * 0.004,
    swayOffset: Math.random() * Math.PI * 2,
    depth,
    parallaxFactor: depth,
  };
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const maybeCanvas = canvasRef.current;
    if (!maybeCanvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas: HTMLCanvasElement = maybeCanvas;
    const maybeCtx = canvas.getContext("2d");
    if (!maybeCtx) return;
    const ctx: CanvasRenderingContext2D = maybeCtx;

    const COUNT = 18;
    let particles: Particle[] = [];
    let rafId: number;
    let tick = 0;

    const mouse = { tx: 0, ty: 0, cx: 0, cy: 0 };
    const PARALLAX_MAX = 14;
    const MOUSE_LERP   = 0.035;

    // Throttle mouse events — only update target on the next RAF
    let mousePending = false;
    let mouseRawX = 0;
    let mouseRawY = 0;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function init() {
      resize();
      particles = Array.from({ length: COUNT }, () =>
        createParticle(canvas.width, canvas.height, true),
      );
    }

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tick++;

      // Apply pending mouse position
      if (mousePending) {
        mouse.tx = mouseRawX / window.innerWidth  - 0.5;
        mouse.ty = mouseRawY / window.innerHeight - 0.5;
        mousePending = false;
      }

      // Exponential ease toward mouse target
      mouse.cx += (mouse.tx - mouse.cx) * MOUSE_LERP;
      mouse.cy += (mouse.ty - mouse.cy) * MOUSE_LERP;

      for (const p of particles) {
        p.y -= p.speed;
        p.x += Math.sin(tick * p.swaySpeed + p.swayOffset) * 0.15;

        if (p.y < -p.size * 2) {
          Object.assign(p, createParticle(canvas.width, canvas.height, false));
          continue;
        }
        if (p.x < -p.size)               p.x = canvas.width  + p.size;
        if (p.x > canvas.width  + p.size) p.x = -p.size;

        const px = p.x + mouse.cx * p.parallaxFactor * PARALLAX_MAX;
        const py = p.y + mouse.cy * p.parallaxFactor * PARALLAX_MAX * 0.45;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(frame);
    }

    function onMouseMove(e: MouseEvent) {
      mouseRawX = e.clientX;
      mouseRawY = e.clientY;
      mousePending = true;
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
      style={{ willChange: "transform" }}
    />
  );
}
