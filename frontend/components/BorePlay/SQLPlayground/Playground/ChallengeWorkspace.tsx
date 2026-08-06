"use client";

import SQLToolbar from "./SQLToolbar";
import SQLExplorer from "./SQLExplorer";
import SQLEditor from "./SQLEditor";
import SQLResults from "./SQLResults";

import ChallengePanel from "../Challenge/ChallengePanel";

import { useSQLPlayground } from "../Hooks/useSQLPlayground";

export default function ChallengeWorkspace() {
  const sql = useSQLPlayground();

  return (
    <section>

      {/* Toolbar */}

      <SQLToolbar sql={sql} />

      {/* IDE */}

      <div
        className="
          mt-4
          grid
          gap-4
          h-[75vh]
          xl:grid-cols-[220px_1fr_340px]
        "
      >
        {/* Explorer */}

        <SQLExplorer sql={sql} />

        {/* Center */}

        <div
          className="
            flex
            h-full
            flex-col
            gap-4
          "
        >
          {/* SQL Editor */}

          <div className="flex-1 overflow-hidden">
            <SQLEditor sql={sql} />
          </div>

          {/* Results */}

          <div className="h-[220px] overflow-hidden">
            <SQLResults sql={sql} />
          </div>
        </div>

        {/* Challenge */}

        <ChallengePanel sql={sql}/>

      </div>

    </section>
  );
}
