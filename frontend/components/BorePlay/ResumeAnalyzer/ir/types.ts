// components/BorePlay/ResumeAnalyzer/ir/types.ts

// ============================================================
// RESUME INTERMEDIATE REPRESENTATION
// ============================================================
//
// This is the central contract of the Resume Analyzer.
//
// IMPORTANT:
//
// This layer does NOT know anything about the frontend.
//
// It exists to preserve:
//
// - page layout
// - reading order
// - section boundaries
// - entry boundaries
// - source block IDs
// - provenance
// - confidence
// - uncertainty
// - ownership
//
// The canonical resume comes AFTER this layer.
//
// ============================================================


// ============================================================
// BASIC TYPES
// ============================================================

export type SemanticSectionType =
  | "contact"
  | "summary"
  | "work_history"
  | "training"
  | "projects"
  | "education"
  | "skills"
  | "certifications"
  | "publications"
  | "awards"
  | "volunteering"
  | "languages"
  | "interests"
  | "other"
  | "unknown";


export type ConfidenceStatus =
  | "confirmed"
  | "probable"
  | "ambiguous"
  | "unknown";


export type BlockOwnershipStatus =
  | "unassigned"
  | "section_owned"
  | "entry_owned"
  | "ambiguous"
  | "orphan";


export type ExtractionStage =
  | "layout"
  | "reading_order"
  | "section_discovery"
  | "entry_discovery"
  | "field_extraction"
  | "canonicalization";


// ============================================================
// GEOMETRY
// ============================================================

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}


// ============================================================
// PROVENANCE
// ============================================================

export interface Provenance {
  blockIds: string[];

  pageNumbers: number[];

  sourceText: string;

  extractionStage: ExtractionStage;

  confidence: number;

  status: ConfidenceStatus;
}


// ============================================================
// DOCUMENT BLOCK
// ============================================================
//
// This represents text that physically exists in the source
// document.
//
// NO semantic assumptions belong here.
//
// ============================================================

export interface DocumentBlockIR {
  id: string;

  page: number;

  text: string;

  bbox: BoundingBox;

  style: {
    fontSize: number | null;
    fontName: string | null;
    isBold: boolean | null;
  };

  readingOrder: number | null;

  ownership: BlockOwnership;

  provenance: Provenance;
}


// ============================================================
// BLOCK OWNERSHIP
// ============================================================

export interface OwnedBlockReference {
  sectionId: string;

  entryId: string | null;

  reason: string;

  confidence: number;
}


export interface BlockOwnership {
  status: BlockOwnershipStatus;

  references: OwnedBlockReference[];

  candidates: string[];
}


// ============================================================
// PAGE
// ============================================================

export interface DocumentPageIR {
  page: number;

  width: number;

  height: number;

  blockIds: string[];
}


// ============================================================
// READING ORDER
// ============================================================

export interface ReadingOrderItem {
  position: number;

  blockId: string;

  page: number;
}


// ============================================================
// SECTION TITLE
// ============================================================

export interface SectionTitleIR {
  text: string;

  blockIds: string[];

  confidence: number;

  provenance: Provenance;
}


// ============================================================
// SECTION
// ============================================================

export interface ResumeSectionIR {
  id: string;

  order: number;

  title: SectionTitleIR | null;

  semanticClassification: {
    label: SemanticSectionType;

    confidence: number;

    status: ConfidenceStatus;

    alternatives: Array<{
      label: SemanticSectionType;
      confidence: number;
    }>;
  };

  blockIds: string[];

  entries: ResumeEntryIR[];

  provenance: Provenance;
}


// ============================================================
// ENTRY
// ============================================================
//
// An entry is a logical unit INSIDE a section.
//
// Example:
//
// Training Experience
//   ├── Junior Software Developer
//   └── AI Solutions Trainee
//
// The entry owns its source blocks.
//
// ============================================================

export interface ResumeEntryIR {
  id: string;

  sectionId: string;

  order: number;

  blockIds: string[];

  rawText: string;

  fields: ResumeFieldIR[];

  confidence: number;

  status: ConfidenceStatus;

  provenance: Provenance;
}


// ============================================================
// FIELD
// ============================================================
//
// Fields are discovered AFTER section and entry boundaries.
//
// ============================================================

export interface ResumeFieldIR {
  id: string;

  entryId: string;

  name: string;

  value: string | null;

  blockIds: string[];

  confidence: number;

  status: ConfidenceStatus;

  provenance: Provenance;
}


// ============================================================
// DOCUMENT VALIDATION
// ============================================================

export type ValidationSeverity =
  | "info"
  | "warning"
  | "error";


export type ValidationCode =
  | "DUPLICATE_BLOCK_OWNERSHIP"
  | "ORPHAN_BLOCK"
  | "CROSS_SECTION_MOVEMENT"
  | "CONFLICTING_OWNERSHIP"
  | "DUPLICATE_EVIDENCE"
  | "UNSUPPORTED_FIELD"
  | "MISSING_PROVENANCE"
  | "INVALID_ENTRY_SECTION"
  | "INVALID_FIELD_ENTRY"
  | "INVALID_BLOCK_REFERENCE";


export interface ValidationIssue {
  code: ValidationCode;

  severity: ValidationSeverity;

  message: string;

  blockIds: string[];

  sectionIds: string[];

  entryIds: string[];
}


export interface IRValidationResult {
  valid: boolean;

  issues: ValidationIssue[];

  statistics: {
    totalPages: number;

    totalBlocks: number;

    totalSections: number;

    totalEntries: number;

    totalFields: number;

    ownedBlocks: number;

    orphanBlocks: number;

    ambiguousBlocks: number;

    duplicateEvidenceGroups: number;
  };
}


// ============================================================
// COMPLETE DOCUMENT IR
// ============================================================

export interface ResumeDocumentIR {
  documentId: string;

  pages: DocumentPageIR[];

  blocks: DocumentBlockIR[];

  readingOrder: ReadingOrderItem[];

  sections: ResumeSectionIR[];

  validation: IRValidationResult;
}