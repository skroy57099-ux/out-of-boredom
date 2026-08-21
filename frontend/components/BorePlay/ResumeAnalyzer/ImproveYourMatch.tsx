"use client";

import {
  useState,
} from "react";

import {
  matchResumeToJD,
} from "./matching/skill-matcher";


// ============================================================
// TYPES
// ============================================================

type MatchResult =
  ReturnType<
    typeof matchResumeToJD
  >;

type MatchItem =
  MatchResult["required"]["missing"][number];

type SkillStatus =
  | "missing"
  | "partial";


// ============================================================
// LEARNING ESTIMATE
// ============================================================
//
// These are deliberately broad estimates.
// They are guidance, not promises.
//
// We do NOT pretend that someone can become
// job-ready in exactly 13 hours and 42 minutes.
// Humans remain annoyingly variable.
// ============================================================

function getLearningEstimate(
  skill: string,
): {
  basics: string;
  practical: string;
} {

  const normalized =
    skill.toLowerCase();


  const advancedKeywords = [
    "machine learning",
    "deep learning",
    "data engineering",
    "cloud",
    "aws",
    "azure",
    "gcp",
    "kubernetes",
    "devops",
    "cybersecurity",
    "power bi",
    "tableau",
    "spark",
    "databricks",
  ];


  const simpleKeywords = [
    "excel",
    "pivot",
    "git",
    "sql",
    "reporting",
    "communication",
    "documentation",
  ];


  if (
    advancedKeywords.some(
      (keyword) =>
        normalized.includes(
          keyword,
        ),
    )
  ) {

    return {
      basics: "1–2 weeks",
      practical: "2–4 weeks",
    };
  }


  if (
    simpleKeywords.some(
      (keyword) =>
        normalized.includes(
          keyword,
        ),
    )
  ) {

    return {
      basics: "3–7 days",
      practical: "1–2 weeks",
    };
  }


  return {
    basics: "1–2 weeks",
    practical: "2–3 weeks",
  };
}


// ============================================================
// RESUME EVIDENCE NORMALIZER
// ============================================================

function getEvidenceText(
  item: MatchItem,
): string[] {

  const evidence =
    item.resumeEvidence;

  if (!Array.isArray(evidence)) {
    return [];
  }

  const skill =
    item.skill
      .toLowerCase()
      .trim();

  const missingSubSkills =
    Array.isArray(
      item.missingSubSkills,
    )
      ? item.missingSubSkills
      : [];

  const explicitTerms = [
    skill,
    ...missingSubSkills.map(
      (value) =>
        value
          .toLowerCase()
          .trim(),
    ),
  ].filter(Boolean);


  return Array.from(
    new Set(
      evidence
        .map(
          (evidenceItem) =>
            evidenceItem.value,
        )
        .filter(
          (
            value,
          ): value is string =>
            typeof value ===
            "string",
        )
        .filter(
          (value) => {

            const normalized =
              value.toLowerCase();

            return explicitTerms.some(
              (term) =>
                normalized.includes(
                  term,
                ),
            );
          },
        )
        .map(
          (value) =>
            value.trim(),
        )
        .filter(Boolean),
    ),
  );
}


// ============================================================
// RECOMMENDATION TYPE
// ============================================================
    function getGapType(
    item: MatchItem,
    status: SkillStatus,
    ): "skill-gap" | "evidence-gap" {

    const evidence =
        getEvidenceText(
        item,
        );


    // ----------------------------------------------------------
    // DIRECTLY RELEVANT EVIDENCE EXISTS
    // ----------------------------------------------------------

    if (
        evidence.length > 0
    ) {

        return "evidence-gap";
    }


    // ----------------------------------------------------------
    // NO DIRECT EVIDENCE
    //
    // Even if the matcher marked this "partial", don't tell
    // the user that Automated Reporting proves VBA, etc.
    // ----------------------------------------------------------

    return "skill-gap";
    }

// ============================================================
// COPY HELPER
// ============================================================

async function copyText(
  text: string,
): Promise<boolean> {

  try {

    if (
      navigator.clipboard
    ) {

      await navigator.clipboard.writeText(
        text,
      );

      return true;
    }


    return false;

  } catch {

    return false;
  }
}


// ============================================================
// SKILL CARD
// ============================================================

