"use client";

import { Database, Lightbulb } from "lucide-react";
import type { PythonChallenge } from "./pythonChallenges";

interface ChallengePanelProps {
  challenge: PythonChallenge;
}

export default function ChallengePanel({
  challenge,
}: ChallengePanelProps) {
  return (
    <section className="rounded-xl border border-white/10 bg-[#11161D] p-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-sm text-cyan-400">
            Challenge
          </p>

          <h2 className="mt-1 text-xl font-semibold text-white">
            {challenge.title}
          </h2>
        </div>

        <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
          {challenge.difficulty}
        </span>

      </div>

      {/* Description */}
      <p className="mt-5 max-w-4xl text-sm leading-6 text-gray-300">
        {challenge.description}
      </p>

      {/* Dataset */}
      <div className="mt-5 flex items-center gap-2 text-sm text-gray-400">
        <Database size={16} className="text-cyan-400" />

        <span>Dataset:</span>

        <span className="font-mono text-gray-200">
          {challenge.dataset}
        </span>
      </div>

      {/* Hint */}
      {challenge.hint && (
        <div className="mt-5 flex gap-3 rounded-lg border border-yellow-500/10 bg-yellow-500/5 p-4">
          <Lightbulb
            size={18}
            className="mt-0.5 shrink-0 text-yellow-400"
          />

          <div>
            <p className="text-sm font-medium text-yellow-400">
              Hint
            </p>

            <p className="mt-1 text-sm text-gray-400">
              {challenge.hint}
            </p>
          </div>
        </div>
      )}

    </section>
  );
}