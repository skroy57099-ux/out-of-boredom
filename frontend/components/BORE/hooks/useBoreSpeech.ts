"use client";

import { useState } from "react";

export function useBoreSpeech() {

  const [message, setMessage] = useState("");

  function speak(text: string) {
    setMessage(text);
  }

  function clear() {
    setMessage("");
  }

  return {

    message,

    speak,

    clear,

  };

}
