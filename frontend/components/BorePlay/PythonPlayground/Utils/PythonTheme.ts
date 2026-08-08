import type { Monaco } from "@monaco-editor/react";

export function defineBoreTheme(monaco: Monaco) {
  monaco.editor.defineTheme("bore-dark", {
    base: "vs-dark",
    inherit: true,

    rules: [
      {
        token: "comment",
        foreground: "6A9955",
        fontStyle: "italic",
      },

      {
        token: "keyword",
        foreground: "569CD6",
      },

      {
        token: "string",
        foreground: "CE9178",
      },

      {
        token: "number",
        foreground: "B5CEA8",
      },

      {
        token: "type",
        foreground: "4EC9B0",
      },

      {
        token: "function",
        foreground: "DCDCAA",
      },
    ],

    colors: {
      "editor.background": "#161B22",

      "editorLineNumber.foreground": "#6E7681",

      "editorCursor.foreground": "#22D3EE",

      "editor.lineHighlightBackground": "#1F2937",

      "editor.selectionBackground": "#264F78",

      "editor.inactiveSelectionBackground": "#264F7855",
    },
  });
}