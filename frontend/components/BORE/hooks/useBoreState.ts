"use client";

import { useState } from "react";;
import {
  BoreState,DEFAULT_BORE_STATE,} from "../Core/boreState";

export function useBoreState() {
  const [state, setState] = useState<BoreState>(DEFAULT_BORE_STATE);

  function trigger(nextState: BoreState) {
    setState(nextState);
  }

  function reset() {
    setState(DEFAULT_BORE_STATE);
  }

  return {
    state,
    trigger,
    reset,
  };
}
