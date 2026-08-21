"use client";

import { useState } from "react";
import {
  CheckCircle2,
  CircleHelp,
  Lightbulb,
  Trophy,
} from "lucide-react";

import engine from "../Engine/SQLJSEngine";
import { sqlChallenges } from "../Data/sqlChallenges";
import { useSQLPlayground } from "../Hooks/useSQLPlayground";
import { SQLPlaygroundStore } from "../State/SQLPlaygroundStore";

interface ChallengePanelProps {
  sql: ReturnType<typeof useSQLPlayground>;
}

export default function ChallengePanel({
  sql,
}: ChallengePanelProps) {
  const [currentChallenge, setCurrentChallenge] =
    useState(
      SQLPlaygroundStore.challengeMeta
        .currentChallenge
    );

  const [status, setStatus] = useState<
    "idle" | "correct" | "wrong"
  >(
    SQLPlaygroundStore.challengeMeta.status
  );

  const challenge =
    sqlChallenges[currentChallenge];

  async function checkAnswer() {
    try {
      await engine.initialize();

      const userResult =
        await engine.runQuery(sql.query);

      const expectedResult =
        await engine.runQuery(
          challenge.solution
        );

      const normalize = (
        rows: Record<string, unknown>[]
      ) =>
        JSON.stringify(
          rows
            .map((row) =>
              Object.keys(row)
                .sort()
                .reduce(
                  (obj, key) => {
                    obj[key] = row[key];

                    return obj;
                  },
                  {} as Record<
                    string,
                    unknown
                  >
                )
            )
            .sort((a, b) =>
              JSON.stringify(a).localeCompare(
                JSON.stringify(b)
              )
            )
        );

      if (
        normalize(userResult) ===
        normalize(expectedResult)
      ) {
        SQLPlaygroundStore.setChallengeStatus(
          "correct"
        );

        setStatus("correct");

        SQLPlaygroundStore.markChallengeCompleted(
          currentChallenge
        );

        setTimeout(() => {
          if (
            currentChallenge <
            sqlChallenges.length - 1
          ) {
            const nextChallenge =
              currentChallenge + 1;

            SQLPlaygroundStore.setCurrentChallenge(
              nextChallenge
            );

            SQLPlaygroundStore.setChallengeStatus(
              "idle"
            );

            setCurrentChallenge(
              nextChallenge
            );

            setStatus("idle");

            sql.setQuery(
              SQLPlaygroundStore.getChallengeQuery(
                nextChallenge
              )
            );

            sql.setResult([]);
            sql.setRowsReturned(0);
            sql.setExecutionTime(0);
            sql.setError(null);
          }
        }, 800);
      } else {
        SQLPlaygroundStore.setChallengeStatus(
          "wrong"
        );

        setStatus("wrong");
      }
    } catch {
      SQLPlaygroundStore.setChallengeStatus(
        "wrong"
      );

      setStatus("wrong");
    }
  }

  return (
    <aside
      className="
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-card
      "
    >
      {/* Header */}

      <div className="border-b border-white/10 p-5">
        <div className="flex items-center justify-between">
          <span
            className={`
              rounded-full
              px-3
              py-1
              text-xs
              font-medium

              ${
                challenge.difficulty === "Easy"
                  ? "bg-green-500/10 text-green-400"
                  : challenge.difficulty ===
                    "Medium"
                  ? "bg-yellow-500/10 text-yellow-400"
                  : "bg-red-500/10 text-red-400"
              }
            `}
          >
            {challenge.difficulty}
          </span>

          <div className="flex items-center gap-2">
            <Trophy
              size={16}
              className="text-yellow-400"
            />

            <span className="text-sm">
              {challenge.xp} XP
            </span>
          </div>
        </div>

        <h2 className="mt-4 text-xl font-bold">
          {challenge.title}
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Challenge {currentChallenge + 1} /{" "}
          {sqlChallenges.length}
        </p>
      </div>

      {/* Body */}

      <div className="flex-1 space-y-6 overflow-y-auto p-5">
        <div>
          <div className="flex items-center gap-2">
            <CircleHelp
              size={16}
              className="text-primary"
            />

            <h3 className="font-semibold">
              Description
            </h3>
          </div>

          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {challenge.description}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Lightbulb
              size={16}
              className="text-yellow-400"
            />

            <h3 className="font-semibold">
              Hint
            </h3>
          </div>

          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {challenge.hint}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <CheckCircle2
              size={16}
              className="text-green-400"
            />

            <h3 className="font-semibold">
              Expected Columns
            </h3>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {challenge.expectedColumns.map(
              (column) => (
                <span
                  key={column}
                  className="
                    rounded-full
                    bg-cyan-500/10
                    px-3
                    py-1
                    text-xs
                    text-cyan-400
                  "
                >
                  {column}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Completion */}

      {currentChallenge ===
        sqlChallenges.length - 1 &&
        status === "correct" && (
          <div
            className="
              rounded-xl
              border
              border-green-500/30
              bg-green-500/10
              p-4
              text-center
            "
          >
            <h3 className="text-lg font-bold text-green-400">
              🎉 Congratulations!
            </h3>

            <p className="mt-2 text-sm text-zinc-400">
              You completed every SQL challenge.
            </p>

            <button
              onClick={() => {
                SQLPlaygroundStore.resetChallenge();

                setCurrentChallenge(0);
                setStatus("idle");

                sql.setQuery("");
                sql.setResult([]);
                sql.setRowsReturned(0);
                sql.setExecutionTime(0);
                sql.setError(null);
              }}
              className="
                mt-5
                rounded-xl
                bg-primary
                px-6
                py-2.5
              "
            >
              Restart
            </button>
          </div>
        )}

      {/* Footer */}

      <div className="space-y-4 border-t border-white/10 p-5">
        {status === "correct" && (
          <div
            className="
              rounded-xl
              border
              border-green-500/30
              bg-green-500/10
              p-3
              text-sm
              text-green-400
            "
          >
            ✅ Correct Answer!
          </div>
        )}

        {status === "wrong" && (
          <div
            className="
              rounded-xl
              border
              border-red-500/30
              bg-red-500/10
              p-3
              text-sm
              text-red-400
            "
          >
            ❌ Incorrect Answer. Try again.
          </div>
        )}

        <button
          onClick={checkAnswer}
          className="
            w-full
            rounded-xl
            bg-primary
            py-3
            font-medium
            text-primary-foreground
            transition
            hover:opacity-90
          "
        >
          Check Answer
        </button>
      </div>
    </aside>
  );
}