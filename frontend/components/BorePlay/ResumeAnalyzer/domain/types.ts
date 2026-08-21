// ============================================================
// Resume Analyzer - Core Data Models
// ============================================================
//
// Pipeline:
//
// Resume PDF
//     ↓
// Parsed Resume
//     ↓
// Evidence
//     ↓
// Job Description
//     ↓
// Requirements
//     ↓
// Requirement Matching
//     ↓
// Findings
//     ↓
// Recommendations
//     ↓
// Evidence-Based Rewrites
//
// This file contains the shared data contracts for that pipeline.
// ============================================================


// ------------------------------------------------------------
// Resume
// ------------------------------------------------------------

export interface Resume {
  id?: string;

  metadata: ResumeMetadata;

  contact: ContactInformation;

  headline?: string;

  summary?: string;

  skills: Skill[];

  experience: Experience[];

  projects: Project[];

  education: Education[];

  certifications: Certification[];

  publications: Publication[];

  otherSections: ResumeSection[];
}


// ------------------------------------------------------------
// Resume Metadata
// ------------------------------------------------------------

export interface ResumeMetadata {
  fileName: string;
  pageCount?: number;
  parsedAt?: string;
}


// ------------------------------------------------------------
// Contact Information
// ------------------------------------------------------------

export interface ContactInformation {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}


// ------------------------------------------------------------
// Skills
// ------------------------------------------------------------

export interface Skill {
  name: string;

  category: SkillCategory;

  /**
   * Where the skill appears in the resume.
   */
  sources: SkillSource[];

  /**
   * Whether the resume provides actual supporting evidence
   * for the skill beyond simply listing it.
   */
  evidenceLevel: EvidenceLevel;

  evidenceIds: string[];
}

export type SkillCategory =
  | "programming"
  | "analytics"
  | "database"
  | "visualization"
  | "machine_learning"
  | "data_engineering"
  | "cloud"
  | "ai"
  | "domain"
  | "other";

export type SkillSource =
  | "skills_section"
  | "summary"
  | "experience"
  | "project"
  | "education"
  | "certification"
  | "publication";


// ------------------------------------------------------------
// Professional Experience
// ------------------------------------------------------------

export interface Experience {
  id?: string;

  company: string;

  title: string;

  location?: string;

  startDate?: string;

  endDate?: string;

  bullets: ResumeBullet[];
}


// ------------------------------------------------------------
// Projects
// ------------------------------------------------------------

export interface Project {
  id?: string;

  name: string;

  technologies: string[];

  startDate?: string;

  endDate?: string;

  bullets: ResumeBullet[];
}


// ------------------------------------------------------------
// Resume Bullet
// ------------------------------------------------------------

export interface ResumeBullet {
  id: string;

  text: string;

  evidenceIds: string[];
}


// ------------------------------------------------------------
// Education
// ------------------------------------------------------------

export interface Education {
  id?: string;

  degree: string;

  institution: string;

  location?: string;

  startDate?: string;

  endDate?: string;

  grade?: string;
}


// ------------------------------------------------------------
// Certifications
// ------------------------------------------------------------

export interface Certification {
  id?: string;

  name: string;

  issuer?: string;

  date?: string;
}


// ------------------------------------------------------------
// Publications
// ------------------------------------------------------------

export interface Publication {
  id?: string;

  title: string;

  authorship?: string;

  journal?: string;

  identifier?: string;

  date?: string;
}


// ------------------------------------------------------------
// Generic Resume Section
// ------------------------------------------------------------

export interface ResumeSection {
  title: string;

  content: string;
}


// ============================================================
// JOB DESCRIPTION
// ============================================================

export interface Job {
  id?: string;

  metadata: JobMetadata;

  summary?: string;

  requiredSkills: Requirement[];

  preferredSkills: Requirement[];

  responsibilities: Responsibility[];

  experienceRequirements: ExperienceRequirement[];

  educationRequirements: EducationRequirement[];

  tools: Requirement[];

  domainRequirements: Requirement[];

  softSkills: Requirement[];

  otherSignals: Requirement[];
}


// ------------------------------------------------------------
// Job Metadata
// ------------------------------------------------------------

export interface JobMetadata {
  title: string;

  company?: string;

  location?: string;

  source?: string;
}


// ------------------------------------------------------------
// Job Responsibilities
// ------------------------------------------------------------

export interface Responsibility {
  id: string;

  text: string;

  importance: RequirementImportance;

  evidenceExpected: boolean;
}


// ------------------------------------------------------------
// Experience Requirements
// ------------------------------------------------------------

export interface ExperienceRequirement {
  id: string;

  text: string;

  minimumYears?: number;

  maximumYears?: number;

  importance: RequirementImportance;
}


// ------------------------------------------------------------
// Education Requirements
// ------------------------------------------------------------

