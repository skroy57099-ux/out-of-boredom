import ProjectLayout from "@/components/Projects/ProjectLayout";
import { projects } from "@/components/Projects/projects";
import NetflixContent from "@/components/Projects/content/NetflixContent";

export default function NetflixPage() {
  const project = projects.find((p) => p.id === "netflix");

  if (!project) return null;

  return (
    <ProjectLayout project={project}>
    </ProjectLayout>
  );
}
