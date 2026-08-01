import Image from "next/image";
import { Project } from "./types";

type Props = {
  project: Project;
};

export default function ProjectMedia({ project }: Props) {
  return (
    <section className="mx-auto mb-20 max-w-7xl space-y-20 px-6">

      {project.demo && (
        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white">
              Demo Video
            </h2>

            <p className="mt-2 text-zinc-400">
              Watch the project in action.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-black shadow-xl">
            <video controls preload="metadata" className="w-full">
              <source src={project.demo} type="video/mp4" />
            </video>
          </div>
        </div>
      )}

      {project.gallery.length > 0 && (
        <div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white">
              Project Gallery
            </h2>

            <p className="mt-2 text-zinc-400">
              Screenshots highlighting the implementation and results.
            </p>
          </div>

          <div className="grid items-start gap-8 md:grid-cols-2">
            {project.gallery.map((item, index) => (
              <div
                key={index}
                className="self-start overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={1600}
                  height={1000}
                  className="w-full object-cover transition-transform duration-500 hover:scale-105"
                />

                <div className="border-t border-zinc-800 p-5">
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-zinc-400">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </section>
  );
}
