// ==========================================================
// BORE - Groq LLM Provider
// ==========================================================
//
// Provider-specific implementation.
//
// IMPORTANT:
// - This file runs on the SERVER only.
// - Never import this directly into client components.
// - API keys must remain in environment variables.
// ==========================================================

import type {
  LLMProvider,
  LLMRequest,
  LLMResponse,
  LLMStreamChunk,
} from "../LLMProvider";

const GROQ_API_URL =
  "https://api.groq.com/openai/v1/chat/completions";

const DEFAULT_MODEL =
  process.env.GROQ_MODEL || "openai/gpt-oss-120b";

export class GroqProvider implements LLMProvider {
  private readonly apiKey: string;

  private readonly model: string;

  constructor() {
    const apiKey =
      process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw new Error(
        "GROQ_API_KEY is not configured."
      );
    }

    this.apiKey = apiKey;

    this.model =
      process.env.GROQ_MODEL ??
      DEFAULT_MODEL;
  }

  // ========================================================
  // Generate
  // ========================================================

  public async generate(
    request: LLMRequest
  ): Promise<LLMResponse> {

    const response =
      await fetch(GROQ_API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization:
            `Bearer ${this.apiKey}`,
        },

        body: JSON.stringify({
          model: this.model,

          messages:
            request.messages,

          temperature:
            request.temperature ??
            0.4,

          max_tokens:
            request.maxTokens ??
            800,

          stream: false,
        }),
      });

    if (!response.ok) {
      const errorText =
        await response.text();

      throw new Error(
        `Groq API error ${response.status}: ${errorText}`
      );
    }

    const data =
      await response.json();

    const text =
      data?.choices?.[0]?.message?.content;

    if (
      typeof text !== "string"
    ) {
      throw new Error(
        "Groq returned an invalid response."
      );
    }

    return {
      text,

      model:
        data.model ??
        this.model,

      usage: {
        promptTokens:
          data.usage?.prompt_tokens,

        completionTokens:
          data.usage?.completion_tokens,

        totalTokens:
          data.usage?.total_tokens,
      },
    };
  }

  // ========================================================
  // Streaming
  // ========================================================

  public async *stream(
    request: LLMRequest
  ): AsyncIterable<LLMStreamChunk> {

    const response =
      await fetch(GROQ_API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization:
            `Bearer ${this.apiKey}`,
        },

        body: JSON.stringify({
          model: this.model,

          messages:
            request.messages,

          temperature:
            request.temperature ??
            0.4,

          max_tokens:
            request.maxTokens ??
            800,

          stream: true,
        }),
      });

    if (!response.ok) {
      const errorText =
        await response.text();

      throw new Error(
        `Groq streaming error ${response.status}: ${errorText}`
      );
    }

    if (!response.body) {
      throw new Error(
        "Groq response does not contain a stream."
      );
    }

    const reader =
      response.body.getReader();

    const decoder =
      new TextDecoder();

    let buffer = "";

    try {
      while (true) {

        const {
          done,
          value,
        } = await reader.read();

        if (done) {
          break;
        }

        buffer +=
          decoder.decode(
            value,
            {
              stream: true,
            }
          );

        const lines =
          buffer.split("\n");

        buffer =
          lines.pop() ?? "";

        for (const rawLine of lines) {

          const line =
            rawLine.trim();

          if (!line) {
            continue;
          }

          if (
            line ===
            "data: [DONE]"
          ) {
            yield {
              text: "",
              done: true,
            };

            return;
          }

          if (
            !line.startsWith(
              "data:"
            )
          ) {
            continue;
          }

          const jsonText =
            line.slice(5).trim();

          try {

            const data =
              JSON.parse(
                jsonText
              );

            const text =
              data?.choices?.[0]
                ?.delta?.content;

            if (
              typeof text ===
              "string" &&
              text.length > 0
            ) {
              yield {
                text,
                done: false,
              };
            }

          } catch {
            // Ignore malformed
            // partial SSE chunks.
          }
        }
      }

      yield {
        text: "",
        done: true,
      };

    } finally {
      reader.releaseLock();
    }
  }

  // ========================================================
  // Health Check
  // ========================================================

  public async healthCheck(): Promise<boolean> {

    try {

      const response =
        await fetch(
          "https://api.groq.com/openai/v1/models",
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${this.apiKey}`,
            },
          }
        );

      return response.ok;

    } catch {
      return false;
    }
  }
}

// ==========================================================
// Provider Factory
// ==========================================================

export function createGroqProvider(): GroqProvider {
  return new GroqProvider();
}