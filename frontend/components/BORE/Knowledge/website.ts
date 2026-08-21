// ==========================================================
// BORE Website Knowledge
// ==========================================================

export interface WebsiteKnowledge {
  name: string;
  title: string;
  description: string;
  purpose: string;
  capabilities: string[];
  playgrounds: string[];
  technologies: string[];
  architecture: string[];
}

export const websiteKnowledge: WebsiteKnowledge = {
  name: "Out of Boredom",

  title:
    "An intelligent portfolio and interactive data playground built by Shubham Kumar.",

  description:
    "Out of Boredom is Shubham's personal portfolio project that combines his work, projects, experiments, and interactive developer tools into one intelligent web experience.",

  purpose:
    "The project is designed to go beyond a traditional static portfolio by allowing visitors to explore Shubham's work, interact with BORE, and use practical data and programming playgrounds.",

  capabilities: [
    "Interactive portfolio exploration",
    "BORE AI assistant",
    "Resume analysis",
    "CSV analysis",
    "SQL playground",
    "Python playground",
    "Data analytics tools",
    "Interactive project exploration",
  ],

  playgrounds: [
    "SQL Playground",
    "Python Playground",
    "CSV Analyzer",
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

  architecture: [
    "Next.js frontend",
    "FastAPI backend",
    "PostgreSQL database",
    "BORE intelligence layer",
    "LLM integration",
  ],
};

export function getWebsiteKnowledge(): WebsiteKnowledge {
  return websiteKnowledge;
}