"use client";

import Link from "next/link";
import { useState } from "react";
import {
  motion,
  AnimatePresence,
} from "motion/react";

import { fadeUp } from "@/components/constants/animations";

const buttons = [
  {
    label: "View Projects",
    href: "/projects",
    description:
      "Discover the experiments and tools I've built.",
    status: "🚀 Exploring experiments...",
    primary: true,
  },
  {
    label: "Profile",
    href: "/profile",
    description:
      "Resume, professional links and career highlights.",
    status:
      "👤 Opening professional profile...",
  },
  {
    label: "GitHub",
    href: "https://github.com/skroy57099-ux",
    external: true,
    description:
      "Browse the source code behind these projects.",
    status:
      "💻 Inspecting repository...",
  },
];

export default function HeroButtons() {
  const [active, setActive] =
    useState<number | null>(null);

  return (
    <div className="w-full">
      {/* ==================================================
          MAIN BUTTONS
          ================================================== */}

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1 }}
        className="
          flex
          w-full
          flex-col
          gap-3

          sm:flex-row
          sm:flex-wrap
          sm:gap-4

          lg:flex-nowrap
        "
      >
        {buttons.map((button, index) => {
          const buttonContent = (
            <button
              type="button"
              onMouseEnter={() =>
                setActive(index)
              }
              onMouseLeave={() =>
                setActive(null)
              }
              className={`
                relative
                w-full
                overflow-hidden
                rounded-lg

                px-5
                py-3

                font-medium

                transition-transform

                sm:w-auto
                sm:px-6

                hover:scale-105

                ${
                  button.primary
                    ? "bg-white text-black"
                    : "border border-neutral-700 text-white"
                }
              `}
            >
              {active === index && (
                <motion.div
                  layoutId="button-highlight"
                  className="
                    absolute
                    inset-0
                    rounded-lg
                    bg-cyan-500/10
                  "
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 30,
                  }}
                />
              )}

              <span className="relative z-10">
                {button.label}
              </span>
            </button>
          );

          return button.external ? (
            <a
              key={button.label}
              href={button.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              {buttonContent}
            </a>
          ) : (
            <Link
              key={button.label}
              href={button.href}
              className="w-full sm:w-auto"
            >
              {buttonContent}
            </Link>
          );
        })}
      </motion.div>

      {/* ==================================================
          HOVER DESCRIPTION
          ================================================== */}

      <div
        className="
          mt-4
          min-h-5
        "
      >
        <AnimatePresence mode="wait">
          {active !== null && (
            <motion.p
              key={buttons[active].label}
              initial={{
                opacity: 0,
                y: 6,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -6,
              }}
              transition={{
                duration: 0.2,
              }}
              className="
                text-center
                text-sm
                text-neutral-500

                sm:text-left
              "
            >
              {buttons[active].description}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ==================================================
          DIVIDER
          ================================================== */}

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.2 }}
        className="mt-6 sm:mt-8"
      >
        <div
          className="
            h-px
            bg-gradient-to-r
            from-transparent
            via-cyan-500/40
            to-transparent
          "
        />
      </motion.div>

      {/* ==================================================
          BORE PLAY
          ================================================== */}

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1.3 }}
        className="
          mt-5
          sm:mt-6
        "
      >
        <Link
          href="/bore-play"
          className="
            group

            flex
            w-full
            max-w-[520px]

            items-center
            justify-between

            gap-4

            rounded-2xl
            sm:rounded-full

            border
            border-cyan-400/20

            bg-white/5
            backdrop-blur-xl

            px-4
            py-3

            sm:px-6
            sm:py-4

            transition-all
            duration-300

            hover:border-cyan-300/40
            hover:bg-white/10
            hover:shadow-[0_0_28px_rgba(34,211,238,0.20)]
          "
        >
          {/* ==================================================
              LEFT
              ================================================== */}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-3

              sm:gap-5
            "
          >
            {/* Play */}
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center

                rounded-full

                border
                border-cyan-300/20

                bg-cyan-500/5

                transition-all
                duration-300

                group-hover:bg-cyan-500/10

                sm:h-12
                sm:w-12
              "
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="
                  h-4
                  w-4
                  text-cyan-300

                  transition-transform
                  duration-300

                  group-hover:scale-110

                  sm:h-5
                  sm:w-5
                "
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>

            {/* Text */}
            <div className="min-w-0">
              <p
                className="
                  truncate

                  text-sm
                  font-semibold
                  uppercase

                  tracking-[0.16em]

                  text-cyan-300/90

                  transition-colors
                  duration-300

                  group-hover:text-white

                  sm:text-base
                  sm:tracking-[0.28em]
                "
              >
                BORE PLAY
              </p>

              <p
                className="
                  mt-1

                  line-clamp-2

                  text-xs
                  leading-5
                  text-neutral-500

                  sm:text-sm
                "
              >
                Experience the tools instead of reading
                about them.
              </p>
            </div>
          </div>

          {/* ==================================================
              ARROW
              ================================================== */}

          <span
            className="
              shrink-0

              text-xl
              text-cyan-400

              transition-transform
              duration-300

              group-hover:translate-x-1

              sm:text-2xl
            "
            aria-hidden="true"
          >
            →
          </span>
        </Link>
      </motion.div>
    </div>
  );
}