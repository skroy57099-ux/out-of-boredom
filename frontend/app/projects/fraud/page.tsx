import { notFound } from "next/navigation";
import { projects } from "@/components/Projects/projects";
import ProjectLayout from "@/components/Projects/ProjectLayout";
import FraudContent from "@/components/Projects/content/FraudContent";

export default function FraudPage() {
  const project = projects.find((p) => p.id === "fraud");

  if (!project) {
    notFound();
  }

  return (
    <ProjectLayout project={project}>
      <FraudContent />
    </ProjectLayout>
  );
}
