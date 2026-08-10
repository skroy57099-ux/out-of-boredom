"use client";

import type { AnalysisGoal } from "./csv-types";
import { CSV_GOALS } from "./csv-goals";

type GoalSelectorProps = {
  selectedGoal: AnalysisGoal;
  onGoalChange: (goal: AnalysisGoal) => void;
};

export default function GoalSelector({
  selectedGoal,
  onGoalChange,
}: GoalSelectorProps) {
  return (
    <section className="border-b border-white/10 px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            What are you using this dataset for?
          </h2>

          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-medium text-cyan-300">
            Analysis Goal
          </span>
        </div>

        <p className="mt-1.5 max-w-3xl text-sm leading-6 text-white/50">
          Your goal changes how the same data issues are interpreted.
          The underlying facts remain the same.
        </p>
      </div>

      {/* Goal Cards */}
      <div className="grid gap-3 md:grid-cols-2">
        {CSV_GOALS.map((goal) => {
          const isSelected = selectedGoal === goal.id;

          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => onGoalChange(goal.id)}
              aria-pressed={isSelected}
              className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200 ${
                isSelected
                  ? "border-cyan-400/40 bg-cyan-400/[0.07] shadow-[0_0_30px_rgba(34,211,238,0.06)]"
                  : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.045]"
              }`}
            >
              {/* Selected accent */}
              {isSelected && (
                <div className="absolute left-0 top-0 h-full w-0.5 bg-cyan-400" />
              )}

              <div className="flex items-start gap-4">
                {/* Radio */}
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all ${
                    isSelected
                      ? "border-cyan-400 bg-cyan-400/15"
                      : "border-white/20 bg-white/[0.02] group-hover:border-white/30"
                  }`}
                >
                  {isSelected && (
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3
                      className={`text-sm font-semibold transition-colors ${
                        isSelected
                          ? "text-cyan-50"
                          : "text-white"
                      }`}
                    >
                      {goal.title}
                    </h3>

                    {isSelected && (
                      <span className="shrink-0 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cyan-300">
                        Selected
                      </span>
                    )}
                  </div>

                  <p className="mt-1.5 text-sm leading-6 text-white/50">
                    {goal.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}