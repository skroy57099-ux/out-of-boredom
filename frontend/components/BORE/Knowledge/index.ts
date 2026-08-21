import { owner } from "./owner";
import { experience } from "./experience";
import { skills } from "./skills";

import { projects } from "@/components/Projects/projects";

import type {
  OwnerKnowledge,
  ExperienceKnowledge,
  SkillKnowledge,
} from "./types";

import type { Project } from "@/components/Projects/types";

export interface BoreKnowledge {
  owner: OwnerKnowledge;

  experience: ExperienceKnowledge[];

  skills: SkillKnowledge[];

  projects: Project[];
}

/**
 * Canonical BORE knowledge source.
 *
 * This is the structured knowledge layer.
 * It does not generate answers.
 *
 * Intelligence decides how this knowledge
 * should be used.
 */
export const boreKnowledge: BoreKnowledge = {
  owner,

  experience,

  skills,

  projects,
};

/**
 * ---------------------------------------------------------
 * Owner
 * ---------------------------------------------------------
 */

export function getOwnerKnowledge(): OwnerKnowledge {
  return boreKnowledge.owner;
}

/**
 * ---------------------------------------------------------
 * Experience
 * ---------------------------------------------------------
 */

export function getExperienceKnowledge(): ExperienceKnowledge[] {
  return boreKnowledge.experience;
}

/**
 * ---------------------------------------------------------
 * Skills
 * ---------------------------------------------------------
 */

export function getSkillsKnowledge(): SkillKnowledge[] {
  return boreKnowledge.skills;
}

/**
 * ---------------------------------------------------------
 * Portfolio
 * ---------------------------------------------------------
 */

export function getPortfolioKnowledge(): Project[] {
  return boreKnowledge.projects;
}

/**
 * ---------------------------------------------------------
 * Project Lookup
 * ---------------------------------------------------------
 */

export function getProjectKnowledge(
  projectId: string
): Project | undefined {
  return boreKnowledge.projects.find(
    (project) => project.id === projectId
  );
}

/**
 * ---------------------------------------------------------
 * Owner Knowledge Search
 * ---------------------------------------------------------
 *
 * Deterministic search for now.
 *
 * Later, semantic retrieval / RAG can sit above this.
 */

export function searchOwnerKnowledge(
  query: string
): OwnerKnowledge | null {
  const text = query.toLowerCase().trim();

  if (!text) {
    return null;
  }

  const ownerText = [
    boreKnowledge.owner.name,
    boreKnowledge.owner.title,
    boreKnowledge.owner.tagline,
    boreKnowledge.owner.mission,
    boreKnowledge.owner.bio,
    boreKnowledge.owner.location ?? "",
    ...boreKnowledge.owner.strengths,
    ...boreKnowledge.owner.interests,
    ...boreKnowledge.owner.technologies,
  ]
    .join(" ")
    .toLowerCase();

  if (
    ownerText.includes(text) ||
    text.includes("shubham") ||
    text.includes("owner") ||
    text.includes("creator") ||
    text.includes("about shubham")
  ) {
    return boreKnowledge.owner;
  }

  return null;
}

/**
 * ---------------------------------------------------------
 * Knowledge Summary
 * ---------------------------------------------------------
 *
 * Used later when preparing context for the LLM.
 */

export function getKnowledgeSummary() {
  return {
    owner: boreKnowledge.owner,

    experience: boreKnowledge.experience,

    skills: boreKnowledge.skills,

    projects: boreKnowledge.projects.map((project) => ({
      id: project.id,
      title: project.title,
      shortDescription: project.shortDescription,
      longDescription: project.longDescription,
      category: project.category,
      technologies: project.technologies,
      status: project.status,
      github: project.github,
      demo: project.demo,
      stats: project.stats,
    })),
  };
}