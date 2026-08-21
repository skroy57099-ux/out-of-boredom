"use client";

import { useState } from "react";

import PracticeWorkspace from "./PracticeWorkspace";
import ChallengeWorkspace from "./ChallengeWorkspace";

export default function SQLWorkspace() {
  const [mode, setMode] = useState<
    "practice" | "challenge"
  >("practice");

  return (
    <section
      className="
        mt-6
        w-full
        min-w-0
        max-w-full
      "
    >
      {/* ==================================================
          MODE SWITCH
          ================================================== */}

      <div
        className="
          mb-5
          grid
          w-full
          max-w-full
          grid-cols-2
          gap-3
        "
      >
        <button
          type="button"
          onClick={() => setMode("practice")}
          className={`
            w-full
            min-w-0

            rounded-xl

            px-4
            py-3
            sm:px-5
            sm:py-2.5

            text-sm
            sm:text-base

            font-medium

            transition

            ${
              mode === "practice"
                ? "bg-cyan-500 text-black"
                : "border border-white/10 bg-card text-zinc-400 hover:text-white"
            }
          `}
        >
          Practice Mode
        </button>

        <button
          type="button"
          onClick={() => setMode("challenge")}
          className={`
            w-full
            min-w-0

            rounded-xl

            px-4
            py-3
            sm:px-5
            sm:py-2.5

            text-sm
            sm:text-base

            font-medium

            transition

            ${
              mode === "challenge"
                ? "bg-cyan-500 text-black"
                : "border border-white/10 bg-card text-zinc-400 hover:text-white"
            }
          `}
        >
          Challenge Mode
        </button>
      </div>

      {/* ==================================================
          WORKSPACE
          ================================================== */}

      <div
        className="
          w-full
          min-w-0
          max-w-full
        "
      >
        {mode === "practice" ? (
          <PracticeWorkspace />
        ) : (
          <ChallengeWorkspace />
        )}
      </div>
    </section>
  );
}