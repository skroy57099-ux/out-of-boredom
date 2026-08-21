// components/BorePlay/ResumeAnalyzer/intelligence/section-discovery.ts

import type {
  ResumeDocumentIR,
  ResumeSectionIR,
  SemanticSectionType,
  ConfidenceStatus,
  Provenance,
} from "../ir/types";


// ============================================================
// SECTION DISCOVERY
// ============================================================
//
// This is the FIRST semantic layer.
//
// Responsibility:
//
//   Document IR
//       ↓
//   discover sections
//
// It does NOT:
//
//   - discover jobs
//   - discover projects
//   - discover certifications
//   - extract dates
//   - extract companies
//   - extract skills
//   - create resume fields
//
// The only question here is:
//
//   "What logical sections exist in this document,
//    and which source blocks belong to each section?"
//
// ============================================================


// ============================================================
// LLM RESPONSE TYPES
// ============================================================

interface RawSectionDiscovery {
  id?: unknown;

  title?: unknown;

  blockIds?: unknown;

  classification?: unknown;

  confidence?: unknown;

  alternatives?: unknown;
}


interface RawClassification {
  label?: unknown;

  confidence?: unknown;
}


interface GeminiSectionResponse {
  sections?: unknown;
}


// ============================================================
// ALLOWED SEMANTIC LABELS
// ============================================================
//
// IMPORTANT:
//
// These are NOT section names.
//
// They are the internal semantic vocabulary used AFTER
// the document has been understood.
//
// The resume itself does not need to use any of these words.
//
// Example:
//
// "TRAINING EXPERIENCE"
//        ↓
// "work_history"
//
// "PROFESSIONAL JOURNEY"
//        ↓
// "work_history"
//
// "WHAT I'VE BUILT"
//        ↓
// "projects"
//
// ============================================================

const ALLOWED_SECTION_TYPES:
  readonly SemanticSectionType[] = [
    "contact",
    "summary",
    "work_history",
    "training",
    "projects",
    "education",
    "skills",
    "certifications",
    "publications",
    "awards",
    "volunteering",
    "languages",
    "interests",
    "other",
    "unknown",
  ];


// ============================================================
// HELPERS
// ============================================================

function isObject(
  value: unknown,
): value is Record<string, unknown> {

  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}


function asString(
  value: unknown,
): string | null {

  if (
    typeof value !== "string"
  ) {

    return null;
  }


  const result =
    value.trim();


  return result ||
    null;
}


function asNumber(
  value: unknown,
  fallback = 0,
): number {

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {

    return Math.max(
      0,
      Math.min(
        1,
        value,
      ),
    );
  }


  return fallback;
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
        typeof item === "string",
    )
    .map(
      (
        item,
      ) =>
        item.trim(),
    )
    .filter(Boolean);
}


function normalizeSectionType(
  value: unknown,
): SemanticSectionType {

  if (
    typeof value !== "string"
  ) {

    return "unknown";
  }


  const normalized =
    value
      .trim()
      .toLowerCase();


  if (
    ALLOWED_SECTION_TYPES.includes(
      normalized as SemanticSectionType,
    )
  ) {

    return normalized as SemanticSectionType;
  }


  return "unknown";
}


function confidenceStatus(
  confidence: number,
): ConfidenceStatus {

  if (
    confidence >=
    0.85
  ) {

    return "confirmed";
  }


  if (
    confidence >=
    0.60
  ) {

    return "probable";
  }


  if (
    confidence > 0
  ) {

    return "ambiguous";
  }


  return "unknown";
}


// ============================================================
// PROVENANCE
// ============================================================

function createSectionProvenance(
  document: ResumeDocumentIR,
  blockIds: string[],
  confidence: number,
): Provenance {

  const blocks =
    blockIds
      .map(
        (
          blockId,
        ) =>
          document.blocks.find(
            (
              block,
            ) =>
              block.id ===
              blockId,
          ),
      )
      .filter(
        (
          block,
        ) =>
          block !== undefined,
      );


  return {

    blockIds,

    pageNumbers:
      Array.from(
        new Set(
          blocks.map(
            (
              block,
            ) =>
              block.page,
          ),
        ),
      ),

    sourceText:
      blocks
        .map(
          (
            block,
          ) =>
            block.text,
        )
        .join("\n"),

    extractionStage:
      "section_discovery",

    confidence,

    status:
      confidenceStatus(
        confidence,
      ),
  };
}


// ============================================================
// VALIDATE BLOCK IDs
// ============================================================
//
// Gemini is NOT allowed to invent source block IDs.
//
// If it gives us:
//
// "p1-b9999"
//
// and that block doesn't exist:
//
// reject it.
//
// ============================================================

