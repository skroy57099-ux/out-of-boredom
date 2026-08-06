"use client";

import {
  Play,
  LoaderCircle,
  RotateCcw,
  Copy,
  Database,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import { useSQLPlayground } from "../Hooks/useSQLPlayground";

interface SQLToolbarProps {
  sql: ReturnType<typeof useSQLPlayground>;
}

export default function SQLToolbar({
  sql,
}: SQLToolbarProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0d1117] px-6 py-4">

      <div className="flex flex-wrap items-center justify-between gap-5">

        {/* Left */}

        <div className="flex flex-wrap gap-3">

          <button
            onClick={sql.runQuery}
            disabled={sql.loading}
            className="
              flex
              items-center
              gap-2
              rounded-lg
              bg-cyan-500
              px-4
              py-2
              font-medium
              text-black
              transition
              hover:bg-cyan-400
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {sql.loading ? (
              <>
                <LoaderCircle
                  size={16}
                  className="animate-spin"
                />
                Running...
              </>
            ) : (
              <>
                <Play size={16} />
                Run Query
              </>
            )}
          </button>

          <button
            className="
              flex
              items-center
              gap-2
              rounded-lg
              border
              border-white/10
              px-4
              py-2
              hover:bg-white/5
            "
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            className="
              flex
              items-center
              gap-2
              rounded-lg
              border
              border-white/10
              px-4
              py-2
              hover:bg-white/5
            "
          >
            <Copy size={16} />
            Copy
          </button>

        </div>

        {/* Right */}

        <div className="flex flex-wrap gap-6 text-sm">

          <div className="flex items-center gap-2">
            <Database size={15} />
            DemoDB
          </div>

          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle2 size={15} />
            Connected
          </div>

          <div className="flex items-center gap-2">
            <Clock3 size={15} />
            {sql.executionTime} ms
          </div>

        </div>

      </div>

    </section>
  );
}