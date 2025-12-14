"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const updateDimensions = () => {
      const newDims = {
        width: window.innerWidth || 1920,
        height: window.innerHeight || 1080,
      };
      setDimensions(newDims);
      
      const pathCount = 15 + Math.floor(Math.random() * 6);
      const newPaths: NeuralPath[] = Array.from({ length: pathCount }, (_, i) => ({
        id: `neural-path-${i}-${Date.now()}`,
        path: generateRandomPath(newDims.width, newDims.height),
        duration: 5 + Math.random() * 5,
        delay: Math.random() * 3,
      }));

      setPaths(newPaths);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-[#0B0F19] overflow-hidden transform-gpu will-change-contents">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,15,25,0.4)_40%,rgba(11,15,25,0.8)_100%)] pointer-events-none transform-gpu" />
      
      <svg
        className="absolute inset-0 w-full h-full transform-gpu"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ willChange: 'contents' }}
      >
        <defs>
          <linearGradient id="neuralGradientCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#22D3EE" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="neuralGradientPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#22D3EE" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {paths.map((neuralPath, index) => {
          const usePurple = index % 3 === 0;
          const gradientId = usePurple ? "neuralGradientPurple" : "neuralGradientCyan";
          
          return (
            <motion.path
              key={neuralPath.id}
              d={neuralPath.path}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="1.5"
              strokeLinecap="round"
              filter="url(#glow)"
              initial={{ 
                pathLength: 0,
                opacity: 0,
              }}
              animate={{
                pathLength: [0, 1, 1, 0],
                opacity: [0, 1, 1, 0],
              }}
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

