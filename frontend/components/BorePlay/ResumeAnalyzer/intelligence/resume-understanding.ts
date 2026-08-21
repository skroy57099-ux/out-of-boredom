// components/BorePlay/ResumeAnalyzer/intelligence/resume-understanding.ts

import type {
  DocumentBlock,
  ResumeDocument,
} from "../document/document-layout";


// ============================================================
// SEMANTIC DOCUMENT TYPES
// ============================================================
//
// IMPORTANT:
//
// These are NOT resume section names.
//
// They are semantic categories used internally after the LLM
// understands the document.
//
// The LLM is NOT told that these sections must exist.
// ============================================================

export type SemanticType =
  | "contact_information"
  | "summary"
  | "work_history"
  | "training"
  | "projects"
  | "education"
  | "skills"
  | "certifications"
  | "publications"
  | "awards"
  | "research"
  | "volunteer_work"
  | "interests"
  | "references"
  | "other";


// ============================================================
// SEMANTIC ENTRY
// ============================================================

export interface SemanticEntry {
  id: string;

  blockIds: string[];

  content: string;

  confidence: number;
}


// ============================================================
// DISCOVERED SECTION
// ============================================================

export interface DiscoveredSection {
  id: string;

  title: string | null;

  titleWasInferred: boolean;

  semanticType: SemanticType;

  confidence: number;

  order: number;

  blockIds: string[];

  entries: SemanticEntry[];
}


// ============================================================
// SEMANTIC DOCUMENT
// ============================================================

export interface SemanticResumeDocument {
  sections: DiscoveredSection[];

  unassignedBlockIds: string[];
}


// ============================================================
// PROMPT
// ============================================================

const semanticDiscoveryPrompt = `
You are the semantic document-understanding engine of a resume
analysis application.

You are receiving an UNKNOWN document.

Your job is to understand what is actually present in the document.

You must NOT assume that the document follows a standard resume
template.

Do not assume that any particular section exists.

Do not search only for predefined section names.

The document may use:

- unusual headings
- missing headings
- different terminology
- different ordering
- one-column layouts
- multi-column layouts
- tables
- dense formatting
- large headings
- small headings
- wrapped text
- entries without explicit labels

Your task is to discover the structure from the document itself.

============================================================
CORE OBJECTIVE
============================================================

Identify every meaningful content group in the document.

For every discovered group:

1. Determine what the content represents semantically.
2. Preserve the original visible heading when one exists.
3. Determine which document blocks belong to that group.
4. Determine which blocks belong to the same logical entry.
5. Keep independent entries separate.
6. Preserve the original wording.
7. Provide confidence.
8. Preserve evidence through block IDs.

Do not discard unfamiliar sections.

If something does not fit an appropriate semantic category,
classify it as "other".

============================================================
SEMANTIC CLASSIFICATION
============================================================

You may use these semantic labels when appropriate:

contact_information
summary
work_history
training
projects
education
skills
certifications
publications
awards
research
volunteer_work
interests
references
other

These labels are semantic interpretations.

They are NOT required sections.

Do not create a section merely because the label exists.

============================================================
ENTRY GROUPING
============================================================

This is extremely important.

Separate logical entries must remain separate.

For example:

If a document contains four different projects,
return four separate entries.

If a document contains three employers,
return three separate entries.

If a training section contains multiple organizations,
preserve each organization as a separate entry when the content
indicates they are separate experiences.

Do not merge entries merely because they have similar formatting.

Do not split one entry merely because it wraps across multiple
lines or blocks.

Use:

- spatial position
- reading order
- repeated formatting
- dates
- typography
- semantic relationships
- nearby blocks
- headings
- columns

to determine grouping.

============================================================
LAYOUT
============================================================

The supplied blocks contain coordinates.

Use those coordinates.

Remember that a resume may contain multiple columns.

Do not simply concatenate every block on a page and assume that
the resulting text is the reading order.

Use page position and grouping to understand the layout.

============================================================
CONTENT
============================================================

Do not invent information.

Do not infer facts that are not supported by the document.

Do not rewrite resume content.

Do not improve grammar.

Do not summarize entries.

Preserve the actual content inside each discovered entry.

============================================================
HEADINGS
============================================================

When a visible heading exists:

- preserve its exact text
- set titleWasInferred to false

When there is no explicit heading but the grouping is obvious:

- set title to null
- set titleWasInferred to true

Do not invent a heading merely to make the output look complete.

============================================================
BLOCK IDs
============================================================

Every section and entry must reference the original block IDs.

Only use block IDs supplied in the document.

Do not invent block IDs.

Every meaningful block should either:

1. belong to a discovered section

OR

2. appear in unassignedBlockIds.

============================================================
CONFIDENCE
============================================================

Confidence must be between 0 and 1.

Confidence describes how strongly the document evidence supports
the semantic interpretation.

Low confidence is preferable to fabricated certainty.

============================================================
OUTPUT
============================================================

Return ONLY valid JSON.

Use exactly this structure:

{
  "sections": [
    {
      "id": "section-1",
      "title": null,
      "titleWasInferred": false,
      "semanticType": "other",
      "confidence": 0.0,
      "order": 1,
      "blockIds": [],
      "entries": [
        {
          "id": "entry-1",
          "blockIds": [],
          "content": "",
          "confidence": 0.0
        }
      ]
    }
  ],
  "unassignedBlockIds": []
}

Rules:

- Do not invent sections.
- Do not invent entries.
- Do not invent facts.
- Do not merge independent entries.
- Do not split one logical entry unnecessarily.
- Preserve document order.
- Preserve original wording.
- Use only supplied block IDs.
- Return every meaningful discovered section.
`;


