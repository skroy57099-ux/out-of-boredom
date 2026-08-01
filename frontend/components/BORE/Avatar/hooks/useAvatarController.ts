"use client";

import { useEffect, useState } from "react";

// If the real useBoreAnimation hook file is missing or has a path issue,
// provide a minimal local fallback so this controller still compiles.
// Replace or remove this fallback when the actual hook is available.
function useBoreAnimation() {
  const [animation, setAnimation] = useState<string | null>(null);

  const play = (name: string) => {
    setAnimation(name);
  };

  return { animation, play } as const;
}
import type { AvatarExpression } from "../state/avatarState";

const BLINK_DURATION = 120;

const BLINK_MIN_DELAY = 4000;

const BLINK_MAX_DELAY = 8000;

export function useAvatarController() {
  const { animation, play } = useBoreAnimation();

  const [expression, setExpression] =
    useState<AvatarExpression>("idle");

  // Boot animation
  useEffect(() => {
    play("boot");
  }, [play]);

  // Random glitch
  useEffect(() => {
    const interval = setInterval(() => {
      play("glitch");
    }, 8000);

    return () => clearInterval(interval);
  }, [play]);

  // 👇 Add the blink effect HERE
  useEffect(() => {
  let blinkTimeout: ReturnType<typeof setTimeout>;
  let nextBlinkTimeout: ReturnType<typeof setTimeout>;

  const scheduleBlink = () => {
    const delay =
      BLINK_MIN_DELAY +
      Math.random() * (BLINK_MAX_DELAY - BLINK_MIN_DELAY);

    nextBlinkTimeout = setTimeout(() => {
      setExpression("blink");

      blinkTimeout = setTimeout(() => {
        setExpression("idle");

        scheduleBlink();
      }, BLINK_DURATION);
    }, delay);
  };

  scheduleBlink();

  return () => {
    clearTimeout(blinkTimeout);
    clearTimeout(nextBlinkTimeout);
  };
  }, []);

  return { animation, expression };
}
