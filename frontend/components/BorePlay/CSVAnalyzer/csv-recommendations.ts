import type {
  AnalysisGoal,
  DatasetAnalysis,
  GoalRecommendation,
} from "./csv-types";

function getMissingValueRecommendation(
  analysis: DatasetAnalysis,
  goal: AnalysisGoal
): GoalRecommendation | null {
  if (analysis.missingCells === 0) {
    return null;
  }

  const columnsWithMissingValues =
    analysis.columnAnalysis.filter(
      (column) => column.nullCount > 0
    );

  const columnNames = columnsWithMissingValues
    .map((column) => column.name)
    .slice(0, 6);

  if (goal === "prediction") {
    return {
      id: "prediction-missing-values",
      priority: "high",
      title: "Review missing values before modeling",
      problem:
        `${analysis.missingCells.toLocaleString()} missing cells were detected across ` +
        `${analysis.rowsWithMissingValues.toLocaleString()} rows.`,
      action:
        "Inspect the affected columns and choose an appropriate preprocessing strategy such as removal, imputation, or feature exclusion.",
      reasoning:
        "Machine-learning workflows generally require a deliberate strategy for missing values. The correct treatment depends on the affected column and the modeling objective.",
      columns: columnNames,
    };
  }

  if (goal === "merging") {
    return {
      id: "merging-missing-values",
      priority: "high",
      title: "Review missing values before joining",
      problem:
        `${analysis.missingCells.toLocaleString()} missing cells were detected.`,
      action:
        "Verify whether the intended join key contains missing values before performing the join.",
      reasoning:
        "A missing value in an actual join key can prevent a record from matching another dataset. The analyzer cannot determine the intended join key automatically.",
      columns: columnNames,
    };
  }

  if (goal === "reporting") {
    return {
      id: "reporting-missing-values",
      priority: "review",
      title: "Review missing values for reporting",
      problem:
        `${analysis.missingCells.toLocaleString()} missing cells were detected across the dataset.`,
      action:
        "Decide how missing values should appear in reports, filters, and visualizations.",
      reasoning:
        "Missing values can create blank categories or incomplete aggregations. Whether they require correction depends on the reporting context.",
      columns: columnNames,
    };
  }

  return {
    id: "exploration-missing-values",
    priority: "review",
    title: "Investigate missing values",
    problem:
      `${analysis.missingCells.toLocaleString()} missing cells were detected.`,
    action:
      "Inspect which columns contain missing values and investigate why those values are absent.",
    reasoning:
      "Understanding the source of missing data is useful before drawing conclusions from the dataset.",
    columns: columnNames,
  };
}

function getDuplicateRecommendation(
  analysis: DatasetAnalysis,
  goal: AnalysisGoal
): GoalRecommendation | null {
  if (analysis.duplicateRows === 0) {
    return null;
  }

  if (goal === "prediction") {
    return {
      id: "prediction-duplicates",
      priority: "high",
      title: "Review duplicate rows before modeling",
      problem:
        `${analysis.duplicateRows.toLocaleString()} complete duplicate rows were detected.`,
      action:
        "Determine whether the repeated rows represent valid repeated observations or accidental duplication.",
      reasoning:
        "Duplicate observations can affect model training and evaluation depending on how the data is split.",
    };
  }

  if (goal === "reporting") {
    return {
      id: "reporting-duplicates",
      priority: "review",
      title: "Review duplicate records before reporting",
      problem:
        `${analysis.duplicateRows.toLocaleString()} duplicate rows were detected.`,
      action:
        "Verify whether these repeated rows represent legitimate records before aggregating the data.",
      reasoning:
        "Unintended duplicates can cause counts and totals to be overstated.",
    };
  }

  if (goal === "merging") {
    return {
      id: "merging-duplicates",
      priority: "high",
      title: "Review duplicates before joining",
      problem:
        `${analysis.duplicateRows.toLocaleString()} complete duplicate rows were detected.`,
      action:
        "Verify whether the duplicates are expected before using the dataset in a join.",
      reasoning:
        "Repeated records can contribute to unexpected row multiplication after joins.",
    };
  }

  return {
    id: "exploration-duplicates",
    priority: "review",
    title: "Investigate duplicate rows",
    problem:
      `${analysis.duplicateRows.toLocaleString()} complete duplicate rows were detected.`,
    action:
      "Determine whether the duplicates are legitimate observations or accidental copies.",
    reasoning:
      "Duplicate records may affect exploratory summaries and should be understood before interpreting the data.",
  };
}

