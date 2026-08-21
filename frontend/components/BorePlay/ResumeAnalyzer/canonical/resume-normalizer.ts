// components/BorePlay/ResumeAnalyzer/canonical/resume-normalizer.ts

import type {
  ResumeDocumentIR,
  ResumeSectionIR,
  ResumeEntryIR,
  ResumeFieldIR,
} from "../ir/types";

import type {
  StructuredResume,
  CanonicalContact,
  CanonicalExperience,
  CanonicalProject,
  CanonicalEducation,
  CanonicalCertification,
  CanonicalPublication,
  CanonicalEvidence,
} from "./resume-schema";


// ============================================================
// CANONICALIZER
// ============================================================
//
// IMPORTANT:
//
// This file does NOT understand resume layout.
//
// It does NOT:
//
// - discover sections
// - discover entries
// - merge entries
// - create entries
// - move blocks
// - invent fields
// - generate descriptions
// - duplicate evidence
//
// Those decisions have already happened:
//
// Layout
//   ↓
// Section Discovery
//   ↓
// Entry Discovery
//   ↓
// Field Extraction
//   ↓
// THIS FILE
//
// This layer simply converts the IR into the schema expected
// by the application.
//
// ============================================================


// ============================================================
// HELPERS
// ============================================================

function fieldValue(
  entry: ResumeEntryIR,
  name: string,
): string | null {

  const field =
    entry.fields.find(
      (
        item,
      ) =>
        item.name
          .trim()
          .toLowerCase() ===
        name
          .trim()
          .toLowerCase(),
    );


  return field?.value ??
    null;
}


function fieldValues(
  entry: ResumeEntryIR,
  name: string,
): string[] {

  return entry.fields
    .filter(
      (
        field,
      ) =>
        field.name
          .trim()
          .toLowerCase() ===
        name
          .trim()
          .toLowerCase(),
    )
    .map(
      (
        field,
      ) =>
        field.value,
    )
    .filter(
      (
        value,
      ): value is string =>
        typeof value ===
          "string" &&
        value.trim().length >
          0,
    );
}


function evidenceIds(
  entry: ResumeEntryIR,
  names?: string[],
): string[] {

  const fields =
    names
      ? entry.fields.filter(
          (
            field,
          ) =>
            names.some(
              (
                name,
              ) =>
                field.name
                  .trim()
                  .toLowerCase() ===
                name
                  .trim()
                  .toLowerCase(),
            ),
        )
      : entry.fields;


  return Array.from(
    new Set(
      fields.flatMap(
        (
          field,
        ) =>
          field.blockIds,
      ),
    ),
  );
}


function allEntryEvidenceIds(
  entry: ResumeEntryIR,
): string[] {

  return Array.from(
    new Set(
      entry.blockIds,
    ),
  );
}


function normalizeString(
  value: string | null,
): string | null {

  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }


  const normalized =
    value
      .replace(
        /\s+/g,
        " ",
      )
      .trim();


  return normalized ||
    null;
}


// ============================================================
// SECTION CLASSIFICATION
// ============================================================
//
// We use the semantic classification already produced by
// Section Discovery.
//
// This is NOT section discovery.
//
// We do not inspect raw text looking for "Experience",
// "Projects", etc.
//
// ============================================================

function sectionType(
  section: ResumeSectionIR,
): string {

  return section
    .semanticClassification
    .label
    .trim()
    .toLowerCase();
}


// ============================================================
// CONTACT
// ============================================================
//
// Contact information may be represented by fields discovered
// during the field-extraction stage.
//
// We do not scan the raw document here.
//
// ============================================================

