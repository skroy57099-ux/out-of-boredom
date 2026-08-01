import { Project } from "@/components/Projects/types";
import {
  projects,
  getProjectsByCategory,
  getFeaturedProjects,
  searchProjects,
} from "@/components/Projects/projects";

export type BoreIntent =
  | "greeting"
  | "farewell"
  | "thanks"
  | "project"
  | "technology"
  | "category"
  | "featured"
  | "unknown";

export interface IntentResult {
  intent: BoreIntent;
  value?: string;
  projects?: Project[];
}

export function detectIntent(message: string): IntentResult {
  const query = message
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "");

  // ==========================================================
  // Greetings
  // ==========================================================

  const greetings = [
    "hi",
    "hello",
    "hey",
    "hola",
    "good morning",
    "good afternoon",
    "good evening",
    "how are you",
    "who are you",
    "introduce yourself",
  ];

  if (
    greetings.some(
      (g) => query === g || query.startsWith(g)
    )
  ) {
    return {
      intent: "greeting",
    };
  }

  // ==========================================================
  // Thanks
  // ==========================================================

  const thanks = [
    "thanks",
    "thank you",
    "thx",
    "ty",
    "appreciate it",
  ];

  if (
    thanks.some(
      (t) => query === t || query.startsWith(t)
    )
  ) {
    return {
      intent: "thanks",
    };
  }

  // ==========================================================
  // Farewell
  // ==========================================================

  const farewell = [
    "bye",
    "goodbye",
    "see you",
    "see ya",
    "later",
    "take care",
  ];

  if (
    farewell.some(
      (f) => query === f || query.startsWith(f)
    )
  ) {
    return {
      intent: "farewell",
    };
  }

  // ==========================================================
  // Featured Projects
  // ==========================================================

  if (
    query.includes("featured") ||
    query.includes("best project") ||
    query.includes("top project") ||
    query.includes("show projects")
  ) {
    return {
      intent: "featured",
      projects: getFeaturedProjects(),
    };
  }

  // ==========================================================
  // Project Search (Highest Priority)
  // ==========================================================

 //const projectMatches = searchProjects(query);*/

 // ==========================================================
// Normalize common conversation phrases
// ==========================================================

const cleanedQuery = query
  .replace(/^tell me about\s+/, "")
  .replace(/^about\s+/, "")
  .replace(/^show me\s+/, "")
  .replace(/^show\s+/, "")
  .replace(/^explain\s+/, "")
  .replace(/^describe\s+/, "")
  .replace(/^what is\s+/, "")
  .replace(/^what's\s+/, "")
  .trim();

// ==========================================================
// Project Search
// ==========================================================

const projectMatches = searchProjects(cleanedQuery);
console.log(projectMatches.map(p => p.title));
if (projectMatches.length > 0) {
  return {
    intent: "project",
    projects: projectMatches,
  };
}
  // ==========================================================
  // Technology Search
  // (Automatically derived from projects)
  // ==========================================================

  const technologies = [
    ...new Set(
      projects.flatMap((project) =>
        project.technologies.map((tech) =>
          tech.toLowerCase()
        )
      )
    ),
  ];

  for (const tech of technologies) {
    if (query.includes(tech)) {
      return {
        intent: "technology",
        value: tech,
        projects: projects.filter((project) =>
          project.technologies.some(
            (t) => t.toLowerCase() === tech
          )
        ),
      };
    }
  }

  // ==========================================================
  // Category Search
  // ==========================================================

  const categories = [
    "data analytics",
    "business intelligence",
    "machine learning",
    "artificial intelligence",
    "portfolio",
  ];

  for (const category of categories) {
    if (query.includes(category)) {
      return {
        intent: "category",
        value: category,
        projects: getProjectsByCategory(category),
      };
    }
  }

  // ==========================================================
  // Unknown
  // ==========================================================

  return {
    intent: "unknown",
  };
}
