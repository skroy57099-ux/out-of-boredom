"use client";

import { motion } from "motion/react";
import { HERO } from "@/components/constants/hero";
import {
  fadeUp,
  container,
} from "@/components/constants/animations";

export default function HeroContent() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="
        space-y-6
        sm:space-y-8
      "
    >
      {/* ==================================================
          BRAND
          ================================================== */}

      <motion.div variants={fadeUp}>
        <h1
          className="
            text-4xl
            font-bold
            leading-tight

            sm:text-5xl
            md:text-6xl
          "
        >
          {HERO.title}
        </h1>

        <div
          className="
            mt-4
            space-y-1

            text-base
            leading-relaxed
            text-gray-400

            sm:mt-6
            sm:text-lg

            md:text-xl
          "
        >
          {HERO.tagline.map((line) => (
            <p key={line}>
              {line}
            </p>
          ))}
        </div>
      </motion.div>

      {/* ==================================================
          INTRODUCTION
          ================================================== */}

      <motion.div
        variants={fadeUp}
        className="
          space-y-3
        "
      >
        <h2
          className="
            text-2xl
            font-semibold
            leading-tight

            sm:text-3xl

            md:text-4xl
          "
        >
          Hi, I'm {HERO.name}.
        </h2>

        <p
          className="
            text-base
            leading-relaxed
            text-gray-300

            sm:text-lg

            md:text-xl
          "
        >
          {HERO.role}
        </p>

        <p
          className="
            max-w-2xl
            text-sm
            leading-7
            text-gray-400

            sm:text-base
            sm:leading-8
          "
        >
          {HERO.description}
        </p>
      </motion.div>
    </motion.div>
  );
}