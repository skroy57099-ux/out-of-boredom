// components/BorePlay/ResumeAnalyzer/intelligence/field-extraction.ts

import type {
  ResumeDocumentIR,
  ResumeSectionIR,
  ResumeEntryIR,
  ResumeFieldIR,
  Provenance,
} from "../ir/types";


// ============================================================
// FIELD EXTRACTION
// ============================================================
//
// Pipeline:
//
//   Document Layout
//        ↓
//   Document IR
//        ↓
//   Section Discovery
//        ↓
//   Entry Discovery
//        ↓
//   FIELD EXTRACTION  ← this file
//        ↓
//   Canonicalization
//        ↓
//   Validation
//
// IMPORTANT:
//
// This layer receives ONE already-discovered entry.
//
// It does NOT:
//
// - create entries
// - create sections
// - merge entries
// - move blocks
// - use blocks outside the entry
// - invent information
// - duplicate source content
//
// Every field must point to the original block(s) that support it.
//
// ============================================================


// ============================================================
// RAW GEMINI TYPES
// ============================================================

interface RawField {
  id?: unknown;

  name?: unknown;

  value?: unknown;

  blockIds?: unknown;

  confidence?: unknown;
}

interface RawFieldResponse {
  fields?: unknown;
}


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

  return result || null;
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


// ============================================================
// CONFIDENCE STATUS
// ============================================================

function confidenceStatus(
  confidence: number,
): ResumeFieldIR["status"] {

  if (
    confidence >= 0.85
  ) {
    return "confirmed";
  }

  if (
    confidence >= 0.60
  ) {
    return "probable";
  }

  return "ambiguous";
}


// ============================================================
// PROVENANCE
// ============================================================

function createFieldProvenance(
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
      "field_extraction",

    confidence,

    status:
      confidenceStatus(
        confidence,
      ),
  };
}


// ============================================================
// SERIALIZE ENTRY
// ============================================================
//
// Only the blocks already assigned to this entry are supplied.
//
// This is the most important boundary in this layer.
//
// ============================================================

function serializeEntry(
  document: ResumeDocumentIR,
  section: ResumeSectionIR,
  entry: ResumeEntryIR,
): string {

  const entryBlockIds =
    new Set(
      entry.blockIds,
    );

  const sectionBlockIds =
    new Set(
      section.blockIds,
    );


  return document.readingOrder
    .filter(
      (
        item,
      ) =>
        entryBlockIds.has(
          item.blockId,
        ) &&
        sectionBlockIds.has(
          item.blockId,
        ),
    )
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
    )
    .map(
      (
        block,
      ) =>
        [
          `[BLOCK ${block.id}]`,
          `page=${block.page}`,
          `readingOrder=${block.readingOrder}`,
          `x=${block.bbox.x}`,
          `y=${block.bbox.y}`,
          `width=${block.bbox.width}`,
          `height=${block.bbox.height}`,
          `fontSize=${block.style.fontSize ?? "unknown"}`,
          `text=${JSON.stringify(block.text)}`,
        ].join(" "),
    )
    .join("\n");
}


// ============================================================
// FIELD EXTRACTION PROMPT
// ============================================================
//
// The model receives only one entry.
//
// It does not receive the complete resume.
//
// It does not decide section boundaries.
//
// It does not decide entry boundaries.
//
// ============================================================

