import { Project } from "@/components/Projects/types";
import { getRandomResponse } from "./boreResponses";
import { getBorePlayKnowledge } from "../Knowledge/borePlay";

// ==========================================================
// BORE Response Types
// ==========================================================

export type BoreResponseType =
  | "conversation"
  | "personal"
  | "general"
  | "project"
  | "technology"
  | "category"
  | "featured"
  | "error";

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

  type?: BoreResponseType;

  usePersonality?: boolean;
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
    "Provides the implementation used for training and running YOLOv8.",

  "Scikit-learn":
    "Provides machine learning models and evaluation metrics.",

  "Machine Learning":
    "Enables predictive modeling from historical datasets.",

  CSV:
    "Acts as the primary data exchange format for structured datasets.",

  Git:
    "Tracks project history and source code changes.",

  GitHub:
    "Hosts repositories and manages version control.",
};

// ==========================================================
// Helper Functions
// ==========================================================

function bullet(items: string[]): string {
  return items
    .map((item) => `• ${item}`)
    .join("\n");
}

function stats(project: Project): string {
  if (!project.stats || project.stats.length === 0) {
    return "No statistics available.";
  }

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

  // ========================================================
  // GitHub
  // ========================================================

  if (
    question.includes("github") ||
    question.includes("repo") ||
    question.includes("repository") ||
    question.includes("source code") ||
    question.includes("code")
  ) {
    return {
      type: "project",
      usePersonality: true,

      mood: "speaking",

      title: `${project.title} • GitHub`,

      message: `${projectHeader()}

${
  project.github ??
  "This project doesn't currently have a public repository."
}`,
    };
  }

  // ========================================================
  // Demo
  // ========================================================

  if (
    question.includes("demo") ||
    question.includes("website") ||
    question.includes("live") ||
    question.includes("preview") ||
    question.includes("try")
  ) {
    return {
      type: "project",
      usePersonality: true,

      mood: "speaking",

      title: `${project.title} • Live Demo`,

      message: `${projectHeader()}

${
  project.demo ??
  "A public demo isn't available for this project."
}`,
    };
  }

  // ========================================================
  // Technologies
  // ========================================================

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
      type: "project",
      usePersonality: true,

      mood: "speaking",

      title: `${project.title} • Technology Stack`,

      message: `${searchHeader()}

${project.longDescription}

Core Technologies

${technologies(project)}`,
    };
  }

  // ========================================================
  // Statistics
  // ========================================================

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
      type: "project",
      usePersonality: true,

      mood: "success",

      title: `${project.title} • Results`,

      message: `${projectHeader()}

${project.longDescription}

Project Statistics

${stats(project)}`,
    };
  }

  // ========================================================
  // Description
  // ========================================================

  if (
    question.includes("about") ||
    question.includes("overview") ||
    question.includes("describe") ||
    question.includes("what is") ||
    question.includes("tell me")
  ) {
    return {
      type: "project",
      usePersonality: true,

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

  // ========================================================
  // Default
  // ========================================================

  return {
    type: "project",
    usePersonality: true,

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

  // ========================================================
  // No Projects
  // ========================================================

  if (projects.length === 0) {
    return {
      type: "technology",
      usePersonality: true,

      mood: "warning",

      title: technology,

      message: `${searchHeader()}

I couldn't find any projects using ${technology}.`,
    };
  }

  const question = message.toLowerCase();

  // ========================================================
  // Why / Explain
  // ========================================================

  if (
    question.includes("why") ||
    question.includes("used") ||
    question.includes("purpose") ||
    question.includes("about") ||
    question.includes("explain") ||
    question.includes("technology")
  ) {
    return {
      type: "technology",
      usePersonality: true,

      mood: "speaking",

      title: technology,

      message: `${thinkingHeader()}

${explanation}

Projects using ${technology}

${bullet(projects.map((p) => p.title))}`,
    };
  }

  // ========================================================
  // Default
  // ========================================================

  return {
    type: "technology",
    usePersonality: true,

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
      type: "featured",
      usePersonality: true,

      mood: "warning",

      title: "Featured Projects",

      message: "No featured projects are available.",
    };
  }

  return {
    type: "featured",
    usePersonality: true,

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
// Website / Out of Boredom Response
// ==========================================================

export function buildWebsiteResponse(
  question: string
): BoreResponse {
  const query = question.toLowerCase();

  const website = {
    name: "Out of Boredom",

    description:
      "Out of Boredom is Shubham's personal portfolio project that combines his work, projects, experiments, and interactive developer tools into one intelligent web experience.",

    purpose:
      "It goes beyond a traditional portfolio by allowing visitors to explore Shubham's work, interact with BORE, and use practical data and programming playgrounds.",

    capabilities: [
      "BORE AI assistant",
      "Resume Analyzer",
      "CSV Analyzer",
      "SQL Playground",
      "Python Playground",
      "Data analytics tools",
    ],

    technologies: [
      "Next.js",
      "TypeScript",
      "React",
      "Tailwind CSS",
      "FastAPI",
      "Python",
      "PostgreSQL",
    ],
  };

  // ========================================================
  // Website Technologies
  // ========================================================

  if (
    query.includes("technology") ||
    query.includes("technologies") ||
    query.includes("tech stack") ||
    query.includes("built with")
  ) {
    return {
      type: "category",
      usePersonality: true,

      mood: "speaking",

      title: "Out of Boredom • Technology",

      message: `The website is built with ${website.technologies.join(
        ", "
      )}.`,
    };
  }

  // ========================================================
  // Website Capabilities
  // ========================================================

  if (
    query.includes("what can") ||
    query.includes("features") ||
    query.includes("feature") ||
    query.includes("include") ||
    query.includes("has")
  ) {
    return {
      type: "category",
      usePersonality: true,

      mood: "speaking",

      title: "Out of Boredom • Capabilities",

      message: `It includes:

${website.capabilities
  .map((item) => `• ${item}`)
  .join("\n")}`,
    };
  }

  // ========================================================
  // Website Purpose
  // ========================================================

  if (
    query.includes("why") ||
    query.includes("purpose") ||
    query.includes("goal")
  ) {
    return {
      type: "category",
      usePersonality: true,

      mood: "speaking",

      title: "Out of Boredom • Purpose",

      message: website.purpose,
    };
  }

  // ========================================================
  // Default Website Response
  // ========================================================

  return {
    type: "category",
    usePersonality: true,

    mood: "speaking",

    title: website.name,

    message: website.description,
  };
}

// ==========================================================
// BORE Play Response
// ==========================================================

export function buildBorePlayResponse(
  question: string
): BoreResponse {
  const query = question.toLowerCase();

  const borePlay = getBorePlayKnowledge();

  // ========================================================
  // SQL Playground
  // ========================================================

  if (query.includes("sql playground")) {
    const playground =
      borePlay.playgrounds.find(
        (item) => item.name === "SQL Playground"
      );

    if (!playground) {
      return {
        type: "category",
        usePersonality: true,

        mood: "warning",

        title: "SQL Playground",

        message:
          "I don't currently have detailed knowledge about the SQL Playground.",
      };
    }

    return {
      type: "category",
      usePersonality: true,

      mood: "speaking",

      title: playground.name,

      message: `${playground.description}

It covers:

${playground.capabilities
  .map((item) => `• ${item}`)
  .join("\n")}

Status
${playground.status}`,
    };
  }

  // ========================================================
  // Python Playground
  // ========================================================

  if (query.includes("python playground")) {
    const playground =
      borePlay.playgrounds.find(
        (item) => item.name === "Python Playground"
      );

    if (!playground) {
      return {
        type: "category",
        usePersonality: true,

        mood: "warning",

        title: "Python Playground",

        message:
          "I don't currently have detailed knowledge about the Python Playground.",
      };
    }

    return {
      type: "category",
      usePersonality: true,

      mood: "speaking",

      title: playground.name,

      message: `${playground.description}

It covers:

${playground.capabilities
  .map((item) => `• ${item}`)
  .join("\n")}

Status
${playground.status}`,
    };
  }

  // ========================================================
  // CSV Analyzer
  // ========================================================

  if (
    query.includes("csv analyzer") ||
    query.includes("csv playground")
  ) {
    const playground =
      borePlay.playgrounds.find(
        (item) => item.name === "CSV Analyzer"
      );

    if (!playground) {
      return {
        type: "category",
        usePersonality: true,

        mood: "warning",

        title: "CSV Analyzer",

        message:
          "I don't currently have detailed knowledge about the CSV Analyzer.",
      };
    }

    return {
      type: "category",
      usePersonality: true,

      mood: "speaking",

      title: playground.name,

      message: `${playground.description}

It covers:

${playground.capabilities
  .map((item) => `• ${item}`)
  .join("\n")}

Status
${playground.status}`,
    };
  }

  // ========================================================
  // BORE Integration
  // ========================================================

  if (
    query.includes("bore help") ||
    query.includes("bore assist") ||
    query.includes("bore debug") ||
    query.includes("debug") ||
    query.includes("help me")
  ) {
    return {
      type: "category",
      usePersonality: true,

      mood: "speaking",

      title: "BORE × BORE Play",

      message: borePlay.relationshipWithBore,
    };
  }

  // ========================================================
  // Future Direction
  // ========================================================

  if (
    query.includes("future") ||
    query.includes("later") ||
    query.includes("planned") ||
    query.includes("will bore") ||
    query.includes("llm")
  ) {
    return {
      type: "category",
      usePersonality: true,

      mood: "speaking",

      title: "BORE Play • Future",

      message: `The planned direction includes:

${borePlay.futureDirection
  .map((item) => `• ${item}`)
  .join("\n")}`,
    };
  }

  // ========================================================
  // Default BORE Play Response
  // ========================================================

  return {
    type: "category",
    usePersonality: true,

    mood: "speaking",

    title: borePlay.name,

    message: `${borePlay.description}

Available playgrounds:

${borePlay.playgrounds
  .map(
    (playground) =>
      `• ${playground.name}\n  ${playground.description}`
  )
  .join("\n\n")}`,
  };
}

// ==========================================================
// Category Response
// ==========================================================

export function buildCategoryResponse(
  category: string,
  projects: Project[]
): BoreResponse {
  if (projects.length === 0) {
    return {
      type: "category",
      usePersonality: true,

      mood: "warning",

      title: category,

      message: `I couldn't find any projects in the ${category} category.`,
    };
  }

  return {
    type: "category",
    usePersonality: true,

    mood: "speaking",

    title: category,

    message: `${searchHeader()}

Projects in ${category}

${bullet(projects.map((p) => p.title))}`,
  };
}

// ==========================================================
// Unknown
// ==========================================================

export function buildUnknownResponse(): BoreResponse {
  return {
    type: "error",
    usePersonality: true,

    mood: "warning",

    title: "Unknown Request",

    message: getRandomResponse("unknown"),
  };
}

// ==========================================================
// Conversational Responses
// ==========================================================

export function buildGreetingResponse(): BoreResponse {
  return {
    type: "conversation",
    usePersonality: false,

    mood: "speaking",

    title: "BORE",

    message:
      "BORE online. Slightly bored, fully operational. What are you looking for?",
  };
}

export function buildThanksResponse(): BoreResponse {
  return {
    type: "conversation",
    usePersonality: false,

    mood: "speaking",

    title: "BORE",

    message:
      "You're welcome. Keeping the portfolio operational is apparently part of my job.",
  };
}

export function buildFarewellResponse(): BoreResponse {
  return {
    type: "conversation",
    usePersonality: false,

    mood: "idle",

    title: "BORE",

    message:
      "Returning to observation mode. Try not to break anything while I'm gone.",
  };
}

export function buildHowAreYouResponse(): BoreResponse {
  return {
    type: "conversation",
    usePersonality: false,

    mood: "speaking",

    title: "BORE",

    message:
      "Operational. Slightly bored. Still keeping an eye on Shubham's portfolio.",
  };
}

export function buildIdentityResponse(): BoreResponse {
  return {
    type: "conversation",
    usePersonality: false,

    mood: "speaking",

    title: "BORE",

    message:
      "I'm BORE, the resident intelligence of this portfolio. I explain Shubham's work, answer technical questions, and help visitors navigate what he's built.",
  };
}