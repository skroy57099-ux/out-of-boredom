"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
} from "motion/react";

import BoreAvatar from "../Avatar/BoreAvatar";
import BoreWindow from "./BoreWindow";
import BoreSpeechBubble from "./BoreSpeechBubble";

export default function BoreFloating() {
  const [open, setOpen] =
    useState(false);

  return (
    <>
      {/* ==================================================
          FLOATING BORE ASSISTANT
          ================================================== */}

      <div
        className="
          fixed

          bottom-4
          right-3

          sm:bottom-6
          sm:right-6

          z-50
        "
      >
        {/* ==================================================
            BORE AVATAR + SPEECH BUBBLE
            ================================================== */}

        <div
          className="
            relative
            flex
            items-center
            justify-center
          "
        >
          {/* ==================================================
              FLOATING MESSAGE
              ================================================== */}

          <BoreSpeechBubble
            onOpen={() =>
              setOpen(true)
            }
            visible={!open}
          />

          {/* ==================================================
              ASSISTANT BUTTON
              ================================================== */}

          <motion.button
            type="button"
            onClick={() =>
              setOpen((prev) => !prev)
            }
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -5, 2, -3, 0],
              x: [0, 2, -2, 1, 0],
              rotate: [
                0,
                0.6,
                -0.6,
                0,
              ],
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
              relative

              flex
              items-center
              justify-center

              h-16
              w-16

              sm:h-20
              sm:w-20

              rounded-full

              border-0
              bg-transparent

              outline-none

              cursor-pointer

              touch-manipulation
            "
            aria-label={
              open
                ? "Close BORE Assistant"
                : "Open BORE Assistant"
            }
            aria-expanded={open}
          >
            {/* ==================================================
                CYAN GLOW
                ================================================== */}

            <motion.div
              animate={{
                scale: [
                  1,
                  1.08,
                  1,
                ],
                opacity: [
                  0.15,
                  0.3,
                  0.15,
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                pointer-events-none

                absolute

                h-12
                w-12

                sm:h-16
                sm:w-16

                rounded-full

                bg-cyan-500

                blur-xl
              "
            />

            {/* ==================================================
                AVATAR
                ================================================== */}

            <motion.div
              whileHover={{
                rotate: 2,
                scale: 1.05,
              }}
              className="
                relative
                z-10
              "
            >
              <BoreAvatar size="sm" />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* ==================================================
          ASSISTANT WINDOW
          ================================================== */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}
            transition={{
              duration: 0.2,
            }}
            className="
              fixed

              bottom-20
              left-3
              right-3

              sm:bottom-24
              sm:left-auto
              sm:right-6

              z-50

              flex
              justify-end

              pointer-events-none
            "
          >
            <div
              className="
                pointer-events-auto
              "
            >
              <BoreWindow />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}