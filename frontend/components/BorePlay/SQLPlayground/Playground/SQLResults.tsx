"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useSQLPlayground } from "../Hooks/useSQLPlayground";

interface SQLResultsProps {
  sql: ReturnType<typeof useSQLPlayground>;
}

export default function SQLResults({
  sql,
}: SQLResultsProps) {
  // Loading

  if (sql.loading) {
    return (
      <section
        className="
          flex
          h-full
          items-center
          justify-center
          rounded-2xl
          border
          border-white/10
          bg-[#0d1117]
        "
      >
        <div className="text-center">
          <p className="text-lg font-medium text-white">
            Running Query...
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Executing against Demo Database
          </p>
        </div>
      </section>
    );
  }

  // Error

  if (sql.error) {
    return (
      <section
        className="
          overflow-hidden
          rounded-2xl
          border
          border-red-500/20
          bg-[#0d1117]
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            border-b
            border-red-500/20
            bg-red-500/10
            px-6
            py-4
          "
        >
          <AlertCircle
            size={20}
            className="text-red-400"
          />

          <div>
            <h3 className="font-semibold text-red-300">
              Query Failed
            </h3>

            <p className="text-xs text-red-400">
              SQL execution returned an error.
            </p>
          </div>
        </div>

        <div className="p-6">
          <pre
            className="
              overflow-x-auto
              rounded-xl
              border
              border-red-500/20
              bg-black/30
              p-4
              text-sm
              text-red-300
            "
          >
            {sql.error}
          </pre>
        </div>
      </section>
    );
  }

  // Empty

  if (sql.result.length === 0) {
    return (
      <section
        className="
          flex
          h-full
          items-center
          justify-center
          rounded-2xl
          border
          border-white/10
          bg-[#0d1117]
        "
      >
        <div className="text-center">
          <p className="text-lg font-medium text-white">
            No Results Yet
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Run your first SQL query to explore the demo database.
          </p>
        </div>
      </section>
    );
  }

  const columns = Object.keys(sql.result[0]);

  return (
    <section
      className="
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-[#0d1117]
      "
    >
      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-white/10
          px-6
          py-4
        "
      >
        <div className="flex items-center gap-3">
          <CheckCircle2
            size={18}
            className="text-green-400"
          />

          <h3 className="font-semibold text-white">
            Results
          </h3>
        </div>

        <div className="flex items-center gap-6 text-sm text-zinc-400">
          <span>
            {sql.rowsReturned} rows
          </span>

          <span>
            {sql.executionTime} ms
          </span>
        </div>
      </div>

      {/* Table */}

      <div className="flex-1 overflow-auto">

        <table className="min-w-full border-collapse text-sm">

          <thead className="sticky top-0 z-10 bg-[#1b1f27]">

            <tr>

              {columns.map((column) => (

                <th
                  key={column}
                  className="
                    whitespace-nowrap
                    border-b
                    border-white/10
                    px-5
                    py-3
                    text-left
                    font-semibold
                    text-white
                  "
                >
                  {column}
                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {sql.result.map((row, rowIndex) => (

              <tr
                key={rowIndex}
                className="
                  border-b
                  border-white/5
                  transition
                  hover:bg-cyan-500/5
                "
              >

                {columns.map((column) => (

                  <td
                    key={column}
                    className="
                      whitespace-nowrap
                      px-5
                      py-3
                      text-zinc-200
                    "
                  >
                    {String(
                      row[
                        column as keyof typeof row
                      ]
                    )}
                  </td>

                ))}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>
  );
}