function buildContact(
  document: ResumeDocumentIR,
): CanonicalContact {

  const contact: CanonicalContact = {

    name:
      null,

    email:
      null,

    phone:
      null,

    location:
      null,

    linkedin:
      null,

    github:
      null,

    portfolio:
      null,

    otherLinks:
      [],
  };


  // ----------------------------------------------------------
  // Contact data may be represented as fields in entries.
  //
  // Search only fields already discovered by the IR.
  // ----------------------------------------------------------

  for (
    const section of
    document.sections
  ) {

    for (
      const entry of
      section.entries
    ) {

      for (
        const field of
        entry.fields
      ) {

        const name =
          field.name
            .trim()
            .toLowerCase();

        const value =
          normalizeString(
            field.value,
          );


        if (!value) {
          continue;
        }


        switch (name) {

          case "name":
          case "person_name":

            if (
              contact.name ===
              null
            ) {
              contact.name =
                value;
            }

            break;


          case "email":
          case "email_address":

            if (
              contact.email ===
              null
            ) {
              contact.email =
                value;
            }

            break;


          case "phone":
          case "phone_number":

            if (
              contact.phone ===
              null
            ) {
              contact.phone =
                value;
            }

            break;


          case "location":
          case "address":

            if (
              contact.location ===
              null
            ) {
              contact.location =
                value;
            }

            break;


          case "linkedin":

            if (
              contact.linkedin ===
              null
            ) {
              contact.linkedin =
                value;
            }

            break;


          case "github":

            if (
              contact.github ===
              null
            ) {
              contact.github =
                value;
            }

            break;


          case "portfolio":
          case "website":

            if (
              contact.portfolio ===
              null
            ) {
              contact.portfolio =
                value;
            }

            break;


          case "other_link":
          case "other_links":

            if (
              !contact.otherLinks.includes(
                value,
              )
            ) {
              contact.otherLinks.push(
                value,
              );
            }

            break;
        }
      }
    }
  }


  return contact;
}


// ============================================================
// EXPERIENCE
// ============================================================

function buildExperience(
  section: ResumeSectionIR,
): CanonicalExperience[] {

  return section.entries.map(
    (
      entry,
    ) => {

      const bullets =
        fieldValues(
          entry,
          "bullet",
        )
          .map(
            (
              value,
            ) =>
              normalizeString(
                value,
              ),
          )
          .filter(
            (
              value,
            ): value is string =>
              value !== null,
          );


      return {

        id:
          entry.id,

        company:
          normalizeString(
            fieldValue(
              entry,
              "company",
            ),
          ),

        title:
          normalizeString(
            fieldValue(
              entry,
              "title",
            ),
          ),

        location:
          normalizeString(
            fieldValue(
              entry,
              "location",
            ),
          ),

        startDate:
          normalizeString(
            fieldValue(
              entry,
              "start_date",
            ),
          ),

        endDate:
          normalizeString(
            fieldValue(
              entry,
              "end_date",
            ),
          ),

        type:
          normalizeExperienceType(
            fieldValue(
              entry,
              "entry_type",
            ),
          ),

        bullets,

        evidenceIds:
          evidenceIds(
            entry,
          ),
      };
    },
  );
}


// ============================================================
// EXPERIENCE TYPE
// ============================================================

function normalizeExperienceType(
  value: string | null,
): CanonicalExperience["type"] {

  if (!value) {
    return "unknown";
  }


  const normalized =
    value
      .trim()
      .toLowerCase();


  switch (
    normalized
  ) {

    case "employment":
    case "employee":
    case "job":

      return "employment";


    case "internship":
    case "intern":

      return "internship";


    case "training":
    case "trainee":

      return "training";


    case "contract":
    case "contractor":

      return "contract";


    case "freelance":
    case "freelancer":

      return "freelance";


    default:

      return "unknown";
  }
}


// ============================================================
// PROJECTS
// ============================================================

function buildProjects(
  section: ResumeSectionIR,
): CanonicalProject[] {

  return section.entries.map(
    (
      entry,
    ) => {

      const bullets =
        fieldValues(
          entry,
          "bullet",
        )
          .map(
            (
              value,
            ) =>
              normalizeString(
                value,
              ),
          )
          .filter(
            (
              value,
            ): value is string =>
              value !== null,
          );


      const technologies =
        fieldValues(
          entry,
          "technologies",
        )
          .flatMap(
            (
              value,
            ) =>
              value
                .split(
                  /[,|;]/,
                )
                .map(
                  (
                    item,
                  ) =>
                    item.trim(),
                )
                .filter(Boolean),
          );


      return {

        id:
          entry.id,

        title:
          normalizeString(
            fieldValue(
              entry,
              "project_title",
            ),
          ),

        technologies:
          Array.from(
            new Set(
              technologies,
            ),
          ),

        description:
          normalizeString(
            fieldValue(
              entry,
              "description",
            ),
          ),

        bullets,

        dates:
          normalizeString(
            fieldValue(
              entry,
              "dates",
            ),
          ),

        evidenceIds:
          evidenceIds(
            entry,
          ),
      };
    },
  );
}


