"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type BoreAnimation =
  | "idle"
  | "boot"
  | "glitch"
  | "thinking"
  | "error"
  | "success";

const DEFAULT_ANIMATION: BoreAnimation = "boot";
const ANIMATION_DURATION = 500;

export function useBoreAnimation() {
  const [animation, setAnimation] =
    useState<BoreAnimation>(DEFAULT_ANIMATION);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const play = useCallback((nextAnimation: BoreAnimation) => {
    // Clear any previous animation timer
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setAnimation(nextAnimation);

    // Stay on idle until another animation is requested
    if (nextAnimation === "idle") return;

    timeoutRef.current = setTimeout(() => {
      setAnimation("idle");
      timeoutRef.current = null;
    }, ANIMATION_DURATION);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    animation,
    play,
  };
}
