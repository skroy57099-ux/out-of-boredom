import Image from "next/image";
import { Project } from "./types";

interface ProjectGalleryProps {
  project: Project;
}

export default function ProjectGallery({
  project,
}: ProjectGalleryProps) {
  if (!project.gallery || project.gallery.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-8">
        Gallery
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {project.gallery.map((image, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-zinc-800"
          >
            <Image
              src={image}
              alt={`${project.title} ${index + 1}`}
              width={1200}
              height={800}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
