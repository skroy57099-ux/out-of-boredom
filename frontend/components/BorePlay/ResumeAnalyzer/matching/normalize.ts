// components/BorePlay/ResumeAnalyzer/matching/normalize.ts


// ============================================================
// BASIC TEXT NORMALIZATION
// ============================================================

/**
 * Normalize text only for comparison.
 *
 * The original text is never modified.
 */
export function normalizeForMatching(
  value: string | null | undefined,
): string {

  if (!value) {
    return "";
  }

  return value
    .toLowerCase()
    .trim()
    .replace(/[–—]/g, "-")
    .replace(/[\/]/g, " ")
    .replace(/[^a-z0-9+#.\- ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


// ============================================================
// PHRASE MATCHING
// ============================================================

/**
 * Determine whether a normalized phrase exists inside
 * normalized text as a complete word/phrase.
 *
 * Examples:
 *
 * "Power BI dashboards"
 *        contains
 * "Power BI"
 *
 * "Performed statistical data analysis"
 *        contains
 * "data analysis"
 *
 * But:
 *
 * "database"
 *        does NOT contain
 * "data"
 */
function containsNormalizedPhrase(
  text: string,
  phrase: string,
): boolean {

  const normalizedText =
    normalizeForMatching(text);

  const normalizedPhrase =
    normalizeForMatching(phrase);

  if (
    !normalizedText ||
    !normalizedPhrase
  ) {
    return false;
  }

  if (
    normalizedText ===
    normalizedPhrase
  ) {
    return true;
  }

  return (
    ` ${normalizedText} `
      .includes(
        ` ${normalizedPhrase} `,
      )
  );
}


// ============================================================
// CANONICAL SKILL CONCEPTS
// ============================================================
//
// These represent broader technical skill families.
//
// IMPORTANT:
//
// Relationships are directional.
//
// PostgreSQL
//      ↓
// SQL
//
// But:
//
// SQL
//      ↓
// PostgreSQL
//
// is NOT allowed.
// ============================================================

const CANONICAL_SKILL_RELATIONSHIPS:
  Record<string, string> = {


  // ==========================================================
  // SQL FAMILY
  // ==========================================================

  "postgresql":
    "sql",

  "postgres":
    "sql",

  "mysql":
    "sql",

  "mariadb":
    "sql",

  "microsoft sql server":
    "sql",

  "sql server":
    "sql",

  "oracle sql":
    "sql",

  "oracle database":
    "sql",

  "databricks sql":
    "sql",

  "spark sql":
    "sql",

  "bigquery":
    "sql",

  "bigquery sql":
    "sql",

  "snowflake":
    "sql",

  "snowflake sql":
    "sql",


  // ==========================================================
  // PYTHON FAMILY
  // ==========================================================

  "python pandas":
    "python",

  "python numpy":
    "python",


  // ==========================================================
  // MACHINE LEARNING FAMILY
  // ==========================================================

  "scikit learn":
    "machine learning",

  "scikit-learn":
    "machine learning",

  "sklearn":
    "machine learning",


  // ==========================================================
  // DEEP LEARNING FAMILY
  // ==========================================================

  "pytorch":
    "deep learning",

  "tensorflow":
    "deep learning",

  "keras":
    "deep learning",


  // ==========================================================
  // EXCEL FAMILY
  // ==========================================================

  "microsoft excel":
    "excel",

  "ms excel":
    "excel",


  // ==========================================================
  // POWER BI FAMILY
  // ==========================================================

  "power bi desktop":
    "power bi",

  "microsoft power bi":
    "power bi",


  // ==========================================================
  // TABLEAU FAMILY
  // ==========================================================

  "tableau desktop":
    "tableau",

  "tableau server":
    "tableau",
};


// ============================================================
// CAPABILITY CONCEPTS
// ============================================================
//
// These represent capabilities that can be demonstrated by
// multiple different resume expressions.
//
// They are deliberately separate from technical technology
// families.
// ============================================================

const CAPABILITY_EVIDENCE:
  Record<string, string[]> = {


  // ==========================================================
  // DATA QUERYING
  // ==========================================================

  "data querying": [

    "sql queries",
    "sql query",
    "querying",
    "queries",
    "complex joins",
    "joins",
    "subqueries",
    "subquery",
    "ctes",
    "cte",
    "common table expressions",
    "window functions",
    "aggregations",
    "query optimization",
    "query optimisation",

  ],


  // ==========================================================
  // DATA ANALYSIS
  // ==========================================================

  "data analysis": [

    "statistical analysis",
    "exploratory data analysis",
    "eda",
    "data interpretation",
    "data profiling",
    "trend analysis",
    "pattern analysis",
    "kpi analysis",
    "business analysis",

  ],


  // ==========================================================
  // REPORTING
  // ==========================================================

  "reporting": [

    "mis reporting",
    "kpi reporting",
    "business reporting",
    "stakeholder reporting",
    "automated reporting",
    "management reporting",

  ],


  // ==========================================================
  // REPORTING FRAMEWORKS
  // ==========================================================

  "reporting frameworks": [

    "mis reporting",
    "kpi reporting",
    "business reporting",
    "stakeholder reporting",
    "automated reporting",
    "management reporting",
    "reporting framework",

  ],


  // ==========================================================
  // DATA VISUALIZATION
  // ==========================================================

  "data visualization": [

    "data visualization",
    "data visualisation",
    "dashboard",
    "dashboards",
    "visualizations",
    "visualisations",
    "charts",
    "plots",

  ],


  // ==========================================================
  // ETL / DATA TRANSFORMATION
  // ==========================================================

  "data transformation": [

    "etl",
    "data transformation",
    "data cleansing",
    "data cleaning",
    "data preparation",
    "data preprocessing",
    "data processing",

  ],


  // ==========================================================
  // AUTOMATION
  // ==========================================================

  "automation": [

    "automated reporting",
    "report automation",
    "workflow automation",
    "process automation",
    "automation",

  ],


  // ==========================================================
  // DATA MODELING
  // ==========================================================

  "data modeling": [

    "data modeling",
    "data modelling",
    "star schema",
    "star-schema",
    "fact dimension tables",
    "fact dimension",
    "dimensional modeling",
    "dimensional modelling",

  ],


  // ==========================================================
  // PROBLEM SOLVING
  // ==========================================================

  "problem solving": [

    "problem solving",
    "problem-solving",
    "troubleshooting",
    "discrepancy troubleshooting",
    "root cause analysis",

  ],


  // ==========================================================
  // STAKEHOLDER MANAGEMENT
  // ==========================================================

  "stakeholder management": [

    "stakeholder management",
    "stakeholder reporting",
    "stakeholder communication",
    "cross-functional collaboration",
    "business collaboration",

  ],
};


// ============================================================
// NORMALIZE CANONICAL LOOKUP KEY
// ============================================================

function normalizeCanonicalKey(
  value: string,
): string {

  return normalizeForMatching(
    value,
  );
}


// ============================================================
// GET CANONICAL SKILL
// ============================================================

export function getCanonicalSkill(
  value: string | null | undefined,
): string {

  const normalized =
    normalizeCanonicalKey(
      value ?? "",
    );

  if (!normalized) {
    return "";
  }

  const canonical =
    CANONICAL_SKILL_RELATIONSHIPS[
      normalized
    ];

  if (canonical) {
    return canonical;
  }

  return normalized;
}


// ============================================================
// DIRECT SKILL MATCH
// ============================================================

/**
 * Exact or phrase-level match.
 *
 * Examples:
 *
 * SQL ↔ SQL
 *
 * Power BI ↔ Power BI dashboards
 *
 * Data Analysis ↔
 * Performed statistical data analysis...
 */
export function skillsMatch(
  resumeValue: string,
  jdValue: string,
): boolean {

  const resume =
    normalizeForMatching(
      resumeValue,
    );

  const jd =
    normalizeForMatching(
      jdValue,
    );

  if (
    !resume ||
    !jd
  ) {
    return false;
  }

  return (
    resume === jd ||
    containsNormalizedPhrase(
      resumeValue,
      jdValue,
    )
  );
}


// ============================================================
// CANONICAL / RELATED SKILL MATCH
// ============================================================

/**
 * Directional technical relationship.
 *
 * PostgreSQL → SQL
 * BigQuery → SQL
 *
 * SQL → PostgreSQL
 * is NOT allowed.
 */
export function relatedSkillsMatch(
  resumeValue: string,
  jdValue: string,
): boolean {

  const resume =
    normalizeForMatching(
      resumeValue,
    );

  const jd =
    normalizeForMatching(
      jdValue,
    );

  if (
    !resume ||
    !jd
  ) {
    return false;
  }

  if (
    resume === jd
  ) {
    return false;
  }

  const resumeCanonical =
    getCanonicalSkill(
      resume,
    );

  const jdCanonical =
    getCanonicalSkill(
      jd,
    );

  if (
    !resumeCanonical ||
    !jdCanonical
  ) {
    return false;
  }

  return (
    resumeCanonical ===
    jdCanonical
  );
}


// ============================================================
// CAPABILITY NORMALIZATION
// ============================================================

function getCapabilityKey(
  value: string,
): string {

  return normalizeForMatching(
    value,
  );
}


// ============================================================
// CAPABILITY MATCH
// ============================================================

/**
 * Determine whether resume evidence demonstrates a JD
 * capability.
 *
 * Supports both:
 *
 * 1. Exact evidence
 *
 *    "Statistical Analysis"
 *
 * 2. Narrative evidence
 *
 *    "Performed statistical analysis on 300K records"
 *
 * Example:
 *
 * JD:
 *   Data Analysis
 *
 * Resume:
 *   Statistical Analysis
 *
 * → true
 *
 * JD:
 *   Reporting Frameworks
 *
 * Resume:
 *   Developed KPI reporting dashboards
 *
 * → true
 */
export function capabilityMatch(
  resumeValue: string,
  jdCapability: string,
): boolean {

  const resume =
    getCapabilityKey(
      resumeValue,
    );

  const capability =
    getCapabilityKey(
      jdCapability,
    );

  if (
    !resume ||
    !capability
  ) {
    return false;
  }


  // ----------------------------------------------------------
  // Direct capability
  // ----------------------------------------------------------

  if (
    resume ===
    capability
  ) {
    return true;
  }


  // ----------------------------------------------------------
  // Accepted evidence
  // ----------------------------------------------------------

  const acceptedEvidence =
    CAPABILITY_EVIDENCE[
      capability
    ];

  if (
    !acceptedEvidence ||
    acceptedEvidence.length ===
    0
  ) {
    return false;
  }


  // ----------------------------------------------------------
  // Exact OR phrase evidence
  // ----------------------------------------------------------

  return acceptedEvidence.some(
    (
      evidence,
    ) => {

      const normalizedEvidence =
        normalizeForMatching(
          evidence,
        );

      if (
        !normalizedEvidence
      ) {
        return false;
      }

      return (
        resume ===
        normalizedEvidence ||
        containsNormalizedPhrase(
          resumeValue,
          evidence,
        )
      );
    },
  );
}


// ============================================================
// CLASSIFY CAPABILITY MATCH
// ============================================================

export type CapabilityMatchType =
  | "direct"
  | "related"
  | null;


/**
 * Return the strongest capability relationship.
 */
export function getCapabilityMatchType(
  resumeValue: string,
  jdCapability: string,
): CapabilityMatchType {

  const resume =
    normalizeForMatching(
      resumeValue,
    );

  const capability =
    normalizeForMatching(
      jdCapability,
    );

  if (
    !resume ||
    !capability
  ) {
    return null;
  }


  // ----------------------------------------------------------
  // Exact capability
  // ----------------------------------------------------------

  if (
    resume ===
    capability
  ) {
    return "direct";
  }


  // ----------------------------------------------------------
  // Capability evidence
  // ----------------------------------------------------------

  if (
    capabilityMatch(
      resumeValue,
      jdCapability,
    )
  ) {
    return "related";
  }


  return null;
}


// ============================================================
// CLASSIFY SKILL MATCH
// ============================================================

export type SkillMatchType =
  | "direct"
  | "related"
  | null;


/**
 * Determine the strongest relationship between resume
 * evidence and a JD core requirement.
 *
 * Matching order:
 *
 * 1. Direct phrase match
 * 2. Directional technology relationship
 * 3. Capability evidence
 *
 * This allows capability-style requirements such as:
 *
 * Data Analysis
 * Reporting
 * Data Visualization
 * Problem Solving
 *
 * to work even when the JD parser places them under
 * core skills.
 */
export function getSkillMatchType(
  resumeValue: string,
  jdValue: string,
): SkillMatchType {

  // ----------------------------------------------------------
  // STEP 1: DIRECT MATCH
  // ----------------------------------------------------------

  if (
    skillsMatch(
      resumeValue,
      jdValue,
    )
  ) {
    return "direct";
  }


  // ----------------------------------------------------------
  // STEP 2: RELATED TECHNOLOGY
  // ----------------------------------------------------------

  if (
    relatedSkillsMatch(
      resumeValue,
      jdValue,
    )
  ) {
    return "related";
  }


  // ----------------------------------------------------------
  // STEP 3: CAPABILITY EVIDENCE
  // ----------------------------------------------------------

  if (
    capabilityMatch(
      resumeValue,
      jdValue,
    )
  ) {
    return "related";
  }


  return null;
}


// ============================================================
// FIND MATCHING RESUME SKILLS
// ============================================================

export function findMatchingResumeSkills(
  resumeSkills: string[],
  jdSkill: string,
): string[] {

  if (
    !Array.isArray(
      resumeSkills,
    )
  ) {
    return [];
  }

  const matches =
    resumeSkills.filter(
      (
        resumeSkill,
      ) => {

        if (
          typeof resumeSkill !==
          "string"
        ) {
          return false;
        }

        return (
          getSkillMatchType(
            resumeSkill,
            jdSkill,
          ) !== null
        );
      },
    );


  // ----------------------------------------------------------
  // Deduplicate normalized values
  // ----------------------------------------------------------

  const seen =
    new Set<string>();

  return matches.filter(
    (
      value,
    ) => {

      const normalized =
        normalizeForMatching(
          value,
        );

      if (
        seen.has(
          normalized,
        )
      ) {
        return false;
      }

      seen.add(
        normalized,
      );

      return true;
    },
  );
}


// ============================================================
// FIND MATCHING CAPABILITY EVIDENCE
// ============================================================

export function findMatchingCapabilityEvidence(
  resumeEvidence: string[],
  jdCapability: string,
): string[] {

  if (
    !Array.isArray(
      resumeEvidence,
    )
  ) {
    return [];
  }

  const matches =
    resumeEvidence.filter(
      (
        value,
      ) => {

        if (
          typeof value !==
          "string"
        ) {
          return false;
        }

        return (
          getCapabilityMatchType(
            value,
            jdCapability,
          ) !== null
        );
      },
    );


  const seen =
    new Set<string>();

  return matches.filter(
    (
      value,
    ) => {

      const normalized =
        normalizeForMatching(
          value,
        );

      if (
        seen.has(
          normalized,
        )
      ) {
        return false;
      }

      seen.add(
        normalized,
      );

      return true;
    },
  );
}


// ============================================================
// FIND BEST MATCH TYPE
// ============================================================

/**
 * Determine the strongest technical/capability match
 * represented by a list of resume evidence.
 */
export function getBestSkillMatchType(
  resumeSkills: string[],
  jdSkill: string,
): SkillMatchType {

  const matches =
    findMatchingResumeSkills(
      resumeSkills,
      jdSkill,
    );

  if (
    matches.length ===
    0
  ) {
    return null;
  }


  // ----------------------------------------------------------
  // DIRECT EVIDENCE WINS
  // ----------------------------------------------------------

  const hasDirect =
    matches.some(
      (
        resumeSkill,
      ) =>
        skillsMatch(
          resumeSkill,
          jdSkill,
        ),
    );

  if (
    hasDirect
  ) {
    return "direct";
  }


  // ----------------------------------------------------------
  // OTHERWISE RELATED
  // ----------------------------------------------------------

  return "related";
}