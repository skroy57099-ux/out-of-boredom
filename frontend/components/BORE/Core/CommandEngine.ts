import { projects } from "@/components/Projects/projects";

export type BoreCommand =
  | "open_project"
  | "open_github"
  | "open_resume"
  | "open_contact"
  | "open_home"
  | "unknown";

export interface CommandResult {
  command: BoreCommand;
  payload?: string;
}

export function detectCommand(message: string): CommandResult {
  const text = message.toLowerCase().trim();

  // Resume
  if (
    text.includes("resume") ||
    text.includes("cv")
  ) {
    return {
      command: "open_resume",
    };
  }

  // Contact
  if (
    text.includes("contact") ||
    text.includes("email")
  ) {
    return {
      command: "open_contact",
    };
  }

  // Home
  if (
    text.includes("home")
  ) {
    return {
      command: "open_home",
    };
  }

  // GitHub
  if (text.includes("github")) {

    // If the user mentioned a project with GitHub
    const project = projects.find(project =>
      text.includes(project.id.toLowerCase()) ||
      text.includes(project.title.toLowerCase())
    );

    return {
      command: "open_github",
      payload: project?.id,
    };
  }

  // Project Detection
  const project = projects.find(project => {

    if (text.includes(project.id.toLowerCase())) {
      return true;
    }

    if (text.includes(project.title.toLowerCase())) {
      return true;
    }

    return false;
  });

  if (project) {
    return {
      command: "open_project",
      payload: project.id,
    };
  }

  return {
    command: "unknown",
  };
}
