"use client";

import { motion } from "motion/react";

export default function BoreTyping() {
  return (
    <div className="px-4 py-2">
      <div
        className="
          inline-flex
          items-center
          gap-3

          rounded-2xl
          rounded-bl-md

          bg-slate-800

          px-4
          py-3

          shadow-md
        "
      >
        <span className="text-lg">😮‍💨</span>

        <div className="flex gap-1">
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              animate={{
                opacity: [0.3, 1, 0.3],
                y: [0, -2, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
                delay: dot * 0.15,
              }}
              className="h-2 w-2 rounded-full bg-cyan-400"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