// ============================================================
// EDUCATION
// ============================================================

function buildEducation(
  section: ResumeSectionIR,
): CanonicalEducation[] {

  return section.entries.map(
    (
      entry,
    ) => ({

      id:
        entry.id,

      institution:
        normalizeString(
          fieldValue(
            entry,
            "institution",
          ),
        ),

      degree:
        normalizeString(
          fieldValue(
            entry,
            "degree",
          ),
        ),

      field:
        normalizeString(
          fieldValue(
            entry,
            "field_of_study",
          ),
        ),

      location:
        normalizeString(
          fieldValue(
            entry,
            "location",
          ),
        ),

      startDate:
        normalizeString(
          fieldValue(
            entry,
            "start_date",
          ),
        ),

      endDate:
        normalizeString(
          fieldValue(
            entry,
            "end_date",
          ),
        ),

      grade:
        normalizeString(
          fieldValue(
            entry,
            "grade",
          ),
        ),

      evidenceIds:
        evidenceIds(
          entry,
        ),
    }),
  );
}


// ============================================================
// CERTIFICATIONS
// ============================================================

function buildCertifications(
  section: ResumeSectionIR,
): CanonicalCertification[] {

  return section.entries.map(
    (
      entry,
    ) => ({

      id:
        entry.id,

      name:
        normalizeString(
          fieldValue(
            entry,
            "certification_name",
          ),
        ),

      issuer:
        normalizeString(
          fieldValue(
            entry,
            "issuer",
          ),
        ),

      date:
        normalizeString(
          fieldValue(
            entry,
            "date",
          ),
        ),

      description:
        normalizeString(
          fieldValue(
            entry,
            "description",
          ),
        ),

      evidenceIds:
        evidenceIds(
          entry,
        ),
    }),
  );
}


// ============================================================
// PUBLICATIONS
// ============================================================

function buildPublications(
  section: ResumeSectionIR,
): CanonicalPublication[] {

  return section.entries.map(
    (
      entry,
    ) => ({

      id:
        entry.id,

      title:
        normalizeString(
          fieldValue(
            entry,
            "publication_title",
          ),
        ),

      authorship:
        normalizeString(
          fieldValue(
            entry,
            "authorship",
          ),
        ),

      venue:
        normalizeString(
          fieldValue(
            entry,
            "venue",
          ),
        ),

      date:
        normalizeString(
          fieldValue(
            entry,
            "date",
          ),
        ),

      identifier:
        normalizeString(
          fieldValue(
            entry,
            "identifier",
          ),
        ),

      evidenceIds:
        evidenceIds(
          entry,
        ),
    }),
  );
}


// ============================================================
// SKILLS
// ============================================================
//
// Skills are fields discovered by the field extractor.
//
// We do NOT scan text for skill keywords here.
//
// ============================================================

function buildSkills(
  document: ResumeDocumentIR,
): string[] {

  const skills:
    string[] = [];


  for (
    const section of
    document.sections
  ) {

    for (
      const entry of
      section.entries
    ) {

      for (
        const field of
        entry.fields
      ) {

        const name =
          field.name
            .trim()
            .toLowerCase();


        if (
          name !==
            "skill" &&
          name !==
            "skills" &&
          name !==
            "technology" &&
          name !==
            "technologies"
        ) {
          continue;
        }


        const values =
          field.value
            ?.split(
              /[,|;]/,
            )
            .map(
              (
                value,
              ) =>
                value.trim(),
            )
            .filter(Boolean) ??
          [];


        for (
          const value of
          values
        ) {

          if (
            !skills.includes(
              value,
            )
          ) {

            skills.push(
              value,
            );
          }
        }
      }
    }
  }


  return skills;
}


