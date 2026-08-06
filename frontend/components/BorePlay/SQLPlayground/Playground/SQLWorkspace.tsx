"use client";

import { useState } from "react";

import PracticeWorkspace from "./PracticeWorkspace";
import ChallengeWorkspace from "./ChallengeWorkspace";

export default function SQLWorkspace() {
  const [mode, setMode] = useState<
    "practice" | "challenge"
  >("practice");

  return (
    <section className="mt-6">

      {/* Mode Switch */}

      <div className="mb-5 flex items-center gap-3">

        <button
          onClick={() => setMode("practice")}
          className={`
            rounded-xl
            px-5
            py-2.5
            text-sm
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
          onClick={() => setMode("challenge")}
          className={`
            rounded-xl
            px-5
            py-2.5
            text-sm
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

      {mode === "practice" ? (
        <PracticeWorkspace />
      ) : (
        <ChallengeWorkspace />
      )}

    </section>
  );
}
