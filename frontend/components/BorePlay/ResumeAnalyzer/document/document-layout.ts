// components/BorePlay/ResumeAnalyzer/document/document-layout.ts

import type {
  PDFDocumentProxy,
  TextItem,
} from "pdfjs-dist/types/src/display/api";


// ============================================================
// DOCUMENT BLOCK
// ============================================================

/**
 * A single piece of text extracted from a PDF.
 *
 * IMPORTANT:
 *
 * This structure deliberately contains layout information.
 *
 * We do NOT decide whether something is:
 *
 * - Experience
 * - Project
 * - Education
 * - Skill
 * - Certification
 * - etc.
 *
 * That happens in later semantic layers.
 */
export interface DocumentBlock {
  id: string;

  page: number;

  text: string;

  x: number;
  y: number;

  width: number;
  height: number;

  fontSize: number | null;

  fontName: string | null;

  isBold: boolean | null;
}


// ============================================================
// DOCUMENT PAGE
// ============================================================

export interface DocumentPage {
  page: number;

  width: number;

  height: number;

  blocks: DocumentBlock[];
}


// ============================================================
// COMPLETE DOCUMENT
// ============================================================

/**
 * Layer 1 representation.
 *
 * This contains only document/layout information.
 *
 * No semantic resume interpretation happens here.
 */
export interface ResumeDocument {
  pages: DocumentPage[];

  blocks: DocumentBlock[];

  plainText: string;
}


// ============================================================
// INTERNAL HELPERS
// ============================================================

function isTextItem(
  item: unknown,
): item is TextItem {

  return (
    typeof item === "object" &&
    item !== null &&
    "str" in item &&
    "transform" in item
  );
}


// ============================================================
// FONT SIZE
// ============================================================

function estimateFontSize(
  transform: number[],
): number | null {

  if (
    !transform ||
    transform.length < 6
  ) {
    return null;
  }


  const scaleX =
    Math.sqrt(
      transform[0] ** 2 +
        transform[1] ** 2,
    );


  const scaleY =
    Math.sqrt(
      transform[2] ** 2 +
        transform[3] ** 2,
    );


  const size =
    Math.max(
      scaleX,
      scaleY,
    );


  if (
    !Number.isFinite(size) ||
    size <= 0
  ) {
    return null;
  }


  return Number(
    size.toFixed(2),
  );
}


// ============================================================
// X COORDINATE
// ============================================================

function getX(
  transform: number[],
): number {

  if (
    !transform ||
    transform.length < 6
  ) {
    return 0;
  }


  return transform[4] ?? 0;
}


// ============================================================
// Y COORDINATE
// ============================================================

function getY(
  transform: number[],
): number {

  if (
    !transform ||
    transform.length < 6
  ) {
    return 0;
  }


  return transform[5] ?? 0;
}


// ============================================================
// MAIN DOCUMENT EXTRACTION
// ============================================================

export async function extractResumeDocument(
  pdfData: Uint8Array,
): Promise<ResumeDocument> {

  // ----------------------------------------------------------
  // IMPORTANT
  // ----------------------------------------------------------
  //
  // PDF.js is dynamically imported here rather than at module
  // initialization time.
  //
  // This prevents Next.js/Webpack from eagerly evaluating the
  // PDF.js ESM bundle when the API route is loaded.
  //
  // ----------------------------------------------------------

  const {
    getDocument,
  } = await import(
    "pdfjs-dist/legacy/build/pdf.mjs"
  );


  // ==========================================================
  // LOAD PDF
  // ==========================================================

  const loadingTask =
    getDocument({
      data:
        pdfData,

      useWorkerFetch:
        false,
    });


  const pdf:
    PDFDocumentProxy =
    await loadingTask.promise;


  // ==========================================================
  // DOCUMENT STORAGE
  // ==========================================================

  const pages:
    DocumentPage[] = [];


  const allBlocks:
    DocumentBlock[] = [];


  // ==========================================================
  // PROCESS EVERY PAGE
  // ==========================================================

  for (
    let pageNumber = 1;

    pageNumber <=
      pdf.numPages;

    pageNumber++
  ) {

    const page =
      await pdf.getPage(
        pageNumber,
      );


    const viewport =
      page.getViewport({
        scale:
          1,
      });


    const textContent =
      await page.getTextContent();


    const blocks:
      DocumentBlock[] = [];


    // ========================================================
    // PROCESS TEXT ITEMS
    // ========================================================

    let blockIndex =
      0;


    for (
      const item of
      textContent.items
    ) {

      if (
        !isTextItem(
          item,
        )
      ) {
        continue;
      }


      const text =
        item.str.trim();


      // ------------------------------------------------------
      // Ignore empty PDF fragments
      // ------------------------------------------------------

      if (
        !text
      ) {
        continue;
      }


      // ======================================================
      // TRANSFORM
      // ======================================================

      const transform =
        item.transform;


      // ======================================================
      // POSITION
      // ======================================================

      const x =
        getX(
          transform,
        );


      const y =
        getY(
          transform,
        );


      // ======================================================
      // FONT SIZE
      // ======================================================

      const fontSize =
        estimateFontSize(
          transform,
        );


      // ======================================================
      // DIMENSIONS
      // ======================================================

      const width =
        Number.isFinite(
          item.width,
        )
          ? item.width
          : 0;


      const height =
        Number.isFinite(
          item.height,
        )
          ? item.height
          : fontSize ??
            0;


      // ======================================================
      // FONT NAME
      // ======================================================

      const fontName =
        "fontName" in item &&
        typeof item.fontName ===
          "string"
          ? item.fontName
          : null;


      // ======================================================
      // CREATE BLOCK
      // ======================================================

      const block:
        DocumentBlock =
        {
          id:
            `p${pageNumber}-b${blockIndex}`,

          page:
            pageNumber,

          text,

          x,

          y,

          width,

          height,

          fontSize,

          fontName,

          // PDF.js does not reliably expose bold
          // information for every document.
          //
          // Therefore we deliberately leave this
          // unknown rather than guessing.

          isBold:
            null,
        };


      blocks.push(
        block,
      );


      allBlocks.push(
        block,
      );


      blockIndex++;
    }


    // ========================================================
    // STORE PAGE
    // ========================================================

    pages.push({

      page:
        pageNumber,

      width:
        viewport.width,

      height:
        viewport.height,

      blocks,
    });
  }


  // ==========================================================
  // CREATE BASIC PLAIN TEXT
  // ==========================================================

  const plainText =
    pages
      .map(
        (
          page,
        ) =>
          page.blocks
            .map(
              (
                block,
              ) =>
                block.text,
            )
            .join("\n"),
      )
      .join("\n");


  // ==========================================================
  // RETURN DOCUMENT
  // ==========================================================

  return {

    pages,

    blocks:
      allBlocks,

    plainText,
  };
}