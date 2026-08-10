"use client";

import type { DatasetAnalysis } from "./csv-types";

type DataQualityProps = {
  analysis: DatasetAnalysis;
};

type Status = "good" | "attention" | "neutral";

function StatusIcon({ status }: { status: Status }) {
  const styles = {
    good: {
      wrapper:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      icon: "✓",
    },
    attention: {
      wrapper:
        "border-amber-400/20 bg-amber-400/10 text-amber-300",
      icon: "!",
    },
    neutral: {
      wrapper:
        "border-cyan-400/15 bg-cyan-400/10 text-cyan-300",
      icon: "•",
    },
  };

  const current = styles[status];

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${current.wrapper}`}
    >
      {current.icon}
    </div>
  );
}

function QualityItem({
  title,
  description,
  status,
}: {
  title: string;
  description: string;
  status: Status;
}) {
  const styles = {
    good: {
      card:
        "border-emerald-400/15 bg-emerald-500/[0.035] hover:border-emerald-400/25 hover:bg-emerald-500/[0.05]",
      title: "text-white",
      accent: "bg-emerald-400",
    },
    attention: {
      card:
        "border-amber-400/15 bg-amber-500/[0.04] hover:border-amber-400/25 hover:bg-amber-500/[0.055]",
      title: "text-white",
      accent: "bg-amber-400",
    },
    neutral: {
      card:
        "border-cyan-400/15 bg-cyan-500/[0.025] hover:border-cyan-400/25 hover:bg-cyan-500/[0.04]",
      title: "text-white",
      accent: "bg-cyan-400",
    },
  };

  const current = styles[status];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 ${current.card}`}
    >
      {/* Subtle left accent */}
      <div
        className={`absolute left-0 top-0 h-full w-0.5 opacity-70 ${current.accent}`}
      />

      <div className="flex items-start gap-4">
        <StatusIcon status={status} />

        <div className="min-w-0 flex-1">
          <h3
            className={`text-sm font-semibold tracking-tight ${current.title}`}
          >
            {title}
          </h3>

          <p className="mt-1.5 text-sm leading-6 text-white/55">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DataQuality({
  analysis,
}: DataQualityProps) {
  const hasMissingValues =
    analysis.missingCells > 0;

  const hasDuplicates =
    analysis.duplicateRows > 0;

  const constantColumns =
    analysis.columnAnalysis.filter(
      (column) =>
        analysis.rows > 0 &&
        column.uniqueValues === 1
    );

  const highCardinalityColumns =
    analysis.columnAnalysis.filter((column) => {
      if (analysis.rows === 0) {
        return false;
      }

      const cardinalityRatio =
        column.uniqueValues / analysis.rows;

      return cardinalityRatio >= 0.9;
    });

  const numberColumns =
    analysis.columnAnalysis.filter(
      (column) => column.type === "number"
    ).length;

  const dateColumns =
    analysis.columnAnalysis.filter(
      (column) => column.type === "date"
    ).length;

  const textColumns =
    analysis.columnAnalysis.filter(
      (column) => column.type === "text"
    ).length;

  return (
    <section className="border-b border-white/10 px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Data Quality
          </h2>

          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
            Inspection
          </span>
        </div>

        <p className="mt-1.5 max-w-3xl text-sm leading-6 text-white/50">
          A factual inspection of completeness, duplication,
          column structure, and potentially noteworthy patterns.
        </p>
      </div>

      {/* Quality Items */}
      <div className="grid gap-3">
        {/* Missing values */}
        <QualityItem
          title={
            hasMissingValues
              ? "Missing values detected"
              : "No missing values detected"
          }
          description={
            hasMissingValues
              ? `${analysis.missingCells.toLocaleString()} cells are empty across ${analysis.rowsWithMissingValues.toLocaleString()} rows. ${analysis.missingCellPercentage.toFixed(2)}% of all cells are missing.`
              : `All ${analysis.totalCells.toLocaleString()} cells contain a value.`
          }
          status={
            hasMissingValues
              ? "attention"
              : "good"
          }
        />

        {/* Duplicate rows */}
        <QualityItem
          title={
            hasDuplicates
              ? "Duplicate rows detected"
              : "No duplicate rows detected"
          }
          description={
            hasDuplicates
              ? `${analysis.duplicateRows.toLocaleString()} duplicate rows were found, representing ${analysis.duplicateRowsPercentage.toFixed(2)}% of the dataset.`
              : `No repeated complete rows were detected across the ${analysis.rows.toLocaleString()} rows analyzed.`
          }
          status={
            hasDuplicates
              ? "attention"
              : "good"
          }
        />

        {/* Column types */}
        <QualityItem
          title="Column type distribution"
          description={`${numberColumns} numeric, ${dateColumns} date, and ${textColumns} text columns were detected.`}
          status="neutral"
        />

        {/* Constant columns */}
        <QualityItem
          title={
            constantColumns.length > 0
              ? "Constant columns detected"
              : "No constant columns detected"
          }
          description={
            constantColumns.length > 0
              ? `${constantColumns.length} column${constantColumns.length === 1 ? "" : "s"} contain only one unique non-missing value: ${constantColumns
                  .map((column) => column.name)
                  .join(", ")}. These columns contain no variation in this dataset.`
              : "Every analyzed column contains more than one unique value."
          }
          status={
            constantColumns.length > 0
              ? "attention"
              : "good"
          }
        />

        {/* High cardinality */}
        <QualityItem
          title={
            highCardinalityColumns.length > 0
              ? "Potentially high-cardinality columns"
              : "No extremely high-cardinality columns detected"
          }
          description={
            highCardinalityColumns.length > 0
              ? `${highCardinalityColumns
                  .map(
                    (column) =>
                      `${column.name} (${column.uniqueValues.toLocaleString()} unique)`
                  )
                  .join(
                    ", "
                  )}. High cardinality is an observation, not automatically a data-quality problem. Review these columns based on how you plan to use the data.`
              : "No column has at least 90% as many unique values as there are rows."
          }
          status={
            highCardinalityColumns.length > 0
              ? "neutral"
              : "good"
          }
        />
      </div>
    </section>
  );
}