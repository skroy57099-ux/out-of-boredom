// components/BorePlay/ResumeAnalyzer/matching/types.ts

// ============================================================
// JD SKILL
// ============================================================

export interface JDCoreSkill {

  /**
   * Main/core skill requested by the JD.
   *
   * Example:
   *
   * Excel
   */

  skill: string;


  /**
   * Capabilities belonging to the core skill.
   *
   * Example:
   *
   * Excel
   * ├── Pivot Tables
   * ├── XLOOKUP
   * └── INDEX/MATCH
   */

  subSkills: string[];


  /**
   * Technologies or capabilities that can reasonably
   * serve as evidence for the core skill.
   *
   * Example:
   *
   * JD:
   * SQL
   *
   * acceptableEvidence:
   * PostgreSQL
   * BigQuery
   * Databricks SQL
   *
   * IMPORTANT:
   * This relationship is directional.
   *
   * PostgreSQL → SQL
   *
   * does NOT mean:
   *
   * SQL → PostgreSQL
   */

  acceptableEvidence: string[];


  /**
   * Confidence assigned by the JD parser.
   */

  confidence: number;


  /**
   * Original evidence from the JD.
   */

  evidence: string;
}

// ============================================================
// RESUME EVIDENCE
// ============================================================

export type ResumeEvidenceSource =
  | "skills"
  | "summary"
  | "experience"
  | "projects"
  | "certifications"
  | "education"
  | "publications"
  | "additionalSections";


export type ResumeEvidenceType =
  | "direct"
  | "related"
  | "contextual";


export interface ResumeSkillEvidence {

  /**
   * The actual text found in the resume.
   *
   * Example:
   *
   * "PostgreSQL"
   * "Databricks SQL"
   * "SQL queries"
   */

  value: string;


  /**
   * Where the evidence was found.
   */

  source: ResumeEvidenceSource;


  /**
   * How strongly the evidence represents
   * the requested skill.
   *
   * direct:
   *   Exact/core skill evidence.
   *
   * related:
   *   Closely related technology or capability.
   *
   * contextual:
   *   Evidence found inside experience/project text.
   */

  type: ResumeEvidenceType;
}


// ============================================================
// SUB-SKILL MATCH
// ============================================================

export interface SubSkillMatch {

  /**
   * JD capability.
   *
   * Example:
   *
   * "XLOOKUP"
   */

  skill: string;


  /**
   * Whether the resume contains evidence
   * for this capability.
   */

  matched: boolean;


  /**
   * Evidence supporting this capability.
   */

  evidence: ResumeSkillEvidence[];
}


// ============================================================
// CORE SKILL MATCH RESULT
// ============================================================

export interface SkillMatchResult {

  /**
   * JD core skill.
   *
   * Example:
   *
   * "Excel"
   */

  skill: string;


  /**
   * Overall core-skill state.
   *
   * matched:
   *   Core skill is directly supported.
   *
   * partial:
   *   Related evidence exists, but direct/core
   *   evidence is weaker or incomplete.
   *
   * missing:
   *   No meaningful evidence found.
   */

  status:
    | "matched"
    | "partial"
    | "missing";


  /**
   * Whether the actual core skill was found.
   *
   * Example:
   *
   * JD: Excel
   * Resume: Excel
   *
   * coreMatched = true
   */

  coreMatched: boolean;


  /**
   * Direct evidence for the core skill.
   */

  coreEvidence: ResumeSkillEvidence[];


  /**
   * Related evidence supporting the core skill.
   *
   * Example:
   *
   * JD: SQL
   *
   * Resume:
   * PostgreSQL
   * BigQuery
   * Databricks SQL
   */

  relatedEvidence: ResumeSkillEvidence[];


  /**
   * Capability-level matching.
   */

  subSkillMatches: SubSkillMatch[];


  /**
   * Convenience list of matched sub-skills.
   */

  matchedSubSkills: string[];


  /**
   * Convenience list of missing sub-skills.
   */

  missingSubSkills: string[];


  /**
   * All meaningful resume evidence.
   *
   * This replaces the old simplistic
   * resumeEvidence: string[] concept while
   * preserving the actual evidence metadata.
   */

  resumeEvidence: ResumeSkillEvidence[];


  /**
   * Original JD evidence.
   */

  jdEvidence: string;


  /**
   * Confidence from the JD parser.
   */

  confidence: number;
}


// ============================================================
// SKILL CATEGORY MATCH
// ============================================================

export interface SkillCategoryMatch {

  /**
   * Core skills that are directly supported.
   */

  matched: SkillMatchResult[];


  /**
   * Skills where some meaningful evidence exists,
   * but the match is incomplete or indirect.
   */

  partial: SkillMatchResult[];


  /**
   * Skills for which no meaningful evidence exists.
   */

  missing: SkillMatchResult[];
}


// ============================================================
// RESUME SOURCE
// ============================================================

export interface ResumeSkillSource {

  /**
   * Explicit skills extracted from the resume.
   */

  skills: string[];


  /**
   * Optional resume summary.
   */

  summary?: string | null;


  /**
   * Parsed experience objects.
   *
   * Kept flexible because the existing resume
   * parser schema may evolve independently.
   */

  experience?: unknown[];


  /**
   * Parsed projects.
   */

  projects?: unknown[];


  /**
   * Parsed certifications.
   */

  certifications?: unknown[];


  /**
   * Parsed education.
   */

  education?: unknown[];


  /**
   * Parsed publications.
   */

  publications?: unknown[];


  /**
   * Any additional parsed resume sections.
   */

  additionalSections?: unknown[];
}


// ============================================================
// FINAL RESUME ↔ JD MATCH RESULT
// ============================================================

export interface ResumeJDMatchResult {

  /**
   * Required JD skills.
   *
   * These will later receive greater weight
   * when calculating the overall job-match score.
   */

  required: SkillCategoryMatch;


  /**
   * Preferred / optional JD skills.
   */

  preferred: SkillCategoryMatch;
}