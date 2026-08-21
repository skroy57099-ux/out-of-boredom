"use client";

import ImproveYourMatch from "@/components/BorePlay/ResumeAnalyzer/ImproveYourMatch";
import {
  useState,
  type ChangeEvent,
} from "react";

import {
  saveParsedResume,
  type ParsedResume,
} from "@/lib/resume-storage";

import {
  matchResumeToJD,
} from "@/components/BorePlay/ResumeAnalyzer/matching/skill-matcher";

import {
  JDCoreSkill,
} from "@/components/BorePlay/ResumeAnalyzer/matching/types";


// ============================================================
// CONVERT GEMINI RESUME TO STORED RESUME
// ============================================================

function convertToStoredResume(
  resume: GeminiResume,
): ParsedResume {

  return {
    contact: {
      name: resume.contact.name,
      email: resume.contact.email,
      phone: resume.contact.phone,
      location: resume.contact.location,
      linkedin: resume.contact.linkedin,
      github: resume.contact.github,
      portfolio: resume.contact.portfolio,
    },

    summary:
      resume.summary ?? "",

    experience:
      resume.experience.map(
        (
          experience,
        ) => ({
          company:
            experience.company,

          title:
            experience.title,

          startDate:
            experience.startDate,

          endDate:
            experience.endDate,

          location:
            experience.location,

          description:
            experience.description,

          bullets:
            experience.bullets,
        }),
      ),

    skills:
      resume.skills,

    projects:
      resume.projects.map(
        (
          project,
        ) => ({
          title:
            project.title,

          description:
            project.description,

          technologies:
            project.technologies,

          bullets:
            project.bullets,

          dates:
            project.dates,
        }),
      ),

    education:
      resume.education.map(
        (
          education,
        ) => ({
          institution:
            education.institution,

          degree:
            education.degree,

          startDate:
            education.startDate,

          endDate:
            education.endDate,

          grade:
            education.grade,
        }),
      ),

    certifications:
      resume.certifications.map(
        (
          certification,
        ) => ({
          name:
            certification.name,

          issuer:
            certification.issuer,

          date:
            certification.date,

          description:
            certification.description,
        }),
      ),

    publications:
      resume.publications.map(
        (
          publication,
        ) => ({
          title:
            publication.title,

          authorship:
            publication.authorship,

          venue:
            publication.venue,

          date:
            publication.date,

          identifier:
            publication.identifier,
        }),
      ),

    additionalSections:
      resume.additionalSections.map(
        (
          section,
        ) => ({
          title:
            section.heading,

          content:
            section.content,
        }),
      ),
  };
}


// ============================================================
// GEMINI STRUCTURED RESUME TYPES
// ============================================================

interface GeminiContact {
  name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
  otherLinks: string[];
}

interface GeminiExperience {
  company: string | null;
  title: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  bullets: string[];
  type: string;
  evidence: string[];
}

interface GeminiProject {
  title: string | null;
  technologies: string[];
  description: string | null;
  bullets: string[];
  dates: string | null;
  evidence: string[];
}

interface GeminiEducation {
  institution: string | null;
  degree: string | null;
  field: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  grade: string | null;
  evidence: string[];
}

interface GeminiCertification {
  name: string | null;
  issuer: string | null;
  date: string | null;
  description: string | null;
  evidence: string[];
}

interface GeminiPublication {
  title: string | null;
  authorship: string | null;
  venue: string | null;
  date: string | null;
  identifier: string | null;
  evidence: string[];
}

interface GeminiAdditionalSection {
  heading: string;
  content: string;
  evidence: string[];
}

interface GeminiResume {
  contact: GeminiContact;

  headline: string | null;

  summary: string | null;

  skills: string[];

  experience: GeminiExperience[];

  projects: GeminiProject[];

  education: GeminiEducation[];

  certifications: GeminiCertification[];

  publications: GeminiPublication[];

  additionalSections: GeminiAdditionalSection[];
}

interface GeminiResponse {
  success: boolean;

  source: string;

  model: string;

  fileName: string;

  fileSize: number;

  resume: GeminiResume;
}


// ============================================================
// RAW / UNKNOWN API TYPES
// ============================================================

interface RawResume {
  contact?: Partial<GeminiContact> | null;

  headline?: string | null;

  summary?: string | null;

  skills?: unknown;

  experience?: unknown;

  projects?: unknown;

  education?: unknown;

  certifications?: unknown;

  publications?: unknown;

  additionalSections?: unknown;
}


// ============================================================
// JD TYPES
// ============================================================

interface JDEnrichedSkill {
  skill: string;

  subSkills: string[];

  confidence?: number;

  evidence?: string;
}

interface JDValueItem {
  value: string;

  confidence?: number;

  evidence?: string;
}

type JDItem =
  | string
  | JDEnrichedSkill
  | JDValueItem;


interface ParsedJobDescription {
  title: string | null;

  company: string | null;

  requiredSkills: JDItem[];

  preferredSkills: JDItem[];

  responsibilities: JDItem[];

  qualifications: JDItem[];

  educationRequirements: JDItem[];

  experienceRequirements: JDItem[];

  rawText: string;
}

interface JDParseResponse {
  success: boolean;

  jobDescription: ParsedJobDescription;

  confidence: number;

  warnings: string[];
}


// ============================================================
// SMALL HELPERS
// ============================================================

function asString(
  value: unknown,
): string | null {

  return typeof value ===
    "string"
    ? value
    : null;
}


function asStringArray(
  value: unknown,
): string[] {

  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  return value
    .filter(
      (
        item,
      ): item is string =>
        typeof item ===
        "string",
    )
    .map(
      (
        item,
      ) =>
        item.trim(),
    )
    .filter(
      (
        item,
      ) =>
        item.length > 0,
    );
}


// ============================================================
// NORMALIZE CONTACT
// ============================================================

function normalizeContact(
  value: unknown,
): GeminiContact {

  const contact =
    value &&
    typeof value ===
      "object"
      ? value as Partial<GeminiContact>
      : {};

  return {
    name:
      asString(
        contact.name,
      ),

    email:
      asString(
        contact.email,
      ),

    phone:
      asString(
        contact.phone,
      ),

    location:
      asString(
        contact.location,
      ),

    linkedin:
      asString(
        contact.linkedin,
      ),

    github:
      asString(
        contact.github,
      ),

    portfolio:
      asString(
        contact.portfolio,
      ),

    otherLinks:
      asStringArray(
        contact.otherLinks,
      ),
  };
}


// ============================================================
// NORMALIZE EXPERIENCE
// ============================================================

function normalizeExperience(
  value: unknown,
): GeminiExperience[] {

  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  return value
    .filter(
      (
        item,
      ) =>
        item &&
        typeof item ===
          "object",
    )
    .map(
      (
        item,
      ) => {

        const experience =
          item as Partial<GeminiExperience>;

        return {
          company:
            asString(
              experience.company,
            ),

          title:
            asString(
              experience.title,
            ),

          location:
            asString(
              experience.location,
            ),

          startDate:
            asString(
              experience.startDate,
            ),

          endDate:
            asString(
              experience.endDate,
            ),

          description:
            asString(
              experience.description,
            ),

          bullets:
            asStringArray(
              experience.bullets,
            ),

          type:
            typeof experience.type ===
              "string"
              ? experience.type
              : "unknown",

          evidence:
            asStringArray(
              experience.evidence,
            ),
        };
      },
    );
}


