import Link from "next/link";
import { Project } from "./types";

interface ProjectHeroProps {
  project: Project;
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <section className="mx-auto mb-20 max-w-7xl px-6 pt-10">
      {/* Back Button */}
      <Link
        href="/projects"
        className="mb-8 inline-flex items-center text-sm text-zinc-400 transition hover:text-white"
      >
        ← Back to Projects
      </Link>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 md:p-10">
        <div className="space-y-8">
          {/* Title */}
          <div className="flex items-start gap-5">
            <span className="text-5xl md:text-6xl">{project.icon}</span>

            <div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                {project.title}
              </h1>

              <p className="mt-3 max-w-3xl text-lg text-zinc-400">
                {project.shortDescription}
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-3">
            {project.featured && (
              <span className="rounded-full bg-yellow-500/15 px-4 py-2 text-sm font-medium text-yellow-400">
                ⭐ Featured Project
              </span>
            )}

            <span className="rounded-full bg-green-500/15 px-4 py-2 text-sm font-medium text-green-400">
              {project.status}
            </span>

            <span className="rounded-full bg-blue-500/15 px-4 py-2 text-sm font-medium text-blue-400">
              {project.category}
            </span>
          </div>

          {/* Tech Stack */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">
              Tech Stack
            </h2>

            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-sm text-zinc-300 transition hover:border-blue-500"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-white">
              Project Overview
            </h2>

            <p className="max-w-4xl leading-8 text-zinc-300">
              {project.longDescription}
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-105 hover:bg-zinc-200"
            >
              {project.id === "github-showcase"
               ? "View GitHub Profile"
               : "View Source Code"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
