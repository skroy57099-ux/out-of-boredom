// components/BorePlay/ResumeAnalyzer/jd/jd-parser.ts

import type {
  ParsedJobDescription,
  JDParserResult,
} from "./types";


// ============================================================
// SECTION TYPES
// ============================================================

type JDSection =
  | "requiredSkills"
  | "preferredSkills"
  | "responsibilities"
  | "qualifications"
  | "educationRequirements"
  | "experienceRequirements"
  | "unknown";


// ============================================================
// HEADING PATTERNS
// ============================================================

const SECTION_PATTERNS: Record<
  Exclude<JDSection, "unknown">,
  RegExp[]
> = {

  requiredSkills: [
    /^required skills?$/i,
    /^required qualifications?$/i,
    /^minimum qualifications?$/i,
    /^must[- ]have$/i,
    /^must have skills?$/i,
    /^core requirements?$/i,
    /^essential skills?$/i,
    /^technical requirements?$/i,
    /^what you(?:'|’)ll need$/i,
    /^what you need$/i,
  ],

  preferredSkills: [
    /^preferred skills?$/i,
    /^preferred qualifications?$/i,
    /^desired skills?$/i,
    /^desired qualifications?$/i,
    /^nice[- ]to[- ]have$/i,
    /^good[- ]to[- ]have$/i,
    /^additional skills?$/i,
    /^bonus skills?$/i,
    /^what(?:'|’)s preferred$/i,
  ],

  responsibilities: [
    /^responsibilities$/i,
    /^key responsibilities$/i,
    /^job responsibilities$/i,
    /^role responsibilities$/i,
    /^duties$/i,
    /^key duties$/i,
    /^what you(?:'|’)ll do$/i,
    /^what you will do$/i,
    /^your responsibilities$/i,
  ],

  qualifications: [
    /^qualifications$/i,
    /^general qualifications$/i,
    /^candidate qualifications$/i,
    /^requirements$/i,
    /^requirements and qualifications$/i,
  ],

  educationRequirements: [
    /^education$/i,
    /^educational requirements?$/i,
    /^education requirements?$/i,
    /^academic qualifications?$/i,
    /^degree requirements?$/i,
  ],

  experienceRequirements: [
    /^experience$/i,
    /^experience requirements?$/i,
    /^professional experience$/i,
    /^work experience$/i,
    /^years of experience$/i,
  ],
};


// ============================================================
// NORMALIZE TEXT
// ============================================================

function normalizeLine(
  line: string,
): string {

  return line
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


// ============================================================
// REMOVE BULLET MARKERS
// ============================================================

function removeBulletMarker(
  line: string,
): string {

  return line
    .replace(
      /^\s*(?:[-•●▪◦*▸►‣])\s*/,
      "",
    )
    .replace(
      /^\s*\d+[.)]\s*/,
      "",
    )
    .trim();
}


// ============================================================
// DETECT SECTION
// ============================================================

function detectSection(
  line: string,
): JDSection {

  const normalized =
    normalizeLine(line)
      .replace(
        /[:：]\s*$/,
        "",
      )
      .trim();


  if (!normalized) {
    return "unknown";
  }


  for (
    const [
      section,
      patterns,
    ]
    of Object.entries(
      SECTION_PATTERNS,
    )
  ) {

    if (
      patterns.some(
        (
          pattern,
        ) =>
          pattern.test(
            normalized,
          ),
      )
    ) {

      return section as JDSection;
    }
  }


  return "unknown";
}


// ============================================================
// SPLIT INLINE LISTS
// ============================================================
//
// Used only when a line clearly looks like a list.
//
// We deliberately DON'T blindly split every comma.
// Human beings enjoy writing commas inside phrases.
// Apparently we must account for this.
// ============================================================

function splitInlineList(
  text: string,
): string[] {

  const cleaned =
    removeBulletMarker(
      normalizeLine(text),
    );


  if (!cleaned) {
    return [];
  }


  // Semicolon-separated lists are usually safe.
  if (
    cleaned.includes(";")
  ) {

    return cleaned
      .split(";")
      .map(
        (
          item,
        ) =>
          item.trim(),
      )
      .filter(
        Boolean,
      );
  }


  // Pipe-separated lists.
  if (
    cleaned.includes("|")
  ) {

    return cleaned
      .split("|")
      .map(
        (
          item,
        ) =>
          item.trim(),
      )
      .filter(
        Boolean,
      );
  }


  return [
    cleaned,
  ];
}


// ============================================================
// CLEAN ARRAY
// ============================================================

function cleanArray(
  values: string[],
): string[] {

  const seen =
    new Set<string>();


  return values
    .map(
      (
        value,
      ) =>
        removeBulletMarker(
          normalizeLine(value),
        ),
    )
    .filter(
      (
        value,
      ) =>
        value.length > 0,
    )
    .filter(
      (
        value,
      ) => {

        const key =
          value.toLowerCase();

        if (
          seen.has(key)
        ) {
          return false;
        }

        seen.add(key);

        return true;
      },
    );
}


// ============================================================
// EXTRACT BULLET / LIST CONTENT
// ============================================================

function extractListItems(
  lines: string[],
): string[] {

  const items: string[] = [];


  for (
    const line of lines
  ) {

    const normalized =
      normalizeLine(
        line,
      );


    if (!normalized) {
      continue;
    }


    // --------------------------------------------------------
    // Explicit bullet
    // --------------------------------------------------------

    if (
      /^\s*(?:[-•●▪◦*▸►‣])\s+/.test(
        line,
      )
    ) {

      items.push(
        removeBulletMarker(
          normalized,
        ),
      );

      continue;
    }


    // --------------------------------------------------------
    // Numbered item
    // --------------------------------------------------------

    if (
      /^\s*\d+[.)]\s+/.test(
        line,
      )
    ) {

      items.push(
        removeBulletMarker(
          normalized,
        ),
      );

      continue;
    }


    // --------------------------------------------------------
    // Plain line
    // --------------------------------------------------------

    items.push(
      normalized,
    );
  }


  return cleanArray(
    items,
  );
}


// ============================================================
// EXTRACT BASIC JOB TITLE
// ============================================================

function extractJobTitle(
  lines: string[],
): string | null {

  // Look for an explicit Job Title label first.

  for (
    let index = 0;
    index < lines.length;
    index++
  ) {

    const line =
      normalizeLine(
        lines[index],
      );


    const match =
      line.match(
        /^(?:job\s*title|position|role)\s*[:：]\s*(.+)$/i,
      );


    if (
      match
    ) {

      return match[1].trim();
    }
  }


  return null;
}


// ============================================================
// EXTRACT COMPANY
// ============================================================

function extractCompany(
  lines: string[],
): string | null {

  for (
    let index = 0;
    index < lines.length;
    index++
  ) {

    const line =
      normalizeLine(
        lines[index],
      );


    const match =
      line.match(
        /^(?:company|employer|organization)\s*[:：]\s*(.+)$/i,
      );


    if (
      match
    ) {

      return match[1].trim();
    }
  }


  return null;
}


// ============================================================
// EXTRACT EXPERIENCE REQUIREMENTS
// ============================================================

function extractExperienceRequirements(
  lines: string[],
): string[] {

  const results: string[] = [];


  for (
    const line of lines
  ) {

    const normalized =
      normalizeLine(
        line,
      );


    if (
      /\b\d+\+?\s*(?:years?|yrs?)\b/i.test(
        normalized,
      )
    ) {

      results.push(
        removeBulletMarker(
          normalized,
        ),
      );
    }
  }


  return cleanArray(
    results,
  );
}


// ============================================================
// EXTRACT EDUCATION REQUIREMENTS
// ============================================================

function extractEducationRequirements(
  lines: string[],
): string[] {

  const results: string[] = [];


  const educationPattern =
    /\b(?:bachelor'?s?|master'?s?|ph\.?d\.?|doctorate|degree|diploma|b\.?tech|m\.?tech|b\.?sc|m\.?sc|mba|bca|mca)\b/i;


  for (
    const line of lines
  ) {

    const normalized =
      normalizeLine(
        line,
      );


    if (
      educationPattern.test(
        normalized,
      )
    ) {

      results.push(
        removeBulletMarker(
          normalized,
        ),
      );
    }
  }


  return cleanArray(
    results,
  );
}


// ============================================================
// PARSE JD
// ============================================================

export function parseJobDescription(
  rawText: string,
): JDParserResult {

  const cleanedText =
    rawText
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .trim();


  if (!cleanedText) {

    return {
      jobDescription: {
        title: null,
        company: null,
        requiredSkills: [],
        preferredSkills: [],
        responsibilities: [],
        qualifications: [],
        educationRequirements: [],
        experienceRequirements: [],
        rawText: "",
      },

      confidence: 0,

      warnings: [
        "Job description is empty.",
      ],
    };
  }


  const lines =
    cleanedText
      .split("\n")
      .map(
        normalizeLine,
      );


  // ==========================================================
  // SECTION BUCKETS
  // ==========================================================

  const sections: Record<
    JDSection,
    string[]
  > = {

    requiredSkills: [],

    preferredSkills: [],

    responsibilities: [],

    qualifications: [],

    educationRequirements: [],

    experienceRequirements: [],

    unknown: [],
  };


  let currentSection:
    JDSection =
      "unknown";


  // ==========================================================
  // PROCESS LINES
  // ==========================================================

  for (
    const line of lines
  ) {

    if (!line) {
      continue;
    }


    const detected =
      detectSection(
        line,
      );


    // --------------------------------------------------------
    // Section heading found
    // --------------------------------------------------------

    if (
      detected !==
      "unknown"
    ) {

      currentSection =
        detected;

      continue;
    }


    // --------------------------------------------------------
    // Store under current section
    // --------------------------------------------------------

    sections[
      currentSection
    ].push(
      line,
    );
  }


  // ==========================================================
  // REQUIRED SKILLS
  // ==========================================================

  const requiredSkills =
    extractListItems(
      sections.requiredSkills,
    )
      .flatMap(
        (
          item,
        ) =>
          splitInlineList(
            item,
          ),
      );


  // ==========================================================
  // PREFERRED SKILLS
  // ==========================================================

  const preferredSkills =
    extractListItems(
      sections.preferredSkills,
    )
      .flatMap(
        (
          item,
        ) =>
          splitInlineList(
            item,
          ),
      );


  // ==========================================================
  // RESPONSIBILITIES
  // ==========================================================

  const responsibilities =
    extractListItems(
      sections.responsibilities,
    );


  // ==========================================================
  // QUALIFICATIONS
  // ==========================================================

  const qualifications =
    extractListItems(
      sections.qualifications,
    );


  // ==========================================================
  // EXPERIENCE
  // ==========================================================

  const experienceRequirements =
    cleanArray([
      ...extractListItems(
        sections.experienceRequirements,
      ),

      ...extractExperienceRequirements(
        lines,
      ),
    ]);


  // ==========================================================
  // EDUCATION
  // ==========================================================

  const educationRequirements =
    cleanArray([
      ...extractListItems(
        sections.educationRequirements,
      ),

      ...extractEducationRequirements(
        lines,
      ),
    ]);


  // ==========================================================
  // BASIC INFORMATION
  // ==========================================================

  const title =
    extractJobTitle(
      lines,
    );


  const company =
    extractCompany(
      lines,
    );


  // ==========================================================
  // CONFIDENCE
  // ==========================================================

  let confidence =
    0.4;


  if (
    requiredSkills.length >
    0
  ) {

    confidence +=
      0.15;
  }


  if (
    preferredSkills.length >
    0
  ) {

    confidence +=
      0.1;
  }


  if (
    responsibilities.length >
    0
  ) {

    confidence +=
      0.1;
  }


  if (
    qualifications.length >
    0
  ) {

    confidence +=
      0.1;
  }


  if (
    title
  ) {

    confidence +=
      0.05;
  }


  confidence =
    Math.min(
      confidence,
      1,
    );


  // ==========================================================
  // WARNINGS
  // ==========================================================

  const warnings:
    string[] = [];


  if (
    requiredSkills.length ===
    0
  ) {

    warnings.push(
      "No explicit required-skills section was detected.",
    );
  }


  if (
    responsibilities.length ===
    0
  ) {

    warnings.push(
      "No responsibilities section was detected.",
    );
  }


  if (
    !title
  ) {

    warnings.push(
      "Job title was not explicitly detected.",
    );
  }


  // ==========================================================
  // RESULT
  // ==========================================================

  const jobDescription:
    ParsedJobDescription = {

      title,

      company,

      requiredSkills:
        cleanArray(
          requiredSkills,
        ),

      preferredSkills:
        cleanArray(
          preferredSkills,
        ),

      responsibilities:
        cleanArray(
          responsibilities,
        ),

      qualifications:
        cleanArray(
          qualifications,
        ),

      educationRequirements:
        cleanArray(
          educationRequirements,
        ),

      experienceRequirements:
        cleanArray(
          experienceRequirements,
        ),

      rawText:
        cleanedText,
    };


  return {

    jobDescription,

    confidence,

    warnings,
  };
}