import ProjectHero from "./ProjectHero";
import ProjectStats from "./ProjectStats";
import ProjectMedia from "./ProjectMedia";
import ReadmeRenderer from "./ReadmeRenderer";
import { Project } from "./types";

type Props = {
  project: Project;
};

export default function ProjectLayout({
  project,
  children,
}: {
  project: Project;
  children?: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">

      <ProjectHero project={project} />

      <ProjectStats project={project} />

      <ProjectMedia project={project} />

      {children}

      <ReadmeRenderer project={project} />

    </main>
  );
}
