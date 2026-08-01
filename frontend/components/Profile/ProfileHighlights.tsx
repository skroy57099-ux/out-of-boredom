"use client";

const highlights = [
  "Published Research",
  "Databricks Certified",
  "Python",
  "SQL",
  "Power BI",
  "Machine Learning",
  "FastAPI",
  "PostgreSQL",
  "Data Analytics",
  "AI",
];

export default function ProfileHighlights() {
  return (
    <section className="space-y-6">

      <h2 className="text-3xl font-semibold text-white">
        Highlights
      </h2>

      <div className="flex flex-wrap gap-4">

        {highlights.map((item) => (
          <div
            key={item}
            className="rounded-full border border-neutral-700 bg-neutral-900 px-5 py-3 text-sm text-neutral-300 transition hover:border-blue-500 hover:text-white"
          >
            {item}
          </div>
        ))}

      </div>

    </section>
  );
}