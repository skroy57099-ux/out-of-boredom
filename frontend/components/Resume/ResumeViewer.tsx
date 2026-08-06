"use client";

import Link from "next/link";

export default function ResumeViewer() {
  return (
    <section className="min-h-screen bg-neutral-950 py-12 px-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Resume
            </h1>
            <p className="mt-2 text-neutral-400">
              Experience, projects, skills, and certifications.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-lg border border-neutral-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              ← Back
            </Link>

            <a
              href="/resume/Resume.pdf"
              download
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-neutral-200"
            >
              Download PDF
            </a>
          </div>
        </div>

        {/* Resume Viewer */}
        <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
          <embed
            src="/resume/Resume.pdf#zoom=page-width"
            type="application/pdf"
            className="h-[88vh] w-full"
          />
        </div>
      </div>
    </section>
  );
}