import { Project } from "@/components/Projects/types";
import { getRandomResponse } from "./boreResponses";

export interface BoreResponse {
  title?: string;

  message: string;

  mood:
    | "idle"
    | "thinking"
    | "speaking"
    | "success"
    | "warning"
    | "error";
}

// ==========================================================
// Technology Knowledge
// ==========================================================

const technologyDescriptions: Record<string, string> = {
  Python:
    "Used as the primary programming language for the overall project pipeline.",

  SQL:
    "Handles structured data querying, filtering, aggregation, and reporting.",

  "SQL Server":
    "Stores and manages structured relational datasets used throughout the application.",

  PostgreSQL:
    "Acts as the relational database powering the analytics platform.",

  "Power BI":
    "Creates interactive dashboards, KPI reports, and executive visualizations.",

  PowerBI:
    "Creates interactive dashboards, KPI reports, and executive visualizations.",

  Tableau:
    "Builds interactive business intelligence dashboards and visual analytics.",

  Pandas:
    "Performs data cleaning, preprocessing, and transformation.",

  NumPy:
    "Provides high-performance numerical computation and matrix operations.",

  Matplotlib:
    "Generates charts for exploratory data analysis.",

  Seaborn:
    "Produces statistical visualizations for data exploration.",

  YOLOv8:
    "Provides real-time object detection for identifying road damage.",

  PyTorch:
    "Supplies the deep learning framework used to train neural networks.",

  OpenCV:
    "Handles image loading, preprocessing, and computer vision operations.",

  Ultralytics:
    "Official implementation used for training and running YOLOv8.",

  "Scikit-learn":
    "Provides machine learning models and evaluation metrics.",

  "Machine Learning":
    "Enables predictive modeling from historical datasets.",

  CSV:
    "Acts as the primary data exchange format for structured datasets.",

  Git:
    "Tracks project history and source code changes.",

  GitHub:
    "Hosts repositories and manages version control."
};

// ==========================================================
// Helper Functions
// ==========================================================

function bullet(items: string[]): string {
  return items.map((item) => `• ${item}`).join("\n");
}

function stats(project: Project): string {
  if (!project.stats || project.stats.length === 0)
    return "No statistics available.";

  return project.stats
    .map((s) => `• ${s.label}: ${s.value}`)
    .join("\n");
}

function technologies(project: Project): string {
  return project.technologies
    .map((tech) => {
      const description =
        technologyDescriptions[tech] ??
        "Used throughout the implementation.";

      return `• ${tech}\n  ${description}`;
    })
    .join("\n\n");
}

function projectHeader(): string {
  return getRandomResponse("project");
}

function searchHeader(): string {
  return getRandomResponse("searching");
}

function thinkingHeader(): string {
  return getRandomResponse("thinking");
}
// ==========================================================
// Project Response
// ==========================================================

