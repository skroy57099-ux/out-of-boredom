// components/BorePlay/ResumeAnalyzer/intelligence/entry-discovery.ts

import type {
  ResumeDocumentIR,
  ResumeSectionIR,
  ResumeEntryIR,
  Provenance,
} from "../ir/types";


// ============================================================
// ENTRY DISCOVERY
// ============================================================
//
// Pipeline:
//
//   Document IR
//       ↓
//   Section Discovery
//       ↓
//   ENTRY DISCOVERY
//       ↓
//   Field Extraction
//       ↓
//   Canonical Resume
//
// This layer ONLY determines:
//
//   "Which blocks belong to the same logical entry?"
//
// It does NOT extract:
//   company
//   title
//   issuer
//   dates
//   bullets
//   project name
//   degree
//   certification name
//
// Those belong to field extraction.
//
// ============================================================


// ============================================================
// RAW GEMINI RESPONSE
// ============================================================

interface RawEntry {
  id?: unknown;
  blockIds?: unknown;
  confidence?: unknown;
}

interface RawEntryDiscoveryResponse {
  entries?: unknown;
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

  const text =
    value.trim();

  return text || null;
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
// SERIALIZE ONE SECTION
// ============================================================
//
// Only the blocks belonging to this section are sent.
//
// This is deliberate.
//
// We do NOT send the entire resume while discovering entries.
//
// ============================================================

function serializeSectionBlocks(
  document: ResumeDocumentIR,
  section: ResumeSectionIR,
): string {

  const sectionBlockIds =
    new Set(
      section.blockIds,
    );


  const orderedBlocks =
    document.readingOrder
      .filter(
        (
          item,
        ) =>
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
      );


  return orderedBlocks
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
// PROMPT
// ============================================================

const ENTRY_DISCOVERY_PROMPT = `
You are analyzing ONE already-discovered section of an
unknown document.

Your ONLY job is to determine the distinct logical entries
inside this section.

Do NOT extract fields.

Do NOT return:

- company names
- job titles
- project names
- certification names
- issuers
- dates
- degrees
- technologies
- skills
- descriptions
- bullets

Those will be extracted later.

============================================================
WHAT IS AN ENTRY?
============================================================

An entry is one coherent real-world item represented by a group
of document blocks.

Examples:

- one employment record
- one internship
- one project
- one educational record
- one certification
- one publication
- one award

The exact semantic type of the parent section is already known.

Your job is only to separate entries.

============================================================
IMPORTANT
============================================================

A section heading is NOT an entry.

A bullet is NOT automatically an entry.

A wrapped line is NOT a new entry.

A continuation line is NOT a new entry.

Several blocks describing one real-world item MUST remain one
entry.

Independent real-world items MUST remain separate.

============================================================
USE DOCUMENT STRUCTURE
============================================================

Use:

- spatial position
- reading order
- typography
- font size
- indentation
- repeated formatting
- dates as boundary evidence
- nearby blocks
- columns
- visual grouping

Do not assume that every resume follows the same layout.

============================================================
SOURCE BLOCKS
============================================================

Every entry MUST reference original block IDs.

Use ONLY block IDs supplied in the input.

Never invent block IDs.

Never copy the same block into multiple entries.

If ownership is uncertain, prefer leaving the block unassigned
rather than duplicating it.

============================================================
NO CONTENT GENERATION
============================================================

Do not summarize.

Do not rewrite.

Do not generate descriptions.

Do not infer missing facts.

The output is ONLY an ownership map.

============================================================
CONFIDENCE
============================================================

Return confidence from 0 to 1.

High confidence:
The entry boundary is strongly supported.

Medium confidence:
The boundary is probable.

Low confidence:
The boundary is ambiguous.

Prefer uncertainty over fabricated structure.

============================================================
OUTPUT
============================================================

Return ONLY valid JSON:

{
  "entries": [
    {
      "id": "entry-001",
      "blockIds": [
        "p1-b10",
        "p1-b11"
      ],
      "confidence": 0.95
    }
  ]
}

Nothing else.
`;


// ============================================================
// GEMINI REQUEST
// ============================================================

async function callGeminiForEntries(
  document: ResumeDocumentIR,
  section: ResumeSectionIR,
): Promise<unknown> {

  const apiKey =
    process.env.GEMINI_API_KEY;


  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured.",
    );
  }


  const sectionBlocks =
    serializeSectionBlocks(
      document,
      section,
    );


  const prompt = [
    ENTRY_DISCOVERY_PROMPT,
    "",
    "SECTION INFORMATION:",
    `Section title: ${JSON.stringify(
      section.title?.text ?? null,
    )}`,
    `Section type: ${section.semanticClassification.label}`,
    "",
    "SECTION BLOCKS:",
    sectionBlocks,
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
      `Gemini entry discovery ${response.status}: ${responseText}`,
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
      "Gemini returned empty entry discovery output.",
    );
  }


  try {

    return JSON.parse(
      modelText,
    );

  } catch {

    throw new Error(
      "Gemini returned invalid entry discovery JSON.",
    );
  }
}


// ============================================================
// VALIDATE BLOCK OWNERSHIP
// ============================================================

function validateEntryBlockIds(
  section: ResumeSectionIR,
  blockIds: string[],
): string[] {

  const allowed =
    new Set(
      section.blockIds,
    );


  return Array.from(
    new Set(
      blockIds.filter(
        (
          blockId,
        ) =>
          allowed.has(
            blockId,
          ),
      ),
    ),
  );
}


