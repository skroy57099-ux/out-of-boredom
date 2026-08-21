// components/BorePlay/ResumeAnalyzer/ir/document-builder.ts

import {
  buildReadingOrder,
} from "./reading-order";

import type {
  ResumeDocument,
  DocumentBlock,
} from "../document/document-layout";

import type {
  ResumeDocumentIR,
  DocumentBlockIR,
  DocumentPageIR,
  Provenance,
} from "./types";

import {
  validateDocumentIR,
} from "./validation";


// ============================================================
// DOCUMENT ID
// ============================================================

function createDocumentId(): string {
  return `resume-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}


// ============================================================
// NORMALIZE TEXT
// ============================================================
//
// This only normalizes whitespace.
//
// It does NOT interpret the text.
//
// ============================================================

function normalizeText(
  text: string,
): string {

  return text
    .replace(/\s+/g, " ")
    .trim();
}


// ============================================================
// CREATE BLOCK PROVENANCE
// ============================================================

function createBlockProvenance(
  block: DocumentBlock,
): Provenance {

  return {
    blockIds: [
      block.id,
    ],

    pageNumbers: [
      block.page,
    ],

    sourceText:
      block.text,

    extractionStage:
      "layout",

    confidence:
      1,

    status:
      "confirmed",
  };
}


// ============================================================
// CONVERT RAW BLOCK → IR BLOCK
// ============================================================
//
// IMPORTANT:
//
// This function does NOT determine:
//
// - experience
// - projects
// - education
// - certifications
// - skills
//
// It simply preserves the source document.
//
// ============================================================

function convertBlock(
  block: DocumentBlock,
  sourceOrder: number,
): DocumentBlockIR {

  return {

    id:
      block.id,

    page:
      block.page,

    text:
      normalizeText(
        block.text,
      ),

    bbox: {

      x:
        block.x,

      y:
        block.y,

      width:
        block.width,

      height:
        block.height,
    },

    style: {

      fontSize:
        block.fontSize,

      fontName:
        block.fontName,

      isBold:
        block.isBold,
    },

    /*
     * At this point this is the ORIGINAL
     * PDF extraction order.
     *
     * The layout-aware reading-order layer
     * will replace this later.
     */

    readingOrder:
      sourceOrder,

    ownership: {

      status:
        "unassigned",

      references: [],

      candidates: [],
    },

    provenance:
      createBlockProvenance(
        block,
      ),
  };
}


// ============================================================
// BUILD PAGES
// ============================================================
//
// Pages only contain references to their blocks.
//
// They do not interpret those blocks.
//
// ============================================================

function buildPages(
  document: ResumeDocument,
  blocks: DocumentBlockIR[],
): DocumentPageIR[] {

  return document.pages.map(
    (
      page,
    ) => {

      const pageBlocks =
        blocks.filter(
          (
            block,
          ) =>
            block.page ===
            page.page,
        );


      return {

        page:
          page.page,

        width:
          page.width,

        height:
          page.height,

        blockIds:
          pageBlocks.map(
            (
              block,
            ) =>
              block.id,
          ),
      };
    },
  );
}


// ============================================================
// BUILD DOCUMENT IR
// ============================================================
//
// This is Layer 1 + preparation for Layer 2.
//
// Pipeline:
//
// PDF.js
//   ↓
// raw document
//   ↓
// DocumentBlockIR
//   ↓
// layout-aware reading order
//   ↓
// validated DocumentIR
//
// Sections remain EMPTY.
//
// That is intentional.
//
// ============================================================

export function buildDocumentIR(
  document: ResumeDocument,
): ResumeDocumentIR {

  // ----------------------------------------------------------
  // Create document identifier
  // ----------------------------------------------------------

  const documentId =
    createDocumentId();


  // ----------------------------------------------------------
  // Convert every PDF block into an IR block.
  //
  // source index is preserved initially.
  // ----------------------------------------------------------

  const blocks =
    document.blocks.map(
      (
        block,
        index,
      ) =>
        convertBlock(
          block,
          index,
        ),
    );


  // ----------------------------------------------------------
  // Build page representation.
  // ----------------------------------------------------------

  const pages =
    buildPages(
      document,
      blocks,
    );


  // ----------------------------------------------------------
  // Create the initial IR.
  //
  // There are deliberately NO sections,
  // entries, or fields yet.
  // ----------------------------------------------------------

  const initialIR:
    ResumeDocumentIR =
    {

      documentId,

      pages,

      blocks,

      readingOrder:
        blocks.map(
          (
            block,
            index,
          ) => ({

            position:
              index,

            blockId:
              block.id,

            page:
              block.page,
          }),
        ),

      sections: [],

      validation: {

        valid:
          true,

        issues: [],

        statistics: {

          totalPages:
            pages.length,

          totalBlocks:
            blocks.length,

          totalSections:
            0,

          totalEntries:
            0,

          totalFields:
            0,

          ownedBlocks:
            0,

          orphanBlocks:
            0,

          ambiguousBlocks:
            0,

          duplicateEvidenceGroups:
            0,
        },
      },
    };


  // ----------------------------------------------------------
  // Layer 2:
  //
  // Replace the initial PDF extraction order
  // with the layout-aware reading order.
  // ----------------------------------------------------------

  const orderedIR =
    buildReadingOrder(
      initialIR,
    );


  // ----------------------------------------------------------
  // Validate the resulting IR.
  // ----------------------------------------------------------

  return validateDocumentIR(
    orderedIR,
  );
}


// ============================================================
// DEBUG / INSPECTION HELPER
// ============================================================
//
// This is intentionally independent from the UI.
//
// It lets us inspect the intermediate representation while
// developing the pipeline.
//
// ============================================================

export function summarizeDocumentIR(
  document: ResumeDocumentIR,
) {

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


  return {

    documentId:
      document.documentId,

    pages:
      document.pages.length,

    blocks:
      document.blocks.length,

    sections:
      document.sections.length,

    entries:
      totalEntries,

    fields:
      totalFields,

    validation:
      document.validation,
  };
}