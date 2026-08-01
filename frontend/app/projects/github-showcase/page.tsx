import { notFound } from "next/navigation";
import { projects } from "@/components/Projects/projects";
import ProjectLayout from "@/components/Projects/ProjectLayout";
import GithubShowcaseContent from "@/components/Projects/content/GithubShowcaseContent";

export default function GithubShowcasePage() {
  const project = projects.find(
    (p) => p.id === "github-showcase"
  );

  if (!project) notFound();

  return (
    <ProjectLayout project={project}>
      <GithubShowcaseContent />
    </ProjectLayout>
  );
}