function getIdentifierRecommendations(
  analysis: DatasetAnalysis,
  goal: AnalysisGoal
): GoalRecommendation[] {
  const identifierLikeColumns =
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

  if (identifierLikeColumns.length === 0) {
    return [];
  }

  const names = identifierLikeColumns.map(
    (column) => column.name
  );

  if (goal === "prediction") {
    return [
      {
        id: "prediction-identifiers",
        priority: "high",
        title: "Review identifier-like columns before modeling",
        problem:
          `${names.join(", ")} have very high uniqueness relative to the number of rows.`,
        action:
          "Verify whether these columns represent meaningful predictive information or simply identify records.",
        reasoning:
          "Identifier-like fields often describe record identity rather than a measurable characteristic. Their usefulness depends on the modeling problem, so the analyzer does not automatically remove them.",
        columns: names,
      },
    ];
  }

  if (goal === "reporting") {
    return [
      {
        id: "reporting-identifiers",
        priority: "info",
        title: "Use identifier-like columns carefully in reports",
        problem:
          `${names.join(", ")} contain very high numbers of unique values.`,
        action:
          "Treat these columns primarily as identifiers unless there is a reporting reason to group by them.",
        reasoning:
          "Highly unique fields can create large numbers of categories and may not produce useful aggregations or visualizations.",
        columns: names,
      },
    ];
  }

  if (goal === "merging") {
    return [
      {
        id: "merging-identifiers",
        priority: "review",
        title: "Review identifier-like columns as possible join candidates",
        problem:
          `${names.join(", ")} have high uniqueness and may represent record identifiers.`,
        action:
          "Compare these columns with the other dataset and verify that the intended join key has compatible values and the expected uniqueness.",
        reasoning:
          "High uniqueness can be useful for identifying records, but the analyzer cannot determine which column is the correct join key without seeing the other dataset.",
        columns: names,
      },
    ];
  }

  return [
    {
      id: "exploration-identifiers",
      priority: "info",
      title: "Review highly unique columns",
      problem:
        `${names.join(", ")} contain very high numbers of unique values.`,
      action:
        "Determine whether these columns represent identifiers, free text, or meaningful attributes.",
      reasoning:
        "High cardinality can have different meanings depending on the column's role in the dataset.",
      columns: names,
    },
  ];
}

function getConstantColumnRecommendation(
  analysis: DatasetAnalysis,
  goal: AnalysisGoal
): GoalRecommendation | null {
  const constantColumns =
    analysis.columnAnalysis.filter(
      (column) =>
        analysis.rows > 0 &&
        column.uniqueValues === 1
    );

  if (constantColumns.length === 0) {
    return null;
  }

  const names = constantColumns.map(
    (column) => column.name
  );

  if (goal === "prediction") {
    return {
      id: "prediction-constant-columns",
      priority: "high",
      title: "Review constant columns before modeling",
      problem:
        `${names.join(", ")} contain only one unique value.`,
      action:
        "Verify whether these columns provide any useful variation for the modeling task.",
      reasoning:
        "A column with no variation cannot distinguish observations within this dataset.",
      columns: names,
    };
  }

  return {
    id: `${goal}-constant-columns`,
    priority: "review",
    title: "Review constant columns",
    problem:
      `${names.join(", ")} contain only one unique value.`,
    action:
      "Verify whether these columns are intentionally constant or were included accidentally.",
    reasoning:
      "A constant column contains no variation in the current dataset and therefore provides limited analytical information.",
    columns: names,
  };
}

export function getRecommendations(
  analysis: DatasetAnalysis,
  goal: AnalysisGoal
): GoalRecommendation[] {
  const recommendations: GoalRecommendation[] = [];

  const missingRecommendation =
    getMissingValueRecommendation(
      analysis,
      goal
    );

  if (missingRecommendation) {
    recommendations.push(
      missingRecommendation
    );
  }

  const duplicateRecommendation =
    getDuplicateRecommendation(
      analysis,
      goal
    );

  if (duplicateRecommendation) {
    recommendations.push(
      duplicateRecommendation
    );
  }

  recommendations.push(
    ...getIdentifierRecommendations(
      analysis,
      goal
    )
  );

  const constantRecommendation =
    getConstantColumnRecommendation(
      analysis,
      goal
    );

  if (constantRecommendation) {
    recommendations.push(
      constantRecommendation
    );
  }

  const priorityOrder: Record<
    GoalRecommendation["priority"],
    number
  > = {
    critical: 0,
    high: 1,
    review: 2,
    info: 3,
  };

  return recommendations.sort(
    (a, b) =>
      priorityOrder[a.priority] -
      priorityOrder[b.priority]
  );
}