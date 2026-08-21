"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import BoreAvatar from "../Avatar/BoreAvatar";

const STATUS_MESSAGES = [
  "> Still bored...",
  "> Monitoring...",
  "> Waiting for curiosity...",
  "> Watching the portfolio...",
  "> Systems nominal.",
  "> Idle.",
];

export default function HeroBoreCard() {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex(
        (prev) => (prev + 1) % STATUS_MESSAGES.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="
        relative
        hidden
        lg:flex
        flex-col

        w-[430px]
        h-[560px]

        rounded-3xl
        border
        border-slate-800

        bg-[#111318]/90
        backdrop-blur-xl

        px-8
        pt-6
        pb-6

        shadow-2xl
      "
    >
      {/* Avatar + Projection */}
      <div className="relative flex justify-center">
        <motion.div
          animate={{
            x: [0, -45, -45, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            flex
            items-center
            justify-center

            w-56
            h-56

            rounded-full

            bg-gradient-to-br
            from-slate-900
            to-slate-800

            border
            border-cyan-500/20

            shadow-[0_0_50px_rgba(6,182,212,0.15)]
          "
        >
          <BoreAvatar size="lg" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="mt-16 space-y-5">
        {/* Title */}
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-white">
            BORE
          </h2>

          <p
            className="
              mt-1
              text-xs
              uppercase
              tracking-[0.25em]
              text-cyan-400/80
            "
          >
            Resident Intelligence
          </p>
        </div>

        {/* Online */}
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />

          <span
            className="
              text-xs
              font-medium
              uppercase
              tracking-[0.2em]
              text-emerald-400
            "
          >
            Online
          </span>
        </div>

        {/* Status */}
        <div>
          <p
            className="
              text-[11px]
              uppercase
              tracking-[0.25em]
              text-neutral-500
            "
          >
            Current Status
          </p>

          <AnimatePresence mode="wait">
            <motion.p
              key={statusIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="mt-2 text-xl font-semibold text-white"
            >
              {STATUS_MESSAGES[statusIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-6">
        <p className="text-xs leading-6 text-neutral-500">
          Monitoring portfolio activity.
          <br />
          Waiting for interaction.
        </p>
      </div>
    </motion.div>
  );
}