const FIELD_EXTRACTION_PROMPT = `
You are the field extraction layer of a document
understanding pipeline.

You are given ONE already-discovered logical entry.

The section boundary and entry boundary have already been
determined before you receive this data.

Your ONLY responsibility is to identify semantic fields
supported by the supplied source blocks.

============================================================
ABSOLUTE RULES
============================================================

DO NOT:

- create another entry
- split the entry
- merge it with another entry
- use information outside the supplied blocks
- invent missing information
- rewrite source content
- summarize source content
- duplicate content into unrelated fields
- create a field without evidence

Every field MUST reference one or more supplied block IDs.

============================================================
FIELD SEMANTICS
============================================================

Understand what the source means.

Do not rely on exact section names.

Possible field meanings include:

- company
- title
- location
- start_date
- end_date
- entry_type
- project_title
- technologies
- description
- bullet
- institution
- degree
- field_of_study
- grade
- certification_name
- issuer
- publication_title
- authorship
- venue
- identifier

The field name should describe the meaning of the evidence.

============================================================
CRITICAL DUPLICATION RULE
============================================================

A heading is NOT automatically a description.

A heading is NOT automatically a bullet.

A company/title line is NOT automatically a bullet.

A project title is NOT automatically a description.

A certification name is NOT automatically a description.

Only create a description or bullet when the source blocks
actually contain separate descriptive content.

For example:

BLOCK A:
"Banking Customer Churn Prediction Analytics"

BLOCK B:
"Developed an end-to-end analytics solution..."

Correct:

project_title → BLOCK A
description/bullet → BLOCK B

Incorrect:

project_title → BLOCK A
description → BLOCK A
bullet → BLOCK A

============================================================
EXPERIENCE
============================================================

If one source block contains:

"Junior Software Developer | Snowtech Global Software"

it may support:

title
company

But do not copy the entire block into both fields unless the
specific values are actually supported.

If separate blocks contain responsibilities, those blocks may
become bullets.

============================================================
CERTIFICATIONS
============================================================

If the source contains:

"Data Analytics Internship"
"NoviTech R&D Pvt Ltd"
"2026"

then the evidence may support:

certification_name
issuer
date

Do NOT create:

description =
"Data Analytics Internship NoviTech R&D Pvt Ltd 2026"

unless a separate description actually exists.

============================================================
PROJECTS
============================================================

Keep project title and project content separate.

Do not repeat the project title as a bullet.

Do not repeat the project title as description.

============================================================
EDUCATION
============================================================

Institution, degree, field, dates and grade are separate
semantic fields when the evidence supports them.

Do not create descriptions unless they actually exist.

============================================================
EVIDENCE
============================================================

Only use block IDs supplied in the input.

Never invent block IDs.

If uncertain about ownership, omit the field.

============================================================
CONFIDENCE
============================================================

Return confidence between 0 and 1.

Use:

0.85–1.00 = clearly supported
0.60–0.84 = probable
below 0.60 = ambiguous

Prefer omission over fabrication.

============================================================
OUTPUT
============================================================

Return ONLY JSON:

{
  "fields": [
    {
      "id": "field-001",
      "name": "company",
      "value": "Example Company",
      "blockIds": ["p1-b20"],
      "confidence": 0.96
    }
  ]
}

Rules:

- Every field requires evidence.
- Every evidence ID must come from the supplied entry.
- Do not create entries.
- Do not create sections.
- Do not duplicate headings as bullets.
- Do not duplicate headings as descriptions.
- Preserve source meaning.
- Do not invent facts.
`;


// ============================================================
// GEMINI REQUEST
// ============================================================

async function callGeminiForFields(
  document: ResumeDocumentIR,
  section: ResumeSectionIR,
  entry: ResumeEntryIR,
): Promise<unknown> {

  const apiKey =
    process.env.GEMINI_API_KEY;


  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured.",
    );
  }


  const entryText =
    serializeEntry(
      document,
      section,
      entry,
    );


  const prompt = [
    FIELD_EXTRACTION_PROMPT,

    "",

    "SECTION:",
    `Semantic classification: ${
      section.semanticClassification.label
    }`,

    `Section title: ${
      JSON.stringify(
        section.title?.text ?? null,
      )
    }`,

    "",

    "ENTRY:",
    `Entry ID: ${entry.id}`,
    `Entry confidence: ${entry.confidence}`,

    "",

    "SOURCE BLOCKS:",
    entryText,
  ].join("\n");


  const response =
    await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=" +
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
                role:
                  "user",

                parts: [
                  {
                    text:
                      prompt,
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
      `Gemini field extraction ${response.status}: ${responseText}`,
    );
  }


  let apiResponse:
    unknown;


  try {

    apiResponse =
      JSON.parse(
        responseText,
      );

  } catch {

    throw new Error(
      "Gemini returned invalid API JSON.",
    );
  }


  if (
    !isObject(apiResponse)
  ) {

    throw new Error(
      "Invalid Gemini API response.",
    );
  }


  const candidates =
    apiResponse.candidates;


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


  const candidate =
    candidates[0];


  if (
    !isObject(candidate)
  ) {

    throw new Error(
      "Invalid Gemini candidate.",
    );
  }


  const content =
    candidate.content;


  if (
    !isObject(content)
  ) {

    throw new Error(
      "Gemini candidate has no content.",
    );
  }


  const parts =
    content.parts;


  if (
    !Array.isArray(parts)
  ) {

    throw new Error(
      "Gemini candidate has no parts.",
    );
  }


  const modelText =
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
      .join("")
      .trim();


  if (
    !modelText
  ) {

    throw new Error(
      "Gemini returned empty field extraction output.",
    );
  }


  try {

    return JSON.parse(
      modelText,
    );

  } catch {

    throw new Error(
      "Gemini returned invalid field extraction JSON.",
    );
  }
}


// ============================================================
// NORMALIZE FIELD
// ============================================================

