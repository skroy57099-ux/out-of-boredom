export type CSVRow = Record<string, string>;

export type ColumnType = "number" | "date" | "text";

export type NumericStatistics = {
  count: number;
  mean: number;
  median: number;
  min: number;
  max: number;
  standardDeviation: number;
};

export type ColumnValueFrequency = {
  value: string;
  count: number;
  percentage: number;
};

export type ColumnAnalysis = {
  name: string;
  type: ColumnType;

  nullCount: number;
  nullPercentage: number;

  uniqueValues: number;
  uniquePercentage: number;

  totalValues: number;

  statistics?: NumericStatistics;

  dateRange?: {
    earliest: string;
    latest: string;
  };

  topValues?: ColumnValueFrequency[];
};


export type DatasetAnalysis = {
  rows: number;
  columns: number;
  totalCells: number;

  missingCells: number;
  missingCellPercentage: number;

  rowsWithMissingValues: number;
  rowsWithMissingValuesPercentage: number;

  duplicateRows: number;
  duplicateRowsPercentage: number;

  columnsWithMissingValues: number;

  columnAnalysis: ColumnAnalysis[];
};

export type ParsedDataset = {
  fileName: string;
  fileSize: number;
  headers: string[];
  rows: CSVRow[];
};

/* -------------------------------- */
/* Goal-driven analysis             */
/* -------------------------------- */

export type AnalysisGoal =
  | "exploration"
  | "reporting"
  | "prediction"
  | "merging";

export type GoalOption = {
  id: AnalysisGoal;
  title: string;
  description: string;
};

export type InterpretationSeverity =
  | "info"
  | "attention"
  | "good";

export type GoalInsight = {
  title: string;
  explanation: string;
  severity: InterpretationSeverity;
};

export type GoalAnalysis = {
  goal: AnalysisGoal;
  insights: GoalInsight[];
};
export type RecommendationPriority =
  | "critical"
  | "high"
  | "review"
  | "info";

export type GoalRecommendation = {
  id: string;
  priority: RecommendationPriority;
  title: string;
  problem: string;
  action: string;
  reasoning: string;
  columns?: string[];
};