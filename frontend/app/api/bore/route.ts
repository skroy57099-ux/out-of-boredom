import { NextRequest, NextResponse } from "next/server";

import {
  boreIntelligence,
} from "@/components/BORE/Intelligence/BoreIntelligence";

import {
  contextBuilder,
} from "@/components/BORE/Intelligence/ContextBuilder";

import {
  createGroqProvider,
} from "@/components/BORE/Intelligence/providers/groq";

export async function POST(
  request: NextRequest
) {
  try {
    // ======================================================
    // Read Request
    // ======================================================

    const body = await request.json();

    const message =
      typeof body?.message === "string"
        ? body.message.trim()
        : "";

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          error: "Message is required.",
        },
        {
          status: 400,
        }
      );
    }

    // ======================================================
    // Prepare BORE Intelligence
    // ======================================================

    const intelligence =
      boreIntelligence.prepare({
        message,

        context: {
          source:
            body?.context?.source ??
            "portfolio",

          projectId:
            body?.context?.projectId,

          playground:
            body?.context?.playground,

          history:
            Array.isArray(
              body?.context?.history
            )
              ? body.context.history
              : [],
        },
      });

    // ======================================================
    // Build LLM Context
    // ======================================================

    const messages =
      contextBuilder.build({
        userMessage: message,

        intelligence,
      });

    // ======================================================
    // Create Provider
    // ======================================================

    const provider =
      createGroqProvider();

    // ======================================================
    // Generate Response
    // ======================================================

    const response =
      await provider.generate({
        messages,

        temperature: 0.4,

        maxTokens: 400,

        source:
          intelligence.context
            ?.source ??
          "portfolio",
      });

    // ======================================================
    // Return Response
    // ======================================================

    return NextResponse.json({
      success: true,

      text: response.text,

      model:
        response.model,

      usage:
        response.usage,

      intelligence: {
        mode:
          intelligence.mode,

        requiresLLM:
          intelligence.requiresLLM,
      },
    });

  } catch (error) {

    console.error(
      "BORE API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unknown BORE API error.",
      },
      {
        status: 500,
      }
    );
  }
}