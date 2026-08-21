// components/BorePlay/ResumeAnalyzer/matching/skill-matcher.ts

import {
  JDCoreSkill,
  ResumeSkillSource,
  ResumeSkillEvidence,
  ResumeEvidenceSource,
  SkillCategoryMatch,
  SkillMatchResult,
  ResumeJDMatchResult,
  SubSkillMatch,
} from "./types";

import {
  getSkillMatchType,
  getCapabilityMatchType,
  normalizeForMatching,
} from "./normalize";


// ============================================================
// RESUME TEXT EXTRACTION
// ============================================================

function extractSearchableText(
  value: unknown,
): string[] {

  if (
    value === null ||
    value === undefined
  ) {
    return [];
  }


  if (
    typeof value === "string"
  ) {

    const text =
      value.trim();

    return text
      ? [text]
      : [];
  }


  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {

    return [
      String(value),
    ];
  }


  if (
    Array.isArray(value)
  ) {

    return value.flatMap(
      (
        item,
      ) =>
        extractSearchableText(
          item,
        ),
    );
  }


  if (
    typeof value === "object"
  ) {

    return Object.values(
      value as Record<
        string,
        unknown
      >,
    ).flatMap(
      (
        item,
      ) =>
        extractSearchableText(
          item,
        ),
    );
  }


  return [];
}


// ============================================================
// RESUME EVIDENCE SOURCE
// ============================================================

function extractSectionEvidence(
  value: unknown,
  source: ResumeEvidenceSource,
): ResumeSkillEvidence[] {

  const texts =
    extractSearchableText(
      value,
    );

  return texts.map(
    (
      text,
    ) => ({

      value:
        text,

      source,

      type:
        "contextual",

    }),
  );
}


// ============================================================
// BUILD RESUME EVIDENCE POOL
// ============================================================
//
// IMPORTANT:
//
// Matching searches the complete structured resume,
// not only resume.skills.
//
// This allows evidence such as:
//
// "Developed Power BI dashboards..."
// "Performed statistical analysis..."
// "Designed star-schema data models..."
//
// to participate in matching.
// ============================================================

function buildResumeEvidencePool(
  resume: ResumeSkillSource,
): ResumeSkillEvidence[] {

  const evidence:
    ResumeSkillEvidence[] = [];


  // ==========================================================
  // EXPLICIT SKILLS
  // ==========================================================

  for (
    const skill of
    resume.skills ?? []
  ) {

    if (
      typeof skill !==
      "string"
    ) {
      continue;
    }

    const cleaned =
      skill.trim();

    if (!cleaned) {
      continue;
    }

    evidence.push({

      value:
        cleaned,

      source:
        "skills",

      type:
        "direct",

    });
  }


  // ==========================================================
  // SUMMARY
  // ==========================================================

  evidence.push(
    ...extractSectionEvidence(
      resume.summary,
      "summary",
    ),
  );


  // ==========================================================
  // EXPERIENCE
  // ==========================================================

  evidence.push(
    ...extractSectionEvidence(
      resume.experience,
      "experience",
    ),
  );


  // ==========================================================
  // PROJECTS
  // ==========================================================

  evidence.push(
    ...extractSectionEvidence(
      resume.projects,
      "projects",
    ),
  );


  // ==========================================================
  // CERTIFICATIONS
  // ==========================================================

  evidence.push(
    ...extractSectionEvidence(
      resume.certifications,
      "certifications",
    ),
  );


  // ==========================================================
  // EDUCATION
  // ==========================================================

  evidence.push(
    ...extractSectionEvidence(
      resume.education,
      "education",
    ),
  );


  // ==========================================================
  // PUBLICATIONS
  // ==========================================================

  evidence.push(
    ...extractSectionEvidence(
      resume.publications,
      "publications",
    ),
  );


  // ==========================================================
  // ADDITIONAL SECTIONS
  // ==========================================================

  evidence.push(
    ...extractSectionEvidence(
      resume.additionalSections,
      "additionalSections",
    ),
  );


  return evidence;
}


// ============================================================
// DEDUPLICATE EVIDENCE
// ============================================================

function deduplicateEvidence(
  evidence: ResumeSkillEvidence[],
): ResumeSkillEvidence[] {

  const seen =
    new Set<string>();

  return evidence.filter(
    (
      item,
    ) => {

      const key =
        [
          normalizeForMatching(
            item.value,
          ),

          item.source,

          item.type,

        ].join(
          "::",
        );

      if (
        seen.has(
          key,
        )
      ) {
        return false;
      }

      seen.add(
        key,
      );

      return true;
    },
  );
}