// ============================================================
// NORMALIZE PROJECTS
// ============================================================

function normalizeProjects(
  value: unknown,
): GeminiProject[] {

  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  return value
    .filter(
      (
        item,
      ) =>
        item &&
        typeof item ===
          "object",
    )
    .map(
      (
        item,
      ) => {

        const project =
          item as Partial<GeminiProject>;

        return {
          title:
            asString(
              project.title,
            ),

          technologies:
            asStringArray(
              project.technologies,
            ),

          description:
            asString(
              project.description,
            ),

          bullets:
            asStringArray(
              project.bullets,
            ),

          dates:
            asString(
              project.dates,
            ),

          evidence:
            asStringArray(
              project.evidence,
            ),
        };
      },
    );
}


// ============================================================
// NORMALIZE EDUCATION
// ============================================================

function normalizeEducation(
  value: unknown,
): GeminiEducation[] {

  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  return value
    .filter(
      (
        item,
      ) =>
        item &&
        typeof item ===
          "object",
    )
    .map(
      (
        item,
      ) => {

        const education =
          item as Partial<GeminiEducation>;

        return {
          institution:
            asString(
              education.institution,
            ),

          degree:
            asString(
              education.degree,
            ),

          field:
            asString(
              education.field,
            ),

          location:
            asString(
              education.location,
            ),

          startDate:
            asString(
              education.startDate,
            ),

          endDate:
            asString(
              education.endDate,
            ),

          grade:
            asString(
              education.grade,
            ),

          evidence:
            asStringArray(
              education.evidence,
            ),
        };
      },
    );
}


// ============================================================
// NORMALIZE CERTIFICATIONS
// ============================================================

function normalizeCertifications(
  value: unknown,
): GeminiCertification[] {

  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  return value
    .filter(
      (
        item,
      ) =>
        item &&
        typeof item ===
          "object",
    )
    .map(
      (
        item,
      ) => {

        const certification =
          item as Partial<GeminiCertification>;

        return {
          name:
            asString(
              certification.name,
            ),

          issuer:
            asString(
              certification.issuer,
            ),

          date:
            asString(
              certification.date,
            ),

          description:
            asString(
              certification.description,
            ),

          evidence:
            asStringArray(
              certification.evidence,
            ),
        };
      },
    );
}


// ============================================================
// NORMALIZE PUBLICATIONS
// ============================================================

function normalizePublications(
  value: unknown,
): GeminiPublication[] {

  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  return value
    .filter(
      (
        item,
      ) =>
        item &&
        typeof item ===
          "object",
    )
    .map(
      (
        item,
      ) => {

        const publication =
          item as Partial<GeminiPublication>;

        return {
          title:
            asString(
              publication.title,
            ),

          authorship:
            asString(
              publication.authorship,
            ),

          venue:
            asString(
              publication.venue,
            ),

          date:
            asString(
              publication.date,
            ),

          identifier:
            asString(
              publication.identifier,
            ),

          evidence:
            asStringArray(
              publication.evidence,
            ),
        };
      },
    );
}


// ============================================================
// NORMALIZE ADDITIONAL SECTIONS
// ============================================================

function normalizeAdditionalSections(
  value: unknown,
): GeminiAdditionalSection[] {

  if (
    !Array.isArray(value)
  ) {
    return [];
  }

  return value
    .filter(
      (
        item,
      ) =>
        item &&
        typeof item ===
          "object",
    )
    .map(
      (
        item,
      ) => {

        const section =
          item as Partial<GeminiAdditionalSection>;

        return {
          heading:
            typeof section.heading ===
              "string"
              ? section.heading
              : "Additional Information",

          content:
            typeof section.content ===
              "string"
              ? section.content
              : "",

          evidence:
            asStringArray(
              section.evidence,
            ),
        };
      },
    );
}


// ============================================================
// NORMALIZE COMPLETE RESUME
// ============================================================

function normalizeResume(
  value: unknown,
): GeminiResume {

  const raw =
    value &&
    typeof value ===
      "object"
      ? value as RawResume
      : {};

  return {
    contact:
      normalizeContact(
        raw.contact,
      ),

    headline:
      asString(
        raw.headline,
      ),

    summary:
      asString(
        raw.summary,
      ),

    skills:
      asStringArray(
        raw.skills,
      ),

    experience:
      normalizeExperience(
        raw.experience,
      ),

    projects:
      normalizeProjects(
        raw.projects,
      ),

    education:
      normalizeEducation(
        raw.education,
      ),

    certifications:
      normalizeCertifications(
        raw.certifications,
      ),

    publications:
      normalizePublications(
        raw.publications,
      ),

    additionalSections:
      normalizeAdditionalSections(
        raw.additionalSections,
      ),
  };
}


// ============================================================
// JD DISPLAY HELPERS
// ============================================================

function getJDItemTitle(
  item: JDItem,
): string {

  if (
    typeof item ===
    "string"
  ) {

    return item;
  }


  if (
    item &&
    typeof item ===
      "object"
  ) {

    if (
      "skill" in item &&
      typeof item.skill ===
        "string"
    ) {

      return item.skill;
    }


    if (
      "value" in item &&
      typeof item.value ===
        "string"
    ) {

      return item.value;
    }
  }


  return "";
}


function getJDSubSkills(
  item: JDItem,
): string[] {

  if (
    !item ||
    typeof item !==
      "object"
  ) {

    return [];
  }


  if (
    "subSkills" in item &&
    Array.isArray(
      item.subSkills,
    )
  ) {

    return item.subSkills
      .filter(
        (
          subSkill,
        ): subSkill is string =>
          typeof subSkill ===
          "string",
      )
      .map(
        (
          subSkill,
        ) =>
          subSkill.trim(),
      )
      .filter(
        (
          subSkill,
        ) =>
          subSkill.length >
          0,
      );
  }


  return [];
}


function getJDItemEvidence(
  item: JDItem,
): string | null {

  if (
    !item ||
    typeof item !==
      "object"
  ) {

    return null;
  }


  if (
    "evidence" in item &&
    typeof item.evidence ===
      "string"
  ) {

    return item.evidence;
  }


  return null;
}


function formatJDItemForKey(
  item: JDItem,
  index: number,
): string {

  const title =
    getJDItemTitle(
      item,
    );

  return `${title}-${index}`;
}


// ============================================================
// PAGE
// ============================================================

