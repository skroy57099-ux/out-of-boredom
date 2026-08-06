"use client";

export default function ResumePreview() {
  return (
    <section className="space-y-8">

      <div>
        <h2 className="text-3xl font-semibold text-white">
          Resume Preview
        </h2>

        <p className="mt-2 max-w-2xl text-neutral-400">
          A quick overview of my professional experience, technical skills,
          certifications, and projects. You can preview it below, download a
          copy, or open it in a dedicated tab for a better reading experience.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
        <embed
          src="/resume/Resume.pdf#zoom=page-width"
          type="application/pdf"
          className="h-[85vh] w-full"
        />
      </div>

      <div className="flex flex-wrap gap-4">

        <a
          href="/resume/Resume.pdf"
          download
          className="rounded-lg bg-white px-5 py-3 font-medium text-black transition hover:bg-neutral-200"
        >
          📄 Download PDF
        </a>

        <a
          href="/resume/Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-neutral-700 px-5 py-3 text-white transition hover:bg-neutral-800"
        >
          🔍 Open Fullscreen
        </a>

      </div>

    </section>
  );
}

