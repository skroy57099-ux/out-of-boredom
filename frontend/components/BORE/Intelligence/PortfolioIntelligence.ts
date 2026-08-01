import { projects } from "@/components/Projects/projects";
import { Project } from "@/components/Projects/types";

export interface PortfolioStats {
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  featuredProjects: number;
  projectsWithGithub: number;
  projectsWithDemo: number;
  categories: number;
  technologies: number;
}

export interface TechnologyUsage {
  technology: string;
  count: number;
}

export interface CategoryUsage {
  category: string;
  count: number;
}

export class PortfolioIntelligence {
  /**
   * Return every project.
   */
  public getAllProjects(): Project[] {
    return projects;
  }

  /**
   * Overall portfolio statistics.
   */
  public getPortfolioStats(): PortfolioStats {
    return {
      totalProjects: projects.length,

      completedProjects: projects.filter(
        p => p.status === "Completed"
      ).length,

      inProgressProjects: projects.filter(
        p => p.status !== "Completed"
      ).length,

      featuredProjects: projects.filter(
        p => p.featured
      ).length,

      projectsWithGithub: projects.filter(
        p => !!p.github
      ).length,

      projectsWithDemo: projects.filter(
        p => !!p.demo
      ).length,

      categories: new Set(
        projects.map(p => p.category)
      ).size,

      technologies: new Set(
        projects.flatMap(p => p.technologies)
      ).size,
    };
  }

  /**
   * Featured projects.
   */
  public getFeaturedProjects(): Project[] {
    return projects.filter(p => p.featured);
  }

  /**
   * Completed projects.
   */
  public getCompletedProjects(): Project[] {
    return projects.filter(
      p => p.status === "Completed"
    );
  }

  /**
   * Projects with GitHub.
   */
  public getProjectsWithGithub(): Project[] {
    return projects.filter(
      p => !!p.github
    );
  }

  /**
   * Projects with live demo.
   */
  public getProjectsWithDemo(): Project[] {
    return projects.filter(
      p => !!p.demo
    );
  }

  /**
   * Search by technology.
   */
  public getProjectsByTechnology(
    technology: string
  ): Project[] {
    return projects.filter(project =>
      project.technologies.some(
        tech =>
          tech.toLowerCase() ===
          technology.toLowerCase()
      )
    );
  }

  /**
   * Search by category.
   */
  public getProjectsByCategory(
    category: string
  ): Project[] {
    return projects.filter(
      p =>
        p.category.toLowerCase() ===
        category.toLowerCase()
    );
  }

  /**
   * Technology popularity.
   */
  public getTechnologyUsage(): TechnologyUsage[] {
    const map = new Map<string, number>();

    projects.forEach(project => {
      project.technologies.forEach(tech => {
        map.set(
          tech,
          (map.get(tech) ?? 0) + 1
        );
      });
    });

    return [...map.entries()]
      .map(([technology, count]) => ({
        technology,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Category popularity.
   */
  public getCategoryUsage(): CategoryUsage[] {
    const map = new Map<string, number>();

    projects.forEach(project => {
      map.set(
        project.category,
        (map.get(project.category) ?? 0) + 1
      );
    });

    return [...map.entries()]
      .map(([category, count]) => ({
        category,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Most used technologies.
   */
  public getMostUsedTechnologies(
    limit = 5
  ): TechnologyUsage[] {
    return this.getTechnologyUsage().slice(0, limit);
  }

  /**
   * Recommend projects to new visitors.
   */
  public recommendProjects(
    limit = 3
  ): Project[] {
    return [...projects]
      .sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;

        if (a.featured) scoreA += 5;
        if (b.featured) scoreB += 5;

        if (a.demo) scoreA += 3;
        if (b.demo) scoreB += 3;

        if (a.github) scoreA += 2;
        if (b.github) scoreB += 2;

        scoreA += a.technologies.length;
        scoreB += b.technologies.length;

        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

  /**
   * Best overall project.
   */
  public getStrongestProject(): Project | null {
    return this.recommendProjects(1)[0] ?? null;
  }
}

export const portfolioIntelligence =
  new PortfolioIntelligence();