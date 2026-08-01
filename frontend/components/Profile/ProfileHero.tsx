"use client";

import Link from "next/link";

export default function ProfileHero() {
  return (
    <section className="space-y-8">
      <Link
        href="/"
        className="inline-flex text-sm text-neutral-400 transition hover:text-white"
      >
        ← Back to Home
      </Link>

      <div>
        <h1 className="text-5xl font-bold text-white">
          Profile
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-neutral-400">
          AI & Data Analyst passionate about building intelligent, data-driven
          products.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="mb-3 text-xl font-semibold text-white">
          About Me
        </h2>

        <p className="leading-relaxed text-neutral-400">
          I'm passionate about transforming complex data into practical
          solutions through artificial intelligence, machine learning, and
          analytics. My projects span computer vision, predictive modeling,
          business intelligence dashboards, automation, and modern full-stack
          AI applications.
        </p>

        <p className="mt-4 leading-relaxed text-neutral-400">
          I enjoy building systems that combine clean engineering with
          meaningful user experiences, whether it's an analytics dashboard, an
          AI-powered application, or an end-to-end data pipeline. My goal is to
          create products that solve real-world problems rather than simply
          demonstrate technology.
        </p>
      </div>
    </section>
  );
}
