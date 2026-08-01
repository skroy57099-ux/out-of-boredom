import ProjectLayout from "@/components/Projects/ProjectLayout";
import { projects } from "@/components/Projects/projects";

export default function BlinkitPage() {
  const project = projects.find(
    (project) => project.id === "blinkit"
  );

  if (!project) {
    return (
      <div className="p-10 text-center">
        Project not found.
      </div>
    );
  }

  return <ProjectLayout project={project} />;
}
