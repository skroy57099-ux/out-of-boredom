// components/BorePlay/ResumeAnalyzer/ir/reading-order.ts

import type {
  DocumentBlockIR,
  ReadingOrderItem,
  ResumeDocumentIR,
} from "./types";


// ============================================================
// READING ORDER
// ============================================================
//
// Layer 2 of the resume pipeline.
//
// Input:
//   Raw document blocks with coordinates.
//
// Output:
//   A layout-aware reading order.
//
// IMPORTANT:
//
// This function does NOT decide:
//
// - Experience
// - Projects
// - Certifications
// - Education
// - Skills
//
// It only answers:
//
// "In what order should these physical document blocks
//  be presented to the semantic understanding layer?"
//
// ============================================================


// ============================================================
// CONFIGURATION
// ============================================================

const Y_TOLERANCE = 4;

const COLUMN_GAP_TOLERANCE = 12;


// ============================================================
// TYPES
// ============================================================

interface BlockWithPosition
  extends DocumentBlockIR {
  sourceIndex: number;
}


// ============================================================
// HELPERS
// ============================================================

function verticalDistance(
  a: DocumentBlockIR,
  b: DocumentBlockIR,
): number {

  const aTop = a.bbox.y;

  const bTop = b.bbox.y;

  return Math.abs(
    aTop - bTop,
  );
}


function horizontalDistance(
  a: DocumentBlockIR,
  b: DocumentBlockIR,
): number {

  return Math.abs(
    a.bbox.x - b.bbox.x,
  );
}


function rightEdge(
  block: DocumentBlockIR,
): number {

  return (
    block.bbox.x +
    block.bbox.width
  );
}


function overlapsVertically(
  a: DocumentBlockIR,
  b: DocumentBlockIR,
): boolean {

  const aTop =
    a.bbox.y;

  const aBottom =
    a.bbox.y +
    a.bbox.height;

  const bTop =
    b.bbox.y;

  const bBottom =
    b.bbox.y +
    b.bbox.height;


  return (
    aTop <= bBottom &&
    bTop <= aBottom
  );
}


// ============================================================
// DETECT POSSIBLE COLUMN RELATIONSHIP
// ============================================================
//
// We do NOT permanently classify the page as:
//
// "two-column"
//
// because real resumes can contain:
//
// - full-width header
// - two-column body
// - full-width footer
//
// Instead we compare blocks locally.
//
// ============================================================

function isLikelySameRow(
  a: DocumentBlockIR,
  b: DocumentBlockIR,
): boolean {

  return (
    verticalDistance(
      a,
      b,
    ) <=
    Math.max(
      Y_TOLERANCE,
      Math.min(
        a.bbox.height,
        b.bbox.height,
      ),
    )
  );
}


function isLikelySeparateColumn(
  a: DocumentBlockIR,
  b: DocumentBlockIR,
): boolean {

  if (
    !overlapsVertically(
      a,
      b,
    )
  ) {
    return false;
  }


  const gap =
    Math.max(
      a.bbox.x,
      b.bbox.x,
    ) -
    Math.min(
      rightEdge(a),
      rightEdge(b),
    );


  return (
    gap >=
    COLUMN_GAP_TOLERANCE
  );
}


// ============================================================
// SINGLE PAGE ORDERING
// ============================================================
//
// Strategy:
//
// 1. Preserve original extraction information.
// 2. Group blocks approximately by vertical position.
// 3. Within a visual row, read left → right.
// 4. Avoid aggressively reordering blocks that do not clearly
//    belong to the same visual row.
//
// This is deliberately conservative.
//
// ============================================================

function orderPageBlocks(
  blocks: BlockWithPosition[],
): BlockWithPosition[] {

  const remaining =
    blocks
      .slice()
      .sort(
        (
          a,
          b,
        ) => {

          if (
            a.bbox.y !==
            b.bbox.y
          ) {

            return (
              b.bbox.y -
              a.bbox.y
            );
          }


          return (
            a.bbox.x -
            b.bbox.x
          );
        },
      );


  const result:
    BlockWithPosition[] = [];


  while (
    remaining.length >
    0
  ) {

    const first =
      remaining.shift()!;


    const row:
      BlockWithPosition[] = [
        first,
      ];


    const compatible:
      BlockWithPosition[] = [];


    for (
      const candidate of
      remaining
    ) {

      if (
        isLikelySameRow(
          first,
          candidate,
        )
      ) {

        compatible.push(
          candidate,
        );
      }
    }


    for (
      const candidate of
      compatible
    ) {

      const index =
        remaining.indexOf(
          candidate,
        );


      if (
        index >=
        0
      ) {

        remaining.splice(
          index,
          1,
        );

        row.push(
          candidate,
        );
      }
    }


    row.sort(
      (
        a,
        b,
      ) => {

        return (
          a.bbox.x -
          b.bbox.x
        );
      },
    );


    result.push(
      ...row,
    );
  }


  return result;
}


// ============================================================
// PAGE ORDER
// ============================================================

function buildPageReadingOrder(
  blocks: DocumentBlockIR[],
): BlockWithPosition[] {

  const blocksWithPosition =
    blocks.map(
      (
        block,
        sourceIndex,
      ) => ({
        ...block,

        sourceIndex,
      }),
    );


  return orderPageBlocks(
    blocksWithPosition,
  );
}


// ============================================================
// COMPLETE READING ORDER
// ============================================================

export function buildReadingOrder(
  document: ResumeDocumentIR,
): ResumeDocumentIR {

  const orderedBlocks:
    BlockWithPosition[] = [];


  // ----------------------------------------------------------
  // Process one page at a time.
  // ----------------------------------------------------------

  for (
    const page of
    document.pages
  ) {

    const pageBlocks =
      document.blocks.filter(
        (block) =>
          block.page ===
          page.page,
      );


    const orderedPage =
      buildPageReadingOrder(
        pageBlocks,
      );


    orderedBlocks.push(
      ...orderedPage,
    );
  }


  // ----------------------------------------------------------
  // Assign global reading positions.
  // ----------------------------------------------------------

  const readingOrder:
    ReadingOrderItem[] =
    orderedBlocks.map(
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
    );


  // ----------------------------------------------------------
  // Update blocks with their
  // layout-aware reading position.
  // ----------------------------------------------------------

  const positionMap =
    new Map<
      string,
      number
    >();


  for (
    const item of
    readingOrder
  ) {

    positionMap.set(
      item.blockId,
      item.position,
    );
  }


  const updatedBlocks =
    document.blocks.map(
      (block) => ({
        ...block,

        readingOrder:
          positionMap.get(
            block.id,
          ) ??
          null,
      }),
    );


  return {
    ...document,

    blocks:
      updatedBlocks,

    readingOrder,
  };
}


// ============================================================
// DEBUG REPRESENTATION
// ============================================================
//
// Useful for inspecting the result without changing the UI.
//
// ============================================================

export function getReadingOrderPreview(
  document: ResumeDocumentIR,
) {

  return document.readingOrder.map(
    (item) => {

      const block =
        document.blocks.find(
          (candidate) =>
            candidate.id ===
            item.blockId,
        );


      return {
        position:
          item.position,

        blockId:
          item.blockId,

        page:
          item.page,

        text:
          block?.text ??
          "",

        x:
          block?.bbox.x ??
          null,

        y:
          block?.bbox.y ??
          null,

        width:
          block?.bbox.width ??
          null,

        height:
          block?.bbox.height ??
          null,
      };
    },
  );
}