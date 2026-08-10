"use client";

import { useState } from "react";

type DataPreviewProps = {
  headers: string[];
  rows: Record<string, string>[];
};

export default function DataPreview({
  headers,
  rows,
}: DataPreviewProps) {
  const [previewRows, setPreviewRows] = useState(25);

  const visibleRows = rows.slice(0, previewRows);

  return (
    <section className="border-b border-white/10 px-6 py-8">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Data Preview
            </h2>

            <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-2.5 py-1 text-[11px] font-medium text-blue-300">
              Sample
            </span>
          </div>

          <p className="mt-1.5 text-sm text-white/50">
            Showing{" "}
            <span className="font-medium text-white/70">
              {Math.min(
                previewRows,
                rows.length
              ).toLocaleString()}
            </span>{" "}
            of{" "}
            <span className="font-medium text-white/70">
              {rows.length.toLocaleString()}
            </span>{" "}
            rows
          </p>
        </div>

        {/* Row selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/35">
            Preview rows
          </span>

          <select
            value={previewRows}
            onChange={(event) =>
              setPreviewRows(
                Number(event.target.value)
              )
            }
            className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none transition hover:border-white/20 focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/20"
          >
            <option
              value={10}
              className="bg-[#111111]"
            >
              10 rows
            </option>

            <option
              value={25}
              className="bg-[#111111]"
            >
              25 rows
            </option>

            <option
              value={50}
              className="bg-[#111111]"
            >
              50 rows
            </option>

            <option
              value={100}
              className="bg-[#111111]"
            >
              100 rows
            </option>
          </select>
        </div>
      </div>

      {/* Table container */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        {/* Scroll container */}
        <div className="max-h-[520px] overflow-auto">
          <table className="min-w-max border-collapse text-left text-sm">
            {/* Header */}
            <thead className="sticky top-0 z-20">
              <tr className="bg-[#10151a]">
                <th className="sticky left-0 z-30 border-b border-r border-white/10 bg-[#10151a] px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
                  #
                </th>

                {headers.map((header) => (
                  <th
                    key={header}
                    className="border-b border-white/10 px-4 py-3 text-[11px] font-semibold tracking-wide text-white/70"
                  >
                    <div className="max-w-[220px] truncate">
                      {header}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {visibleRows.map(
                (row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="group border-b border-white/[0.06] transition-colors last:border-b-0 hover:bg-cyan-400/[0.025]"
                  >
                    {/* Row number */}
                    <td className="sticky left-0 z-10 border-r border-white/[0.06] bg-[#0d1115] px-4 py-3 text-center text-xs tabular-nums text-white/25 transition-colors group-hover:bg-[#10191e]">
                      {rowIndex + 1}
                    </td>

                    {/* Cells */}
                    {headers.map((header) => {
                      const value =
                        row[header] ?? "";

                      const isEmpty =
                        value.trim() === "";

                      return (
                        <td
                          key={`${rowIndex}-${header}`}
                          className="max-w-[300px] px-4 py-3 align-top text-white/65"
                          title={
                            isEmpty
                              ? "Missing value"
                              : value
                          }
                        >
                          <div className="max-w-[300px] truncate">
                            {isEmpty ? (
                              <span className="inline-flex items-center rounded-md border border-amber-400/10 bg-amber-400/[0.04] px-1.5 py-0.5 text-xs italic text-amber-300/50">
                                null
                              </span>
                            ) : (
                              value
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom table status */}
        <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.015] px-4 py-2.5">
          <span className="text-[11px] text-white/30">
            {headers.length.toLocaleString()} columns
          </span>

          <span className="text-[11px] text-white/30">
            Horizontal scroll available
          </span>
        </div>
      </div>
    </section>
  );
}