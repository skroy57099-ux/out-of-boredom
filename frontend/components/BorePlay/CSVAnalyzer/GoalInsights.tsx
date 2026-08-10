"use client";

import type { GoalAnalysis } from "./csv-types";

type GoalInsightsProps = {
  result: GoalAnalysis;
};

type Severity = GoalAnalysis["insights"][number]["severity"];

function getIcon(severity: Severity) {
  if (severity === "good") {
    return "✓";
  }

  if (severity === "attention") {
    return "!";
  }

  return "•";
}

function getIconClasses(severity: Severity) {
  if (severity === "good") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-400";
  }

  if (severity === "attention") {
    return "border-amber-400/20 bg-amber-400/10 text-amber-400";
  }

  return "border-white/10 bg-white/[0.04] text-white/50";
}

function getCardClasses(severity: Severity) {
  if (severity === "good") {
    return "border-emerald-400/20 bg-emerald-400/[0.025] hover:border-emerald-400/30";
  }

  if (severity === "attention") {
    return "border-amber-400/20 bg-amber-400/[0.025] hover:border-amber-400/30";
  }

  return "border-white/10 bg-white/[0.025] hover:border-white/20";
}

function getAccentClasses(severity: Severity) {
  if (severity === "good") {
    return "bg-emerald-400";
  }

  if (severity === "attention") {
    return "bg-amber-400";
  }

  return "bg-white/20";
}

export default function GoalInsights({
  result,
}: GoalInsightsProps) {
  return (
    <section className="border-b border-white/10 px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Goal-Based Analysis
          </h2>

          <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-[11px] font-medium text-violet-300">
            Interpretation
          </span>
        </div>

        <p className="mt-1.5 max-w-3xl text-sm leading-6 text-white/50">
          These observations are interpreted specifically for the
          selected goal. They are based on detected facts, not assumed
          outcomes.
        </p>
      </div>

      {/* Insights */}
      <div className="grid gap-3">
        {result.insights.map((insight, index) => (
          <div
            key={`${insight.title}-${index}`}
            className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 ${getCardClasses(
              insight.severity
            )}`}
          >
            {/* Severity accent */}
            <div
              className={`absolute left-0 top-0 h-full w-0.5 ${getAccentClasses(
                insight.severity
              )}`}
            />

            <div className="flex gap-4">
              {/* Icon */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${getIconClasses(
                  insight.severity
                )}`}
              >
                {getIcon(insight.severity)}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">
                    {insight.title}
                  </h3>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                      insight.severity === "good"
                        ? "bg-emerald-400/10 text-emerald-300"
                        : insight.severity === "attention"
                        ? "bg-amber-400/10 text-amber-300"
                        : "bg-white/5 text-white/40"
                    }`}
                  >
                    {insight.severity}
                  </span>
                </div>

                <p className="mt-1.5 text-sm leading-6 text-white/50">
                  {insight.explanation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}