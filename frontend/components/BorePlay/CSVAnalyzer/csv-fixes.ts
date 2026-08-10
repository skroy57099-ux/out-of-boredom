import type { DatasetAnalysis } from "./csv-types";

export type FixCode = {
  id: string;
  title: string;
  description: string;
  code: string;
};

export function getFixes(
  analysis: DatasetAnalysis
): FixCode[] {
  const fixes: FixCode[] = [];

  // Missing values
  if (analysis.missingCells > 0) {
    fixes.push({
      id: "inspect-missing",
      title: "Inspect missing values",
      description:
        "Identify which columns contain missing values before choosing an appropriate treatment strategy.",
      code: `# Inspect missing values
missing = df.isna().sum()

print(missing[missing > 0])`,
    });
  }

  // Duplicate rows
  if (analysis.duplicateRows > 0) {
    fixes.push({
      id: "remove-duplicates",
      title: "Remove duplicate rows",
      description:
        "Remove completely duplicated rows from the dataframe.",
      code: `# Remove completely duplicated rows
df = df.drop_duplicates().copy()`,
    });
  }

  // Constant columns
  const constantColumns = analysis.columnAnalysis
    .filter((column) => column.uniqueValues <= 1)
    .map((column) => column.name);

  if (constantColumns.length > 0) {
    fixes.push({
      id: "inspect-constant-columns",
      title: "Inspect constant columns",
      description:
        "Identify columns containing no variation.",
      code: `# Find constant columns
constant_columns = [
    col
    for col in df.columns
    if df[col].nunique(dropna=False) <= 1
]

print(constant_columns)`,
    });
  }

  // Highly unique columns
  const identifierLikeColumns = analysis.columnAnalysis
    .filter((column) => {
      if (analysis.rows === 0) return false;

      const uniquenessRatio =
        column.uniqueValues / analysis.rows;

      return uniquenessRatio >= 0.95;
    })
    .map((column) => column.name);

  if (identifierLikeColumns.length > 0) {
    fixes.push({
      id: "inspect-identifiers",
      title: "Inspect identifier-like columns",
      description:
        "Review highly unique columns before using them for modeling or analysis.",
      code: `# Inspect highly unique columns
identifier_like = []

for col in df.columns:
    uniqueness_ratio = (
        df[col].nunique(dropna=False) / len(df)
    )

    if uniqueness_ratio >= 0.95:
        identifier_like.append(col)

print(identifier_like)`,
    });
  }

  return fixes;
}