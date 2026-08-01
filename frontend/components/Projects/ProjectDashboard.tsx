import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { projects } from "./projects";

export default function ProjectDashboard() {
  return (
    <main className="min-h-screen max-w-7xl mx-auto px-6 py-12">
      {/* Back to Portfolio */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-zinc-400 transition hover:text-blue-400"
      >
        <ArrowLeft size={18} />
        Back to Portfolio
      </Link>

      <h1 className="text-5xl font-bold">Projects</h1>

      <p className="mt-4 text-zinc-400">
        Explore my AI, Data Analytics, and Machine Learning projects.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500"
          >
            <div className="text-5xl">{project.icon}</div>

            <h2 className="mt-5 text-2xl font-bold">
              {project.title}
            </h2>

            <p className="mt-3 text-zinc-400">
              {project.shortDescription}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300"
                >
                  {tech}
                </span>
              ))}
            </div>

            <Link
              href={project.route}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:scale-105"
            >
              Explore Project
              <ArrowRight size={18} />
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}