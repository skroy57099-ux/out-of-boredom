import {
  portfolioIntelligence,
} from "./PortfolioIntelligence";

import {
  getOwnerKnowledge,
  getExperienceKnowledge,
  getSkillsKnowledge,
  getPortfolioKnowledge,
} from "../Knowledge";

import type { Project } from "@/components/Projects/types";
import type {
  OwnerKnowledge,
  ExperienceKnowledge,
  SkillKnowledge,
} from "../Knowledge/types";

// ==========================================================
// Types
// ==========================================================

export type BoreIntelligenceMode =
  | "local"
  | "personal"
  | "llm";

export interface BoreContext {
  /**
   * Current page or feature.
   *
   * Examples:
   * portfolio
   * sql
   * python
   * resume
   * csv
   */
  source?: string;

  /**
   * Project currently being discussed.
   */
  projectId?: string;

  /**
   * Context supplied by a playground.
   */
  playground?: {
    type: string;
    data?: unknown;
  };

  /**
   * Recent conversation.
   */
  history?: Array<{
    role: "user" | "bore";
    message: string;
  }>;
}

export interface BoreIntelligenceRequest {
  message: string;
  context?: BoreContext;
}

export interface BorePersonalKnowledge {
  owner?: OwnerKnowledge;

  experience?: ExperienceKnowledge[];

  skills?: SkillKnowledge[];

  projects?: Project[];
}

export interface BoreIntelligenceResult {
  /**
   * local
   *   Existing deterministic portfolio knowledge.
   *
   * personal
   *   Shubham-specific knowledge.
   *
   * llm
   *   Requires general reasoning / future LLM.
   */
  mode: BoreIntelligenceMode;

  /**
   * Whether an LLM should eventually be called.
   */
  requiresLLM: boolean;

  /**
   * Relevant projects.
   */
  projects?: Project[];

  /**
   * Relevant personal knowledge.
   */
  personalKnowledge?: BorePersonalKnowledge;

  /**
   * Context supplied by the caller.
   */
  context?: BoreContext;

  /**
   * Structured knowledge that can later be
   * passed to the LLM.
   */
  knowledge?: Record<string, unknown>;
}

// ==========================================================
// Bore Intelligence
// ==========================================================

export class BoreIntelligence {

  /**
   * Main intelligence preparation layer.
   *
   * IMPORTANT:
   *
   * This method does NOT call an LLM yet.
   *
   * It decides what information BORE needs.
   */
  public prepare(
    request: BoreIntelligenceRequest
  ): BoreIntelligenceResult {

    const message = request.message
      .toLowerCase()
      .trim();

    const context = request.context ?? {};

    // ======================================================
    // 1. Project Knowledge
    // ======================================================

    const projects =
      this.findRelevantProjects(message);

    if (projects.length > 0) {
      return {
        mode: "local",

        requiresLLM: false,

        projects,

        context,

        knowledge: {
          type: "project",

          projects: projects.map((project) => ({
            id: project.id,

            title: project.title,

            shortDescription:
              project.shortDescription,

            longDescription:
              project.longDescription,

            category:
              project.category,

            technologies:
              project.technologies,

            status:
              project.status,

            github:
              project.github,

            demo:
              project.demo,

            stats:
              project.stats,
          })),
        },
      };
    }

    // ======================================================
    // 2. Personal Knowledge
    // ======================================================

    const personalKnowledge =
      this.findPersonalKnowledge(message);

    if (personalKnowledge) {
      return {
        mode: "personal",

        requiresLLM: true,

        personalKnowledge,

        context,

        knowledge: {
          type: "personal",

          ...personalKnowledge,
        },
      };
    }

    // ======================================================
    // 3. General Intelligence
    // ======================================================

    return {
      mode: "llm",

      requiresLLM: true,

      context,

      knowledge: {
        type: "general",

        portfolioStats:
          portfolioIntelligence
            .getPortfolioStats(),
      },
    };
  }

  // ========================================================
  // Project Retrieval
  // ========================================================

