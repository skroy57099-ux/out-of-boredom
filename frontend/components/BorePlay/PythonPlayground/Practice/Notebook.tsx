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
      console.error("Failed to initialize Python:", error);
    });
  }, []);

  const handleDatasetSelect = (code: string) => {
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
      firstCell.code.trim() === 'print("Hello, BORE!")'
    ) {
      updateCell(firstCell.id, {
        code,
      });

      return;
    }

    /*
     * If the user already has code,
     * create another cell instead of destroying their work.
     */
    addCell();

    /*
     * The newly-created cell will be handled by the notebook state.
     * If your addCell() returns the new cell ID, we can make this
     * even cleaner in the next small adjustment.
     */
  };


  return (
    <div className="flex min-h-0 flex-1 flex-col">

      {/* Toolbar */}
      <Toolbar addCell={addCell} />

      {/* Workspace */}
      <div className="min-h-0 flex-1 overflow-hidden p-6">

        <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-[260px_minmax(0,1fr)] overflow-hidden rounded-xl border border-white/10 bg-[#0B0F14]">

          {/* Dataset Explorer */}
          <DatasetExplorer
            onDatasetSelect={handleDatasetSelect}
          />

          {/* Notebook */}
          <div className="min-w-0 overflow-y-auto p-6">

            <div className="mx-auto flex w-full flex-col gap-8">

              {cells.map((cell, index) => (
                <NotebookCell
                  key={cell.id}
                  cell={cell}
                  cellNumber={index + 1}
                  updateCell={updateCell}
                />
              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}