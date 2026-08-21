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
    <main
      className="
        min-h-screen
        w-full
        min-w-0
        max-w-full
        overflow-x-hidden

        bg-[#0D1117]
        text-white
      "
    >
      {/* ==================================================
          HEADER
          ================================================== */}

      <PythonHeader />

      {/* ==================================================
          MAIN CONTENT
          ================================================== */}

      <div
        className="
          mx-auto

          w-full
          min-w-0
          max-w-[1400px]

          px-4
          py-6

          sm:px-6
          sm:py-8

          lg:px-8
        "
      >
        {/* ==================================================
            MODE SWITCH
            ================================================== */}

        <div
          className="
            mb-6

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

              rounded-lg

              px-3
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
                  : "border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white"
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

              rounded-lg

              px-3
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
                  : "border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white"
              }
            `}
          >
            Challenge Mode
          </button>
        </div>

        {/* ==================================================
            ACTIVE MODE
            ================================================== */}

        <div
          className="
            w-full
            min-w-0
            max-w-full
          "
        >
          {mode === "practice" ? (
            <Notebook />
          ) : (
            <ChallengeMode />
          )}
        </div>
      </div>
    </main>
  );
}