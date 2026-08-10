"use client";

import { useMemo, useState } from "react";

import type {
  ColumnAnalysis,
} from "./csv-types";

type ColumnExplorerProps = {
  columns: ColumnAnalysis[];
};

export default function ColumnExplorer({
  columns,
}: ColumnExplorerProps) {
  const [search, setSearch] = useState("");
  const [selectedColumn, setSelectedColumn] =
    useState<string | null>(
      columns[0]?.name ?? null
    );

  const filteredColumns = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return columns;
    }

    return columns.filter((column) =>
      column.name.toLowerCase().includes(query)
    );
  }, [columns, search]);

  const selected = columns.find(
    (column) => column.name === selectedColumn
  );

  return (
    <section className="border-b border-white/10 px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Column Explorer
          </h2>

          <span className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-2.5 py-1 text-[11px] font-medium text-indigo-300">
            {columns.length.toLocaleString()} columns
          </span>
        </div>

        <p className="mt-1.5 max-w-3xl text-sm leading-6 text-white/50">
          Search and inspect individual columns in detail,
          including their structure, distribution, and
          numerical statistics.
        </p>
      </div>

      {/* Explorer */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        {/* Search */}
        <div className="border-b border-white/10 bg-white/[0.015] p-5">
          <div className="relative">
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
              ⌕
            </div>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search columns..."
              className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 hover:border-white/20 focus:border-cyan-400/40 focus:bg-black/30 focus:ring-1 focus:ring-cyan-400/20"
            />
          </div>

          {search.trim() && (
            <p className="mt-2 text-xs text-white/30">
              {filteredColumns.length.toLocaleString()}{" "}
              {filteredColumns.length === 1
                ? "column"
                : "columns"}{" "}
              matching "{search}"
            </p>
          )}
        </div>

        <div className="grid min-h-[520px] lg:grid-cols-[320px_1fr]">
          {/* Column list */}
          <div className="border-b border-white/10 bg-black/10 lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                Columns
              </span>

              <span className="text-xs tabular-nums text-white/25">
                {filteredColumns.length}
              </span>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
              {filteredColumns.length === 0 ? (
                <div className="flex min-h-[180px] items-center justify-center p-5 text-center">
                  <div>
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/30">
                      ?
                    </div>

                    <p className="mt-3 text-sm text-white/45">
                      No columns match your search.
                    </p>
                  </div>
                </div>
              ) : (
                filteredColumns.map((column) => {
                  const isSelected =
                    selectedColumn === column.name;

                  return (
                    <button
                      key={column.name}
                      type="button"
                      onClick={() =>
                        setSelectedColumn(column.name)
                      }
                      className={`group relative w-full border-b border-white/[0.06] px-5 py-4 text-left transition-all ${
                        isSelected
                          ? "bg-cyan-400/[0.07]"
                          : "hover:bg-white/[0.035]"
                      }`}
                    >
                      {/* Active indicator */}
                      {isSelected && (
                        <div className="absolute left-0 top-0 h-full w-0.5 bg-cyan-400" />
                      )}

                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={`min-w-0 truncate text-sm font-medium ${
                            isSelected
                              ? "text-white"
                              : "text-white/65 group-hover:text-white/85"
                          }`}
                          title={column.name}
                        >
                          {column.name}
                        </span>

                        <TypeBadge type={column.type} />
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-3">
                        <span className="text-xs text-white/30">
                          {column.uniqueValues.toLocaleString()}{" "}
                          unique
                        </span>

                        {column.nullCount > 0 && (
                          <span className="text-[11px] text-amber-300/70">
                            {column.nullPercentage.toFixed(1)}% missing
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Detail panel */}
          <div className="min-w-0 p-6">
            {!selected ? (
              <div className="flex min-h-[400px] items-center justify-center text-sm text-white/30">
                Select a column to inspect it.
              </div>
            ) : (
              <ColumnDetails column={selected} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function TypeBadge({
  type,
}: {
  type: ColumnAnalysis["type"];
}) {
  const styles = {
    number:
      "border-blue-400/20 bg-blue-400/10 text-blue-300",
    date:
      "border-violet-400/20 bg-violet-400/10 text-violet-300",
    text:
      "border-white/10 bg-white/[0.04] text-white/45",
  };

  return (
    <span
      className={`shrink-0 rounded-md border px-2 py-1 text-[10px] font-medium uppercase tracking-wide ${styles[type]}`}
    >
      {type}
    </span>
  );
}

function ColumnDetails({
  column,
}: {
  column: ColumnAnalysis;
}) {
  return (
    <div className="space-y-6">
      {/* Column title */}
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h3
            className="max-w-full truncate text-xl font-semibold tracking-tight text-white"
            title={column.name}
          >
            {column.name}
          </h3>

          <TypeBadge type={column.type} />
        </div>

        <p className="mt-2 text-sm text-white/40">
          Detailed inspection of this column.
        </p>
      </div>

      {/* Core metrics */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Total values"
          value={column.totalValues.toLocaleString()}
          accent="cyan"
        />

        <Metric
          label="Unique values"
          value={column.uniqueValues.toLocaleString()}
          accent="blue"
        />

        <Metric
          label="Unique %"
          value={`${column.uniquePercentage.toFixed(2)}%`}
          accent="violet"
        />

        <Metric
          label="Missing"
          value={`${column.nullCount.toLocaleString()} (${column.nullPercentage.toFixed(
            2
          )}%)`}
          accent={
            column.nullCount > 0
              ? "amber"
              : "emerald"
          }
        />
      </div>

      {/* Numeric statistics */}
      {column.statistics && (
        <div>
          <div className="mb-3 flex items-center gap-3">
            <h4 className="text-sm font-semibold text-white">
              Numerical Statistics
            </h4>

            <span className="rounded-full border border-blue-400/15 bg-blue-400/10 px-2 py-0.5 text-[10px] text-blue-300">
              Numeric
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <Metric
              label="Count"
              value={column.statistics.count.toLocaleString()}
              accent="blue"
            />

            <Metric
              label="Mean"
              value={formatNumber(
                column.statistics.mean
              )}
              accent="cyan"
            />

            <Metric
              label="Median"
              value={formatNumber(
                column.statistics.median
              )}
              accent="cyan"
            />

            <Metric
              label="Minimum"
              value={formatNumber(
                column.statistics.min
              )}
              accent="violet"
            />

            <Metric
              label="Maximum"
              value={formatNumber(
                column.statistics.max
              )}
              accent="violet"
            />

            <Metric
              label="Std. deviation"
              value={formatNumber(
                column.statistics.standardDeviation
              )}
              accent="blue"
            />
          </div>
        </div>
      )}

      {/* Top values */}
      {column.topValues &&
        column.topValues.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-3">
              <h4 className="text-sm font-semibold text-white">
                Most Common Values
              </h4>

              <span className="text-[10px] uppercase tracking-[0.12em] text-white/25">
                Distribution
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="grid grid-cols-[1fr_auto_auto] gap-5 border-b border-white/10 bg-white/[0.03] px-4 py-3">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                  Value
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                  Count
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                  Share
                </span>
              </div>

              {column.topValues.map(
                (item, index) => (
                  <div
                    key={`${item.value}-${index}`}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-5 border-b border-white/[0.06] px-4 py-3 last:border-b-0 hover:bg-white/[0.025]"
                  >
                    <span
                      className="min-w-0 truncate text-sm text-white/70"
                      title={item.value}
                    >
                      {item.value}
                    </span>

                    <span className="text-xs tabular-nums text-white/45">
                      {item.count.toLocaleString()}
                    </span>

                    <span className="rounded-md bg-cyan-400/[0.06] px-2 py-1 text-xs tabular-nums text-cyan-300/70">
                      {item.percentage.toFixed(2)}%
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

      {/* Interpretation */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-400/15 bg-indigo-500/[0.035] p-5">
        <div className="absolute left-0 top-0 h-full w-0.5 bg-indigo-400" />

        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-400/10 text-xs font-semibold text-indigo-300">
            i
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">
              Column interpretation
            </h4>

            <p className="mt-1.5 text-sm leading-6 text-white/50">
              {getColumnInterpretation(column)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  accent = "neutral",
}: {
  label: string;
  value: string;
  accent?:
    | "cyan"
    | "blue"
    | "violet"
    | "amber"
    | "emerald"
    | "neutral";
}) {
  const styles = {
    cyan:
      "border-cyan-400/15 bg-cyan-500/[0.025]",
    blue:
      "border-blue-400/15 bg-blue-500/[0.025]",
    violet:
      "border-violet-400/15 bg-violet-500/[0.025]",
    amber:
      "border-amber-400/15 bg-amber-500/[0.035]",
    emerald:
      "border-emerald-400/15 bg-emerald-500/[0.035]",
    neutral:
      "border-white/10 bg-white/[0.025]",
  };

  return (
    <div
      className={`rounded-xl border p-4 transition-colors hover:bg-white/[0.04] ${styles[accent]}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function formatNumber(
  value: number
): string {
  if (Number.isInteger(value)) {
    return value.toLocaleString();
  }

  return value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}

function getColumnInterpretation(
  column: ColumnAnalysis
): string {
  if (column.uniqueValues === 0) {
    return "This column does not currently contain any non-empty values.";
  }

  if (
    column.uniqueValues === 1 &&
    column.totalValues > 1
  ) {
    return "This column contains only one unique value across the dataset. It has no observed variation.";
  }

  if (
    column.type === "text" &&
    column.uniquePercentage >= 90
  ) {
    return "This text column has very high uniqueness relative to the dataset size. It may represent an identifier, free text, or another field where individual values are expected to be distinct.";
  }

  if (column.type === "number") {
    return "This column contains numerical values and can be inspected using its statistical distribution. Its usefulness depends on the role it plays in the dataset.";
  }

  if (column.type === "date") {
    return "This column contains date values and can be used to understand the temporal range and distribution of the dataset.";
  }

  return "This column contains categorical or textual values. Review its unique values and distribution to understand how it should be used.";
}