export interface EducationRequirement {
  id: string;

  text: string;

  importance: RequirementImportance;
}


// ============================================================
// REQUIREMENTS
// ============================================================

export interface Requirement {
  id: string;

  name: string;

  category: RequirementCategory;

  importance: RequirementImportance;

  sourceText: string;

  /**
   * Whether the resume should contain evidence
   * demonstrating this requirement.
   */
  evidenceExpected: boolean;
}

export type RequirementCategory =
  | "technical_skill"
  | "tool"
  | "responsibility"
  | "experience"
  | "education"
  | "domain"
  | "soft_skill"
  | "other";

export type RequirementImportance =
  | "required"
  | "preferred"
  | "implicit";


// ============================================================
// EVIDENCE
// ============================================================

/**
 * Evidence is the foundation of the analyzer.
 *
 * Every important conclusion should be traceable back
 * to something actually present in the resume.
 */
export interface Evidence {
  id: string;

  source: EvidenceSource;

  sourceText: string;

  type: EvidenceType;

  relatedSkills: string[];

  relatedRequirements: string[];
}


export interface EvidenceSource {
  section:
    | "summary"
    | "skills"
    | "experience"
    | "project"
    | "education"
    | "certification"
    | "publication"
    | "other";

  itemId?: string;

  bulletId?: string;
}


export type EvidenceType =
  | "skill"
  | "responsibility"
  | "tool_usage"
  | "scale"
  | "frequency"
  | "scope"
  | "outcome"
  | "impact"
  | "stakeholder"
  | "domain_experience"
  | "education"
  | "certification"
  | "publication"
  | "other";


// ------------------------------------------------------------
// Evidence Level
// ------------------------------------------------------------

export type EvidenceLevel =
  | "evidenced"
  | "claimed"
  | "not_found";


// ============================================================
// REQUIREMENT MATCHING
// ============================================================

export interface RequirementMatch {
  requirementId: string;

  status: MatchStatus;

  evidenceIds: string[];

  strength: MatchStrength;

  explanation: string;
}


export type MatchStatus =
  | "strong"
  | "partial"
  | "weak"
  | "missing";


export type MatchStrength =
  | "high"
  | "medium"
  | "low"
  | "none";


// ============================================================
// ANALYSIS FINDINGS
// ============================================================

export interface Finding {
  id: string;

  category: AnalysisCategory;

  severity: RecommendationPriority;

  title: string;

  explanation: string;

  evidenceIds: string[];

  requirementIds: string[];
}


export type AnalysisCategory =
  | "role_alignment"
  | "requirement_coverage"
  | "technical_skill_evidence"
  | "experience_relevance"
  | "impact_evidence"
  | "resume_clarity";


// ============================================================
// RECOMMENDATIONS
// ============================================================

export interface Recommendation {
  id: string;

  priority: RecommendationPriority;

  category: AnalysisCategory;

  findingId: string;

  requirementIds: string[];

  action: string;

  currentText?: string;

  suggestedText?: string;

  why: string;

  evidenceUsed: string[];

  missingEvidence: string[];
}


export type RecommendationPriority =
  | "critical"
  | "high"
  | "medium"
  | "low";


// ============================================================
// REWRITE SUGGESTIONS
// ============================================================

export interface RewriteSuggestion {
  id: string;

  sourceText: string;

  issue: string;

  suggestedText: string;

  why: string;

  evidenceUsed: string[];

  unsupportedClaims: string[];
}


// ============================================================
// COMPLETE ANALYSIS
// ============================================================

export interface ResumeAnalysis {
  id?: string;

  resumeId?: string;

  jobId?: string;

  targetRole: string;

  roleAlignment: RoleAlignment;

  requirementMatches: RequirementMatch[];

  findings: Finding[];

  recommendations: Recommendation[];

  rewrites: RewriteSuggestion[];
}


// ------------------------------------------------------------
// Role Alignment
// ------------------------------------------------------------

export interface RoleAlignment {
  strengths: string[];

  weaknesses: string[];

  explanation: string;
}
// ============================================================
// PDF LAYOUT REPRESENTATION
// ============================================================
//
// These types preserve information extracted from the PDF
// before semantic resume parsing happens.
//
// The parser should not rely only on plain text.
// Position, font size, page and visual grouping can help
// determine structure when resume formatting varies.
// ============================================================

export interface ResumeTextItem {
  text: string;

  x: number;

  y: number;

  fontSize: number;

  page: number;

  width: number;

  height: number;
}


export interface ResumeLine {
  text: string;

  page: number;

  x: number;

  y: number;

  fontSize: number;

  items: ResumeTextItem[];
}


export interface ResumeBlock {
  lines: ResumeLine[];

  startPage: number;

  endPage: number;
}