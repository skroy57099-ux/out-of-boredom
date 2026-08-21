"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import type { Monaco } from "@monaco-editor/react";
import { Play, Send } from "lucide-react";

import { defineBoreTheme } from "../Utils/PythonTheme";
import { runPython } from "../Utils/PythonRunner";
import CellOutput from "../Practice/CellOutput";

interface ChallengeCellProps {
  code: string;
  onCodeChange: (code: string) => void;
  onSubmit: () => void;
}

export default function ChallengeCell({
  code,
  onCodeChange,
  onSubmit,
}: ChallengeCellProps) {
  const [output, setOutput] = useState("");
  const [error, setError] =
    useState<string | null>(null);
  const [executionTime, setExecutionTime] =
    useState(0);
  const [running, setRunning] =
    useState(false);

  const handleEditorWillMount = (
    monaco: Monaco
  ) => {
    defineBoreTheme(monaco);
  };

  const handleRun = async () => {
    if (running) return;

    setRunning(true);

    try {
      const result = await runPython(code);

      setOutput(result.output);
      setError(result.error);
      setExecutionTime(
        result.executionTime
      );
    } catch (err) {
      setOutput("");

      setError(
        err instanceof Error
          ? err.message
          : String(err)
      );
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (running) return;

    setRunning(true);

    try {
      const result = await runPython(code);

      setOutput(result.output);
      setError(result.error);
      setExecutionTime(
        result.executionTime
      );

      onSubmit();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : String(err);

      setOutput("");
      setError(message);

      onSubmit();
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    const handleShortcut = (
      event: KeyboardEvent
    ) => {
      if (
        event.ctrlKey &&
        event.key === "Enter"
      ) {
        event.preventDefault();
        handleRun();
      }
    };

    window.addEventListener(
      "keydown",
      handleShortcut
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleShortcut
      );
    };
  }, [code, running]);

  return (
    <div
      className="
        flex
        h-full
        min-h-0
        w-full
        min-w-0
        max-w-full
        flex-col
      "
    >
      {/* ==================================================
          EDITOR HEADER
          ================================================== */}

      <div
        className="
          flex
          min-w-0
          items-center
          justify-between
          gap-3

          border-b
          border-white/10

          px-3
          py-2

          sm:px-4
        "
      >
        <span
          className="
            min-w-0
            truncate

            font-mono
            text-sm
            text-cyan-400
          "
        >
          challenge.py
        </span>

        <span
          className="
            shrink-0

            rounded-md
            border
            border-white/10

            px-2
            py-1

            text-[10px]
            sm:text-xs

            text-gray-500
          "
        >
          Ctrl + Enter
        </span>
      </div>

      {/* ==================================================
          EDITOR
          ================================================== */}

      <div
        className="
          w-full
          min-w-0
          max-w-full

          shrink-0

          overflow-hidden

          border-b
          border-white/10
        "
      >
        <Editor
          beforeMount={handleEditorWillMount}
          language="python"
          value={code}
          theme="bore-dark"

          height="320px"

          onChange={(value) =>
            onCodeChange(
              value ?? ""
            )
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

            fontFamily:
              "JetBrains Mono, monospace",

            padding: {
              top: 12,
              bottom: 12,
            },

            scrollbar: {
              horizontal:
                "auto",

              vertical:
                "auto",

              alwaysConsumeMouseWheel:
                false,
            },
          }}
        />
      </div>

      {/* ==================================================
          OUTPUT
          ================================================== */}

      <div
        className="
          min-h-[160px]
          max-h-[280px]

          w-full
          min-w-0
          max-w-full

          flex-1

          overflow-auto

          border-b
          border-white/10
        "
      >
        <CellOutput
          output={output}
          error={error}
          executionTime={
            executionTime
          }
        />
      </div>

      {/* ==================================================
          CONTROLS
          ================================================== */}

      <div
        className="
          flex
          w-full
          min-w-0
          max-w-full

          flex-col
          gap-2

          border-t
          border-white/10

          p-3

          sm:flex-row
          sm:items-center
          sm:gap-3
          sm:p-4
        "
      >
        {/* Run Code */}

        <button
          type="button"
          onClick={handleRun}
          disabled={running}
          className="
            flex
            w-full
            min-w-0

            items-center
            justify-center
            gap-2

            rounded-md

            bg-cyan-500

            px-4
            py-2.5

            text-sm
            font-medium

            text-black

            transition

            hover:bg-cyan-400

            disabled:cursor-not-allowed
            disabled:opacity-50

            sm:w-auto
          "
        >
          <Play
            size={14}
            fill="currentColor"
          />

          {running
            ? "Running..."
            : "Run Code"}
        </button>

        {/* Check Answer */}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={running}
          className="
            flex
            w-full
            min-w-0

            items-center
            justify-center
            gap-2

            rounded-md

            border
            border-white/10

            px-4
            py-2.5

            text-sm
            text-gray-300

            transition

            hover:bg-white/5

            disabled:cursor-not-allowed
            disabled:opacity-50

            sm:w-auto
          "
        >
          <Send size={14} />

          Check Answer
        </button>
      </div>
    </div>
  );
}