// ============================================================
// FIND CORE SKILL EVIDENCE
// ============================================================

function findCoreSkillEvidence(
  evidencePool: ResumeSkillEvidence[],
  jdSkill: JDCoreSkill,
): {
  direct: ResumeSkillEvidence[];
  related: ResumeSkillEvidence[];
} {

  const direct:
    ResumeSkillEvidence[] = [];

  const related:
    ResumeSkillEvidence[] = [];


  for (
    const evidence of
    evidencePool
  ) {

    // --------------------------------------------------------
    // PRIMARY MATCHER
    // --------------------------------------------------------

    const matchType =
      getSkillMatchType(
        evidence.value,
        jdSkill.skill,
      );


    // --------------------------------------------------------
    // DIRECT CORE SKILL
    // --------------------------------------------------------

    if (
      matchType ===
      "direct"
    ) {

      direct.push({

        ...evidence,

        type:
          evidence.source ===
          "skills"
            ? "direct"
            : "contextual",

      });

      continue;
    }


    // --------------------------------------------------------
    // RELATED CORE SKILL
    // --------------------------------------------------------

    if (
      matchType ===
      "related"
    ) {

      related.push({

        ...evidence,

        type:
          "related",

      });

      continue;
    }


    // --------------------------------------------------------
    // ACCEPTABLE EVIDENCE FROM JD
    // --------------------------------------------------------
    //
    // Example:
    //
    // JD:
    // SQL
    //
    // acceptableEvidence:
    // PostgreSQL
    // BigQuery
    // Databricks SQL
    //
    // This remains a separate semantic bridge supplied
    // by the JD parser.
    // --------------------------------------------------------

    const acceptableEvidence =
      Array.isArray(
        jdSkill.acceptableEvidence,
      )
        ? jdSkill.acceptableEvidence
        : [];


    const acceptableMatch =
      acceptableEvidence.some(
        (
          acceptable,
        ) => {

          if (
            typeof acceptable !==
            "string"
          ) {
            return false;
          }

          const normalizedResume =
            normalizeForMatching(
              evidence.value,
            );

          const normalizedAcceptable =
            normalizeForMatching(
              acceptable,
            );

          if (
            !normalizedResume ||
            !normalizedAcceptable
          ) {
            return false;
          }

          return (
            normalizedResume ===
            normalizedAcceptable
          );
        },
      );


    if (
      acceptableMatch
    ) {

      related.push({

        ...evidence,

        type:
          "related",

      });
    }
  }


  return {

    direct:
      deduplicateEvidence(
        direct,
      ),

    related:
      deduplicateEvidence(
        related,
      ),
  };
}


// ============================================================
// FIND SUB-SKILL / CAPABILITY EVIDENCE
// ============================================================
//
// Capability matching is deliberately separate from
// directional technology matching.
//
// Examples:
//
// CTEs
//   ↓
// Data Querying
//
// Statistical Analysis
//   ↓
// Data Analysis
//
// KPI Reporting
//   ↓
// Reporting Frameworks
//
// ============================================================

function findSubSkillEvidence(
  evidencePool: ResumeSkillEvidence[],
  subSkill: string,
): ResumeSkillEvidence[] {

  const matches:
    ResumeSkillEvidence[] = [];


  for (
    const evidence of
    evidencePool
  ) {

    const matchType =
      getCapabilityMatchType(
        evidence.value,
        subSkill,
      );


    // ========================================================
    // DIRECT CAPABILITY
    // ========================================================

    if (
      matchType ===
      "direct"
    ) {

      matches.push({

        ...evidence,

        type:
          evidence.source ===
          "skills"
            ? "direct"
            : "contextual",

      });

      continue;
    }


    // ========================================================
    // RELATED CAPABILITY
    // ========================================================

    if (
      matchType ===
      "related"
    ) {

      matches.push({

        ...evidence,

        type:
          "related",

      });
    }
  }


  return deduplicateEvidence(
    matches,
  );
}


// ============================================================
// MATCH ONE CORE SKILL
// ============================================================

