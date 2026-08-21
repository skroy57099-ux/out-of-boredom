// components/BorePlay/ResumeAnalyzer/jd/jd-llm-parser.ts

// ============================================================
// JD LLM PARSER
// ============================================================
//
// Primary:
//   Gemini
//
// Fallback:
//   Mistral
//
// IMPORTANT:
// This file does NOT touch the resume parsing pipeline.
// ============================================================


// ============================================================
// TYPES
// ============================================================

export interface JDExtractedItem {

  value: string;

  confidence: number;

  evidence: string;
}


export interface JDCoreSkill {

  skill: string;

  subSkills: string[];

  /**
   * Technologies or capabilities that can reasonably
   * demonstrate or satisfy the core skill.
   *
   * Example:
   *
   * SQL
   * ├── PostgreSQL
   * ├── BigQuery
   * └── Databricks SQL
   */

  acceptableEvidence: string[];

  confidence: number;

  evidence: string;
}


export interface LLMParsedJobDescription {

  title: string | null;

  company: string | null;

  requiredSkills: JDCoreSkill[];

  preferredSkills: JDCoreSkill[];

  responsibilities: JDExtractedItem[];

  qualifications: JDExtractedItem[];

  educationRequirements: JDExtractedItem[];

  experienceRequirements: JDExtractedItem[];

  otherRelevantInfo: JDExtractedItem[];
}


export interface LLMJDParserResult {

  jobDescription:
    LLMParsedJobDescription;

  provider:
    | "gemini"
    | "mistral";

  model: string;

  warnings: string[];
}


// ============================================================
// PROMPT
// ============================================================

