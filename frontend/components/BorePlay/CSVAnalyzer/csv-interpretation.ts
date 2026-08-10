import type {
  AnalysisGoal,
  DatasetAnalysis,
  GoalAnalysis,
  GoalInsight,
} from "./csv-types";

function getCommonInsights(
  analysis: DatasetAnalysis
): GoalInsight[] {
  const insights: GoalInsight[] = [];

  if (analysis.missingCells === 0) {
    insights.push({
      title: "No missing values detected",
      explanation:
        "All cells in the dataset contain a value. There are no missing-value gaps to address at this stage.",
      severity: "good",
    });
  } else {
    insights.push({
      title: "Missing values detected",
      explanation:
        `${analysis.missingCells.toLocaleString()} cells are missing across ` +
        `${analysis.rowsWithMissingValues.toLocaleString()} rows. ` +
        `The appropriate response depends on which columns are affected and how the data will be used.`,
      severity: "attention",
    });
  }

  if (analysis.duplicateRows === 0) {
    insights.push({
      title: "No duplicate rows detected",
      explanation:
        "No repeated complete rows were found in the dataset.",
      severity: "good",
    });
  } else {
    insights.push({
      title: "Duplicate rows detected",
      explanation:
        `${analysis.duplicateRows.toLocaleString()} complete duplicate rows were found. ` +
        `Whether they should be removed depends on whether repeated records are expected in the source data.`,
      severity: "attention",
    });
  }

  return insights;
}

function analyzeExploration(
  analysis: DatasetAnalysis
): GoalInsight[] {
  const insights = getCommonInsights(analysis);

  const numericColumns = analysis.columnAnalysis.filter(
    (column) => column.type === "number"
  );

  const dateColumns = analysis.columnAnalysis.filter(
    (column) => column.type === "date"
  );

  insights.push({
    title: "Dataset structure",
    explanation:
      `The dataset contains ${analysis.rows.toLocaleString()} rows ` +
      `and ${analysis.columns} columns, including ` +
      `${numericColumns.length} numeric and ${dateColumns.length} date columns.`,
    severity: "info",
  });

  return insights;
}

function analyzeReporting(
  analysis: DatasetAnalysis
): GoalInsight[] {
  const insights = getCommonInsights(analysis);

  const highCardinalityColumns =
    analysis.columnAnalysis.filter((column) => {
      if (analysis.rows === 0) {
        return false;
      }

      return column.uniqueValues / analysis.rows >= 0.9;
    });

  if (highCardinalityColumns.length > 0) {
    insights.push({
      title: "Some columns have very high cardinality",
      explanation:
        `${highCardinalityColumns
          .map(
            (column) =>
              `${column.name} (${column.uniqueValues.toLocaleString()} unique)`
          )
          .join(", ")}. ` +
        "These columns may be identifiers or continuous measurements and may not be suitable for grouping or categorical charts.",
      severity: "info",
    });
  }

  if (analysis.missingCells === 0) {
    insights.push({
      title: "Complete values available for reporting",
      explanation:
        "No missing cells were detected, so there are no missing-value categories that need special treatment in the current dataset.",
      severity: "good",
    });
  }

  return insights;
}

function analyzePrediction(
  analysis: DatasetAnalysis
): GoalInsight[] {
  const insights = getCommonInsights(analysis);

  const potentialIdentifierColumns =
    analysis.columnAnalysis.filter((column) => {
      if (analysis.rows === 0) {
        return false;
      }

      const cardinalityRatio =
        column.uniqueValues / analysis.rows;

      return (
        cardinalityRatio >= 0.9 &&
        column.type === "text"
      );
    });

  if (potentialIdentifierColumns.length > 0) {
    insights.push({
      title: "Potential identifier-like columns detected",
      explanation:
        `${potentialIdentifierColumns
          .map((column) => column.name)
          .join(", ")} ` +
        "have very high uniqueness relative to the number of rows. " +
        "These may represent record identifiers rather than meaningful predictive features. Verify their role before modeling.",
      severity: "info",
    });
  }

  if (analysis.missingCells === 0) {
    insights.push({
      title: "No missing values detected in the current data",
      explanation:
        "The dataset contains no missing cells. This removes one common preprocessing consideration, although other modeling checks are still required.",
      severity: "good",
    });
  }

  if (analysis.duplicateRows > 0) {
    insights.push({
      title: "Review duplicate rows before modeling",
      explanation:
        "Repeated observations can affect training and evaluation depending on how the dataset is split. Investigate whether the duplicates represent valid repeated records.",
      severity: "attention",
    });
  }

  return insights;
}

function analyzeMerging(
  analysis: DatasetAnalysis
): GoalInsight[] {
  const insights = getCommonInsights(analysis);

  const potentialKeyColumns =
    analysis.columnAnalysis.filter((column) => {
      return (
        column.nullCount === 0 &&
        column.uniqueValues > 1
      );
    });

  if (potentialKeyColumns.length > 0) {
    insights.push({
      title: "Several columns could potentially participate in a join",
      explanation:
        `${potentialKeyColumns
          .slice(0, 8)
          .map((column) => column.name)
          .join(", ")} ` +
        "contain no missing values and have multiple distinct values. " +
        "This does not mean they are join keys. Verify the intended key and its uniqueness against the other dataset.",
      severity: "info",
    });
  }

  if (analysis.missingCells > 0) {
    insights.push({
      title: "Missing values should be reviewed before joining",
      explanation:
        "If the intended join key contains missing values, those records may not match another dataset. The analyzer cannot determine the intended join key automatically.",
      severity: "attention",
    });
  }

  return insights;
}

export function interpretForGoal(
  analysis: DatasetAnalysis,
  goal: AnalysisGoal
): GoalAnalysis {
  let insights: GoalInsight[];

  switch (goal) {
    case "reporting":
      insights = analyzeReporting(analysis);
      break;

    case "prediction":
      insights = analyzePrediction(analysis);
      break;

    case "merging":
      insights = analyzeMerging(analysis);
      break;

    case "exploration":
    default:
      insights = analyzeExploration(analysis);
      break;
  }

  return {
    goal,
    insights,
  };
}