// app/api/resume/parse/route.ts

import { NextResponse } from "next/server";

export const runtime = "nodejs";


// ============================================================
// MODELS
// ============================================================

const GEMINI_MODEL =
  "gemini-3.1-flash-lite-preview";

const MISTRAL_OCR_MODEL =
  "mistral-ocr-latest";

const MISTRAL_CHAT_MODEL =
  "mistral-small-latest";


// ============================================================
// TYPES
// ============================================================

interface ResumeContact {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  linkedin?: string | null;
  github?: string | null;
  portfolio?: string | null;
  [key: string]: unknown;
}


interface ResumeExperience {
  company?: string | null;
  title?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  location?: string | null;
  description?: string | null;
  bullets?: string[];
  [key: string]: unknown;
}


interface ResumeProject {
  title?: string | null;
  description?: string | null;

  technologies?: string[];

  // IMPORTANT:
  // The frontend expects this field.
  bullets?: string[];

  dates?: string | null;

  [key: string]: unknown;
}


interface ResumeEducation {
  institution?: string | null;
  degree?: string | null;
  year?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  grade?: string | null;
  [key: string]: unknown;
}


interface ResumeCertification {
  name?: string | null;
  issuer?: string | null;
  date?: string | null;
  description?: string | null;
  [key: string]: unknown;
}


interface ResumePublication {
  title?: string | null;
  authorship?: string | null;
  venue?: string | null;
  date?: string | null;
  identifier?: string | null;
  [key: string]: unknown;
}


interface AdditionalSection {
  title?: string | null;
  content?: string | null;
  [key: string]: unknown;
}


interface ParsedResume {
  contact: ResumeContact;

  summary: string;

  experience: ResumeExperience[];

  skills: string[];

  projects: ResumeProject[];

  education: ResumeEducation[];

  certifications: ResumeCertification[];

  publications: ResumePublication[];

  additionalSections: AdditionalSection[];

  [key: string]: unknown;
}


// ============================================================
// SHARED EXTRACTION CONTRACT
// ============================================================
//
// IMPORTANT:
//
// Gemini and Mistral BOTH use this exact semantic contract.
//
// Do NOT create separate rules for the two models.
//
// The models may receive different input:
//   Gemini  -> original PDF
//   Mistral -> OCR markdown
//
// But the semantic requirements are identical.
// ============================================================

