"use client";

import { useState } from "react";

import {
  Database,
  Lightbulb,
  Trophy,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import ChallengeCell from "./ChallengeCell";

import { pythonChallenges } from "./pythonChallenges";

import { checkChallenge } from "./ChallengeChecker";

import {
  getChallengeState,
  getChallengeCode,
  setChallengeCode,
  setChallengeCurrentIndex,
  markChallengeCompleted,
  initializeChallengeState,
} from "../State/PythonPlaygroundStore";

export default function ChallengeMode() {
  /*
   * Initialize the temporary challenge store.
   */
  initializeChallengeState();

  /*
   * Restore the last challenge index.
   */
  const [currentIndex, setCurrentIndex] =
    useState(() => {
      return getChallengeState().currentIndex;
    });

  const challenge =
    pythonChallenges[currentIndex];

  /*
   * Restore saved code for this challenge.
   */
  const [code, setCode] = useState(() => {
    if (!challenge) {
      return "";
    }

    return (
      getChallengeCode(challenge.id) ??
      challenge.starterCode
    );
  });

  const [checking, setChecking] =
    useState(false);

  const [feedback, setFeedback] =
    useState<{
      correct: boolean;
      message: string;
    } | null>(null);

  if (!challenge) {
    return (
      <div
        className="
          w-full
          min-w-0

          rounded-xl
          border
          border-white/10

          bg-[#0B0F14]

          p-6
          sm:p-8

          text-center
          text-gray-400
        "
      >
        No challenges available.
      </div>
    );
  }

  /* ==================================================
     CODE CHANGE
     ================================================== */

  const handleCodeChange = (
    value: string
  ) => {
    setCode(value);

    setChallengeCode(
      challenge.id,
      value
    );

    setFeedback(null);
  };

  /* ==================================================
     SUBMIT
     ================================================== */

  const handleSubmit = async () => {
    if (checking) {
      return;
    }

    setChecking(true);
    setFeedback(null);

    setChallengeCode(
      challenge.id,
      code
    );

    try {
      const result =
        await checkChallenge(
          challenge,
          code
        );

      setFeedback({
        correct: result.correct,
        message: result.message,
      });

      if (result.correct) {
        markChallengeCompleted(
          challenge.id
        );

        const nextIndex =
          currentIndex + 1;

        if (
          nextIndex <
          pythonChallenges.length
        ) {
          setTimeout(() => {
            const nextChallenge =
              pythonChallenges[
                nextIndex
              ];

            setCurrentIndex(
              nextIndex
            );

            setChallengeCurrentIndex(
              nextIndex
            );

            const nextCode =
              getChallengeCode(
                nextChallenge.id
              ) ??
              nextChallenge.starterCode;

            setCode(nextCode);

            setChallengeCode(
              nextChallenge.id,
              nextCode
            );

            setFeedback(null);
          }, 900);
        }
      }
    } catch (error) {
      setFeedback({
        correct: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to check the answer.",
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div
      className="
        flex
        w-full
        min-w-0
        max-w-full

        flex-col
      "
    >
      {/* ==================================================
          CHALLENGE WORKSPACE
          ================================================== */}

      <div
        className="
          grid

          w-full
          min-w-0
          max-w-full

          grid-cols-1

          overflow-hidden

          rounded-xl

          border
          border-white/10

          bg-[#0B0F14]

          xl:grid-cols-[220px_minmax(0,1fr)_360px]

          xl:min-h-[650px]
        "
      >
        {/* ==================================================
            DATASET
            ================================================== */}

        <aside
          className="
            min-w-0
            max-w-full

            border-b
            border-white/10

            bg-[#080B0F]

            xl:border-b-0
            xl:border-r

            xl:min-h-0
          "
        >
          <div
            className="
              flex
              h-full
              min-w-0
              flex-col
            "
          >
            {/* Dataset Header */}

            <div
              className="
                shrink-0

                border-b
                border-white/10

                px-4
                py-4

                sm:px-5
              "
            >
              <div className="flex items-center gap-2">
                <Database
                  size={18}
                  className="shrink-0 text-cyan-400"
                />

                <span className="font-semibold text-white">
                  Dataset
                </span>
              </div>
            </div>

            {/* Dataset Content */}

            <div
              className="
                min-h-0
                overflow-y-auto

                p-3
                sm:p-4

                max-h-[230px]

                xl:max-h-none
                xl:flex-1
              "
            >
              <div
                className="
                  mb-4
                  rounded-lg
                  bg-cyan-500/10
                  px-3
                  py-2
                "
              >
                <div className="text-sm font-medium text-cyan-400">
                  Amazon Sample
                </div>

                <div className="mt-1 text-xs text-gray-500">
                  Amazon_sample.csv
                </div>
              </div>

              <div className="space-y-1 text-sm">
                {[
                  "OrderID",
                  "OrderDate",
                  "CustomerID",
                  "CustomerName",
                  "ProductID",
                  "ProductName",
                  "Category",
                  "Brand",
                  "Quantity",
                  "Rating",
                  "Price",
                  "State",
                  "Country",
                  "SellerID",
                ].map((column) => (
                  <div
                    key={column}
                    className="
                      rounded-md
                      px-3
                      py-2
                      text-gray-300
                      transition
                      hover:bg-white/5
                      hover:text-white
                    "
                  >
                    {column}
                  </div>
                ))}

                <div className="px-3 py-2 text-xs text-gray-600">
                  + more columns
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ==================================================
            PYTHON COMPILER
            ================================================== */}

        <section
          className="
            min-w-0
            max-w-full

            overflow-hidden

            border-b
            border-white/10

            xl:border-b-0
            xl:border-r
          "
        >
          <div
            className="
              w-full
              min-w-0
              max-w-full
            "
          >
            <ChallengeCell
              code={code}
              onCodeChange={
                handleCodeChange
              }
              onSubmit={
                handleSubmit
              }
            />
          </div>
        </section>

        {/* ==================================================
            CHALLENGE PANEL
            ================================================== */}

        <aside
          className="
            min-w-0
            max-w-full
          "
        >
          <div
            className="
              flex
              min-w-0
              flex-col
            "
          >
            {/* Challenge Header */}

            <div
              className="
                shrink-0

                border-b
                border-white/10

                p-4
                sm:p-5
              "
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className="
                    rounded-full
                    bg-green-500/10
                    px-3
                    py-1
                    text-xs
                    font-medium
                    text-green-400
                  "
                >
                  {challenge.difficulty}
                </span>

                <div
                  className="
                    flex
                    shrink-0
                    items-center
                    gap-1.5
                    text-sm
                    text-yellow-400
                  "
                >
                  <Trophy size={15} />

                  {challenge.xp} XP
                </div>
              </div>

              <h2
                className="
                  mt-4
                  text-xl
                  font-semibold
                  text-white
                "
              >
                {challenge.title}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Challenge{" "}
                {currentIndex + 1} /{" "}
                {pythonChallenges.length}
              </p>
            </div>

            {/* Challenge Body */}

            <div
              className="
                min-w-0
                overflow-y-auto

                p-4
                sm:p-5

                max-h-[500px]

                xl:max-h-none
              "
            >
              {/* Description */}

              <section>
                <h3 className="font-semibold text-white">
                  Description
                </h3>

                <p
                  className="
                    mt-3
                    text-sm
                    leading-7
                    text-gray-400
                  "
                >
                  {challenge.description}
                </p>
              </section>

              {/* Hint */}

              <section className="mt-8">
                <div className="flex items-center gap-2">
                  <Lightbulb
                    size={17}
                    className="shrink-0 text-yellow-400"
                  />

                  <h3 className="font-semibold text-white">
                    Hint
                  </h3>
                </div>

                <p
                  className="
                    mt-3
                    text-sm
                    leading-6
                    text-gray-400
                  "
                >
                  {challenge.hint}
                </p>
              </section>

              {/* Dataset */}

              <section className="mt-8">
                <h3 className="font-semibold text-white">
                  Dataset
                </h3>

                <div
                  className="
                    mt-3
                    max-w-full
                    overflow-x-auto
                    rounded-lg
                    bg-white/5
                    px-3
                    py-2
                    font-mono
                    text-xs
                    text-gray-400
                  "
                >
                  {challenge.dataset}
                </div>
              </section>

              {/* Feedback */}

              {feedback && (
                <section className="mt-8">
                  <div
                    className={`
                      flex
                      items-start
                      gap-3

                      rounded-lg
                      border
                      p-4

                      ${
                        feedback.correct
                          ? "border-green-500/20 bg-green-500/10"
                          : "border-red-500/20 bg-red-500/10"
                      }
                    `}
                  >
                    {feedback.correct ? (
                      <CheckCircle2
                        size={18}
                        className="
                          mt-0.5
                          shrink-0
                          text-green-400
                        "
                      />
                    ) : (
                      <XCircle
                        size={18}
                        className="
                          mt-0.5
                          shrink-0
                          text-red-400
                        "
                      />
                    )}

                    <div className="min-w-0">
                      <div
                        className={`
                          text-sm
                          font-medium

                          ${
                            feedback.correct
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        `}
                      >
                        {feedback.correct
                          ? "Correct!"
                          : "Not quite"}
                      </div>

                      <p
                        className="
                          mt-1
                          text-sm
                          leading-6
                          text-gray-400
                        "
                      >
                        {feedback.message}
                      </p>
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* ==================================================
                STATUS
                ================================================== */}

            <div
              className="
                shrink-0
                border-t
                border-white/10
                p-4
              "
            >
              {checking ? (
                <div
                  className="
                    rounded-md
                    border
                    border-white/10
                    px-4
                    py-3
                    text-center
                    text-sm
                    text-gray-400
                  "
                >
                  Checking your answer...
                </div>
              ) : feedback?.correct ? (
                <div
                  className="
                    rounded-md
                    bg-green-500/10
                    px-4
                    py-3
                    text-center
                    text-sm
                    text-green-400
                  "
                >
                  Challenge completed ✓
                </div>
              ) : (
                <div
                  className="
                    rounded-md
                    border
                    border-white/10
                    px-4
                    py-3
                    text-center
                    text-xs
                    text-gray-500
                  "
                >
                  Run your code, then check your answer.
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}