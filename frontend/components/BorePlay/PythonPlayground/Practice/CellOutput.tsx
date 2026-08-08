"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
} from "lucide-react";

interface CellOutputProps {
  output: string;
  error: string | null;
  executionTime: number;
  plots?: string[];
}

export default function CellOutput({
  output,
  error,
  executionTime,
  plots = [],
}: CellOutputProps) {
  const hasError = Boolean(error);
  const hasOutput = Boolean(output);
  const hasPlots = plots.length > 0;

  return (
    <div className="border-t border-white/10 bg-[#0B0F14]">

      {/* ================================================== */}
      {/* OUTPUT HEADER */}
      {/* ================================================== */}

      <div className="flex items-center justify-between px-4 py-2.5">

        <div className="flex items-center gap-2">

          {hasError ? (
            <AlertCircle
              size={14}
              className="text-red-400"
            />
          ) : (
            <CheckCircle2
              size={14}
              className="text-emerald-400"
            />
          )}

          <span
            className={`text-xs font-medium ${
              hasError
                ? "text-red-400"
                : "text-gray-400"
            }`}
          >
            {hasError ? "Error" : "Out"}
          </span>

        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock3 size={12} />

          {executionTime.toFixed(2)} ms
        </div>

      </div>

      {/* ================================================== */}
      {/* OUTPUT CONTENT */}
      {/* ================================================== */}

      <div className="px-4 pb-4">

        <div
          className={`max-h-[520px] overflow-auto rounded-lg border ${
            hasError
              ? "border-red-500/20 bg-red-500/[0.03]"
              : "border-white/[0.04] bg-[#080B0F]"
          }`}
        >

          {/* ---------------------------------------------- */}
          {/* ERROR */}
          {/* ---------------------------------------------- */}

          {hasError && (
            <pre className="w-max min-w-full whitespace-pre-wrap p-4 font-mono text-sm leading-6 text-red-300">
              {error}
            </pre>
          )}

          {/* ---------------------------------------------- */}
          {/* TEXT / DATAFRAME OUTPUT */}
          {/* ---------------------------------------------- */}

          {!hasError && hasOutput && (
            <pre className="w-max min-w-full whitespace-pre-wrap p-4 font-mono text-sm leading-6 text-gray-200">
              {output}
            </pre>
          )}

          {/* ---------------------------------------------- */}
          {/* MATPLOTLIB OUTPUT */}
          {/* ---------------------------------------------- */}

          {!hasError && hasPlots && (
            <div className="flex min-w-max flex-col gap-4 p-4">

              {plots.map((plot, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg border border-white/10 bg-white"
                >
                  <img
                    src={plot}
                    alt={`Matplotlib figure ${index + 1}`}
                    className="block h-auto max-w-none"
                  />
                </div>
              ))}

            </div>
          )}

          {/* ---------------------------------------------- */}
          {/* EMPTY OUTPUT */}
          {/* ---------------------------------------------- */}

          {!hasError &&
            !hasOutput &&
            !hasPlots && (
              <div className="flex min-h-[58px] items-center px-4 text-sm text-gray-600">
                No output
              </div>
            )}

        </div>

      </div>

    </div>
  );
}