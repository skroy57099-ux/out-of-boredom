"use client";

import { useState } from "react";

export default function ResumeUploader() {
  const [fileName, setFileName] = useState("");

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      setFileName("");
      return;
    }

    if (file.type !== "application/pdf") {
      setFileName("");
      alert("Please upload a PDF resume.");
      return;
    }

    setFileName(file.name);
  }

  return (
    <section className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-12">
      <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium text-cyan-400">
            BORE RESUME ANALYZER
          </p>

          <h1 className="text-3xl font-semibold text-white">
            Analyze your resume for a specific role
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
            Upload your resume and we'll analyze the evidence,
            requirements, gaps, and improvements for the role
            you're targeting.
          </p>
        </div>

        <label
          htmlFor="resume-upload"
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 px-6 py-14 text-center transition hover:border-cyan-400/50 hover:bg-white/[0.03]"
        >
          <div className="mb-4 text-4xl">
            📄
          </div>

          <p className="text-sm font-medium text-white">
            Upload your resume
          </p>

          <p className="mt-2 text-xs text-white/50">
            PDF files only
          </p>

          <input
            id="resume-upload"
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {fileName && (
          <div className="mt-5 rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-4 py-3">
            <p className="text-xs text-emerald-400">
              Resume selected
            </p>

            <p className="mt-1 truncate text-sm text-white/80">
              {fileName}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}