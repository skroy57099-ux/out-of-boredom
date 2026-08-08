import { runPython } from "../Utils/PythonRunner";

export interface ChallengeCheckResult {
  correct: boolean;
  message: string;
  output: string;
  error: string | null;
}

interface ChallengeWithSolution {
  id: string;
  solutionCode: string;
}

function normalizeOutput(output: string): string {
  return output
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n+/g, "\n");
}

export async function checkChallenge(
  challenge: ChallengeWithSolution,
  userCode: string
): Promise<ChallengeCheckResult> {
  if (!userCode.trim()) {
    return {
      correct: false,
      message: "Write a solution before checking your answer.",
      output: "",
      error: null,
    };
  }

  try {
    // Run user's solution
    const userResult = await runPython(userCode);

    if (userResult.error) {
      return {
        correct: false,
        message: "Your code has an error. Fix it and try again.",
        output: userResult.output,
        error: userResult.error,
      };
    }

    // Run hidden reference solution
    const expectedResult = await runPython(
      challenge.solutionCode
    );

    if (expectedResult.error) {
      console.error(
        "Challenge reference solution failed:",
        expectedResult.error
      );

      return {
        correct: false,
        message: "Challenge validation failed.",
        output: userResult.output,
        error: null,
      };
    }

    const actual = normalizeOutput(
      userResult.output
    );

    const expected = normalizeOutput(
      expectedResult.output
    );

    const correct = actual === expected;

    return {
      correct,

      message: correct
        ? "Correct! Challenge completed."
        : "Not quite. Your result does not match the expected answer.",

      output: userResult.output,

      error: null,
    };
  } catch (error) {
    return {
      correct: false,

      message:
        error instanceof Error
          ? error.message
          : "Unable to check the answer.",

      output: "",

      error:
        error instanceof Error
          ? error.message
          : String(error),
    };
  }
}