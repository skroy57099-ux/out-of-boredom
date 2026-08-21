// components/BorePlay/ResumeAnalyzer/canonical/resume-schema.ts

export interface CanonicalContact {
  name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
  otherLinks: string[];
}

export interface CanonicalExperience {
  id: string;

  company: string | null;
  title: string | null;
  location: string | null;

  startDate: string | null;
  endDate: string | null;

  type:
    | "employment"
    | "internship"
    | "training"
    | "contract"
    | "freelance"
    | "unknown";

  bullets: string[];

  evidenceIds: string[];
}

export interface CanonicalProject {
  id: string;

  title: string | null;

  technologies: string[];

  description: string | null;

  bullets: string[];

  dates: string | null;

  evidenceIds: string[];
}

export interface CanonicalEducation {
  id: string;

  institution: string | null;
  degree: string | null;
  field: string | null;
  location: string | null;

  startDate: string | null;
  endDate: string | null;

  grade: string | null;

  evidenceIds: string[];
}

export interface CanonicalCertification {
  id: string;

  name: string | null;
  issuer: string | null;
  date: string | null;

  description: string | null;

  evidenceIds: string[];
}

export interface CanonicalPublication {
  id: string;

  title: string | null;
  authorship: string | null;
  venue: string | null;
  date: string | null;
  identifier: string | null;

  evidenceIds: string[];
}

export interface CanonicalEvidence {
  id: string;

  text: string;

  page: number | null;

  x: number | null;
  y: number | null;

  width: number | null;
  height: number | null;
}

export interface StructuredResume {
  contact: CanonicalContact;

  headline: string | null;

  summary: string | null;

  skills: string[];

  experience: CanonicalExperience[];

  projects: CanonicalProject[];

  education: CanonicalEducation[];

  certifications: CanonicalCertification[];

  publications: CanonicalPublication[];

  evidence: CanonicalEvidence[];
}