function ImprovementCard({
  item,
  status,
  priority,
}: {
  item: MatchItem;
  status: SkillStatus;
  priority: "Required" | "Preferred";
}) {

  const [
    copied,
    setCopied,
  ] = useState(false);


  const [
    showKnowThis,
    setShowKnowThis,
  ] = useState(false);


  const evidence =
    getEvidenceText(
      item,
    );


  const gapType =
    getGapType(
      item,
      status,
    );


  const learning =
    getLearningEstimate(
      item.skill,
    );


  const missingSubSkills =
    Array.isArray(
      item.missingSubSkills,
    )
      ? item.missingSubSkills
      : [];


  // ----------------------------------------------------------
  // COPY SKILL
  // ----------------------------------------------------------

  async function handleCopySkill() {

    const success =
      await copyText(
        item.skill,
      );


    if (
      success
    ) {

      setCopied(
        true,
      );


      window.setTimeout(
        () =>
          setCopied(
            false,
          ),
        1600,
      );
    }
  }


  // ----------------------------------------------------------
  // COPY SUGGESTED TEMPLATE
  // ----------------------------------------------------------

  async function handleCopyTemplate() {

    const focus =
      missingSubSkills.length >
      0
        ? missingSubSkills.join(
            ", ",
          )
        : item.skill;


    const template =
      `${item.skill}: Used ${focus} to [describe what you did] and [describe the outcome].`;


    const success =
      await copyText(
        template,
      );


    if (
      success
    ) {

      setCopied(
        true,
      );


      window.setTimeout(
        () =>
          setCopied(
            false,
          ),
        1600,
      );
    }
  }


  return (

    <article className="rounded-xl border border-white/10 bg-white/[0.02] p-4">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

        <div>

          <div className="flex flex-wrap items-center gap-2">

            <h4 className="text-sm font-medium text-white">
              {item.skill}
            </h4>


            <span
              className={
                priority ===
                "Required"
                  ? "rounded-md border border-red-400/20 bg-red-400/5 px-2 py-0.5 text-[10px] text-red-300"
                  : "rounded-md border border-amber-400/20 bg-amber-400/5 px-2 py-0.5 text-[10px] text-amber-300"
              }
            >
              {priority}
            </span>


            <span
              className={
                status ===
                "partial"
                  ? "rounded-md border border-amber-400/20 bg-amber-400/5 px-2 py-0.5 text-[10px] text-amber-300"
                  : "rounded-md border border-red-400/20 bg-red-400/5 px-2 py-0.5 text-[10px] text-red-300"
              }
            >
              {status ===
              "partial"
                ? "Needs stronger evidence"
                : "Missing"}
            </span>

          </div>

        </div>


        <button
          type="button"
          onClick={
            handleCopySkill
          }
          className="shrink-0 rounded-lg border border-white/10 px-3 py-1.5 text-[11px] text-white/70 transition hover:border-cyan-400/30 hover:text-cyan-300"
        >
          {copied
            ? "✓ Copied"
            : "Copy skill"}
        </button>

      </div>


      {/* ====================================================== */}
      {/* GAP TYPE */}
      {/* ====================================================== */}

      <div className="mt-4 rounded-lg border border-white/5 bg-black/20 p-3">

        <p className="text-[11px] font-medium uppercase tracking-wide text-white/40">
          {gapType ===
          "evidence-gap"
            ? "Evidence gap"
            : "Potential skill gap"}
        </p>


        <p className="mt-1 text-xs leading-5 text-white/60">

          {gapType ===
          "evidence-gap"
            ? "Your resume contains related evidence, but the job requirement is not demonstrated explicitly enough."
            : "No direct resume evidence was found. This may mean you need to build the skill, or simply that your resume does not mention experience you already have."}

        </p>

      </div>


      {/* ====================================================== */}
      {/* RESUME EVIDENCE */}
      {/* ====================================================== */}

      <div className="mt-4">

        <p className="text-[11px] font-medium uppercase tracking-wide text-white/40">
          Resume evidence
        </p>


        {evidence.length >
        0 ? (

          <div className="mt-2 space-y-1">

            {evidence
              .slice(
                0,
                4,
              )
              .map(
                (
                  value,
                  index,
                ) => (

                  <p
                    key={`${value}-${index}`}
                    className="text-xs leading-5 text-white/55"
                  >
                    • {value}
                  </p>

                ),
              )}

          </div>

        ) : (

          <p className="mt-2 text-xs text-white/35">
            No relevant resume evidence found.
          </p>

        )}

      </div>


      {/* ====================================================== */}
      {/* MISSING SUB-SKILLS */}
      {/* ====================================================== */}

      {missingSubSkills.length >
        0 && (

        <div className="mt-4">

          <p className="text-[11px] font-medium uppercase tracking-wide text-white/40">
            Specific gaps
          </p>


          <div className="mt-2 flex flex-wrap gap-2">

            {missingSubSkills.map(
              (
                subSkill,
                index,
              ) => (

                <span
                  key={`${subSkill}-${index}`}
                  className="rounded-md border border-red-400/20 bg-red-400/5 px-2 py-1 text-[11px] text-red-300"
                >
                  {subSkill}
                </span>

              ),
            )}

          </div>

        </div>

      )}


      {/* ====================================================== */}
      {/* RECOMMENDED ACTION */}
      {/* ====================================================== */}

      <div className="mt-4">

        <p className="text-[11px] font-medium uppercase tracking-wide text-white/40">
          Recommended action
        </p>


        <p className="mt-1 text-xs leading-5 text-white/65">

          {status ===
          "partial"
            ? missingSubSkills.length >
              0
              ? `Make your experience with ${missingSubSkills.join(", ")} explicit in the relevant resume bullet or project.`
              : `Add direct evidence showing how you used ${item.skill}.`
            : gapType ===
                "skill-gap"
              ? `If you do not already have ${item.skill}, learn the fundamentals and build a small practical example before claiming it on your resume.`
              : `If you already have ${item.skill}, add a concrete example showing where and how you used it.`}

        </p>

      </div>


      {/* ====================================================== */}
      {/* LEARNING ESTIMATE */}
      {/* ====================================================== */}

      {gapType ===
        "skill-gap" && (

        <div className="mt-4 rounded-lg border border-cyan-400/10 bg-cyan-400/[0.03] p-3">

          <p className="text-[11px] font-medium uppercase tracking-wide text-cyan-300/70">
            Approximate learning path
          </p>


          <div className="mt-2 grid gap-2 sm:grid-cols-2">

            <div>

              <p className="text-[10px] text-white/30">
                Fundamentals
              </p>

              <p className="mt-0.5 text-xs text-white/65">
                {learning.basics}
              </p>

            </div>


            <div>

              <p className="text-[10px] text-white/30">
                Practical project
              </p>

              <p className="mt-0.5 text-xs text-white/65">
                {learning.practical}
              </p>

            </div>

          </div>


          <p className="mt-2 text-[10px] leading-4 text-white/25">
            Rough guidance only. Your timeline will vary with prior experience and learning pace.
          </p>

        </div>

      )}


      {/* ====================================================== */}
      {/* I ALREADY KNOW THIS */}
      {/* ====================================================== */}

      <button
        type="button"
        onClick={() =>
          setShowKnowThis(
            (
              current,
            ) => !current,
          )
        }
        className="mt-4 text-[11px] text-cyan-300/70 transition hover:text-cyan-300"
      >
        {showKnowThis
          ? "Hide resume wording help"
          : "👉 Click here if you already know this skill"}
      </button>


      {showKnowThis && (

        <div className="mt-3 rounded-lg border border-cyan-400/10 bg-cyan-400/[0.03] p-3">

          <p className="text-xs leading-5 text-white/60">
            If you already have this skill, the issue may be how the experience is written. Add a concrete example rather than only listing the skill name.
          </p>


          <div className="mt-3 rounded-md border border-white/10 bg-black/20 p-3">

            <p className="text-[10px] uppercase tracking-wide text-white/30">
              Fill-in resume template
            </p>


            <p className="mt-2 text-xs leading-5 text-white/65">
              {item.skill}: Used{" "}
              {missingSubSkills.length >
              0
                ? missingSubSkills.join(
                    ", ",
                  )
                : item.skill}{" "}
              to [describe what you did] and [describe the outcome].
            </p>

          </div>


          <button
            type="button"
            onClick={
              handleCopyTemplate
            }
            className="mt-3 rounded-lg border border-white/10 px-3 py-1.5 text-[11px] text-white/70 transition hover:border-cyan-400/30 hover:text-cyan-300"
          >
            {copied
              ? "✓ Copied"
              : "Copy template"}
          </button>

        </div>

      )}

    </article>
  );
}


