import { Project } from "@/components/Projects/types";
import { projects } from "@/components/Projects/projects";

export interface Suggestion {
  title: string;
  reason: string;
  projectId: string;
}

export function getSuggestions(current: Project): Suggestion[] {
  const suggestions: Suggestion[] = [];

  for (const project of projects) {
    if (project.id === current.id) continue;

    const sharedTech = project.technologies.filter((tech) =>
      current.technologies.includes(tech)
    );

    if (sharedTech.length > 0) {
      suggestions.push({
        title: project.title,
        projectId: project.id,
        reason: `Also uses ${sharedTech.join(", ")}`,
      });

      continue;
    }

    if (project.category === current.category) {
      suggestions.push({
        title: project.title,
        projectId: project.id,
        reason: `Another ${project.category} project`,
      });
    }
  }

  return suggestions.slice(0, 3);
}