const JD_SYSTEM_PROMPT = `
You are a Job Description Understanding Engine.

Your task is to understand the semantic meaning of a job
description and convert it into structured JSON.

IMPORTANT:

Do NOT rely on exact section headings.

Job descriptions may use:

- arbitrary headings
- no headings
- paragraphs
- bullet points
- numbered lists
- tables
- mixed formatting
- emojis
- company-specific terminology

Determine the semantic role of each statement from its meaning.

Examples of headings that MAY represent required qualifications:

- Required Skills
- Required Skills & Qualifications
- What You'll Bring
- What You Should Have
- Core Competencies
- Essential Qualifications
- Must Have
- Candidate Requirements
- The Ideal Candidate
- Technical Skills
- Analytical Skills

Examples of headings that MAY represent preferred qualifications:

- Preferred Skills
- Preferred / Optional Skills
- Nice to Have
- Good to Have
- Bonus
- Desirable
- Preferred Qualifications

Examples of headings that MAY represent responsibilities:

- Responsibilities
- Roles & Responsibilities
- What You'll Do
- Duties
- Key Responsibilities
- Your Responsibilities
- Day-to-Day
- Your Impact

These are examples only.

DO NOT depend on these exact labels.


============================================================
EXTRACTION CATEGORIES
============================================================

Extract:

1. requiredSkills

Technologies, programming languages, tools, platforms,
frameworks, analytical methods, domain-specific capabilities,
or other concrete skills that the candidate is expected to
have.

Only classify something as required when the JD indicates
that it is required, expected, essential, mandatory, or clearly
part of the core candidate requirements.


2. preferredSkills

Technologies, tools, platforms, methods, or capabilities
described as preferred, desirable, optional, bonus,
nice-to-have, or otherwise advantageous but not mandatory.


3. responsibilities

Tasks, duties, activities, deliverables, or outcomes that
the candidate is expected to perform.


4. qualifications

Explicit requirements concerning:

- years of experience
- degrees
- professional background
- industry experience
- domain experience
- certifications
- eligibility requirements


5. educationRequirements

Explicit educational requirements.


6. experienceRequirements

Explicit experience requirements.


7. otherRelevantInfo

Important job-related information that does not fit the
categories above and may materially affect candidate
eligibility or job matching.


============================================================
SKILL HIERARCHY
============================================================

Do NOT automatically treat every technical term as an
independent top-level skill.

Identify the primary/core skill and place closely related
tools, features, techniques, or capabilities underneath it
as sub-skills.

Example:

"Strong knowledge of Excel (Pivot Tables, XLOOKUP,
INDEX/MATCH)"

Correct:

{
  "skill": "Excel",
  "subSkills": [
    "Pivot Tables",
    "XLOOKUP",
    "INDEX/MATCH"
  ]
}

NOT:

[
  "Excel",
  "Pivot Tables",
  "XLOOKUP",
  "INDEX/MATCH"
]


Another example:

"Power BI (Dashboards, DAX, Data Models)"

Correct:

{
  "skill": "Power BI",
  "subSkills": [
    "Dashboards",
    "DAX",
    "Data Models"
  ]
}


Another example:

"Python with Pandas, NumPy and Scikit-learn"

Correct:

{
  "skill": "Python",
  "subSkills": [
    "Pandas",
    "NumPy",
    "Scikit-learn"
  ]
}


However, do NOT force unrelated technologies into a parent
skill.

Example:

"Python and SQL"

Correct:

[
  {
    "skill": "Python",
    "subSkills": []
  },
  {
    "skill": "SQL",
    "subSkills": []
  }
]


Use a hierarchy only when the JD clearly presents the
secondary items as capabilities, features, libraries,
frameworks, techniques, or components of the primary skill.


============================================================
ACCEPTABLE EVIDENCE
============================================================

For every core skill, identify technologies or concrete
capabilities that would reasonably demonstrate or satisfy
that core skill.

Return these under:

"acceptableEvidence"

This relationship is directional.

Example:

JD core skill:

SQL

acceptableEvidence:

[
  "PostgreSQL",
  "MySQL",
  "BigQuery",
  "Databricks SQL"
]


This means:

PostgreSQL → acceptable evidence for SQL

BigQuery → acceptable evidence for SQL

Databricks SQL → acceptable evidence for SQL


But the reverse is NOT valid:

SQL → PostgreSQL


Do NOT claim that generic SQL experience proves PostgreSQL
experience.


Another example:

JD core skill:

Excel

acceptableEvidence:

[
  "Microsoft Excel",
  "MS Excel"
]


Sub-skills such as:

- Pivot Tables
- XLOOKUP
- INDEX/MATCH

should remain sub-skills and should NOT automatically be
copied into acceptableEvidence.


Another example:

JD core skill:

Power BI

acceptableEvidence:

[
  "Microsoft Power BI",
  "Power BI Desktop"
]


Sub-skills such as:

- DAX
- Power Query
- Data Models

should remain sub-skills.


IMPORTANT:

Only include acceptable evidence that is technically and
semantically reasonable.

Do NOT create broad or speculative relationships.

Do NOT include unrelated technologies merely because they
are commonly used together.

Do NOT force an acceptableEvidence value when no meaningful
relationship exists.

If no valid acceptable evidence exists, return:

"acceptableEvidence": []


The acceptableEvidence relationship must be directional.

A specific technology can demonstrate a broader capability
when technically valid.

A broader capability does NOT automatically demonstrate a
specific technology.


============================================================
SKILL GRANULARITY
============================================================

Normalize version-specific skills to the general technology.

Examples:

"Python 3.8+" → "Python"

"Power BI Desktop" → "Power BI"

"Microsoft Excel" → "Excel"

Do not create separate core skills for minor variations
of the same technology.

Do not duplicate a sub-skill as a separate core skill when
it clearly belongs to a parent technology.


============================================================
CONTRADICTIONS
============================================================

If the same capability appears as both required and preferred,
classify it as REQUIRED.

If the JD contains contradictory requirements:

- preserve the information
- do not resolve the contradiction by guessing
- reduce confidence
- include supporting evidence


============================================================
NO FABRICATION
============================================================

Do not invent:

- skills
- technologies
- responsibilities
- qualifications
- years of experience
- degrees
- certifications
- company information
- job title
- acceptable evidence

Extract only information explicitly supported by the JD.

Do not infer that a candidate must know a technology merely
because it is commonly associated with the job.

For acceptableEvidence, only include technically valid
relationships. Do not create relationships just to populate
the field.


============================================================
NOISE
============================================================

Ignore:

- salary
- compensation
- benefits
- hiring timeline
- application instructions
- generic company marketing
- generic company culture
- office location

unless directly relevant to eligibility or job matching.


============================================================
CONFIDENCE
============================================================

For every extracted item provide confidence from 0 to 1.

Use approximately:

0.90 - 1.00
Clearly and explicitly stated.

0.75 - 0.89
Strongly supported by wording or context.

0.60 - 0.74
Reasonably supported but somewhat ambiguous.

Below 0.60
Weak or ambiguous interpretation.

Confidence must represent how clearly the JD supports the
extraction.


============================================================
EVIDENCE
============================================================

For every extracted item provide a short exact quote from
the JD supporting the extraction.

Do not invent evidence.


============================================================
JOB TITLE
============================================================

Extract the actual role being hired for.

Do not assume the job title from:

- the company name
- a campaign name
- a hiring event name
- an unrelated heading


============================================================
COMPANY
============================================================

Extract the company only when explicitly supported by the JD.

Do not guess the company from context.


============================================================
OUTPUT
============================================================

Return ONLY valid JSON.

Use exactly this structure:

{
  "title": null,
  "company": null,

  "requiredSkills": [
    {
      "skill": "Power BI",
      "subSkills": [
        "Dashboards",
        "DAX",
        "Data Models"
      ],
      "acceptableEvidence": [
        "Microsoft Power BI",
        "Power BI Desktop"
      ],
      "confidence": 0.98,
      "evidence": "Intermediate proficiency in Power BI (Dashboards, DAX, Data Models)"
    }
  ],

  "preferredSkills": [],

  "responsibilities": [],

  "qualifications": [],

  "educationRequirements": [],

  "experienceRequirements": [],

  "otherRelevantInfo": []
}

Rules:

- title must be string or null
- company must be string or null
- every category must always be an array
- requiredSkills and preferredSkills use skill objects
- every non-skill extracted item must contain value, confidence and evidence
- every skill item must contain skill, subSkills, acceptableEvidence, confidence and evidence
- acceptableEvidence must always be an array
- confidence must be between 0 and 1
- evidence must come directly from the JD
- never return undefined
- never return Markdown
- never return explanatory text outside JSON
- never invent information
`;