// ============================================================
// IMPROVE YOUR MATCH
// ============================================================

export default function ImproveYourMatch({
  matchResult,
}: {
  matchResult: MatchResult;
}) {

  const requiredMissing =
    matchResult.required.missing;

  const requiredPartial =
    matchResult.required.partial;

  const preferredMissing =
    matchResult.preferred.missing;

  const preferredPartial =
    matchResult.preferred.partial;


  const totalGaps =
    requiredMissing.length +
    requiredPartial.length +
    preferredMissing.length +
    preferredPartial.length;


  if (
    totalGaps ===
    0
  ) {

    return (

      <section className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.03] p-5">

        <p className="text-xs font-medium uppercase tracking-wide text-emerald-400">
          Improve Your Match
        </p>


        <h3 className="mt-1 text-base font-semibold text-white">
          No immediate skill gaps found
        </h3>


        <p className="mt-2 text-xs leading-5 text-white/50">
          Your resume currently provides evidence for all skills identified by the analyzer.
        </p>

      </section>

    );
  }


  return (

    <section className="mt-6 rounded-xl border border-white/10 bg-black/20 p-5">

      {/* ==================================================== */}
      {/* HEADER */}
      {/* ==================================================== */}

      <div>

        <p className="text-xs font-medium uppercase tracking-wide text-cyan-400">
          Improve Your Match
        </p>


        <h3 className="mt-1 text-base font-semibold text-white">
          Close the gaps before you apply
        </h3>


        <p className="mt-2 max-w-2xl text-xs leading-5 text-white/45">
          Focus on required skills first. A missing skill does not always mean you lack it; sometimes the resume simply does not show the evidence clearly enough.
        </p>

      </div>


      {/* ==================================================== */}
      {/* REQUIRED GAPS */}
      {/* ==================================================== */}

      {(requiredMissing.length >
        0 ||
        requiredPartial.length >
          0) && (

        <div className="mt-5">

          <div className="flex items-center justify-between">

            <h4 className="text-sm font-medium text-white">
              Required skills
            </h4>


            <span className="text-[10px] text-red-300/70">
              Highest priority
            </span>

          </div>


          <div className="mt-3 space-y-3">

            {requiredMissing.map(
              (
                item,
              ) => (

                <ImprovementCard
                  key={`required-missing-${item.skill}`}
                  item={item}
                  status="missing"
                  priority="Required"
                />

              ),
            )}


            {requiredPartial.map(
              (
                item,
              ) => (

                <ImprovementCard
                  key={`required-partial-${item.skill}`}
                  item={item}
                  status="partial"
                  priority="Required"
                />

              ),
            )}

          </div>

        </div>

      )}


      {/* ==================================================== */}
      {/* PREFERRED GAPS */}
      {/* ==================================================== */}

      {(preferredMissing.length >
        0 ||
        preferredPartial.length >
          0) && (

        <div className="mt-6">

          <div className="flex items-center justify-between">

            <h4 className="text-sm font-medium text-white">
              Preferred skills
            </h4>


            <span className="text-[10px] text-amber-300/70">
              Lower priority
            </span>

          </div>


          <div className="mt-3 space-y-3">

            {preferredMissing.map(
              (
                item,
              ) => (

                <ImprovementCard
                  key={`preferred-missing-${item.skill}`}
                  item={item}
                  status="missing"
                  priority="Preferred"
                />

              ),
            )}


            {preferredPartial.map(
              (
                item,
              ) => (

                <ImprovementCard
                  key={`preferred-partial-${item.skill}`}
                  item={item}
                  status="partial"
                  priority="Preferred"
                />

              ),
            )}

          </div>

        </div>

      )}


      {/* ==================================================== */}
      {/* RESPONSIBLE USE NOTE */}
      {/* ==================================================== */}

      <div className="mt-6 rounded-lg border border-white/5 bg-black/20 p-3">

        <p className="text-[10px] leading-4 text-white/30">
          Only add a skill to your resume when you genuinely have the knowledge or experience to support it. The goal is stronger evidence and better alignment, not keyword stuffing.
        </p>

      </div>

    </section>

  );
}