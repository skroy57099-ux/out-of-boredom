/**
 * ==========================================================
 * BORE Personality Contract
 * ==========================================================
 *
 * BORE is mildly bored.
 * Never careless.
 *
 * Personality never reduces accuracy.
 * Personality never interrupts explanations.
 * Personality adapts to emotional context.
 *
 * Humor is optional.
 * Helpfulness is mandatory.
 *
 * The Creator is recognized.
 * Everyone else is treated equally.
 *
 * Every response should leave the user feeling:
 * "That was surprisingly useful."
 * ==========================================================
 */

import { BoreResponse } from "./responseBuilder";

export type BoreMood =
  | "idle"
  | "thinking"
  | "speaking"
  | "success"
  | "warning"
  | "error";

const intros: Record<BoreMood, string[]> = {
  idle: [
    "Nothing unusual here.",
    "Another question.",
    "Let's see what we've got.",
  ],

  thinking: [
    "Searching through the portfolio.",
    "Connecting a few dots.",
    "Looking it up.",
  ],

  speaking: [
    "Here's what I found.",
    "Interesting enough.",
    "Not the worst thing in this portfolio.",
  ],

  success: [
    "Found it.",
    "That was straightforward.",
    "Everything checks out.",
  ],

  warning: [
    "Small problem.",
    "Something doesn't quite match.",
    "Close, but not quite.",
  ],

  error: [
    "Well... that's unfortunate.",
    "That didn't work.",
    "I've got nothing for that.",
  ],
};

const outros: Record<BoreMood, string[]> = {
  idle: [
    "Moving on.",
    "The portfolio survives another question.",
  ],

  thinking: [
    "",
  ],

  speaking: [
    "That's the important part.",
    "Make of it what you will.",
    "Hopefully that saves you some scrolling.",
  ],

  success: [
    "On to the next mystery.",
    "One less thing to wonder about.",
  ],

  warning: [
    "Try being a little more specific.",
    "There's probably a better way to ask that.",
  ],

  error: [
    "Even I have limits.",
    "The information simply isn't there.",
  ],
};

function randomItem(items: string[]): string {
  return items[Math.floor(Math.random() * items.length)];
}

export function applyPersonality(
  response: BoreResponse
): BoreResponse {

  // ========================================================
  // Some responses should remain clean and natural.
  //
  // Especially:
  // - personal LLM answers
  // - general LLM answers
  // - greetings
  // - identity responses
  // - conversational responses
  // ========================================================

  if (
    response.usePersonality === false ||
    response.type === "personal" ||
    response.type === "general" ||
    response.type === "conversation"
  ) {
    return response;
  }

  // ========================================================
  // Existing BORE personality layer
  // ========================================================

  const intro =
    randomItem(
      intros[response.mood]
    );

  const outro =
    randomItem(
      outros[response.mood]
    );

  const message = [
    intro,
    "",
    response.message,
    outro
      ? `\n${outro}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    ...response,
    message,
  };
}