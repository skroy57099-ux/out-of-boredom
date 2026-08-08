"use client";

import { useState } from "react";

import PythonHeader from "./PythonHeader";
import Notebook from "../Practice/Notebook";
import ChallengeMode from "../Challenge/ChallengeMode";

type PlaygroundMode = "practice" | "challenge";

export default function PythonLayout() {
  const [mode, setMode] =
    useState<PlaygroundMode>("practice");

  return (
    <main className="min-h-screen bg-[#0D1117] text-white">

      {/* Back */}
      <PythonHeader />

      <div className="mx-auto w-full max-w-[1400px] px-6 py-6">

        {/* Mode Switch */}
        <div className="mb-6 flex items-center gap-3">

          <button
            type="button"
            onClick={() => setMode("practice")}
            className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${
              mode === "practice"
                ? "bg-cyan-500 text-black"
                : "border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            Practice Mode
          </button>

          <button
            type="button"
            onClick={() => setMode("challenge")}
            className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${
              mode === "challenge"
                ? "bg-cyan-500 text-black"
                : "border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            Challenge Mode
          </button>

        </div>

        {/* Active Mode */}
        {mode === "practice" ? (
          <Notebook />
        ) : (
          <ChallengeMode />
        )}

      </div>

    </main>
  );
}