// ============================================================
// HEADLINE
// ============================================================

function buildHeadline(
  document: ResumeDocumentIR,
): string | null {

  for (
    const section of
    document.sections
  ) {

    for (
      const entry of
      section.entries
    ) {

      const value =
        fieldValue(
          entry,
          "headline",
        );


      if (value) {
        return normalizeString(
          value,
        );
      }
    }
  }


  return null;
}


// ============================================================
// SUMMARY
// ============================================================

function buildSummary(
  document: ResumeDocumentIR,
): string | null {

  for (
    const section of
    document.sections
  ) {

    for (
      const entry of
      section.entries
    ) {

      const value =
        fieldValue(
          entry,
          "summary",
        );


      if (value) {
        return normalizeString(
          value,
        );
      }
    }
  }


  return null;
}


// ============================================================
// EVIDENCE
// ============================================================
//
// Every canonical evidence item comes directly from an original
// DocumentBlockIR.
//
// No text is generated here.
//
// ============================================================

function buildEvidence(
  document: ResumeDocumentIR,
): CanonicalEvidence[] {

  return document.blocks.map(
    (
      block,
    ) => ({

      id:
        block.id,

      text:
        block.text,

      page:
        block.page,

      x:
        block.bbox.x,

      y:
        block.bbox.y,

      width:
        block.bbox.width,

      height:
        block.bbox.height,
    }),
  );
}


// ============================================================
// FIND SECTION
// ============================================================

function findSection(
  document: ResumeDocumentIR,
  acceptedTypes: string[],
): ResumeSectionIR | null {

  for (
    const section of
    document.sections
  ) {

    const type =
      sectionType(
        section,
      );


    if (
      acceptedTypes.includes(
        type,
      )
    ) {

      return section;
    }
  }


  return null;
}


// ============================================================
// FIND ALL SECTIONS
// ============================================================

function findSections(
  document: ResumeDocumentIR,
  acceptedTypes: string[],
): ResumeSectionIR[] {

  return document.sections.filter(
    (
      section,
    ) =>
      acceptedTypes.includes(
        sectionType(
          section,
        ),
      ),
  );
}


// ============================================================
// CANONICALIZE
// ============================================================

export function normalizeToCanonical(
  document: ResumeDocumentIR,
): StructuredResume {

  const experienceSections =
    findSections(
      document,
      [
        "work_history",
        "experience",
        "employment",
        "internship",
        "training",
      ],
    );


  const projectSections =
    findSections(
      document,
      [
        "projects",
        "project",
      ],
    );


  const educationSections =
    findSections(
      document,
      [
        "education",
        "academic",
        "academics",
      ],
    );


  const certificationSections =
    findSections(
      document,
      [
        "certifications",
        "certification",
        "professional_certifications",
      ],
    );


  const publicationSections =
    findSections(
      document,
      [
        "publications",
        "publication",
        "research",
      ],
    );


  const experience =
    experienceSections.flatMap(
      (
        section,
      ) =>
        buildExperience(
          section,
        ),
    );


  const projects =
    projectSections.flatMap(
      (
        section,
      ) =>
        buildProjects(
          section,
        ),
    );


  const education =
    educationSections.flatMap(
      (
        section,
      ) =>
        buildEducation(
          section,
        ),
    );


  const certifications =
    certificationSections.flatMap(
      (
        section,
      ) =>
        buildCertifications(
          section,
        ),
    );


  const publications =
    publicationSections.flatMap(
      (
        section,
      ) =>
        buildPublications(
          section,
        ),
    );


  return {

    contact:
      buildContact(
        document,
      ),

    headline:
      buildHeadline(
        document,
      ),

    summary:
      buildSummary(
        document,
      ),

    skills:
      buildSkills(
        document,
      ),

    experience,

    projects,

    education,

    certifications,

    publications,

    evidence:
      buildEvidence(
        document,
      ),
  };
}