export default function ResumeAnalyzerPage() {

  const [file, setFile] =
    useState<File | null>(
      null,
    );

  const [isParsing, setIsParsing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [resume, setResume] =
    useState<GeminiResume | null>(
      null,
    );

  const [pageCount, setPageCount] =
    useState<number | null>(
      null,
    );

  const [showParsedResume, setShowParsedResume] =
    useState(false);


  // ==========================================================
  // JD STATE
  // ==========================================================

  const [jobDescription, setJobDescription] =
    useState("");

  const [jdParsing, setJdParsing] =
    useState(false);

  const [jdResult, setJdResult] =
    useState<JDParseResponse | null>(
      null,
    );

  const [jdError, setJdError] =
    useState<string | null>(
      null,
    );

  const [showParsedJD, setShowParsedJD] =
    useState(false);

  // ==========================================================
  // JD / RESUME MATCHING STATE
  // ==========================================================

  const [matchResult, setMatchResult] =
    useState<
      ReturnType<typeof matchResumeToJD> | null
    >(null);

  const [showMatchDetails, setShowMatchDetails] =
    useState(false);


  // ==========================================================
  // JD ANALYZER
  // ==========================================================

  async function handleAnalyzeJob() {

    if (
      !jobDescription.trim()
    ) {

      setJdError(
        "Please paste a job description first.",
      );

      return;
    }


    setJdParsing(
      true,
    );

    setJdError(
      null,
    );

    setJdResult(
      null,
    );

    setMatchResult(
      null,
    );

    setShowMatchDetails(
      false,
    );

    setShowParsedJD(
      false,
    );


    try {

      // ------------------------------------------------------
      // Parse JD
      // ------------------------------------------------------

      const response =
        await fetch(
          "/api/resume/jd/parse",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                text:
                  jobDescription,
              }),
          },
        );


      const data =
        await response.json();


      if (
        !response.ok
      ) {

        throw new Error(
          data?.error ||
            "Job description parsing failed.",
        );
      }


      console.log(
        "📊 Parsed JD:",
        data,
      );


      const parsedJD =
        data as JDParseResponse;

      const requiredSkills =
        parsedJD.jobDescription?.requiredSkills ?? [];

      const preferredSkills =
        parsedJD.jobDescription?.preferredSkills ?? [];

      // ==========================================================
      // BUILD RESUME SKILL SOURCE
      // ==========================================================

      const storedResumeJSON =
        sessionStorage.getItem(
          "parsed_resume",
        );


      if (
        !storedResumeJSON
      ) {

        throw new Error(
          "Parsed resume data is no longer available in this browser session.",
        );
      }


      let storedResumeData:
        {
          resume?: {
            skills?: unknown;
            summary?: unknown;
            experience?: unknown;
            projects?: unknown;
            certifications?: unknown;
            education?: unknown;
            publications?: unknown;
            additionalSections?: unknown;
          };
        } | null =
        null;


      try {

        storedResumeData =
          JSON.parse(
            storedResumeJSON,
          ) as {
            resume?: {
              skills?: unknown;
              summary?: unknown;
              experience?: unknown;
              projects?: unknown;
              certifications?: unknown;
              education?: unknown;
              publications?: unknown;
              additionalSections?: unknown;
            };
          };

      } catch {

        throw new Error(
          "Saved resume data could not be read. Please upload the resume again.",
        );
      }


      const resumeSkills =
        Array.isArray(
          storedResumeData?.resume?.skills,
        )
          ? storedResumeData.resume.skills.filter(
              (
                skill,
              ): skill is string =>
                typeof skill ===
                  "string" &&
                skill.trim().length >
                  0,
            )
          : [];


      // ==========================================================
      // COMPLETE RESUME EVIDENCE SOURCE
      // ==========================================================

      const resumeSource = {
        skills: resumeSkills,

        summary:
          typeof storedResumeData?.resume?.summary ===
          "string"
            ? storedResumeData.resume.summary
            : null,

        experience:
          Array.isArray(
            storedResumeData?.resume?.experience,
          )
            ? storedResumeData.resume.experience
            : [],

        projects:
          Array.isArray(
            storedResumeData?.resume?.projects,
          )
            ? storedResumeData.resume.projects
            : [],

        certifications:
          Array.isArray(
            storedResumeData?.resume?.certifications,
          )
            ? storedResumeData.resume.certifications
            : [],

        education:
          Array.isArray(
            storedResumeData?.resume?.education,
          )
            ? storedResumeData.resume.education
            : [],

        publications:
          Array.isArray(
            storedResumeData?.resume?.publications,
          )
            ? storedResumeData.resume.publications
            : [],

        additionalSections:
          Array.isArray(
            storedResumeData?.resume?.additionalSections,
          )
            ? storedResumeData.resume.additionalSections
            : [],
      };


      // ==========================================================
      // MATCH RESUME AGAINST JD
      // ==========================================================

      const matched =
        matchResumeToJD(
          resumeSource,
          requiredSkills as JDCoreSkill[],
          preferredSkills as JDCoreSkill[],
        );


      console.log(
        "🎯 Resume/JD skill match:",
        matched,
      );


      setMatchResult(
        matched,
      );
 
      setJdResult(
        parsedJD,
      );

    } catch (
      error
    ) {

      console.error(
        "❌ JD analysis failed:",
        error,
      );


      setJdError(
        error instanceof Error
          ? error.message
          : "Job description analysis failed.",
      );

    } finally {

      setJdParsing(
        false,
      );
    }
  }


  // ==========================================================
  // GEMINI RESUME PARSER
  // ==========================================================

  async function parseResumeWithGemini(
    selectedFile: File,
  ): Promise<GeminiResponse> {

    const formData =
      new FormData();


    formData.append(
      "file",
      selectedFile,
    );


    const response =
      await fetch(
        "/api/resume/parse",
        {
          method:
            "POST",

          body:
            formData,
        },
      );


    const data =
      await response.json();


    if (
      !response.ok
    ) {

      throw new Error(
        data?.error ||
          "Resume parsing failed.",
      );
    }


    return data as GeminiResponse;
  }


  // ==========================================================
  // PAGE COUNT
  // ==========================================================

  async function detectPageCount(
    selectedFile: File,
  ) {

    try {

      const buffer =
        await selectedFile.arrayBuffer();


      const bytes =
        new Uint8Array(
          buffer,
        );


      const decoder =
        new TextDecoder(
          "latin1",
        );


      const raw =
        decoder.decode(
          bytes,
        );


      const matches =
        raw.match(
          /\/Type\s*\/Page\b/g,
        );


      if (
        matches
      ) {

        setPageCount(
          matches.length,
        );

      }

    } catch {

      setPageCount(
        null,
      );
    }
  }


  // ==========================================================
  // FILE HANDLER
  // ==========================================================

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {

    const selectedFile =
      event.target.files?.[0];


    if (
      !selectedFile
    ) {
      return;
    }


    setError("");

    setResume(null);

    setFile(null);

    setPageCount(null);

    setShowParsedResume(false);


    // --------------------------------------------------------
    // PDF VALIDATION
    // --------------------------------------------------------

    const isPdf =
      selectedFile.type ===
        "application/pdf" ||
      selectedFile.name
        .toLowerCase()
        .endsWith(
          ".pdf",
        );


    if (
      !isPdf
    ) {

      setError(
        "Please upload a PDF resume.",
      );

      event.target.value =
        "";

      return;
    }


    // --------------------------------------------------------
    // FILE SIZE
    // --------------------------------------------------------

    const maxFileSize =
      10 * 1024 * 1024;


    if (
      selectedFile.size >
      maxFileSize
    ) {

      setError(
        "Resume PDF must be smaller than 10 MB.",
      );

      event.target.value =
        "";

      return;
    }


    setFile(
      selectedFile,
    );

    setIsParsing(
      true,
    );


    try {

      detectPageCount(
        selectedFile,
      );


      console.log(
        "🚀 Sending resume to Gemini:",
        selectedFile.name,
      );


      const result =
        await parseResumeWithGemini(
          selectedFile,
        );


      console.log(
        "🔥 GEMINI RESUME RESULT",
      );


      console.log(
        JSON.stringify(
          result.resume,
          null,
          2,
        ),
      );


      if (
        !result.resume
      ) {

        throw new Error(
          "Gemini returned no structured resume data.",
        );
      }


      // ------------------------------------------------------
      // NORMALIZE ONCE
      // ------------------------------------------------------

      const normalizedResume =
        normalizeResume(
          result.resume,
        );


      // ------------------------------------------------------
      // SAVE TO REACT STATE
      // ------------------------------------------------------

      setResume(
        normalizedResume,
      );


      // ------------------------------------------------------
      // SAVE TO SESSION STORAGE
      // ------------------------------------------------------

      const storedResume =
        convertToStoredResume(
          normalizedResume,
        );

      saveParsedResume(
        storedResume,
        selectedFile.name,
      );


      console.log(
        "💾 Parsed resume saved to sessionStorage.",
      );

    } catch (
      err
    ) {

      console.error(
        "Gemini resume parsing error:",
        err,
      );


      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while parsing the resume.",
      );


      setFile(
        null,
      );

    } finally {

      setIsParsing(
        false,
      );
    }
  }


  // ==========================================================
  // RESET
  // ==========================================================

  function handleReset() {

    setFile(
      null,
    );

    setResume(
      null,
    );

    setPageCount(
      null,
    );

    setError(
      "",
    );

    setShowParsedResume(
      false,
    );

    setShowParsedJD(
      false,
    );

    setJobDescription(
      "",
    );

    setJdResult(
      null,
    );

    setMatchResult(
      null,
    );

    setShowMatchDetails( 
      false,
    );

    setJdError(
      null,
    );
  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <main className="min-h-screen px-6 py-12">

      <div className="mx-auto max-w-5xl">


        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="mb-8">

          <p className="mb-2 text-sm font-medium tracking-wide text-cyan-400">
            BORE RESUME ANALYZER
          </p>


          <h1 className="text-3xl font-semibold text-white md:text-4xl">
            Analyze your resume for a specific role
          </h1>


          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/60">
            Upload your resume and we&apos;ll understand
            its structure and evidence before comparing
            it against your target role.
          </p>

        </div>


        {/* ================================================== */}
        {/* UPLOAD */}
        {/* ================================================== */}

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">

          <label
            htmlFor="resume-upload"
            className={`
              flex min-h-[260px]
              cursor-pointer
              flex-col
              items-center
              justify-center
              rounded-xl
              border
              border-dashed
              border-white/20
              px-6
              py-12
              text-center
              transition
              hover:border-cyan-400/50
              hover:bg-white/[0.03]
              ${
                isParsing
                  ? "pointer-events-none opacity-60"
                  : ""
              }
            `}
          >

            <div className="mb-5 text-4xl">
              📄
            </div>


            <p className="text-base font-medium text-white">

              {isParsing
                ? "Understanding your resume..."
                : "Upload your resume"}

            </p>


            <p className="mt-2 text-xs text-white/50">
              PDF files only • Maximum 10 MB
            </p>


            <input
              id="resume-upload"
              type="file"
              accept="application/pdf,.pdf"
              onChange={
                handleFileChange
              }
              disabled={
                isParsing
              }
              className="hidden"
            />

          </label>


          {/* ================================================= */}
          {/* FILE */}
          {/* ================================================= */}

          {file && (

            <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3">

              <div className="min-w-0">

                <p className="text-xs font-medium text-emerald-400">

                  {isParsing
                    ? "Understanding resume"
                    : "Resume understood"}

                </p>


                <p className="mt-1 truncate text-sm text-white/80">
                  {file.name}
                </p>

              </div>


              {!isParsing && (

                <button
                  type="button"
                  onClick={
                    handleReset
                  }
                  className="shrink-0 rounded-lg px-3 py-2 text-xs text-white/50 transition hover:bg-white/10 hover:text-white"
                >
                  Remove
                </button>

              )}

            </div>

          )}


          {/* ================================================= */}
          {/* ERROR */}
          {/* ================================================= */}

          {error && (

            <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3">

              <p className="text-xs font-medium text-red-400">
                Unable to understand resume
              </p>


              <p className="mt-1 text-sm text-red-300/80">
                {error}
              </p>

            </div>

          )}

        </div>


        {/* ================================================== */}
        {/* RESUME RESULTS */}
        {/* ================================================== */}

        {resume && (

          <div className="mt-8 space-y-6">


            {/* ============================================== */}
            {/* PARSE SUMMARY */}
            {/* ============================================== */}

            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                  <p className="text-xs font-medium uppercase tracking-wide text-cyan-400">
                    Understanding complete
                  </p>


                  <h2 className="mt-1 text-xl font-semibold text-white">
                    Structured resume detected
                  </h2>


                  <p className="mt-2 text-xs text-white/40">
                    Powered by Gemini document understanding
                  </p>

                </div>


                <div className="flex flex-wrap gap-3">

                  {pageCount !== null && (

                    <Stat
                      value={
                        pageCount
                      }
                      label="Pages"
                    />

                  )}


                  <Stat
                    value={
                      resume.skills.length
                    }
                    label="Skills"
                  />


                  <Stat
                    value={
                      resume.experience.length
                    }
                    label="Experience"
                  />


                  <Stat
                    value={
                      resume.projects.length
                    }
                    label="Projects"
                  />

                </div>

              </div>

            </section>


            {/* ============================================== */}
            {/* PARSED RESUME TOGGLE */}
            {/* ============================================== */}

            <button
              type="button"
              onClick={() =>
                setShowParsedResume(
                  (
                    current,
                  ) =>
                    !current,
                )
              }
              className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-left transition hover:border-cyan-400/30 hover:bg-white/[0.07]"
            >

              <span className="text-sm font-medium text-white">
                {showParsedResume
                  ? "Hide parsed resume"
                  : "View parsed resume"}
              </span>


              <span className="text-xs text-white/40">
                {showParsedResume
                  ? "▲"
                  : "▼"}
              </span>

            </button>


            {showParsedResume && (

              <div className="space-y-6">


            {/* ============================================== */}
            {/* OVERVIEW */}
            {/* ============================================== */}

            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">

              <p className="text-xs font-medium uppercase tracking-wide text-cyan-400">
                Resume Overview
              </p>


              <div className="mt-5 grid gap-6 md:grid-cols-2">


                {/* CONTACT */}

                <div>

                  <h3 className="text-sm font-medium text-white">
                    Contact
                  </h3>


                  <div className="mt-3 space-y-2 text-sm text-white/60">

                    <p>
                      <span className="text-white/40">
                        Name:
                      </span>{" "}

                      {resume.contact.name ??
                        "Not detected"}
                    </p>


                    <p>
                      <span className="text-white/40">
                        Email:
                      </span>{" "}

                      {resume.contact.email ??
                        "Not detected"}
                    </p>


                    <p>
                      <span className="text-white/40">
                        Phone:
                      </span>{" "}

                      {resume.contact.phone ??
                        "Not detected"}
                    </p>


                    <p>
                      <span className="text-white/40">
                        Location:
                      </span>{" "}

                      {resume.contact.location ??
                        "Not detected"}
                    </p>


                    {resume.contact.linkedin && (

                      <p>
                        <span className="text-white/40">
                          LinkedIn:
                        </span>{" "}

                        {resume.contact.linkedin}
                      </p>

                    )}

                  </div>

                </div>


                {/* HEADLINE */}

                <div>

                  <h3 className="text-sm font-medium text-white">
                    Headline
                  </h3>


                  <p className="mt-3 text-sm leading-6 text-white/60">
                    {resume.headline ??
                      "Not detected"}
                  </p>

                </div>

              </div>


              {/* SUMMARY */}

              {resume.summary && (

                <div className="mt-6 border-t border-white/10 pt-6">

                  <h3 className="text-sm font-medium text-white">
                    Professional Summary
                  </h3>


                  <p className="mt-3 text-sm leading-6 text-white/60">
                    {resume.summary}
                  </p>

                </div>

              )}

            </section>


            {/* ============================================== */}
            {/* SKILLS */}
            {/* ============================================== */}

            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">

              <p className="text-xs font-medium uppercase tracking-wide text-cyan-400">
                Skills Detected
              </p>


              {resume.skills.length > 0 ? (

                <div className="mt-4 flex flex-wrap gap-2">

                  {resume.skills.map(
                    (
                      skill,
                      index,
                    ) => (

                      <span
                        key={`${skill}-${index}`}
                        className="rounded-lg border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-white/70"
                      >
                        {skill}
                      </span>

                    ),
                  )}

                </div>

              ) : (

                <p className="mt-4 text-sm text-white/40">
                  No skills detected yet.
                </p>

              )}

            </section>


            {/* ============================================== */}
            {/* EXPERIENCE */}
            {/* ============================================== */}

            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">

              <p className="text-xs font-medium uppercase tracking-wide text-cyan-400">
                Experience Detected
              </p>


              {resume.experience.length > 0 ? (

                <div className="mt-5 space-y-6">

                  {resume.experience.map(
                    (
                      experience,
                      index,
                    ) => (

                      <div
                        key={`${experience.company}-${experience.title}-${index}`}
                        className="border-b border-white/10 pb-5 last:border-0 last:pb-0"
                      >

                        <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">

                          <div>

                            <h3 className="text-base font-medium text-white">
                              {experience.title ??
                                "Role not detected"}
                            </h3>


                            <p className="mt-1 text-sm text-white/50">

                              {experience.company ??
                                "Company not detected"}

                              {experience.location
                                ? ` • ${experience.location}`
                                : ""}

                            </p>

                          </div>


                          {(experience.startDate ||
                            experience.endDate) && (

                            <p className="text-xs text-white/40">

                              {experience.startDate ??
                                ""}

                              {experience.endDate
                                ? ` - ${experience.endDate}`
                                : ""}

                            </p>

                          )}

                        </div>


                        {experience.type &&
                          experience.type !==
                            "unknown" && (

                          <p className="mt-2 text-[11px] uppercase tracking-wide text-cyan-400/70">
                            {experience.type.replace(
                              /_/g,
                              " ",
                            )}
                          </p>

                        )}


                        {experience.bullets.length >
                          0 && (

                          <ul className="mt-4 space-y-2">

                            {experience.bullets.map(
                              (
                                bullet,
                                bulletIndex,
                              ) => (

                                <li
                                  key={`${experience.company}-${bulletIndex}`}
                                  className="text-sm leading-6 text-white/60"
                                >

                                  <span className="mr-2 text-cyan-400">
                                    •
                                  </span>

                                  {bullet}

                                </li>

                              ),
                            )}

                          </ul>

                        )}


                        {experience.bullets.length ===
                          0 &&
                          experience.description && (

                          <p className="mt-4 text-sm leading-6 text-white/60">
                            {experience.description}
                          </p>

                        )}

                      </div>

                    ),
                  )}

                </div>

              ) : (

                <p className="mt-4 text-sm text-white/40">
                  No experience entries detected yet.
                </p>

              )}

            </section>


            {/* ============================================== */}
            {/* PROJECTS */}
            {/* ============================================== */}

            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">

              <p className="text-xs font-medium uppercase tracking-wide text-cyan-400">
                Projects Detected
              </p>


              {resume.projects.length > 0 ? (

                <div className="mt-5 space-y-6">

                  {resume.projects.map(
                    (
                      project,
                      index,
                    ) => (

                      <div
                        key={`${project.title}-${index}`}
                        className="border-b border-white/10 pb-5 last:border-0 last:pb-0"
                      >

                        <h3 className="text-base font-medium text-white">
                          {project.title ??
                            "Project title not detected"}
                        </h3>


                        {project.technologies.length >
                          0 && (

                          <div className="mt-2 flex flex-wrap gap-2">

                            {project.technologies.map(
                              (
                                technology,
                                technologyIndex,
                              ) => (

                                <span
                                  key={`${technology}-${technologyIndex}`}
                                  className="rounded-md bg-cyan-400/10 px-2 py-1 text-[11px] text-cyan-300"
                                >
                                  {technology}
                                </span>

                              ),
                            )}

                          </div>

                        )}


                        {project.dates && (

                          <p className="mt-2 text-xs text-white/40">
                            {project.dates}
                          </p>

                        )}


                        {project.description && (

                          <p className="mt-3 text-sm leading-6 text-white/60">
                            {project.description}
                          </p>

                        )}


                        {project.bullets.length >
                          0 && (

                          <ul className="mt-4 space-y-2">

                            {project.bullets.map(
                              (
                                bullet,
                                bulletIndex,
                              ) => (

                                <li
                                  key={`${project.title}-${bulletIndex}`}
                                  className="text-sm leading-6 text-white/60"
                                >

                                  <span className="mr-2 text-cyan-400">
                                    •
                                  </span>

                                  {bullet}

                                </li>

                              ),
                            )}

                          </ul>

                        )}

                      </div>

                    ),
                  )}

                </div>

              ) : (

                <p className="mt-4 text-sm text-white/40">
                  No projects detected yet.
                </p>

              )}

            </section>


            {/* ============================================== */}
            {/* EDUCATION */}
            {/* ============================================== */}

            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">

              <p className="text-xs font-medium uppercase tracking-wide text-cyan-400">
                Education Detected
              </p>


              {resume.education.length > 0 ? (

                <div className="mt-5 space-y-4">

                  {resume.education.map(
                    (
                      education,
                      index,
                    ) => (

                      <div
                        key={`${education.institution}-${education.degree}-${index}`}
                        className="border-b border-white/10 pb-4 last:border-0 last:pb-0"
                      >

                        <h3 className="text-base font-medium text-white">

                          {education.degree ??
                            "Degree not detected"}

                          {education.field
                            ? `, ${education.field}`
                            : ""}

                        </h3>


                        <p className="mt-1 text-sm text-white/50">
                          {education.institution ??
                            "Institution not detected"}
                        </p>


                        {education.location && (

                          <p className="mt-1 text-xs text-white/40">
                            {education.location}
                          </p>

                        )}


                        {(education.startDate ||
                          education.endDate) && (

                          <p className="mt-1 text-xs text-white/40">

                            {education.startDate ??
                              ""}

                            {education.endDate
                              ? ` - ${education.endDate}`
                              : ""}

                          </p>

                        )}


                        {education.grade && (

                          <p className="mt-2 text-xs text-white/50">
                            {education.grade}
                          </p>

                        )}

                      </div>

                    ),
                  )}

                </div>

              ) : (

                <p className="mt-4 text-sm text-white/40">
                  No education entries detected yet.
                </p>

              )}

            </section>


            {/* ============================================== */}
            {/* CERTIFICATIONS */}
            {/* ============================================== */}

            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">

              <p className="text-xs font-medium uppercase tracking-wide text-cyan-400">
                Certifications Detected
              </p>


              {resume.certifications.length >
              0 ? (

                <div className="mt-4 space-y-3">

                  {resume.certifications.map(
                    (
                      certification,
                      index,
                    ) => (

                      <div
                        key={`${certification.name}-${index}`}
                        className="rounded-lg border border-white/10 bg-black/20 px-4 py-3"
                      >

                        <p className="text-sm text-white/80">
                          {certification.name ??
                            "Certification name not detected"}
                        </p>


                        {certification.issuer && (

                          <p className="mt-1 text-xs text-white/40">
                            {certification.issuer}
                          </p>

                        )}


                        {certification.date && (

                          <p className="mt-1 text-xs text-white/30">
                            {certification.date}
                          </p>

                        )}


                        {certification.description && (

                          <p className="mt-2 text-xs leading-5 text-white/50">
                            {certification.description}
                          </p>

                        )}

                      </div>

                    ),
                  )}

                </div>

              ) : (

                <p className="mt-4 text-sm text-white/40">
                  No certifications detected yet.
                </p>

              )}

            </section>


            {/* ============================================== */}
            {/* PUBLICATIONS */}
            {/* ============================================== */}

            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">

              <p className="text-xs font-medium uppercase tracking-wide text-cyan-400">
                Publications Detected
              </p>


              {resume.publications.length >
              0 ? (

                <div className="mt-5 space-y-4">

                  {resume.publications.map(
                    (
                      publication,
                      index,
                    ) => (

                      <div
                        key={`${publication.title}-${index}`}
                        className="rounded-lg border border-white/10 bg-black/20 p-4"
                      >

                        <h3 className="text-sm font-medium text-white">
                          {publication.title ??
                            "Publication title not detected"}
                        </h3>


                        {publication.authorship && (

                          <p className="mt-2 text-xs text-white/50">
                            {publication.authorship}
                          </p>

                        )}


                        {publication.venue && (

                          <p className="mt-1 text-xs text-white/40">
                            {publication.venue}
                          </p>

                        )}


                        {publication.date && (

                          <p className="mt-1 text-xs text-white/30">
                            {publication.date}
                          </p>

                        )}


                        {publication.identifier && (

                          <p className="mt-1 break-all text-xs text-white/30">
                            {publication.identifier}
                          </p>

                        )}

                      </div>

                    ),
                  )}

                </div>

              ) : (

                <p className="mt-4 text-sm text-white/40">
                  No publications detected yet.
                </p>

              )}

            </section>


            {/* ============================================== */}
            {/* ADDITIONAL SECTIONS */}
            {/* ============================================== */}

            {resume.additionalSections.length >
              0 && (

              <section className="rounded-2xl border border-white/10 bg-white/5 p-6">

                <p className="text-xs font-medium uppercase tracking-wide text-cyan-400">
                  Additional Sections
                </p>


                <div className="mt-5 space-y-5">

                  {resume.additionalSections.map(
                    (
                      section,
                      index,
                    ) => (

                      <div
                        key={`${section.heading}-${index}`}
                        className="border-b border-white/10 pb-5 last:border-0 last:pb-0"
                      >

                        <h3 className="text-sm font-medium text-white">
                          {section.heading}
                        </h3>


                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/60">
                          {section.content}
                        </p>

                      </div>

                    ),
                  )}

                </div>

              </section>

            )}


            {/* ============================================== */}
            {/* GEMINI STRUCTURED DATA */}
            {/* ============================================== */}

            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">

              <p className="text-xs font-medium uppercase tracking-wide text-cyan-400">
                Gemini Structured Data
              </p>


              <pre className="mt-4 max-h-[700px] overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/30 p-4 text-xs leading-5 text-white/50">
                {JSON.stringify(
                  resume,
                  null,
                  2,
                )}
              </pre>

            </section>

              </div>

            )}

          </div>

        )}


        {/* ================================================== */}
        {/* JOB DESCRIPTION */}
        {/* ================================================== */}

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur md:p-8">

          <div>

            <p className="text-xs font-medium uppercase tracking-wide text-cyan-400">
              Target Job
            </p>


            <h2 className="mt-1 text-xl font-semibold text-white">
              Job Description
            </h2>


            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">
              Paste the job description you want to
              compare against your parsed resume.
            </p>

          </div>


          {/* ================================================= */}
          {/* JD INPUT */}
          {/* ================================================= */}

          <textarea
            value={
              jobDescription
            }
            onChange={(
              event,
            ) =>
              setJobDescription(
                event.target.value,
              )
            }
            placeholder="Paste the complete job description here..."
            className="mt-5 min-h-[280px] w-full resize-y rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white outline-none placeholder:text-white/30 focus:border-cyan-400/40"
          />


          {/* ================================================= */}
          {/* JD ERROR */}
          {/* ================================================= */}

          {jdError && (

            <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3">

              <p className="text-sm text-red-300">
                {jdError}
              </p>

            </div>

          )}


          {/* ================================================= */}
          {/* JD BUTTON */}
          {/* ================================================= */}

          <div className="mt-4 flex items-center justify-between gap-4">

            <p className="text-xs text-white/30">
              JD parsing uses Gemini semantic understanding
              with Mistral fallback.
            </p>


            <button
              type="button"
              onClick={
                handleAnalyzeJob
              }
              disabled={
                jdParsing ||
                !jobDescription.trim() ||
                !resume
              }
              className="shrink-0 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-medium text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
            >

              {jdParsing
                ? "Analyzing..."
                : "Analyze Job"}

            </button>

          </div>


          {!resume && (

            <p className="mt-3 text-xs text-white/30">
              Upload and parse your resume before
              analyzing a job description.
            </p>

          )}


          {/* ================================================= */}
          {/* JD RESULT */}
          {/* ================================================= */}

          {jdResult && (

            <div className="mt-8 border-t border-white/10 pt-6">

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                <div>

                  <p className="text-xs font-medium uppercase tracking-wide text-emerald-400">
                    Job description parsed
                  </p>


                  <h3 className="mt-1 text-lg font-semibold text-white">
                    {jdResult.jobDescription.title ??
                      "Job title not detected"}
                  </h3>


                  {jdResult.jobDescription.company && (

                    <p className="mt-1 text-sm text-white/50">
                      {jdResult.jobDescription.company}
                    </p>

                  )}

                </div>


                <div className="rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-center">

                  <p className="text-lg font-semibold text-white">
                    {Math.round(
                      jdResult.confidence *
                        100,
                    )}
                    %
                  </p>


                  <p className="text-[11px] text-white/40">
                    Parser confidence
                  </p>

                </div>

              </div>

                 {/* ================================================= */}
                {/* RESUME / JD SKILL MATCH */}
                {/* ================================================= */}

                {matchResult && (

                  <section className="mt-6 rounded-xl border border-white/10 bg-black/20 p-5">

                    {/* ================================================= */}
                    {/* MATCH SUMMARY */}
                    {/* ================================================= */}

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                      <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-cyan-400">
                          Resume Match
                        </p>


                        <h4 className="mt-1 text-base font-semibold text-white">
                          Skill comparison
                        </h4>

                      </div>


                      {/* ================================================= */}
                      {/* MATCH COUNTERS */}
                      {/* ================================================= */}

                      <div className="flex flex-wrap gap-2 text-[11px]">

                        <span className="rounded-md border border-emerald-400/20 bg-emerald-400/5 px-2 py-1 text-emerald-300">
                          {
                            matchResult.required.matched.length +
                            matchResult.preferred.matched.length
                          }
                          {" "}matched
                        </span>


                        <span className="rounded-md border border-amber-400/20 bg-amber-400/5 px-2 py-1 text-amber-300">
                          {
                            matchResult.required.partial.length +
                            matchResult.preferred.partial.length
                          }
                          {" "}partial
                        </span>


                        <span className="rounded-md border border-red-400/20 bg-red-400/5 px-2 py-1 text-red-300">
                          {
                            matchResult.required.missing.length +
                            matchResult.preferred.missing.length
                          }
                          {" "}missing
                        </span>

                      </div>

                    </div>


                    {/* ================================================= */}
                    {/* MATCH DETAILS TOGGLE */}
                    {/* ================================================= */}

                    <button
                      type="button"
                      onClick={() =>
                        setShowMatchDetails(
                          (current) => !current,
                        )
                      }
                      className="mt-5 flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/20 px-5 py-4 text-left transition hover:border-cyan-400/30 hover:bg-white/[0.03]"
                    >

                      <span className="text-sm font-medium text-white">
                        {showMatchDetails
                          ? "Hide match details"
                          : "View match details"}
                      </span>


                      <span className="text-xs text-white/40">
                        {showMatchDetails
                          ? "▲"
                          : "▼"}
                      </span>

                    </button>


                    {/* ================================================= */}
                    {/* MATCH DETAILS */}
                    {/* ================================================= */}

                    {showMatchDetails && (

                      <div className="mt-5 grid gap-4 md:grid-cols-2">

                        <MatchCategoryCard
                          title="Required Skills"
                          result={
                            matchResult.required
                          }
                        />


                        <MatchCategoryCard
                          title="Preferred Skills"
                          result={
                            matchResult.preferred
                          }
                        />

                      </div>

                    )}

                      {/* ================================================= */}
                      {/* IMPROVE YOUR MATCH */}
                      {/* ================================================= */}

                      <ImproveYourMatch
                        matchResult={
                          matchResult
                        }
                      />

                  </section>

                )}



              {/* ================================================= */}
              {/* PARSED JD TOGGLE */}
              {/* ================================================= */}

              <button
                type="button"
                onClick={() =>
                  setShowParsedJD(
                    (
                      current,
                    ) =>
                      !current,
                  )
                }
                className="mt-6 flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/20 px-5 py-4 text-left transition hover:border-cyan-400/30 hover:bg-white/[0.03]"
              >

                <span className="text-sm font-medium text-white">
                  {showParsedJD
                    ? "Hide parsed JD"
                    : "View parsed JD"}
                </span>


                <span className="text-xs text-white/40">
                  {showParsedJD
                    ? "▲"
                    : "▼"}
                </span>

              </button>


              {showParsedJD && (

                <div className="space-y-6">


              {/* ================================================= */}
              {/* JD SUMMARY */}
              {/* ================================================= */}

              <div className="mt-6 grid gap-4 md:grid-cols-2">

                <JDResultCard
                  title="Required Skills"
                  items={
                    jdResult
                      .jobDescription
                      .requiredSkills
                  }
                />


                <JDResultCard
                  title="Preferred Skills"
                  items={
                    jdResult
                      .jobDescription
                      .preferredSkills
                  }
                />


                <JDResultCard
                  title="Responsibilities"
                  items={
                    jdResult
                      .jobDescription
                      .responsibilities
                  }
                />


                <JDResultCard
                  title="Qualifications"
                  items={
                    jdResult
                      .jobDescription
                      .qualifications
                  }
                />


                <JDResultCard
                  title="Education Requirements"
                  items={
                    jdResult
                      .jobDescription
                      .educationRequirements
                  }
                />


                <JDResultCard
                  title="Experience Requirements"
                  items={
                    jdResult
                      .jobDescription
                      .experienceRequirements
                  }
                />

              </div>


              {/* ================================================= */}
              {/* WARNINGS */}
              {/* ================================================= */}

              {jdResult.warnings.length >
                0 && (

                <div className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">

                  <p className="text-xs font-medium uppercase tracking-wide text-amber-400">
                    Parser notes
                  </p>


                  <ul className="mt-2 space-y-1">

                    {jdResult.warnings.map(
                      (
                        warning,
                        index,
                      ) => (

                        <li
                          key={`${warning}-${index}`}
                          className="text-xs leading-5 text-amber-200/70"
                        >
                          • {warning}
                        </li>

                      ),
                    )}

                  </ul>

                </div>

              )}


              {/* ================================================= */}
              {/* PARSED JD DATA */}
              {/* ================================================= */}

              <section className="rounded-xl border border-white/10 bg-black/20 p-4">

                <p className="text-xs font-medium uppercase tracking-wide text-cyan-400">
                  Parsed JD Data
                </p>


                <pre className="mt-3 max-h-[600px] overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/30 p-4 text-xs leading-5 text-white/50">
                  {JSON.stringify(
                    jdResult,
                    null,
                    2,
                  )}
                </pre>

              </section>

                </div>

              )}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}


// ============================================================
// SMALL STAT COMPONENT
// ============================================================

function Stat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {

  return (

    <div className="rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-center">

      <p className="text-lg font-semibold text-white">
        {value}
      </p>


      <p className="text-[11px] text-white/40">
        {label}
      </p>

    </div>
  );
}


// ============================================================
// MATCH CATEGORY CARD
// ============================================================

function MatchCategoryCard({
  title,
  result,
}: {
  title: string;

  result: {
    matched: ReturnType<
      typeof matchResumeToJD
    >["required"]["matched"];

    partial: ReturnType<
      typeof matchResumeToJD
    >["required"]["partial"];

    missing: ReturnType<
      typeof matchResumeToJD
    >["required"]["missing"];
  };
}) {

  return (

    <div className="rounded-xl border border-white/10 bg-black/20 p-4">

      <h5 className="text-sm font-medium text-white">
        {title}
      </h5>


      {/* MATCHED */}

      {result.matched.length > 0 && (

        <div className="mt-4">

          <p className="text-xs font-medium text-emerald-400">
            ✓ Matched
          </p>


          <div className="mt-2 space-y-2">

            {result.matched.map(
              (
                item,
              ) => (

                <MatchSkillRow
                  key={`matched-${item.skill}`}
                  item={item}
                  status="matched"
                />

              ),
            )}

          </div>

        </div>

      )}


      {/* PARTIAL */}

      {result.partial.length > 0 && (

        <div className="mt-4">

          <p className="text-xs font-medium text-amber-400">
            ◐ Partial
          </p>


          <div className="mt-2 space-y-2">

            {result.partial.map(
              (
                item,
              ) => (

                <MatchSkillRow
                  key={`partial-${item.skill}`}
                  item={item}
                  status="partial"
                />

              ),
            )}

          </div>

        </div>

      )}


      {/* MISSING */}

      {result.missing.length > 0 && (

        <div className="mt-4">

          <p className="text-xs font-medium text-red-400">
            ✗ Missing
          </p>


          <div className="mt-2 space-y-2">

            {result.missing.map(
              (
                item,
              ) => (

                <MatchSkillRow
                  key={`missing-${item.skill}`}
                  item={item}
                  status="missing"
                />

              ),
            )}

          </div>

        </div>

      )}


      {result.matched.length === 0 &&
        result.partial.length === 0 &&
        result.missing.length === 0 && (

        <p className="mt-3 text-xs text-white/30">
          No skills available for comparison.
        </p>

      )}

    </div>
  );
}

// ============================================================
// MATCH SKILL ROW
// ============================================================

function MatchSkillRow({
  item,
  status,
}: {
  item: ReturnType<
    typeof matchResumeToJD
  >["required"]["matched"][number];

  status:
    | "matched"
    | "partial"
    | "missing";
}) {

  // ----------------------------------------------------------
  // NORMALIZE RESUME EVIDENCE FOR DISPLAY
  // ----------------------------------------------------------

  const resumeEvidence =
    Array.isArray(item.resumeEvidence)
      ? item.resumeEvidence
          .map((evidence) => {

            if (
              typeof evidence ===
              "string"
            ) {
              return evidence;
            }

            if (
              evidence &&
              typeof evidence ===
                "object" &&
              "value" in evidence &&
              typeof evidence.value ===
                "string"
            ) {
              return evidence.value;
            }

            return null;
          })
          .filter(
            (
              value,
            ): value is string =>
              Boolean(
                value &&
                value.trim().length > 0,
              ),
          )
      : [];


  // ----------------------------------------------------------
  // REMOVE DUPLICATES
  // ----------------------------------------------------------

  const uniqueResumeEvidence =
    Array.from(
      new Set(
        resumeEvidence,
      ),
    );


  return (

    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">

      {/* ====================================================== */}
      {/* CORE SKILL */}
      {/* ====================================================== */}

      <p className="text-xs font-medium text-white/80">
        {item.skill}
      </p>


      {/* ====================================================== */}
      {/* MATCHED SUB-SKILLS */}
      {/* ====================================================== */}

      {item.matchedSubSkills.length >
        0 && (

        <div className="mt-2 space-y-1">

          {item.matchedSubSkills.map(
            (
              subSkill,
              index,
            ) => (

              <p
                key={`matched-sub-${subSkill}-${index}`}
                className="text-[11px] text-emerald-300/70"
              >
                ✓ {subSkill}
              </p>

            ),
          )}

        </div>

      )}


      {/* ====================================================== */}
      {/* MISSING SUB-SKILLS */}
      {/* ====================================================== */}

      {item.missingSubSkills.length >
        0 && (

        <div className="mt-2 space-y-1">

          {item.missingSubSkills.map(
            (
              subSkill,
              index,
            ) => (

              <p
                key={`missing-sub-${subSkill}-${index}`}
                className="text-[11px] text-red-300/70"
              >
                ✗ {subSkill}
              </p>

            ),
          )}

        </div>

      )}


      {/* ====================================================== */}
      {/* RESUME EVIDENCE */}
      {/* ====================================================== */}

      {uniqueResumeEvidence.length >
        0 && (

        <div className="mt-3">

          <p className="text-[10px] font-medium uppercase tracking-wide text-white/30">
            Resume evidence
          </p>


          <div className="mt-1 space-y-1">

            {uniqueResumeEvidence.map(
              (
                evidence,
                index,
              ) => (

                <p
                  key={`resume-evidence-${evidence}-${index}`}
                  className="text-[10px] leading-4 text-white/40"
                >
                  • {evidence}
                </p>

              ),
            )}

          </div>

        </div>

      )}


      {/* ====================================================== */}
      {/* JD EVIDENCE */}
      {/* ====================================================== */}

      {status === "missing" &&
        item.jdEvidence && (

        <p className="mt-3 text-[10px] leading-4 text-white/25">
          JD: {item.jdEvidence}
        </p>

      )}

    </div>
  );
}

// ============================================================
// JD RESULT CARD
// ============================================================

function JDResultCard({
  title,
  items,
}: {
  title: string;
  items: JDItem[];
}) {

  return (

    <div className="rounded-xl border border-white/10 bg-black/20 p-4">

      <h4 className="text-sm font-medium text-white">
        {title}
      </h4>


      {items.length > 0 ? (

        <ul className="mt-3 space-y-3">

          {items.map(
            (
              item,
              index,
            ) => {

              const itemTitle =
                getJDItemTitle(
                  item,
                );

              const subSkills =
                getJDSubSkills(
                  item,
                );

              const evidence =
                getJDItemEvidence(
                  item,
                );


              if (
                !itemTitle
              ) {
                return null;
              }


              return (

                <li
                  key={
                    formatJDItemForKey(
                      item,
                      index,
                    )
                  }
                  className="text-xs leading-5 text-white/70"
                >

                  {/* ======================================== */}
                  {/* CORE SKILL / MAIN ITEM */}
                  {/* ======================================== */}

                  <div className="flex items-start">

                    <span className="mr-2 shrink-0 text-cyan-400">
                      •
                    </span>


                    <span className="font-medium text-white/80">
                      {itemTitle}
                    </span>

                  </div>


                  {/* ======================================== */}
                  {/* SUB-SKILLS */}
                  {/* ======================================== */}

                  {subSkills.length >
                    0 && (

                    <div className="ml-4 mt-2 space-y-1">

                      {subSkills.map(
                        (
                          subSkill,
                          subIndex,
                        ) => (

                          <div
                            key={`${subSkill}-${subIndex}`}
                            className="flex items-start text-white/50"
                          >

                            <span className="mr-2 text-cyan-400/60">
                              ↳
                            </span>

                            <span>
                              {subSkill}
                            </span>

                          </div>

                        ),
                      )}

                    </div>

                  )}


                  {/* ======================================== */}
                  {/* EVIDENCE */}
                  {/* ======================================== */}

                  {evidence && (

                    <p className="ml-4 mt-2 text-[10px] leading-4 text-white/30">
                      Evidence: {evidence}
                    </p>

                  )}

                </li>

              );

            },
          )}

        </ul>

      ) : (

        <p className="mt-3 text-xs text-white/30">
          Nothing detected.
        </p>

      )}

    </div>
  );
}