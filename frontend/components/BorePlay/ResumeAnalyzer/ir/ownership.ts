// components/BorePlay/ResumeAnalyzer/ir/ownership.ts

import type {
  ResumeDocumentIR,
  ResumeSectionIR,
  ResumeEntryIR,
  ResumeFieldIR,
  DocumentBlockIR,
} from "./types";


// ============================================================
// HELPERS
// ============================================================

function pushUnique(
  array: string[],
  value: string,
) {
  if (!array.includes(value)) {
    array.push(value);
  }
}


// ============================================================
// BUILD OWNERSHIP INDEX
// ============================================================

export function buildOwnershipIndex(
  document: ResumeDocumentIR,
): Map<
  string,
  {
    sections: string[];
    entries: string[];
    fields: string[];
  }
> {

  const index =
    new Map<
      string,
      {
        sections: string[];
        entries: string[];
        fields: string[];
      }
    >();


  function get(
    blockId: string,
  ) {

    if (!index.has(blockId)) {

      index.set(
        blockId,
        {
          sections: [],
          entries: [],
          fields: [],
        },
      );
    }

    return index.get(
      blockId,
    )!;
  }


  for (
    const section of
    document.sections
  ) {

    for (
      const blockId of
      section.blockIds
    ) {

      pushUnique(
        get(blockId).sections,
        section.id,
      );
    }


    for (
      const entry of
      section.entries
    ) {

      for (
        const blockId of
        entry.blockIds
      ) {

        pushUnique(
          get(blockId).entries,
          entry.id,
        );
      }


      for (
        const field of
        entry.fields
      ) {

        for (
          const blockId of
          field.blockIds
        ) {

          pushUnique(
            get(blockId).fields,
            field.id,
          );
        }
      }
    }
  }


  return index;
}


// ============================================================
// APPLY OWNERSHIP
// ============================================================

export function applyOwnership(
  document: ResumeDocumentIR,
): ResumeDocumentIR {

  const index =
    buildOwnershipIndex(
      document,
    );


  const blocks =
    document.blocks.map(
      (block) => {

        const ownership =
          index.get(
            block.id,
          );


        if (!ownership) {

          return {
            ...block,

            ownership: {
              status: "orphan" as const,

              references: [],

              candidates: [],
            },
          };
        }


        const references =
          ownership.entries.map(
            (entryId) => {

              const section =
                document.sections.find(
                  (candidate) =>
                    candidate.entries.some(
                      (entry) =>
                        entry.id ===
                        entryId,
                    ),
                );


              return {
                sectionId:
                  section?.id ??
                  "",

                entryId,

                reason:
                  "Block belongs to entry.",

                confidence:
                  1,
              };
            },
          );


        if (
          ownership.entries.length >
          1
        ) {

          return {
            ...block,

            ownership: {
              status:
                "ambiguous" as const,

              references,

              candidates:
                ownership.entries,
            },
          };
        }


        if (
          ownership.entries.length ===
          1
        ) {

          return {
            ...block,

            ownership: {
              status:
                "entry_owned" as const,

              references,

              candidates: [],
            },
          };
        }


        if (
          ownership.sections.length >
          0
        ) {

          return {
            ...block,

            ownership: {
              status:
                "section_owned" as const,

              references:
                ownership.sections.map(
                  (sectionId) => ({
                    sectionId,

                    entryId: null,

                    reason:
                      "Section-level content.",

                    confidence:
                      1,
                  }),
                ),

              candidates: [],
            },
          };
        }


        return {
          ...block,

          ownership: {
            status:
              "orphan" as const,

            references: [],

            candidates: [],
          },
        };
      },
    );


  return {
    ...document,

    blocks,
  };
}


// ============================================================
// FIND BLOCK
// ============================================================

export function findBlock(
  document: ResumeDocumentIR,
  blockId: string,
): DocumentBlockIR | null {

  return (
    document.blocks.find(
      (block) =>
        block.id ===
        blockId,
    ) ??
    null
  );
}


// ============================================================
// FIND SECTION
// ============================================================

export function findSection(
  document: ResumeDocumentIR,
  sectionId: string,
): ResumeSectionIR | null {

  return (
    document.sections.find(
      (section) =>
        section.id ===
        sectionId,
    ) ??
    null
  );
}


// ============================================================
// FIND ENTRY
// ============================================================

export function findEntry(
  document: ResumeDocumentIR,
  entryId: string,
): ResumeEntryIR | null {

  for (
    const section of
    document.sections
  ) {

    const entry =
      section.entries.find(
        (candidate) =>
          candidate.id ===
          entryId,
      );

    if (entry) {
      return entry;
    }
  }

  return null;
}


// ============================================================
// FIND FIELD
// ============================================================

export function findField(
  document: ResumeDocumentIR,
  fieldId: string,
): ResumeFieldIR | null {

  for (
    const section of
    document.sections
  ) {

    for (
      const entry of
      section.entries
    ) {

      const field =
        entry.fields.find(
          (candidate) =>
            candidate.id ===
            fieldId,
        );

      if (field) {
        return field;
      }
    }
  }

  return null;
}