// ============================================================
// HELPERS
// ============================================================

function asObject(
  value: unknown,
): Record<string, unknown> {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    return value as Record<
      string,
      unknown
    >;
  }

  return {};
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

  return result || null;
}


function asStringArray(
  value: unknown,
): string[] {
  if (!Array.isArray(value)) {
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
      (item) =>
        item.trim(),
    )
    .filter(Boolean);
}


function clampConfidence(
  value: unknown,
): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      1,
      value,
    ),
  );
}


function normalizeSemanticType(
  value: unknown,
): SemanticType {
  const type =
    asString(value)
      ?.toLowerCase()
      .replace(
        /[\s-]+/g,
        "_",
      );

  switch (type) {
    case "contact_information":
    case "contact":
      return "contact_information";

    case "summary":
    case "profile":
      return "summary";

    case "work_history":
    case "employment":
    case "professional_experience":
    case "experience":
      return "work_history";

    case "training":
      return "training";

    case "projects":
    case "project":
      return "projects";

    case "education":
      return "education";

    case "skills":
    case "skill":
      return "skills";

    case "certifications":
    case "certification":
      return "certifications";

    case "publications":
    case "publication":
      return "publications";

    case "awards":
    case "achievements":
      return "awards";

    case "research":
      return "research";

    case "volunteer_work":
    case "volunteering":
      return "volunteer_work";

    case "interests":
    case "hobbies":
      return "interests";

    case "references":
      return "references";

    default:
      return "other";
  }
}


// ============================================================
// DOCUMENT SERIALIZATION
// ============================================================

function serializeDocument(
  document: ResumeDocument,
): string {
  return JSON.stringify(
    {
      pages:
        document.pages.map(
          (page) => ({
            page:
              page.page,

            width:
              page.width,

            height:
              page.height,

            blocks:
              page.blocks.map(
                (block) => ({
                  id:
                    block.id,

                  page:
                    block.page,

                  text:
                    block.text,

                  x:
                    Number(
                      block.x.toFixed(2),
                    ),

                  y:
                    Number(
                      block.y.toFixed(2),
                    ),

                  width:
                    Number(
                      block.width.toFixed(2),
                    ),

                  height:
                    Number(
                      block.height.toFixed(2),
                    ),

                  fontSize:
                    block.fontSize,

                  fontName:
                    block.fontName,

                  isBold:
                    block.isBold,
                }),
              ),
          }),
        ),
    },
    null,
    2,
  );
}


// ============================================================
// NORMALIZE GEMINI SEMANTIC RESPONSE
// ============================================================