  private findRelevantProjects(
    message: string
  ): Project[] {

    const allProjects =
      portfolioIntelligence
        .getAllProjects();

    const query =
      this.cleanProjectQuery(message);

    if (!query) {
      return [];
    }

    return allProjects.filter(
      (project) => {

        const title =
          project.title.toLowerCase();

        const id =
          project.id.toLowerCase();

        const shortDescription =
          project.shortDescription
            .toLowerCase();

        const longDescription =
          project.longDescription
            .toLowerCase();

        const category =
          project.category
            .toLowerCase();

        const technologies =
          project.technologies.map(
            (technology) =>
              technology.toLowerCase()
          );

        return (
          query.includes(title) ||

          title.includes(query) ||

          query.includes(id) ||

          id.includes(query) ||

          shortDescription.includes(query) ||

          longDescription.includes(query) ||

          category.includes(query) ||

          technologies.some(
            (technology) =>
              query.includes(technology) ||
              technology.includes(query)
          )
        );
      }
    );
  }

  // ========================================================
  // Personal Knowledge Retrieval
  // ========================================================

  private findPersonalKnowledge(
    message: string
  ): BorePersonalKnowledge | null {

    const query =
      message.toLowerCase().trim();

    if (!query) {
      return null;
    }

    const wantsOwner =
      this.matchesAny(query, [
        "shubham",
        "about shubham",
        "who is shubham",
        "tell me about shubham",
        "about the creator",
        "who created this",
        "who built this",
        "who made this",
        "creator",
        "owner",
        "developer",
        "about you",
      ]);

    const wantsExperience =
      this.matchesAny(query, [
        "experience",
        "work experience",
        "work history",
        "worked",
        "previous work",
        "job",
        "jobs",
        "company",
        "companies",
        "career",
        "background",
        "professional background",
      ]);

    const wantsSkills =
      this.matchesAny(query, [
        "skills",
        "skill",
        "technical skills",
        "what can shubham do",
        "what does shubham know",
        "technologies does shubham know",
        "tools does shubham use",
      ]);

    const wantsPersonalProfile =
      this.matchesAny(query, [
        "education",
        "degree",
        "study",
        "studied",
        "background",
        "biotechnology",
        "data analyst",
        "ai engineer",
      ]);

    /**
     * ------------------------------------------------------
     * Owner
     * ------------------------------------------------------
     */

    if (
      wantsOwner ||
      wantsPersonalProfile
    ) {

      return {
        owner:
          getOwnerKnowledge(),

        experience:
          wantsExperience
            ? getExperienceKnowledge()
            : undefined,

        skills:
          wantsSkills
            ? getSkillsKnowledge()
            : undefined,
      };
    }

    /**
     * ------------------------------------------------------
     * Experience
     * ------------------------------------------------------
     */

    if (wantsExperience) {
      return {
        experience:
          getExperienceKnowledge(),

        owner:
          getOwnerKnowledge(),
      };
    }

    /**
     * ------------------------------------------------------
     * Skills
     * ------------------------------------------------------
     */

    if (wantsSkills) {
      return {
        skills:
          getSkillsKnowledge(),

        owner:
          getOwnerKnowledge(),
      };
    }

    return null;
  }

  // ========================================================
  // Query Helpers
  // ========================================================

  private cleanProjectQuery(
    message: string
  ): string {

    return message
      .replace(
        /^tell me about\s+/i,
        ""
      )
      .replace(
        /^about\s+/i,
        ""
      )
      .replace(
        /^show me\s+/i,
        ""
      )
      .replace(
        /^show\s+/i,
        ""
      )
      .replace(
        /^explain\s+/i,
        ""
      )
      .replace(
        /^describe\s+/i,
        ""
      )
      .trim();
  }

  private matchesAny(
    query: string,
    phrases: string[]
  ): boolean {

    return phrases.some(
      (phrase) =>
        query === phrase ||
        query.includes(phrase)
    );
  }

  // ========================================================
  // Portfolio Knowledge Summary
  // ========================================================

  public getPortfolioKnowledge() {

    return {
      stats:
        portfolioIntelligence
          .getPortfolioStats(),

      featured:
        portfolioIntelligence
          .getFeaturedProjects()
          .map((project) => ({
            id: project.id,

            title:
              project.title,

            description:
              project.shortDescription,
          })),

      technologies:
        portfolioIntelligence
          .getMostUsedTechnologies(10),

      categories:
        portfolioIntelligence
          .getCategoryUsage(),
    };
  }

  // ========================================================
  // Full Personal Knowledge
  // ========================================================

  public getPersonalKnowledge() {

    return {
      owner:
        getOwnerKnowledge(),

      experience:
        getExperienceKnowledge(),

      skills:
        getSkillsKnowledge(),

      projects:
        getPortfolioKnowledge(),
    };
  }
}

// ==========================================================
// Singleton
// ==========================================================

export const boreIntelligence =
  new BoreIntelligence();