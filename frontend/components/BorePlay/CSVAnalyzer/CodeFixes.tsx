"use client";

import { useState } from "react";

import type { DatasetAnalysis } from "./csv-types";
import { getFixes } from "./csv-fixes";

type CodeFixesProps = {
  analysis: DatasetAnalysis;
};

export default function CodeFixes({
  analysis,
}: CodeFixesProps) {
  const fixes = getFixes(analysis);

  const [copiedId, setCopiedId] =
    useState<string | null>(null);

  const handleCopy = async (
    id: string,
    code: string
  ) => {
    try {
      await navigator.clipboard.writeText(code);

      setCopiedId(id);

      setTimeout(() => {
        setCopiedId(null);
      }, 1500);
    } catch {
      setCopiedId(null);
    }
  };

  if (fixes.length === 0) {
    return (
      <section className="border-b border-white/10 px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Python Fixes
            </h2>

            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
              No fixes needed
            </span>
          </div>

          <p className="mt-1.5 max-w-3xl text-sm leading-6 text-white/50">
            No deterministic fixes were generated from the
            detected dataset characteristics.
          </p>
        </div>

        {/* Empty State */}
        <div className="relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.035] p-6">
          <div className="absolute left-0 top-0 h-full w-0.5 bg-emerald-400" />

          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-sm font-semibold text-emerald-300">
              ✓
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">
                No actionable data-quality fixes detected
              </h3>

              <p className="mt-1.5 text-sm leading-6 text-white/50">
                The analyzer did not identify a deterministic
                transformation that can be safely generated from
                the available dataset facts.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-white/10 px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Python Fixes
          </h2>

          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-medium text-cyan-300">
            {fixes.length}{" "}
            {fixes.length === 1
              ? "snippet"
              : "snippets"}
          </span>
        </div>

        <p className="mt-1.5 max-w-3xl text-sm leading-6 text-white/50">
          Safe Python snippets generated from detected dataset
          characteristics. Review the code before applying it to
          your data.
        </p>
      </div>

      {/* Fixes */}
      <div className="space-y-5">
        {fixes.map((fix) => {
          const isCopied =
            copiedId === fix.id;

          return (
            <div
              key={fix.id}
              className="group overflow-hidden rounded-2xl border border-cyan-400/15 bg-cyan-500/[0.02] transition-all duration-200 hover:border-cyan-400/25"
            >
              {/* Fix Header */}
              <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.015] p-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.55)]" />

                    <h3 className="text-base font-semibold text-white">
                      {fix.title}
                    </h3>
                  </div>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-white/50">
                    {fix.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      fix.id,
                      fix.code
                    )
                  }
                  className={`shrink-0 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all ${
                    isCopied
                      ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
                      : "border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-300 hover:border-cyan-400/35 hover:bg-cyan-400/10"
                  }`}
                >
                  {isCopied
                    ? "✓ Copied"
                    : "Copy code"}
                </button>
              </div>

              {/* Code */}
              <div className="relative bg-[#071014]">
                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
                    Python
                  </span>

                  <span className="text-[10px] text-white/25">
                    Review before running
                  </span>
                </div>

                <pre className="max-h-[420px] overflow-auto p-5 text-sm leading-6 text-cyan-100/90">
                  <code>{fix.code}</code>
                </pre>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}