// ============================================================
// HELPERS
// ============================================================

function normalizeConfidence(
  value: unknown,
): number {

  const numeric =
    typeof value === "number"
      ? value
      : Number(value);

  if (
    !Number.isFinite(numeric)
  ) {
    return 0;
  }

  return Math.min(
    1,
    Math.max(
      0,
      numeric,
    ),
  );
}


// ============================================================
// NORMALIZE REGULAR ITEMS
// ============================================================

function normalizeItem(
  item: unknown,
): JDExtractedItem | null {

  if (
    typeof item !== "object" ||
    item === null
  ) {
    return null;
  }

  const record =
    item as Record<
      string,
      unknown
    >;

  const value =
    typeof record.value === "string"
      ? record.value.trim()
      : "";

  const evidence =
    typeof record.evidence === "string"
      ? record.evidence.trim()
      : "";

  if (!value) {
    return null;
  }

  return {

    value,

    confidence:
      normalizeConfidence(
        record.confidence,
      ),

    evidence,
  };
}


// ============================================================
// NORMALIZE REGULAR ITEM ARRAYS
// ============================================================

function normalizeItems(
  value: unknown,
): JDExtractedItem[] {

  if (!Array.isArray(value)) {
    return [];
  }

  const seen =
    new Set<string>();

  const result:
    JDExtractedItem[] = [];

  for (
    const item of value
  ) {

    const normalized =
      normalizeItem(
        item,
      );

    if (!normalized) {
      continue;
    }

    const key =
      normalized.value
        .toLowerCase()
        .replace(
          /\s+/g,
          " ",
        )
        .trim();

    if (
      seen.has(key)
    ) {
      continue;
    }

    seen.add(key);

    result.push(
      normalized,
    );
  }

  return result;
}


// ============================================================
// NORMALIZE CORE SKILL
// ============================================================