function normalizeSemanticResponse(
  raw: unknown,
  validBlockIds: Set<string>,
): SemanticResumeDocument {

  const root =
    asObject(raw);

  const rawSections =
    Array.isArray(
      root.sections,
    )
      ? root.sections
      : [];

  const assigned =
    new Set<string>();

  const sections:
    DiscoveredSection[] = [];

  for (
    let sectionIndex = 0;
    sectionIndex <
    rawSections.length;
    sectionIndex++
  ) {

    const rawSection =
      asObject(
        rawSections[
          sectionIndex
        ],
      );

    const rawBlockIds =
      asStringArray(
        rawSection.blockIds,
      );

    const blockIds =
      rawBlockIds.filter(
        (id) =>
          validBlockIds.has(id),
      );

    for (
      const id of blockIds
    ) {
      assigned.add(id);
    }

    const rawEntries =
      Array.isArray(
        rawSection.entries,
      )
        ? rawSection.entries
        : [];

    const entries:
      SemanticEntry[] = [];

    for (
      let entryIndex = 0;
      entryIndex <
      rawEntries.length;
      entryIndex++
    ) {

      const rawEntry =
        asObject(
          rawEntries[
            entryIndex
          ],
        );

      const entryBlockIds =
        asStringArray(
          rawEntry.blockIds,
        ).filter(
          (id) =>
            validBlockIds.has(id),
        );

      for (
        const id
        of entryBlockIds
      ) {
        assigned.add(id);
      }

      entries.push({
        id:
          asString(
            rawEntry.id,
          ) ??
          `entry-${sectionIndex + 1}-${entryIndex + 1}`,

        blockIds:
          entryBlockIds,

        content:
          asString(
            rawEntry.content,
          ) ?? "",

        confidence:
          clampConfidence(
            rawEntry.confidence,
          ),
      });
    }

    sections.push({
      id:
        asString(
          rawSection.id,
        ) ??
        `section-${sectionIndex + 1}`,

      title:
        asString(
          rawSection.title,
        ),

      titleWasInferred:
        Boolean(
          rawSection.titleWasInferred,
        ),

      semanticType:
        normalizeSemanticType(
          rawSection.semanticType,
        ),

      confidence:
        clampConfidence(
          rawSection.confidence,
        ),

      order:
        typeof rawSection.order ===
          "number"
          ? rawSection.order
          : sectionIndex + 1,

      blockIds,

      entries,
    });
  }

  const explicitUnassigned =
    asStringArray(
      root.unassignedBlockIds,
    ).filter(
      (id) =>
        validBlockIds.has(id),
    );

  for (
    const id
    of explicitUnassigned
  ) {
    assigned.add(id);
  }

  const unassignedBlockIds =
    Array.from(
      validBlockIds,
    ).filter(
      (id) =>
        !assigned.has(id),
    );

  return {
    sections,

    unassignedBlockIds,
  };
}


// ============================================================
// GEMINI SEMANTIC UNDERSTANDING
// ============================================================

export async function understandResumeDocument(
  document: ResumeDocument,
  base64Pdf?: string,
): Promise<SemanticResumeDocument> {

  const apiKey =
    process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured.",
    );
  }

  const serializedDocument =
    serializeDocument(
      document,
    );

  const parts: Array<
    Record<string, unknown>
  > = [
    {
      text:
        semanticDiscoveryPrompt,
    },
    {
      text:
        "\n\nDOCUMENT LAYOUT BLOCKS:\n" +
        serializedDocument,
    },
  ];

  // ----------------------------------------------------------
  // IMPORTANT:
  //
  // We also send the original PDF when available.
  //
  // This allows Gemini to use visual information when PDF.js
  // extraction is imperfect, including unusual layouts.
  //
  // The PDF is evidence, NOT a replacement for the generic
  // document representation.
  // ----------------------------------------------------------

  if (base64Pdf) {
    parts.push({
      inlineData: {
        mimeType:
          "application/pdf",

        data:
          base64Pdf,
      },
    });
  }

  const response =
    await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=" +
        apiKey,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          contents: [
            {
              parts,
            },
          ],

          generationConfig: {
            temperature: 0,

            responseMimeType:
              "application/json",
          },
        }),
      },
    );

  const responseText =
    await response.text();

  if (!response.ok) {
    throw new Error(
      `Gemini semantic analysis failed: ${response.status}: ${responseText}`,
    );
  }

  let apiResult: any;

  try {
    apiResult =
      JSON.parse(
        responseText,
      );
  } catch {
    throw new Error(
      "Gemini returned an invalid API response.",
    );
  }

  const modelText =
    apiResult?.candidates?.[0]
      ?.content?.parts?.[0]
      ?.text;

  if (
    typeof modelText !==
    "string"
  ) {
    throw new Error(
      "Gemini returned no semantic document.",
    );
  }

  let semanticJson: unknown;

  try {
    semanticJson =
      JSON.parse(
        modelText,
      );
  } catch {
    throw new Error(
      "Gemini semantic response was not valid JSON.",
    );
  }

  const validBlockIds =
    new Set(
      document.blocks.map(
        (
          block,
        ) =>
          block.id,
      ),
    );

  return normalizeSemanticResponse(
    semanticJson,
    validBlockIds,
  );
}


// ============================================================
// UTILITY
// ============================================================

export function getBlocksByIds(
  document: ResumeDocument,
  blockIds: string[],
): DocumentBlock[] {

  const wanted =
    new Set(
      blockIds,
    );

  return document.blocks.filter(
    (block) =>
      wanted.has(
        block.id,
      ),
  );
}


// ============================================================
// RECONSTRUCT ORIGINAL TEXT
// ============================================================

export function reconstructText(
  document: ResumeDocument,
  blockIds: string[],
): string {

  const blocks =
    getBlocksByIds(
      document,
      blockIds,
    );

  return blocks
    .map(
      (block) =>
        block.text,
    )
    .join(" ")
    .replace(
      /\s+/g,
      " ",
    )
    .trim();
}