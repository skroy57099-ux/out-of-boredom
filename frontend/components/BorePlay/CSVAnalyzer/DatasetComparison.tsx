"use client";

import type { DatasetAnalysis } from "./csv-types";

type DatasetComparisonProps = {
  before: DatasetAnalysis;
  after: DatasetAnalysis;
};

type ComparisonRowProps = {
  label: string;
  before: number;
  after: number;
  suffix?: string;
};

function ComparisonRow({
  label,
  before,
  after,
  suffix = "",
}: ComparisonRowProps) {
  const difference = after - before;

  let changeColor = "text-white/50";
  let changeBackground = "bg-white/[0.04]";
  let changeSymbol = "";

  if (difference < 0) {
    changeColor = "text-emerald-300";
    changeBackground = "bg-emerald-400/10";
    changeSymbol = "↓";
  } else if (difference > 0) {
    changeColor = "text-amber-300";
    changeBackground = "bg-amber-400/10";
    changeSymbol = "↑";
  } else {
    changeSymbol = "—";
  }

  return (
    <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] items-center border-b border-white/[0.07] px-5 py-4 last:border-b-0">
      <div className="min-w-0 text-sm font-medium text-white/80">
        {label}
      </div>

      <div className="text-sm text-white/45">
        {before.toLocaleString()}
        {suffix}
      </div>

      <div className="text-sm font-medium text-white">
        {after.toLocaleString()}
        {suffix}
      </div>

      <div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${changeColor} ${changeBackground}`}
        >
          <span>{changeSymbol}</span>

          {difference !== 0
            ? `${difference > 0 ? "+" : ""}${difference.toLocaleString()}${suffix}`
            : "No change"}
        </span>
      </div>
    </div>
  );
}

export default function DatasetComparison({
  before,
  after,
}: DatasetComparisonProps) {
  const rowsRemoved = before.rows - after.rows;
  const missingCellsRemoved =
    before.missingCells - after.missingCells;
  const duplicatesRemoved =
    before.duplicateRows - after.duplicateRows;

  return (
    <section className="border-b border-white/10 px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Before / After Comparison
          </h2>

          <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-[11px] font-medium text-violet-300">
            Dataset Changes
          </span>
        </div>

        <p className="mt-1.5 max-w-3xl text-sm leading-6 text-white/50">
          A factual comparison of the two dataset analyses.
          No composite quality score is used.
        </p>
      </div>

      {/* Change Summary */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/40">
            Rows changed
          </p>

          <p className="mt-2 text-2xl font-semibold text-white">
            {Math.abs(rowsRemoved).toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-white/40">
            {rowsRemoved > 0
              ? "rows removed"
              : rowsRemoved < 0
                ? "rows added"
                : "no row count change"}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-400/15 bg-emerald-500/[0.035] p-5">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/40">
            Missing cells changed
          </p>

          <p className="mt-2 text-2xl font-semibold text-emerald-300">
            {Math.abs(missingCellsRemoved).toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-white/40">
            {missingCellsRemoved > 0
              ? "missing cells removed"
              : missingCellsRemoved < 0
                ? "missing cells added"
                : "no change"}
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-400/15 bg-cyan-500/[0.025] p-5">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/40">
            Duplicate rows changed
          </p>

          <p className="mt-2 text-2xl font-semibold text-cyan-300">
            {Math.abs(duplicatesRemoved).toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-white/40">
            {duplicatesRemoved > 0
              ? "duplicates removed"
              : duplicatesRemoved < 0
                ? "duplicates added"
                : "no change"}
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        {/* Table Header */}
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] border-b border-white/10 bg-white/[0.035] px-5 py-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Metric
          </div>

          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Before
          </div>

          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
            After
          </div>

          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Change
          </div>
        </div>

        <ComparisonRow
          label="Rows"
          before={before.rows}
          after={after.rows}
        />

        <ComparisonRow
          label="Columns"
          before={before.columns}
          after={after.columns}
        />

        <ComparisonRow
          label="Missing cells"
          before={before.missingCells}
          after={after.missingCells}
        />

        <ComparisonRow
          label="Rows with missing values"
          before={before.rowsWithMissingValues}
          after={after.rowsWithMissingValues}
        />

        <ComparisonRow
          label="Duplicate rows"
          before={before.duplicateRows}
          after={after.duplicateRows}
        />

        <ComparisonRow
          label="Columns with missing values"
          before={before.columnsWithMissingValues}
          after={after.columnsWithMissingValues}
        />
      </div>
    </section>
  );
}