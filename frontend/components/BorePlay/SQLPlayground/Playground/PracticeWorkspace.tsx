"use client";

import SQLToolbar from "./SQLToolbar";
import SQLExplorer from "./SQLExplorer";
import SQLEditor from "./SQLEditor";
import SQLResults from "./SQLResults";
import SQLSidebar from "../Sidebar/SQLSidebar";

import { useSQLPlayground } from "../Hooks/useSQLPlayground";

export default function PracticeWorkspace() {
  const sql = useSQLPlayground("practice");

  return (
    <section
      className="
        mt-6
        w-full
        min-w-0
        max-w-full
      "
    >
      {/* ==================================================
          TOOLBAR
          ================================================== */}

      <div className="w-full min-w-0 max-w-full">
        <SQLToolbar sql={sql} />
      </div>

      {/* ==================================================
          IDE
          ================================================== */}

      <div
        className="
          mt-4

          grid
          grid-cols-1

          gap-4

          w-full
          min-w-0
          max-w-full

          xl:grid-cols-[220px_minmax(0,1fr)_300px]

          xl:h-[75vh]
        "
      >
        {/* ==================================================
            EXPLORER
            ================================================== */}

        <div
          className="
            w-full
            min-w-0
            max-w-full
          "
        >
          <SQLExplorer sql={sql} />
        </div>

        {/* ==================================================
            MIDDLE WORKSPACE
            ================================================== */}

        <div
          className="
            flex
            w-full
            min-w-0
            max-w-full

            flex-col
            gap-4

            xl:h-full
          "
        >
          {/* ==================================================
              EDITOR
              ================================================== */}

          <div
            className="
              w-full
              min-w-0
              max-w-full

              h-[360px]

              sm:h-[420px]

              xl:h-auto
              xl:flex-1

              min-h-0

              overflow-hidden
            "
          >
            <SQLEditor sql={sql} />
          </div>

          {/* ==================================================
              RESULTS
              ================================================== */}

          <div
            className="
              w-full
              min-w-0
              max-w-full

              h-[240px]

              sm:h-[260px]

              xl:h-[220px]

              min-h-0

              overflow-hidden
            "
          >
            <SQLResults sql={sql} />
          </div>
        </div>

        {/* ==================================================
            SIDEBAR
            ================================================== */}

        <div
          className="
            w-full
            min-w-0
            max-w-full
          "
        >
          <SQLSidebar sql={sql} />
        </div>
      </div>
    </section>
  );
}