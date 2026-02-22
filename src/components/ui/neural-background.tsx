"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface NeuralPath {
  id: string;
  path: string;
  duration: number;
  delay: number;
}

function generateRandomPath(width: number, height: number): string {
  const startX = Math.random() * width;
  const startY = Math.random() * height;
  const endX = Math.random() * width;
  const endY = Math.random() * height;
  const cp1x = startX + (Math.random() - 0.5) * width * 0.5;
  const cp1y = startY + (Math.random() - 0.5) * height * 0.5;
  const cp2x = endX + (Math.random() - 0.5) * width * 0.5;
  const cp2y = endY + (Math.random() - 0.5) * height * 0.5;
  return `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
}

export function NeuralBackground() {
  const [paths, setPaths] = useState<NeuralPath[]>([]);
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const resizeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const buildPaths = (w: number, h: number) =>
      Array.from({ length: 6 }, (_, i) => ({
        id: `np-${i}-${Date.now()}`,
        path: generateRandomPath(w, h),
        duration: 6 + Math.random() * 4,
        delay: i * 0.8,
      }));

    const updateDimensions = () => {
      const w = window.innerWidth  || 1920;
      const h = window.innerHeight || 1080;
      setDimensions({ width: w, height: h });
      setPaths(buildPaths(w, h));
    };

    updateDimensions();

    const onResize = () => {
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(updateDimensions, 300);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-[#0B0F19] overflow-hidden" style={{ willChange: "transform" }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,15,25,0.4)_40%,rgba(11,15,25,0.8)_100%)] pointer-events-none" />

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="neuralGradientCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#22D3EE" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="neuralGradientPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#22D3EE" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
          </linearGradient>
        </defs>

        {paths.map((neuralPath, index) => {
          const gradientId = index % 3 === 0 ? "neuralGradientPurple" : "neuralGradientCyan";
          return (
            <motion.path
              key={neuralPath.id}
              d={neuralPath.path}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.9, 0.9, 0] }}
              transition={{
                duration: neuralPath.duration,
                delay: neuralPath.delay,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.2, 0.8, 1],
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
