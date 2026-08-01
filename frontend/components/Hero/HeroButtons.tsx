"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import { fadeUp } from "@/components/constants/animations";

const buttons = [
  {
    label: "View Projects",
    href: "/projects",
    description: "Discover the experiments and tools I've built.",
    status: "🚀 Exploring experiments...",
    primary: true,
  },
  {
    label: "Profile",
    href: "/profile",
    description: "Resume, professional links and career highlights.",
    status: "👤 Opening professional profile...",
  },
  {
    label: "GitHub",
    href: "https://github.com/skroy57099-ux",
    external: true,
    description: "Browse the source code behind these projects.",
    status: "💻 Inspecting repository...",
  },
];

export default function HeroButtons() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div>
      {/* Main Buttons */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1 }}
        className="flex flex-wrap gap-4"
      >
        {buttons.map((button, index) => {
          const buttonContent = (
            <button
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
              className={`relative overflow-hidden rounded-lg px-6 py-3 font-medium transition-transform hover:scale-105 ${
                button.primary
                  ? "bg-white text-black"
                  : "border border-neutral-700 text-white"
              }`}
            >
              {active === index && (
                <motion.div
                  layoutId="button-highlight"
                  className="absolute inset-0 rounded-lg bg-cyan-500/10"
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}

              <span className="relative z-10">{button.label}</span>
            </button>
          );

          return button.external ? (
            <a
              key={button.label}
              href={button.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {buttonContent}
            </a>
          ) : (
            <Link key={button.label} href={button.href}>
              {buttonContent}
            </Link>
          );
        })}
      </motion.div>

      {/* Hover Description */}
      <div className="mt-4 h-5">
        <AnimatePresence mode="wait">
          {active !== null && (
            <motion.p
              key={buttons[active].label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-neutral-500"
            >
              {buttons[active].description}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.2 }}
        className="mt-8"
      >
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
      </motion.div>

      {/* BORE PLAY */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.3 }}
        className="mt-6"
      >
        <Link
          href="/bore-play"
          className="
            group

            flex
            items-center
            justify-between

            w-full
            max-w-[520px]

            rounded-full

            border
            border-cyan-400/20

            bg-white/5
            backdrop-blur-xl

            px-6
            py-4

            transition-all
            duration-300

            hover:bg-white/10
            hover:border-cyan-300/40
            hover:shadow-[0_0_28px_rgba(34,211,238,0.20)]
          "
        >
          {/* Left */}
          <div className="flex items-center gap-5">
            {/* Play */}
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center

                rounded-full

                border
                border-cyan-300/20

                bg-cyan-500/5

                transition-all
                duration-300

                group-hover:bg-cyan-500/10
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="
                  h-5
                  w-5
                  text-cyan-300

                  transition-transform
                  duration-300

                  group-hover:scale-110
                "
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>

            {/* Text */}
            <div>
              <p
                className="
                  text-base
                  font-semibold

                  uppercase

                  tracking-[0.28em]

                  text-cyan-300/90

                  transition-colors
                  duration-300

                  group-hover:text-white
                "
              >
                BORE PLAY
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                Experience the tools instead of reading about them.
              </p>
            </div>
          </div>

          {/* Arrow */}
          <span
            className="
              text-2xl
              text-cyan-400

              transition-transform
              duration-300

              group-hover:translate-x-1
            "
          >
            →
          </span>
        </Link>
      </motion.div>
    </div>
  );
}


