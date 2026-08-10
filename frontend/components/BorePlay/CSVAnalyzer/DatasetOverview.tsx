"use client";

import type {
  DatasetAnalysis,
  ParsedDataset,
} from "./csv-types";

type DatasetOverviewProps = {
  dataset: ParsedDataset;
  analysis: DatasetAnalysis;
};

type Metric = {
  label: string;
  value: string;
  accent: string;
  dot: string;
  background: string;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function QualityCard({
  label,
  value,
  description,
  status,
}: {
  label: string;
  value: string;
  description: string;
  status: "healthy" | "attention" | "review";
}) {
  const styles = {
    healthy: {
      border: "border-emerald-400/15",
      background: "bg-emerald-400/[0.035]",
      value: "text-emerald-300",
      badge: "bg-emerald-400/10 text-emerald-300",
      dot: "bg-emerald-400",
      label: "Healthy",
    },

    attention: {
      border: "border-amber-400/15",
      background: "bg-amber-400/[0.04]",
      value: "text-amber-300",
      badge: "bg-amber-400/10 text-amber-300",
      dot: "bg-amber-400",
      label: "Attention",
    },

    review: {
      border: "border-amber-400/15",
      background: "bg-amber-400/[0.04]",
      value: "text-amber-300",
      badge: "bg-amber-400/10 text-amber-300",
      dot: "bg-amber-400",
      label: "Review",
    },
  };

  const style = styles[status];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border ${style.border} ${style.background} p-5 transition duration-200 hover:bg-white/[0.045]`}
    >
      {/* Subtle accent glow */}
      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full ${style.dot} opacity-[0.035] blur-2xl transition duration-300 group-hover:opacity-[0.07]`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
            />

            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
              {label}
            </p>
          </div>

          <p
            className={`mt-2.5 text-2xl font-semibold tracking-tight ${style.value}`}
          >
            {value}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide ${style.badge}`}
        >
          {style.label}
        </span>
      </div>

      <p className="relative mt-3 text-xs leading-5 text-white/45">
        {description}
      </p>
    </div>
  );
}

export default function DatasetOverview({
  dataset,
  analysis,
}: DatasetOverviewProps) {
  const metrics: Metric[] = [
    {
      label: "Rows",
      value: analysis.rows.toLocaleString(),
      accent: "text-cyan-300",
      dot: "bg-cyan-400",
      background:
        "from-cyan-400/[0.055] via-[#111111] to-transparent",
    },
    {
      label: "Columns",
      value: analysis.columns.toLocaleString(),
      accent: "text-cyan-300",
      dot: "bg-cyan-400",
      background:
        "from-cyan-400/[0.04] via-[#111111] to-transparent",
    },
    {
      label: "File Size",
      value: formatFileSize(dataset.fileSize),
      accent: "text-violet-300",
      dot: "bg-violet-400",
      background:
        "from-violet-400/[0.055] via-[#111111] to-transparent",
    },
    {
      label: "Duplicate Rows",
      value: analysis.duplicateRows.toLocaleString(),
      accent:
        analysis.duplicateRows > 0
          ? "text-amber-300"
          : "text-emerald-300",
      dot:
        analysis.duplicateRows > 0
          ? "bg-amber-400"
          : "bg-emerald-400",
      background:
        analysis.duplicateRows > 0
          ? "from-amber-400/[0.045] via-[#111111] to-transparent"
          : "from-emerald-400/[0.045] via-[#111111] to-transparent",
    },
  ];

  const hasMissingValues =
    analysis.missingCells > 0;

  const hasMissingRows =
    analysis.rowsWithMissingValues > 0;

  const hasMissingColumns =
    analysis.columnsWithMissingValues > 0;

  return (
    <section className="border-t border-white/10 pt-8">
      {/* =========================================
          SECTION HEADER
      ========================================= */}

      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Dataset Overview
          </h2>

          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-cyan-300">
            CSV
          </span>
        </div>

        <p className="mt-1.5 text-sm leading-6 text-white/50">
          A quick factual summary of the uploaded dataset.
        </p>
      </div>

      {/* =========================================
          PRIMARY METRICS
      ========================================= */}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${metric.background} p-5 transition duration-200 hover:border-white/15`}
          >
            {/* Decorative glow */}
            <div
              className={`absolute -right-8 -top-8 h-24 w-24 rounded-full ${metric.dot} opacity-[0.035] blur-2xl transition duration-300 group-hover:opacity-[0.07]`}
            />

            <div className="relative">
              <div className="flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${metric.dot}`}
                />

                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
                  {metric.label}
                </p>
              </div>

              <p
                className={`mt-3 text-2xl font-semibold tracking-tight ${metric.accent}`}
              >
                {metric.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================
          DATA QUALITY METRICS
      ========================================= */}

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        <QualityCard
          label="Missing Cells"
          value={analysis.missingCells.toLocaleString()}
          description={`${analysis.missingCellPercentage.toFixed(
            2
          )}% of all cells`}
          status={
            hasMissingValues
              ? "attention"
              : "healthy"
          }
        />

        <QualityCard
          label="Rows With Missing Values"
          value={analysis.rowsWithMissingValues.toLocaleString()}
          description={`${analysis.rowsWithMissingValuesPercentage.toFixed(
            2
          )}% of rows`}
          status={
            hasMissingRows
              ? "review"
              : "healthy"
          }
        />

        <QualityCard
          label="Columns With Missing Values"
          value={analysis.columnsWithMissingValues.toLocaleString()}
          description={`Out of ${analysis.columns.toLocaleString()} columns`}
          status={
            hasMissingColumns
              ? "review"
              : "healthy"
          }
        />
      </div>
    </section>
  );
}