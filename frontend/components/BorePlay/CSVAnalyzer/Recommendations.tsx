"use client";

import type {
  GoalRecommendation,
  RecommendationPriority,
} from "./csv-types";

type RecommendationsProps = {
  recommendations: GoalRecommendation[];
};

function getPriorityLabel(
  priority: RecommendationPriority
) {
  switch (priority) {
    case "critical":
      return "CRITICAL";

    case "high":
      return "HIGH";

    case "review":
      return "REVIEW";

    case "info":
      return "INFO";
  }
}

function getPriorityClasses(
  priority: RecommendationPriority
) {
  switch (priority) {
    case "critical":
      return {
        badge:
          "border-red-400/25 bg-red-400/10 text-red-300",
        card:
          "border-red-400/20 bg-red-500/[0.035] hover:border-red-400/30",
        accent: "bg-red-400",
        icon:
          "border-red-400/20 bg-red-400/10 text-red-300",
      };

    case "high":
      return {
        badge:
          "border-orange-400/25 bg-orange-400/10 text-orange-300",
        card:
          "border-orange-400/20 bg-orange-500/[0.035] hover:border-orange-400/30",
        accent: "bg-orange-400",
        icon:
          "border-orange-400/20 bg-orange-400/10 text-orange-300",
      };

    case "review":
      return {
        badge:
          "border-amber-400/25 bg-amber-400/10 text-amber-300",
        card:
          "border-amber-400/20 bg-amber-500/[0.035] hover:border-amber-400/30",
        accent: "bg-amber-400",
        icon:
          "border-amber-400/20 bg-amber-400/10 text-amber-300",
      };

    case "info":
      return {
        badge:
          "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
        card:
          "border-cyan-400/15 bg-cyan-500/[0.025] hover:border-cyan-400/25",
        accent: "bg-cyan-400",
        icon:
          "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
      };
  }
}

function getPriorityIcon(
  priority: RecommendationPriority
) {
  switch (priority) {
    case "critical":
      return "!";

    case "high":
      return "↑";

    case "review":
      return "•";

    case "info":
      return "i";
  }
}

export default function Recommendations({
  recommendations,
}: RecommendationsProps) {
  return (
    <section className="border-b border-white/10 px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Recommended Actions
          </h2>

          <span className="rounded-full border border-orange-400/20 bg-orange-400/10 px-2.5 py-1 text-[11px] font-medium text-orange-300">
            Prioritized
          </span>
        </div>

        <p className="mt-1.5 max-w-3xl text-sm leading-6 text-white/50">
          Actions are prioritized for the selected goal.
          Recommendations are based only on detected dataset
          characteristics.
        </p>
      </div>

      {recommendations.length === 0 ? (
        /* Empty State */
        <div className="relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.035] p-6">
          <div className="absolute left-0 top-0 h-full w-0.5 bg-emerald-400" />

          <div className="flex gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-sm font-semibold text-emerald-300">
              ✓
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">
                No immediate actions identified
              </h3>

              <p className="mt-1.5 max-w-3xl text-sm leading-6 text-white/50">
                No issues requiring a specific action were
                detected for this goal. This does not mean the
                dataset is automatically ready for every use case.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {recommendations.map(
            (recommendation, index) => {
              const styles =
                getPriorityClasses(
                  recommendation.priority
                );

              return (
                <div
                  key={recommendation.id}
                  className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 ${styles.card}`}
                >
                  {/* Priority accent */}
                  <div
                    className={`absolute left-0 top-0 h-full w-0.5 ${styles.accent}`}
                  />

                  {/* Recommendation Header */}
                  <div className="flex items-start gap-4">
                    {/* Number */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white/70">
                      {index + 1}
                    </div>

                    {/* Title + Priority */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-white">
                          {recommendation.title}
                        </h3>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide ${styles.badge}`}
                        >
                          {getPriorityIcon(
                            recommendation.priority
                          )}{" "}
                          {getPriorityLabel(
                            recommendation.priority
                          )}
                        </span>
                      </div>

                      {/* Related Columns */}
                      {recommendation.columns &&
                        recommendation.columns.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {recommendation.columns.map(
                              (column) => (
                                <span
                                  key={column}
                                  className="rounded-lg border border-white/10 bg-white/[0.035] px-2.5 py-1 text-xs text-white/55"
                                >
                                  {column}
                                </span>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Recommendation Details */}
                  <div className="mt-5 ml-0 grid gap-4 md:ml-[3.25rem] md:grid-cols-3">
                    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                        What we found
                      </p>

                      <p className="mt-2 text-sm leading-6 text-white/60">
                        {recommendation.problem}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                        What to do
                      </p>

                      <p className="mt-2 text-sm leading-6 text-white/60">
                        {recommendation.action}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                        Why it matters
                      </p>

                      <p className="mt-2 text-sm leading-6 text-white/60">
                        {recommendation.reasoning}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </section>
  );
}