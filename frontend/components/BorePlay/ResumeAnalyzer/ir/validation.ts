// components/BorePlay/ResumeAnalyzer/ir/validation.ts

import type {
  ResumeDocumentIR,
  ValidationIssue,
} from "./types";

import {
  buildOwnershipIndex,
} from "./ownership";


// ============================================================
// VALIDATE DOCUMENT IR
// ============================================================

export function validateDocumentIR(
  document: ResumeDocumentIR,
): ResumeDocumentIR {

  const issues:
    ValidationIssue[] = [];


  const ownershipIndex =
    buildOwnershipIndex(
      document,
    );


  const validBlockIds =
    new Set(
      document.blocks.map(
        (block) =>
          block.id,
      ),
    );


  const sectionIds =
    new Set(
      document.sections.map(
        (section) =>
          section.id,
      ),
    );


  const entryIds =
    new Set(
      document.sections.flatMap(
        (section) =>
          section.entries.map(
            (entry) =>
              entry.id,
          ),
      ),
    );


  // ==========================================================
  // BLOCK OWNERSHIP
  // ==========================================================

  for (
    const block of
    document.blocks
  ) {

    const ownership =
      ownershipIndex.get(
        block.id,
      );


    if (!ownership) {

      issues.push({
        code:
          "ORPHAN_BLOCK",

        severity:
          "warning",

        message:
          `Block ${block.id} has no semantic owner.`,

        blockIds: [
          block.id,
        ],

        sectionIds: [],

        entryIds: [],
      });

      continue;
    }


    if (
      ownership.entries.length >
      1
    ) {

      issues.push({
        code:
          "DUPLICATE_BLOCK_OWNERSHIP",

        severity:
          "error",

        message:
          `Block ${block.id} belongs to multiple entries.`,

        blockIds: [
          block.id,
        ],

        sectionIds:
          ownership.sections,

        entryIds:
          ownership.entries,
      });
    }


    if (
      ownership.sections.length >
      1
    ) {

      issues.push({
        code:
          "CROSS_SECTION_MOVEMENT",

        severity:
          "error",

        message:
          `Block ${block.id} appears in multiple sections.`,

        blockIds: [
          block.id,
        ],

        sectionIds:
          ownership.sections,

        entryIds:
          ownership.entries,
      });
    }
  }


  // ==========================================================
  // SECTION REFERENCES
  // ==========================================================

  for (
    const section of
    document.sections
  ) {

    for (
      const blockId of
      section.blockIds
    ) {

      if (
        !validBlockIds.has(
          blockId,
        )
      ) {

        issues.push({
          code:
            "INVALID_BLOCK_REFERENCE",

          severity:
            "error",

          message:
            `Section ${section.id} references missing block ${blockId}.`,

          blockIds: [
            blockId,
          ],

          sectionIds: [
            section.id,
          ],

          entryIds: [],
        });
      }
    }


    // ========================================================
    // ENTRY REFERENCES
    // ========================================================

    for (
      const entry of
      section.entries
    ) {

      if (
        entry.sectionId !==
        section.id
      ) {

        issues.push({
          code:
            "INVALID_ENTRY_SECTION",

          severity:
            "error",

          message:
            `Entry ${entry.id} claims to belong to ${entry.sectionId}, but is stored under ${section.id}.`,

          blockIds:
            entry.blockIds,

          sectionIds: [
            section.id,
            entry.sectionId,
          ],

          entryIds: [
            entry.id,
          ],
        });
      }


      if (
        !sectionIds.has(
          entry.sectionId,
        )
      ) {

        issues.push({
          code:
            "INVALID_ENTRY_SECTION",

          severity:
            "error",

          message:
            `Entry ${entry.id} references unknown section ${entry.sectionId}.`,

          blockIds:
            entry.blockIds,

          sectionIds: [
            entry.sectionId,
          ],

          entryIds: [
            entry.id,
          ],
        });
      }


      for (
        const blockId of
        entry.blockIds
      ) {

        if (
          !validBlockIds.has(
            blockId,
          )
        ) {

          issues.push({
            code:
              "INVALID_BLOCK_REFERENCE",

            severity:
              "error",

            message:
              `Entry ${entry.id} references missing block ${blockId}.`,

            blockIds: [
              blockId,
            ],

            sectionIds: [
              section.id,
            ],

            entryIds: [
              entry.id,
            ],
          });
        }
      }


      // ======================================================
      // FIELD REFERENCES
      // ======================================================

      for (
        const field of
        entry.fields
      ) {

        if (
          field.entryId !==
          entry.id
        ) {

          issues.push({
            code:
              "INVALID_FIELD_ENTRY",

            severity:
              "error",

            message:
              `Field ${field.id} references ${field.entryId} instead of ${entry.id}.`,

            blockIds:
              field.blockIds,

            sectionIds: [
              section.id,
            ],

            entryIds: [
              entry.id,
              field.entryId,
            ],
          });
        }


        if (
          !entryIds.has(
            field.entryId,
          )
        ) {

          issues.push({
            code:
              "INVALID_FIELD_ENTRY",

            severity:
              "error",

            message:
              `Field ${field.id} references an unknown entry.`,

            blockIds:
              field.blockIds,

            sectionIds: [
              section.id,
            ],

            entryIds: [
              field.entryId,
            ],
          });
        }
      }
    }
  }


  // ==========================================================
  // DUPLICATE EVIDENCE
  // ==========================================================

  const evidenceOwners =
    new Map<
      string,
      string[]
    >();


  for (
    const section of
    document.sections
  ) {

    for (
      const entry of
      section.entries
    ) {

      const key =
        entry.blockIds
          .slice()
          .sort()
          .join("|");


      if (
        !evidenceOwners.has(
          key,
        )
      ) {

        evidenceOwners.set(
          key,
          [],
        );
      }


      evidenceOwners
        .get(key)!
        .push(
          entry.id,
        );
    }
  }


  for (
    const [
      blockKey,
      owners,
    ] of
    evidenceOwners
  ) {

    if (
      owners.length >
      1
    ) {

      const blockIds =
        blockKey
          .split("|")
          .filter(Boolean);


      issues.push({
        code:
          "DUPLICATE_EVIDENCE",

        severity:
          "error",

        message:
          `Multiple entries use identical source evidence: ${owners.join(", ")}.`,

        blockIds,

        sectionIds: [],

        entryIds:
          owners,
      });
    }
  }


  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalEntries =
    document.sections.reduce(
      (
        total,
        section,
      ) =>
        total +
        section.entries.length,
      0,
    );


  const totalFields =
    document.sections.reduce(
      (
        total,
        section,
      ) =>
        total +
        section.entries.reduce(
          (
            entryTotal,
            entry,
          ) =>
            entryTotal +
            entry.fields.length,
          0,
        ),
      0,
    );


  const ownedBlocks =
    document.blocks.filter(
      (block) =>
        block.ownership.status ===
        "entry_owned" ||
        block.ownership.status ===
        "section_owned",
    ).length;


  const orphanBlocks =
    document.blocks.filter(
      (block) =>
        block.ownership.status ===
        "orphan",
    ).length;


  const ambiguousBlocks =
    document.blocks.filter(
      (block) =>
        block.ownership.status ===
        "ambiguous",
    ).length;


  const duplicateEvidenceGroups =
    Array.from(
      evidenceOwners.values(),
    ).filter(
      (owners) =>
        owners.length > 1,
    ).length;


  return {
    ...document,

    validation: {
      valid:
        !issues.some(
          (issue) =>
            issue.severity ===
            "error",
        ),

      issues,

      statistics: {
        totalPages:
          document.pages.length,

        totalBlocks:
          document.blocks.length,

        totalSections:
          document.sections.length,

        totalEntries,

        totalFields,

        ownedBlocks,

        orphanBlocks,

        ambiguousBlocks,

        duplicateEvidenceGroups,
      },
    },
  };
}