function validateBlockIds(
  document: ResumeDocumentIR,
  blockIds: string[],
): string[] {

  const validBlockIds =
    new Set(
      document.blocks.map(
        (
          block,
        ) =>
          block.id,
      ),
    );


  return Array.from(
    new Set(
      blockIds.filter(
        (
          blockId,
        ) =>
          validBlockIds.has(
            blockId,
          ),
      ),
    ),
  );
}


// ============================================================
// BUILD LLM INPUT
// ============================================================
//
// IMPORTANT:
//
// We provide the model with the document evidence.
//
// We do NOT provide:
//
//   - "this is Divyaa's resume"
//   - expected sections
//   - expected section names
//   - company names
//   - job titles
//   - project names
//   - certifications
//
// The model receives generic document blocks.
//
// ============================================================

function buildSemanticInput(
  document: ResumeDocumentIR,
): string {

  const blocks =
    document.readingOrder
      .map(
        (
          item,
        ) =>
          document.blocks.find(
            (
              block,
            ) =>
              block.id ===
              item.blockId,
          ),
      )
      .filter(
        (
          block,
        ) =>
          block !== undefined,
      );


  const lines =
    blocks.map(
      (
        block,
      ) => {

        return [
          `[BLOCK ${block.id}]`,
          `page=${block.page}`,
          `x=${block.bbox.x}`,
          `y=${block.bbox.y}`,
          `width=${block.bbox.width}`,
          `height=${block.bbox.height}`,
          `fontSize=${block.style.fontSize ?? "unknown"}`,
          `text=${JSON.stringify(block.text)}`,
        ].join(" ");
      },
    );


  return lines.join("\n");
}


// ============================================================
// SYSTEM PROMPT
// ============================================================
//
// This prompt deliberately does NOT tell the model:
//
//   "find experience"
//   "find certifications"
//   "find projects"
//
// It asks the model to discover logical boundaries.
//
// ============================================================

const SECTION_DISCOVERY_PROMPT = `
You are the semantic structure analyzer for a resume document.

Your task is ONLY to discover the logical sections that already
exist in the supplied document evidence.

You are NOT extracting fields.
You are NOT extracting individual jobs.
You are NOT extracting projects.
You are NOT extracting certifications.
You are NOT building a resume.
You are NOT rewriting any text.

You must reason from the supplied document blocks.

The document may use completely unfamiliar section names,
unusual layouts, columns, tables, headings, or ordering.

Do not assume a standard resume structure.

For every logical section you can identify:

1. Preserve its original visible title when one exists.
2. Identify the semantic meaning of the section.
3. Assign the section a semantic classification.
4. Assign a confidence from 0 to 1.
5. Return the source block IDs that belong to that section.
6. Preserve the document's existing evidence.
7. Do not invent block IDs.
8. Do not invent text.
9. Do not copy a block into multiple sections.
10. Do not extract individual entry fields yet.

The semantic classification vocabulary is:

contact
summary
work_history
training
projects
education
skills
certifications
publications
awards
volunteering
languages
interests
other
unknown

These labels are semantic categories, NOT required section names.

For example, a document may use a heading such as
"TRAINING EXPERIENCE". You must determine its meaning from
the document evidence rather than relying on exact heading
matching.

If you are uncertain, use "unknown" or provide a lower
confidence score.

Do not force ambiguous content into a category.

Every returned blockId MUST exist in the supplied document.

Every source block should have at most one section owner.

If a block cannot confidently be assigned to a section,
do not invent an assignment.

Return ONLY valid JSON.

Required JSON structure:

{
  "sections": [
    {
      "id": "section-001",
      "title": "exact visible title or null",
      "blockIds": ["p1-b1", "p1-b2"],
      "classification": {
        "label": "unknown",
        "confidence": 0.0
      },
      "alternatives": [
        {
          "label": "other",
          "confidence": 0.0
        }
      ]
    }
  ]
}
`;


// ============================================================
// GEMINI REQUEST
// ============================================================

