"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Database,
  KeyRound,
  Link2,
  Table2,
} from "lucide-react";

import { useSQLPlayground } from "../Hooks/useSQLPlayground";
import { sampleSchema } from "../Data/sampleSchema";

interface SQLExplorerProps {
  sql: ReturnType<typeof useSQLPlayground>;
}

export default function SQLExplorer({
  sql,
}: SQLExplorerProps) {
  const [expandedTables, setExpandedTables] =
    useState<Record<string, boolean>>({
      customers: true,
      orders: true,
      products: true,
      employees: true,
    });

  const toggleTable = (table: string) => {
    setExpandedTables((prev) => ({
      ...prev,
      [table]: !prev[table],
    }));
  };

  const getTypeColor = (type: string) => {
    if (type.startsWith("INT")) {
      return "bg-sky-500/15 text-sky-400";
    }

    if (type.startsWith("VARCHAR")) {
      return "bg-emerald-500/15 text-emerald-400";
    }

    if (type.startsWith("DECIMAL")) {
      return "bg-orange-500/15 text-orange-400";
    }

    return "bg-zinc-700 text-zinc-300";
  };

  return (
    <aside
      className="
        rounded-2xl
        border
        border-white/10
        bg-black/20
        p-5
        overflow-y-auto
      "
    >
      {/* Header */}

      <div className="flex items-center gap-2">

        <Database
          size={18}
          className="text-primary"
        />

        <h3 className="font-semibold">
          Database
        </h3>

      </div>

      {/* Tables */}

      <div className="mt-6 space-y-4">

        {Object.entries(sampleSchema).map(
          ([tableName, table]) => (

            <div key={tableName}>

              {/* Table */}

              <button
                onClick={() => {
                  toggleTable(tableName);

                  sql.setSelectedTable(tableName);

                  sql.setQuery(
`SELECT *
FROM ${tableName};`
                  );
                }}
                className={`
                  flex
                  w-full
                  items-center
                  gap-2
                  rounded-lg
                  px-3
                  py-2
                  transition

                  ${
                    sql.selectedTable === tableName
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "hover:bg-white/5"
                  }
                `}
              >

                {expandedTables[tableName] ? (
                  <ChevronDown size={15} />
                ) : (
                  <ChevronRight size={15} />
                )}

                <Table2
                  size={15}
                  className="text-cyan-400"
                />

                <span className="flex-1 text-left text-sm font-medium">
                  {tableName}
                </span>

                <span
                  className="
                    rounded-full
                    bg-white/5
                    px-2
                    py-0.5
                    text-[11px]
                    text-zinc-400
                  "
                >
                  {table.rows}
                </span>

              </button>

              {/* Columns */}

              {expandedTables[tableName] && (

                <div className="mt-2 ml-7 space-y-1">

                  {table.columns.map((column) => (

                    <div
                      key={column.name}
                      className="
                        flex
                        items-center
                        justify-between
                        rounded-md
                        px-2
                        py-1.5
                        transition
                        hover:bg-white/5
                      "
                    >

                      <div className="flex items-center gap-2">

                        {column.primaryKey ? (

                          <KeyRound
                            size={13}
                            className="text-yellow-400"
                          />

                        ) : "foreignKey" in column && column.foreignKey ? (

                          <Link2
                            size={13}
                            className="text-purple-400"
                          />

                        ) : (

                          <div className="w-[13px]" />

                        )}

                        <span
                          className="
                            text-xs
                            text-zinc-200
                          "
                        >
                          {column.name}
                        </span>

                      </div>

                      <span
                        className={`
                          rounded-full
                          px-2
                          py-0.5
                          text-[10px]
                          font-medium

                          ${getTypeColor(
                            column.type
                          )}
                        `}
                      >
                        {column.type}
                      </span>

                    </div>

                  ))}

                </div>

              )}

            </div>

          )
        )}

      </div>

    </aside>
  );
}