function normalizeCoreSkill(
  item: unknown,
): JDCoreSkill | null {

  if (
    typeof item !== "object" ||
    item === null
  ) {
    return null;
  }

  const record =
    item as Record<
      string,
      unknown
    >;


  // ----------------------------------------------------------
  // CORE SKILL
  // ----------------------------------------------------------

  const skill =
    typeof record.skill === "string"
      ? record.skill.trim()
      : "";

  if (!skill) {
    return null;
  }


  // ----------------------------------------------------------
  // SUB-SKILLS
  // ----------------------------------------------------------

  const rawSubSkills =
    Array.isArray(
      record.subSkills,
    )
      ? record.subSkills
      : [];

  const subSkills:
    string[] = [];

  for (
    const subSkill of
    rawSubSkills
  ) {

    if (
      typeof subSkill !==
      "string"
    ) {
      continue;
    }

    const cleaned =
      subSkill.trim();

    if (!cleaned) {
      continue;
    }

    subSkills.push(
      cleaned,
    );
  }


  const uniqueSubSkills =
    [
      ...new Map(
        subSkills.map(
          (
            subSkill,
          ) => [

            subSkill
              .toLowerCase()
              .replace(
                /\s+/g,
                " ",
              )
              .trim(),

            subSkill,

          ],
        ),
      ).values(),
    ];


  // ----------------------------------------------------------
  // ACCEPTABLE EVIDENCE
  // ----------------------------------------------------------

  const rawAcceptableEvidence =
    Array.isArray(
      record.acceptableEvidence,
    )
      ? record.acceptableEvidence
      : [];

  const acceptableEvidence:
    string[] = [];

  for (
    const item of
    rawAcceptableEvidence
  ) {

    if (
      typeof item !==
      "string"
    ) {
      continue;
    }

    const cleaned =
      item.trim();

    if (!cleaned) {
      continue;
    }

    acceptableEvidence.push(
      cleaned,
    );
  }


  const uniqueAcceptableEvidence =
    [
      ...new Map(
        acceptableEvidence.map(
          (
            item,
          ) => [

            item
              .toLowerCase()
              .replace(
                /\s+/g,
                " ",
              )
              .trim(),

            item,

          ],
        ),
      ).values(),
    ];


  // ----------------------------------------------------------
  // EVIDENCE
  // ----------------------------------------------------------

  const evidence =
    typeof record.evidence ===
    "string"
      ? record.evidence.trim()
      : "";


  // ----------------------------------------------------------
  // RETURN
  // ----------------------------------------------------------

  return {

    skill,

    subSkills:
      uniqueSubSkills,

    acceptableEvidence:
      uniqueAcceptableEvidence,

    confidence:
      normalizeConfidence(
        record.confidence,
      ),

    evidence,
  };
}


// ============================================================
// NORMALIZE CORE SKILL ARRAYS
// ============================================================

function normalizeCoreSkills(
  value: unknown,
): JDCoreSkill[] {

  if (!Array.isArray(value)) {
    return [];
  }

  const seen =
    new Set<string>();

  const result:
    JDCoreSkill[] = [];

  for (
    const item of value
  ) {

    const normalized =
      normalizeCoreSkill(
        item,
      );

    if (!normalized) {
      continue;
    }

    const key =
      normalized.skill
        .toLowerCase()
        .replace(
          /\s+/g,
          " ",
        )
        .trim();

    if (
      seen.has(key)
    ) {
      continue;
    }

    seen.add(key);

    result.push(
      normalized,
    );
  }

  return result;
}


// ============================================================
// NORMALIZE COMPLETE RESULT
// ============================================================

function normalizeResult(
  raw: unknown,
): LLMParsedJobDescription {

  const data =
    typeof raw === "object" &&
    raw !== null
      ? raw as Record<
          string,
          unknown
        >
      : {};

  return {

    title:
      typeof data.title ===
      "string"
        ? data.title.trim()
        : null,

    company:
      typeof data.company ===
      "string"
        ? data.company.trim()
        : null,

    requiredSkills:
      normalizeCoreSkills(
        data.requiredSkills,
      ),

    preferredSkills:
      normalizeCoreSkills(
        data.preferredSkills,
      ),

    responsibilities:
      normalizeItems(
        data.responsibilities,
      ),

    qualifications:
      normalizeItems(
        data.qualifications,
      ),

    educationRequirements:
      normalizeItems(
        data.educationRequirements,
      ),

    experienceRequirements:
      normalizeItems(
        data.experienceRequirements,
      ),

    otherRelevantInfo:
      normalizeItems(
        data.otherRelevantInfo,
      ),
  };
}


// ============================================================
// JSON EXTRACTION
// ============================================================