const RESUME_EXTRACTION_PROMPT = `
You are a resume extraction engine.

Analyze the resume and extract only information that is actually present.

Return ONLY valid JSON.

Use exactly this structure:

{
  "contact": {
    "name": null,
    "email": null,
    "phone": null,
    "location": null,
    "linkedin": null,
    "github": null,
    "portfolio": null
  },

  "summary": "",

  "experience": [],

  "skills": [],

  "projects": [],

  "education": [],

  "certifications": [],

  "publications": [],

  "additionalSections": []
}


============================================================
GENERAL RULES
============================================================

1. Extract only information actually present in the resume.

2. Do not invent information.

3. Do not infer information that is not reasonably represented
   by the resume.

4. Preserve the meaning and wording of the resume as closely
   as possible.

5. Do not duplicate content.

6. Each real entry should appear only once.

7. Respect the resume's section boundaries.

8. Do not move content from one section into another.

9. A heading is not automatically an entry.

10. A bullet point is not automatically a new entry.

11. Dates are attributes of entries, not separate entries.

12. Locations are attributes of entries, not separate entries.

13. Descriptions belong to the entry they describe.

14. If a section does not exist, return an empty array.

15. If content genuinely does not fit any standard section,
    preserve it under additionalSections rather than forcing
    it into an unrelated category.


============================================================
SKILLS
============================================================

Extract the actual skills represented in the Skills section.

Do NOT return category names or subsection headings as skills.

For example, if the resume contains:

"Programming & Databases:
Python, SQL, Pandas"

then return:

[
  "Python",
  "SQL",
  "Pandas"
]

not:

[
  "Programming & Databases"
]

Rules:

- Extract actual skill units.
- Do not return skill-category headings.
- Do not return labels such as "Programming", "Databases",
  "Visualization", "Tools", "Frameworks", etc. when they are
  merely category headings.
- Do not blindly split meaningful compound skills.
- Do not merge unrelated skills into one string.
- Preserve meaningful skill names as they appear.
- If a category contains multiple actual skills, extract the
  individual skills represented under that category.
- Do not create skills from arbitrary words in project
  descriptions or experience descriptions.
- Prefer the explicit Skills section when one exists.
- Do not treat a section heading as a skill.


============================================================
PROJECTS
============================================================

Identify each logical project as ONE project entry.

Each project must use this structure:

{
  "title": null,
  "description": null,
  "technologies": [],
  "bullets": [],
  "dates": null
}

Rules:

- One logical project = one project object.
- Do not create a new project from a bullet point.
- Do not create a new project from a project description.
- Do not merge separate projects.
- Keep project content together.
- The title must contain only the project title.
- Do not put description text into the title.
- Technologies must contain technologies/tools associated
  with that project.
- Do not put descriptions into technologies.
- If the project has explicit bullet points, preserve each
  bullet as a separate item in "bullets".
- If the project is written as a paragraph rather than bullets,
  preserve that paragraph as "description".
- Do not copy the description into "bullets".
- Do not copy bullets into "description".
- Do not create duplicate project content.
- Do not move project content into additionalSections.


============================================================
EXPERIENCE
============================================================

Each actual employment, internship, training, contract,
or freelance role should be one experience entry.

Use:

{
  "company": null,
  "title": null,
  "startDate": null,
  "endDate": null,
  "location": null,
  "description": null,
  "bullets": []
}

Rules:

- One real role = one experience entry.
- Keep company, title, dates, location, description and
  bullets together.
- Do not create a separate entry from an individual bullet.
- Do not create a separate entry from a date.
- Training or internship should remain experience when the
  resume presents it as professional/training work.
- Do not classify a certification as experience merely because
  it contains a date.


============================================================
EDUCATION
============================================================

Each real educational entry should be one education object.

Use:

{
  "institution": null,
  "degree": null,
  "year": null,
  "startDate": null,
  "endDate": null,
  "grade": null
}

Rules:

- Institution, degree, field, dates and grade belong together.
- GPA, CGPA, percentage, marks or academic grade belongs in
  the grade field.
- Do not create an additional section merely for GPA/CGPA.
- Do not treat GPA/CGPA as a separate entry.


============================================================
CERTIFICATIONS
============================================================

Each actual certification should be one certification entry.

Use:

{
  "name": null,
  "issuer": null,
  "date": null,
  "description": null
}

Rules:

- Certification name, issuer and date belong together.
- Do not classify certifications as experience.
- Do not classify certification names as skills unless the
  resume explicitly presents them as skills in its Skills section.


============================================================
PUBLICATIONS
============================================================

Extract publications only when they are actually present.

Use:

{
  "title": null,
  "authorship": null,
  "venue": null,
  "date": null,
  "identifier": null
}

Preserve DOI or other publication identifiers when present.


============================================================
ADDITIONAL SECTIONS
============================================================

Use additionalSections only when the resume contains a genuine
section that does not fit:

- contact
- summary
- experience
- skills
- projects
- education
- certifications
- publications

Do NOT use additionalSections for:

- skills
- project content
- project bullets
- education grades
- dates
- locations
- certification information

Do not create an Additional Information section simply because
a field is unusual.

If the content clearly belongs to an existing standard section,
keep it there.


============================================================
OUTPUT
============================================================

Return ONLY the JSON object.

No markdown.

No explanation.

No commentary.
`.trim();


// ============================================================
// NORMALIZE STRING
// ============================================================

function normalizeString(
  value: unknown,
): string {

  if (
    typeof value !== "string"
  ) {
    return "";
  }

  return value
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}


// ============================================================
// DEDUPLICATE ARRAY
// ============================================================

