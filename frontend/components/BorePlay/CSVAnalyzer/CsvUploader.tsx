"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { parseCSVFile } from "./csv-parser";
import type { ParsedDataset } from "./csv-types";

type CsvUploaderProps = {
  onDatasetLoaded: (dataset: ParsedDataset) => void;
};

export default function CsvUploader({
  onDatasetLoaded,
}: CsvUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const processFile = async (file: File) => {
    setError("");
    setIsLoading(true);

    try {
      const result = await parseCSVFile(file);

      if (!result.success) {
        setError(result.error);
        return;
      }

      onDatasetLoaded(result.data);
    } catch {
      setError("Something went wrong while reading the CSV.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      processFile(file);
    }

    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      processFile(file);
    }
  };

  return (
    <section className="mx-auto flex min-h-[500px] w-full max-w-4xl items-center justify-center px-4">
      <div className="w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-white">
            CSV Analyzer
          </h1>

          <p className="mt-2 text-sm text-white/50">
            Upload a CSV and inspect your dataset.
          </p>
        </div>

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={[
            "cursor-pointer rounded-2xl border border-dashed p-12 text-center transition",
            isDragging
              ? "border-cyan-400 bg-cyan-400/10"
              : "border-white/15 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.05]",
          ].join(" ")}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white/5 text-2xl">
            {isLoading ? "⏳" : "📄"}
          </div>

          <h2 className="mt-5 text-lg font-medium text-white">
            {isLoading
              ? "Analyzing CSV..."
              : "Drop your CSV here"}
          </h2>

          <p className="mt-2 text-sm text-white/40">
            or click anywhere to browse your files
          </p>

          <p className="mt-4 text-xs text-white/30">
            CSV files only
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
      </div>
    </section>
  );
}