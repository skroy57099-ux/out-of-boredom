"use client";

import SQLToolbar from "./SQLToolbar";
import SQLExplorer from "./SQLExplorer";
import SQLEditor from "./SQLEditor";
import SQLResults from "./SQLResults";
import SQLSidebar from "../Sidebar/SQLSidebar";

import { useSQLPlayground } from "../Hooks/useSQLPlayground";

export default function SQLWorkspace() {
  const sql = useSQLPlayground("practice");

  return (
    <section className="mt-6">

      {/* Toolbar */}

      <SQLToolbar sql={sql} />

      {/* IDE */}

      <div
        className="
          mt-4
          grid
          gap-4
          xl:grid-cols-[220px_1fr_300px]
          h-[75vh]
        "
      >
        {/* Explorer */}

        <SQLExplorer sql={sql} />

        {/* Middle */}

        <div className="flex h-full flex-col gap-4">

          {/* Editor */}

          <div className="flex-1 overflow-hidden">
            <SQLEditor sql={sql} />
          </div>

          {/* Results */}

          <div className="h-[220px] overflow-hidden">
            <SQLResults sql={sql} />
          </div>

        </div>

        {/* Sidebar */}

        <SQLSidebar sql={sql} />

      </div>

    </section>
  );
}
