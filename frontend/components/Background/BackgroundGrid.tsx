"use client";

import { motion } from "motion/react";

export default function BackgroundGrid() {
  return (
    <motion.div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          radial-gradient(circle, rgba(255,255,255,0.12) 1.5px, transparent 1.5px),
          linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "140px 140px",
      }}
      animate={{
        x: [-8, 0, -8],
        y: [-4, 0, -4],
      }}
      transition={{
        duration: 35,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}