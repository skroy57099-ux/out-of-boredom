"use client";

import { useBoreAnimation } from "./useBoreAnimation";
import { useBoreSpeech } from "./useBoreSpeech";
import { useBoreState } from "./useBoreState";

import { boreStateConfig } from "../Core/boreState";
import { boreTheme } from "../Core/boreTheme";

export function useBore() {

  const state = useBoreState();
  const animation = useBoreAnimation();
  const speech = useBoreSpeech();

  const config = boreStateConfig[state.state];

  const theme = boreTheme[config.theme];

  return {

    state: state.state,

    config,

    theme,

    animation,

    speech,

    trigger: state.trigger,

    reset: state.reset,

    speak: speech.speak,

  };

}
