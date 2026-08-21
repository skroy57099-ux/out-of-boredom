// components/BorePlay/ResumeAnalyzer/jd/types.ts

// ============================================================
// JOB DESCRIPTION
// ============================================================
//
// This is the structured representation of a job description.
//
// IMPORTANT:
// This is NOT the resume schema.
//
// The JD parser will convert arbitrary pasted JD text into
// this representation.
//
// Matching logic will consume this structure later.
// ============================================================

export interface ParsedJobDescription {

  // ==========================================================
  // BASIC JOB INFORMATION
  // ==========================================================

  title: string | null;

  company: string | null;


  // ==========================================================
  // SKILLS
  // ==========================================================

  /**
   * Skills explicitly required by the employer.
   *
   * Examples:
   * Python
   * SQL
   * Power BI
   * Tableau
   */
  requiredSkills: string[];


  /**
   * Skills explicitly marked as preferred,
   * desirable, nice-to-have, etc.
   */
  preferredSkills: string[];


  // ==========================================================
  // RESPONSIBILITIES
  // ==========================================================

  /**
   * Actual responsibilities described by the employer.
   *
   * Example:
   *
   * - Build dashboards
   * - Analyze business data
   * - Work with stakeholders
   */
  responsibilities: string[];


  // ==========================================================
  // QUALIFICATIONS
  // ==========================================================

  /**
   * General qualifications that are not necessarily skills.
   *
   * Example:
   *
   * - Bachelor's degree
   * - Strong analytical ability
   * - Excellent communication
   */
  qualifications: string[];


  // ==========================================================
  // EDUCATION
  // ==========================================================

  /**
   * Explicit educational requirements.
   *
   * Example:
   *
   * - Bachelor's degree in Computer Science
   * - Master's degree preferred
   */
  educationRequirements: string[];


  // ==========================================================
  // EXPERIENCE
  // ==========================================================

  /**
   * Explicit experience requirements.
   *
   * Example:
   *
   * - 2+ years of experience
   * - Experience with financial analytics
   */
  experienceRequirements: string[];


  // ==========================================================
  // RAW SOURCE
  // ==========================================================

  /**
   * Original JD exactly as provided by the user.
   *
   * This is retained so that later analysis can always
   * trace structured information back to the source.
   */
  rawText: string;
}


// ============================================================
// PARSER RESULT
// ============================================================
//
// Keeping parser metadata separate from the actual JD makes
// debugging easier without polluting the matching model.
// ============================================================

export interface JDParserResult {

  jobDescription: ParsedJobDescription;

  confidence: number;

  warnings: string[];
}