async function callGemini(
  document: ResumeDocumentIR,
): Promise<unknown> {

  const apiKey =
    process.env.GEMINI_API_KEY;


  if (!apiKey) {

    throw new Error(
      "GEMINI_API_KEY is not configured.",
    );
  }


  const documentInput =
    buildSemanticInput(
      document,
    );


  const response =
    await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=" +
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
            system_instruction: {
              parts: [
                {
                  text:
                    SECTION_DISCOVERY_PROMPT,
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
                      `DOCUMENT BLOCKS:\n\n${documentInput}`,
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


  const responseText =
    await response.text();


  if (
    !response.ok
  ) {

    throw new Error(
      `Gemini section discovery ${response.status}: ${responseText}`,
    );
  }


  let parsedResponse:
    unknown;


  try {

    parsedResponse =
      JSON.parse(
        responseText,
      );

  } catch {

    throw new Error(
      "Gemini returned invalid JSON response.",
    );
  }


  return parsedResponse;
}


// ============================================================
// EXTRACT MODEL TEXT
// ============================================================

function extractGeminiText(
  response: unknown,
): string {

  if (
    !isObject(response)
  ) {

    throw new Error(
      "Invalid Gemini response.",
    );
  }


  const candidates =
    response[
      "candidates"
    ];


  if (
    !Array.isArray(
      candidates,
    ) ||
    candidates.length ===
      0
  ) {

    throw new Error(
      "Gemini returned no candidates.",
    );
  }


  const firstCandidate =
    candidates[0];


  if (
    !isObject(
      firstCandidate,
    )
  ) {

    throw new Error(
      "Invalid Gemini candidate.",
    );
  }


  const content =
    firstCandidate[
      "content"
    ];


  if (
    !isObject(content)
  ) {

    throw new Error(
      "Gemini response has no content.",
    );
  }


  const parts =
    content[
      "parts"
    ];


  if (
    !Array.isArray(parts)
  ) {

    throw new Error(
      "Gemini response has no parts.",
    );
  }


  const text =
    parts
      .map(
        (
          part,
        ) =>
          isObject(part) &&
          typeof part.text ===
            "string"
            ? part.text
            : "",
      )
      .join("");


  if (
    !text.trim()
  ) {

    throw new Error(
      "Gemini returned empty semantic output.",
    );
  }


  return text.trim();
}


// ============================================================
// PARSE MODEL JSON
// ============================================================

function parseGeminiJSON(
  text: string,
): GeminiSectionResponse {

  let parsed:
    unknown;


  try {

    parsed =
      JSON.parse(
        text,
      );

  } catch {

    throw new Error(
      "Gemini section discovery returned invalid JSON.",
    );
  }


  if (
    !isObject(parsed)
  ) {

    throw new Error(
      "Gemini section discovery response is not an object.",
    );
  }


  return {
    sections:
      parsed.sections,
  };
}


// ============================================================
// NORMALIZE SECTION
// ============================================================

function normalizeSection(
  document: ResumeDocumentIR,
  raw: RawSectionDiscovery,
  index: number,
): ResumeSectionIR | null {

  const rawBlockIds =
    asStringArray(
      raw.blockIds,
    );


  const blockIds =
    validateBlockIds(
      document,
      rawBlockIds,
    );


  // ----------------------------------------------------------
  // Never create a section with no source evidence.
  // ----------------------------------------------------------

  if (
    blockIds.length ===
    0
  ) {

    return null;
  }


  const titleText =
    asString(
      raw.title,
    );


  const rawClassification =
    isObject(
      raw.classification,
    )
      ? raw.classification
      : {};


  const label =
    normalizeSectionType(
      rawClassification.label,
    );


  const confidence =
    asNumber(
      rawClassification.confidence,
      asNumber(
        raw.confidence,
        0,
      ),
    );


  const alternativesRaw =
    Array.isArray(
      raw.alternatives,
    )
      ? raw.alternatives
      : [];


  const alternatives =
    alternativesRaw
      .filter(
        isObject,
      )
      .map(
        (
          alternative,
        ) => ({

          label:
            normalizeSectionType(
              alternative.label,
            ),

          confidence:
            asNumber(
              alternative.confidence,
              0,
            ),
        }),
      )
      .filter(
        (
          alternative,
        ) =>
          alternative.label !==
          "unknown",
      );


  const provenance =
    createSectionProvenance(
      document,
      blockIds,
      confidence,
    );


  return {

    id:
      asString(
        raw.id,
      ) ??
      `section-${String(
        index + 1,
      ).padStart(
        3,
        "0",
      )}`,

    order:
      index,

    title:
      titleText
        ? {

            text:
              titleText,

            blockIds,

            confidence,

            provenance,
          }
        : null,

    semanticClassification: {

      label,

      confidence,

      status:
        confidenceStatus(
          confidence,
        ),

      alternatives,
    },

    blockIds,

    entries: [],

    provenance,
  };
}


// ============================================================
// CHECK CROSS-SECTION BLOCK OWNERSHIP
// ============================================================
//
// A block must not silently belong to multiple sections.
//
// If it does, we do NOT decide which section is correct here.
//
// Validation will mark it as a conflict.
//
// ============================================================

function detectSectionOwnershipConflicts(
  sections: ResumeSectionIR[],
): Array<{
  blockId: string;
  sectionIds: string[];
}> {

  const ownership =
    new Map<
      string,
      string[]
    >();


  for (
    const section of
    sections
  ) {

    for (
      const blockId of
      section.blockIds
    ) {

      if (
        !ownership.has(
          blockId,
        )
      ) {

        ownership.set(
          blockId,
          [],
        );
      }


      ownership
        .get(blockId)!
        .push(
          section.id,
        );
    }
  }


  return Array.from(
    ownership.entries(),
  )
    .filter(
      (
        [
          ,
          sectionIds,
        ],
      ) =>
        sectionIds.length >
        1,
    )
    .map(
      (
        [
          blockId,
          sectionIds,
        ],
      ) => ({

        blockId,

        sectionIds:
          Array.from(
            new Set(
              sectionIds,
            ),
          ),
      }),
    );
}


// ============================================================
// DISCOVER SECTIONS
// ============================================================

export async function discoverSections(
  document: ResumeDocumentIR,
): Promise<ResumeDocumentIR> {

  if (
    document.blocks.length ===
    0
  ) {

    throw new Error(
      "Cannot discover sections from an empty document.",
    );
  }


  const rawResponse =
    await callGemini(
      document,
    );


  const text =
    extractGeminiText(
      rawResponse,
    );


  const parsed =
    parseGeminiJSON(
      text,
    );


  if (
    !Array.isArray(
      parsed.sections,
    )
  ) {

    throw new Error(
      "Gemini did not return a sections array.",
    );
  }


  const sections:
    ResumeSectionIR[] = [];


  for (
    let index = 0;
    index <
    parsed.sections.length;
    index++
  ) {

    const raw =
      parsed.sections[index];


    if (
      !isObject(raw)
    ) {

      continue;
    }


    const section =
      normalizeSection(
        document,
        raw as RawSectionDiscovery,
        index,
      );


    if (
      section
    ) {

      sections.push(
        section,
      );
    }
  }


  // ----------------------------------------------------------
  // Detect conflicting block ownership BEFORE validation.
  // ----------------------------------------------------------

  const conflicts =
    detectSectionOwnershipConflicts(
      sections,
    );


  // ----------------------------------------------------------
  // Attach sections.
  // ----------------------------------------------------------

  const discoveredDocument:
    ResumeDocumentIR =
    {

      ...document,

      sections,

      validation:
        document.validation,
    };


  // ----------------------------------------------------------
  // Re-run the existing validation layer.
  //
  // This means section discovery doesn't get to bypass
  // structural validation.
  // ----------------------------------------------------------

  const validatedDocument =
    await import(
      "../ir/validation"
    ).then(
      (
        module,
      ) =>
        module.validateDocumentIR(
          discoveredDocument,
        ),
    );


  // ----------------------------------------------------------
  // Additional section-level conflict information.
  //
  // We don't resolve conflicts automatically.
  // ----------------------------------------------------------

  if (
    conflicts.length >
    0
  ) {

    const conflictIssues =
      conflicts.map(
        (
          conflict,
        ) => ({

          code:
            "CONFLICTING_OWNERSHIP" as const,

          severity:
            "error" as const,

          message:
            `Block ${conflict.blockId} was assigned to multiple sections.`,

          blockIds: [
            conflict.blockId,
          ],

          sectionIds:
            conflict.sectionIds,

          entryIds: [],
        }),
      );


    return {

      ...validatedDocument,

      validation: {

        ...validatedDocument.validation,

        valid:
          false,

        issues: [
          ...validatedDocument
            .validation
            .issues,

          ...conflictIssues,
        ],
      },
    };
  }


  return validatedDocument;
}


// ============================================================
// SECTION DISCOVERY PREVIEW
// ============================================================
//
// Useful for inspecting what Gemini discovered without
// involving the frontend.
//
// ============================================================

export function summarizeSections(
  document: ResumeDocumentIR,
) {

  return document.sections.map(
    (
      section,
    ) => ({

      id:
        section.id,

      order:
        section.order,

      title:
        section.title?.text ??
        null,

      classification:
        section.semanticClassification
          .label,

      confidence:
        section.semanticClassification
          .confidence,

      status:
        section.semanticClassification
          .status,

      blockCount:
        section.blockIds.length,

      blockIds:
        section.blockIds,

      entries:
        section.entries.length,
    }),
  );
}