// ==========================================================
// BORE Play Knowledge
// ==========================================================

export interface BorePlayKnowledge {
  name: string;

  title: string;

  description: string;

  purpose: string;

  playgrounds: {
    name: string;
    description: string;
    capabilities: string[];
    status: "building" | "completed" | "planned";
  }[];

  relationshipWithBore: string;

  futureDirection: string[];
}

export const borePlayKnowledge: BorePlayKnowledge = {
  name: "BORE Play",

  title:
    "Interactive programming and data playgrounds inside Out of Boredom.",

  description:
    "BORE Play is the interactive learning and experimentation section of Out of Boredom. It brings programming, SQL, and data analysis tools together so visitors can work with data and code directly inside the portfolio.",

  purpose:
    "The goal of BORE Play is to turn the portfolio from a static collection of projects into an interactive environment where visitors can experiment, learn, analyze data, and understand how Shubham works with technical tools.",

  playgrounds: [
    {
      name: "SQL Playground",

      description:
        "An interactive environment for practicing SQL concepts and working with relational data.",

      capabilities: [
        "SQL query practice",
        "Working with relational datasets",
        "Learning SQL concepts",
        "Query experimentation",
      ],

      status: "completed",
    },

    {
      name: "Python Playground",

      description:
        "An interactive environment for practicing Python programming and experimenting with code.",

      capabilities: [
        "Python code execution",
        "Programming practice",
        "Code experimentation",
        "Learning Python concepts",
      ],

      status: "completed",
    },

    {
      name: "CSV Analyzer",

      description:
        "An interactive data analysis tool for uploading and exploring CSV datasets.",

      capabilities: [
        "CSV file analysis",
        "Dataset exploration",
        "Data inspection",
        "Data analysis workflows",
      ],

      status: "completed",
    },
  ],

  relationshipWithBore:
    "BORE acts as the intelligence layer that can eventually assist visitors throughout BORE Play. The planned integration allows BORE to explain concepts, answer questions, identify problems, and help debug SQL, Python, and other playground work.",

  futureDirection: [
    "LLM-powered technical assistance",
    "Context-aware debugging",
    "SQL query explanation",
    "Python error explanation",
    "General programming Q&A",
    "Data analysis assistance",
    "Resume Analyzer assistance",
  ],
};

// ==========================================================
// Get Complete BORE Play Knowledge
// ==========================================================

export function getBorePlayKnowledge(): BorePlayKnowledge {
  return borePlayKnowledge;
}

// ==========================================================
// Get Individual Playground
// ==========================================================

export function getPlayground(
  name: string
) {
  const query = name.toLowerCase();

  return borePlayKnowledge.playgrounds.find(
    (playground) =>
      playground.name.toLowerCase() === query
  );
}

// ==========================================================
// Get All Playgrounds
// ==========================================================

export function getAllPlaygrounds() {
  return borePlayKnowledge.playgrounds;
}