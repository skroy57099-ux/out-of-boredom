// app/api/resume/jd/parse/route.ts

import {
  parseJobDescriptionWithLLM,
} from "@/components/BorePlay/ResumeAnalyzer/jd/jd-llm-parser";

import {
  parseJobDescription,
} from "@/components/BorePlay/ResumeAnalyzer/jd/jd-parser";


// ============================================================
// POST /api/resume/jd/parse
// ============================================================
//
// Pipeline:
//
// Gemini semantic parser
//        ↓ failure
// Mistral semantic parser
//        ↓ failure
// Existing deterministic parser
//
// IMPORTANT:
// This route ONLY handles JD parsing.
//
// It does NOT touch:
//
// app/api/resume/parse/route.ts
//
// The resume parser remains completely isolated.
// ============================================================


export async function POST(
  request: Request,
) {

  try {

    const body =
      await request.json();


    const text =
      typeof body?.text ===
      "string"
        ? body.text.trim()
        : "";


    // ==========================================================
    // VALIDATION
    // ==========================================================

    if (!text) {

      return Response.json(
        {
          success: false,

          error:
            "Job description is empty.",
        },

        {
          status: 400,
        },
      );
    }


    console.log(
      "📄 JD received.",
    );


    console.log(
      `📏 JD length: ${text.length} characters`,
    );


    // ==========================================================
    // PRIMARY + FALLBACK SEMANTIC PIPELINE
    // ==========================================================

    try {

      const result =
        await parseJobDescriptionWithLLM(
          text,
        );


      const jd =
        result.jobDescription;


      // ========================================================
      // NORMALIZED SEMANTIC DATA
      // ========================================================
      //
      // IMPORTANT:
      //
      // requiredSkills and preferredSkills intentionally remain
      // as objects.
      //
      // Example:
      //
      // {
      //   skill: "Excel",
      //   subSkills: [
      //     "Pivot Tables",
      //     "XLOOKUP",
      //     "INDEX/MATCH"
      //   ],
      //   confidence: 0.98,
      //   evidence: "..."
      // }
      //
      // DO NOT flatten them to item.value.
      //
      // That was the source of the previous mismatch.
      // ========================================================


      const requiredSkills =
        Array.isArray(
          jd.requiredSkills,
        )
          ? jd.requiredSkills
          : [];


      const preferredSkills =
        Array.isArray(
          jd.preferredSkills,
        )
          ? jd.preferredSkills
          : [];


      const responsibilities =
        Array.isArray(
          jd.responsibilities,
        )
          ? jd.responsibilities
          : [];


      const qualifications =
        Array.isArray(
          jd.qualifications,
        )
          ? jd.qualifications
          : [];


      const educationRequirements =
        Array.isArray(
          jd.educationRequirements,
        )
          ? jd.educationRequirements
          : [];


      const experienceRequirements =
        Array.isArray(
          jd.experienceRequirements,
        )
          ? jd.experienceRequirements
          : [];


      const otherRelevantInfo =
        Array.isArray(
          jd.otherRelevantInfo,
        )
          ? jd.otherRelevantInfo
          : [];


      // ========================================================
      // CONFIDENCE
      // ========================================================

      const skillItems = [
        ...requiredSkills,
        ...preferredSkills,
      ];


      const regularItems = [
        ...responsibilities,
        ...qualifications,
        ...educationRequirements,
        ...experienceRequirements,
        ...otherRelevantInfo,
      ];


      const confidenceValues = [

        ...skillItems.map(
          (
            item,
          ) =>
            typeof item?.confidence ===
            "number"
              ? item.confidence
              : 0,
        ),

        ...regularItems.map(
          (
            item,
          ) =>
            typeof item?.confidence ===
            "number"
              ? item.confidence
              : 0,
        ),

      ];


      const averageConfidence =
        confidenceValues.length > 0

          ? confidenceValues.reduce(
              (
                total,
                value,
              ) =>
                total + value,

              0,
            ) /
            confidenceValues.length

          : 0;


      const confidence =
        Number(
          averageConfidence.toFixed(
            2,
          ),
        );


      // ========================================================
      // WARNINGS
      // ========================================================

      const warnings = [
        ...(result.warnings ?? []),
      ];


      if (
        requiredSkills.length ===
        0
      ) {

        warnings.push(
          "No required skills were semantically identified.",
        );
      }


      if (
        responsibilities.length ===
        0
      ) {

        warnings.push(
          "No responsibilities were semantically identified.",
        );
      }


      if (
        !jd.title
      ) {

        warnings.push(
          "Job title could not be confidently identified.",
        );
      }


      // ========================================================
      // LOGGING
      // ========================================================

      console.log(
        "✅ Semantic JD parsing completed.",
      );


      console.log(
        `🤖 Provider: ${result.provider}`,
      );


      console.log(
        `🧠 Model: ${result.model}`,
      );


      console.log(
        `📊 Core required skills: ${requiredSkills.length}`,
      );


      console.log(
        `⭐ Core preferred skills: ${preferredSkills.length}`,
      );


      console.log(
        `📋 Responsibilities: ${responsibilities.length}`,
      );


      console.log(
        `🎓 Education requirements: ${educationRequirements.length}`,
      );


      console.log(
        `💼 Experience requirements: ${experienceRequirements.length}`,
      );


      console.log(
        `🧠 Parser confidence: ${confidence}`,
      );


      if (
        warnings.length >
        0
      ) {

        console.warn(
          "⚠️ JD parser warnings:",
          warnings,
        );
      }


      // ========================================================
      // RESPONSE
      // ========================================================
      //
      // The frontend receives:
      //
      // requiredSkills: JDCoreSkill[]
      //
      // instead of:
      //
      // requiredSkills: string[]
      //
      // This preserves:
      //
      // Excel
      //   ├── Pivot Tables
      //   ├── XLOOKUP
      //   └── INDEX/MATCH
      //
      // Power BI
      //   ├── Dashboards
      //   ├── DAX
      //   └── Data Models
      //
      // ========================================================

      return Response.json({

        success:
          true,

        source:
          result.provider,

        model:
          result.model,

        jobDescription: {

          title:
            jd.title,

          company:
            jd.company,

          requiredSkills,

          preferredSkills,

          responsibilities,

          qualifications,

          educationRequirements,

          experienceRequirements,

          otherRelevantInfo,

          rawText:
            text,
        },

        confidence,

        warnings,

        evidence: {

          requiredSkills,

          preferredSkills,

          responsibilities,

          qualifications,

          educationRequirements,

          experienceRequirements,

          otherRelevantInfo,

        },

      });

    } catch (
      llmError
    ) {

      // ========================================================
      // FINAL DETERMINISTIC FALLBACK
      // ========================================================
      //
      // Gemini failed
      //        ↓
      // Mistral failed
      //        ↓
      // Existing parser
      //
      // IMPORTANT:
      //
      // We do NOT modify the deterministic parser.
      //
      // It intentionally returns:
      //
      // string[]
      //
      // rather than semantic skill objects.
      //
      // ========================================================

      console.error(
        "❌ Both semantic JD LLM pipelines failed:",
        llmError,
      );


      console.log(
        "🛟 Falling back to existing deterministic JD parser...",
      );


      const fallback =
        parseJobDescription(
          text,
        );


      console.log(
        "⚠️ Deterministic JD fallback completed.",
      );


      // ========================================================
      // FALLBACK RESPONSE
      // ========================================================
      //
      // Keep the existing fallback structure exactly as-is.
      //
      // This prevents any changes to the working deterministic
      // parser and gives the frontend a predictable response.
      //
      // ========================================================

      return Response.json({

        success:
          true,

        source:
          "deterministic-fallback",

        model:
          null,

        jobDescription: {

          title:
            fallback.jobDescription.title,

          company:
            fallback.jobDescription.company,

          requiredSkills:
            fallback.jobDescription
              .requiredSkills,

          preferredSkills:
            fallback.jobDescription
              .preferredSkills,

          responsibilities:
            fallback.jobDescription
              .responsibilities,

          qualifications:
            fallback.jobDescription
              .qualifications,

          educationRequirements:
            fallback.jobDescription
              .educationRequirements,

          experienceRequirements:
            fallback.jobDescription
              .experienceRequirements,

          rawText:
            fallback.jobDescription
              .rawText,

        },

        confidence:
          fallback.confidence,

        warnings: [

          "Gemini semantic parser failed.",

          "Mistral semantic fallback failed.",

          "Existing deterministic JD parser was used.",

          ...fallback.warnings,

        ],

        evidence: {

          requiredSkills:
            fallback.jobDescription
              .requiredSkills
              .map(
                (
                  skill,
                ) => ({
                  skill,

                  subSkills: [],

                  confidence:
                    fallback.confidence,

                  evidence:
                    skill,
                }),
              ),

          preferredSkills:
            fallback.jobDescription
              .preferredSkills
              .map(
                (
                  skill,
                ) => ({
                  skill,

                  subSkills: [],

                  confidence:
                    fallback.confidence,

                  evidence:
                    skill,
                }),
              ),

          responsibilities:
            fallback.jobDescription
              .responsibilities
              .map(
                (
                  value,
                ) => ({
                  value,

                  confidence:
                    fallback.confidence,

                  evidence:
                    value,
                }),
              ),

          qualifications:
            fallback.jobDescription
              .qualifications
              .map(
                (
                  value,
                ) => ({
                  value,

                  confidence:
                    fallback.confidence,

                  evidence:
                    value,
                }),
              ),

          educationRequirements:
            fallback.jobDescription
              .educationRequirements
              .map(
                (
                  value,
                ) => ({
                  value,

                  confidence:
                    fallback.confidence,

                  evidence:
                    value,
                }),
              ),

          experienceRequirements:
            fallback.jobDescription
              .experienceRequirements
              .map(
                (
                  value,
                ) => ({
                  value,

                  confidence:
                    fallback.confidence,

                  evidence:
                    value,
                }),
              ),

          otherRelevantInfo: [],
        },

      });
    }

  } catch (
    error
  ) {

    // ========================================================
    // ROUTE-LEVEL ERROR
    // ========================================================

    console.error(
      "❌ JD parsing route failed:",
      error,
    );


    return Response.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unknown JD parsing error.",
      },

      {
        status: 500,
      },
    );
  }
}