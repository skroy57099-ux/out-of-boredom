export type BoreState =
  | "booting"
  | "online"
  | "thinking"
  | "searching"
  | "idle";

export const BOOT_SEQUENCE = [
  "Initializing...",
  "Connecting modules...",
  "Loading personality...",
  "System Online.",
];

export const STATE_MESSAGES: Record<
  Exclude<BoreState, "booting">,
  string[]
> = {
  online: [
    "Watching repository...",
    "Reviewing projects...",
    "No critical bugs detected.",
    "Curiosity Level: HIGH",
    "Waiting for next idea...",
    "Scanning code quality...",
    "Still bored...",
  ],

  thinking: [
    "Analyzing...",
    "Thinking...",
    "Making connections...",
  ],

  searching: [
    "Searching jobs...",
    "Scanning companies...",
    "Ranking opportunities...",
  ],

  idle: [
    "Standing by...",
    "Waiting...",
  ],
};

