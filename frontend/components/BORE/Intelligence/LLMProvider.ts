// ==========================================================
// BORE LLM Provider
// ==========================================================
//
// This file defines the contract between BORE Intelligence
// and an external language model.
//
// BORE does NOT care which provider implements this.
// NVIDIA, Groq, Gemini, OpenRouter, etc. can implement
// the same interface later.
//
// Keep provider-specific code OUT of ConversationEngine.
// ==========================================================

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMRequest {
  messages: LLMMessage[];

  /**
   * Maximum number of tokens the model should generate.
   */
  maxTokens?: number;

  /**
   * Controls response randomness.
   *
   * Lower = more deterministic.
   * Higher = more creative.
   */
  temperature?: number;

  /**
   * Optional metadata about where the request came from.
   *
   * Examples:
   * "portfolio"
   * "resume"
   * "sql"
   * "python"
   * "csv"
   */
  source?: string;
}

export interface LLMResponse {
  /**
   * Final generated response.
   */
  text: string;

  /**
   * Provider/model used.
   *
   * Useful later for debugging and fallback tracking.
   */
  model?: string;

  /**
   * Token usage if the provider returns it.
   */
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export interface LLMStreamChunk {
  /**
   * Incremental text returned by the model.
   */
  text: string;

  /**
   * True when the model has finished streaming.
   */
  done?: boolean;
}

export interface LLMProvider {
  /**
   * Generate a complete response.
   */
  generate(
    request: LLMRequest
  ): Promise<LLMResponse>;

  /**
   * Stream a response incrementally.
   *
   * This will be used later by BoreWindow so
   * BORE can appear to think/type naturally.
   */
  stream(
    request: LLMRequest
  ): AsyncIterable<LLMStreamChunk>;

  /**
   * Optional health check.
   *
   * Useful later for model fallback.
   */
  healthCheck?(): Promise<boolean>;
}