function deduplicateArray<T>(
  items: T[],
  keyFn: (
    item: T,
  ) => string,
): T[] {

  const seen =
    new Set<string>();

  return items.filter(
    (
      item,
    ) => {

      const key =
        normalizeString(
          keyFn(item),
        );

      if (!key) {
        return true;
      }

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
// DEDUPLICATE SKILLS
// ============================================================

function deduplicateSkills(
  skills: unknown,
): string[] {

  if (
    !Array.isArray(
      skills,
    )
  ) {
    return [];
  }

  const cleaned =
    skills
      .filter(
        (
          skill,
        ): skill is string =>
          typeof skill ===
          "string",
      )
      .map(
        (
          skill,
        ) =>
          skill
            .replace(
              /\s+/g,
              " ",
            )
            .trim(),
      )
      .filter(
        (
          skill,
        ) =>
          skill.length > 0,
      );

  const seen =
    new Set<string>();

  return cleaned.filter(
    (
      skill,
    ) => {

      const key =
        skill.toLowerCase();

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
// DEDUPLICATE RESUME
// ============================================================
//
// This is intentionally conservative.
//
// It removes obvious duplicate entries.
//
// It does NOT attempt to merge similar entries.
//
// That distinction matters.
// ============================================================

function deduplicateResume(
  rawResume: unknown,
): ParsedResume {

  const resume =
    (
      rawResume &&
      typeof rawResume ===
        "object"
    )
      ? rawResume as Record<
          string,
          unknown
        >
      : {};


  const experience =
    Array.isArray(
      resume.experience,
    )
      ? resume.experience as ResumeExperience[]
      : [];


  const projects =
    Array.isArray(
      resume.projects,
    )
      ? resume.projects as ResumeProject[]
      : [];


  const education =
    Array.isArray(
      resume.education,
    )
      ? resume.education as ResumeEducation[]
      : [];


  const certifications =
    Array.isArray(
      resume.certifications,
    )
      ? resume.certifications as ResumeCertification[]
      : [];


  const publications =
    Array.isArray(
      resume.publications,
    )
      ? resume.publications as ResumePublication[]
      : [];


  const additionalSections =
    Array.isArray(
      resume.additionalSections,
    )
      ? resume.additionalSections as AdditionalSection[]
      : [];


  // ==========================================================
  // NORMALIZE PROJECT BULLETS
  // ==========================================================

  const normalizedProjects =
    projects.map(
      (
        project,
      ) => {

        const bullets =
          Array.isArray(
            project.bullets,
          )
            ? project.bullets
            : [];

        return {
          ...project,

          description:
            typeof project.description ===
              "string"
              ? project.description.trim()
              : project.description ?? null,

          technologies:
            Array.isArray(
              project.technologies,
            )
              ? project.technologies
              : [],

          bullets:
            bullets
              .filter(
                (
                  bullet,
                ): bullet is string =>
                  typeof bullet ===
                  "string",
              )
              .map(
                (
                  bullet,
                ) =>
                  bullet
                    .replace(
                      /\s+/g,
                      " ",
                    )
                    .trim(),
              )
              .filter(
                (
                  bullet,
                ) =>
                  bullet.length > 0,
              ),

          dates:
            typeof project.dates ===
              "string"
              ? project.dates.trim()
              : project.dates ?? null,
        };
      },
    );


  return {

    // --------------------------------------------------------
    // CONTACT
    // --------------------------------------------------------

    contact:
      resume.contact &&
      typeof resume.contact ===
        "object"
        ? resume.contact as ResumeContact
        : {},


    // --------------------------------------------------------
    // SUMMARY
    // --------------------------------------------------------

    summary:
      typeof resume.summary ===
        "string"
        ? resume.summary.trim()
        : "",


    // --------------------------------------------------------
    // EXPERIENCE
    // --------------------------------------------------------

    experience:
      deduplicateArray(
        experience,
        (
          item,
        ) =>
          [
            item.company,
            item.title,
            item.startDate,
            item.endDate,
          ]
            .map(
              normalizeString,
            )
            .join("|"),
      ),


    // --------------------------------------------------------
    // SKILLS
    // --------------------------------------------------------

    skills:
      deduplicateSkills(
        resume.skills,
      ),


    // --------------------------------------------------------
    // PROJECTS
    // --------------------------------------------------------

    projects:
      deduplicateArray(
        normalizedProjects,
        (
          item,
        ) =>
          [
            item.title,
            item.description,
          ]
            .map(
              normalizeString,
            )
            .join("|"),
      ),


    // --------------------------------------------------------
    // EDUCATION
    // --------------------------------------------------------

    education:
      deduplicateArray(
        education,
        (
          item,
        ) =>
          [
            item.institution,
            item.degree,
            item.year ??
              item.endDate ??
              item.startDate,
          ]
            .map(
              normalizeString,
            )
            .join("|"),
      ),


    // --------------------------------------------------------
    // CERTIFICATIONS
    // --------------------------------------------------------

    certifications:
      deduplicateArray(
        certifications,
        (
          item,
        ) =>
          [
            item.name,
            item.issuer,
            item.date,
          ]
            .map(
              normalizeString,
            )
            .join("|"),
      ),


    // --------------------------------------------------------
    // PUBLICATIONS
    // --------------------------------------------------------

    publications:
      deduplicateArray(
        publications,
        (
          item,
        ) =>
          [
            item.title,
            item.authorship,
            item.venue,
            item.date,
          ]
            .map(
              normalizeString,
            )
            .join("|"),
      ),


    // --------------------------------------------------------
    // ADDITIONAL SECTIONS
    // --------------------------------------------------------

    additionalSections:
      deduplicateArray(
        additionalSections,
        (
          item,
        ) =>
          [
            item.title,
            item.content,
          ]
            .map(
              normalizeString,
            )
            .join("|"),
      ),
  };
}


// ============================================================
// GEMINI RESPONSE EXTRACTION
// ============================================================

function extractGeminiText(
  result: unknown,
): string {

  if (
    !result ||
    typeof result !==
      "object"
  ) {
    return "";
  }

  const response =
    result as {
      candidates?: Array<{
        content?: {
          parts?: Array<{
            text?: unknown;
          }>;
        };
      }>;
    };

  const parts =
    response
      .candidates?.[0]
      ?.content
      ?.parts;

  if (
    !Array.isArray(
      parts,
    )
  ) {
    return "";
  }

  return parts
    .map(
      (
        part,
      ) =>
        typeof part.text ===
          "string"
          ? part.text
          : "",
    )
    .join("")
    .trim();
}


// ============================================================
// MISTRAL CHAT RESPONSE EXTRACTION
// ============================================================

function extractMistralText(
  result: unknown,
): string {

  if (
    !result ||
    typeof result !==
      "object"
  ) {
    return "";
  }

  const response =
    result as {
      choices?: Array<{
        message?: {
          content?: unknown;
        };
      }>;
    };

  const content =
    response
      .choices?.[0]
      ?.message
      ?.content;

  if (
    typeof content ===
    "string"
  ) {
    return content.trim();
  }


  // Mistral can also return
  // structured content arrays.

  if (
    Array.isArray(
      content,
    )
  ) {

    return content
      .map(
        (
          item,
        ) => {

          if (
            item &&
            typeof item ===
              "object" &&
            "text" in item &&
            typeof (
              item as {
                text?: unknown;
              }
            ).text ===
              "string"
          ) {
            return (
              item as {
                text: string;
              }
            ).text;
          }

          return "";
        },
      )
      .join("")
      .trim();
  }

  return "";
}


// ============================================================
// CLEAN JSON
// ============================================================

function parseJson(
  text: string,
): unknown {

  let cleaned =
    text.trim();


  if (
    cleaned.startsWith(
      "```",
    )
  ) {

    cleaned =
      cleaned
        .replace(
          /^```(?:json)?\s*/i,
          "",
        )
        .replace(
          /\s*```$/,
          "",
        )
        .trim();
  }


  return JSON.parse(
    cleaned,
  );
}


// ============================================================
// GEMINI PRIMARY
// ============================================================

async function parseWithGemini(
  base64Pdf: string,
  apiKey: string,
): Promise<ParsedResume> {

  console.log(
    "🧠 Calling Gemini directly...",
  );


  const response =
    await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/" +
        GEMINI_MODEL +
        ":generateContent?key=" +
        encodeURIComponent(
          apiKey,
        ),
      {
        method:
          "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            contents: [
              {
                parts: [

                  // ------------------------------------------
                  // SHARED SEMANTIC RULES
                  // ------------------------------------------

                  {
                    text:
                      RESUME_EXTRACTION_PROMPT,
                  },

                  // ------------------------------------------
                  // ORIGINAL PDF
                  // ------------------------------------------

                  {
                    inlineData: {
                      mimeType:
                        "application/pdf",

                      data:
                        base64Pdf,
                    },
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


  if (
    !response.ok
  ) {

    const errorText =
      await response.text();

    throw new Error(
      `Gemini ${response.status}: ${errorText}`,
    );
  }


  const result =
    await response.json();


  const jsonText =
    extractGeminiText(
      result,
    );


  if (
    !jsonText
  ) {
    throw new Error(
      "Gemini returned no resume data.",
    );
  }


  const parsed =
    parseJson(
      jsonText,
    );


  return deduplicateResume(
    parsed,
  );
}


// ============================================================
// MISTRAL FILE UPLOAD
// ============================================================
//
// Mistral OCR expects a document that it can access.
// For a local uploaded PDF, we:
//
// 1. Upload the PDF to Mistral Files API.
// 2. Request a signed URL.
// 3. Send that URL to Mistral OCR.
//
// ============================================================

async function uploadPdfToMistral(
  pdfBuffer: Buffer,
  fileName: string,
  apiKey: string,
): Promise<string> {

  console.log(
    "📤 Uploading PDF to Mistral OCR...",
  );


  // Convert Node Buffer into a plain ArrayBuffer
  // so the Web FormData / Blob APIs accept it cleanly.

  const arrayBuffer =
    pdfBuffer.buffer.slice(
      pdfBuffer.byteOffset,
      pdfBuffer.byteOffset +
        pdfBuffer.byteLength,
    ) as ArrayBuffer;


  const blob =
    new Blob(
      [
        arrayBuffer,
      ],
      {
        type:
          "application/pdf",
      },
    );


  const form =
    new FormData();


  form.append(
    "file",
    blob,
    fileName,
  );


  form.append(
    "purpose",
    "ocr",
  );


  const uploadResponse =
    await fetch(
      "https://api.mistral.ai/v1/files",
      {
        method:
          "POST",

        headers: {
          Authorization:
            `Bearer ${apiKey}`,
        },

        body:
          form,
      },
    );


  if (
    !uploadResponse.ok
  ) {

    const errorText =
      await uploadResponse.text();


    throw new Error(
      `Mistral file upload ${uploadResponse.status}: ${errorText}`,
    );
  }


  const uploadResult =
    await uploadResponse.json();


  const fileId =
    uploadResult?.id;


  if (
    typeof fileId !==
    "string"
  ) {

    throw new Error(
      "Mistral file upload returned no file ID.",
    );
  }


  console.log(
    "✅ Mistral file uploaded:",
    fileId,
  );


  // ==========================================================
  // GET SIGNED URL
  // ==========================================================

  const urlResponse =
    await fetch(
      "https://api.mistral.ai/v1/files/" +
        encodeURIComponent(
          fileId,
        ) +
        "/url?expiry=1",
      {
        method:
          "GET",

        headers: {
          Authorization:
            `Bearer ${apiKey}`,
        },
      },
    );


  if (
    !urlResponse.ok
  ) {

    const errorText =
      await urlResponse.text();


    throw new Error(
      `Mistral signed URL ${urlResponse.status}: ${errorText}`,
    );
  }


  const urlResult =
    await urlResponse.json();


  const signedUrl =
    urlResult?.url;


  if (
    typeof signedUrl !==
    "string"
  ) {

    throw new Error(
      "Mistral returned no signed URL.",
    );
  }


  return signedUrl;
}



// ============================================================
// MISTRAL OCR
// ============================================================

async function runMistralOCR(
  signedUrl: string,
  apiKey: string,
): Promise<string> {

  console.log(
    "🔎 Running Mistral OCR...",
  );


  const response =
    await fetch(
      "https://api.mistral.ai/v1/ocr",
      {
        method:
          "POST",

        headers: {
          Authorization:
            `Bearer ${apiKey}`,

          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            model:
              MISTRAL_OCR_MODEL,

            document: {
              type:
                "document_url",

              document_url:
                signedUrl,
            },

            include_blocks:
              true,
          }),
      },
    );


  if (
    !response.ok
  ) {

    const errorText =
      await response.text();

    throw new Error(
      `Mistral OCR ${response.status}: ${errorText}`,
    );
  }


  const result =
    await response.json();


  const pages =
    Array.isArray(
      result?.pages,
    )
      ? result.pages
      : [];


  if (
    pages.length ===
    0
  ) {

    throw new Error(
      "Mistral OCR returned no pages.",
    );
  }


  const markdown =
    pages
      .map(
        (
          page: {
            index?: number;
            markdown?: unknown;
          },
        ) =>
          typeof page.markdown ===
            "string"
            ? page.markdown
            : "",
      )
      .filter(
        (
          text: string,
        ) =>
          text.trim().length >
          0,
      )
      .join(
        "\n\n",
      )
      .trim();


  if (
    !markdown
  ) {

    throw new Error(
      "Mistral OCR returned empty text.",
    );
  }


  console.log(
    `📄 Mistral OCR produced ${pages.length} pages.`,
  );


  return markdown;
}


// ============================================================
// MISTRAL SEMANTIC FALLBACK
// ============================================================
//
// OCR is only extraction.
//
// Mistral chat performs the same semantic extraction contract
// that Gemini performs above.
//
// ============================================================

async function parseWithMistral(
  ocrText: string,
  apiKey: string,
): Promise<ParsedResume> {

  console.log(
    "🧠 Sending Mistral OCR output through semantic understanding...",
  );


  const response =
    await fetch(
      "https://api.mistral.ai/v1/chat/completions",
      {
        method:
          "POST",

        headers: {
          Authorization:
            `Bearer ${apiKey}`,

          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({

            model:
              MISTRAL_CHAT_MODEL,

            messages: [

              // ==================================================
              // SYSTEM
              // ==================================================

              {
                role:
                  "system",

                content:
                  RESUME_EXTRACTION_PROMPT,
              },

              // ==================================================
              // OCR DOCUMENT
              // ==================================================

              {
                role:
                  "user",

                content:
                  `
Below is the OCR representation of the resume.

Treat the OCR text as the source document.

Preserve its section structure as represented by headings,
spacing, markdown headings, bullets, and ordering.

Do not invent information that is not present.

Extract it according to the system extraction contract.

--- RESUME OCR START ---

${ocrText}

--- RESUME OCR END ---
                  `.trim(),
              },

            ],

            temperature:
              0,

            response_format: {
              type:
                "json_object",
            },
          }),
      },
    );


  if (
    !response.ok
  ) {

    const errorText =
      await response.text();

    throw new Error(
      `Mistral semantic ${response.status}: ${errorText}`,
    );
  }


  const result =
    await response.json();


  const jsonText =
    extractMistralText(
      result,
    );


  if (
    !jsonText
  ) {

    throw new Error(
      "Mistral semantic model returned no resume data.",
    );
  }


  const parsed =
    parseJson(
      jsonText,
    );


  return deduplicateResume(
    parsed,
  );
}


// ============================================================
// RESULT LOGGING
// ============================================================

function logResumeResult(
  resume: ParsedResume,
  source: string,
) {

  console.log(
    `📊 ${resume.experience.length} experience | ` +
    `${resume.projects.length} projects | ` +
    `${resume.education.length} education | ` +
    `${resume.certifications.length} certifications | ` +
    `${resume.skills.length} skills | ` +
    `${resume.publications.length} publications`,
  );


  console.log(
    `🔧 Source: ${source}`,
  );


  // ==========================================================
  // SKILLS DEBUG
  // ==========================================================

  console.log(
    "🧠 Skills:",
    resume.skills,
  );


  // ==========================================================
  // PROJECT DEBUG
  // ==========================================================

  console.log(
    "🧩 Projects:",
    resume.projects.map(
      (
        project,
      ) => ({
        title:
          project.title,

        technologies:
          project.technologies,

        description:
          project.description,

        bullets:
          project.bullets ?? [],

        bulletCount:
          (
            project.bullets ??
            []
          ).length,
      }),
    ),
  );
}


// ============================================================
// POST
// ============================================================

export async function POST(
  request: Request,
) {

  let fileName =
    "unknown";


  try {

    // ========================================================
    // ENVIRONMENT
    // ========================================================

    const geminiApiKey =
      process.env.GEMINI_API_KEY;

    const mistralApiKey =
      process.env.MISTRAL_API_KEY;


    if (
      !geminiApiKey &&
      !mistralApiKey
    ) {

      return NextResponse.json(
        {
          error:
            "Neither GEMINI_API_KEY nor MISTRAL_API_KEY is configured.",
        },
        {
          status:
            500,
        },
      );
    }


    // ========================================================
    // FILE
    // ========================================================

    const formData =
      await request.formData();


    const file =
      formData.get(
        "file",
      );


    if (
      !(file instanceof File)
    ) {

      return NextResponse.json(
        {
          error:
            "No resume file was provided.",
        },
        {
          status:
            400,
        },
      );
    }


    fileName =
      file.name;


    console.log(
      "📄 Resume received:",
      fileName,
    );


    // ========================================================
    // PDF VALIDATION
    // ========================================================

    const isPdf =
      file.type ===
        "application/pdf" ||
      fileName
        .toLowerCase()
        .endsWith(
          ".pdf",
        );


    if (
      !isPdf
    ) {

      return NextResponse.json(
        {
          error:
            "Only PDF resumes are supported.",
        },
        {
          status:
            400,
        },
      );
    }


    // ========================================================
    // READ PDF ONCE
    // ========================================================

    const arrayBuffer =
      await file.arrayBuffer();


    const pdfBuffer =
      Buffer.from(
        arrayBuffer,
      );


    const base64Pdf =
      pdfBuffer.toString(
        "base64",
      );


    // ========================================================
    // PRIMARY: GEMINI
    // ========================================================

    if (
      geminiApiKey
    ) {

      try {

        const resume =
          await parseWithGemini(
            base64Pdf,
            geminiApiKey,
          );


        logResumeResult(
          resume,
          "gemini-direct",
        );


        console.log(
          "✅ Gemini resume parsing successful.",
        );


        return NextResponse.json({

          success:
            true,

          source:
            "gemini-direct",

          model:
            GEMINI_MODEL,

          fallbackUsed:
            false,

          fileName,

          fileSize:
            file.size,

          resume,
        });

      } catch (
        geminiError
      ) {

        console.error(
          "❌ Gemini primary pipeline failed:",
          geminiError,
        );

        console.log(
          "🔄 Gemini failed. Switching to Mistral fallback...",
        );
      }

    } else {

      console.log(
        "⚠️ GEMINI_API_KEY is missing. Skipping Gemini and using Mistral fallback.",
      );
    }


    // ========================================================
    // FALLBACK: MISTRAL
    // ========================================================

    if (
      !mistralApiKey
    ) {

      return NextResponse.json(
        {
          error:
            "Gemini failed and MISTRAL_API_KEY is not configured.",
        },
        {
          status:
            503,
        },
      );
    }


    try {

      console.log(
        "🔄 Switching to Mistral OCR fallback...",
      );


      // ------------------------------------------------------
      // STEP 1: UPLOAD PDF
      // ------------------------------------------------------

      const signedUrl =
        await uploadPdfToMistral(
          pdfBuffer,
          fileName,
          mistralApiKey,
        );


      // ------------------------------------------------------
      // STEP 2: OCR
      // ------------------------------------------------------

      const ocrText =
        await runMistralOCR(
          signedUrl,
          mistralApiKey,
        );


      console.log(
        `📄 Mistral OCR text length: ${ocrText.length}`,
      );


      // ------------------------------------------------------
      // STEP 3: SEMANTIC EXTRACTION
      // ------------------------------------------------------

      const resume =
        await parseWithMistral(
          ocrText,
          mistralApiKey,
        );


      // ------------------------------------------------------
      // STEP 4: LOG
      // ------------------------------------------------------

      logResumeResult(
        resume,
        "mistral-ocr-fallback",
      );


      console.log(
        "✅ Mistral OCR + semantic fallback successful.",
      );


      return NextResponse.json({

        success:
          true,

        source:
          "mistral-ocr-fallback",

        model:
          MISTRAL_CHAT_MODEL,

        ocrModel:
          MISTRAL_OCR_MODEL,

        fallbackUsed:
          true,

        fileName,

        fileSize:
          file.size,

        resume,
      });


    } catch (
      mistralError
    ) {

      console.error(
        "❌ Mistral fallback failed:",
        mistralError,
      );


      return NextResponse.json(
        {
          error:
            "Both resume parsing pipelines failed.",

          details: {

            gemini:
              "Primary Gemini pipeline failed. See server console for details.",

            mistral:
              mistralError instanceof Error
                ? mistralError.message
                : "Unknown Mistral fallback error.",
          },
        },
        {
          status:
            503,
        },
      );
    }


  } catch (
    error
  ) {

    console.error(
      "❌ Resume parsing route error:",
      error,
    );


    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown resume parsing error.",

        fileName,
      },
      {
        status:
          500,
      },
    );
  }
}