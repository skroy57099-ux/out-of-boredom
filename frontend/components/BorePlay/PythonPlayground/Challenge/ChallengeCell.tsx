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
  const [error, setError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState(0);
  const [running, setRunning] = useState(false);

  const handleEditorWillMount = (monaco: Monaco) => {
    defineBoreTheme(monaco);
  };

  const handleRun = async () => {
    if (running) return;

    setRunning(true);

    try {
      const result = await runPython(code);

      setOutput(result.output);
      setError(result.error);
      setExecutionTime(result.executionTime);
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
      setExecutionTime(result.executionTime);

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
    const handleShortcut = (event: KeyboardEvent) => {
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
    <div className="flex h-full flex-col">

      {/* Editor Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">

        <span className="font-mono text-sm text-cyan-400">
          challenge.py
        </span>

        <span className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-gray-500">
          Ctrl + Enter
        </span>

      </div>

      {/* Editor */}
      <div className="min-h-0">
        <Editor
          beforeMount={handleEditorWillMount}
          language="python"
          value={code}
          theme="bore-dark"
          height="320px"
          onChange={(value) =>
            onCodeChange(value ?? "")
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
          }}
        />
      </div>

      {/* Output */}
      <div className="min-h-0 flex-1 overflow-auto border-t border-white/10">
        <CellOutput
          output={output}
          error={error}
          executionTime={executionTime}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 border-t border-white/10 p-4">

        <button
          type="button"
          onClick={handleRun}
          disabled={running}
          className="flex items-center gap-2 rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Play
            size={14}
            fill="currentColor"
          />

          {running ? "Running..." : "Run Code"}
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={running}
          className="flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={14} />

          Check Answer
        </button>

      </div>

    </div>
  );
}