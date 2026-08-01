import { getProjectById } from "../../Projects/projects";

export interface NavigationResult {
  success: boolean;

  route?: string;

  github?: string;

  demo?: string;

  message?: string;
}

export class NavigationEngine {
  public openProject(projectId: string): NavigationResult {
    const project = getProjectById(projectId);

    if (!project) {
      return {
        success: false,
        message: "Project not found.",
      };
    }

    return {
      success: true,
      route: project.route,
    };
  }

  public openGithub(projectId: string): NavigationResult {
    const project = getProjectById(projectId);

    if (!project?.github) {
      return {
        success: false,
        message: "GitHub repository unavailable.",
      };
    }

    return {
      success: true,
      github: project.github,
    };
  }

  public openDemo(projectId: string): NavigationResult {
    const project = getProjectById(projectId);

    if (!project?.demo) {
      return {
        success: false,
        message: "Live demo unavailable.",
      };
    }

    return {
      success: true,
      demo: project.demo,
    };
  }
}

export const navigationEngine =
  new NavigationEngine();
  