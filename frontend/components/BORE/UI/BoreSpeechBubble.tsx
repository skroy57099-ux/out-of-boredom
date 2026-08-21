"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
} from "motion/react";

interface BoreSpeechBubbleProps {
  onOpen: () => void;
  visible?: boolean;
}

interface BoreMessage {
  text: string;
  emoji: string;
}

const BORE_MESSAGES: BoreMessage[] = [
  {
    text: "I'm bored. You're curious. Convenient.",
    emoji: "😏",
  },
  {
    text: "Need help?",
    emoji: "👀",
  },
  {
    text: "Ask me something.",
    emoji: "🧠",
  },
  {
    text: "Go on. Test me.",
    emoji: "⚡",
  },
  {
    text: "There's more here than scrolling.",
    emoji: "🔎",
  },
  {
    text: "Ask me about Shubham.",
    emoji: "👨‍💻",
  },
  {
    text: "Try to break me.",
    emoji: "💀",
  },
  {
    text: "Curious?",
    emoji: "🤔",
  },
  {
    text: "I know things. Unfortunately.",
    emoji: "🙄",
  },
  {
    text: "You came this far. Ask something.",
    emoji: "👀",
  },
  {
    text: "Need directions? Humans do.",
    emoji: "🧭",
  },
  {
    text: "Explore something interesting.",
    emoji: "🚀",
  },
  {
    text: "I'm still here.",
    emoji: "🫠",
  },
  {
    text: "Try asking about the projects.",
    emoji: "🛠️",
  },
  {
    text: "Still scrolling? Bold strategy.",
    emoji: "😂",
  },
];

const FIRST_MESSAGE_DELAY = 5000;

const MESSAGE_VISIBLE_TIME = 5000;

const NEXT_MESSAGE_MIN_DELAY = 15000;

const NEXT_MESSAGE_MAX_DELAY = 25000;

function getRandomDelay() {
  return (
    NEXT_MESSAGE_MIN_DELAY +
    Math.random() *
      (NEXT_MESSAGE_MAX_DELAY -
        NEXT_MESSAGE_MIN_DELAY)
  );
}

function getNextMessageIndex(
  currentIndex: number
) {
  if (BORE_MESSAGES.length <= 1) {
    return 0;
  }

  let nextIndex = Math.floor(
    Math.random() *
      BORE_MESSAGES.length
  );

  // Prevent the same message from
  // immediately appearing twice.
  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(
      Math.random() *
        BORE_MESSAGES.length
    );
  }

  return nextIndex;
}

export default function BoreSpeechBubble({
  onOpen,
  visible = true,
}: BoreSpeechBubbleProps) {
  const [messageIndex, setMessageIndex] =
    useState(0);

  const [showMessage, setShowMessage] =
    useState(false);

  useEffect(() => {
    if (!visible) {
      setShowMessage(false);
      return;
    }

    let initialTimer:
      ReturnType<typeof setTimeout>;

    let hideTimer:
      ReturnType<typeof setTimeout>;

    let nextTimer:
      ReturnType<typeof setTimeout>;

    const scheduleNextMessage = () => {
      nextTimer = setTimeout(() => {
        setMessageIndex((current) =>
          getNextMessageIndex(current)
        );

        setShowMessage(true);

        hideTimer = setTimeout(() => {
          setShowMessage(false);

          scheduleNextMessage();
        }, MESSAGE_VISIBLE_TIME);
      }, getRandomDelay());
    };

    initialTimer = setTimeout(() => {
      setShowMessage(true);

      hideTimer = setTimeout(() => {
        setShowMessage(false);

        scheduleNextMessage();
      }, MESSAGE_VISIBLE_TIME);
    }, FIRST_MESSAGE_DELAY);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [visible]);

  const currentMessage =
    BORE_MESSAGES[messageIndex];

  return (
    <AnimatePresence>
      {visible && showMessage && (
        <motion.button
          type="button"
          onClick={onOpen}
          initial={{
            opacity: 0,
            y: 10,
            scale: 0.92,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 8,
            scale: 0.94,
          }}
          transition={{
            duration: 0.28,
            ease: "easeOut",
          }}
          className="
            absolute

            bottom-full
            right-0

            mb-3

            z-20

            w-max
            max-w-[250px]

            cursor-pointer

            rounded-2xl

            border
            border-cyan-400/20

            bg-slate-950/75

            px-4
            py-3

            text-left

            shadow-[0_0_30px_rgba(34,211,238,0.12)]

            backdrop-blur-xl

            transition-all
            duration-200

            hover:border-cyan-400/40
            hover:bg-slate-900/90
            hover:shadow-[0_0_35px_rgba(34,211,238,0.18)]

            active:scale-[0.98]

            sm:max-w-[290px]

            touch-manipulation
          "
          aria-label={`Open BORE: ${currentMessage.text}`}
        >
          {/* ==================================================
              MESSAGE
              ================================================== */}

          <div
            className="
              flex
              items-start
              gap-2.5
            "
          >
            {/* Status dot */}

            <span
              className="
                mt-1.5

                h-1.5
                w-1.5

                shrink-0

                animate-pulse

                rounded-full

                bg-cyan-400

                shadow-[0_0_8px_rgba(34,211,238,0.8)]
              "
            />

            {/* Emoji + text */}

            <span
              className="
                text-xs
                font-medium
                leading-5

                text-slate-200

                sm:text-sm
              "
            >
              <span
                className="
                  mr-1.5
                  text-sm
                  sm:text-base
                "
                aria-hidden="true"
              >
                {currentMessage.emoji}
              </span>

              {currentMessage.text}
            </span>
          </div>

          {/* ==================================================
              SPEECH POINTER
              ================================================== */}

          <span
            className="
              absolute

              -bottom-1.5
              right-7

              h-3
              w-3

              rotate-45

              border-b
              border-r
              border-cyan-400/20

              bg-slate-950/75
            "
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}