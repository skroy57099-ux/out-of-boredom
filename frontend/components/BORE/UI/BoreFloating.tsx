"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import BoreAvatar from "../Avatar/BoreAvatar";
import BoreWindow from "./BoreWindow";

export default function BoreFloating() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Assistant Button */}
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [0, -5, 2, -3, 0],
          x: [0, 2, -2, 1, 0],
          rotate: [0, 0.6, -0.6, 0],
        }}
        transition={{
          opacity: {
            duration: 0.4,
          },
          scale: {
            duration: 0.4,
          },
          y: {
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          },
          x: {
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: 13,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        whileHover={{
          scale: 1.08,
        }}
        whileTap={{
          scale: 0.95,
        }}
        className="
          fixed
          bottom-6
          right-6
          z-50

          flex
          items-center
          justify-center

          w-20
          h-20

          rounded-full

          bg-transparent
          border-0
          outline-none

          cursor-pointer
        "
        aria-label="Open BORE Assistant"
      >
        {/* Cyan Glow */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            w-16
            h-16
            rounded-full
            bg-cyan-500
            blur-xl
            pointer-events-none
          "
        />

        {/* Avatar */}
        <motion.div
          whileHover={{
            rotate: 2,
            scale: 1.05,
          }}
          className="relative z-10"
        >
          <BoreAvatar size="sm" />
        </motion.div>
      </motion.button>

      {/* Assistant Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <BoreWindow />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
