"use client";

import Editor from "@monaco-editor/react";
import type { Monaco, OnMount } from "@monaco-editor/react";

import { Play } from "lucide-react";

import { defineBoreTheme } from "../Utils/PythonTheme";
import { runPython } from "../Utils/PythonRunner";

import CellOutput from "./CellOutput";

import type { NotebookCell as Cell } from "../Types/notebook";

interface NotebookCellProps {
  cell: Cell;
  cellNumber: number;

  updateCell: (
    id: string,
    updates: Partial<Cell>
  ) => void;
}

export default function NotebookCell({
  cell,
  cellNumber,
  updateCell,
}: NotebookCellProps) {
  const handleEditorWillMount = (monaco: Monaco) => {
    defineBoreTheme(monaco);
  };

  const handleRun = async () => {
    const result = await runPython(cell.code);

    updateCell(cell.id, {
      output: result.output,
      error: result.error,
      executionTime: result.executionTime,
      plots: result.plots,
    });
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    /*
     * Ctrl + Enter
     * Run the current cell.
     */
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => {
        void handleRun();
      }
    );

    /*
     * Shift + Enter
     * Run the current cell.
     *
     * We keep the behavior simple for now.
     * Focus movement can be added later when the
     * notebook needs explicit cell navigation.
     */
    editor.addCommand(
      monaco.KeyMod.Shift | monaco.KeyCode.Enter,
      () => {
        void handleRun();
      }
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#11161D] shadow-[0_8px_30px_rgba(0,0,0,0.18)]">

      {/* ================================================== */}
      {/* CELL HEADER */}
      {/* ================================================== */}

      <div className="flex items-center justify-between border-b border-white/10 bg-[#151B23] px-4 py-2.5">

        <span className="font-mono text-sm font-medium text-cyan-400">
          In [{cellNumber}]
        </span>

        <div className="flex items-center gap-3">

          {/* Shortcut */}
          <span className="hidden rounded-md border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] text-gray-500 sm:inline-flex">
            Shift + Enter
          </span>

          {/* Run button */}
          <button
            type="button"
            onClick={handleRun}
            className="flex items-center gap-2 rounded-md bg-cyan-500 px-3.5 py-2 text-sm font-medium text-black transition hover:bg-cyan-400 active:scale-[0.98]"
          >
            <Play
              size={14}
              fill="currentColor"
            />

            Run Cell
          </button>

        </div>
      </div>

      {/* ================================================== */}
      {/* EDITOR */}
      {/* ================================================== */}

      <div className="bg-[#151A21]">
        <Editor
          beforeMount={handleEditorWillMount}
          onMount={handleEditorMount}
          language="python"
          value={cell.code}
          theme="bore-dark"
          height="275px"
          onChange={(value) =>
            updateCell(cell.id, {
              code: value ?? "",
            })
          }
          options={{
            minimap: {
              enabled: false,
            },

            automaticLayout: true,

            scrollBeyondLastLine: false,

            wordWrap: "on",

            fontSize: 15,

            lineHeight: 24,

            fontFamily: "JetBrains Mono, monospace",

            padding: {
              top: 8,
              bottom: 8,
            },

            cursorBlinking: "smooth",

            smoothScrolling: true,

            renderLineHighlight: "line",

            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
        />
      </div>

      {/* ================================================== */}
      {/* OUTPUT */}
      {/* ================================================== */}

      <CellOutput
        output={cell.output}
        error={cell.error}
        executionTime={cell.executionTime}
        plots={cell.plots}
      />

    </div>
  );
}