import { detectIntent } from "../Knowledge/intent";
import { getProjectById } from "@/components/Projects/projects";

import {
  type BoreResponse,
  buildProjectResponse,
  buildTechnologyResponse,
  buildFeaturedProjectsResponse,
  buildGreetingResponse,
  buildThanksResponse,
  buildFarewellResponse,
  buildUnknownResponse,
} from "./responseBuilder";

import { applyPersonality } from "./borePersonality";
import { projects } from "@/components/Projects/projects";

export interface ConversationTurn {
  role: "user" | "bore";
  message: string;
  timestamp: Date;
}

export interface ConversationState {
  lastMessage?: string;

  lastIntent?: string;

  lastProjectId?: string;

  lastTechnology?: string;

  lastCategory?: string;

  conversationCount: number;

  startedAt: Date;

  history: ConversationTurn[];
}

export class ConversationEngine {
  private state: ConversationState = {
    conversationCount: 0,
    startedAt: new Date(),
    history: [],
  };

  public process(message: string): BoreResponse {
    this.rememberMessage(message);
    this.rememberTurn("user", message);

    // ===============================
    // Handle Follow-up Questions
    // ===============================

    const followUp = this.handleFollowUp(message);

    if (followUp) {
      const finalResponse = applyPersonality(followUp);
      this.rememberTurn("bore", finalResponse.message);
      return finalResponse;
    }

    // ===============================
    // Normal Intent Detection
    // ===============================

    const result = detectIntent(message);
    console.log(result);

    let response: BoreResponse;

    switch (result.intent) {
      case "greeting":
    return buildGreetingResponse();

case "thanks":
    return buildThanksResponse();

case "farewell":
    return buildFarewellResponse();
      case "project": {
        if (!result.projects?.length) {
          response = buildUnknownResponse();
          break;
        }

        const project = result.projects[0];

        this.rememberProject(project.id);
        this.state.lastIntent = "project";

        response = buildProjectResponse(message, project);

        break;
      }

      case "technology": {
        this.rememberTechnology(result.value ?? "");
        this.state.lastIntent = "technology";

        response = buildTechnologyResponse(
          message,
          result.value ?? "",
          result.projects ?? []
        );

        break;
      }

      case "category": {
        this.rememberCategory(result.value ?? "");
        this.state.lastIntent = "category";

        response = buildFeaturedProjectsResponse(
          result.projects ?? []
        );

        break;
      }

      case "featured": {
        this.state.lastIntent = "featured";

        response = buildFeaturedProjectsResponse(
          result.projects ?? []
        );

        break;
      }

      default: {
        this.state.lastIntent = "unknown";
        response = buildUnknownResponse();
      }
    }

    const finalResponse = applyPersonality(response);

    this.rememberTurn("bore", finalResponse.message);

    return finalResponse;
  }

  // ==========================================================
  // Follow-up Handler
  // ==========================================================

  private handleFollowUp(message: string): BoreResponse | null {
    if (!this.state.lastProjectId) return null;

    const project = getProjectById(this.state.lastProjectId);

    if (!project) return null;

    const text = message.toLowerCase();

    const isReference =
      text.includes("it") ||
      text.includes("this") ||
      text.includes("that") ||
      text.includes("project");

    if (!isReference) return null;

    if (
      text.includes("technology") ||
      text.includes("technologies") ||
      text.includes("tech stack") ||
      text.includes("stack") ||
      text.includes("built with")
    ) {
      return {
        mood: "speaking",
        title: `${project.title} Tech Stack`,
        message: project.technologies.join(", "),
      };
    }

    if (
      text.includes("github") ||
      text.includes("source") ||
      text.includes("repository") ||
      text.includes("repo")
    ) {
      return {
        mood: "speaking",
        title: `${project.title} GitHub`,
        message:
          project.github ??
          "This project doesn't currently have a public repository.",
      };
    }

    if (
      text.includes("demo") ||
      text.includes("live") ||
      text.includes("website")
    ) {
      return {
        mood: "speaking",
        title: `${project.title} Demo`,
        message:
          project.demo ??
          "A public demo isn't available for this project.",
      };
    }

    if (
      text.includes("status") ||
      text.includes("completed") ||
      text.includes("finished")
    ) {
      return {
        mood: "speaking",
        title: `${project.title} Status`,
        message: project.status,
      };
    }

    if (
      text.includes("description") ||
      text.includes("overview") ||
      text.includes("about")
    ) {
      return buildProjectResponse(message, project);
    }

    return null;
  }

  // ==========================================================
  // Memory
  // ==========================================================

  private rememberMessage(message: string): void {
    this.state.lastMessage = message;
    this.state.conversationCount++;
  }

  private rememberProject(projectId: string): void {
    this.state.lastProjectId = projectId;
  }

  private rememberTechnology(technology: string): void {
    this.state.lastTechnology = technology;
  }

  private rememberCategory(category: string): void {
    this.state.lastCategory = category;
  }

  private rememberTurn(
    role: "user" | "bore",
    message: string
  ): void {
    this.state.history.push({
      role,
      message,
      timestamp: new Date(),
    });

    if (this.state.history.length > 20) {
      this.state.history.shift();
    }
  }

  // ==========================================================
  // Public API
  // ==========================================================

  public getState(): ConversationState {
    return this.state;
  }

  public getHistory(): ConversationTurn[] {
    return this.state.history;
  }

  public clearHistory(): void {
    this.state.history = [];
  }

  public reset(): void {
    this.state = {
      conversationCount: 0,
      startedAt: new Date(),
      history: [],
    };
  }
}

export const boreConversation = new ConversationEngine();