export function buildProjectResponse(
  message: string,
  project: Project
): BoreResponse {
  const question = message.toLowerCase();

  // ==========================================================
  // GitHub
  // ==========================================================

  if (
    question.includes("github") ||
    question.includes("repo") ||
    question.includes("repository") ||
    question.includes("source code") ||
    question.includes("code")
  ) {
    return {
      mood: "speaking",

      title: `${project.title} • GitHub`,

      message: `${projectHeader()}

${
  project.github ??
  "This project doesn't currently have a public repository."
}`,
    };
  }

  // ==========================================================
  // Demo
  // ==========================================================

  if (
    question.includes("demo") ||
    question.includes("website") ||
    question.includes("live") ||
    question.includes("preview") ||
    question.includes("try")
  ) {
    return {
      mood: "speaking",

      title: `${project.title} • Live Demo`,

      message: `${projectHeader()}

${
  project.demo ??
  "A public demo isn't available for this project."
}`,
    };
  }

  // ==========================================================
  // Technologies
  // ==========================================================

  if (
    question.includes("technology") ||
    question.includes("technologies") ||
    question.includes("stack") ||
    question.includes("tech stack") ||
    question.includes("built with") ||
    question.includes("framework") ||
    question.includes("library")
  ) {
    return {
      mood: "speaking",

      title: `${project.title} • Technology Stack`,

      message: `${searchHeader()}

${project.longDescription}

Core Technologies

${technologies(project)}`,
    };
  }

  // ==========================================================
  // Statistics
  // ==========================================================

  if (
    question.includes("stats") ||
    question.includes("statistics") ||
    question.includes("performance") ||
    question.includes("accuracy") ||
    question.includes("dataset") ||
    question.includes("result") ||
    question.includes("results") ||
    question.includes("metrics")
  ) {
    return {
      mood: "success",

      title: `${project.title} • Results`,

      message: `${projectHeader()}

${project.longDescription}

Project Statistics

${stats(project)}`,
    };
  }

  // ==========================================================
  // Description
  // ==========================================================

  if (
    question.includes("about") ||
    question.includes("overview") ||
    question.includes("describe") ||
    question.includes("what is") ||
    question.includes("tell me")
  ) {
    return {
      mood: "speaking",

      title: project.title,

      message: `${thinkingHeader()}

${project.longDescription}

Category
${project.category}

Status
${project.status}`,
    };
  }

  // ==========================================================
  // Default
  // ==========================================================

  return {
    mood: "speaking",

    title: project.title,

    message: `${projectHeader()}

${project.longDescription}

Category
${project.category}

Status
${project.status}

Technologies

${bullet(project.technologies)}

Project Statistics

${stats(project)}`,
  };
}
// ==========================================================
// Technology Response
// ==========================================================

export function buildTechnologyResponse(
  message: string,
  technology: string,
  projects: Project[]
): BoreResponse {
  const explanation =
    technologyDescriptions[technology] ??
    "This technology is part of the implementation.";

  if (projects.length === 0) {
    return {
      mood: "warning",

      title: technology,

      message: `${searchHeader()}

I couldn't find any projects using **${technology}**.`,
    };
  }

  const question = message.toLowerCase();

  // ----------------------------------------------------------
  // Why / Explain
  // ----------------------------------------------------------

  if (
    question.includes("why") ||
    question.includes("used") ||
    question.includes("purpose") ||
    question.includes("about") ||
    question.includes("explain") ||
    question.includes("technology")
  ) {
    return {
      mood: "speaking",

      title: technology,

      message: `${thinkingHeader()}

${explanation}

Projects using ${technology}

${bullet(projects.map((p) => p.title))}`,
    };
  }

  // ----------------------------------------------------------
  // Default
  // ----------------------------------------------------------

  return {
    mood: "speaking",

    title: technology,

    message: `${searchHeader()}

${technology} is used in ${projects.length} project${
      projects.length > 1 ? "s" : ""
    }.

${bullet(projects.map((p) => p.title))}`,
  };
}

// ==========================================================
// Featured Projects
// ==========================================================

export function buildFeaturedProjectsResponse(
  projects: Project[]
): BoreResponse {
  if (projects.length === 0) {
    return {
      mood: "warning",

      title: "Featured Projects",

      message: "No featured projects are available.",
    };
  }

  return {
    mood: "success",

    title: "Featured Projects",

    message: `${searchHeader()}

${projects
  .map(
    (project) =>
      `• ${project.title}

  ${project.shortDescription}`
  )
  .join("\n\n")}`,
  };
}

// ==========================================================
// Greeting
// ==========================================================

export function buildGreetingResponse(): BoreResponse {
  return {
    mood: "speaking",

    title: "BORE",

    message: getRandomResponse("greeting"),
  };
}

// ==========================================================
// Thanks
// ==========================================================

export function buildThanksResponse(): BoreResponse {
  return {
    mood: "success",

    message: getRandomResponse("thanks"),
  };
}

// ==========================================================
// Farewell
// ==========================================================

export function buildFarewellResponse(): BoreResponse {
  return {
    mood: "idle",

    message: getRandomResponse("farewell"),
  };
}

// ==========================================================
// Unknown
// ==========================================================

export function buildUnknownResponse(): BoreResponse {
  return {
    mood: "warning",

    title: "Unknown Request",

    message: getRandomResponse("unknown"),
  };
}
