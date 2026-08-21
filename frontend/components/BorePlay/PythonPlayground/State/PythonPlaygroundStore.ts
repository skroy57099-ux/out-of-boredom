import type { NotebookCell } from "../Types/notebook";
import { pythonChallenges } from "../Challenge/pythonChallenges";

/*
 * Temporary in-memory state for the Python Playground.
 *
 * IMPORTANT:
 * - Survives Practice <-> Challenge switching
 * - Does NOT survive browser refresh
 * - Does NOT use localStorage
 * - Does NOT store the Pyodide runtime
 */

let practiceCells: NotebookCell[] | null = null;

let challengeCurrentIndex = 0;

const challengeCode: Record<string, string> = {};

const completedChallenges = new Set<string>();

/* ================================================== */
/* PRACTICE STATE */
/* ================================================== */

export function getPracticeCells(): NotebookCell[] | null {
  return practiceCells;
}

export function setPracticeCells(
  cells: NotebookCell[]
) {
  practiceCells = cells;
}

/* ================================================== */
/* CHALLENGE STATE */
/* ================================================== */

export function getChallengeState() {
  return {
    currentIndex: challengeCurrentIndex,
    code: { ...challengeCode },
    completedChallenges: [
      ...completedChallenges,
    ],
  };
}

export function setChallengeCurrentIndex(
  index: number
) {
  challengeCurrentIndex = index;
}

export function getChallengeCode(
  challengeId: string
): string | undefined {
  return challengeCode[challengeId];
}

export function setChallengeCode(
  challengeId: string,
  code: string
) {
  challengeCode[challengeId] = code;
}

export function markChallengeCompleted(
  challengeId: string
) {
  completedChallenges.add(challengeId);
}

export function isChallengeCompleted(
  challengeId: string
): boolean {
  return completedChallenges.has(challengeId);
}

/* ================================================== */
/* RESET */
/* ================================================== */

export function resetPythonPlayground() {
  practiceCells = null;

  challengeCurrentIndex = 0;

  Object.keys(challengeCode).forEach(
    (key) => {
      delete challengeCode[key];
    }
  );

  completedChallenges.clear();
}

/* ================================================== */
/* INITIALIZE CHALLENGE CODE */
/* ================================================== */

export function initializeChallengeState() {
  const firstChallenge = pythonChallenges[0];

  if (
    firstChallenge &&
    challengeCode[firstChallenge.id] === undefined
  ) {
    challengeCode[firstChallenge.id] =
      firstChallenge.starterCode;
  }
}