function matchCoreSkill(
  jdSkill: JDCoreSkill,
  evidencePool: ResumeSkillEvidence[],
): SkillMatchResult {

  const coreEvidence =
    findCoreSkillEvidence(
      evidencePool,
      jdSkill,
    );


  // ==========================================================
  // CORE MATCH
  // ==========================================================

  const coreMatched =
    coreEvidence.direct.length >
    0;


  // ==========================================================
  // SUB-SKILLS
  // ==========================================================

  const subSkillMatches:
    SubSkillMatch[] = [];

  const matchedSubSkills:
    string[] = [];

  const missingSubSkills:
    string[] = [];


  for (
    const subSkill of
    jdSkill.subSkills ?? []
  ) {

    const evidence =
      findSubSkillEvidence(
        evidencePool,
        subSkill,
      );


    const matched =
      evidence.length >
      0;


    subSkillMatches.push({

      skill:
        subSkill,

      matched,

      evidence,

    });


    if (
      matched
    ) {

      matchedSubSkills.push(
        subSkill,
      );

    } else {

      missingSubSkills.push(
        subSkill,
      );
    }
  }


  // ==========================================================
  // DETERMINE STATUS
  // ==========================================================

  let status:
    | "matched"
    | "partial"
    | "missing";


  // ----------------------------------------------------------
  // DIRECT CORE MATCH
  // ----------------------------------------------------------

  if (
    coreMatched
  ) {

    status =
      "matched";

  }


  // ----------------------------------------------------------
  // RELATED CORE OR CAPABILITY EVIDENCE
  // ----------------------------------------------------------

  else if (
    coreEvidence.related.length >
      0 ||
    matchedSubSkills.length >
      0
  ) {

    status =
      "partial";

  }


  // ----------------------------------------------------------
  // NOTHING FOUND
  // ----------------------------------------------------------

  else {

    status =
      "missing";
  }


  // ==========================================================
  // ALL RESUME EVIDENCE
  // ==========================================================

  const resumeEvidence =
    deduplicateEvidence([

      ...coreEvidence.direct,

      ...coreEvidence.related,

      ...subSkillMatches.flatMap(
        (
          item,
        ) =>
          item.evidence,
      ),

    ]);


  // ==========================================================
  // RESULT
  // ==========================================================

  return {

    skill:
      jdSkill.skill,

    status,

    coreMatched,

    coreEvidence:
      coreEvidence.direct,

    relatedEvidence:
      coreEvidence.related,

    subSkillMatches,

    matchedSubSkills,

    missingSubSkills,

    resumeEvidence,

    jdEvidence:
      jdSkill.evidence,

    confidence:
      jdSkill.confidence,
  };
}


// ============================================================
// MATCH SKILL CATEGORY
// ============================================================

export function matchSkillCategory(
  jdSkills: JDCoreSkill[],
  resume: ResumeSkillSource,
): SkillCategoryMatch {

  const evidencePool =
    buildResumeEvidencePool(
      resume,
    );


  const results =
    (
      Array.isArray(
        jdSkills,
      )
        ? jdSkills
        : []
    ).map(
      (
        jdSkill,
      ) =>
        matchCoreSkill(
          jdSkill,
          evidencePool,
        ),
    );


  return {

    matched:
      results.filter(
        (
          result,
        ) =>
          result.status ===
          "matched",
      ),

    partial:
      results.filter(
        (
          result,
        ) =>
          result.status ===
          "partial",
      ),

    missing:
      results.filter(
        (
          result,
        ) =>
          result.status ===
          "missing",
      ),
  };
}


// ============================================================
// MAIN MATCHER
// ============================================================

export function matchResumeToJD(
  resume: ResumeSkillSource,
  requiredSkills: JDCoreSkill[],
  preferredSkills: JDCoreSkill[],
): ResumeJDMatchResult {

  const safeResume:
    ResumeSkillSource = {

    skills:
      Array.isArray(
        resume?.skills,
      )
        ? resume.skills
        : [],

    summary:
      typeof resume?.summary ===
      "string"
        ? resume.summary
        : null,

    experience:
      Array.isArray(
        resume?.experience,
      )
        ? resume.experience
        : [],

    projects:
      Array.isArray(
        resume?.projects,
      )
        ? resume.projects
        : [],

    certifications:
      Array.isArray(
        resume?.certifications,
      )
        ? resume.certifications
        : [],

    education:
      Array.isArray(
        resume?.education,
      )
        ? resume.education
        : [],

    publications:
      Array.isArray(
        resume?.publications,
      )
        ? resume.publications
        : [],

    additionalSections:
      Array.isArray(
        resume?.additionalSections,
      )
        ? resume.additionalSections
        : [],
  };


  const safeRequiredSkills =
    Array.isArray(
      requiredSkills,
    )
      ? requiredSkills
      : [];


  const safePreferredSkills =
    Array.isArray(
      preferredSkills,
    )
      ? preferredSkills
      : [];


  return {

    required:
      matchSkillCategory(
        safeRequiredSkills,
        safeResume,
      ),

    preferred:
      matchSkillCategory(
        safePreferredSkills,
        safeResume,
      ),
  };
}