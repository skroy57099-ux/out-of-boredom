"use client";

import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";

import { registerSQLCompletionProvider } from "../Monaco/SQLCompletionProvider";
import { useSQLPlayground } from "../Hooks/useSQLPlayground";

interface SQLEditorProps {
  sql: ReturnType<typeof useSQLPlayground>;
}

export default function SQLEditor({
  sql,
}: SQLEditorProps) {

  const runQueryRef = useRef(sql.runQuery);

  useEffect(() => {
    runQueryRef.current = sql.runQuery;
  }, [sql.runQuery]);

  return (
    <section
      className="
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-[#0d1117]
      "
    >
      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-white/10
          px-5
          py-3
        "
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="h-3 w-3 rounded-full bg-green-500" />
          </div>

          <span className="text-sm text-zinc-400">
            query.sql
          </span>
        </div>

        <div className="flex items-center gap-3">

          <span
            className="
              hidden
              rounded-md
              border
              border-white/10
              bg-white/5
              px-2.5
              py-1
              text-[11px]
              text-zinc-400
              lg:block
            "
          >
            Ctrl + Enter
          </span>

          <span
            className="
              rounded-full
              bg-green-500/10
              px-3
              py-1
              text-xs
              text-green-400
            "
          >
            Connected
          </span>

        </div>
      </div>

      {/* Monaco */}

      <div className="flex-1">

        <Editor
          height="100%"
          language="sql"
          theme="vs-dark"
          value={sql.query}
          onChange={(value) =>
            sql.setQuery(value ?? "")
          }

          beforeMount={(monaco) => {
            registerSQLCompletionProvider(monaco);
          }}

          onMount={(editor, monaco) => {
            editor.addCommand(
              monaco.KeyMod.CtrlCmd |
                monaco.KeyCode.Enter,
              () => {
                runQueryRef.current();
              }
            );
          }}

          options={{
            minimap: {
              enabled: false,
            },

            fontSize: 15,

            fontFamily:
              "'JetBrains Mono', monospace",

            wordWrap: "on",

            scrollBeyondLastLine: false,

            automaticLayout: true,

            tabSize: 2,

            roundedSelection: true,

            cursorBlinking: "blink",

            smoothScrolling: true,

            contextmenu: true,

            glyphMargin: false,

            folding: false,

            lineNumbers: "on",

            renderLineHighlight: "line",

            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
          }}
        />

      </div>
    </section>
  );
}