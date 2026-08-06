"use client";

import { useState } from "react";

import SQLSyntax from "./SQLSyntax";
import SQLHistory from "./SQLHistory";

import { useSQLPlayground } from "../Hooks/useSQLPlayground";

interface SQLSidebarProps {
  sql: ReturnType<typeof useSQLPlayground>;
}

export default function SQLSidebar({
  sql,
}: SQLSidebarProps) {
  const [activeTab, setActiveTab] = useState<
    "syntax" | "history"
  >("syntax");

  return (
    <aside
      className="
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-card
        min-h-[430px]
      "
    >
      {/* Header */}

      <div
        className="
          flex
          border-b
          border-white/10
        "
      >
        <button
          onClick={() => setActiveTab("syntax")}
          className={`
            flex-1
            px-5
            py-4
            text-sm
            font-medium
            transition

            ${
              activeTab === "syntax"
                ? "border-b-2 border-primary text-white"
                : "text-muted-foreground hover:text-white"
            }
          `}
        >
          Syntax
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`
            flex-1
            px-5
            py-4
            text-sm
            font-medium
            transition

            ${
              activeTab === "history"
                ? "border-b-2 border-primary text-white"
                : "text-muted-foreground hover:text-white"
            }
          `}
        >
          History
        </button>
      </div>

      {/* Content */}

      <div className="h-full overflow-y-auto">

        {activeTab === "syntax" ? (
          <SQLSyntax />
        ) : (
          <SQLHistory sql={sql} />
        )}

      </div>
    </aside>
  );
}