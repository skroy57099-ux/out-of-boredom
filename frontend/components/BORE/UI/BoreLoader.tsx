"use client";

import { motion } from "motion/react";

export default function BoreLoader() {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        gap-6

        h-full

        text-center
      "
    >
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.08, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear",
        }}
        className="text-5xl"
      >
        😮‍💨
      </motion.div>

      <div>
        <h2 className="text-lg font-semibold text-slate-100">
          Initializing BORE
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Loading Resident Intelligence...
        </p>
      </div>

      <motion.div
        animate={{
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
        }}
        className="
          h-2
          w-20
          rounded-full
          bg-cyan-500
        "
      />
    </div>
  );
}
