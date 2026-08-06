"use client";

import { Clock3, History } from "lucide-react";
import { useSQLPlayground } from "../Hooks/useSQLPlayground";

interface SQLHistoryProps {
  sql: ReturnType<typeof useSQLPlayground>;
}

export default function SQLHistory({
  sql,
}: SQLHistoryProps) {
  return (
    <div className="p-5">

      <div className="mb-5 flex items-center gap-2">

        <History
          size={18}
          className="text-primary"
        />

        <h2 className="font-semibold">
          Query History
        </h2>

      </div>

      {sql.history.length === 0 ? (

        <div
          className="
            rounded-xl
            border
            border-dashed
            border-white/10
            p-8
            text-center
            text-sm
            text-muted-foreground
          "
        >
          No queries executed yet.
        </div>

      ) : (

        <div className="space-y-4">

          {sql.history.map((item, index) => (

            <button
              key={index}
              onClick={() => sql.setQuery(item.query)}
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-black/20
                p-4
                text-left
                transition
                hover:border-primary/40
                hover:bg-primary/5
              "
            >

              <div className="flex items-center gap-2">

                <Clock3
                  size={14}
                  className="text-primary"
                />

                <span
                  className="
                    text-xs
                    text-muted-foreground
                  "
                >
                  {item.time}
                </span>

              </div>

              <pre
                className="
                  mt-3
                  whitespace-pre-wrap
                  break-words
                  font-mono
                  text-xs
                  leading-6
                "
              >
                {item.query}
              </pre>

            </button>

          ))}

        </div>

      )}

    </div>
  );
}
