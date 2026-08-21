"use client";

import { useEffect } from "react";

import Toolbar from "./Toolbar";
import NotebookCell from "./NotebookCell";
import DatasetExplorer from "./DatasetExplorer";

import useNotebook from "../Hooks/useNotebook";
import { initializePyodide } from "../Utils/pyodide";

export default function Notebook() {
  const {
    cells,
    addCell,
    updateCell,
  } = useNotebook();

  useEffect(() => {
    initializePyodide().catch((error) => {
      console.error(
        "Failed to initialize Python:",
        error
      );
    });
  }, []);

  const handleDatasetSelect = (
    code: string
  ) => {
    const firstCell = cells[0];

    if (!firstCell) {
      return;
    }

    /*
     * If the first cell is still empty/default,
     * put the dataset loader code directly into it.
     */
    if (
      firstCell.code.trim() === "" ||
      firstCell.code.trim() ===
        'print("Hello, BORE!")'
    ) {
      updateCell(firstCell.id, {
        code,
      });

      return;
    }

    /*
     * If the user already has code,
     * create another cell instead of destroying
     * their work.
     */
    addCell();
  };

  return (
    <div
      className="
        flex
        min-h-0
        w-full
        min-w-0
        max-w-full
        flex-1
        flex-col
      "
    >
      {/* ==================================================
          TOOLBAR
          ================================================== */}

      <div
        className="
          w-full
          min-w-0
          max-w-full
        "
      >
        <Toolbar addCell={addCell} />
      </div>

      {/* ==================================================
          WORKSPACE
          ================================================== */}

      <div
        className="
          min-h-0
          w-full
          min-w-0
          max-w-full

          flex-1

          overflow-hidden

          p-3
          sm:p-4
          lg:p-6
        "
      >
        <div
          className="
            mx-auto

            grid

            w-full
            min-w-0
            max-w-7xl

            grid-cols-1

            overflow-hidden

            rounded-xl

            border
            border-white/10

            bg-[#0B0F14]

            lg:grid-cols-[260px_minmax(0,1fr)]
          "
        >
          {/* ==================================================
              DATASET EXPLORER
              ================================================== */}

          <div
            className="
              min-w-0
              max-w-full

              border-b
              border-white/10

              lg:border-b-0
              lg:border-r

              lg:min-h-0
            "
          >
            <div
              className="
                h-[220px]

                overflow-y-auto

                sm:h-[260px]

                lg:h-full
              "
            >
              <DatasetExplorer
                onDatasetSelect={
                  handleDatasetSelect
                }
              />
            </div>
          </div>

          {/* ==================================================
              NOTEBOOK
              ================================================== */}

          <div
            className="
              min-w-0
              max-w-full

              overflow-y-auto
              overflow-x-hidden

              p-3
              sm:p-4
              lg:p-6
            "
          >
            <div
              className="
                mx-auto

                flex
                w-full
                min-w-0
                max-w-full

                flex-col
                gap-6

                lg:gap-8
              "
            >
              {cells.map(
                (cell, index) => (
                  <div
                    key={cell.id}
                    className="
                      w-full
                      min-w-0
                      max-w-full
                    "
                  >
                    <NotebookCell
                      cell={cell}
                      cellNumber={
                        index + 1
                      }
                      updateCell={
                        updateCell
                      }
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}