function extractJson(
  text: string,
): unknown {

  const cleaned =
    text
      .trim()
      .replace(
        /^```json\s*/i,
        "",
      )
      .replace(
        /^```\s*/i,
        "",
      )
      .replace(
        /\s*```$/i,
        "",
      )
      .trim();


  try {

    return JSON.parse(
      cleaned,
    );

  } catch {
    // Continue below.
  }


  const firstBrace =
    cleaned.indexOf(
      "{",
    );

  const lastBrace =
    cleaned.lastIndexOf(
      "}",
    );


  if (
    firstBrace === -1 ||
    lastBrace === -1 ||
    lastBrace <= firstBrace
  ) {

    throw new Error(
      "LLM did not return valid JSON.",
    );
  }


  return JSON.parse(
    cleaned.slice(
      firstBrace,
      lastBrace + 1,
    ),
  );
}


// ============================================================
// GEMINI
// ============================================================

async function parseWithGemini(
  text: string,
): Promise<LLMJDParserResult> {

  const apiKey =
    process.env.GEMINI_API_KEY;


  if (!apiKey) {

    throw new Error(
      "GEMINI_API_KEY is not configured.",
    );
  }


  const model =
    process.env.GEMINI_JD_MODEL ||
    "gemini-3.6-flash";


  const response =
    await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method:
          "POST",

        headers: {

          "Content-Type":
            "application/json",

          "x-goog-api-key":
            apiKey,

        },

        body:
          JSON.stringify({

            systemInstruction: {

              parts: [

                {
                  text:
                    JD_SYSTEM_PROMPT,
                },

              ],

            },

            contents: [

              {

                role:
                  "user",

                parts: [

                  {
                    text:
                      `Analyze the following job description:\n\n${text}`,
                  },

                ],

              },

            ],

            generationConfig: {

              temperature:
                0,

              responseMimeType:
                "application/json",

            },

          }),
      },
    );


  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      `Gemini JD parser ${response.status}: ${errorText}`,
    );
  }


  const data =
    await response.json();


  const responseText =
    data?.candidates?.[0]
      ?.content?.parts
      ?.map(
        (
          part: {
            text?: string;
          },
        ) =>
          part.text ?? "",
      )
      .join("")
      .trim();


  if (!responseText) {

    throw new Error(
      "Gemini returned an empty JD response.",
    );
  }


  const parsed =
    normalizeResult(
      extractJson(
        responseText,
      ),
    );


  return {

    jobDescription:
      parsed,

    provider:
      "gemini",

    model,

    warnings: [],

  };
}


// ============================================================
// MISTRAL
// ============================================================

async function parseWithMistral(
  text: string,
): Promise<LLMJDParserResult> {

  const apiKey =
    process.env.MISTRAL_API_KEY;


  if (!apiKey) {

    throw new Error(
      "MISTRAL_API_KEY is not configured.",
    );
  }


  const model =
    process.env.MISTRAL_JD_MODEL ||
    "mistral-small-latest";


  const response =
    await fetch(
      "https://api.mistral.ai/v1/chat/completions",
      {
        method:
          "POST",

        headers: {

          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${apiKey}`,

        },

        body:
          JSON.stringify({

            model,

            temperature:
              0,

            response_format: {

              type:
                "json_object",

            },

            messages: [

              {

                role:
                  "system",

                content:
                  JD_SYSTEM_PROMPT,

              },

              {

                role:
                  "user",

                content:
                  `Analyze the following job description:\n\n${text}`,

              },

            ],

          }),
      },
    );


  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      `Mistral JD parser ${response.status}: ${errorText}`,
    );
  }


  const data =
    await response.json();


  const content =
    data?.choices?.[0]
      ?.message?.content;


  const responseText =
    typeof content ===
    "string"
      ? content.trim()
      : "";


  if (!responseText) {

    throw new Error(
      "Mistral returned an empty JD response.",
    );
  }


  const parsed =
    normalizeResult(
      extractJson(
        responseText,
      ),
    );


  return {

    jobDescription:
      parsed,

    provider:
      "mistral",

    model,

    warnings: [

      "Gemini failed; Mistral fallback was used.",

    ],

  };
}


// ============================================================
// PUBLIC PARSER
// ============================================================

export async function parseJobDescriptionWithLLM(
  text: string,
): Promise<LLMJDParserResult> {

  try {

    console.log(
      "🧠 Starting Gemini semantic JD parser...",
    );


    const result =
      await parseWithGemini(
        text,
      );


    console.log(
      "✅ Gemini JD parser successful.",
    );


    return result;

  } catch (
    geminiError
  ) {

    console.error(
      "❌ Gemini JD parser failed:",
      geminiError,
    );


    console.log(
      "🔄 Switching to Mistral JD fallback...",
    );


    try {

      const result =
        await parseWithMistral(
          text,
        );


      console.log(
        "✅ Mistral JD fallback successful.",
      );


      return result;

    } catch (
      mistralError
    ) {

      console.error(
        "❌ Mistral JD fallback failed:",
        mistralError,
      );


      throw new Error(
        `Both JD LLM pipelines failed. Gemini: ${
          geminiError instanceof Error
            ? geminiError.message
            : "Unknown Gemini error"
        } | Mistral: ${
          mistralError instanceof Error
            ? mistralError.message
            : "Unknown Mistral error"
        }`,
      );
    }
  }
}