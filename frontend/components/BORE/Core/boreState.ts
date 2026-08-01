// Core/boreState.ts

export type BoreState =
  | "boot"
  | "idle"
  | "thinking"
  | "speaking"
  | "analyzing"
  | "success"
  | "warning"
  | "error"
  | "offline";

export interface BoreStateConfig {
  expression: "idle" | "blink" | "thinking" | "error";
  animation: "idle" | "boot" | "glitch" | "thinking" | "error" | "success";
  theme: "cyan" | "purple" | "green" | "amber" | "red";
}

export const boreStateConfig: Record<BoreState, BoreStateConfig> = {
  boot: {
    expression: "idle",
    animation: "boot",
    theme: "cyan",
  },

  idle: {
    expression: "idle",
    animation: "idle",
    theme: "cyan",
  },

  thinking: {
    expression: "thinking",
    animation: "thinking",
    theme: "purple",
  },

  speaking: {
    expression: "idle",
    animation: "idle",
    theme: "cyan",
  },

  analyzing: {
    expression: "thinking",
    animation: "thinking",
    theme: "amber",
  },

  success: {
    expression: "idle",
    animation: "success",
    theme: "green",
  },

  warning: {
    expression: "thinking",
    animation: "idle",
    theme: "amber",
  },

  error: {
    expression: "error",
    animation: "error",
    theme: "red",
  },

  offline: {
    expression: "idle",
    animation: "idle",
    theme: "cyan",
  },
};
export const DEFAULT_BORE_STATE: BoreState = "boot";
