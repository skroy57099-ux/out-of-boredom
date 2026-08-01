// BORE/Knowledge/types.ts

export interface OwnerKnowledge {
  name: string;
  title: string;
  tagline: string;
  mission: string;
  bio: string;
  location?: string;

  strengths: string[];
  interests: string[];
  technologies: string[];

  social: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    email?: string;
  };
}

export interface ProjectKnowledge {
  id: string;

  title: string;

  shortDescription: string;

  fullDescription: string;

  purpose: string;

  technologies: string[];

  features: string[];

  challenges: string[];

  learnings: string[];

  futureImprovements: string[];

  github?: string;

  liveDemo?: string;

  status: "completed" | "ongoing" | "planned";

  difficulty: "beginner" | "intermediate" | "advanced";

  tags: string[];
}

export interface SkillKnowledge {
  category: string;

  skills: string[];
}

export interface ExperienceKnowledge {
  company: string;

  role: string;

  duration: string;

  summary: string;

  achievements: string[];

  technologies: string[];
}

export interface LabKnowledge {
  id: string;

  title: string;

  description: string;

  technologies: string[];

  status: "planned" | "building" | "completed";
}

export interface RoadmapKnowledge {
  phase: number;

  title: string;

  description: string;

  completed: boolean;
}
