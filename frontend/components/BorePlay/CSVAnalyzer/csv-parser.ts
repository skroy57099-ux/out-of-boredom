import Papa from "papaparse";
import type { ParsedDataset } from "./csv-types";

export type CSVParseResult =
  | {
      success: true;
      data: ParsedDataset;
    }
  | {
      success: false;
      error: string;
    };

export function parseCSVFile(file: File): Promise<CSVParseResult> {
  return new Promise((resolve) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      resolve({
        success: false,
        error: "Please upload a CSV file.",
      });
      return;
    }

    if (file.size === 0) {
      resolve({
        success: false,
        error: "The CSV file is empty.",
      });
      return;
    }

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: "greedy",

      complete: (results) => {
        if (results.errors.length > 0) {
          const firstError = results.errors[0];

          resolve({
            success: false,
            error: `CSV parsing error: ${firstError.message}`,
          });

          return;
        }

        const headers = results.meta.fields ?? [];

        if (headers.length === 0) {
          resolve({
            success: false,
            error: "No column headers were found in the CSV.",
          });

          return;
        }

        if (results.data.length === 0) {
          resolve({
            success: false,
            error: "The CSV contains headers but no data rows.",
          });

          return;
        }

        const cleanedHeaders = headers.map((header) =>
          header.trim()
        );

        const hasEmptyHeader = cleanedHeaders.some(
          (header) => header.length === 0
        );

        if (hasEmptyHeader) {
          resolve({
            success: false,
            error: "The CSV contains an empty column name.",
          });

          return;
        }

        const duplicateHeaders = cleanedHeaders.filter(
          (header, index) =>
            cleanedHeaders.indexOf(header) !== index
        );

        if (duplicateHeaders.length > 0) {
          const uniqueDuplicates = [
            ...new Set(duplicateHeaders),
          ];

          resolve({
            success: false,
            error: `Duplicate column names found: ${uniqueDuplicates.join(
              ", "
            )}`,
          });

          return;
        }

        const rows = results.data.map((row) => {
          const cleanedRow: Record<string, string> = {};

          cleanedHeaders.forEach((header) => {
            cleanedRow[header] = row[header] ?? "";
          });

          return cleanedRow;
        });

        resolve({
          success: true,
          data: {
            fileName: file.name,
            fileSize: file.size,
            headers: cleanedHeaders,
            rows,
          },
        });
      },

      error: (error) => {
        resolve({
          success: false,
          error: `Unable to read CSV: ${error.message}`,
        });
      },
    });
  });
}