"use client";

import { useEffect, useState } from "react";

import {
  BOOT_SEQUENCE,
  BoreState,
  STATE_MESSAGES,
} from "@/components/constants/bore";

export default function useBoreStatus() {
  const [state, setState] =
    useState<BoreState>("booting");

  const [status, setStatus] =
    useState(BOOT_SEQUENCE[0]);

  useEffect(() => {
    if (state !== "booting") return;

    let index = 0;

    const timer = setInterval(() => {
      index++;

      if (index < BOOT_SEQUENCE.length) {
        setStatus(BOOT_SEQUENCE[index]);
        return;
      }

      clearInterval(timer);

      setState("online");
    }, 700);

    return () => clearInterval(timer);
  }, [state]);

  useEffect(() => {
    if (state === "booting") return;

    const messages = STATE_MESSAGES[state];

    let index = 0;

    setStatus(messages[0]);

    const timer = setInterval(() => {
      index = (index + 1) % messages.length;

      setStatus(messages[index]);
    }, 4000);

    return () => clearInterval(timer);
  }, [state]);

  return {
    state,
    status,
    setState,
  };
}