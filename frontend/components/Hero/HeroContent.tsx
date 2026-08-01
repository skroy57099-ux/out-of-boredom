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
      className="space-y-8"
    >
      {/* Brand */}

      <motion.div variants={fadeUp}>
        <h1 className="text-6xl font-bold">
          {HERO.title}
        </h1>

        <div className="mt-6 space-y-1 text-xl text-gray-400">
          {HERO.tagline.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </motion.div>

      {/* Introduction */}

      <motion.div variants={fadeUp} className="space-y-3">
        <h2 className="text-4xl font-semibold">
          Hi, I'm {HERO.name}.
        </h2>

        <p className="text-xl text-gray-300">
          {HERO.role}
        </p>

        <p className="max-w-2xl leading-8 text-gray-400">
          {HERO.description}
        </p>
      </motion.div>
    </motion.div>
  );
}
