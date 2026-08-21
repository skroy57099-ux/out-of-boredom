// lib/resume-storage.ts

const STORAGE_KEY = "parsed_resume";


// ============================================================
// TYPES
// ============================================================

export interface StoredParsedResume {
  version: 1;

  parsedAt: string;

  fileName: string;

  resume: ParsedResume;
}


export interface ParsedResume {
  contact: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    location?: string | null;
    linkedin?: string | null;
    github?: string | null;
    portfolio?: string | null;
    [key: string]: unknown;
  };

  summary: string;

  experience: ParsedExperience[];

  skills: string[];

  projects: ParsedProject[];

  education: ParsedEducation[];

  certifications: ParsedCertification[];

  publications: ParsedPublication[];

  additionalSections: ParsedAdditionalSection[];

  [key: string]: unknown;
}


export interface ParsedExperience {
  company?: string | null;
  title?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  location?: string | null;
  description?: string | null;
  bullets?: string[];

  [key: string]: unknown;
}


export interface ParsedProject {
  title?: string | null;
  description?: string | null;
  technologies?: string[];
  bullets?: string[];
  dates?: string | null;

  [key: string]: unknown;
}


export interface ParsedEducation {
  institution?: string | null;
  degree?: string | null;
  year?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  grade?: string | null;

  [key: string]: unknown;
}


export interface ParsedCertification {
  name?: string | null;
  issuer?: string | null;
  date?: string | null;
  description?: string | null;

  [key: string]: unknown;
}


export interface ParsedPublication {
  title?: string | null;
  authorship?: string | null;
  venue?: string | null;
  date?: string | null;
  identifier?: string | null;

  [key: string]: unknown;
}


export interface ParsedAdditionalSection {
  title?: string | null;
  content?: string | null;

  [key: string]: unknown;
}


// ============================================================
// SAVE
// ============================================================

export function saveParsedResume(
  resume: ParsedResume,
  fileName: string,
): void {

  // sessionStorage only exists in the browser.
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }


  const data:
    StoredParsedResume = {

      version:
        1,

      parsedAt:
        new Date().toISOString(),

      fileName,

      resume,
    };


  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      data,
    ),
  );
}


// ============================================================
// GET
// ============================================================

export function getParsedResume():
  StoredParsedResume | null {

  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }


  const stored =
    sessionStorage.getItem(
      STORAGE_KEY,
    );


  if (!stored) {
    return null;
  }


  try {

    return JSON.parse(
      stored,
    ) as StoredParsedResume;

  } catch (
    error
  ) {

    console.error(
      "Failed to read parsed resume from sessionStorage:",
      error,
    );


    sessionStorage.removeItem(
      STORAGE_KEY,
    );


    return null;
  }
}


// ============================================================
// CLEAR
// ============================================================

export function clearParsedResume():
  void {

  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }


  sessionStorage.removeItem(
    STORAGE_KEY,
  );
}


// ============================================================
// CHECK
// ============================================================

export function hasParsedResume():
  boolean {

  if (
    typeof window ===
    "undefined"
  ) {
    return false;
  }


  return (
    sessionStorage.getItem(
      STORAGE_KEY,
    ) !== null
  );
}