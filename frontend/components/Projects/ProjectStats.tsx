import { Project } from "./types";

interface ProjectStatsProps {
  project: Project;
}

export default function ProjectStats({
  project,
}: ProjectStatsProps) {
  return (
    <section className="mx-auto mb-20 max-w-7xl px-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">
          Project Highlights
        </h2>

        <p className="mt-2 text-zinc-400">
          Key metrics, technologies and outcomes achieved during this project.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {project.stats.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-zinc-900"
          >
            <p className="text-sm uppercase tracking-wide text-zinc-500">
              {stat.label}
            </p>

            <h3 className="mt-3 text-3xl font-bold text-white transition-colors group-hover:text-blue-400">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}