import type * as Monaco from "monaco-editor";
import { sampleSchema } from "../Data/sampleSchema";

let providerRegistered = false;

export function registerSQLCompletionProvider(
  monaco: typeof Monaco
) {
  // Prevent duplicate registrations during Hot Reload
  if (providerRegistered) return;

  providerRegistered = true;

  monaco.languages.registerCompletionItemProvider("sql", {
    triggerCharacters: [
      ".",
      " ",
      "_",
    ],

    provideCompletionItems(model, position) {
      const word =
        model.getWordUntilPosition(position);

      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const text = model.getValue();

      const textUntilCursor = text.substring(
        0,
        model.getOffsetAt(position)
      );

      const suggestions: Monaco.languages.CompletionItem[] =
        [];

      //----------------------------------------------------
      // TABLE SUGGESTIONS
      //----------------------------------------------------

      const tableRegex =
        /\b(FROM|JOIN|UPDATE|INTO)\s+\w*$/i;

      if (tableRegex.test(textUntilCursor)) {
        Object.keys(sampleSchema).forEach(
          (table) => {
            suggestions.push({
              label: table,
              kind:
                monaco.languages
                  .CompletionItemKind.Class,

              insertText: table,

              detail: "Table",

              range,
            });
          }
        );

        return { suggestions };
      }

      //----------------------------------------------------
      // COLUMN SUGGESTIONS
      //----------------------------------------------------

      Object.values(sampleSchema).forEach(
        (table) => {
          table.columns.forEach((column) => {
            suggestions.push({
              label: column.name,

              kind:
                monaco.languages
                  .CompletionItemKind.Field,

              insertText: column.name,

              detail: column.type,

              documentation:
                `${column.type}`,

              range,
            });
          });
        }
      );

      return {
        suggestions,
      };
    },
  });
}