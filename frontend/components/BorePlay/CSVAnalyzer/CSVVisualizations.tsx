"use client";

import { useMemo, useState, type ReactNode } from "react";

import type {
  CSVRow,
  ColumnAnalysis,
} from "./csv-types";

interface CSVVisualizationsProps {
  headers: string[];
  rows: CSVRow[];
  columns: ColumnAnalysis[];
}

interface HistogramBin {
  min: number;
  max: number;
  count: number;
}

interface CategoryValue {
  value: string;
  count: number;
}

interface DatePoint {
  date: Date;
  count: number;
}

function isMissing(value: string | undefined): boolean {
  return value === undefined || value.trim() === "";
}

function parseNumericValue(
  value: string | undefined
): number | null {
  if (value === undefined) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  // Preserve values such as 00123 as text.
  if (/^0\d+$/.test(trimmed)) {
    return null;
  }

  const number = Number(trimmed);

  return Number.isFinite(number) ? number : null;
}

function parseDateValue(
  value: string | undefined
): Date | null {
  if (!value || !value.trim()) {
    return null;
  }

  const trimmed = value.trim();

  // YYYY-MM-DD
  const isoMatch = trimmed.match(
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/
  );

  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]) - 1;
    const day = Number(isoMatch[3]);

    const date = new Date(year, month, day);

    return Number.isNaN(date.getTime())
      ? null
      : date;
  }

  // DD-MM-YYYY / DD/MM/YYYY
  const dmyMatch = trimmed.match(
    /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/
  );

  if (dmyMatch) {
    const day = Number(dmyMatch[1]);
    const month = Number(dmyMatch[2]) - 1;
    const year = Number(dmyMatch[3]);

    const date = new Date(
      year,
      month,
      day
    );

    return Number.isNaN(date.getTime())
      ? null
      : date;
  }

  return null;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatInteger(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function buildHistogram(
  values: number[],
  binCount = 10
): HistogramBin[] {
  if (values.length === 0) {
    return [];
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    return [
      {
        min,
        max,
        count: values.length,
      },
    ];
  }

  const width = (max - min) / binCount;

  const bins = Array.from(
    { length: binCount },
    (_, index) => ({
      min: min + index * width,
      max:
        index === binCount - 1
          ? max
          : min + (index + 1) * width,
      count: 0,
    })
  );

  for (const value of values) {
    let index = Math.floor(
      (value - min) / width
    );

    if (index >= binCount) {
      index = binCount - 1;
    }

    if (index < 0) {
      index = 0;
    }

    bins[index].count += 1;
  }

  return bins;
}

function getTopCategories(
  values: string[],
  limit = 10
): CategoryValue[] {
  const counts = new Map<string, number>();

  for (const value of values) {
    if (isMissing(value)) {
      continue;
    }

    counts.set(
      value,
      (counts.get(value) ?? 0) + 1
    );
  }

  return Array.from(counts.entries())
    .map(([value, count]) => ({
      value,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function getColumnValues(
  rows: CSVRow[],
  column: string
): string[] {
  return rows.map(
    (row) => row[column] ?? ""
  );
}

/**
 * Identifier-like means the column contains a very
 * high proportion of unique values.
 *
 * This is an observation, not a declaration that
 * the column IS an identifier.
 */
function isIdentifierLike(
  column: ColumnAnalysis,
  rowCount: number
): boolean {
  if (rowCount === 0) {
    return false;
  }

  const uniquenessRatio =
    column.uniqueValues / rowCount;

  return (
    uniquenessRatio >= 0.8 &&
    column.uniqueValues >= 20
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold tracking-tight text-white">
        {title}
      </h2>

      <p className="mt-1.5 text-sm leading-6 text-white/45">
        {description}
      </p>
    </div>
  );
}

function EmptyState({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] px-5 py-8 text-center text-sm text-white/45">
      {children}
    </div>
  );
}

function AxisTitle({
  children,
  vertical = false,
}: {
  children: ReactNode;
  vertical?: boolean;
}) {
  if (vertical) {
    return (
      <span className="absolute bottom-1/2 left-0 -translate-x-[38%] translate-y-1/2 -rotate-90 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.12em] text-white/75">
        {children}
      </span>
    );
  }

  return (
    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/75">
      {children}
    </span>
  );
}

function ChartCard({
  children,
  accent = "cyan",
}: {
  children: ReactNode;
  accent?: "cyan" | "violet";
}) {
  const accentClasses =
    accent === "cyan"
      ? "border-cyan-400/10 bg-gradient-to-br from-cyan-400/[0.035] via-[#111111] to-blue-500/[0.025]"
      : "border-violet-400/10 bg-gradient-to-br from-violet-400/[0.035] via-[#111111] to-fuchsia-500/[0.025]";

  return (
    <div
      className={`overflow-hidden rounded-2xl border ${accentClasses}`}
    >
      {children}
    </div>
  );
}

export default function CSVVisualizations({
  headers,
  rows,
  columns,
}: CSVVisualizationsProps) {
  /*
   * -----------------------------
   * COLUMN GROUPS
   * -----------------------------
   */

  const numericColumns = useMemo(
    () =>
      columns.filter(
        (column) => column.type === "number"
      ),
    [columns]
  );

  const textColumns = useMemo(
    () =>
      columns.filter(
        (column) => column.type === "text"
      ),
    [columns]
  );

  const dateColumns = useMemo(
    () =>
      columns.filter(
        (column) => column.type === "date"
      ),
    [columns]
  );

  /*
   * -----------------------------
   * CATEGORICAL FILTERING
   * -----------------------------
   */

  const categoricalColumns = useMemo(
    () =>
      textColumns.filter(
        (column) =>
          !isIdentifierLike(
            column,
            rows.length
          )
      ),
    [textColumns, rows.length]
  );

  const identifierLikeColumns = useMemo(
    () =>
      textColumns.filter(
        (column) =>
          isIdentifierLike(
            column,
            rows.length
          )
      ),
    [textColumns, rows.length]
  );

  /*
   * -----------------------------
   * SELECTED COLUMNS
   * -----------------------------
   */

  const [
    selectedNumericColumn,
    setSelectedNumericColumn,
  ] = useState<string>(
    numericColumns[0]?.name ?? ""
  );

  const [
    selectedTextColumn,
    setSelectedTextColumn,
  ] = useState<string>(
    categoricalColumns[0]?.name ?? ""
  );

  /*
   * -----------------------------
   * NUMERIC DATA
   * -----------------------------
   */

  const selectedNumericValues = useMemo(() => {
    if (!selectedNumericColumn) {
      return [];
    }

    return getColumnValues(
      rows,
      selectedNumericColumn
    )
      .map(parseNumericValue)
      .filter(
        (value): value is number =>
          value !== null
      );
  }, [
    rows,
    selectedNumericColumn,
  ]);

  const histogram = useMemo(
    () =>
      buildHistogram(
        selectedNumericValues
      ),
    [selectedNumericValues]
  );

  const maxHistogramCount =
    histogram.length > 0
      ? Math.max(
          ...histogram.map(
            (bin) => bin.count
          )
        )
      : 0;

  const histogramTotal =
    selectedNumericValues.length;

  /*
   * -----------------------------
   * CATEGORICAL DATA
   * -----------------------------
   */

  const selectedTextValues = useMemo(() => {
    if (!selectedTextColumn) {
      return [];
    }

    return getColumnValues(
      rows,
      selectedTextColumn
    );
  }, [
    rows,
    selectedTextColumn,
  ]);

  const categories = useMemo(
    () =>
      getTopCategories(
        selectedTextValues
      ),
    [selectedTextValues]
  );

  const maxCategoryCount =
    categories.length > 0
      ? Math.max(
          ...categories.map(
            (item) => item.count
          )
        )
      : 0;

  /*
   * -----------------------------
   * MISSING VALUES
   * -----------------------------
   */

  const missingColumns = useMemo(
    () =>
      columns
        .filter(
          (column) =>
            column.nullCount > 0
        )
        .sort(
          (a, b) =>
            b.nullCount -
            a.nullCount
        ),
    [columns]
  );

  const maxMissing =
    missingColumns.length > 0
      ? missingColumns[0].nullCount
      : 0;

  /*
   * -----------------------------
   * DATE DATA
   * -----------------------------
   */

  const dateSummary = useMemo(() => {
    if (dateColumns.length === 0) {
      return [];
    }

    return dateColumns.map(
      (column) => {
        const dates = getColumnValues(
          rows,
          column.name
        )
          .map(parseDateValue)
          .filter(
            (date): date is Date =>
              date !== null
          )
          .sort(
            (a, b) =>
              a.getTime() -
              b.getTime()
          );

        return {
          column: column.name,
          count: dates.length,
          min: dates[0] ?? null,
          max:
            dates[dates.length - 1] ??
            null,
        };
      }
    );
  }, [
    dateColumns,
    rows,
  ]);

  /*
   * -----------------------------
   * DATE DISTRIBUTION
   * -----------------------------
   */

  const selectedDateColumn =
    dateColumns[0]?.name ?? "";

  const dateDistribution =
    useMemo<DatePoint[]>(() => {
      if (!selectedDateColumn) {
        return [];
      }

      const counts = new Map<
        string,
        {
          date: Date;
          count: number;
        }
      >();

      for (const value of getColumnValues(
        rows,
        selectedDateColumn
      )) {
        const date =
          parseDateValue(value);

        if (!date) {
          continue;
        }

        const key =
          date.toISOString().slice(0, 10);

        const existing =
          counts.get(key);

        if (existing) {
          existing.count += 1;
        } else {
          counts.set(key, {
            date,
            count: 1,
          });
        }
      }

      return Array.from(
        counts.values()
      )
        .sort(
          (a, b) =>
            a.date.getTime() -
            b.date.getTime()
        )
        .slice(0, 30);
    }, [
      rows,
      selectedDateColumn,
    ]);

  const maxDateCount =
    dateDistribution.length > 0
      ? Math.max(
          ...dateDistribution.map(
            (item) => item.count
          )
        )
      : 0;

  /*
   * headers is intentionally accepted as part
   * of the public visualization interface.
   */
  void headers;

  return (
    <section className="border-t border-white/10 px-2.5 pt-8">
      {/* =========================================
          SECTION HEADER
      ========================================= */}

      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-white">
          Visual Analysis
        </h2>

        <p className="mt-1.5 text-sm leading-6 text-white/50">
          Explore distributions and patterns using
          values directly detected in the uploaded CSV.
        </p>
      </div>

      {/* =========================================
          MISSING VALUES
      ========================================= */}

      <ChartCard accent="cyan">
        <div className="p-5">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">
                Missing Values by Column
              </h3>

              <p className="mt-1 text-sm text-white/45">
                Distribution of empty cells across the dataset.
              </p>
            </div>

            {missingColumns.length > 0 && (
              <span className="w-fit rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">
                {missingColumns.length} affected{" "}
                {missingColumns.length === 1
                  ? "column"
                  : "columns"}
              </span>
            )}
          </div>

          {missingColumns.length === 0 ? (
            <EmptyState>
              No missing values to visualize.
            </EmptyState>
          ) : (
            <div className="space-y-4">
              {missingColumns.map(
                (column) => {
                  const width =
                    maxMissing > 0
                      ? (column.nullCount /
                          maxMissing) *
                        100
                      : 0;

                  return (
                    <div
                      key={column.name}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="truncate text-sm font-medium text-white/70">
                          {column.name}
                        </span>

                        <span className="shrink-0 text-xs tabular-nums text-white/50">
                          {formatInteger(
                            column.nullCount
                          )}{" "}
                          cells ·{" "}
                          {column.nullPercentage.toFixed(
                            2
                          )}
                          %
                        </span>
                      </div>

                      <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-500"
                          style={{
                            width: `${width}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </ChartCard>

      {/* =========================================
          NUMERIC DISTRIBUTION
      ========================================= */}

      <ChartCard accent="cyan">
        <div className="p-5">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">
                Numeric Distribution
              </h3>

              <p className="mt-1 text-sm text-white/45">
                Inspect how numeric values are distributed across ranges.
              </p>
            </div>

            {numericColumns.length > 0 && (
              <select
                value={selectedNumericColumn}
                onChange={(event) =>
                  setSelectedNumericColumn(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-cyan-400/20 bg-black/30 px-3 py-2 text-sm text-white outline-none transition hover:border-cyan-400/30 focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/20 sm:w-auto"
              >
                {numericColumns.map(
                  (column) => (
                    <option
                      key={column.name}
                      value={column.name}
                      className="bg-[#111111]"
                    >
                      {column.name}
                    </option>
                  )
                )}
              </select>
            )}
          </div>

          {numericColumns.length === 0 ? (
            <EmptyState>
              No numeric columns were detected.
            </EmptyState>
          ) : histogram.length === 0 ? (
            <EmptyState>
              No numeric values are available for this column.
            </EmptyState>
          ) : (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs text-white/45">
                  {formatInteger(
                    histogramTotal
                  )}{" "}
                  numeric values
                </span>

                <span className="rounded-md bg-cyan-400/[0.07] px-2.5 py-1 text-xs font-medium text-cyan-300/80">
                  {selectedNumericColumn}
                </span>
              </div>

              <div className="flex">
                {/* Y AXIS */}

                <div className="relative flex w-16 shrink-0 flex-col justify-between pb-10 pr-4 text-right text-[10px] tabular-nums text-white/50">
                  <span>
                    {formatInteger(
                      maxHistogramCount
                    )}
                  </span>

                  <span>
                    {formatInteger(
                      maxHistogramCount *
                        0.75
                    )}
                  </span>

                  <span>
                    {formatInteger(
                      maxHistogramCount *
                        0.5
                    )}
                  </span>

                  <span>
                    {formatInteger(
                      maxHistogramCount *
                        0.25
                    )}
                  </span>

                  <span>0</span>

                  <AxisTitle vertical>
                    Number of Rows
                  </AxisTitle>
                </div>

                {/* CHART */}

                <div className="min-w-0 flex-1 overflow-x-auto">
                  <div className="min-w-[680px]">
                    <div
                      className="relative flex items-end gap-2 border-b border-l border-white/15 px-2"
                      style={{
                        height: "280px",
                      }}
                    >
                      {/* Grid */}

                      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                        {[0, 1, 2, 3, 4].map(
                          (line) => (
                            <div
                              key={line}
                              className="border-t border-white/[0.07]"
                            />
                          )
                        )}
                      </div>

                      {histogram.map(
                        (bin, index) => {
                          const height =
                            maxHistogramCount >
                            0
                              ? Math.max(
                                  (bin.count /
                                    maxHistogramCount) *
                                    100,
                                  bin.count >
                                    0
                                    ? 2
                                    : 0
                                )
                              : 0;

                          const percentage =
                            histogramTotal >
                            0
                              ? (bin.count /
                                  histogramTotal) *
                                100
                              : 0;

                          return (
                            <div
                              key={`${bin.min}-${index}`}
                              className="group relative z-10 flex h-full min-w-0 flex-1 items-end"
                            >
                              <div
                                className="w-full rounded-t-md bg-gradient-to-t from-blue-600 via-cyan-500 to-cyan-300 opacity-80 shadow-[0_-4px_16px_rgba(34,211,238,0.08)] transition-all duration-200 group-hover:opacity-100 group-hover:shadow-[0_-4px_20px_rgba(34,211,238,0.18)]"
                                style={{
                                  height: `${height}%`,
                                }}
                                title={`${formatNumber(
                                  bin.min
                                )} – ${formatNumber(
                                  bin.max
                                )}\n${formatInteger(
                                  bin.count
                                )} rows\n${percentage.toFixed(
                                  1
                                )}% of values`}
                              />
                            </div>
                          );
                        }
                      )}
                    </div>

                    {/* X SCALE */}

                    <div className="mt-2 flex justify-between px-2 text-[10px] tabular-nums text-white/45">
                      <span>
                        {formatNumber(
                          histogram[0].min
                        )}
                      </span>

                      <span>
                        {formatNumber(
                          histogram[
                            Math.floor(
                              histogram.length /
                                2
                            )
                          ].min
                        )}
                      </span>

                      <span>
                        {formatNumber(
                          histogram[
                            histogram.length -
                              1
                          ].max
                        )}
                      </span>
                    </div>

                    {/* X TITLE */}

                    <div className="mt-3 text-center">
                      <AxisTitle>
                        {selectedNumericColumn}
                      </AxisTitle>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-white/35">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                Hover over a bar to inspect its range and row count.
              </div>
            </div>
          )}
        </div>
      </ChartCard>

      {/* =========================================
          CATEGORICAL DISTRIBUTION
      ========================================= */}

      <ChartCard accent="violet">
        <div className="p-5">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">
                Top Categorical Values
              </h3>

              <p className="mt-1 text-sm text-white/45">
                Shows the most frequent values in a categorical column.
              </p>
            </div>

            {categoricalColumns.length > 0 && (
              <select
                value={selectedTextColumn}
                onChange={(event) =>
                  setSelectedTextColumn(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-violet-400/20 bg-black/30 px-3 py-2 text-sm text-white outline-none transition hover:border-violet-400/30 focus:border-violet-400/60 focus:ring-1 focus:ring-violet-400/20 sm:w-auto"
              >
                {categoricalColumns.map(
                  (column) => (
                    <option
                      key={column.name}
                      value={column.name}
                      className="bg-[#111111]"
                    >
                      {column.name}
                    </option>
                  )
                )}
              </select>
            )}
          </div>

          {categoricalColumns.length === 0 ? (
            <EmptyState>
              No suitable categorical columns were detected.

              {identifierLikeColumns.length >
                0 && (
                <div className="mt-2 text-xs text-white/30">
                  {identifierLikeColumns.length}{" "}
                  identifier-like{" "}
                  {identifierLikeColumns.length ===
                  1
                    ? "column was"
                    : "columns were"}{" "}
                  excluded because most values are unique.
                </div>
              )}
            </EmptyState>
          ) : categories.length === 0 ? (
            <EmptyState>
              No categorical values are available for this column.
            </EmptyState>
          ) : (
            <div>
              {/* X AXIS TITLE */}

              <div className="mb-4 ml-[168px] text-center">
                <AxisTitle>
                  Number of Rows
                </AxisTitle>
              </div>

              <div className="space-y-3">
                {categories.map(
                  (item) => {
                    const width =
                      maxCategoryCount >
                      0
                        ? (item.count /
                            maxCategoryCount) *
                          100
                        : 0;

                    const percentage =
                      selectedTextValues.length >
                      0
                        ? (item.count /
                            selectedTextValues.length) *
                          100
                        : 0;

                    return (
                      <div
                        key={item.value}
                        className="group grid grid-cols-[150px_minmax(0,1fr)_65px] items-center gap-3"
                      >
                        {/* Y AXIS */}

                        <span
                          className="truncate text-sm font-medium text-white/65"
                          title={item.value}
                        >
                          {item.value}
                        </span>

                        {/* BAR */}

                        <div className="relative h-8 overflow-hidden rounded-md border border-white/[0.04] bg-white/[0.035]">
                          <div
                            className="h-full rounded-md bg-gradient-to-r from-violet-600 via-violet-500 to-fuchsia-400 opacity-85 transition-all duration-200 group-hover:opacity-100"
                            style={{
                              width: `${width}%`,
                            }}
                            title={`${item.value}\n${formatInteger(
                              item.count
                            )} rows\n${percentage.toFixed(
                              1
                            )}% of values`}
                          />
                        </div>

                        {/* COUNT */}

                        <span className="text-right text-xs font-medium tabular-nums text-white/55">
                          {formatInteger(
                            item.count
                          )}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>

              {/* X SCALE */}

              <div className="mt-3 ml-[163px] flex justify-between text-[10px] tabular-nums text-white/35">
                <span>0</span>

                <span>
                  {formatInteger(
                    maxCategoryCount *
                      0.5
                  )}
                </span>

                <span>
                  {formatInteger(
                    maxCategoryCount
                  )}
                </span>
              </div>

              {identifierLikeColumns.length >
                0 && (
                <div className="mt-5 rounded-xl border border-indigo-400/10 bg-indigo-400/[0.035] px-4 py-3 text-xs leading-5 text-white/40">
                  Identifier-like columns were excluded from this frequency chart because their high uniqueness would make the distribution difficult to interpret.
                </div>
              )}
            </div>
          )}
        </div>
      </ChartCard>

      {/* =========================================
          DATE OVERVIEW
      ========================================= */}

      <ChartCard accent="violet">
        <div className="p-5">
          <div className="mb-6">
            <h3 className="text-base font-semibold text-white">
              Date Overview
            </h3>

            <p className="mt-1 text-sm text-white/45">
              Shows the temporal range detected in date columns.
            </p>
          </div>

          {dateSummary.length === 0 ? (
            <EmptyState>
              No date columns were detected.
            </EmptyState>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {dateSummary.map(
                (summary) => (
                  <div
                    key={summary.column}
                    className="rounded-xl border border-violet-400/10 bg-violet-400/[0.025] p-4 transition hover:border-violet-400/20 hover:bg-violet-400/[0.04]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-violet-400" />

                      <div className="truncate text-sm font-medium text-white">
                        {summary.column}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-black/20 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/30">
                          Earliest
                        </p>

                        <p className="mt-1.5 text-sm text-white/75">
                          {summary.min
                            ? formatDate(
                                summary.min
                              )
                            : "—"}
                        </p>
                      </div>

                      <div className="rounded-lg bg-black/20 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/30">
                          Latest
                        </p>

                        <p className="mt-1.5 text-sm text-white/75">
                          {summary.max
                            ? formatDate(
                                summary.max
                              )
                            : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-white/35">
                      {formatInteger(
                        summary.count
                      )}{" "}
                      valid date values
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </ChartCard>

      {/* =========================================
          DATE DISTRIBUTION
      ========================================= */}

      {dateColumns.length > 0 && (
        <ChartCard accent="violet">
          <div className="p-5">
            <div className="mb-6">
              <h3 className="text-base font-semibold text-white">
                Date Distribution
              </h3>

              <p className="mt-1 text-sm text-white/45">
                Shows the number of records across detected dates.
              </p>
            </div>

            {dateDistribution.length === 0 ? (
              <EmptyState>
                No valid date values are available for visualization.
              </EmptyState>
            ) : (
              <div>
                <div className="flex">
                  {/* Y AXIS */}

                  <div className="relative flex w-16 shrink-0 flex-col justify-between border-b border-white/15 pb-10 pr-4 text-right text-[10px] tabular-nums text-white/45">
                    <span>
                      {formatInteger(
                        maxDateCount
                      )}
                    </span>

                    <span>
                      {formatInteger(
                        maxDateCount *
                          0.5
                      )}
                    </span>

                    <span>0</span>

                    <AxisTitle vertical>
                      Number of Rows
                    </AxisTitle>
                  </div>

                  {/* CHART */}

                  <div className="min-w-0 flex-1 overflow-x-auto">
                    <div className="min-w-[700px]">
                      <div
                        className="relative flex items-end gap-1 border-b border-white/15"
                        style={{
                          height: "240px",
                        }}
                      >
                        {/* Grid */}

                        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                          {[0, 1, 2].map(
                            (line) => (
                              <div
                                key={line}
                                className="border-t border-white/[0.06]"
                              />
                            )
                          )}
                        </div>

                        {dateDistribution.map(
                          (item) => {
                            const height =
                              maxDateCount >
                              0
                                ? Math.max(
                                    (item.count /
                                      maxDateCount) *
                                      100,
                                    2
                                  )
                                : 0;

                            return (
                              <div
                                key={item.date.toISOString()}
                                className="group relative z-10 flex h-full min-w-0 flex-1 items-end"
                              >
                                <div
                                  className="w-full rounded-t-sm bg-gradient-to-t from-violet-600 via-purple-500 to-fuchsia-400 opacity-80 transition-all duration-200 group-hover:opacity-100"
                                  style={{
                                    height: `${height}%`,
                                  }}
                                  title={`${formatDate(
                                    item.date
                                  )}\n${formatInteger(
                                    item.count
                                  )} rows`}
                                />
                              </div>
                            );
                          }
                        )}
                      </div>

                      {/* X SCALE */}

                      <div className="mt-2 flex justify-between text-[10px] tabular-nums text-white/40">
                        <span>
                          {formatDate(
                            dateDistribution[0]
                              .date
                          )}
                        </span>

                        <span>
                          {formatDate(
                            dateDistribution[
                              Math.floor(
                                dateDistribution.length /
                                  2
                              )
                            ].date
                          )}
                        </span>

                        <span>
                          {formatDate(
                            dateDistribution[
                              dateDistribution.length -
                                1
                            ].date
                          )}
                        </span>
                      </div>

                      {/* X TITLE */}

                      <div className="mt-3 text-center">
                        <AxisTitle>
                          {selectedDateColumn}
                        </AxisTitle>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-white/35">
                  <span className="h-2 w-2 rounded-full bg-fuchsia-400" />
                  Hover over a bar to inspect the date and row count.
                </div>
              </div>
            )}
          </div>
        </ChartCard>
      )}
    </section>
  );
}