// ============================================================
// PROVENANCE
// ============================================================

function createEntryProvenance(
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
      "entry_discovery",

    confidence,

    status:
      confidence >= 0.85
        ? "confirmed"
        : confidence >= 0.60
          ? "probable"
          : "ambiguous",
  };
}


// ============================================================
// NORMALIZE ENTRY
// ============================================================

function normalizeEntry(
  document: ResumeDocumentIR,
  section: ResumeSectionIR,
  raw: RawEntry,
  index: number,
): ResumeEntryIR | null {

  const blockIds =
    validateEntryBlockIds(
      section,
      asStringArray(
        raw.blockIds,
      ),
    );


  if (
    blockIds.length ===
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
        asString(raw.id) ??
        `${section.id}-entry-${String(index + 1).padStart(3, "0")}`,

      sectionId:
        section.id,

      order:
        index,

      blockIds,

      rawText:
        blockIds
          .map(
            (blockId) =>
              document.blocks.find(
                (block) =>
                  block.id === blockId,
              )?.text ?? "",
          )
          .filter(Boolean)
          .join("\n"),

      fields: [],

      provenance:
        createEntryProvenance(
          document,
          blockIds,
          confidence,
        ),

      confidence,

      status:
        confidence >= 0.85
          ? "confirmed"
          : confidence >= 0.60
            ? "probable"
            : "ambiguous",
    };
}


// ============================================================
// DUPLICATE EVIDENCE
// ============================================================

function findDuplicateEvidence(
  entries: ResumeEntryIR[],
): Array<{
  blockId: string;
  entryIds: string[];
}> {

  const owners =
    new Map<
      string,
      string[]
    >();


  for (
    const entry of
    entries
  ) {

    for (
      const blockId of
      entry.blockIds
    ) {

      const existing =
        owners.get(
          blockId,
        ) ??
        [];


      existing.push(
        entry.id,
      );


      owners.set(
        blockId,
        existing,
      );
    }
  }


  return Array.from(
    owners.entries(),
  )
    .filter(
      (
        [
          ,
          entryIds,
        ],
      ) =>
        new Set(
          entryIds,
        ).size >
        1,
    )
    .map(
      (
        [
          blockId,
          entryIds,
        ],
      ) => ({

        blockId,

        entryIds:
          Array.from(
            new Set(
              entryIds,
            ),
          ),
      }),
    );
}


// ============================================================
// ORPHAN BLOCKS
// ============================================================

function findOrphanBlocks(
  section: ResumeSectionIR,
  entries: ResumeEntryIR[],
): string[] {

  const owned =
    new Set<string>();


  for (
    const entry of
    entries
  ) {

    for (
      const blockId of
      entry.blockIds
    ) {

      owned.add(
        blockId,
      );
    }
  }


  return section.blockIds.filter(
    (
      blockId,
    ) =>
      !owned.has(
        blockId,
      ),
  );
}


// ============================================================
// ONE SECTION
// ============================================================

export async function discoverEntriesForSection(
  document: ResumeDocumentIR,
  section: ResumeSectionIR,
): Promise<{
  section: ResumeSectionIR;
  orphanBlockIds: string[];
  duplicateEvidence: Array<{
    blockId: string;
    entryIds: string[];
  }>;
}> {

  const rawResponse =
    await callGeminiForEntries(
      document,
      section,
    );


  if (
    !isObject(rawResponse)
  ) {

    throw new Error(
      `Invalid entry discovery response for ${section.id}.`,
    );
  }


  const rawEntries =
    Array.isArray(
      rawResponse.entries,
    )
      ? rawResponse.entries
      : [];


  const entries:
    ResumeEntryIR[] = [];


  for (
    let index = 0;
    index < rawEntries.length;
    index++
  ) {

    const raw =
      rawEntries[index];


    if (
      !isObject(raw)
    ) {
      continue;
    }


    const entry =
      normalizeEntry(
        document,
        section,
        raw as RawEntry,
        index,
      );


    if (
      entry
    ) {

      entries.push(
        entry,
      );
    }
  }


  const duplicateEvidence =
    findDuplicateEvidence(
      entries,
    );


  const orphanBlockIds =
    findOrphanBlocks(
      section,
      entries,
    );


  return {

    section: {
      ...section,

      entries,
    },

    orphanBlockIds,

    duplicateEvidence,
  };
}


// ============================================================
// ENTIRE DOCUMENT
// ============================================================

export async function discoverEntries(
  document: ResumeDocumentIR,
): Promise<ResumeDocumentIR> {

  const sections:
    ResumeSectionIR[] = [];


  for (
    const section of
    document.sections
  ) {

    const result =
      await discoverEntriesForSection(
        document,
        section,
      );


    sections.push(
      result.section,
    );
  }


  return {
    ...document,

    sections,
  };
}


// ============================================================
// SUMMARY
// ============================================================

export function summarizeEntries(
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

      sectionType:
        section.semanticClassification.label,

      entries:
        section.entries.map(
          (
            entry,
          ) => ({

            id:
              entry.id,

            order:
              entry.order,

            blockIds:
              entry.blockIds,

            confidence:
              entry.confidence,
          }),
        ),
    }),
  );
}