function normalizeField(
  document: ResumeDocumentIR,
  entry: ResumeEntryIR,
  raw: RawField,
  index: number,
): ResumeFieldIR | null {

  const name =
    asString(
      raw.name,
    );


  const value =
    asString(
      raw.value,
    );


  const evidenceIds =
    Array.from(
      new Set(
        asStringArray(
          raw.blockIds,
        ).filter(
          (
            blockId,
          ) =>
            entry.blockIds.includes(
              blockId,
            ),
        ),
      ),
    );


  // ----------------------------------------------------------
  // Reject fields without semantic name.
  // ----------------------------------------------------------

  if (
    !name
  ) {
    return null;
  }


  // ----------------------------------------------------------
  // Reject fields without evidence.
  // ----------------------------------------------------------

  if (
    evidenceIds.length ===
    0
  ) {
    return null;
  }


  const confidence =
    clampConfidence(
      raw.confidence,
    );


  return {

    id:
      asString(
        raw.id,
      ) ??
      `${entry.id}-field-${String(
        index + 1,
      ).padStart(
        3,
        "0",
      )}`,

    entryId:
      entry.id,

    name,

    value,

    blockIds:
      evidenceIds,

    confidence,

    status:
      confidenceStatus(
        confidence,
      ),

    provenance:
      createFieldProvenance(
        document,
        evidenceIds,
        confidence,
      ),
  };
}


// ============================================================
// EXACT DUPLICATE FIELD REMOVAL
// ============================================================

function removeExactDuplicates(
  fields: ResumeFieldIR[],
): ResumeFieldIR[] {

  const seen =
    new Set<string>();


  const result:
    ResumeFieldIR[] = [];


  for (
    const field of
    fields
  ) {

    const key =
      [
        field.name
          .trim()
          .toLowerCase(),

        field.value
          ?.trim()
          .toLowerCase() ??
          "",

        field.blockIds
          .slice()
          .sort()
          .join("|"),
      ].join("::");


    if (
      seen.has(key)
    ) {
      continue;
    }


    seen.add(key);

    result.push(
      field,
    );
  }


  return result;
}


// ============================================================
// FIELD EXTRACTION FOR ONE ENTRY
// ============================================================

export async function extractFieldsForEntry(
  document: ResumeDocumentIR,
  section: ResumeSectionIR,
  entry: ResumeEntryIR,
): Promise<ResumeFieldIR[]> {

  const rawResponse =
    await callGeminiForFields(
      document,
      section,
      entry,
    );


  if (
    !isObject(rawResponse)
  ) {

    throw new Error(
      `Invalid field extraction response for ${entry.id}.`,
    );
  }


  const rawFields =
    Array.isArray(
      rawResponse.fields,
    )
      ? rawResponse.fields
      : [];


  const fields:
    ResumeFieldIR[] = [];


  for (
    let index = 0;
    index < rawFields.length;
    index++
  ) {

    const raw =
      rawFields[index];


    if (
      !isObject(raw)
    ) {
      continue;
    }


    const field =
      normalizeField(
        document,
        entry,
        raw as RawField,
        index,
      );


    if (
      field
    ) {

      fields.push(
        field,
      );
    }
  }


  return removeExactDuplicates(
    fields,
  );
}


// ============================================================
// FIELD EXTRACTION FOR ENTIRE DOCUMENT
// ============================================================

export async function extractFields(
  document: ResumeDocumentIR,
): Promise<ResumeDocumentIR> {

  const sections:
    ResumeSectionIR[] = [];


  for (
    const section of
    document.sections
  ) {

    const entries:
      ResumeEntryIR[] = [];


    for (
      const entry of
      section.entries
    ) {

      const fields =
        await extractFieldsForEntry(
          document,
          section,
          entry,
        );


      entries.push({

        ...entry,

        fields,
      });
    }


    sections.push({

      ...section,

      entries,
    });
  }


  return {

    ...document,

    sections,
  };
}


// ============================================================
// SUMMARY
// ============================================================

export function summarizeFieldExtraction(
  document: ResumeDocumentIR,
) {

  return document.sections.map(
    (
      section,
    ) => ({

      sectionId:
        section.id,

      sectionTitle:
        section.title?.text ??
        null,

      entries:
        section.entries.map(
          (
            entry,
          ) => ({

            entryId:
              entry.id,

            fields:
              entry.fields.map(
                (
                  field,
                ) => ({

                  id:
                    field.id,

                  name:
                    field.name,

                  value:
                    field.value,

                  blockIds:
                    field.blockIds,

                  confidence:
                    field.confidence,
                }),
              ),
          }),
        ),
    }),
  );
}