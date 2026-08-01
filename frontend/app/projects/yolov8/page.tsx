import ProjectLayout from "@/components/Projects/ProjectLayout";
import { projects } from "@/components/Projects/projects";

export default function YOLOv8Page() {
  const project = projects.find(
    (project) => project.id === "yolov8"
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