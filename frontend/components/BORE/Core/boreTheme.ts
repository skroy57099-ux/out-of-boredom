// Core/boreTheme.ts

export type BoreTheme =
  | "cyan"
  | "purple"
  | "green"
  | "amber"
  | "red";

export interface BoreThemeConfig {
  ledColor: string;
  glowColor: string;
  accentColor: string;
  shadowColor: string;
}

export const boreTheme: Record<BoreTheme, BoreThemeConfig> = {
  cyan: {
    ledColor: "#F8FCFF",
    glowColor: "#00D9FF",
    accentColor: "#38BDF8",
    shadowColor: "rgba(0,217,255,0.35)",
  },

  purple: {
    ledColor: "#F5F3FF",
    glowColor: "#A855F7",
    accentColor: "#C084FC",
    shadowColor: "rgba(168,85,247,0.35)",
  },

  green: {
    ledColor: "#ECFDF5",
    glowColor: "#10B981",
    accentColor: "#34D399",
    shadowColor: "rgba(16,185,129,0.35)",
  },

  amber: {
    ledColor: "#FFF7ED",
    glowColor: "#F59E0B",
    accentColor: "#FBBF24",
    shadowColor: "rgba(245,158,11,0.35)",
  },

  red: {
    ledColor: "#FEF2F2",
    glowColor: "#EF4444",
    accentColor: "#F87171",
    shadowColor: "rgba(239,68,68,0.35)",
  },
};
